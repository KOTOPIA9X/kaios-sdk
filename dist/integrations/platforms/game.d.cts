import { K as Kaios } from '../../Kaios-DXAvO9nu.cjs';
import { a as KaiosConfig, E as EmotionToken, A as AudioProfile, K as KaiosSpeech } from '../../types-DwXbfpBp.cjs';
import 'eventemitter3';

/**
 * Game engine utilities for KAIOS
 * Provides helpers for Three.js and other game engines
 */

/**
 * Create a KAIOS instance configured for games
 */
declare function createGameKaios(config: KaiosConfig & {
    spatialAudio?: boolean;
    realtimeSync?: boolean;
}): Kaios;
/**
 * Animation state from emotion
 */
interface EmotionAnimationState {
    animation: string;
    speed: number;
    intensity: number;
    particleEffect?: string;
}
/**
 * Map emotion to animation state
 */
declare function getEmotionAnimation(emotion: EmotionToken): EmotionAnimationState;
/**
 * Convert audio profile to frequency in Hz for oscillators
 */
declare function audioProfileToFrequency(profile: AudioProfile): number;
/**
 * Get oscillator type from audio profile
 */
declare function getOscillatorType(profile: AudioProfile): OscillatorType;
/**
 * Speech bubble configuration
 */
interface SpeechBubbleConfig {
    text: string;
    expression: string;
    emotion: EmotionToken;
    duration: number;
    position?: {
        x: number;
        y: number;
        z: number;
    };
}
/**
 * Create speech bubble configuration from KAIOS speech
 */
declare function createSpeechBubble(speech: KaiosSpeech, duration?: number): SpeechBubbleConfig;
/**
 * Color configuration for emotions
 */
interface EmotionColor {
    primary: number;
    secondary: number;
    glow: number;
    intensity: number;
}
/**
 * Get color configuration for emotion (hex values)
 */
declare function getEmotionColors(emotion: EmotionToken): EmotionColor;
/**
 * NPC behavior parameters from emotion
 */
interface NPCBehavior {
    movementSpeed: number;
    lookAroundInterval: number;
    idleAnimationVariation: number;
    interactionRadius: number;
    responseDelay: number;
}
/**
 * Get NPC behavior parameters based on emotion
 */
declare function getNPCBehavior(emotion: EmotionToken): NPCBehavior;

export { type EmotionAnimationState, type EmotionColor, Kaios, type NPCBehavior, type SpeechBubbleConfig, audioProfileToFrequency, createGameKaios, createSpeechBubble, getEmotionAnimation, getEmotionColors, getNPCBehavior, getOscillatorType };
