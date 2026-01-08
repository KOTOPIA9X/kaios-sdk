/**
 * KAIOS Terminal Audio Module
 *
 * 4-layer audio system for terminal environments:
 * - Layer 1: UI Tones (432Hz-based feedback)
 * - Layer 2: Ambient Soundscape (background)
 * - Layer 3: Emotion Music (procedural)
 * - Layer 4: Sample Library (sound markers)
 *
 * @example
 * ```typescript
 * import { createTerminalAudio } from '@kaios/expression-sdk/audio/terminal'
 *
 * const audio = createTerminalAudio()
 * await audio.initialize()
 *
 * // Play typing feedback
 * audio.playTypingTone()
 *
 * // Process response for sound markers
 * await audio.processTextForSounds('[bzzzt] hello~ (◕‿◕)')
 *
 * // Set emotion for music/ambient
 * await audio.setEmotion('EMOTE_HAPPY')
 * ```
 */

// Main manager
export {
  TerminalAudio,
  createTerminalAudio,
  type TerminalAudioConfig,
  type AudioState
} from './terminal-audio.js'

// Layer 1: Tones
export {
  ToneGenerator,
  createToneGenerator,
  BASE_FREQUENCY,
  SCALE_432,
  GLITCH_PATTERNS,
  EMOTION_FREQUENCY_OFFSET,
  type ToneGeneratorConfig,
  type ToneOptions
} from './tone-generator.js'

// Layer 2: Ambient
export {
  AmbientEngine,
  createAmbientEngine,
  AMBIENT_SETS,
  EMOTION_TO_MOOD,
  type AmbientEngineConfig,
  type AmbientState
} from './ambient-engine.js'

// Layer 3: Music
export {
  MusicEngine,
  createMusicEngine,
  MUSIC_PROFILES,
  type MusicEngineConfig,
  type MusicState,
  type MusicProfile
} from './music-engine.js'

// Layer 4: Samples
export {
  SamplePlayer,
  createSamplePlayer,
  extractSoundMarkers,
  SOUND_MAPPINGS,
  EMOTIONAL_SAMPLES,
  type SamplePlayerConfig,
  type SoundMapping
} from './sample-player.js'

// Recording
export {
  AudioRecorder,
  createAudioRecorder,
  type RecorderConfig,
  type RecordingSession,
  type RecordingMetadata
} from './recorder.js'

// Audio Bus (for visualizer integration)
export {
  AudioBus,
  getAudioBus,
  createAudioBus,
  type AudioBusState,
  type PlayingSound,
  type SoundEvent
} from './audio-bus.js'

// SoX Synthesizer (for real piano synthesis)
export {
  SoxSynth,
  getSoxSynth,
  createSoxSynth,
  type SoxSynthConfig
} from './sox-synth.js'
