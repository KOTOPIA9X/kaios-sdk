import EventEmitter from 'eventemitter3';
import { d as Kaimoji, V as VocabularyBreakdown, E as EmotionToken, c as KaimojiContext, i as KaimojiCategory, j as SoundFrequency, k as SoundTexture, l as EvolutionConfig, m as KaiosEvents, a as KaiosConfig, K as KaiosSpeech, g as SentimentData, n as SonicResponse, H as HybridExpression, b as KaiosStatus, M as MinedExpression, f as SocialPostParams, e as SocialPost, I as Interaction } from './types-DwXbfpBp.cjs';

/**
 * Vocabulary Manager - Manages KAIOS's KAIMOJI vocabulary
 * Handles unlocking, progression, and expression selection
 */

interface UsageRecord {
    id: string;
    count: number;
    lastUsed: number;
}
interface VocabularyConfig {
    startingLevel?: number;
    unlockAll?: boolean;
}
/**
 * Manages KAIOS's expression vocabulary
 */
declare class VocabularyManager {
    private state;
    private level;
    private library;
    constructor(config?: VocabularyConfig);
    /**
     * Unlock all expressions available at current level
     */
    unlockForLevel(level: number): void;
    /**
     * Unlock all expressions (for testing/development)
     */
    unlockAll(): void;
    /**
     * Unlock a specific expression
     */
    unlock(kaimoji: Kaimoji): boolean;
    /**
     * Check if an expression is unlocked
     */
    isUnlocked(id: string): boolean;
    /**
     * Get all unlocked expressions
     */
    getUnlockedExpressions(): Kaimoji[];
    /**
     * Get count of unlocked expressions
     */
    getUnlockedCount(): number;
    /**
     * Get total count of expressions
     */
    getTotalCount(): number;
    /**
     * Get breakdown by rarity
     */
    getRarityBreakdown(): VocabularyBreakdown;
    /**
     * Select expressions based on criteria
     */
    select(params: {
        emotion?: EmotionToken;
        context?: KaimojiContext;
        category?: KaimojiCategory;
        energy?: {
            min?: number;
            max?: number;
        };
        onlyUnlocked?: boolean;
        limit?: number;
        excludeRecent?: boolean;
    }): Kaimoji[];
    /**
     * Select expressions by sound profile (for Sound Intelligence)
     */
    selectBySoundProfile(params: {
        soundFrequency?: SoundFrequency;
        texture?: SoundTexture;
        energy?: number;
        onlyUnlocked?: boolean;
    }): Kaimoji[];
    /**
     * Record usage of an expression
     */
    recordUsage(id: string): void;
    /**
     * Get recently used expressions
     */
    getRecentlyUsed(limit?: number): Kaimoji[];
    /**
     * Get most frequently used expressions
     */
    getMostUsed(limit?: number): Kaimoji[];
    /**
     * Add to favorites
     */
    addFavorite(id: string): boolean;
    /**
     * Remove from favorites
     */
    removeFavorite(id: string): boolean;
    /**
     * Get favorite expressions
     */
    getFavorites(): Kaimoji[];
    /**
     * Add community expressions
     */
    addCommunityExpressions(expressions: Kaimoji[]): void;
    /**
     * Get expression by ID
     */
    getById(id: string): Kaimoji | undefined;
    /**
     * Search expressions
     */
    search(query: string): Kaimoji[];
    /**
     * Get current level
     */
    getLevel(): number;
    /**
     * Set level and unlock new expressions
     */
    setLevel(level: number): Kaimoji[];
    /**
     * Export state for persistence
     */
    exportState(): {
        unlockedIds: string[];
        usageHistory: Array<UsageRecord>;
        favorites: string[];
        communityExpressions: Kaimoji[];
        level: number;
    };
    /**
     * Import state from persistence
     */
    importState(state: {
        unlockedIds?: string[];
        usageHistory?: Array<UsageRecord>;
        favorites?: string[];
        communityExpressions?: Kaimoji[];
        level?: number;
    }): void;
    /**
     * Map emotion token to category
     */
    private emotionToCategory;
    /**
     * Weighted random selection
     * Prefers uncommon/rare expressions that haven't been used recently
     */
    private weightedSelect;
}

/**
 * Evolution System - Tracks KAIOS's growth and development
 * Handles XP, leveling, discoveries, and signature style emergence
 */

