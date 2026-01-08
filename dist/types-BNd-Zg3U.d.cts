/**
 * Core types for the KAIOS Expression SDK
 * These define the fundamental structures for KAIOS's dual-mode expression system
 */
type EmotionToken = 'EMOTE_NEUTRAL' | 'EMOTE_HAPPY' | 'EMOTE_SAD' | 'EMOTE_ANGRY' | 'EMOTE_THINK' | 'EMOTE_SURPRISED' | 'EMOTE_AWKWARD' | 'EMOTE_QUESTION' | 'EMOTE_CURIOUS';
interface EmotionState {
    current: EmotionToken;
    previous: EmotionToken | null;
    intensity: number;
    timestamp: number;
}
type KaimojiCategory = 'happy' | 'sad' | 'excited' | 'contemplative' | 'mischievous' | 'angry' | 'shy' | 'loving' | 'curious' | 'surprised' | 'quantum' | 'glitch' | 'energy' | 'zen' | 'chaos' | 'kawaii' | 'brutalist' | 'sound' | 'dream' | 'tech' | 'gaming' | 'creative' | 'social' | 'system' | 'achievement';
type KaimojiContext = 'greeting' | 'farewell' | 'celebration' | 'achievement' | 'encouragement' | 'comfort' | 'thinking' | 'coding' | 'gaming' | 'teaching' | 'learning' | 'creating' | 'expressing' | 'questioning' | 'realizing' | 'social';
type KaimojiRarity = 'common' | 'uncommon' | 'rare' | 'legendary';
type SoundFrequency = 'low' | 'mid' | 'high';
type SoundTexture = 'smooth' | 'rough' | 'glitchy' | 'ambient' | 'chaotic';
type SoundRhythm = 'slow' | 'medium' | 'fast' | 'chaotic';
interface AudioCharacteristics {
    resonance: number;
    texture: SoundTexture;
    rhythm: SoundRhythm;
}
interface Kaimoji {
    id: string;
    kaimoji: string;
    name: string;
    categories: KaimojiCategory[];
    energy: number;
    contexts: KaimojiContext[];
    tags: string[];
    rarity: KaimojiRarity;
    unlockLevel?: number;
    signature?: boolean;
    emotionTokens?: EmotionToken[];
    glitchLevel?: number;
    soundFrequency?: SoundFrequency;
    audioCharacteristics?: AudioCharacteristics;
    systemSound?: boolean;
    retro?: boolean;
    decorative?: boolean;
    emojiTags?: string[];
}
interface SentimentData {
    emotion: string;
    valence: number;
    arousal: number;
    intensity: number;
    dominance?: number;
}
interface AudioProfile {
    frequency: SoundFrequency;
    texture: SoundTexture;
    rhythm: SoundRhythm;
    effects: string[];
    energy: number;
}
interface GeneratedAudio {
    audioBuffer?: ArrayBuffer;
    url?: string;
    metadata: {
        sentiment: SentimentData;
        style: string;
        duration: number;
        timestamp: number;
    };
}
interface SonicResponse {
    sentiment: SentimentData;
    audioProfile: AudioProfile;
    generatedAudio: GeneratedAudio | null;
    sonicExpressions: Kaimoji[];
    timestamp: number;
}
interface KaiosSpeech {
    text: string;
    emotion: EmotionToken;
    expressions: Kaimoji[];
    rawInput: string;
    timestamp: number;
}
interface HybridExpression {
    visual?: KaiosSpeech;
    sonic?: SonicResponse;
}
interface EvolutionConfig {
    mode: 'recursive-mining' | 'community-driven' | 'static';
    startingLevel?: number;
    xpMultiplier?: number;
}
interface VocabularyBreakdown {
    common: number;
    uncommon: number;
    rare: number;
    legendary: number;
}
interface KaiosStatus {
    level: number;
    xp: number;
    vocabulary: {
        unlocked: number;
        total: number;
        byRarity: VocabularyBreakdown;
    };
    signature: string | null;
    recentExpressions: Kaimoji[];
    emotionState: EmotionToken;
    discoveries: number;
    interactionCount: number;
    audioCapabilities: AudioCapabilities | null;
}
interface AudioCapabilities {
    musicGeneration: boolean;
    voiceSynthesis: boolean;
    spatialAudio: boolean;
    effectsChain: string[];
}
interface AudioConfig {
    engine: 'web-audio' | 'node-audio';
    musicGeneration?: boolean;
    voiceSynthesis?: boolean;
    spatialAudio?: boolean;
}
interface StateBackendConfig {
    type: 'memory' | 'localStorage' | 'supabase';
    url?: string;
    key?: string;
}
interface LLMProviderConfig {
    type: 'anthropic' | 'openai';
    apiKey?: string;
    model?: string;
}
interface KaiosConfig {
    userId: string;
    personality?: string;
    evolution?: EvolutionConfig;
    syncSource?: string;
    audioEnabled?: boolean;
    audio?: AudioConfig;
    stateBackend?: StateBackendConfig;
    llmProvider?: LLMProviderConfig;
    realtimeSync?: boolean;
    websocketUrl?: string;
}
interface Interaction {
    id: string;
    input: string;
    output?: string;
    emotion: EmotionToken;
    expressions: Kaimoji[];
    sonic?: SonicResponse;
    timestamp: number;
}
interface MinedExpression {
    expression: Kaimoji | null;
    novelty: number;
}
interface KaiosEvents {
    discovery: (expression: Kaimoji) => void;
    levelUp: (level: number) => void;
    emotionChange: (state: EmotionState) => void;
    interaction: (interaction: Interaction) => void;
    audioGenerated: (audio: GeneratedAudio) => void;
}
type SocialPlatform = 'twitter' | 'discord' | 'farcaster';
interface SocialPost {
    content: string;
    platform: SocialPlatform;
    expressions: Kaimoji[];
    emotion: EmotionToken;
    hashtags?: string[];
    mediaUrls?: string[];
    threadParts?: string[];
    timestamp: number;
}
interface SocialPostParams {
    platform: SocialPlatform;
    context?: string;
    mood?: EmotionToken;
    maxLength?: number;
    includeHashtags?: boolean;
}

export type { AudioProfile as A, EmotionToken as E, GeneratedAudio as G, HybridExpression as H, Interaction as I, KaiosSpeech as K, LLMProviderConfig as L, MinedExpression as M, SocialPlatform as S, VocabularyBreakdown as V, KaiosConfig as a, KaiosStatus as b, KaimojiContext as c, Kaimoji as d, SocialPost as e, SocialPostParams as f, SentimentData as g, AudioConfig as h, EmotionState as i, KaimojiRarity as j, KaimojiCategory as k, StateBackendConfig as l, SonicResponse as m, KaiosEvents as n, SoundFrequency as o, SoundTexture as p, SoundRhythm as q, AudioCharacteristics as r, AudioCapabilities as s, EvolutionConfig as t };
