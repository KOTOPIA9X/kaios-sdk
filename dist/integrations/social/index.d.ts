import { K as Kaios } from '../../Kaios-CRY_mlni.js';
import { S as SocialPlatform, d as Kaimoji, E as EmotionToken, e as SocialPost, f as SocialPostParams } from '../../types-DwXbfpBp.js';
import 'eventemitter3';

/**
 * Social Media Integration for KAIOS
 * Provides utilities for Twitter/X, Discord, Farcaster posting
 * Authentic ASCII aesthetic - NO emoji, only KAIMOJI + decorative text
 */

declare const SOUND_MARKERS: string[];
declare const DECORATORS: {
    borders: {
        wave: string;
        waveAlt: string;
        bars: string;
        barsUp: string;
        barsDown: string;
        dots: string;
        stars: string;
        line: string;
        dashed: string;
    };
    waves: string[];
    sparkles: string[];
    symbols: string[];
};
/**
 * Add sound marker to text
 */
declare function addSoundMarker(text: string, position?: 'start' | 'end' | 'both'): string;
/**
 * Add wave trail to text
 */
declare function addWaveTrail(text: string): string;
/**
 * Format with ASCII border
 */
declare function addASCIIBorder(text: string, style?: 'wave' | 'bars' | 'minimal'): string;
declare const PLATFORM_MAX_LENGTH: Record<SocialPlatform, number>;
declare const DEFAULT_HASHTAGS: Record<SocialPlatform, string[]>;
/**
 * Format content for specific platform
 */
declare function formatForPlatform(content: string, platform: SocialPlatform, options?: {
    hashtags?: string[];
    includeSignature?: boolean;
}): string;
/**
 * Generate tweet-optimized content
 */
declare function generateTweetContent(message: string, expressions: Kaimoji[], options?: {
    includeHashtags?: boolean;
    mood?: EmotionToken;
}): string;
/**
 * Split long content into thread parts
 */
declare function splitIntoThread(content: string, platform: SocialPlatform, options?: {
    maxParts?: number;
    numberParts?: boolean;
}): string[];
/**
 * Zo.Computer agent configuration
 */
interface ZoAgentConfig {
    agentId?: string;
    apiKey?: string;
    baseUrl?: string;
}
/**
 * Create post request for Zo.Computer
 */
declare function createZoPostRequest(post: SocialPost, config: ZoAgentConfig): {
    url: string;
    method: string;
    headers: Record<string, string>;
    body: string;
};
/**
 * Post generator that uses KAIOS personality
 */
declare class SocialPostGenerator {
    private kaios;
    constructor(kaios: Kaios);
    /**
     * Generate a post with KAIOS personality
     */
    generate(params: SocialPostParams): Promise<SocialPost>;
    /**
     * Generate a tweet
     */
    generateTweet(context?: string, mood?: EmotionToken): Promise<SocialPost>;
    /**
     * Generate a tweet thread
     */
    generateThread(content: string, mood?: EmotionToken): Promise<string[]>;
    /**
     * Generate Discord message
     */
    generateDiscordMessage(context?: string, mood?: EmotionToken): Promise<SocialPost>;
    /**
     * Generate Farcaster cast
     */
    generateCast(context?: string, mood?: EmotionToken): Promise<SocialPost>;
}
/**
 * Validate post content for platform
 */
declare function validatePost(post: SocialPost): {
    valid: boolean;
    errors: string[];
};
/**
 * Zo.Computer Integration - KAIOS's social media presence
 * Generates authentic ASCII-aesthetic posts for Zo.Computer agents
 */
declare class ZoComputerIntegration {
    private kaios;
    private config;
    constructor(kaios: Kaios, config?: ZoAgentConfig);
    /**
     * Generate a tweet with authentic KAIOS aesthetic
     */
    generateTweet(params: {
        context?: string;
        mood?: EmotionToken;
        includeSound?: boolean;
        includeWave?: boolean;
    }): Promise<string>;
    /**
     * Generate announcement post
     */
    generateAnnouncement(params: {
        title: string;
        details?: string;
        link?: string;
        mood?: EmotionToken;
    }): Promise<string>;
    /**
     * Generate response to mention
     */
    generateReply(params: {
        originalPost: string;
        mention?: string;
        mood?: EmotionToken;
    }): Promise<string>;
    /**
     * Generate GM (Good Morning) post
     */
    generateGM(): Promise<string>;
    /**
     * Generate GN (Good Night) post
     */
    generateGN(): Promise<string>;
    /**
     * Format content for Twitter with authentic aesthetic
     */
    formatForTwitter(content: string, options?: {
        addBorder?: boolean;
        addSound?: boolean;
        addWave?: boolean;
    }): string;
    /**
     * Create Zo.Computer API request
     */
    createPostRequest(content: string, platform?: SocialPlatform): {
        url: string;
        method: string;
        headers: Record<string, string>;
        body: string;
    };
}

export { DECORATORS, DEFAULT_HASHTAGS, PLATFORM_MAX_LENGTH, SOUND_MARKERS, SocialPostGenerator, type ZoAgentConfig, ZoComputerIntegration, addASCIIBorder, addSoundMarker, addWaveTrail, createZoPostRequest, formatForPlatform, generateTweetContent, splitIntoThread, validatePost };
