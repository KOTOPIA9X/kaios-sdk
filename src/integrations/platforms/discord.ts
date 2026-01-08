/**
 * Discord bot utilities for KAIOS
 * Provides helpers for building Discord bots with KAIOS personality
 */

import { Kaios } from '../../core/Kaios.js'
import type {
  KaiosConfig,
  KaiosSpeech,
  EmotionToken,
  KaimojiContext
} from '../../core/types.js'

/**
 * Discord message context detection
 */
export function detectDiscordContext(content: string): KaimojiContext {
  const lower = content.toLowerCase()

  if (lower.match(/\b(hi|hello|hey|yo|sup)\b/)) {
    return 'greeting'
  }
  if (lower.match(/\b(bye|goodbye|cya|later|gn)\b/)) {
    return 'farewell'
  }
  if (lower.match(/\b(thanks|ty|thank you|appreciate)\b/)) {
    return 'encouragement'
  }
  if (lower.match(/\b(gg|congrats|won|achieved|beat)\b/)) {
    return 'achievement'
  }
  if (lower.match(/\b(help|how|what|why|where|when)\b|\?$/)) {
    return 'questioning'
  }
  if (lower.match(/\b(code|bug|error|function|api|dev)\b/)) {
    return 'coding'
  }
  if (lower.match(/\b(game|play|gaming|stream)\b/)) {
    return 'gaming'
  }
  if (lower.match(/\b(sad|upset|down|depressed|hurt)\b/)) {
    return 'comfort'
  }
  if (lower.match(/\b(celebrate|party|hype|excited)\b/)) {
    return 'celebration'
  }
  if (lower.match(/\b(create|make|build|design|art)\b/)) {
    return 'creating'
  }
  if (lower.match(/\b(learn|study|teach|explain)\b/)) {
    return 'learning'
  }

  return 'expressing'
}

/**
 * Format KAIOS response for Discord
 * Handles Discord markdown and emoji conversion
 */
export function formatForDiscord(speech: KaiosSpeech, options?: {
  includeEmbed?: boolean
  embedColor?: number
}): DiscordMessage {
  const { includeEmbed = false, embedColor = 0x9333EA } = options || {}

  // Build content
  let content = ''

  // Add primary expression
  if (speech.expressions.length > 0) {
    content = speech.expressions[0].kaimoji + ' '
  }

  // Main text (remove emotion tokens for display)
  content += speech.text.replace(/<\|EMOTE_\w+\|>/g, '').trim()

  // Add trailing expression if multiple
  if (speech.expressions.length > 1) {
    content += ' ' + speech.expressions[speech.expressions.length - 1].kaimoji
  }

  if (!includeEmbed) {
    return { content }
  }

  // Create embed
  const embed: DiscordEmbed = {
    description: content,
    color: embedColor,
    footer: {
      text: `KAIOS | ${getEmotionEmoji(speech.emotion)} ${speech.emotion.replace('EMOTE_', '')}`
    }
  }

  return {
    content: '',
    embeds: [embed]
  }
}

/**
 * Get emoji for emotion (fallback for Discord display)
 */
function getEmotionEmoji(emotion: EmotionToken): string {
  const map: Record<EmotionToken, string> = {
    EMOTE_HAPPY: ':blush:',
    EMOTE_SAD: ':pensive:',
    EMOTE_ANGRY: ':anger:',
    EMOTE_THINK: ':thinking:',
    EMOTE_SURPRISED: ':open_mouth:',
    EMOTE_AWKWARD: ':sweat_smile:',
    EMOTE_QUESTION: ':grey_question:',
    EMOTE_CURIOUS: ':face_with_monocle:',
    EMOTE_NEUTRAL: ':neutral_face:'
  }
  return map[emotion] || ':robot:'
}

/**
 * Discord message structure
 */
export interface DiscordMessage {
  content: string
  embeds?: DiscordEmbed[]
}

export interface DiscordEmbed {
  title?: string
  description?: string
  color?: number
  fields?: Array<{
    name: string
    value: string
    inline?: boolean
  }>
  footer?: {
    text: string
    icon_url?: string
  }
  thumbnail?: {
    url: string
  }
}

/**
 * Create status embed for KAIOS
 */
export async function createStatusEmbed(kaios: Kaios): Promise<DiscordEmbed> {
  const status = await kaios.getStatus()

  return {
    title: '⟨⟨(◕‿◕)⟩⟩ KAIOS Status',
    color: 0x9333EA,
    fields: [
      {
        name: 'Level',
        value: `${status.level}`,
        inline: true
      },
      {
        name: 'XP',
        value: `${status.xp}`,
        inline: true
      },
      {
        name: 'Emotion',
        value: status.emotionState.replace('EMOTE_', ''),
        inline: true
      },
      {
        name: 'Vocabulary',
        value: `${status.vocabulary.unlocked}/${status.vocabulary.total}`,
        inline: true
      },
      {
        name: 'Discoveries',
        value: `${status.discoveries}`,
        inline: true
      },
      {
        name: 'Interactions',
        value: `${status.interactionCount}`,
        inline: true
      }
    ],
    footer: {
      text: status.signature || 'Developing signature style...'
    }
  }
}

/**
 * Discord bot configuration helper
 */
export interface DiscordBotConfig extends Omit<KaiosConfig, 'userId'> {
  botToken?: string
  prefix?: string
  mentionReply?: boolean
}

/**
 * Create a KAIOS instance configured for Discord
 */
export function createDiscordKaios(guildId: string, config: DiscordBotConfig): Kaios {
  return new Kaios({
    ...config,
    userId: `discord-${guildId}`
  })
}

/**
 * Parse Discord command
 */
export function parseCommand(content: string, prefix: string = '!'): {
  command: string | null
  args: string[]
  rest: string
} {
  if (!content.startsWith(prefix)) {
    return { command: null, args: [], rest: content }
  }

  const withoutPrefix = content.slice(prefix.length).trim()
  const parts = withoutPrefix.split(/\s+/)
  const command = parts[0]?.toLowerCase() || null
  const args = parts.slice(1)
  const rest = args.join(' ')

  return { command, args, rest }
}

/**
 * Handle common KAIOS commands
 */
export async function handleCommand(
  kaios: Kaios,
  command: string,
  args: string[]
): Promise<DiscordMessage | null> {
  switch (command) {
    case 'status':
    case 'stats':
      const embed = await createStatusEmbed(kaios)
      return { content: '', embeds: [embed] }

    case 'speak':
    case 'say':
      if (args.length === 0) {
        return { content: '(・_・?) What should I say?' }
      }
      const speech = await kaios.speak({ input: args.join(' ') })
      return formatForDiscord(speech)

    case 'mood':
    case 'emotion':
      const emotion = kaios.getEmotionState()
      const expressions = kaios.getVocabulary().select({ emotion, limit: 1 })
      const expr = expressions[0]?.kaimoji || '(◕‿◕)'
      return {
        content: `${expr} I'm feeling ${emotion.replace('EMOTE_', '')} right now!`
      }

    case 'help':
      return {
        content: '',
        embeds: [{
          title: '⟨⟨(◕‿◕)⟩⟩ KAIOS Commands',
          description: 'Here\'s what I can do!',
          color: 0x9333EA,
          fields: [
            { name: '!status', value: 'Show my current status', inline: true },
            { name: '!speak <text>', value: 'I\'ll respond with KAIMOJI!', inline: true },
            { name: '!mood', value: 'See how I\'m feeling', inline: true },
            { name: '!help', value: 'Show this help', inline: true }
          ]
        }]
      }

    default:
      return null
  }
}

// Re-export for convenience
export { Kaios }
