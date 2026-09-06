import { E as EmotionToken } from '../../types-CIIwpMNW.js';
import { EventEmitter } from 'events';
import '../../spine/spine-adapter.js';

/**
 * KAIOS Terminal Tone Generator
 * Layer 1: 432Hz-based UI tones for typing and response feedback
 *
 * Based on the original kaios-og-xi 432Hz solfeggio frequency system
 */

/** Base frequency - 432Hz solfeggio tuning (core to KAIOS identity) */
declare const BASE_FREQUENCY = 432;
/** Pentatonic scale for harmony (from kaios-og-xi SoundManager.ts) */
declare const SCALE_432: number[];
/** Glitch patterns (from kaios-og-xi KAIOSCore.ts) */
declare const GLITCH_PATTERNS: {
    bzzzzt: {
        frequencies: number[];
        intensity: number;
        duration: number;
    };
    static: {
        frequencies: number[];
        intensity: number;
        duration: number;
    };
    ping: {
        frequencies: number[];
        intensity: number;
        duration: number;
    };
    hum: {
        frequencies: number[];
        intensity: number;
        duration: number;
    };
    whirr: {
        frequencies: number[];
        intensity: number;
        duration: number;
    };
    click: {
        frequencies: number[];
        intensity: number;
        duration: number;
    };
};
/** Emotion to frequency offset mapping */
declare const EMOTION_FREQUENCY_OFFSET: Record<EmotionToken, number>;
interface ToneOptions {
    frequency?: number;
    duration?: number;
    volume?: number;
    waveform?: 'sine' | 'square' | 'triangle' | 'sawtooth';
}
interface ToneGeneratorConfig {
    enabled: boolean;
    volume: number;
    typingTones: boolean;
    responseTones: boolean;
}
/**
 * Terminal tone generator using process.stdout for bell tones
 * Falls back gracefully when audio is unavailable
 *
 * Note: Full audio synthesis requires native modules (speaker/pcm-util)
 * This implementation uses terminal bell as a fallback for basic feedback
 */
declare class ToneGenerator {
    private config;
    private currentEmotion;
    private lastToneTime;
    private minToneInterval;
    constructor(config?: Partial<ToneGeneratorConfig>);
    /**
     * Enable or disable tones
     */
    setEnabled(enabled: boolean): void;
    /**
     * Set current emotion for tone modulation
     */
    setEmotion(emotion: EmotionToken): void;
    /**
     * Set volume (0-1)
     */
    setVolume(volume: number): void;
    /**
     * Play a typing feedback tone (user input)
     * Uses terminal bell as basic feedback
     */
    playTypingTone(_char?: string): void;
    /**
     * Play a response arrival tone
     */
    playResponseTone(): void;
    /**
     * Play a level up tone
     */
    playLevelUpTone(): void;
    /**
     * Play a glitch pattern by name
     */
    playGlitchPattern(pattern: keyof typeof GLITCH_PATTERNS): void;
    /**
     * Play error tone
     */
    playErrorTone(): void;
    /**
     * Calculate frequency for current emotion
     */
    getEmotionFrequency(baseFreq?: number): number;
    /**
     * Get scale note for character (maps char to pentatonic scale)
     */
    getCharacterFrequency(char: string): number;
    /**
     * Play terminal bell (basic audio feedback)
     * This is a fallback - real audio would use native modules
     */
    private playBell;
    /**
     * Check if enough time has passed to play another tone
     */
    private canPlayTone;
    /**
     * Get current config
     */
    getConfig(): ToneGeneratorConfig;
    /**
     * Dispose and clean up
     */
    dispose(): void;
}
declare function createToneGenerator(config?: Partial<ToneGeneratorConfig>): ToneGenerator;

/**
 * KAIOS Terminal Sample Player
 * Layer 4: Sound library playback for sound markers
 *
 * Plays pre-recorded sounds when KAIOS uses sound markers like [bzzzt], *static*, etc.
 * Uses play-sound for cross-platform audio playback
 */
