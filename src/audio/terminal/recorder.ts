/**
 * KAIOS Audio Recorder
 * Records KAIOS audio sessions by logging sound events and reconstructing with ffmpeg
 *
 * Uses a log+reconstruct approach:
 * 1. Start recording: begin logging sound events with timestamps
 * 2. During session: track samples played and synth notes generated
 * 3. Stop recording: use ffmpeg to mix all sources at correct time offsets
 * 4. Output: single audio file with all sounds properly timed
 */

import { spawn, execSync } from 'child_process'
import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs'
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

/** A sample file that was played during recording */
export interface SoundEvent {
  file: string          // Full path to sound file
  timestamp: number     // ms offset from recording start
  volume: number        // 0-1
  duration?: number     // estimated duration ms
}

/** A synthesized note (from SoX) that was played during recording */
export interface SynthEvent {
  type: 'note' | 'pad' | 'chord'
  note: string
  freq: number
  duration: number      // seconds
  velocity: number
  timestamp: number     // ms offset from recording start
  soxArgs: string[]     // exact args used for sox (for perfect reconstruction)
}

// ════════════════════════════════════════════════════════════════════════════════
// AUDIO RECORDER
// ════════════════════════════════════════════════════════════════════════════════

export class AudioRecorder {
  private config: RecorderConfig
  private currentSession: RecordingSession | null = null
  private isRecording = false

  // Sound event logs
  private soundLog: SoundEvent[] = []
  private synthLog: SynthEvent[] = []
  private recordingStartTime: number = 0

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
   * Check if sox is available (needed for synth reconstruction)
   */
  async checkSox(): Promise<boolean> {
    return new Promise((resolve) => {
      const proc = spawn('sox', ['--version'])
      proc.on('close', (code) => resolve(code === 0))
      proc.on('error', () => resolve(false))
    })
  }

  /**
   * Get available audio input devices (for reference, not used in log+reconstruct)
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
   * Start recording - begins logging sound events
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

    // Initialize logging
    this.recordingStartTime = Date.now()
    this.soundLog = []
    this.synthLog = []
    this.isRecording = true

    return this.currentSession
  }

  /**
   * Log a sample file being played
   */
  logSound(file: string, volume: number, duration?: number): void {
    if (!this.isRecording) return

    this.soundLog.push({
      file,
      timestamp: Date.now() - this.recordingStartTime,
      volume,
      duration
    })
  }

  /**
   * Log a synthesized note being played
   */
  logSynthNote(event: Omit<SynthEvent, 'timestamp'>): void {
    if (!this.isRecording) return

    this.synthLog.push({
      ...event,
      timestamp: Date.now() - this.recordingStartTime
    })
  }

  /**
   * Stop recording and reconstruct the audio file
   */
  async stopRecording(): Promise<RecordingSession | null> {
    if (!this.isRecording || !this.currentSession) {
      return null
    }

    this.currentSession.endTime = Date.now()
    this.isRecording = false
    const session = { ...this.currentSession }

    const totalEvents = this.soundLog.length + this.synthLog.length

    // If no sounds logged, create a note about it but don't fail
    if (totalEvents === 0) {
      console.warn('[Recorder] No sounds were recorded during session')
      this.saveMetadata(session)
      return session
    }

    try {
      await this.reconstructAudio()
      this.saveMetadata(session)
    } catch (error) {
      console.error('[Recorder] Failed to reconstruct audio:', error)
    }

    // Clean up
    this.currentSession = null
    this.soundLog = []
    this.synthLog = []

    return session
  }

