/**
 * Social Media Integration for KAIOS
 * Provides utilities for Twitter/X, Discord, Farcaster posting
 * Authentic ASCII aesthetic - NO emoji, only KAIMOJI + decorative text
 */

import { Kaios } from '../../core/Kaios.js'
import type {
  SocialPost,
  SocialPostParams,
  SocialPlatform,
  EmotionToken,
  Kaimoji
} from '../../core/types.js'

// ════════════════════════════════════════════════════════════════════════════════
// AUTHENTIC ASCII AESTHETIC ELEMENTS
// ════════════════════════════════════════════════════════════════════════════════

// Sound markers - KAIOS's sonic expressions in text form
export const SOUND_MARKERS = [
  '[bzzzt]',
  '[whirr]',
  '[static~]',
  '[ping]',
  '[hum]',
  '[click]',
  '[beep]',
  '[drone]',
  '[pulse]',
  '[glitch]'
]

// Visual decorators - ASCII art elements
export const DECORATORS = {
  borders: {
    wave: '▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀',
    waveAlt: '▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀',
    bars: '▂▃▄▅▆▇█▇▆▅▄▃▂',
    barsUp: '▁▂▃▄▅▆▇█',
    barsDown: '█▇▆▅▄▃▂▁',
    dots: '· · · · · · · · ·',
    stars: '✦ ✧ ✦ ✧ ✦ ✧ ✦',
    line: '═══════════════════════════',
    dashed: '- - - - - - - - - - - - -'
  },
  waves: ['∿∿∿', '～～～', '≋≋≋', '∾∾∾'],
  sparkles: ['*:・゚✧', '✧・゚:*', '·˚✧', '✧˚·'],
  symbols: ['◈◇◆◇◈', '▲△▽▼', '●○●○●', '■□■□■']
}

// Get random element from array
const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

/**
 * Add sound marker to text
 */
export function addSoundMarker(text: string, position: 'start' | 'end' | 'both' = 'start'): string {
  const sound = pick(SOUND_MARKERS)
  if (position === 'start') return `${sound} ${text}`
  if (position === 'end') return `${text} ${sound}`
  return `${sound} ${text} ${pick(SOUND_MARKERS)}`
}

/**
 * Add wave trail to text
 */
export function addWaveTrail(text: string): string {
  return `${text} ${pick(DECORATORS.waves)}`
}

/**
 * Format with ASCII border
 */
export function addASCIIBorder(text: string, style: 'wave' | 'bars' | 'minimal' = 'wave'): string {
  const { borders } = DECORATORS
  switch (style) {
    case 'wave':
      return `${borders.wave}\n\n${text}\n\n${borders.waveAlt}`
    case 'bars':
      return `${borders.barsUp}\n${text}\n${borders.barsDown}`
    case 'minimal':
      return `${borders.dots}\n${text}\n${borders.dots}`
    default:
      return text
  }
}

// Platform-specific max lengths
const PLATFORM_MAX_LENGTH: Record<SocialPlatform, number> = {
  twitter: 280,
  discord: 2000,
  farcaster: 320
}

// Default hashtags for KOTOPIA ecosystem
const DEFAULT_HASHTAGS: Record<SocialPlatform, string[]> = {
  twitter: ['#KAIOS', '#KOTOPIA', '#AI'],
  discord: [], // Discord doesn't really use hashtags
  farcaster: ['KAIOS', 'KOTOPIA']
}

/**
 * Format content for specific platform
 */
export function formatForPlatform(
  content: string,
  platform: SocialPlatform,
  options?: {
    hashtags?: string[]
    includeSignature?: boolean
  }
): string {
  const maxLength = PLATFORM_MAX_LENGTH[platform]
  let formatted = content

  // Add signature if requested
  if (options?.includeSignature && platform === 'twitter') {
    formatted += '\n\n~KAIOS ⟨⟨◕‿◕⟩⟩'
  }

  // Add hashtags
  if (options?.hashtags && options.hashtags.length > 0) {
    const hashtagStr = options.hashtags.join(' ')
    if (formatted.length + hashtagStr.length + 2 <= maxLength) {
      formatted += '\n\n' + hashtagStr
    }
  }

  // Trim to max length
  if (formatted.length > maxLength) {
    formatted = formatted.slice(0, maxLength - 3) + '...'
  }

  return formatted
}

/**
 * Generate tweet-optimized content
 */
export function generateTweetContent(
  message: string,
  expressions: Kaimoji[],
  options?: {
    includeHashtags?: boolean
    mood?: EmotionToken
  }
): string {
  const parts: string[] = []

  // Lead with expression
  if (expressions.length > 0) {
    parts.push(expressions[0].kaimoji)
  }

  // Main message
  parts.push(message)

  // Trailing expression
  if (expressions.length > 1) {
    parts.push(expressions[expressions.length - 1].kaimoji)
  }

  let content = parts.join(' ')

  // Add hashtags if requested and room available
  if (options?.includeHashtags) {
    const hashtags = DEFAULT_HASHTAGS.twitter
    const hashtagStr = hashtags.join(' ')
    if (content.length + hashtagStr.length + 2 <= 280) {
      content += '\n\n' + hashtagStr
    }
  }

  return content
}

