/** Offline expression vocabulary. No production Kaimoji API or account is required. */
export * from '../core/kaimoji-library.js'
export * from './grammar.js'
export { EmotionSystem } from '../core/emotion-system.js'
export { parseResponse, emotionToKaomoji, isValidEmotion } from '../llm/parseEmotions.js'
export type { Kaimoji, KaimojiCategory, KaimojiContext, EmotionToken, EmotionState } from '../core/types.js'
