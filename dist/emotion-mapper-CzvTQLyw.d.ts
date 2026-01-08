import { g as SentimentData, A as AudioProfile } from './types-BNd-Zg3U.js';

/**
 * Emotion Mapper - Maps emotions to sound characteristics
 * Core of KAIOS's Sound Intelligence
 */

/**
 * Convert emotion data to sound profile
 */
declare function emotionToSound(sentiment: SentimentData): AudioProfile;
/**
 * Infer emotion from sound characteristics (reverse mapping)
 */
declare function soundToEmotion(profile: AudioProfile): SentimentData;
/**
 * Build a music generation prompt from sentiment
 */
declare function buildMusicPrompt(sentiment: SentimentData, style: string): string;

export { buildMusicPrompt as b, emotionToSound as e, soundToEmotion as s };