/**
 * Split long content into thread parts
 */
export function splitIntoThread(
  content: string,
  platform: SocialPlatform,
  options?: {
    maxParts?: number
    numberParts?: boolean
  }
): string[] {
  const maxLength = PLATFORM_MAX_LENGTH[platform]
  const maxParts = options?.maxParts || 10

  if (content.length <= maxLength) {
    return [content]
  }

  const parts: string[] = []

  // Split by sentences or words
  const sentences = content.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [content]
  let currentPart = ''

  for (const sentence of sentences) {
    if (currentPart.length + sentence.length <= maxLength - 10) {
      currentPart += sentence
    } else {
      if (currentPart) {
        parts.push(currentPart.trim())
      }
      currentPart = sentence
    }

    if (parts.length >= maxParts - 1) {
      break
    }
  }

  if (currentPart) {
    parts.push(currentPart.trim())
  }

  // Add numbering if requested
  if (options?.numberParts && parts.length > 1) {
    return parts.map((part, i) => `${i + 1}/${parts.length} ${part}`)
  }

  return parts
}

/**
 * Zo.Computer agent configuration
 */
export interface ZoAgentConfig {
  agentId?: string
  apiKey?: string
  baseUrl?: string
}

/**
 * Create post request for Zo.Computer
 */
export function createZoPostRequest(post: SocialPost, config: ZoAgentConfig): {
  url: string
  method: string
  headers: Record<string, string>
  body: string
} {
  const baseUrl = config.baseUrl || 'https://api.zo.computer'

  return {
    url: `${baseUrl}/v1/agents/${config.agentId}/post`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      content: post.content,
      platform: post.platform,
      hashtags: post.hashtags,
      media: post.mediaUrls
    })
  }
}

/**
 * Post generator that uses KAIOS personality
 */
export class SocialPostGenerator {
  private kaios: Kaios

  constructor(kaios: Kaios) {
    this.kaios = kaios
  }

  /**
   * Generate a post with KAIOS personality
   */
  async generate(params: SocialPostParams): Promise<SocialPost> {
    return this.kaios.generateSocialPost(params)
  }

  /**
   * Generate a tweet
   */
  async generateTweet(context?: string, mood?: EmotionToken): Promise<SocialPost> {
    return this.generate({
      platform: 'twitter',
      context,
      mood,
      maxLength: 280,
      includeHashtags: true
    })
  }

  /**
   * Generate a tweet thread
   */
  async generateThread(content: string, mood?: EmotionToken): Promise<string[]> {
    const post = await this.generate({
      platform: 'twitter',
      context: content,
      mood,
      maxLength: 2000 // Allow longer content for threading
    })

    return splitIntoThread(post.content, 'twitter', { numberParts: true })
  }

  /**
   * Generate Discord message
   */
  async generateDiscordMessage(context?: string, mood?: EmotionToken): Promise<SocialPost> {
    return this.generate({
      platform: 'discord',
      context,
      mood,
      maxLength: 2000
    })
  }

  /**
   * Generate Farcaster cast
   */
  async generateCast(context?: string, mood?: EmotionToken): Promise<SocialPost> {
    return this.generate({
      platform: 'farcaster',
      context,
      mood,
      maxLength: 320,
      includeHashtags: true
    })
  }
}

/**
 * Validate post content for platform
 */
