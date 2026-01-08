/**
 * KAIOS Audio Recorder
 * Records audio sessions using ffmpeg for later playback and visualization
 *
 * Captures system audio and saves it with KAIOS metadata
 */

import { spawn, ChildProcess } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

// ════════════════════════════════════════════════════════════════════════════════
// TYPES
// ════════════════════════════════════════════════════════════════════════════════

export interface RecorderConfig {
  outputDir: string
  format: 'mp3' | 'wav' | 'flac'
  sampleRate: number
  channels: number
  bitrate: string
}

export interface RecordingSession {
  id: string
  startTime: number
  endTime?: number
  outputFile: string
  metadata: RecordingMetadata
}

export interface RecordingMetadata {
  title: string
  artist: string
  album: string
  emotions: string[]
  conversationId?: string
  tags: string[]
}

// ════════════════════════════════════════════════════════════════════════════════
// AUDIO RECORDER
// ════════════════════════════════════════════════════════════════════════════════

export class AudioRecorder {
  private config: RecorderConfig
  private currentSession: RecordingSession | null = null
  private ffmpegProcess: ChildProcess | null = null
  private isRecording = false

  constructor(config: Partial<RecorderConfig> = {}) {
    this.config = {
      outputDir: join(process.cwd(), 'recordings'),
      format: 'mp3',
      sampleRate: 44100,
      channels: 2,
      bitrate: '192k',
      ...config
    }

    // Ensure output directory exists
    if (!existsSync(this.config.outputDir)) {
      mkdirSync(this.config.outputDir, { recursive: true })
    }
  }

  /**
   * Check if ffmpeg is available
   */
  async checkFfmpeg(): Promise<boolean> {
    return new Promise((resolve) => {
      const proc = spawn('ffmpeg', ['-version'])
      proc.on('close', (code) => resolve(code === 0))
      proc.on('error', () => resolve(false))
    })
  }

  /**
   * Get available audio input devices (macOS)
   */
  async getAudioDevices(): Promise<string[]> {
    return new Promise((resolve) => {
      const proc = spawn('ffmpeg', ['-f', 'avfoundation', '-list_devices', 'true', '-i', '""'], {
        stdio: ['pipe', 'pipe', 'pipe']
      })

      let output = ''
      proc.stderr?.on('data', (data) => {
        output += data.toString()
      })

      proc.on('close', () => {
        const devices: string[] = []
        const lines = output.split('\n')
        let inAudioSection = false

        for (const line of lines) {
          if (line.includes('AVFoundation audio devices:')) {
            inAudioSection = true
            continue
          }
          if (inAudioSection && line.includes('[')) {
            const match = line.match(/\[(\d+)\] (.+)/)
            if (match) {
              devices.push(`${match[1]}: ${match[2]}`)
            }
          }
        }

        resolve(devices)
      })
    })
  }