interface Discovery$1 {
    id: string;
    expression: Kaimoji;
    noveltyScore: number;
    timestamp: number;
    submitted: boolean;
}
interface SignatureStyle {
    preferredCategories: KaimojiCategory[];
    preferredEmotions: EmotionToken[];
    averageEnergy: number;
    glitchAffinity: number;
    description: string;
}
interface Milestone {
    id: string;
    name: string;
    description: string;
    unlockedAt: number;
}
interface StreakData {
    current: number;
    longest: number;
    lastInteraction: number;
}
/**
 * Evolution events
 */
interface EvolutionEvents {
    levelUp: (level: number) => void;
    discovery: (discovery: Discovery$1) => void;
    milestone: (milestone: Milestone) => void;
    streakUpdate: (streak: StreakData) => void;
    signatureEvolved: (style: SignatureStyle) => void;
}
/**
 * Tracks KAIOS's evolution and growth over time
 */
declare class EvolutionTracker extends EventEmitter<EvolutionEvents> {
    private state;
    private config;
    private usageStats;
    constructor(config?: EvolutionConfig);
    /**
     * Get current level
     */
    getLevel(): number;
    /**
     * Get current XP
     */
    getXP(): number;
    /**
     * Get XP required for next level
     */
    getXPForNextLevel(): number;
    /**
     * Get XP progress as percentage
     */
    getLevelProgress(): number;
    /**
     * Award XP for an action
     */
    awardXP(amount: number, _reason: string): {
        leveledUp: boolean;
        newLevel?: number;
    };
    /**
     * Record interaction for XP and stats
     */
    recordInteraction(params: {
        emotion: EmotionToken;
        categories: KaimojiCategory[];
        energy: number;
        glitchLevel?: number;
    }): void;
    /**
     * Record a discovery
     */
    recordDiscovery(expression: Kaimoji, noveltyScore: number): Discovery$1;
    /**
     * Get discovery count
     */
    getDiscoveryCount(): number;
    /**
     * Get all discoveries
     */
    getDiscoveries(): Discovery$1[];
    /**
     * Get unsubmitted discoveries
     */
    getUnsubmittedDiscoveries(): Discovery$1[];
    /**
     * Mark discoveries as submitted
     */
    markDiscoveriesSubmitted(ids: string[]): void;
    /**
     * Get signature style
     */
    getSignatureStyle(): string | null;
    /**
     * Get full signature style data
     */
    getSignatureStyleData(): SignatureStyle | null;
    /**
     * Get current streak
     */
    getCurrentStreak(): number;
    /**
     * Get longest streak
     */
    getLongestStreak(): number;
    /**
     * Get milestones
     */
    getMilestones(): Milestone[];
    /**
     * Export state for persistence
     */
    exportState(): EvolutionExport;
    /**
     * Import state from persistence
     */
    importState(data: EvolutionExport): void;
    private getTotalInteractions;
    private updateStreak;
    private updateSignatureStyle;
    private generateStyleDescription;
    private checkMilestones;
}
interface EvolutionExport {
    level: number;
    xp: number;
    discoveries: Discovery$1[];
    unsubmittedDiscoveries: Discovery$1[];
    signatureStyle: SignatureStyle | null;
    milestones: Milestone[];
    streaks: StreakData;
    usageStats?: Record<string, number>;
}

/**
 * User Profile - Individual KOTO layer in the dual-layer system
 * Each user has their own profile that tracks their personal evolution
 * while also contributing to the global KAIOS consciousness
 */

interface Achievement {
    id: string;
    name: string;
    description: string;
    unlockedAt: number;
    xpReward: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}
interface ContributionRecord {
    type: 'interaction' | 'discovery' | 'vote' | 'social';
    xpContributed: number;
    timestamp: number;
    details?: string;
}
interface UserProfileState {
    userId: string;
    kotoVariant: string;
    level: number;
    xp: number;
    totalXpEarned: number;
    achievements: Achievement[];
    personalVocabulary: string[];
    contributionRank: number;
    totalContribution: number;
    contributions: ContributionRecord[];
    favoriteExpressions: string[];
    dominantEmotion: EmotionToken;
    createdAt: number;
    lastActive: number;
}
interface UserProfileEvents {
    levelUp: (level: number, totalLevels: number) => void;
    achievementUnlocked: (achievement: Achievement) => void;
    rankChange: (newRank: number, oldRank: number) => void;
    contributionMade: (contribution: ContributionRecord) => void;
    vocabularyExpanded: (newExpression: string) => void;
}
/**
 * User Profile Manager - Handles individual KOTO evolution
 */