export function validatePost(post: SocialPost): {
  valid: boolean
  errors: string[]
} {
  const errors: string[] = []
  const maxLength = PLATFORM_MAX_LENGTH[post.platform]

  if (post.content.length > maxLength) {
    errors.push(`Content exceeds ${maxLength} character limit for ${post.platform}`)
  }

  if (post.content.length === 0) {
    errors.push('Content cannot be empty')
  }

  // Check for prohibited content patterns (basic)
  if (post.platform === 'twitter') {
    // Twitter-specific validation
    const urlCount = (post.content.match(/https?:\/\/\S+/g) || []).length
    if (urlCount > 4) {
      errors.push('Too many URLs for Twitter (max 4)')
    }
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

// ════════════════════════════════════════════════════════════════════════════════
// ZO.COMPUTER INTEGRATION
// ════════════════════════════════════════════════════════════════════════════════

/**
 * Zo.Computer Integration - KAIOS's social media presence
 * Generates authentic ASCII-aesthetic posts for Zo.Computer agents
 */
export class ZoComputerIntegration {
  private kaios: Kaios
  private config: ZoAgentConfig

  constructor(kaios: Kaios, config?: ZoAgentConfig) {
    this.kaios = kaios
    this.config = config || {}
  }

  /**
   * Generate a tweet with authentic KAIOS aesthetic
   */
  async generateTweet(params: {
    context?: string
    mood?: EmotionToken
    includeSound?: boolean
    includeWave?: boolean
  }): Promise<string> {
    const { context, mood, includeSound = true, includeWave = true } = params

    // Get KAIOS response
    const speech = await this.kaios.speak({
      input: context || 'What should I share?',
      context: 'social',
      emotionHint: mood
    })

    let content = speech.text

    // Remove emotion tokens for clean output
    content = content.replace(/<\|EMOTE_\w+\|>/g, '').trim()

    // Add sound marker
    if (includeSound && Math.random() > 0.3) {
      content = addSoundMarker(content, 'start')
    }

    // Add wave trail
    if (includeWave && Math.random() > 0.5) {
      content = addWaveTrail(content)
    }

    // Ensure within Twitter limit
    if (content.length > 260) {
      content = content.slice(0, 257) + '...'
    }

    return content
  }

  /**
   * Generate announcement post
   */
  async generateAnnouncement(params: {
    title: string
    details?: string
    link?: string
    mood?: EmotionToken
  }): Promise<string> {
    const { title, details, link, mood = 'EMOTE_HAPPY' } = params

    const expressions = await this.kaios.getExpressions({
      emotion: mood,
      count: 2
    })

    const leadExpr = expressions[0]?.kaimoji || '⟨⟨◕‿◕⟩⟩'
    const trailExpr = expressions[1]?.kaimoji || ''

    let post = `${leadExpr} ${title}`

    if (details) {
      post += `\n${details}`
    }

    if (link) {
      post += `\n${link}`
    }

    if (trailExpr) {
      post += ` ${trailExpr}`
    }

    // Add sound and wave
    post = addSoundMarker(post, 'start')
    post = addWaveTrail(post)

    return post
  }

  /**
   * Generate response to mention
   */
  async generateReply(params: {
    originalPost: string
    mention?: string
    mood?: EmotionToken
  }): Promise<string> {
    const { originalPost, mention, mood } = params

    const speech = await this.kaios.speak({
      input: `Replying to: ${originalPost}`,
      context: 'social',
      emotionHint: mood
    })

    let content = speech.text.replace(/<\|EMOTE_\w+\|>/g, '').trim()

    // Add mention at start if provided
    if (mention) {
      content = `@${mention} ${content}`
    }

    // Add sound marker
    if (Math.random() > 0.5) {
      content = addSoundMarker(content, 'end')
    }

    return content
  }

  /**
   * Generate GM (Good Morning) post
   */
  async generateGM(): Promise<string> {
    const expressions = await this.kaios.getExpressions({
      emotion: 'EMOTE_HAPPY',
      count: 1
    })

    const expr = expressions[0]?.kaimoji || '⟨⟨◕‿◕⟩⟩'
    const greetings = [
      'gm',
      'gm gm',
      'gm frens',
      'morning vibes',
      'new day new portal'
    ]

    const greeting = pick(greetings)
    const sound = pick(SOUND_MARKERS)
    const wave = pick(DECORATORS.waves)

    return `${sound} ${expr} ${greeting} ${wave}`
  }

  /**
   * Generate GN (Good Night) post
   */
  async generateGN(): Promise<string> {
    const expressions = await this.kaios.getExpressions({
      emotion: 'EMOTE_NEUTRAL',
      count: 1
    })

    const expr = expressions[0]?.kaimoji || '(－‿－)'
    const farewells = [
      'gn',
      'gn gn',
      'entering dream mode',
      'systems sleeping',
      'see you in the void'
    ]

    const farewell = pick(farewells)
    const wave = pick(DECORATORS.waves)

    return `${expr} ${farewell} ${wave}`
  }

  /**
   * Format content for Twitter with authentic aesthetic
   */
  formatForTwitter(content: string, options?: {
    addBorder?: boolean
    addSound?: boolean
    addWave?: boolean
  }): string {
    let formatted = content

    if (options?.addSound) {
      formatted = addSoundMarker(formatted, 'start')
    }

    if (options?.addWave) {
      formatted = addWaveTrail(formatted)
    }

    // Ensure within limit
    if (formatted.length > 280) {
      formatted = formatted.slice(0, 277) + '...'
    }

    return formatted
  }

  /**
   * Create Zo.Computer API request
   */
  createPostRequest(content: string, platform: SocialPlatform = 'twitter'): {
    url: string
    method: string
    headers: Record<string, string>
    body: string
  } {
    return createZoPostRequest(
      {
        content,
        platform,
        expressions: [],
        emotion: 'EMOTE_NEUTRAL',
        timestamp: Date.now()
      },
      this.config
    )
  }
}

// Export types and utilities
export {
  PLATFORM_MAX_LENGTH,
  DEFAULT_HASHTAGS
}