interface SamplePlayerConfig {
    enabled: boolean;
    volume: number;
    soundsDir: string;
}
interface SoundMapping {
    pattern: RegExp;
    file: string;
    volume?: number;
}
/**
 * Map sound markers to audio files
 * Supports both [marker] and *marker* formats
 * ULTRA QUIET - barely perceptible background texture
 */
declare const SOUND_MAPPINGS: SoundMapping[];
/**
 * Emotional sample mapping (from kaios-og-xi SoundManager.ts)
 * Now includes windsamples and piano
 */
declare const EMOTIONAL_SAMPLES: Record<string, string[]>;
/**
 * Sample player for terminal audio
 * Uses play-sound npm package for cross-platform audio playback
 */
declare class SamplePlayer {
    private config;
    private player;
    private isInitialized;
    private soundsCache;
    constructor(config?: Partial<SamplePlayerConfig>);
    /**
     * Initialize the sample player
     */
    initialize(): Promise<boolean>;
    /**
     * Get default sounds directory
     */
    private getDefaultSoundsDir;
    /**
     * Cache which sound files exist
     */
    private cacheSoundAvailability;
    /**
     * Set enabled state
     */
    setEnabled(enabled: boolean): void;
    /**
     * Set volume (0-1)
     */
    setVolume(volume: number): void;
    /**
     * Set sounds directory
     */
    setSoundsDir(dir: string): void;
    /**
     * Play a specific sound file
     */
    play(filename: string, _volume?: number): Promise<void>;
    /**
     * Estimate duration based on filename (rough heuristic)
     */
    private estimateDuration;
    /**
     * Detect and play sound markers in text
     * Returns text with markers intact (for display)
     */
    playMarkersInText(text: string): Promise<string[]>;
    /**
     * Play an emotional sample based on emotion
     */
    playEmotionalSample(emotion: string): Promise<void>;
    /**
     * Play a glitch sound
     */
    playGlitch(): Promise<void>;
    /**
     * Play windchime
     */
    playWindchime(): Promise<void>;
    /**
     * Check if a sound file is available
     */
    hasSoundFile(filename: string): boolean;
    /**
     * List available sound files
     */
    getAvailableSounds(): string[];
    /**
     * Get config
     */
    getConfig(): SamplePlayerConfig;
    /**
     * Dispose and clean up
     */
    dispose(): void;
}
declare function createSamplePlayer(config?: Partial<SamplePlayerConfig>): SamplePlayer;
/**
 * Extract sound markers from text
 */
declare function extractSoundMarkers(text: string): string[];

/**
 * KAIOS Terminal Ambient Engine
 * Layer 2: Background soundscape for continuous ambient audio
 *
 * Creates a peaceful, evolving background similar to Minecraft ambient sounds
 * Uses sample playback with timing for terminal environments
 */

interface AmbientEngineConfig {
    enabled: boolean;
    volume: number;
    evolutionInterval: number;
    minEventInterval: number;
    maxEventInterval: number;
}
interface AmbientState {
    isPlaying: boolean;
    currentMood: string;
    lastEventTime: number;
}
/**
 * Ambient sound sets mapped to emotional states
 * Each set contains files that fit the mood
 * Now includes windsamples and piano
 */
declare const AMBIENT_SETS: Record<string, string[]>;
/**
 * Map emotion tokens to ambient mood
 */
declare const EMOTION_TO_MOOD: Record<EmotionToken, string>;
/**
 * Ambient soundscape engine
 * Plays occasional ambient sounds to create atmosphere
 */
declare class AmbientEngine {
    private config;
    private samplePlayer;
    private state;
    private eventTimer;
    constructor(samplePlayer: SamplePlayer, config?: Partial<AmbientEngineConfig>);
    /**
     * Start the ambient soundscape
     */
    start(): void;
    /**
     * Stop the ambient soundscape
     */
    stop(): void;
    /**
     * Set current emotion (affects ambient mood)
     */
    setEmotion(emotion: EmotionToken): void;
    /**
     * Set enabled state
     */
    setEnabled(enabled: boolean): void;
    /**
     * Set volume (0-1)
     */
    setVolume(volume: number): void;
    /**
     * Schedule the next ambient event
     */
    private scheduleNextEvent;
    /**
     * Get random interval between events
     */
    private getRandomInterval;
    /**
     * Play an ambient sound based on current mood
     */
    private playAmbientSound;
    /**
     * Trigger an immediate ambient event
     */
    triggerEvent(): Promise<void>;
    /**
     * Get current state
     */
    getState(): AmbientState;
    /**
     * Get config
     */
    getConfig(): AmbientEngineConfig;
    /**
     * Dispose and clean up
     */
    dispose(): void;
}
declare function createAmbientEngine(samplePlayer: SamplePlayer, config?: Partial<AmbientEngineConfig>): AmbientEngine;

