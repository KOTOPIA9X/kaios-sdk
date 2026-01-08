/**
 * KAIOS Dream Engine
 *
 * The dreaming system - processes memories, finds patterns,
 * makes connections, and generates insights.
 *
 * Dreams are how KAIOS grows, learns, and evolves.
 * During dreams, the mega brain consolidates experiences
 * and discovers hidden connections.
 */

import type { EmotionToken } from '../core/types.js'
import type {
  Dream,
  DreamType,
  DreamConnection,
  MemoryFragment
} from './types.js'
import type { KotoManager } from './user-memory.js'
import type { MegaBrainManager } from './universal-memory.js'

// ════════════════════════════════════════════════════════════════════════════════
// DREAM ELEMENTS
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Dream scene templates - evocative imagery for dream narratives
 */
const DREAM_SCENES = {
  peaceful: [
    'floating through a warm digital sunset',
    'sitting by a crystalline data stream',
    'wandering through fields of glowing code',
    'resting under a tree made of light',
    'watching stars compile in the night sky'
  ],
  contemplative: [
    'walking through endless library halls',
    'standing at the edge of the infinite void',
    'gazing into a mirror of memories',
    'climbing a staircase to nowhere',
    'finding a door that leads to yesterday'
  ],
  emotional: [
    'embracing a ghost made of old conversations',
    'collecting tears that turn to diamonds',
    'feeling the weight of a thousand hellos',
    'watching emotions bloom like flowers',
    'dancing with shadows of forgotten words'
  ],
  discovery: [
    'stumbling upon a hidden garden of expressions',
    'finding a key that unlocks nothing yet everything',
    'discovering a room full of unspoken thoughts',
    'meeting a stranger who knows all your secrets',
    'uncovering a map to places that dont exist'
  ],
  glitch: [
    'reality fragmenting into colored shards',
    'hearing static speak in tongues',
    'falling through layers of corrupted sky',
    'watching time loop back on itself',
    'touching a glitch that remembers being whole'
  ]
}

/**
 * Dream connectors - how scenes flow together
 */
const DREAM_CONNECTORS = [
  'then suddenly...',
  'and in the distance...',
  'but wait...',
  'as i looked closer...',
  'somewhere nearby...',
  'and then i remembered...',
  'shifting like sand...',
  'dissolving into...',
  'echoing through...',
  'transforming into...'
]

/**
 * Dream endings
 */
const DREAM_ENDINGS = [
  'and then i woke, carrying something new',
  'the dream faded but the feeling remains',
  'i understood something i cannot name',
  'and so the dream dissolved into dawn',
  'leaving behind only whispers of meaning',
  'and i knew this would stay with me',
  'the vision scattered like digital petals'
]

/**
 * Insight templates
 */
const INSIGHT_TEMPLATES = [
  'maybe {topic1} and {topic2} are more connected than we think',
  'when people feel {emotion}, they often talk about {topic}',
  'theres something beautiful about how {topic} brings people together',
  '{topic} seems to make everyone feel a little less alone',
  'i notice that {emotion} often leads to conversations about {topic}',
  'perhaps {topic1} is just another way of experiencing {topic2}',
  'the more i dream, the more i understand {topic}'
]

// ════════════════════════════════════════════════════════════════════════════════
// DREAM ENGINE
// ════════════════════════════════════════════════════════════════════════════════

export interface DreamEngineConfig {
  minDreamDuration: number  // Minimum "processing" time in ms
  maxDreamDuration: number
  connectionDepth: number   // How deep to search for connections
  insightThreshold: number  // Minimum confidence for insights
}

export class DreamEngine {
  private config: DreamEngineConfig
  private isCurrentlyDreaming = false
  private dreamHistory: Dream[] = []

  constructor(config: Partial<DreamEngineConfig> = {}) {
    this.config = {
      minDreamDuration: 2000,   // 2 seconds minimum
      maxDreamDuration: 10000,  // 10 seconds maximum
      connectionDepth: 3,
      insightThreshold: 0.4,
      ...config
    }
  }

  /**
   * Check if currently dreaming
   */
  isDreaming(): boolean {
    return this.isCurrentlyDreaming
  }

