import { existsSync, mkdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { EventEmitter } from 'events';
import { spawn, execSync } from 'child_process';

var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/audio/terminal/tone-generator.ts
var BASE_FREQUENCY = 432;
var SCALE_432 = [
  261.63,
  // C4
  293.66,
  // D4
  329.63,
  // E4
  392,
  // G4
  440
  // A4 (close to 432Hz aesthetic)
];
var GLITCH_PATTERNS = {
  bzzzzt: { frequencies: [432, 440, 444], intensity: 0.8, duration: 0.1 },
  static: { frequencies: [666, 777, 888], intensity: 0.5, duration: 0.2 },
  ping: { frequencies: [880, 660], intensity: 0.6, duration: 0.05 },
  hum: { frequencies: [220, 330], intensity: 0.3, duration: 0.5 },
  whirr: { frequencies: [300, 350, 400], intensity: 0.4, duration: 0.15 },
  click: { frequencies: [1200], intensity: 0.7, duration: 0.02 }
};
var EMOTION_FREQUENCY_OFFSET = {
  EMOTE_NEUTRAL: 0,
  EMOTE_HAPPY: 4,
  // +4 semitones (brighter)
  EMOTE_SAD: -3,
  // -3 semitones (darker)
  EMOTE_ANGRY: -2,
  // -2 semitones (lower, intense)
  EMOTE_THINK: 2,
  // +2 semitones (thoughtful)
  EMOTE_SURPRISED: 7,
  // +7 semitones (high, sudden)
  EMOTE_AWKWARD: 1,
  // +1 semitone (slightly off)
  EMOTE_QUESTION: 5,
  // +5 semitones (rising)
  EMOTE_CURIOUS: 3
  // +3 semitones (exploratory)
};
var ToneGenerator = class {
  config;
  currentEmotion = "EMOTE_NEUTRAL";
  lastToneTime = 0;
  minToneInterval = 50;
  // ms between tones
  constructor(config = {}) {
    this.config = {
      enabled: true,
      volume: 0.3,
      typingTones: true,
      responseTones: true,
      ...config
    };
  }
  /**
   * Enable or disable tones
   */
  setEnabled(enabled) {
    this.config.enabled = enabled;
  }
  /**
   * Set current emotion for tone modulation
   */
  setEmotion(emotion) {
    this.currentEmotion = emotion;
  }
  /**
   * Set volume (0-1)
   */
  setVolume(volume) {
    this.config.volume = Math.max(0, Math.min(1, volume));
  }
  /**
   * Play a typing feedback tone (user input)
   * Uses terminal bell as basic feedback
   */
  playTypingTone(_char) {
    if (!this.config.enabled || !this.config.typingTones) return;
    if (!this.canPlayTone()) return;
    this.playBell();
    this.lastToneTime = Date.now();
  }
  /**
   * Play a response arrival tone
   */
  playResponseTone() {
    if (!this.config.enabled || !this.config.responseTones) return;
    this.playBell();
    setTimeout(() => this.playBell(), 100);
    this.lastToneTime = Date.now();
  }
  /**
   * Play a level up tone
   */
  playLevelUpTone() {
    if (!this.config.enabled) return;
    this.playBell();
    setTimeout(() => this.playBell(), 150);
    setTimeout(() => this.playBell(), 300);
    this.lastToneTime = Date.now();
  }
  /**
   * Play a glitch pattern by name
   */
  playGlitchPattern(pattern) {
    if (!this.config.enabled) return;
    const glitch = GLITCH_PATTERNS[pattern];
    if (!glitch) return;
    const bellCount = Math.ceil(glitch.duration * 10);
    for (let i = 0; i < bellCount; i++) {
      setTimeout(() => this.playBell(), i * 50);
    }
    this.lastToneTime = Date.now();
  }
  /**
   * Play error tone
   */
  playErrorTone() {
    if (!this.config.enabled) return;
    this.playBell();
    setTimeout(() => this.playBell(), 50);
    this.lastToneTime = Date.now();
  }
  /**
   * Calculate frequency for current emotion
   */
  getEmotionFrequency(baseFreq = BASE_FREQUENCY) {
    const offset = EMOTION_FREQUENCY_OFFSET[this.currentEmotion] || 0;
    return baseFreq * Math.pow(2, offset / 12);
  }
  /**
   * Get scale note for character (maps char to pentatonic scale)
   */
  getCharacterFrequency(char) {
    const code = char.charCodeAt(0);
    const noteIndex = code % SCALE_432.length;
    const baseFreq = SCALE_432[noteIndex];
    return this.getEmotionFrequency(baseFreq);
  }
  /**
   * Play terminal bell (basic audio feedback)
   * This is a fallback - real audio would use native modules
   */
  playBell() {
    if (this.config.volume > 0) {
      process.stdout.write("\x07");
    }
  }
  /**
   * Check if enough time has passed to play another tone
   */
  canPlayTone() {
    return Date.now() - this.lastToneTime >= this.minToneInterval;
  }
  /**
   * Get current config
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * Dispose and clean up
   */
  dispose() {
    this.config.enabled = false;
  }
};
function createToneGenerator(config) {
  return new ToneGenerator(config);
}
var AudioBus = class extends EventEmitter {
  currentlyPlaying = /* @__PURE__ */ new Map();
  recentSounds = [];
  frequencyData = new Array(128).fill(0);
  emotionState = "neutral";
  soundIdCounter = 0;
  cleanupInterval = null;
  animationInterval = null;
  lastEmitTime = 0;
  EMIT_THROTTLE_MS = 16;
  // ~60fps max
  // Frequency estimation for different sound categories
  CATEGORY_FREQUENCIES = {
    sample: { low: 100, high: 4e3, peak: 800 },
    tone: { low: 200, high: 2e3, peak: 432 },
    ambient: { low: 50, high: 500, peak: 150 },
    music: { low: 80, high: 8e3, peak: 440 }
  };
  constructor() {
    super();
    this.startCleanup();
    this.startAnimationLoop();
  }
  /**
   * Start 60fps animation loop for smooth frequency updates
   */
  startAnimationLoop() {
    this.animationInterval = setInterval(() => {
      this.updateFrequencies();
      const hasActivity = this.frequencyData.some((v) => v > 1);
      if (this.currentlyPlaying.size > 0 || hasActivity) {
        this.emitThrottled();
      }
    }, 16);
  }
  /**
   * Emit state change, throttled to 60fps max
   */
  emitThrottled() {
    const now = Date.now();
    if (now - this.lastEmitTime >= this.EMIT_THROTTLE_MS) {
      this.lastEmitTime = now;
      this.emit("stateChange", this.getState());
    }
  }
  /**
   * Register when a sound starts playing
   */
  soundStart(file, category = "sample", volume = 1, duration = 3e3) {
    const id = `sound_${++this.soundIdCounter}_${Date.now()}`;
    const sound = {
      id,
      file,
      startTime: Date.now(),
      duration,
      volume,
      category
    };
    this.currentlyPlaying.set(id, sound);
    this.recentSounds.push({
      id,
      file,
      timestamp: Date.now(),
      category
    });
    if (this.recentSounds.length > 50) {
      this.recentSounds = this.recentSounds.slice(-50);
    }
    this.simulateFrequencies();
    this.emit("soundStart", sound);
    this.emit("stateChange", this.getState());
    setTimeout(() => {
      this.soundEnd(id);
    }, duration);
    return id;
  }
  /**
   * Register when a sound stops playing
   */
  soundEnd(id) {
    const sound = this.currentlyPlaying.get(id);
    if (sound) {
      this.currentlyPlaying.delete(id);
      this.simulateFrequencies();
      this.emit("soundEnd", sound);
      this.emit("stateChange", this.getState());
    }
  }
  /**
   * Set current emotion state (affects visualization)
   */
  setEmotion(emotion) {
    this.emotionState = emotion;
    this.emit("stateChange", this.getState());
  }
  /**
   * Get current audio state
   */
  getState() {
    return {
      isActive: this.currentlyPlaying.size > 0,
      currentlyPlaying: Array.from(this.currentlyPlaying.values()),
      recentSounds: [...this.recentSounds],
      frequencyData: [...this.frequencyData],
      emotionState: this.emotionState,
      activity: this.calculateActivity()
    };
  }
  /**
   * Get frequency data for visualization (simulated based on playing sounds)
   */
  getFrequencyData() {
    return [...this.frequencyData];
  }
  /**
   * Get list of currently playing files
   */
  getPlayingFiles() {
    return Array.from(this.currentlyPlaying.values()).map((s) => s.file);
  }
  /**
   * Check if any sounds are playing
   */
  isPlaying() {
    return this.currentlyPlaying.size > 0;
  }
  /**
   * Event subscription helpers
   */
  onSoundStart(callback) {
    this.on("soundStart", callback);
  }
  onSoundEnd(callback) {
    this.on("soundEnd", callback);
  }
  onStateChange(callback) {
    this.on("stateChange", callback);
  }
  /**
   * Clear all playing sounds
   */
  clear() {
    this.currentlyPlaying.clear();
    this.frequencyData = new Array(128).fill(0);
    this.emit("stateChange", this.getState());
  }
  /**
   * Dispose and clean up
   */
  dispose() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
    this.clear();
    this.removeAllListeners();
  }
  // ════════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ════════════════════════════════════════════════════════════════════════════
  /**
   * Update frequency data with smooth animation
   * Called at 60fps from animation loop for fluid visualization
   */
  updateFrequencies() {
    const DECAY_RATE = 0.92;
    for (let i = 0; i < 128; i++) {
      this.frequencyData[i] *= DECAY_RATE;
      if (this.frequencyData[i] < 0.5) this.frequencyData[i] = 0;
    }
    if (this.currentlyPlaying.size === 0) return;
    for (const sound of this.currentlyPlaying.values()) {
      const freqProfile = this.CATEGORY_FREQUENCIES[sound.category] || this.CATEGORY_FREQUENCIES.sample;
      const elapsed = Date.now() - sound.startTime;
      const progress = Math.min(1, elapsed / sound.duration);
      let envelope = 1;
      if (progress < 0.05) {
        envelope = progress / 0.05;
      } else if (progress < 0.15) {
        envelope = 1 - (progress - 0.05) * 2;
      } else if (progress < 0.7) {
        envelope = 0.8;
      } else {
        envelope = 0.8 * (1 - (progress - 0.7) / 0.3);
      }
      const time = Date.now() / 1e3;
      for (let i = 0; i < 128; i++) {
        const freq = i / 128 * 1e4;
        if (freq >= freqProfile.low && freq <= freqProfile.high) {
          const distance = Math.abs(freq - freqProfile.peak) / (freqProfile.high - freqProfile.low);
          const baseAmplitude = Math.exp(-distance * 3) * sound.volume * envelope * 180;
          const wobble1 = Math.sin(time * 8 + i * 0.1) * 15;
          const wobble2 = Math.sin(time * 13 + i * 0.2) * 10;
          const noise = (Math.random() - 0.5) * 25;
          const amplitude = baseAmplitude + wobble1 + wobble2 + noise;
          this.frequencyData[i] = Math.min(255, Math.max(0, this.frequencyData[i] + amplitude * 0.3));
        }
      }
    }
  }
  /**
   * Simulate frequency data (for initial state - called on sound start)
   */
  simulateFrequencies() {
    this.updateFrequencies();
  }
  /**
   * Calculate overall audio activity level (0-1)
   */
  calculateActivity() {
    if (this.currentlyPlaying.size === 0) return 0;
    const avgFreq = this.frequencyData.reduce((a, b) => a + b, 0) / this.frequencyData.length;
    return Math.min(1, avgFreq / 128);
  }
  /**
   * Start cleanup interval for expired sounds
   */
  startCleanup() {
    this.cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [id, sound] of this.currentlyPlaying) {
        if (now - sound.startTime > sound.duration) {
          this.soundEnd(id);
        }
      }
    }, 100);
  }
};
var globalAudioBus = null;
function getAudioBus() {
  if (!globalAudioBus) {
    globalAudioBus = new AudioBus();
  }
  return globalAudioBus;
}
function createAudioBus() {
  return new AudioBus();
}
var AudioRecorder = class {
  config;
  currentSession = null;
  isRecording = false;
  // Sound event logs
  soundLog = [];
  synthLog = [];
  recordingStartTime = 0;
  constructor(config = {}) {
    this.config = {
      outputDir: join(process.cwd(), "recordings"),
      format: "mp3",
      sampleRate: 44100,
      channels: 2,
      bitrate: "192k",
      ...config
    };
    if (!existsSync(this.config.outputDir)) {
      mkdirSync(this.config.outputDir, { recursive: true });
    }
  }
  /**
   * Check if ffmpeg is available
   */
  async checkFfmpeg() {
    return new Promise((resolve) => {
      const proc = spawn("ffmpeg", ["-version"]);
      proc.on("close", (code) => resolve(code === 0));
      proc.on("error", () => resolve(false));
    });
  }
  /**
   * Check if sox is available (needed for synth reconstruction)
   */
  async checkSox() {
    return new Promise((resolve) => {
      const proc = spawn("sox", ["--version"]);
      proc.on("close", (code) => resolve(code === 0));
      proc.on("error", () => resolve(false));
    });
  }
  /**
   * Get available audio input devices (for reference, not used in log+reconstruct)
   */
  async getAudioDevices() {
    return new Promise((resolve) => {
      const proc = spawn("ffmpeg", ["-f", "avfoundation", "-list_devices", "true", "-i", '""'], {
        stdio: ["pipe", "pipe", "pipe"]
      });
      let output = "";
      proc.stderr?.on("data", (data) => {
        output += data.toString();
      });
      proc.on("close", () => {
        const devices = [];
        const lines = output.split("\n");
        let inAudioSection = false;
        for (const line of lines) {
          if (line.includes("AVFoundation audio devices:")) {
            inAudioSection = true;
            continue;
          }
          if (inAudioSection && line.includes("[")) {
            const match = line.match(/\[(\d+)\] (.+)/);
            if (match) {
              devices.push(`${match[1]}: ${match[2]}`);
            }
          }
        }
        resolve(devices);
      });
    });
  }
  /**
   * Start recording - begins logging sound events
   */
  async startRecording(metadata = {}) {
    if (this.isRecording) {
      console.warn("[Recorder] Already recording");
      return this.currentSession;
    }
    const hasFfmpeg = await this.checkFfmpeg();
    if (!hasFfmpeg) {
      console.error("[Recorder] ffmpeg not found");
      return null;
    }
    const sessionId = `kaios_${Date.now()}`;
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const filename = `${timestamp}_${sessionId}.${this.config.format}`;
    const outputFile = join(this.config.outputDir, filename);
    this.currentSession = {
      id: sessionId,
      startTime: Date.now(),
      outputFile,
      metadata: {
        title: metadata.title || `KAIOS Session ${timestamp}`,
        artist: "KAIOS",
        album: "Sound Intelligence Sessions",
        emotions: metadata.emotions || [],
        conversationId: metadata.conversationId,
        tags: metadata.tags || ["kaios", "sound-intelligence", "432hz"]
      }
    };
    this.recordingStartTime = Date.now();
    this.soundLog = [];
    this.synthLog = [];
    this.isRecording = true;
    return this.currentSession;
  }
  /**
   * Log a sample file being played
   */
  logSound(file, volume, duration) {
    if (!this.isRecording) return;
    this.soundLog.push({
      file,
      timestamp: Date.now() - this.recordingStartTime,
      volume,
      duration
    });
  }
  /**
   * Log a synthesized note being played
   */
  logSynthNote(event) {
    if (!this.isRecording) return;
    this.synthLog.push({
      ...event,
      timestamp: Date.now() - this.recordingStartTime
    });
  }
  /**
   * Stop recording and reconstruct the audio file
   */
  async stopRecording() {
    if (!this.isRecording || !this.currentSession) {
      return null;
    }
    this.currentSession.endTime = Date.now();
    this.isRecording = false;
    const session = { ...this.currentSession };
    const totalEvents = this.soundLog.length + this.synthLog.length;
    if (totalEvents === 0) {
      console.warn("[Recorder] No sounds were recorded during session");
      this.saveMetadata(session);
      return session;
    }
    try {
      await this.reconstructAudio();
      this.saveMetadata(session);
    } catch (error) {
      console.error("[Recorder] Failed to reconstruct audio:", error);
    }
    this.currentSession = null;
    this.soundLog = [];
    this.synthLog = [];
    return session;
  }
  /**
   * Reconstruct the audio from logged events
   */
  async reconstructAudio() {
    if (!this.currentSession) return;
    const outputFile = this.currentSession.outputFile;
    const tempDir = join(this.config.outputDir, ".temp_" + Date.now());
    try {
      mkdirSync(tempDir, { recursive: true });
      const synthTempFiles = [];
      for (let i = 0; i < this.synthLog.length; i++) {
        const event = this.synthLog[i];
        const tempFile = join(tempDir, `synth_${i}.wav`);
        const soxArgs = [...event.soxArgs];
        const dashNIndex = soxArgs.indexOf("-n");
        const dashDIndex = soxArgs.indexOf("-d");
        if (dashNIndex !== -1 && dashDIndex !== -1) {
          soxArgs.splice(dashDIndex, 1);
          soxArgs.splice(dashNIndex + 1, 0, tempFile);
        } else {
          soxArgs.unshift("-n", tempFile);
        }
        try {
          execSync(`sox ${soxArgs.join(" ")}`, { stdio: "ignore" });
          synthTempFiles.push({
            file: tempFile,
            timestamp: event.timestamp,
            volume: event.velocity
          });
        } catch {
          console.warn(`[Recorder] Failed to generate synth file ${i}`);
        }
      }
      const allSources = [
        ...this.soundLog.map((s) => ({ file: s.file, timestamp: s.timestamp, volume: s.volume })),
        ...synthTempFiles
      ];
      const validSources = allSources.filter((s) => existsSync(s.file));
      if (validSources.length === 0) {
        console.warn("[Recorder] No valid source files found");
        return;
      }
      if (validSources.length === 1) {
        const source = validSources[0];
        const ffmpegArgs = [
          "-y",
          "-i",
          source.file,
          "-af",
          `adelay=${source.timestamp}|${source.timestamp},volume=${source.volume}`,
          "-ar",
          this.config.sampleRate.toString(),
          "-ac",
          this.config.channels.toString()
        ];
        if (this.config.format === "mp3") {
          ffmpegArgs.push("-codec:a", "libmp3lame", "-b:a", this.config.bitrate);
        } else if (this.config.format === "flac") {
          ffmpegArgs.push("-codec:a", "flac");
        }
        ffmpegArgs.push(outputFile);
        await this.runFfmpeg(ffmpegArgs);
      } else {
        const inputs = [];
        const filters = [];
        validSources.forEach((source, i) => {
          inputs.push("-i", source.file);
          filters.push(
            `[${i}]adelay=${source.timestamp}|${source.timestamp},volume=${source.volume}[a${i}]`
          );
        });
        const mixInputs = validSources.map((_, i) => `[a${i}]`).join("");
        const amix = `${mixInputs}amix=inputs=${validSources.length}:duration=longest:normalize=0[out]`;
        const ffmpegArgs = [
          "-y",
          ...inputs,
          "-filter_complex",
          `${filters.join(";")};${amix}`,
          "-map",
          "[out]",
          "-ar",
          this.config.sampleRate.toString(),
          "-ac",
          this.config.channels.toString()
        ];
        if (this.config.format === "mp3") {
          ffmpegArgs.push("-codec:a", "libmp3lame", "-b:a", this.config.bitrate);
        } else if (this.config.format === "flac") {
          ffmpegArgs.push("-codec:a", "flac");
        }
        ffmpegArgs.push(outputFile);
        await this.runFfmpeg(ffmpegArgs);
      }
    } finally {
      try {
        rmSync(tempDir, { recursive: true, force: true });
      } catch {
      }
    }
  }
  /**
   * Run ffmpeg with given args
   */
  runFfmpeg(args) {
    return new Promise((resolve, reject) => {
      const proc = spawn("ffmpeg", args, {
        stdio: ["ignore", "ignore", "pipe"]
      });
      let stderr = "";
      proc.stderr?.on("data", (data) => {
        stderr += data.toString();
      });
      proc.on("close", (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`ffmpeg exited with code ${code}: ${stderr.slice(-500)}`));
        }
      });
      proc.on("error", (err) => {
        reject(err);
      });
    });
  }
  /**
   * Save session metadata to JSON file
   */
  saveMetadata(session) {
    const metadataFile = session.outputFile.replace(/\.[^.]+$/, ".json");
    writeFileSync(metadataFile, JSON.stringify({
      ...session,
      duration: (session.endTime || Date.now()) - session.startTime,
      soundsRecorded: this.soundLog.length,
      synthNotesRecorded: this.synthLog.length
    }, null, 2));
  }
  /**
   * Check if currently recording
   */
  isCurrentlyRecording() {
    return this.isRecording;
  }
  /**
   * Get current session info
   */
  getCurrentSession() {
    return this.currentSession;
  }
  /**
   * Add emotion to current session
   */
  addEmotion(emotion) {
    if (this.currentSession && !this.currentSession.metadata.emotions.includes(emotion)) {
      this.currentSession.metadata.emotions.push(emotion);
    }
  }
  /**
   * Get recording duration in seconds
   */
  getRecordingDuration() {
    if (!this.currentSession) return 0;
    return Math.floor((Date.now() - this.currentSession.startTime) / 1e3);
  }
  /**
   * Get event counts for status display
   */
  getEventCounts() {
    return {
      sounds: this.soundLog.length,
      synth: this.synthLog.length
    };
  }
  /**
   * List all recordings
   */
  listRecordings() {
    const { readdirSync } = __require("fs");
    try {
      const files = readdirSync(this.config.outputDir);
      return files.filter(
        (f) => f.endsWith(".mp3") || f.endsWith(".wav") || f.endsWith(".flac")
      );
    } catch {
      return [];
    }
  }
};
var globalRecorder = null;
function setGlobalRecorder(recorder) {
  globalRecorder = recorder;
}
function getGlobalRecorder() {
  return globalRecorder;
}
function createAudioRecorder(config) {
  return new AudioRecorder(config);
}