  /**
   * Reconstruct the audio from logged events
   */
  private async reconstructAudio(): Promise<void> {
    if (!this.currentSession) return

    const outputFile = this.currentSession.outputFile
    const tempDir = join(this.config.outputDir, '.temp_' + Date.now())

    try {
      mkdirSync(tempDir, { recursive: true })

      // Step 1: Generate temp WAV files for synth notes
      const synthTempFiles: { file: string; timestamp: number; volume: number }[] = []

      for (let i = 0; i < this.synthLog.length; i++) {
        const event = this.synthLog[i]
        const tempFile = join(tempDir, `synth_${i}.wav`)

        // Build sox command to generate the audio file
        // Original args: ['-n', '-d', 'synth', duration, 'sine', freq, ...]
        // We need: sox -n OUTPUT_FILE synth duration sine freq ...
        const soxArgs = [...event.soxArgs]

        // Replace '-n', '-d' (null input, default output) with '-n', tempFile
        const dashNIndex = soxArgs.indexOf('-n')
        const dashDIndex = soxArgs.indexOf('-d')

        if (dashNIndex !== -1 && dashDIndex !== -1) {
          // Remove -d, keep -n, insert output file after -n
          soxArgs.splice(dashDIndex, 1)
          soxArgs.splice(dashNIndex + 1, 0, tempFile)
        } else {
          // Fallback: prepend -n and output file
          soxArgs.unshift('-n', tempFile)
        }

        try {
          execSync(`sox ${soxArgs.join(' ')}`, { stdio: 'ignore' })
          synthTempFiles.push({
            file: tempFile,
            timestamp: event.timestamp,
            volume: event.velocity
          })
        } catch {
          // Skip failed synth generations
          console.warn(`[Recorder] Failed to generate synth file ${i}`)
        }
      }

      // Step 2: Combine all sources (samples + synth)
      const allSources: { file: string; timestamp: number; volume: number }[] = [
        ...this.soundLog.map(s => ({ file: s.file, timestamp: s.timestamp, volume: s.volume })),
        ...synthTempFiles
      ]

      // Filter to only existing files
      const validSources = allSources.filter(s => existsSync(s.file))

      if (validSources.length === 0) {
        console.warn('[Recorder] No valid source files found')
        return
      }

      // Step 3: Build ffmpeg command
      if (validSources.length === 1) {
        // Single source - simple copy with delay at start
        const source = validSources[0]
        const ffmpegArgs = [
          '-y',
          '-i', source.file,
          '-af', `adelay=${source.timestamp}|${source.timestamp},volume=${source.volume}`,
          '-ar', this.config.sampleRate.toString(),
          '-ac', this.config.channels.toString()
        ]

        if (this.config.format === 'mp3') {
          ffmpegArgs.push('-codec:a', 'libmp3lame', '-b:a', this.config.bitrate)
        } else if (this.config.format === 'flac') {
          ffmpegArgs.push('-codec:a', 'flac')
        }

        ffmpegArgs.push(outputFile)

        await this.runFfmpeg(ffmpegArgs)

      } else {
        // Multiple sources - use filter_complex to mix
        const inputs: string[] = []
        const filters: string[] = []

        validSources.forEach((source, i) => {
          inputs.push('-i', source.file)
          // adelay in ms for left|right channels, then volume adjust
          filters.push(
            `[${i}]adelay=${source.timestamp}|${source.timestamp},volume=${source.volume}[a${i}]`
          )
        })

        // Mix all streams together
        const mixInputs = validSources.map((_, i) => `[a${i}]`).join('')
        const amix = `${mixInputs}amix=inputs=${validSources.length}:duration=longest:normalize=0[out]`

        const ffmpegArgs = [
          '-y',
          ...inputs,
          '-filter_complex', `${filters.join(';')};${amix}`,
          '-map', '[out]',
          '-ar', this.config.sampleRate.toString(),
          '-ac', this.config.channels.toString()
        ]

        if (this.config.format === 'mp3') {
          ffmpegArgs.push('-codec:a', 'libmp3lame', '-b:a', this.config.bitrate)
        } else if (this.config.format === 'flac') {
          ffmpegArgs.push('-codec:a', 'flac')
        }

        ffmpegArgs.push(outputFile)

        await this.runFfmpeg(ffmpegArgs)
      }

    } finally {
      // Clean up temp directory
      try {
        rmSync(tempDir, { recursive: true, force: true })
      } catch {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Run ffmpeg with given args
   */
  private runFfmpeg(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      const proc = spawn('ffmpeg', args, {
        stdio: ['ignore', 'ignore', 'pipe']
      })

      let stderr = ''
      proc.stderr?.on('data', (data) => {
        stderr += data.toString()
      })

      proc.on('close', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-500)}`))
        }
      })

      proc.on('error', (err) => {
        reject(err)
      })
    })
  }

  /**
   * Save session metadata to JSON file
   */
  private saveMetadata(session: RecordingSession): void {
    const metadataFile = session.outputFile.replace(/\.[^.]+$/, '.json')
    writeFileSync(metadataFile, JSON.stringify({
      ...session,
      duration: (session.endTime || Date.now()) - session.startTime,
      soundsRecorded: this.soundLog.length,
      synthNotesRecorded: this.synthLog.length
    }, null, 2))
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
   * Get event counts for status display
   */
  getEventCounts(): { sounds: number; synth: number } {
    return {
      sounds: this.soundLog.length,
      synth: this.synthLog.length
    }
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
// GLOBAL INSTANCE (for cross-module recording hooks)
// ════════════════════════════════════════════════════════════════════════════════

let globalRecorder: AudioRecorder | null = null

export function setGlobalRecorder(recorder: AudioRecorder): void {
  globalRecorder = recorder
}

export function getGlobalRecorder(): AudioRecorder | null {
  return globalRecorder
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createAudioRecorder(config?: Partial<RecorderConfig>): AudioRecorder {
  return new AudioRecorder(config)
}