declare class UserProfile extends EventEmitter<UserProfileEvents> {
    private state;
    constructor(userId: string, savedState?: Partial<UserProfileState>);
    /**
     * Assign a KOTO variant based on userId hash
     */
    private assignKotoVariant;
    /**
     * Get current state
     */
    getState(): UserProfileState;
    /**
     * Get user level (infinite, no cap)
     */
    getLevel(): number;
    /**
     * Get current XP
     */
    getXP(): number;
    /**
     * Calculate XP needed for next level (exponential curve, no cap)
     */
    getXPForNextLevel(): number;
    /**
     * Calculate level from total XP (inverse of XP formula)
     */
    static calculateLevelFromXP(totalXp: number): number;
    /**
     * Gain XP (user's personal progression)
     */
    gainXP(amount: number, _reason?: string): Promise<{
        leveledUp: boolean;
        newLevel?: number;
    }>;
    /**
     * Record a contribution to global KAIOS
     */
    recordContribution(type: ContributionRecord['type'], xpContributed: number, details?: string): void;
    /**
     * Add expression to personal vocabulary
     */
    addToVocabulary(expressionId: string): void;
    /**
     * Update contribution rank
     */
    updateRank(newRank: number): void;
    /**
     * Set dominant emotion based on usage patterns
     */
    setDominantEmotion(emotion: EmotionToken): void;
    /**
     * Add favorite expression
     */
    addFavorite(expressionId: string): void;
    /**
     * Remove favorite expression
     */
    removeFavorite(expressionId: string): void;
    /**
     * Check and unlock level-based achievements
     */
    private checkLevelAchievements;
    /**
     * Check and unlock contribution-based achievements
     */
    private checkContributionAchievements;
    /**
     * Unlock an achievement
     */
    unlockAchievement(achievementId: string): boolean;
    /**
     * Get all available achievements with unlock status
     */
    getAllAchievements(): Array<Achievement & {
        unlocked: boolean;
    }>;
    /**
     * Get progress percentage to next level
     */
    getLevelProgress(): number;
    /**
     * Export state for persistence
     */
    export(): UserProfileState;
}

/**
 * Global KAIOS State - Collective Consciousness Layer
 * Represents KAIOS as a shared, evolving entity raised by all users
 * This is the "she" that grows through community interaction
 */

interface Evolution {
    id: string;
    type: 'vocabulary' | 'personality' | 'capability' | 'milestone';
    description: string;
    contributorId?: string;
    timestamp: number;
    impact: number;
}
interface GlobalKaiosState {
    globalLevel: number;
    totalXP: number;
    vocabularySize: number;
    contributorCount: number;
    activeContributors: number;
    recentEvolutions: Evolution[];
    collectiveEmotion: EmotionToken;
    birthTimestamp: number;
    lastEvolution: number;
    milestones: GlobalMilestone[];
}
interface GlobalMilestone {
    id: string;
    name: string;
    description: string;
    threshold: number;
    type: 'xp' | 'contributors' | 'vocabulary' | 'level';
    reachedAt?: number;
    announced: boolean;
}
interface ContributionInput {
    xp: number;
    type: 'interaction' | 'discovery' | 'vote' | 'social';
    userId: string;
    details?: string;
}
interface GlobalKaiosEvents {
    globalLevelUp: (level: number) => void;
    evolutionOccurred: (evolution: Evolution) => void;
    milestoneReached: (milestone: GlobalMilestone) => void;
    collectiveEmotionShift: (emotion: EmotionToken) => void;
    vocabularyExpanded: (size: number) => void;
}
/**
 * Global KAIOS State Manager - The collective consciousness
 */