// src/audio/terminal/sample-player.ts
var SOUND_MAPPINGS = [
  // Glitch sounds - ghost whisper
  { pattern: /\[bzzzt\]|\*bzzzt\*/gi, file: "bzzzt.mp3", volume: 0.015 },
  { pattern: /\[static~?\]|\*static~?\*/gi, file: "glitch1.mp3", volume: 0.015 },
  { pattern: /\[glitch\]|\*glitch\*/gi, file: "glitch2.mp3", volume: 0.015 },
  // UI sounds - subliminal
  { pattern: /\[ping\]|\*ping\*/gi, file: "432hz_trim.mp3", volume: 0.01 },
  { pattern: /\[click\]|\*click\*/gi, file: "bzzzt.mp3", volume: 8e-3 },
  // Ambient sounds - almost imagined
  { pattern: /\[hum\]|\*hum\*/gi, file: "ambient_drone_trim.mp3", volume: 0.012 },
  { pattern: /\[whirr\]|\*whirr\*/gi, file: "spacey.mp3", volume: 0.012 },
  { pattern: /\[wind\]|\*wind\*/gi, file: "windsamples/Wind Howl.mp3", volume: 0.015 },
  // Melodic sounds - distant memory
  { pattern: /\[windchime\]|\*windchime\*/gi, file: "windsamples/Raw Wind Chimes.mp3", volume: 0.018 },
  { pattern: /\[chime\]|\*chime\*/gi, file: "windsamples/Slowed_Winchimes.mp3", volume: 0.018 },
  { pattern: /\[chimeloop\]|\*chimeloop\*/gi, file: "windsamples/Windchimes Loop.mp3", volume: 0.015 },
  // Wind samples - dream fragments
  { pattern: /\[fanpad\]|\*fanpad\*/gi, file: "windsamples/Fan Pad Processed.mp3", volume: 0.012 },
  { pattern: /\[bottle\]|\*bottle\*/gi, file: "windsamples/Bottle Blow.mp3", volume: 0.015 },
  { pattern: /\[mellow\]|\*mellow\*/gi, file: "windsamples/Mellow Epiano Strum.mp3", volume: 0.015 },
  { pattern: /\[grains\]|\*grains\*/gi, file: "windsamples/HiGrains.mp3", volume: 0.012 },
  { pattern: /\[bass\]|\*bass\*/gi, file: "windsamples/Bass Loop.mp3", volume: 0.012 },
  { pattern: /\[drum\]|\*drum\*/gi, file: "windsamples/Drum Loop.mp3", volume: 0.012 },
  // Piano samples - ethereal
  { pattern: /\[piano\]|\*piano\*/gi, file: "piano/Piano Sample 1.wav", volume: 0.015 },
  { pattern: /\[piano1\]|\*piano1\*/gi, file: "piano/Piano Sample 1.wav", volume: 0.015 },
  { pattern: /\[piano2\]|\*piano2\*/gi, file: "piano/Piano Sample 2.wav", volume: 0.015 },
  { pattern: /\[piano3\]|\*piano3\*/gi, file: "piano/Piano Sample 3.wav", volume: 0.015 },
  // Emotional samples - whispered feelings
  { pattern: /\[happy\]|\*happy\*/gi, file: "happy_fairy_.mp3", volume: 0.015 },
  { pattern: /\[sad\]|\*sad\*/gi, file: "sadman.mp3", volume: 0.015 },
  { pattern: /\[intense\]|\*intense\*/gi, file: "tarzan.mp3", volume: 0.012 },
  // Special sounds - feather touch
  { pattern: /\[headpat\]|\*headpat\*/gi, file: "blow.mp3", volume: 0.015 },
  { pattern: /\[cheers\]|\*cheers\*/gi, file: "icecream.mp3", volume: 0.015 }
];
var EMOTIONAL_SAMPLES = {
  joy: ["happy_fairy_.mp3", "icecream.mp3", "windsamples/Mellow Epiano Strum.mp3"],
  sadness: ["sadman.mp3", "natural_noise4.mp3", "piano/Piano Sample 2.wav"],
  contemplative: ["naturalNoise4.mp3", "blow.mp3", "windsamples/Fan Pad Processed.mp3", "piano/Piano Sample 1.wav"],
  intense: ["tarzan.mp3", "zchor16.mp3", "windsamples/Drum Loop.mp3"],
  grounded: ["yam.mp3", "natural_noise4.mp3", "windsamples/Bass Loop.mp3"],
  glitch: ["zchor16.mp3", "bzzzt.mp3"],
  dreamy: ["windsamples/Slowed_Winchimes.mp3", "windsamples/Fan Pad Processed.mp3", "piano/Piano Sample 3.wav"],
  peaceful: ["windsamples/Raw Wind Chimes.mp3", "windsamples/Bottle Blow.mp3", "piano/Piano Sample 1.wav"],
  melancholic: ["piano/Piano Sample 2.wav", "sadman.mp3", "windsamples/Wind Howl.mp3"]
};
var SamplePlayer = class {
  config;
  player = null;
  isInitialized = false;
  soundsCache = /* @__PURE__ */ new Map();
  constructor(config = {}) {
    const defaultSoundsDir = this.getDefaultSoundsDir();
    this.config = {
      enabled: true,
      volume: 0.015,
      // Ultra quiet - subliminal texture
      soundsDir: defaultSoundsDir,
      ...config
    };
  }
  /**
   * Initialize the sample player
   */
  async initialize() {
    if (this.isInitialized) return true;
    try {
      const playSound = await import('play-sound');
      this.player = playSound.default({});
      this.isInitialized = true;
      await this.cacheSoundAvailability();
      return true;
    } catch (error) {
      console.warn("[SamplePlayer] play-sound not available, audio disabled");
      this.config.enabled = false;
      return false;
    }
  }
  /**
   * Get default sounds directory
   */
  getDefaultSoundsDir() {
    return join(process.cwd(), "assets/sounds");
  }
  /**
   * Cache which sound files exist
   */
  async cacheSoundAvailability() {
    for (const mapping of SOUND_MAPPINGS) {
      const filePath = join(this.config.soundsDir, mapping.file);
      this.soundsCache.set(mapping.file, existsSync(filePath));
    }
  }
  /**
   * Set enabled state
   */
  setEnabled(enabled) {
    this.config.enabled = enabled;
  }
  /**
   * Set volume (0-1)
   */
  setVolume(volume) {
    this.config.volume = Math.max(0, Math.min(1, volume));
  }
  /**
   * Set sounds directory
   */
  setSoundsDir(dir) {
    this.config.soundsDir = dir;
    this.soundsCache.clear();
    this.cacheSoundAvailability();
  }
  /**
   * Play a specific sound file
   */
  async play(filename, _volume) {
    if (!this.config.enabled || !this.isInitialized || !this.player) return;
    const filePath = join(this.config.soundsDir, filename);
    const exists = this.soundsCache.has(filename) ? this.soundsCache.get(filename) : existsSync(filePath);
    if (!exists) {
      return;
    }
    const audioBus = getAudioBus();
    const volume = _volume ?? this.config.volume;
    const duration = this.estimateDuration(filename);
    audioBus.soundStart(filename, "sample", volume, duration);
    const recorder = getGlobalRecorder();
    if (recorder?.isCurrentlyRecording()) {
      recorder.logSound(filePath, volume, duration);
    }
    try {
      this.player.play(filePath, (err) => {
        if (err) {
        }
      });
    } catch {
    }
  }
  /**
   * Estimate duration based on filename (rough heuristic)
   */
  estimateDuration(filename) {
    if (/bzzzt|click|ping|glitch/i.test(filename)) return 500;
    if (/chime|piano|blow/i.test(filename)) return 2e3;
    if (/loop|ambient|drone/i.test(filename)) return 5e3;
    return 3e3;
  }
  /**
   * Detect and play sound markers in text
   * Returns text with markers intact (for display)
   */
  async playMarkersInText(text) {
    if (!this.config.enabled) return [];
    const playedSounds = [];
    for (const mapping of SOUND_MAPPINGS) {
      if (mapping.pattern.test(text)) {
        await this.play(mapping.file, mapping.volume);
        playedSounds.push(mapping.file);
        mapping.pattern.lastIndex = 0;
      }
    }
    return playedSounds;
  }
  /**
   * Play an emotional sample based on emotion
   */
  async playEmotionalSample(emotion) {
    if (!this.config.enabled) return;
    const emotionKey = emotion.toLowerCase();
    const samples = EMOTIONAL_SAMPLES[emotionKey];
    if (samples && samples.length > 0) {
      const sample = samples[Math.floor(Math.random() * samples.length)];
      await this.play(sample);
    }
  }
  /**
   * Play a glitch sound
   */
  async playGlitch() {
    const glitchFiles = ["bzzzt.mp3", "glitch1.mp3", "glitch2.mp3", "glitch3.mp3"];
    const file = glitchFiles[Math.floor(Math.random() * glitchFiles.length)];
    await this.play(file);
  }
  /**
   * Play windchime
   */
  async playWindchime() {
    const chimeFiles = ["windchime1.mp3", "windchime2.mp3", "windchime3.mp3"];
    const file = chimeFiles[Math.floor(Math.random() * chimeFiles.length)];
    await this.play(file);
  }
  /**
   * Check if a sound file is available
   */
  hasSoundFile(filename) {
    if (this.soundsCache.has(filename)) {
      return this.soundsCache.get(filename) || false;
    }
    const exists = existsSync(join(this.config.soundsDir, filename));
    this.soundsCache.set(filename, exists);
    return exists;
  }
  /**
   * List available sound files
   */
  getAvailableSounds() {
    return Array.from(this.soundsCache.entries()).filter(([, exists]) => exists).map(([file]) => file);
  }
  /**
   * Get config
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * Dispose and clean up
   */
  dispose() {
    this.config.enabled = false;
    this.player = null;
    this.isInitialized = false;
  }
};
function createSamplePlayer(config) {
  return new SamplePlayer(config);
}
function extractSoundMarkers(text) {
  const markers = [];
  for (const mapping of SOUND_MAPPINGS) {
    const matches = text.match(mapping.pattern);
    if (matches) {
      markers.push(...matches);
    }
    mapping.pattern.lastIndex = 0;
  }
  return markers;
}