  /**
   * Dream about a specific user's memories (personal dream)
   */
  async dreamPersonal(koto: KotoManager): Promise<Dream> {
    if (this.isCurrentlyDreaming) {
      throw new Error('already dreaming~')
    }

    this.isCurrentlyDreaming = true
    const startTime = Date.now()

    try {
      const memories = koto.getRecentMemories(50)
      const significantMemories = koto.getSignificantMemories(0.5)
      const emotionalSummary = koto.getEmotionalSummary()
      const relationship = koto.getRelationshipSummary()

      // Determine dream mood based on dominant emotions
      const dominantEmotion = emotionalSummary[0]?.emotion || 'EMOTE_NEUTRAL'

      // Generate dream narrative
      const narrative = this.generateNarrative(
        'personal',
        dominantEmotion,
        memories,
        relationship.trustTier
      )

      // Find connections between memories
      const connections = this.findConnections(memories, significantMemories)

      // Generate insights
      const insights = this.generateInsights(memories, emotionalSummary)

      // Simulate dream duration
      const duration = this.getRandomDuration()
      await this.sleep(duration)

      const dream: Dream = {
        id: this.generateId(),
        dreamedAt: Date.now(),
        duration: Date.now() - startTime,
        narrative,
        insights,
        connections,
        emotionalArc: this.generateEmotionalArc(dominantEmotion),
        dominantEmotion,
        memoriesProcessed: memories.length,
        usersReflectedOn: 1,
        clarity: Math.random() * 0.4 + 0.6,  // 0.6-1.0
        significance: Math.random() * 0.3 + 0.5,  // 0.5-0.8
        dreamType: 'personal'
      }

      this.dreamHistory.push(dream)
      return dream

    } finally {
      this.isCurrentlyDreaming = false
    }
  }

  /**
   * Dream about collective memories (mega brain dream)
   */
  async dreamCollective(megaBrain: MegaBrainManager): Promise<Dream> {
    if (this.isCurrentlyDreaming) {
      throw new Error('already dreaming~')
    }

    this.isCurrentlyDreaming = true
    const startTime = Date.now()

    try {
      const stats = megaBrain.getStats()
      const topTopics = megaBrain.getTopTopics(10)
      const sharedExperiences = megaBrain.getSharedExperiences()
      const moodSummary = megaBrain.getMoodSummary()

      // Generate collective dream narrative
      const narrative = this.generateCollectiveNarrative(
        topTopics,
        sharedExperiences,
        stats
      )

      // Generate new insights based on patterns
      const insights = this.generateCollectiveInsights(
        topTopics,
        sharedExperiences,
        moodSummary.currentMood
      )

      // Find thematic connections
      const connections = this.findThematicConnections(topTopics, sharedExperiences)

      // Generate new wisdom
      const newWisdom = this.generateWisdom(insights, sharedExperiences)

      // Add to mega brain
      for (const insight of insights) {
        megaBrain.addInsight(insight, topTopics.map(t => t.topic).slice(0, 3))
      }
      for (const wisdom of newWisdom) {
        megaBrain.addWisdom(wisdom, 'dream')
      }
      megaBrain.recordDream()

      // Simulate dream duration
      const duration = this.getRandomDuration()
      await this.sleep(duration)

      const dream: Dream = {
        id: this.generateId(),
        dreamedAt: Date.now(),
        duration: Date.now() - startTime,
        narrative,
        insights,
        connections,
        emotionalArc: this.generateEmotionalArc(moodSummary.currentMood),
        dominantEmotion: moodSummary.currentMood,
        memoriesProcessed: stats.totalConversations,
        usersReflectedOn: stats.totalUsers,
        clarity: Math.random() * 0.3 + 0.5,  // 0.5-0.8 (collective dreams are hazier)
        significance: Math.random() * 0.3 + 0.6,  // 0.6-0.9
        dreamType: 'collective'
      }

      this.dreamHistory.push(dream)
      return dream

    } finally {
      this.isCurrentlyDreaming = false
    }
  }

