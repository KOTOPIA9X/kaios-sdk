/**
 * KAIOS LLM Module
 *
 * Provides chat functionality using Simon Willison's `llm` CLI
 * with KAIOS personality and emotion parsing
 *
 * @example
 * ```typescript
 * import { chat, parseResponse } from '@kaios/expression-sdk/llm'
 *
 * const response = await chat('Hello KAIOS!')
 * const parsed = parseResponse(response)
 *
 * console.log(parsed.cleanText)
 * console.log(parsed.emotions)
 * ```
 */

// Chat functions
export {
  chat,
  chatStream,
  chatContinue,
  getModels,
  SYSTEM_PROMPT
} from './chat.js'

export type {
  ChatOptions,
  ChatResponse
} from './chat.js'

// Emotion parsing
export {
  parseResponse,
  extractEmotions,
  getDominantEmotion,
  cleanResponse,
  formatEmotionToken,
  isValidEmotion,
  getEmotionName,
  emotionToColor,
  emotionToKaomoji
} from './parseEmotions.js'

export type {
  EmotionSegment,
  ParsedResponse
} from './parseEmotions.js'