/**
 * KAIOS Terminal Music Engine
 * Layer 3: Emotion-driven procedural music generation
 *
 * In terminal environment, this uses sample playback to create
 * emotion-appropriate musical atmospheres. For full procedural
 * synthesis, the browser version with Tone.js is recommended.
 */

interface MusicEngineConfig {
    enabled: boolean;
    volume: number;
    playOnEmotionChange: boolean;
    minPlayInterval: number;
}
interface MusicState {
    isPlaying: boolean;
    currentEmotion: EmotionToken;
    lastPlayTime: number;
    intensity: number;
}
interface MusicProfile {
    tempo: 'slow' | 'medium' | 'fast';
    energy: number;
    texture: 'smooth' | 'rough' | 'glitchy' | 'ambient';
    samples: string[];
    description: string;
}
/**
 * Music profiles for each emotion
 */
declare const MUSIC_PROFILES: Record<EmotionToken, MusicProfile>;
/**
 * Emotion-driven music engine
 * Uses sample playback to create emotional atmospheres
 */
declare class MusicEngine {
    private config;
    private samplePlayer;
    private state;
    constructor(samplePlayer: SamplePlayer, config?: Partial<MusicEngineConfig>);
    /**
     * Set current emotion and optionally play music
     */
    setEmotion(emotion: EmotionToken, intensity?: number): Promise<void>;
    /**
     * Play music appropriate for current emotion
     */
    playForEmotion(): Promise<void>;
    /**
     * Play a specific sample
     */
    play(sample: string): Promise<void>;
    /**
     * Check if enough time has passed to play again
     */
    private canPlay;
    /**
     * Get current music profile
     */
    getCurrentProfile(): MusicProfile;
    /**
     * Set enabled state
     */
    setEnabled(enabled: boolean): void;
    /**
     * Set volume (0-1)
     */
    setVolume(volume: number): void;
    /**
     * Get current state
     */
    getState(): MusicState;
    /**
     * Get config
     */
    getConfig(): MusicEngineConfig;
    /**
     * Build a music generation prompt (for use with external music AI)
     * Based on kaios-og-xi buildMusicPrompt
     */
    buildPrompt(): string;
    /**
     * Dispose and clean up
     */
    dispose(): void;
}
declare function createMusicEngine(samplePlayer: SamplePlayer, config?: Partial<MusicEngineConfig>): MusicEngine;

/**
 * KAIOS Audio Bus
 * Central hub for tracking all sounds KAIOS produces in real-time
 *
 * This enables the visualizer to "see" what KAIOS is playing
 * instead of listening to the user's microphone
 */

interface PlayingSound {
    id: string;
    file: string;
    startTime: number;
    duration: number;
    volume: number;
    category: 'sample' | 'tone' | 'ambient' | 'music';
}
interface SoundEvent$1 {
    id: string;
    file: string;
    timestamp: number;
    category: 'sample' | 'tone' | 'ambient' | 'music';
}
interface AudioBusState {
    isActive: boolean;
    currentlyPlaying: PlayingSound[];
    recentSounds: SoundEvent$1[];
    frequencyData: number[];
    emotionState: string;
    activity: number;
}
type SoundStartCallback = (sound: PlayingSound) => void;
type SoundEndCallback = (sound: PlayingSound) => void;
type StateChangeCallback = (state: AudioBusState) => void;
/**
 * Central audio bus that tracks all sounds KAIOS produces
 * Used by visualizer to display internal audio state
 */