// src/audio/terminal/ambient-engine.ts
var AMBIENT_SETS = {
  peaceful: [
    "ambient_drone_trim.mp3",
    "windsamples/Fan Pad Processed.mp3",
    "windsamples/Raw Wind Chimes.mp3",
    "piano/Piano Sample 1.wav"
  ],
  contemplative: [
    "naturalNoise4.mp3",
    "windsamples/Bottle Blow.mp3",
    "windsamples/Mellow Epiano Strum.mp3",
    "piano/Piano Sample 3.wav"
  ],
  dreamy: [
    "spacey.mp3",
    "windsamples/Slowed_Winchimes.mp3",
    "windsamples/Fan Pad Processed.mp3",
    "piano/Piano Sample 2.wav"
  ],
  glitchy: [
    "zchor16.mp3",
    "glitch1.mp3",
    "glitch2.mp3",
    "windsamples/HiGrains.mp3"
  ],
  melancholic: [
    "sadman.mp3",
    "windsamples/Wind Howl.mp3",
    "piano/Piano Sample 2.wav",
    "windsamples/raw_Fan Pad.mp3"
  ],
  energetic: [
    "happy_fairy_.mp3",
    "windsamples/Drum Loop.mp3",
    "windsamples/Bass Loop.mp3",
    "tarzan.mp3"
  ]
};
var EMOTION_TO_MOOD = {
  EMOTE_NEUTRAL: "peaceful",
  EMOTE_HAPPY: "energetic",
  EMOTE_SAD: "melancholic",
  EMOTE_ANGRY: "glitchy",
  EMOTE_THINK: "contemplative",
  EMOTE_SURPRISED: "dreamy",
  EMOTE_AWKWARD: "contemplative",
  EMOTE_QUESTION: "dreamy",
  EMOTE_CURIOUS: "dreamy"
};
var AmbientEngine = class {
  config;
  samplePlayer;
  state;
  eventTimer = null;
  constructor(samplePlayer, config = {}) {
    this.samplePlayer = samplePlayer;
    this.config = {
      enabled: true,
      volume: 0.3,
      evolutionInterval: 3e4,
      // 30 seconds
      minEventInterval: 15e3,
      // 15 seconds minimum
      maxEventInterval: 6e4,
      // 60 seconds maximum
      ...config
    };
    this.state = {
      isPlaying: false,
      currentMood: "peaceful",
      lastEventTime: 0
    };
  }
  /**
   * Start the ambient soundscape
   */
  start() {
    if (!this.config.enabled || this.state.isPlaying) return;
    this.state.isPlaying = true;
    this.scheduleNextEvent();
  }
  /**
   * Stop the ambient soundscape
   */
  stop() {
    this.state.isPlaying = false;
    if (this.eventTimer) {
      clearTimeout(this.eventTimer);
      this.eventTimer = null;
    }
  }
  /**
   * Set current emotion (affects ambient mood)
   */
  setEmotion(emotion) {
    this.state.currentMood = EMOTION_TO_MOOD[emotion] || "peaceful";
  }
  /**
   * Set enabled state
   */
  setEnabled(enabled) {
    this.config.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }
  /**
   * Set volume (0-1)
   */
  setVolume(volume) {
    this.config.volume = Math.max(0, Math.min(1, volume));
  }
  /**
   * Schedule the next ambient event
   */
  scheduleNextEvent() {
    if (!this.state.isPlaying) return;
    const interval = this.getRandomInterval();
    this.eventTimer = setTimeout(() => {
      this.playAmbientSound();
      this.scheduleNextEvent();
    }, interval);
  }
  /**
   * Get random interval between events
   */
  getRandomInterval() {
    const { minEventInterval, maxEventInterval } = this.config;
    return minEventInterval + Math.random() * (maxEventInterval - minEventInterval);
  }
  /**
   * Play an ambient sound based on current mood
   */
  async playAmbientSound() {
    if (!this.config.enabled) return;
    const soundSet = AMBIENT_SETS[this.state.currentMood] || AMBIENT_SETS.peaceful;
    const sound = soundSet[Math.floor(Math.random() * soundSet.length)];
    if (sound) {
      await this.samplePlayer.play(sound, this.config.volume);
      this.state.lastEventTime = Date.now();
    }
  }
  /**
   * Trigger an immediate ambient event
   */
  async triggerEvent() {
    await this.playAmbientSound();
  }
  /**
   * Get current state
   */
  getState() {
    return { ...this.state };
  }
  /**
   * Get config
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * Dispose and clean up
   */
  dispose() {
    this.stop();
    this.config.enabled = false;
  }
};
function createAmbientEngine(samplePlayer, config) {
  return new AmbientEngine(samplePlayer, config);
}