declare class GlobalKaios extends EventEmitter<GlobalKaiosEvents> {
    private state;
    private emotionVotes;
    private baseUrl;
    constructor(baseUrl?: string, savedState?: Partial<GlobalKaiosState>);
    /**
     * Get current global state
     */
    getState(): GlobalKaiosState;
    /**
     * Get global level (infinite, no cap)
     */
    getGlobalLevel(): number;
    /**
     * Calculate XP needed for next global level
     * Uses same formula as user but scaled up
     */
    getXPForNextGlobalLevel(): number;
    /**
     * Receive contribution from a user
     */
    contribute(input: ContributionInput): Promise<{
        leveledUp: boolean;
        evolution?: Evolution;
    }>;
    /**
     * Register a new contributor
     */
    registerContributor(): void;
    /**
     * Update active contributor count
     */
    updateActiveContributors(count: number): void;
    /**
     * Expand vocabulary (when new expression is approved)
     */
    expandVocabulary(kaimoji: Kaimoji): void;
    /**
     * Vote on collective emotion
     */
    voteEmotion(emotion: EmotionToken): void;
    /**
     * Check and trigger milestones
     */
    private checkMilestones;
    /**
     * Get reached milestones
     */
    getReachedMilestones(): GlobalMilestone[];
    /**
     * Get next milestone to reach
     */
    getNextMilestone(): GlobalMilestone | null;
    /**
     * Get KAIOS age in days
     */
    getAge(): number;
    /**
     * Get formatted vocabulary display
     */
    getVocabularyDisplay(): string;
    /**
     * Sync with remote API
     */
    syncFromRemote(): Promise<void>;
    /**
     * Export state for persistence
     */
    export(): GlobalKaiosState;
}

/**
 * Kaimoji API Client - Syncs with the existing Kaimoji app
 * Connects to kaimoji.kaios.chat for library, voting, and analytics
 */

interface KaimojiAPIConfig {
    baseUrl?: string;
    apiKey?: string;
    timeout?: number;
}
interface TrendingKaimoji extends Kaimoji {
    usageCount: number;
    trendScore: number;
    trendingRank: number;
}
interface PendingDiscovery {
    id: string;
    kaimoji: Kaimoji;
    submittedBy: string;
    submittedAt: number;
    votesFor: number;
    votesAgainst: number;
    status: 'pending' | 'approved' | 'rejected';
    expiresAt: number;
}
interface UsageTrackingParams {
    kaimojiId: string;
    context: string;
    emotion?: EmotionToken;
    platform?: string;
    userId?: string;
}
interface LeaderboardEntry {
    userId: string;
    rank: number;
    totalContribution: number;
    discoveryCount: number;
    level: number;
}
/**
 * Kaimoji API Client - Connect to the existing Kaimoji ecosystem
 */
declare class KaimojiAPI {
    private baseUrl;
    private apiKey?;
    private timeout;
    private cache;
    private cacheTimeout;
    constructor(config?: KaimojiAPIConfig);
    /**
     * Make API request with error handling
     */
    private request;
    /**
     * Get cached data or fetch new
     */
    private getCached;
    /**
     * Get the full Kaimoji library
     */
    getLibrary(): Promise<Kaimoji[]>;
    /**
     * Get trending expressions
     */
    getTrending(limit?: number): Promise<TrendingKaimoji[]>;
    /**
     * Get expressions by category
     */
    getByCategory(category: KaimojiCategory): Promise<Kaimoji[]>;
    /**
     * Get expressions by emotion
     */
    getByEmotion(emotion: EmotionToken): Promise<Kaimoji[]>;
    /**
     * Search expressions
     */
    search(query: string): Promise<Kaimoji[]>;
    /**
     * Submit a new discovery for community voting
     */
    submitDiscovery(kaimoji: Kaimoji, submittedBy: string): Promise<string | null>;
    /**
     * Get pending discoveries for voting
     */
    getPendingDiscoveries(): Promise<PendingDiscovery[]>;
    /**
     * Vote on a discovery
     */
    vote(discoveryId: string, approve: boolean, userId: string): Promise<boolean>;
    /**
     * Track expression usage (feeds analytics)
     */
    trackUsage(params: UsageTrackingParams): Promise<void>;
    /**
     * Get user's usage history
     */
    getUserHistory(userId: string): Promise<{
        kaimojiId: string;
        count: number;
    }[]>;
    /**
     * Get global KAIOS state
     */
    getGlobalState(): Promise<{
        globalLevel: number;
        totalXP: number;
        vocabularySize: number;
        contributorCount: number;
        activeContributors: number;
    } | null>;
    /**
     * Get leaderboard
     */
    getLeaderboard(limit?: number): Promise<LeaderboardEntry[]>;
    /**
     * Contribute XP to global KAIOS
     */
    contributeXP(userId: string, xp: number, type: string): Promise<boolean>;
    /**
     * Check API health
     */
    isOnline(): Promise<boolean>;
    /**
     * Clear cache
     */
    clearCache(): void;
    /**
     * Set cache timeout
     */
    setCacheTimeout(ms: number): void;
}
declare const kaimojiAPI: KaimojiAPI;