  /**
   * Start recording audio
   */
  async startRecording(metadata: Partial<RecordingMetadata> = {}): Promise<RecordingSession | null> {
    if (this.isRecording) {
      console.warn('[Recorder] Already recording')
      return this.currentSession
    }

    const hasFfmpeg = await this.checkFfmpeg()
    if (!hasFfmpeg) {
      console.error('[Recorder] ffmpeg not found')
      return null
    }

    const sessionId = `kaios_${Date.now()}`
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `${timestamp}_${sessionId}.${this.config.format}`
    const outputFile = join(this.config.outputDir, filename)

    this.currentSession = {
      id: sessionId,
      startTime: Date.now(),
      outputFile,
      metadata: {
        title: metadata.title || `KAIOS Session ${timestamp}`,
        artist: 'KAIOS',
        album: 'Sound Intelligence Sessions',
        emotions: metadata.emotions || [],
        conversationId: metadata.conversationId,
        tags: metadata.tags || ['kaios', 'sound-intelligence', '432hz']
      }
    }

    // Build ffmpeg command for macOS (BlackHole or system audio)
    // Using avfoundation to capture audio
    const ffmpegArgs = [
      '-y',  // Overwrite output
      '-f', 'avfoundation',
      '-i', ':0',  // Default audio input (can be changed)
      '-ar', this.config.sampleRate.toString(),
      '-ac', this.config.channels.toString(),
    ]

    // Add format-specific options
    if (this.config.format === 'mp3') {
      ffmpegArgs.push('-codec:a', 'libmp3lame', '-b:a', this.config.bitrate)
    } else if (this.config.format === 'flac') {
      ffmpegArgs.push('-codec:a', 'flac')
    } else {
      ffmpegArgs.push('-codec:a', 'pcm_s16le')
    }

    // Add metadata
    ffmpegArgs.push(
      '-metadata', `title=${this.currentSession.metadata.title}`,
      '-metadata', `artist=${this.currentSession.metadata.artist}`,
      '-metadata', `album=${this.currentSession.metadata.album}`,
      outputFile
    )

    try {
      this.ffmpegProcess = spawn('ffmpeg', ffmpegArgs, {
        stdio: ['pipe', 'pipe', 'pipe']
      })

      this.ffmpegProcess.on('error', (err) => {
        console.error('[Recorder] ffmpeg error:', err.message)
        this.isRecording = false
      })

      this.ffmpegProcess.on('close', (code) => {
        if (code !== 0 && code !== 255) {  // 255 is normal for SIGTERM
          console.warn(`[Recorder] ffmpeg exited with code ${code}`)
        }
        this.isRecording = false
      })

      this.isRecording = true
      return this.currentSession

    } catch (error) {
      console.error('[Recorder] Failed to start recording:', error)
      return null
    }
  }

  /**
   * Stop recording and save the file
   */
  async stopRecording(): Promise<RecordingSession | null> {
    if (!this.isRecording || !this.ffmpegProcess || !this.currentSession) {
      return null
    }

    return new Promise((resolve) => {
      this.currentSession!.endTime = Date.now()
      const session = { ...this.currentSession! }

      // Send quit signal to ffmpeg
      this.ffmpegProcess!.stdin?.write('q')

      // Give it a moment to finish writing
      setTimeout(() => {
        if (this.ffmpegProcess && !this.ffmpegProcess.killed) {
          this.ffmpegProcess.kill('SIGTERM')
        }

        // Save metadata file alongside the recording
        const metadataFile = session.outputFile.replace(/\.[^.]+$/, '.json')
        writeFileSync(metadataFile, JSON.stringify({
          ...session,
          duration: session.endTime! - session.startTime
        }, null, 2))

        this.ffmpegProcess = null
        this.currentSession = null
        this.isRecording = false

        resolve(session)
      }, 500)
    })
  }

  /**
   * Check if currently recording
   */
  isCurrentlyRecording(): boolean {
    return this.isRecording
  }

  /**
   * Get current session info
   */
  getCurrentSession(): RecordingSession | null {
    return this.currentSession
  }

  /**
   * Add emotion to current session
   */
  addEmotion(emotion: string): void {
    if (this.currentSession && !this.currentSession.metadata.emotions.includes(emotion)) {
      this.currentSession.metadata.emotions.push(emotion)
    }
  }

  /**
   * Get recording duration in seconds
   */
  getRecordingDuration(): number {
    if (!this.currentSession) return 0
    return Math.floor((Date.now() - this.currentSession.startTime) / 1000)
  }

  /**
   * List all recordings
   */
  listRecordings(): string[] {
    const { readdirSync } = require('fs')
    try {
      const files = readdirSync(this.config.outputDir)
      return files.filter((f: string) =>
        f.endsWith('.mp3') || f.endsWith('.wav') || f.endsWith('.flac')
      )
    } catch {
      return []
    }
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createAudioRecorder(config?: Partial<RecorderConfig>): AudioRecorder {
  return new AudioRecorder(config)
}
