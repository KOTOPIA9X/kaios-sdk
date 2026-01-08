import { h as AudioConfig, A as AudioProfile, g as SentimentData, G as GeneratedAudio } from '../types-BNd-Zg3U.cjs';
export { e as emotionToSound, s as soundToEmotion } from '../emotion-mapper-BgYPecGc.cjs';

/**
 * Audio Engine - Core sound intelligence processing
 * Handles audio generation, effects, and sound synthesis
 */

interface AudioEngineConfig extends AudioConfig {
    sampleRate?: number;
    channels?: number;
}
/**
 * Main audio engine for Sound Intelligence
 */
declare class AudioEngine {
    private config;
    private audioContext;
    private isInitialized;
    constructor(config: AudioEngineConfig);
    /**
     * Initialize audio context (must be called after user interaction in browser)
     */
    initialize(): Promise<void>;
    /**
     * Map emotions to sound characteristics
     */
    mapEmotionToSound(params: {
        emotion: string;
        valence: number;
        arousal: number;
        intensity: number;
    }): AudioProfile;
    /**
     * Generate sentiment-driven music
     * In production, this would integrate with audio generation APIs
     */
    generateMusic(params: {
        sentiment: SentimentData;
        style: string;
        duration: number;
    }): Promise<GeneratedAudio | null>;
    /**
     * Generate a simple tone based on emotion
     * This is a basic example - real implementation would be more sophisticated
     */
    generateTone(params: {
        frequency: number;
        duration: number;
        type?: OscillatorType;
    }): Promise<void>;
    /**
     * Play a sound effect based on emotion
     */
    playSoundEffect(emotion: string, intensity?: number): Promise<void>;
    /**
     * Get current capabilities
     */
    getCapabilities(): {
        musicGeneration: boolean;
        voiceSynthesis: boolean;
        spatialAudio: boolean;
        effectsChain: string[];
    };
    /**
     * Suspend audio context (save resources)
     */
    suspend(): Promise<void>;
    /**
     * Resume audio context
     */
    resume(): Promise<void>;
    /**
     * Clean up resources
     */
    dispose(): void;
}

/**
 * Effects Chain - Audio effects processing for Sound Intelligence
 * Provides reverb, delay, glitch, and other effects
 */
interface EffectParams {
    name: string;
    params: Record<string, number>;
}
interface ReverbParams {
    roomSize: number;
    damping: number;
    wetDry: number;
}
interface DelayParams {
    time: number;
    feedback: number;
    wetDry: number;
}
interface GlitchParams {
    amount: number;
    type: 'stutter' | 'bitcrush' | 'tape';
}
interface ChorusParams {
    rate: number;
    depth: number;
    wetDry: number;
}
interface DistortionParams {
    amount: number;
    type: 'soft' | 'hard' | 'fuzz';
}
/**
 * Audio effects chain processor
 */
declare class EffectsChain {
    private audioContext;
    private effects;
    constructor(audioContext?: AudioContext);
    /**
     * Set audio context
     */
    setContext(context: AudioContext): void;
    /**
     * Apply reverb effect
     */
    applyReverb(inputNode: AudioNode, params: ReverbParams): Promise<AudioNode>;
    /**
     * Apply delay effect
     */
    applyDelay(inputNode: AudioNode, params: DelayParams): AudioNode;
    /**
     * Apply chorus effect
     */
    applyChorus(inputNode: AudioNode, params: ChorusParams): AudioNode;
    /**
     * Apply distortion effect
     */
    applyDistortion(inputNode: AudioNode, params: DistortionParams): AudioNode;
    /**
     * Apply glitch/stutter effect
     */
    applyGlitch(inputNode: AudioNode, params: GlitchParams): AudioNode;
    /**
     * Adjust an effect's parameters
     */
    adjustEffect(name: string, params: Record<string, number>): void;
    /**
     * Remove all effects
     */
    clear(): void;
    /**
     * Dispose of all resources
     */
    dispose(): void;
    private generateImpulseResponse;
    private generateDistortionCurve;
    private applyBitcrush;
}

export { AudioEngine, type AudioEngineConfig, type EffectParams, EffectsChain };