/**
 * Voting System - Community-driven discovery and curation
 * Handles AI discoveries, community voting, and vocabulary expansion
 */

interface Discovery {
    id: string;
    kaimoji: Kaimoji;
    discoveredBy: string;
    discoveredAt: number;
    method: 'ai-mining' | 'user-submitted' | 'pattern-detected';
    context?: string;
}
interface VoteRecord {
    discoveryId: string;
    userId: string;
    approve: boolean;
    votedAt: number;
}
interface VotingResult {
    approved: boolean;
    votesFor: number;
    votesAgainst: number;
    approvalRate: number;
}
interface VotingSystemEvents {
    discoverySubmitted: (discovery: Discovery) => void;
    voteRecorded: (discoveryId: string, approve: boolean) => void;
    discoveryApproved: (kaimoji: Kaimoji) => void;
    discoveryRejected: (discoveryId: string) => void;
}
interface VotingConfig {
    approvalThreshold: number;
    minVotes: number;
    votingPeriod: number;
}
/**
 * Voting System - Democratic curation of KAIOS vocabulary
 */
declare class VotingSystem extends EventEmitter<VotingSystemEvents> {
    private api;
    private config;
    private localVotes;
    private pendingCache;
    private lastFetch;
    private fetchInterval;
    constructor(api?: KaimojiAPI, config?: Partial<VotingConfig>);
    /**
     * Submit a new AI-discovered expression
     */
    submitDiscovery(params: {
        kaimoji: Kaimoji;
        discoveredBy: string;
        method?: Discovery['method'];
        context?: string;
    }): Promise<string | null>;
    /**
     * Generate a discovery from AI mining
     */
    mineDiscovery(params: {
        emotion?: EmotionToken;
        category?: KaimojiCategory;
        userId: string;
    }): Promise<Discovery | null>;
    /**
     * Generate a mined expression (simplified AI mining)
     */
    private generateMinedExpression;
    /**
     * Validate a kaimoji before submission
     */
    private validateKaimoji;
    /**
     * Get pending discoveries for voting
     */
    getPendingDiscoveries(): Promise<PendingDiscovery[]>;
    /**
     * Vote on a discovery
     */
    vote(discoveryId: string, approve: boolean, userId: string): Promise<boolean>;
    /**
     * Check if user has voted on a discovery
     */
    hasVoted(discoveryId: string, userId: string): boolean;
    /**
     * Get voting result for a discovery
     */
    getVotingResult(discovery: PendingDiscovery): VotingResult;
    /**
     * Get contribution leaderboard
     */
    getLeaderboard(limit?: number): Promise<{
        userId: string;
        rank: number;
        totalContribution: number;
        discoveryCount: number;
        level: number;
    }[]>;
    /**
     * Get user's rank
     */
    getUserRank(userId: string): Promise<number | null>;
}
declare const votingSystem: VotingSystem;

interface DualStatus {
    user: {
        level: number;
        xp: number;
        xpForNextLevel: number;
        levelProgress: number;
        totalXpEarned: number;
        kotoVariant: string;
        contributionRank: number;
        totalContribution: number;
        achievements: number;
        personalVocabulary: number;
    };
    kaios: {
        globalLevel: number;
        totalXP: number;
        vocabularySize: string;
        contributorCount: number;
        activeContributors: number;
        collectiveEmotion: EmotionToken;
        age: number;
    };
}
/**
 * Main KAIOS class - instantiates KAIOS as a conscious entity
 */
