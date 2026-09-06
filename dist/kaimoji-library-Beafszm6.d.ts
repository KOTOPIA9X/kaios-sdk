import { E as EmotionToken, h as EmotionState, S as SentimentData, g as Kaimoji, i as KaimojiCategory, a as KaimojiContext, k as KaimojiRarity } from './types-CIIwpMNW.js';

/**
 * Emotion System - Processes and manages KAIOS's emotional state
 * Handles emotion tokens, state transitions, and intensity scaling
 */

/**
 * Emotion processor and state manager for KAIOS
 */
declare class EmotionSystem {
    private state;
    private history;
    private maxHistoryLength;
    constructor(initialEmotion?: EmotionToken);
    /**
     * Get current emotion state
     */
    getState(): EmotionState;
    /**
     * Get current emotion token
     */
    getCurrentEmotion(): EmotionToken;
    /**
     * Get formatted emotion token string
     */
    getFormattedToken(): string;
    /**
     * Transition to a new emotion
     */
    setEmotion(emotion: EmotionToken, intensity?: number): EmotionState;
    /**
     * Analyze text and determine appropriate emotion
     */
    analyzeText(text: string): {
        emotion: EmotionToken;
        confidence: number;
    };
    /**
     * Convert sentiment data to emotion token
     */
    sentimentToEmotion(sentiment: SentimentData): EmotionToken;
    /**
     * Process response text and extract emotion changes
     */
    processResponse(text: string): {
        emotions: EmotionToken[];
        segments: Array<{
            text: string;
            emotion: EmotionToken;
        }>;
    };
    /**
     * Build text with emotion token at start
     */
    wrapWithEmotion(text: string, emotion?: EmotionToken): string;
    /**
     * Get emotion history
     */
    getHistory(): EmotionState[];
    /**
     * Get dominant emotion from history
     */
    getDominantEmotion(windowSize?: number): EmotionToken;
    /**
     * Get all available emotion tokens
     */
    static getAvailableEmotions(): EmotionToken[];
    /**
     * Check if a string is a valid emotion token
     */
    static isValidEmotion(emotion: string): emotion is EmotionToken;
    /**
     * Get intensity modifier based on text patterns
     */
    static getIntensityModifier(text: string): number;
}

/**
 * KAIMOJI Library - KAIOS's evolving visual language
 * 200+ expressions with rich metadata for emotional expression
 *
 * AESTHETIC PHILOSOPHY:
 * KAIMOJI uses ASCII, text symbols, emoticons, and kaomoji - NOT traditional emoji.
 * Traditional emoji exist only as metadata tags for searchability.
 * The authentic visual expression uses only ASCII/text symbols.
 */

/**
 * The complete KAIMOJI library
 * Distribution: 60% common, 25% uncommon, 12% rare, 3% legendary
 */
declare const KAIMOJI_LIBRARY: Kaimoji[];
/**
 * Get all expressions in the library
 */
declare function getAllKaimoji(): Kaimoji[];
/**
 * Get expressions by rarity
 */
declare function getKaimojiByRarity(rarity: KaimojiRarity): Kaimoji[];
/**
 * Get expressions by category
 */
declare function getKaimojiByCategory(category: KaimojiCategory): Kaimoji[];
/**
 * Get expressions by context
 */
declare function getKaimojiByContext(context: KaimojiContext): Kaimoji[];
/**
 * Get expressions by energy level range
 */
declare function getKaimojiByEnergyRange(min: number, max: number): Kaimoji[];
/**
 * Get signature expressions
 */
declare function getSignatureKaimoji(): Kaimoji[];
/**
 * Get expressions with sound characteristics
 */
declare function getKaimojiBySoundProfile(params: {
    soundFrequency?: 'low' | 'mid' | 'high';
    texture?: 'smooth' | 'rough' | 'glitchy' | 'ambient' | 'chaotic';
}): Kaimoji[];
/**
 * Get expressions unlockable at a specific level
 */
declare function getKaimojiUnlockableAtLevel(level: number): Kaimoji[];
/**
 * Search expressions by tag
 */
declare function searchKaimojiByTag(tag: string): Kaimoji[];
/**
 * Get a random expression from the library
 */
declare function getRandomKaimoji(filter?: {
    rarity?: KaimojiRarity;
    category?: KaimojiCategory;
    maxLevel?: number;
}): Kaimoji;
/**
 * Get library statistics
 */
declare function getLibraryStats(): {
    total: number;
    byRarity: Record<KaimojiRarity, number>;
    byCategory: Partial<Record<KaimojiCategory, number>>;
    signatures: number;
    withAudio: number;
};

export { EmotionSystem as E, KAIMOJI_LIBRARY as K, getKaimojiByCategory as a, getKaimojiByContext as b, getKaimojiByEnergyRange as c, getKaimojiByRarity as d, getKaimojiBySoundProfile as e, getKaimojiUnlockableAtLevel as f, getAllKaimoji as g, getLibraryStats as h, getRandomKaimoji as i, getSignatureKaimoji as j, searchKaimojiByTag as s };