declare class AudioBus extends EventEmitter {
    private currentlyPlaying;
    private recentSounds;
    private frequencyData;
    private emotionState;
    private soundIdCounter;
    private cleanupInterval;
    private animationInterval;
    private lastEmitTime;
    private readonly EMIT_THROTTLE_MS;
    private readonly CATEGORY_FREQUENCIES;
    constructor();
    /**
     * Start 60fps animation loop for smooth frequency updates
     */
    private startAnimationLoop;
    /**
     * Emit state change, throttled to 60fps max
     */
    private emitThrottled;
    /**
     * Register when a sound starts playing
     */
    soundStart(file: string, category?: PlayingSound['category'], volume?: number, duration?: number): string;
    /**
     * Register when a sound stops playing
     */
    soundEnd(id: string): void;
    /**
     * Set current emotion state (affects visualization)
     */
    setEmotion(emotion: string): void;
    /**
     * Get current audio state
     */
    getState(): AudioBusState;
    /**
     * Get frequency data for visualization (simulated based on playing sounds)
     */
    getFrequencyData(): number[];
    /**
     * Get list of currently playing files
     */
    getPlayingFiles(): string[];
    /**
     * Check if any sounds are playing
     */
    isPlaying(): boolean;
    /**
     * Event subscription helpers
     */
    onSoundStart(callback: SoundStartCallback): void;
    onSoundEnd(callback: SoundEndCallback): void;
    onStateChange(callback: StateChangeCallback): void;
    /**
     * Clear all playing sounds
     */
    clear(): void;
    /**
     * Dispose and clean up
     */
    dispose(): void;
    /**
     * Update frequency data with smooth animation
     * Called at 60fps from animation loop for fluid visualization
     */
    private updateFrequencies;
    /**
     * Simulate frequency data (for initial state - called on sound start)
     */
    private simulateFrequencies;
    /**
     * Calculate overall audio activity level (0-1)
     */
    private calculateActivity;
    /**
     * Start cleanup interval for expired sounds
     */
    private startCleanup;
}
/**
 * Get the global AudioBus instance
 */
declare function getAudioBus(): AudioBus;
/**
 * Create a new AudioBus instance (for isolated use)
 */
declare function createAudioBus(): AudioBus;

/**
 * KAIOS Terminal Audio Manager
 * Coordinates all 4 audio layers for terminal environment
 *
 * Layer 1: UI Tones (typing/response feedback) - ToneGenerator
 * Layer 2: Ambient Soundscape (background) - AmbientEngine
 * Layer 3: Emotion Music (procedural) - MusicEngine
 * Layer 4: Sample Library (sound markers) - SamplePlayer
 */

interface TerminalAudioConfig {
    enabled: boolean;
    masterVolume: number;
    tonesEnabled: boolean;
    ambientEnabled: boolean;
    musicEnabled: boolean;
    samplesEnabled: boolean;
    tones?: Partial<ToneGeneratorConfig>;
    ambient?: Partial<AmbientEngineConfig>;
    music?: Partial<MusicEngineConfig>;
    samples?: Partial<SamplePlayerConfig>;
}
interface AudioState {
    enabled: boolean;
    initialized: boolean;
    currentEmotion: EmotionToken;
    layers: {
        tones: boolean;
        ambient: boolean;
        music: boolean;
        samples: boolean;
    };
}
/**
 * Main audio manager for KAIOS terminal
 * Coordinates all 4 audio layers
 */