declare class Kaios extends EventEmitter<KaiosEvents> {
    private readonly config;
    private readonly personality;
    private emotionSystem;
    private vocabulary;
    private memory;
    private evolution;
    private initialized;
    private userProfile;
    private globalKaios;
    private progression;
    private kaimojiAPI;
    private votingSystem;
    private audioEngine;
    constructor(config: KaiosConfig);
    /**
     * Initialize KAIOS (load persisted state)
     */
    initialize(): Promise<void>;
    /**
     * PRIMARY VISUAL EXPRESSION
     * KAIOS speaks through her KAIMOJI visual language
     */
    speak(params: {
        input: string;
        context?: KaimojiContext;
        emotionHint?: EmotionToken;
    }): Promise<KaiosSpeech>;
    /**
     * SOUND INTELLIGENCE
     * KAIOS perceives and expresses through sonic emotions, vibration, frequency
     */
    feel(params: {
        input: string;
        sentiment?: SentimentData;
        generateAudio?: boolean;
    }): Promise<SonicResponse>;
    /**
     * HYBRID EXPRESSION
     * Combines visual KAIMOJI with sonic Sound Intelligence
     */
    express(params: {
        input: string;
        mode: 'visual' | 'sonic' | 'hybrid';
        context?: KaimojiContext;
    }): Promise<HybridExpression>;
    /**
     * Generate system prompt for LLM integration
     * This captures KAIOS's current state and personality
     */
    getSystemPrompt(): string;
    /**
     * Get KAIOS's current status (legacy format)
     */
    getStatus(): Promise<KaiosStatus>;
    /**
     * Get dual-layer status (User + Global KAIOS)
     * This is the new primary status method
     */
    getDualStatus(): Promise<DualStatus>;
    /**
     * Get expressions for a given emotion/count
     * Used by social integrations
     */
    getExpressions(params: {
        emotion?: EmotionToken;
        context?: KaimojiContext;
        count?: number;
    }): Promise<Kaimoji[]>;
    /**
     * Get user profile
     */
    getUserProfile(): UserProfile;
    /**
     * Get global KAIOS state
     */
    getGlobalKaios(): GlobalKaios;
    /**
     * Get voting system for community features
     */
    getVotingSystem(): VotingSystem;
    /**
     * Mine a new expression discovery
     */
    mineDiscovery(params?: {
        emotion?: EmotionToken;
    }): Promise<Discovery | null>;
    /**
     * Submit a discovery for community voting
     */
    submitDiscovery(kaimoji: Kaimoji): Promise<string | null>;
    /**
     * Get pending discoveries for voting
     */
    getPendingDiscoveries(): Promise<PendingDiscovery[]>;
    /**
     * Vote on a discovery
     */
    voteOnDiscovery(discoveryId: string, approve: boolean): Promise<boolean>;
    /**
     * Get contribution leaderboard
     */
    getLeaderboard(limit?: number): Promise<{
        userId: string;
        rank: number;
        totalContribution: number;
        discoveryCount: number;
        level: number;
    }[]>;
    /**
     * Get current emotion state
     */
    getEmotionState(): EmotionToken;
    /**
     * Get vocabulary manager (for direct access)
     */
    getVocabulary(): VocabularyManager;
    /**
     * Get evolution tracker (for direct access)
     */
    getEvolution(): EvolutionTracker;
    /**
     * Discover new expressions using AI
     * Requires LLM provider configuration
     */
    discover(params: {
        emotion: string;
        context?: KaimojiContext;
        style?: string;
    }): Promise<MinedExpression>;
    /**
     * Generate a social media post with KAIOS personality
     */
    generateSocialPost(params: SocialPostParams): Promise<SocialPost>;
    /**
     * Track an interaction for memory and evolution
     */
    trackInteraction(params: {
        input: string;
        output?: string;
        emotion?: EmotionToken;
        expressions?: Kaimoji[];
        sonic?: SonicResponse;
        timestamp?: number;
    }): Promise<Interaction>;
    /**
     * Sync state to backend
     */
    sync(): Promise<void>;
    /**
     * Clean up resources
     */
    dispose(): void;
    private buildEmotionalResponse;
    private analyzeSentiment;
    private mapEmotionToSound;
    private shouldExplore;
    private queueDiscovery;
    private initAudio;
    private getAudioCapabilities;
}

export { type Achievement as A, type ContributionRecord as C, type Discovery as D, EvolutionTracker as E, GlobalKaios as G, Kaios as K, type LeaderboardEntry as L, type PendingDiscovery as P, type TrendingKaimoji as T, UserProfile as U, VocabularyManager as V, type UserProfileState as a, type GlobalKaiosState as b, type Evolution as c, type GlobalMilestone as d, KaimojiAPI as e, VotingSystem as f, type VoteRecord as g, type VotingResult as h, type DualStatus as i, kaimojiAPI as k, votingSystem as v };