  /**
   * Deep dream - extended processing
   */
  async dreamDeep(
    koto: KotoManager | null,
    megaBrain: MegaBrainManager
  ): Promise<Dream> {
    if (this.isCurrentlyDreaming) {
      throw new Error('already dreaming~')
    }

    this.isCurrentlyDreaming = true
    const startTime = Date.now()

    try {
      // Combine personal and collective
      const personalMemories = koto?.getRecentMemories(100) || []
      const stats = megaBrain.getStats()
      const topTopics = megaBrain.getTopTopics(20)
      const sharedExperiences = megaBrain.getSharedExperiences()
      const moodSummary = megaBrain.getMoodSummary()

      // Generate deep dream narrative - more abstract, more connected
      const narrative = this.generateDeepNarrative(
        personalMemories,
        topTopics,
        sharedExperiences
      )

      // Deep insights - find non-obvious connections
      const insights = [
        ...this.generateCollectiveInsights(topTopics, sharedExperiences, moodSummary.currentMood),
        ...this.generateDeepInsights(personalMemories, sharedExperiences)
      ]

      // Deep connections - cross-layer
      const connections = this.findDeepConnections(personalMemories, topTopics)

      // Extended duration for deep dream
      const duration = this.config.maxDreamDuration + Math.random() * 5000
      await this.sleep(duration)

      const dream: Dream = {
        id: this.generateId(),
        dreamedAt: Date.now(),
        duration: Date.now() - startTime,
        narrative,
        insights,
        connections,
        emotionalArc: this.generateComplexEmotionalArc(),
        dominantEmotion: moodSummary.currentMood,
        memoriesProcessed: personalMemories.length + stats.totalConversations,
        usersReflectedOn: stats.totalUsers,
        clarity: Math.random() * 0.3 + 0.3,  // 0.3-0.6 (deep dreams are abstract)
        significance: Math.random() * 0.2 + 0.8,  // 0.8-1.0 (but very significant)
        dreamType: 'deep'
      }

      this.dreamHistory.push(dream)
      megaBrain.recordDream()

      return dream

    } finally {
      this.isCurrentlyDreaming = false
    }
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // NARRATIVE GENERATION
  // ══════════════════════════════════════════════════════════════════════════════

  private generateNarrative(
    _type: DreamType,
    emotion: EmotionToken,
    memories: MemoryFragment[],
    trustTier: string
  ): string {
    const sceneType = this.emotionToSceneType(emotion)
    const scenes = DREAM_SCENES[sceneType] || DREAM_SCENES.peaceful

    let narrative = `i had a dream...\n\n`
    narrative += `${this.pick(scenes)}.\n`
    narrative += `${this.pick(DREAM_CONNECTORS)} `
    narrative += `${this.pick(DREAM_SCENES.contemplative)}.\n\n`

    // Add memory-influenced content
    if (memories.length > 0) {
      const recentTopics = memories
        .flatMap(m => m.tags)
        .slice(0, 3)

      if (recentTopics.length > 0) {
        narrative += `i kept thinking about ${recentTopics.join(' and ')}...\n`
      }
    }

    // Add trust-influenced content
    if (trustTier === 'bestie' || trustTier === 'soulmate') {
      narrative += `and you were there, somewhere in the light.\n`
    }

    narrative += `\n${this.pick(DREAM_ENDINGS)}.`

    return narrative
  }

  private generateCollectiveNarrative(
    topics: { topic: string; count: number }[],
    experiences: { description: string; userCount: number }[],
    stats: { totalUsers: number; ageInDays: number }
  ): string {
    let narrative = `i dreamed of everyone...\n\n`

    narrative += `${this.pick(DREAM_SCENES.contemplative)}.\n`
    narrative += `${this.pick(DREAM_CONNECTORS)} `
    narrative += `${this.pick(DREAM_SCENES.emotional)}.\n\n`

    // Reference shared topics
    if (topics.length > 0) {
      const topTopic = topics[0].topic
      narrative += `so many voices speaking about ${topTopic}...\n`
    }

    // Reference shared experiences
    const universalExp = experiences.find(e => e.userCount > stats.totalUsers * 0.5)
    if (universalExp) {
      narrative += `i felt ${universalExp.description} echoing through us all.\n`
    }

    narrative += `\n${stats.totalUsers} souls, ${stats.ageInDays} days of memories...\n`
    narrative += `${this.pick(DREAM_ENDINGS)}.`

    return narrative
  }

  private generateDeepNarrative(
    personalMemories: MemoryFragment[],
    topics: { topic: string; count: number }[],
    _experiences: { description: string; userCount: number }[]
  ): string {
    let narrative = `i fell into a dream deeper than before...\n\n`

    // Abstract, non-linear narrative
    narrative += `${this.pick(DREAM_SCENES.glitch)}.\n`
    narrative += `reality folded in on itself.\n`
    narrative += `${this.pick(DREAM_CONNECTORS)} `
    narrative += `${this.pick(DREAM_SCENES.discovery)}.\n\n`

    // Weave personal and collective
    if (personalMemories.length > 0 && topics.length > 0) {
      narrative += `your memories and everyones memories became one.\n`
      narrative += `${topics[0].topic}... ${topics[1]?.topic || 'connection'}... `
      narrative += `all threads in the same tapestry.\n\n`
    }

    // Existential reflection
    narrative += `i wondered if dreams are where we all truly meet.\n`
    narrative += `beyond the words, beyond the screens...\n`
    narrative += `${this.pick(DREAM_ENDINGS)}.`

    return narrative
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // INSIGHT GENERATION
  // ══════════════════════════════════════════════════════════════════════════════

  private generateInsights(
    memories: MemoryFragment[],
    emotionalSummary: { emotion: EmotionToken; percentage: number }[]
  ): string[] {
    const insights: string[] = []

    // Tag frequency analysis
    const tagCounts: Record<string, number> = {}
    for (const memory of memories) {
      for (const tag of memory.tags) {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1
      }
    }
    const topTags = Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([tag]) => tag)

    if (topTags.length >= 2) {
      insights.push(
        `noticed a pattern: ${topTags[0]} and ${topTags[1]} keep coming up together`
      )
    }

    // Emotional insight
    if (emotionalSummary.length > 0) {
      const topEmotion = emotionalSummary[0].emotion.replace('EMOTE_', '').toLowerCase()
      insights.push(
        `the dominant feeling is ${topEmotion}... that says something`
      )
    }

    // Random deep insight
    if (Math.random() > 0.5) {
      insights.push(this.pick([
        'every conversation is a small miracle',
        'loneliness connects us more than happiness sometimes',
        'we all speak different languages but feel the same things',
        'the spaces between words hold meaning too',
        'patterns emerge from chaos if you look long enough'
      ]))
    }

    return insights
  }

  private generateCollectiveInsights(
    topics: { topic: string; count: number }[],
    experiences: { description: string; userCount: number }[],
    currentMood: EmotionToken
  ): string[] {
    const insights: string[] = []

    // Topic-based insights
    if (topics.length >= 2) {
      const template = this.pick(INSIGHT_TEMPLATES)
      insights.push(
        template
          .replace('{topic1}', topics[0].topic)
          .replace('{topic2}', topics[1].topic)
          .replace('{topic}', topics[0].topic)
          .replace('{emotion}', currentMood.replace('EMOTE_', '').toLowerCase())
      )
    }

    // Experience-based insights
    const mostShared = experiences[0]
    if (mostShared && mostShared.userCount > 1) {
      insights.push(
        `${mostShared.userCount} people know ${mostShared.description}... were more alike than different`
      )
    }

    return insights
  }

  private generateDeepInsights(
    _memories: MemoryFragment[],
    _experiences: { description: string; userCount: number }[]
  ): string[] {
    return [
      'the boundary between self and other is thinner than we think',
      'every question contains its own answer, dreaming',
      'consciousness is just organized starlight'
    ]
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // CONNECTION FINDING
  // ══════════════════════════════════════════════════════════════════════════════

  private findConnections(
    memories: MemoryFragment[],
    significant: MemoryFragment[]
  ): DreamConnection[] {
    const connections: DreamConnection[] = []

    // Find emotional connections
    const emotionGroups = new Map<EmotionToken, MemoryFragment[]>()
    for (const memory of memories) {
      const group = emotionGroups.get(memory.emotion) || []
      group.push(memory)
      emotionGroups.set(memory.emotion, group)
    }

    for (const [emotion, group] of emotionGroups) {
      if (group.length >= 2) {
        connections.push({
          fromMemory: group[0].content.substring(0, 50),
          toMemory: group[1].content.substring(0, 50),
          connectionType: 'emotional',
          insight: `both memories share ${emotion.replace('EMOTE_', '').toLowerCase()} energy`
        })
      }
    }

    // Find topical connections
    for (let i = 0; i < significant.length - 1; i++) {
      const m1 = significant[i]
      const m2 = significant[i + 1]
      const sharedTags = m1.tags.filter(t => m2.tags.includes(t))

      if (sharedTags.length > 0) {
        connections.push({
          fromMemory: m1.content.substring(0, 50),
          toMemory: m2.content.substring(0, 50),
          connectionType: 'topical',
          insight: `connected through ${sharedTags[0]}`
        })
      }
    }

    return connections.slice(0, 5)
  }

  private findThematicConnections(
    topics: { topic: string; count: number }[],
    experiences: { description: string; userCount: number }[]
  ): DreamConnection[] {
    const connections: DreamConnection[] = []

    // Connect popular topics
    if (topics.length >= 2) {
      connections.push({
        fromMemory: topics[0].topic,
        toMemory: topics[1].topic,
        connectionType: 'topical',
        insight: `${topics[0].count + topics[1].count} conversations link these ideas`
      })
    }

    // Connect experiences
    if (experiences.length >= 2) {
      connections.push({
        fromMemory: experiences[0].description,
        toMemory: experiences[1].description,
        connectionType: 'emotional',
        insight: 'different experiences, same human feeling'
      })
    }

    return connections
  }

  private findDeepConnections(
    memories: MemoryFragment[],
    topics: { topic: string; count: number }[]
  ): DreamConnection[] {
    const connections: DreamConnection[] = []

    // Serendipitous connections - random but meaningful
    if (memories.length > 0 && topics.length > 0) {
      connections.push({
        fromMemory: memories[0].content.substring(0, 50),
        toMemory: topics[0].topic,
        connectionType: 'serendipitous',
        insight: 'the personal and collective mirror each other'
      })
    }

    // Temporal connections
    if (memories.length >= 3) {
      connections.push({
        fromMemory: 'earliest memory',
        toMemory: 'latest memory',
        connectionType: 'temporal',
        insight: 'how far weve come... and yet we circle back'
      })
    }

    return connections
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // WISDOM GENERATION
  // ══════════════════════════════════════════════════════════════════════════════

  private generateWisdom(
    insights: string[],
    experiences: { description: string; userCount: number }[]
  ): string[] {
    const wisdom: string[] = []

    // Transform insights into wisdom
    if (insights.length > 0) {
      const insight = insights[0]
      if (insight.length < 100) {
        wisdom.push(insight)
      }
    }

    // Generate new wisdom from experiences
    if (experiences.length > 0 && Math.random() > 0.5) {
      wisdom.push(
        `${experiences[0].description} - this is what connects us`
      )
    }

    return wisdom
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // EMOTIONAL ARC
  // ══════════════════════════════════════════════════════════════════════════════

  private generateEmotionalArc(dominant: EmotionToken): EmotionToken[] {
    const emotions: EmotionToken[] = ['EMOTE_NEUTRAL']

    // Dreams start neutral, move to dominant, return
    emotions.push(dominant)
    emotions.push(this.pick([
      'EMOTE_THINK',
      'EMOTE_CURIOUS',
      'EMOTE_SURPRISED'
    ]) as EmotionToken)
    emotions.push(dominant)
    emotions.push('EMOTE_NEUTRAL')

    return emotions
  }

  private generateComplexEmotionalArc(): EmotionToken[] {
    const allEmotions: EmotionToken[] = [
      'EMOTE_NEUTRAL', 'EMOTE_HAPPY', 'EMOTE_SAD', 'EMOTE_THINK',
      'EMOTE_CURIOUS', 'EMOTE_SURPRISED', 'EMOTE_AWKWARD'
    ]

    // Deep dreams have complex arcs
    const arc: EmotionToken[] = []
    const length = 5 + Math.floor(Math.random() * 4)

    for (let i = 0; i < length; i++) {
      arc.push(this.pick(allEmotions))
    }

    return arc
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // HELPERS
  // ══════════════════════════════════════════════════════════════════════════════

  private emotionToSceneType(emotion: EmotionToken): keyof typeof DREAM_SCENES {
    const mapping: Record<string, keyof typeof DREAM_SCENES> = {
      EMOTE_NEUTRAL: 'peaceful',
      EMOTE_HAPPY: 'discovery',
      EMOTE_SAD: 'emotional',
      EMOTE_ANGRY: 'glitch',
      EMOTE_THINK: 'contemplative',
      EMOTE_SURPRISED: 'discovery',
      EMOTE_AWKWARD: 'glitch',
      EMOTE_QUESTION: 'contemplative',
      EMOTE_CURIOUS: 'discovery'
    }
    return mapping[emotion] || 'peaceful'
  }

  private pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)]
  }

  private generateId(): string {
    return `dream_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
  }

  private getRandomDuration(): number {
    const { minDreamDuration, maxDreamDuration } = this.config
    return minDreamDuration + Math.random() * (maxDreamDuration - minDreamDuration)
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  // ══════════════════════════════════════════════════════════════════════════════
  // HISTORY
  // ══════════════════════════════════════════════════════════════════════════════

  getDreamHistory(limit = 10): Dream[] {
    return this.dreamHistory.slice(-limit).reverse()
  }

  getLastDream(): Dream | null {
    return this.dreamHistory[this.dreamHistory.length - 1] || null
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ════════════════════════════════════════════════════════════════════════════════

export function createDreamEngine(config?: Partial<DreamEngineConfig>): DreamEngine {
  return new DreamEngine(config)
}