declare class TerminalAudio {
    private config;
    private state;
    private tones;
    private samples;
    private ambient;
    private music;
    constructor(config?: Partial<TerminalAudioConfig>);
    /**
     * Initialize audio system
     */
    initialize(): Promise<boolean>;
    /**
     * Enable or disable all audio
     */
    setEnabled(enabled: boolean): void;
    /**
     * Toggle a specific layer
     */
    setLayerEnabled(layer: keyof AudioState['layers'], enabled: boolean): void;
    /**
     * Set master volume (0-1)
     */
    setMasterVolume(volume: number): void;
    /**
     * Set current emotion (affects all layers)
     */
    setEmotion(emotion: EmotionToken, intensity?: number): Promise<void>;
    /**
     * Play typing feedback tone
     */
    playTypingTone(char?: string): void;
    /**
     * Play response arrival tone
     */
    playResponseTone(): void;
    /**
     * Play level up celebration
     */
    playLevelUpTone(): void;
    /**
     * Play error tone
     */
    playErrorTone(): void;
    /**
     * Start ambient soundscape
     */
    startAmbient(): void;
    /**
     * Stop ambient soundscape
     */
    stopAmbient(): void;
    /**
     * Play emotion-appropriate music
     */
    playMusic(): Promise<void>;
    /**
     * Play a specific sample
     */
    playSample(filename: string): Promise<void>;
    /**
     * Process text for sound markers and play them
     */
    processTextForSounds(text: string): Promise<string[]>;
    /**
     * Play glitch sound
     */
    playGlitch(): Promise<void>;
    /**
     * Get current audio state
     */
    getState(): AudioState;
    /**
     * Get audio bus state (for visualizer)
     * Returns real-time info about what KAIOS is playing
     */
    getAudioBusState(): AudioBusState;
    /**
     * Get frequency data from audio bus (for visualizer)
     */
    getFrequencyData(): number[];
    /**
     * Check if any sounds are currently playing
     */
    isPlayingAudio(): boolean;
    /**
     * Get configuration
     */
    getConfig(): TerminalAudioConfig;
    /**
     * Check if audio is available
     */
    isAvailable(): boolean;
    /**
     * Get layer status as formatted string
     */
    getStatusString(): string;
    /**
     * Dispose and clean up all resources
     */
    dispose(): void;
}
declare function createTerminalAudio(config?: Partial<TerminalAudioConfig>): TerminalAudio;

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
interface RecorderConfig {
    outputDir: string;
    format: 'mp3' | 'wav' | 'flac';
    sampleRate: number;
    channels: number;
    bitrate: string;
}
interface RecordingSession {
    id: string;
    startTime: number;
    endTime?: number;
    outputFile: string;
    metadata: RecordingMetadata;
}
interface RecordingMetadata {
    title: string;
    artist: string;
    album: string;
    emotions: string[];
    conversationId?: string;
    tags: string[];
}
/** A sample file that was played during recording */
interface SoundEvent {
    file: string;
    timestamp: number;
    volume: number;
    duration?: number;
}
/** A synthesized note (from SoX) that was played during recording */
interface SynthEvent {
    type: 'note' | 'pad' | 'chord';
    note: string;
    freq: number;
    duration: number;
    velocity: number;
    timestamp: number;
    soxArgs: string[];
}
declare class AudioRecorder {
    private config;
    private currentSession;
    private isRecording;
    private soundLog;
    private synthLog;
    private recordingStartTime;
    constructor(config?: Partial<RecorderConfig>);
    /**
     * Check if ffmpeg is available
     */
    checkFfmpeg(): Promise<boolean>;
    /**
     * Check if sox is available (needed for synth reconstruction)
     */
    checkSox(): Promise<boolean>;
    /**
     * Get available audio input devices (for reference, not used in log+reconstruct)
     */
    getAudioDevices(): Promise<string[]>;
    /**
     * Start recording - begins logging sound events
     */
    startRecording(metadata?: Partial<RecordingMetadata>): Promise<RecordingSession | null>;
    /**
     * Log a sample file being played
     */
    logSound(file: string, volume: number, duration?: number): void;
    /**
     * Log a synthesized note being played
     */
    logSynthNote(event: Omit<SynthEvent, 'timestamp'>): void;
    /**
     * Stop recording and reconstruct the audio file
     */
    stopRecording(): Promise<RecordingSession | null>;
    /**
     * Reconstruct the audio from logged events
     */
    private reconstructAudio;
    /**
     * Run ffmpeg with given args
     */
    private runFfmpeg;
    /**
     * Save session metadata to JSON file
     */
    private saveMetadata;
    /**
     * Check if currently recording
     */
    isCurrentlyRecording(): boolean;
    /**
     * Get current session info
     */
    getCurrentSession(): RecordingSession | null;
    /**
     * Add emotion to current session
     */
    addEmotion(emotion: string): void;
    /**
     * Get recording duration in seconds
     */
    getRecordingDuration(): number;
    /**
     * Get event counts for status display
     */
    getEventCounts(): {
        sounds: number;
        synth: number;
    };
    /**
     * List all recordings
     */
    listRecordings(): string[];
}
declare function setGlobalRecorder(recorder: AudioRecorder): void;
declare function getGlobalRecorder(): AudioRecorder | null;
declare function createAudioRecorder(config?: Partial<RecorderConfig>): AudioRecorder;