// src/audio/terminal/music-engine.ts
var MUSIC_PROFILES = {
  EMOTE_NEUTRAL: {
    tempo: "medium",
    energy: 5,
    texture: "smooth",
    samples: ["ambient_drone_trim.mp3", "natural_noise4.mp3"],
    description: "balanced, steady, neutral"
  },
  EMOTE_HAPPY: {
    tempo: "fast",
    energy: 8,
    texture: "smooth",
    samples: ["happy_fairy_.mp3", "icecream.mp3", "windchime1.mp3"],
    description: "bright, uplifting, energetic"
  },
  EMOTE_SAD: {
    tempo: "slow",
    energy: 3,
    texture: "ambient",
    samples: ["sadman.mp3", "natural_noise4.mp3", "blow.mp3"],
    description: "melancholic, sparse, atmospheric"
  },
  EMOTE_ANGRY: {
    tempo: "fast",
    energy: 9,
    texture: "rough",
    samples: ["tarzan.mp3", "zchor16.mp3", "glitch1.mp3"],
    description: "aggressive, distorted, intense"
  },
  EMOTE_THINK: {
    tempo: "slow",
    energy: 4,
    texture: "ambient",
    samples: ["naturalNoise4.mp3", "spacey.mp3", "ambient_drone_trim.mp3"],
    description: "meditative, spacious, evolving"
  },
  EMOTE_SURPRISED: {
    tempo: "fast",
    energy: 7,
    texture: "glitchy",
    samples: ["glitch2.mp3", "windchime2.mp3", "bzzzt.mp3"],
    description: "sudden, dynamic, unpredictable"
  },
  EMOTE_AWKWARD: {
    tempo: "medium",
    energy: 4,
    texture: "glitchy",
    samples: ["blow.mp3", "glitch3.mp3", "natural_noise4.mp3"],
    description: "uncertain, quirky, off-beat"
  },
  EMOTE_QUESTION: {
    tempo: "medium",
    energy: 6,
    texture: "smooth",
    samples: ["windchime3.mp3", "spacey.mp3", "naturalNoise4.mp3"],
    description: "exploratory, rising, curious"
  },
  EMOTE_CURIOUS: {
    tempo: "medium",
    energy: 6,
    texture: "glitchy",
    samples: ["spacey.mp3", "windchime1.mp3", "icecream.mp3"],
    description: "playful, exploratory, quirky"
  }
};
var MusicEngine = class {
  config;
  samplePlayer;
  state;
  constructor(samplePlayer, config = {}) {
    this.samplePlayer = samplePlayer;
    this.config = {
      enabled: true,
      volume: 0.5,
      playOnEmotionChange: true,
      minPlayInterval: 5e3,
      // 5 seconds minimum between plays
      ...config
    };
    this.state = {
      isPlaying: false,
      currentEmotion: "EMOTE_NEUTRAL",
      lastPlayTime: 0,
      intensity: 0.5
    };
  }
  /**
   * Set current emotion and optionally play music
   */
  async setEmotion(emotion, intensity = 0.5) {
    const emotionChanged = this.state.currentEmotion !== emotion;
    this.state.currentEmotion = emotion;
    this.state.intensity = intensity;
    if (this.config.playOnEmotionChange && emotionChanged) {
      await this.playForEmotion();
    }
  }
  /**
   * Play music appropriate for current emotion
   */
  async playForEmotion() {
    if (!this.config.enabled) return;
    if (!this.canPlay()) return;
    const profile = MUSIC_PROFILES[this.state.currentEmotion];
    if (!profile || profile.samples.length === 0) return;
    const sample = profile.samples[Math.floor(Math.random() * profile.samples.length)];
    this.state.isPlaying = true;
    await this.samplePlayer.play(sample, this.config.volume * this.state.intensity);
    this.state.lastPlayTime = Date.now();
    this.state.isPlaying = false;
  }
  /**
   * Play a specific sample
   */
  async play(sample) {
    if (!this.config.enabled) return;
    this.state.isPlaying = true;
    await this.samplePlayer.play(sample, this.config.volume);
    this.state.lastPlayTime = Date.now();
    this.state.isPlaying = false;
  }
  /**
   * Check if enough time has passed to play again
   */
  canPlay() {
    return Date.now() - this.state.lastPlayTime >= this.config.minPlayInterval;
  }
  /**
   * Get current music profile
   */
  getCurrentProfile() {
    return MUSIC_PROFILES[this.state.currentEmotion];
  }
  /**
   * Set enabled state
   */
  setEnabled(enabled) {
    this.config.enabled = enabled;
  }
  /**
   * Set volume (0-1)
   */
  setVolume(volume) {
    this.config.volume = Math.max(0, Math.min(1, volume));
  }
  /**
   * Get current state
   */
  getState() {
    return { ...this.state };
  }
  /**
   * Get config
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * Build a music generation prompt (for use with external music AI)
   * Based on kaios-og-xi buildMusicPrompt
   */
  buildPrompt() {
    const profile = this.getCurrentProfile();
    const emotion = this.state.currentEmotion.replace("EMOTE_", "").toLowerCase();
    return [
      "glitchy ambient experimental electronic",
      "gaming soundtrack",
      profile.description,
      `${emotion} mood`,
      profile.texture === "glitchy" ? "glitchy textures" : "",
      profile.texture === "ambient" ? "ambient soundscape" : "",
      profile.tempo === "fast" ? "driving rhythm" : "",
      profile.tempo === "slow" ? "slow tempo" : "",
      `energy level ${profile.energy}/10`
    ].filter(Boolean).join(", ");
  }
  /**
   * Dispose and clean up
   */
  dispose() {
    this.config.enabled = false;
    this.state.isPlaying = false;
  }
};
function createMusicEngine(samplePlayer, config) {
  return new MusicEngine(samplePlayer, config);
}

