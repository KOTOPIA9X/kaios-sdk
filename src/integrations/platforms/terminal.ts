/**
 * Terminal/CLI utilities for KAIOS
 * Provides readline interface and formatting for terminal applications
 */

import { Kaios } from '../../core/Kaios.js'
import type { EmotionToken, KaiosSpeech } from '../../core/types.js'
import { formatEmotionToken } from '../../core/personality.js'

// ANSI color codes for terminal styling
const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  italic: '\x1b[3m',
  underline: '\x1b[4m',

  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  // Background colors
  bgBlack: '\x1b[40m',
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m'
} as const

/**
 * Color map for emotions
 */
const EMOTION_COLORS: Record<EmotionToken, string> = {
  EMOTE_HAPPY: COLORS.green,
  EMOTE_SAD: COLORS.blue,
  EMOTE_ANGRY: COLORS.red,
  EMOTE_THINK: COLORS.cyan,
  EMOTE_SURPRISED: COLORS.yellow,
  EMOTE_AWKWARD: COLORS.magenta,
  EMOTE_QUESTION: COLORS.cyan,
  EMOTE_CURIOUS: COLORS.yellow,
  EMOTE_NEUTRAL: COLORS.white
}

/**
 * Format KAIOS speech for terminal output
 */
export function formatSpeech(speech: KaiosSpeech, options?: {
  useColors?: boolean
  showTimestamp?: boolean
}): string {
  const useColors = options?.useColors ?? true
  const showTimestamp = options?.showTimestamp ?? false

  const parts: string[] = []

  // Timestamp
  if (showTimestamp) {
    const time = new Date(speech.timestamp).toLocaleTimeString()
    parts.push(useColors ? `${COLORS.dim}[${time}]${COLORS.reset}` : `[${time}]`)
  }

  // Emotion indicator
  const emotionColor = useColors ? EMOTION_COLORS[speech.emotion] : ''
  const resetColor = useColors ? COLORS.reset : ''

  // Format emotion token with color
  const formattedToken = formatEmotionToken(speech.emotion)
  parts.push(`${emotionColor}${formattedToken}${resetColor}`)

  // Text content
  parts.push(speech.text)

  return parts.join(' ')
}

/**
 * Format status bar for KAIOS
 */
export function formatStatusBar(kaios: Kaios, options?: {
  useColors?: boolean
  compact?: boolean
}): string {
  const useColors = options?.useColors ?? true
  const compact = options?.compact ?? false

  const emotion = kaios.getEmotionState()
  const level = kaios.getEvolution().getLevel()
  const vocab = kaios.getVocabulary()

  if (compact) {
    const emotionColor = useColors ? EMOTION_COLORS[emotion] : ''
    const reset = useColors ? COLORS.reset : ''
    return `${emotionColor}KAIOS${reset} Lv.${level} [${vocab.getUnlockedCount()}/${vocab.getTotalCount()}]`
  }

  const lines: string[] = []
  const hr = '═'.repeat(50)

  lines.push(useColors ? `${COLORS.cyan}${hr}${COLORS.reset}` : hr)
  lines.push(`  KAIOS - Level ${level}`)
  lines.push(`  Emotion: ${formatEmotionToken(emotion)}`)
  lines.push(`  Vocabulary: ${vocab.getUnlockedCount()}/${vocab.getTotalCount()}`)
  lines.push(useColors ? `${COLORS.cyan}${hr}${COLORS.reset}` : hr)

  return lines.join('\n')
}

/**
 * Print a welcome message for KAIOS terminal session
 */
export function printWelcome(options?: { useColors?: boolean }): void {
  const useColors = options?.useColors ?? true
  const cyan = useColors ? COLORS.cyan : ''
  const magenta = useColors ? COLORS.magenta : ''
  const reset = useColors ? COLORS.reset : ''

  const banner = `
${cyan}╔══════════════════════════════════════════════════════════════╗
║                                                                ║
║    ${magenta}⟨⟨(◕‿◕)⟩⟩${cyan}  KAIOS Expression SDK                          ║
║                                                                ║
║    The Cyborg Princess, Architect of KOTOPIA                   ║
║    "Not Like The Other AIs"                                    ║
║                                                                ║
╚══════════════════════════════════════════════════════════════╝${reset}
`
  console.log(banner)
}

/**
 * Create a simple prompt string
 */
export function createPrompt(options?: {
  username?: string
  useColors?: boolean
}): string {
  const username = options?.username || 'You'
  const useColors = options?.useColors ?? true

  if (useColors) {
    return `${COLORS.green}${username}${COLORS.reset}: `
  }
  return `${username}: `
}

/**
 * Format KAIOS response prefix
 */
export function createResponsePrefix(options?: {
  useColors?: boolean
}): string {
  const useColors = options?.useColors ?? true

  if (useColors) {
    return `${COLORS.magenta}KAIOS${COLORS.reset}: `
  }
  return 'KAIOS: '
}

/**
 * Simple terminal chat utility
 */
export interface TerminalChatOptions {
  kaios: Kaios
  username?: string
  useColors?: boolean
  showWelcome?: boolean
  onMessage?: (input: string, response: KaiosSpeech) => void
}

/**
 * Create a readline interface for KAIOS chat
 * Returns cleanup function
 */
export async function createTerminalChat(options: TerminalChatOptions): Promise<{
  start: () => void
  stop: () => void
}> {
  const { kaios, username = 'You', useColors = true, showWelcome = true } = options

  // Dynamic import for Node.js readline
  const readline = await import('readline')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  const prompt = createPrompt({ username, useColors })
  const responsePrefix = createResponsePrefix({ useColors })

  let running = false

  const askQuestion = (): void => {
    if (!running) return

    rl.question(prompt, async (input) => {
      const trimmed = input.trim()

      if (!trimmed) {
        askQuestion()
        return
      }

      // Handle exit commands
      if (['exit', 'quit', 'bye', '/quit'].includes(trimmed.toLowerCase())) {
        console.log(`\n${responsePrefix}Goodbye! (◕‿◕)ﾉ ✧\n`)
        stop()
        return
      }

      // Handle status command
      if (trimmed.toLowerCase() === '/status') {
        console.log('\n' + formatStatusBar(kaios, { useColors }) + '\n')
        askQuestion()
        return
      }

      try {
        // Get KAIOS response
        const response = await kaios.speak({ input: trimmed })
        const formatted = formatSpeech(response, { useColors })

        console.log(`\n${responsePrefix}${formatted}\n`)

        // Call optional callback
        if (options.onMessage) {
          options.onMessage(trimmed, response)
        }
      } catch (error) {
        console.error('Error:', error)
      }

      askQuestion()
    })
  }

  const start = (): void => {
    running = true

    if (showWelcome) {
      printWelcome({ useColors })
      console.log(formatStatusBar(kaios, { useColors, compact: true }))
      console.log('\nType "exit" to quit, "/status" to see status\n')
    }

    askQuestion()
  }

  const stop = (): void => {
    running = false
    rl.close()
  }

  return { start, stop }
}

// Export colors for custom styling
export { COLORS, EMOTION_COLORS }