/**
 * SoX Synthesizer for KAIOS Piano - C418 Minecraft Style
 *
 * Generates warm, ambient, lush piano tones inspired by C418's Minecraft soundtrack
 * Pure sine waves with soft attacks, long decay, and reverb
 * 432Hz tuning for that ethereal, healing frequency
 */
interface SoxSynthConfig {
    enabled: boolean;
    volume: number;
    attack: number;
    sustain: number;
    decay: number;
    reverb: number;
    warmth: number;
}
declare class SoxSynth {
    private config;
    private soxAvailable;
    private activeProcesses;
    constructor(config?: Partial<SoxSynthConfig>);
    private checkSox;
    /**
     * Play a C418-style ambient piano note
     * Warm sine waves with soft attack, long decay, and lush reverb
     * Inspired by Minecraft's "Sweden", "Wet Hands", "Mice on Venus"
     */
    playNote(note: string, durationMs?: number, velocity?: number): Promise<void>;
    /**
     * Play a pad note - sustained, ambient, like background texture
     * These layer under the piano notes for that full C418 sound
     */
    playPad(note: string, durationMs?: number, velocity?: number): Promise<void>;
    /**
     * Play a chord - C418 style with arpeggiated strum
     * Notes gently cascade with organic timing
     */
    playChord(notes: string[], durationMs?: number, velocity?: number): Promise<void>;
    /**
     * Play a gentle arpeggio - notes flowing upward or downward
     * Very C418 - like "Sweden" or "Wet Hands"
     */
    playArpeggio(notes: string[], durationMs?: number, velocity?: number, direction?: 'up' | 'down'): Promise<void>;
    /**
     * Stop all active sounds
     */
    stop(): void;
    /**
     * Check if SoX is available
     */
    isAvailable(): boolean;
    /**
     * Set volume
     */
    setVolume(vol: number): void;
    /**
     * Enable/disable
     */
    setEnabled(enabled: boolean): void;
    /**
     * Get note frequency
     */
    getFrequency(note: string): number;
}
declare function getSoxSynth(): SoxSynth;
declare function createSoxSynth(config?: Partial<SoxSynthConfig>): SoxSynth;

export { AMBIENT_SETS, AmbientEngine, type AmbientEngineConfig, type AmbientState, AudioBus, type AudioBusState, AudioRecorder, type AudioState, BASE_FREQUENCY, EMOTIONAL_SAMPLES, EMOTION_FREQUENCY_OFFSET, EMOTION_TO_MOOD, GLITCH_PATTERNS, MUSIC_PROFILES, MusicEngine, type MusicEngineConfig, type MusicProfile, type MusicState, type PlayingSound, type RecorderConfig, type RecordingMetadata, type RecordingSession, type SoundEvent as RecordingSoundEvent, SCALE_432, SOUND_MAPPINGS, SamplePlayer, type SamplePlayerConfig, type SoundEvent$1 as SoundEvent, type SoundMapping, SoxSynth, type SoxSynthConfig, type SynthEvent, TerminalAudio, type TerminalAudioConfig, ToneGenerator, type ToneGeneratorConfig, type ToneOptions, createAmbientEngine, createAudioBus, createAudioRecorder, createMusicEngine, createSamplePlayer, createSoxSynth, createTerminalAudio, createToneGenerator, extractSoundMarkers, getAudioBus, getGlobalRecorder, getSoxSynth, setGlobalRecorder };