// src/audio/terminal/terminal-audio.ts
var TerminalAudio = class {
  config;
  state;
  // Audio layers
  tones;
  samples;
  ambient;
  music;
  constructor(config = {}) {
    this.config = {
      enabled: true,
      masterVolume: 0.5,
      tonesEnabled: true,
      ambientEnabled: false,
      // Off by default (can be intrusive)
      musicEnabled: false,
      // Off by default
      samplesEnabled: true,
      ...config
    };
    this.state = {
      enabled: this.config.enabled,
      initialized: false,
      currentEmotion: "EMOTE_NEUTRAL",
      layers: {
        tones: this.config.tonesEnabled,
        ambient: this.config.ambientEnabled,
        music: this.config.musicEnabled,
        samples: this.config.samplesEnabled
      }
    };
    this.tones = createToneGenerator({
      enabled: this.config.tonesEnabled,
      volume: this.config.masterVolume,
      ...this.config.tones
    });
    this.samples = createSamplePlayer({
      enabled: this.config.samplesEnabled,
      volume: this.config.masterVolume,
      ...this.config.samples
    });
    this.ambient = createAmbientEngine(this.samples, {
      enabled: this.config.ambientEnabled,
      volume: this.config.masterVolume * 0.6,
      // Ambient is quieter
      ...this.config.ambient
    });
    this.music = createMusicEngine(this.samples, {
      enabled: this.config.musicEnabled,
      volume: this.config.masterVolume,
      ...this.config.music
    });
  }
  /**
   * Initialize audio system
   */
  async initialize() {
    if (this.state.initialized) return true;
    try {
      await this.samples.initialize();
      this.state.initialized = true;
      return true;
    } catch (error) {
      console.warn("[TerminalAudio] Failed to initialize:", error);
      this.config.enabled = false;
      return false;
    }
  }
  /**
   * Enable or disable all audio
   */
  setEnabled(enabled) {
    this.config.enabled = enabled;
    this.state.enabled = enabled;
    this.tones.setEnabled(enabled && this.state.layers.tones);
    this.samples.setEnabled(enabled && this.state.layers.samples);
    this.ambient.setEnabled(enabled && this.state.layers.ambient);
    this.music.setEnabled(enabled && this.state.layers.music);
    if (!enabled) {
      this.ambient.stop();
    }
  }
  /**
   * Toggle a specific layer
   */
  setLayerEnabled(layer, enabled) {
    this.state.layers[layer] = enabled;
    switch (layer) {
      case "tones":
        this.tones.setEnabled(enabled && this.config.enabled);
        break;
      case "samples":
        this.samples.setEnabled(enabled && this.config.enabled);
        break;
      case "ambient":
        this.ambient.setEnabled(enabled && this.config.enabled);
        if (enabled && this.config.enabled) {
          this.ambient.start();
        } else {
          this.ambient.stop();
        }
        break;
      case "music":
        this.music.setEnabled(enabled && this.config.enabled);
        break;
    }
  }
  /**
   * Set master volume (0-1)
   */
  setMasterVolume(volume) {
    this.config.masterVolume = Math.max(0, Math.min(1, volume));
    this.tones.setVolume(this.config.masterVolume);
    this.samples.setVolume(this.config.masterVolume);
    this.ambient.setVolume(this.config.masterVolume * 0.6);
    this.music.setVolume(this.config.masterVolume);
  }
  /**
   * Set current emotion (affects all layers)
   */
  async setEmotion(emotion, intensity = 0.5) {
    this.state.currentEmotion = emotion;
    this.tones.setEmotion(emotion);
    this.ambient.setEmotion(emotion);
    await this.music.setEmotion(emotion, intensity);
    const audioBus = getAudioBus();
    audioBus.setEmotion(emotion);
  }
  // ════════════════════════════════════════════════════════════════════════════
  // LAYER 1: UI TONES
  // ════════════════════════════════════════════════════════════════════════════
  /**
   * Play typing feedback tone
   */
  playTypingTone(char) {
    if (!this.config.enabled) return;
    this.tones.playTypingTone(char);
  }
  /**
   * Play response arrival tone
   */
  playResponseTone() {
    if (!this.config.enabled) return;
    this.tones.playResponseTone();
  }
  /**
   * Play level up celebration
   */
  playLevelUpTone() {
    if (!this.config.enabled) return;
    this.tones.playLevelUpTone();
  }
  /**
   * Play error tone
   */
  playErrorTone() {
    if (!this.config.enabled) return;
    this.tones.playErrorTone();
  }
  // ════════════════════════════════════════════════════════════════════════════
  // LAYER 2: AMBIENT
  // ════════════════════════════════════════════════════════════════════════════
  /**
   * Start ambient soundscape
   */
  startAmbient() {
    if (!this.config.enabled) return;
    this.ambient.start();
  }
  /**
   * Stop ambient soundscape
   */
  stopAmbient() {
    this.ambient.stop();
  }
  // ════════════════════════════════════════════════════════════════════════════
  // LAYER 3: MUSIC
  // ════════════════════════════════════════════════════════════════════════════
  /**
   * Play emotion-appropriate music
   */
  async playMusic() {
    if (!this.config.enabled) return;
    await this.music.playForEmotion();
  }
  // ════════════════════════════════════════════════════════════════════════════
  // LAYER 4: SAMPLES
  // ════════════════════════════════════════════════════════════════════════════
  /**
   * Play a specific sample
   */
  async playSample(filename) {
    if (!this.config.enabled) return;
    await this.samples.play(filename);
  }
  /**
   * Process text for sound markers and play them
   */
  async processTextForSounds(text) {
    if (!this.config.enabled) return [];
    return await this.samples.playMarkersInText(text);
  }
  /**
   * Play glitch sound
   */
  async playGlitch() {
    if (!this.config.enabled) return;
    await this.samples.playGlitch();
  }
  // ════════════════════════════════════════════════════════════════════════════
  // STATE & UTILITIES
  // ════════════════════════════════════════════════════════════════════════════
  /**
   * Get current audio state
   */
  getState() {
    return { ...this.state };
  }
  /**
   * Get audio bus state (for visualizer)
   * Returns real-time info about what KAIOS is playing
   */
  getAudioBusState() {
    const audioBus = getAudioBus();
    return audioBus.getState();
  }
  /**
   * Get frequency data from audio bus (for visualizer)
   */
  getFrequencyData() {
    const audioBus = getAudioBus();
    return audioBus.getFrequencyData();
  }
  /**
   * Check if any sounds are currently playing
   */
  isPlayingAudio() {
    const audioBus = getAudioBus();
    return audioBus.isPlaying();
  }
  /**
   * Get configuration
   */
  getConfig() {
    return { ...this.config };
  }
  /**
   * Check if audio is available
   */
  isAvailable() {
    return this.state.initialized;
  }
  /**
   * Get layer status as formatted string
   */
  getStatusString() {
    const l = this.state.layers;
    return [
      `audio: ${this.config.enabled ? "ON" : "OFF"}`,
      `tones: ${l.tones ? "ON" : "OFF"}`,
      `ambient: ${l.ambient ? "ON" : "OFF"}`,
      `music: ${l.music ? "ON" : "OFF"}`,
      `samples: ${l.samples ? "ON" : "OFF"}`
    ].join(" | ");
  }
  /**
   * Dispose and clean up all resources
   */
  dispose() {
    this.config.enabled = false;
    this.tones.dispose();
    this.samples.dispose();
    this.ambient.dispose();
    this.music.dispose();
    this.state.initialized = false;
  }
};
function createTerminalAudio(config) {
  return new TerminalAudio(config);
}
var NOTE_FREQUENCIES = {
  // Octave 2 (deep, warm bass)
  "C2": 64.22,
  "C#2": 68.04,
  "D2": 72.08,
  "D#2": 76.37,
  "E2": 80.91,
  "F2": 85.72,
  "F#2": 90.82,
  "G2": 96.22,
  "G#2": 101.94,
  "A2": 108,
  "A#2": 114.42,
  "B2": 121.23,
  // Octave 3 (mellow mid-bass)
  "C3": 128.43,
  "C#3": 136.07,
  "D3": 144.16,
  "D#3": 152.74,
  "E3": 161.82,
  "F3": 171.44,
  "F#3": 181.63,
  "G3": 192.43,
  "G#3": 203.88,
  "A3": 216,
  "A#3": 228.84,
  "B3": 242.45,
  // Octave 4 (sweet spot - like C418's piano)
  "C4": 256.87,
  "C#4": 272.14,
  "D4": 288.33,
  "D#4": 305.47,
  "E4": 323.63,
  "F4": 342.88,
  "F#4": 363.27,
  "G4": 384.87,
  "G#4": 407.75,
  "A4": 432,
  "A#4": 457.69,
  "B4": 484.9,
  // Octave 5 (shimmering highs)
  "C5": 513.74,
  "C#5": 544.29,
  "D5": 576.65,
  "D#5": 610.94,
  "E5": 647.27,
  "F5": 685.76,
  "F#5": 726.53,
  "G5": 769.74,
  "G#5": 815.51,
  "A5": 864,
  "A#5": 915.38,
  "B5": 969.81,
  // Octave 6 (high shimmer)
  "C6": 1027.47,
  "C#6": 1088.57,
  "D6": 1153.3,
  "D#6": 1221.88,
  "E6": 1294.54,
  "F6": 1371.51,
  "F#6": 1453.07,
  "G6": 1539.47,
  "G#6": 1631.01,
  "A6": 1728,
  "A#6": 1830.75,
  "B6": 1939.61
};
var SoxSynth = class {
  config;
  soxAvailable = false;
  activeProcesses = /* @__PURE__ */ new Set();
  constructor(config = {}) {
    this.config = {
      enabled: true,
      volume: 0.5,
      // Softer default
      attack: 0.02,
      // Gentle attack
      sustain: 0.4,
      // Hold the note
      decay: 0.5,
      // Slow fade out
      reverb: 50,
      // More reverb for warmth
      warmth: 0.3,
      // Add some lower harmonics
      ...config
    };
    this.checkSox();
  }
  async checkSox() {
    try {
      const proc = spawn("which", ["sox"]);
      proc.on("close", (code) => {
        this.soxAvailable = code === 0;
        if (!this.soxAvailable) {
          console.log("[sox-synth] SoX not found. Install with: brew install sox");
        }
      });
    } catch {
      this.soxAvailable = false;
    }
  }
  /**
   * Play a C418-style ambient piano note
   * Warm sine waves with soft attack, long decay, and lush reverb
   * Inspired by Minecraft's "Sweden", "Wet Hands", "Mice on Venus"
   */
  async playNote(note, durationMs = 2500, velocity = 0.35) {
    if (!this.config.enabled) return;
    const freq = NOTE_FREQUENCIES[note];
    if (!freq) return;
    const durationSec = Math.max(2, durationMs / 1e3);
    const vol = Math.min(0.15, velocity * this.config.volume * 0.35);
    const audioBus = getAudioBus();
    audioBus.soundStart(`synth-${note}`, "music", velocity, durationMs);
    const attackTime = 0.15 + Math.random() * 0.1;
    const decayTime = durationSec * 0.5 + Math.random() * 0.3;
    const args = [
      "-n",
      "-d",
      // null input, default output
      "synth",
      durationSec.toFixed(2),
      "sine",
      freq.toFixed(2),
      // Pure sine wave (not pluck!)
      "flanger",
      "0",
      "2",
      "0",
      "71",
      "0.5",
      "sine",
      // Subtle movement
      "fade",
      "h",
      // half-sine fade (very smooth)
      attackTime.toFixed(2),
      // Soft attack
      durationSec.toFixed(2),
      decayTime.toFixed(2),
      // Long decay
      "reverb",
      "55",
      // Heavy reverb for that spacious feel
      "vol",
      vol.toFixed(2),
      "gain",
      "-4"
      // Headroom to prevent clipping
    ];
    const recorder = getGlobalRecorder();
    if (recorder?.isCurrentlyRecording()) {
      recorder.logSynthNote({
        type: "note",
        note,
        freq,
        duration: durationSec,
        velocity: vol,
        soxArgs: args
      });
    }
    try {
      const proc = spawn("play", args, {
        stdio: ["ignore", "ignore", "ignore"]
      });
      this.activeProcesses.add(proc);
      proc.on("close", () => this.activeProcesses.delete(proc));
      proc.on("error", () => this.activeProcesses.delete(proc));
    } catch {
    }
  }
  /**
   * Play a pad note - sustained, ambient, like background texture
   * These layer under the piano notes for that full C418 sound
   */
  async playPad(note, durationMs = 5e3, velocity = 0.2) {
    if (!this.config.enabled) return;
    const freq = NOTE_FREQUENCIES[note];
    if (!freq) return;
    const durationSec = Math.max(4, durationMs / 1e3);
    const vol = Math.min(0.15, velocity * this.config.volume * 0.3);
    const audioBus = getAudioBus();
    audioBus.soundStart(`pad-${note}`, "music", velocity * 0.5, durationMs);
    const args = [
      "-n",
      "-d",
      "synth",
      durationSec.toFixed(2),
      "sine",
      freq.toFixed(2),
      "tremolo",
      "3",
      "15",
      // Very subtle tremolo for organic warmth
      "fade",
      "h",
      "0.5",
      // Slow attack
      durationSec.toFixed(2),
      (durationSec * 0.4).toFixed(2),
      // Long fade out
      "reverb",
      "65",
      // Extra reverb for pads
      "vol",
      vol.toFixed(2),
      "gain",
      "-6"
    ];
    const recorder = getGlobalRecorder();
    if (recorder?.isCurrentlyRecording()) {
      recorder.logSynthNote({
        type: "pad",
        note,
        freq,
        duration: durationSec,
        velocity: vol,
        soxArgs: args
      });
    }
    try {
      const proc = spawn("play", args, {
        stdio: ["ignore", "ignore", "ignore"]
      });
      this.activeProcesses.add(proc);
      proc.on("close", () => this.activeProcesses.delete(proc));
      proc.on("error", () => this.activeProcesses.delete(proc));
    } catch {
    }
  }
  /**
   * Play a chord - C418 style with arpeggiated strum
   * Notes gently cascade with organic timing
   */
  async playChord(notes, durationMs = 3500, velocity = 0.3) {
    for (let i = 0; i < notes.length; i++) {
      const strumDelay = 80 + Math.random() * 60;
      const noteVelocity = velocity - i * 0.02;
      const noteDuration = durationMs + Math.random() * 500;
      setTimeout(() => {
        this.playNote(notes[i], noteDuration, Math.max(0.15, noteVelocity));
      }, i * strumDelay);
    }
    if (Math.random() < 0.3 && notes.length > 0) {
      const rootNote = notes[0];
      const match = rootNote.match(/([A-G]#?)(\d)/);
      if (match) {
        const noteName = match[1];
        const octave = parseInt(match[2]) - 1;
        if (octave >= 2) {
          setTimeout(() => {
            this.playPad(`${noteName}${octave}`, durationMs * 1.5, velocity * 0.6);
          }, 200);
        }
      }
    }
  }
  /**
   * Play a gentle arpeggio - notes flowing upward or downward
   * Very C418 - like "Sweden" or "Wet Hands"
   */
  async playArpeggio(notes, durationMs = 2e3, velocity = 0.3, direction = "up") {
    const orderedNotes = direction === "up" ? notes : [...notes].reverse();
    for (let i = 0; i < orderedNotes.length; i++) {
      const delay = 200 + Math.random() * 100;
      const noteVelocity = velocity + (Math.random() * 0.05 - 0.025);
      setTimeout(() => {
        this.playNote(orderedNotes[i], durationMs, Math.max(0.1, noteVelocity));
      }, i * delay);
    }
  }
  /**
   * Stop all active sounds
   */
  stop() {
    for (const proc of this.activeProcesses) {
      try {
        proc.kill();
      } catch {
      }
    }
    this.activeProcesses.clear();
  }
  /**
   * Check if SoX is available
   */
  isAvailable() {
    return this.soxAvailable;
  }
  /**
   * Set volume
   */
  setVolume(vol) {
    this.config.volume = Math.max(0, Math.min(1, vol));
  }
  /**
   * Enable/disable
   */
  setEnabled(enabled) {
    this.config.enabled = enabled;
    if (!enabled) {
      this.stop();
    }
  }
  /**
   * Get note frequency
   */
  getFrequency(note) {
    return NOTE_FREQUENCIES[note] || 432;
  }
};
var globalSoxSynth = null;
function getSoxSynth() {
  if (!globalSoxSynth) {
    globalSoxSynth = new SoxSynth();
  }
  return globalSoxSynth;
}
function createSoxSynth(config) {
  return new SoxSynth(config);
}

export { AMBIENT_SETS, AmbientEngine, AudioBus, AudioRecorder, BASE_FREQUENCY, EMOTIONAL_SAMPLES, EMOTION_FREQUENCY_OFFSET, EMOTION_TO_MOOD, GLITCH_PATTERNS, MUSIC_PROFILES, MusicEngine, SCALE_432, SOUND_MAPPINGS, SamplePlayer, SoxSynth, TerminalAudio, ToneGenerator, createAmbientEngine, createAudioBus, createAudioRecorder, createMusicEngine, createSamplePlayer, createSoxSynth, createTerminalAudio, createToneGenerator, extractSoundMarkers, getAudioBus, getGlobalRecorder, getSoxSynth, setGlobalRecorder };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map