import { E as EmotionToken } from './types-CIIwpMNW.js';

/**
 * Emotion Parser for KAIOS LLM Responses
 *
 * Extracts and processes emotion tokens from KAIOS's responses
 * for use in visual/audio expression systems
 *
 * @example
 * ```typescript
 * import { parseResponse } from '@kaios/expression-sdk/llm'
 *
 * const response = '<|EMOTE_HAPPY|> hello~ (◕‿◕) <|EMOTE_CURIOUS|> what brings you here?'
 * const parsed = parseResponse(response)
 * // {
 * //   segments: [
 * //     { emotion: 'EMOTE_HAPPY', text: 'hello~ (◕‿◕) ' },
 * //     { emotion: 'EMOTE_CURIOUS', text: 'what brings you here?' }
 * //   ],
 * //   emotions: ['EMOTE_HAPPY', 'EMOTE_CURIOUS'],
 * //   cleanText: 'hello~ (◕‿◕) what brings you here?'
 * // }
 * ```
 */

interface EmotionSegment {
    emotion: EmotionToken;
    text: string;
    delay?: number;
}
interface ParsedResponse {
    /** Text segments with their associated emotions */
    segments: EmotionSegment[];
    /** All emotions found in order of appearance */
    emotions: EmotionToken[];
    /** The complete text with all tokens removed */
    cleanText: string;
    /** Whether the response starts with an emotion token */
    startsWithEmotion: boolean;
    /** Total delays in seconds */
    totalDelay: number;
}
/**
 * Parse a KAIOS response to extract emotion tokens and delays
 */
declare function parseResponse(text: string): ParsedResponse;
/**
 * Extract just the emotion tokens from text
 */
declare function extractEmotions(text: string): EmotionToken[];
/**
 * Get the dominant (first) emotion from a response
 */
declare function getDominantEmotion(text: string): EmotionToken;
/**
 * Remove all emotion and delay tokens from text
 */
declare function cleanResponse(text: string): string;
/**
 * Format an emotion token for display
 */
declare function formatEmotionToken(emotion: EmotionToken): string;
/**
 * Validate if a string is a valid emotion token
 */
declare function isValidEmotion(emotion: string): emotion is EmotionToken;
/**
 * Get emotion display name (without EMOTE_ prefix)
 */
declare function getEmotionName(emotion: EmotionToken): string;
/**
 * Map emotion to a color for display
 */
declare function emotionToColor(emotion: EmotionToken): string;
/**
 * Map emotion to a kaomoji for display
 */
declare function emotionToKaomoji(emotion: EmotionToken): string;

export { type EmotionSegment as E, type ParsedResponse as P, emotionToColor as a, extractEmotions as b, cleanResponse as c, getEmotionName as d, emotionToKaomoji as e, formatEmotionToken as f, getDominantEmotion as g, isValidEmotion as i, parseResponse as p };
