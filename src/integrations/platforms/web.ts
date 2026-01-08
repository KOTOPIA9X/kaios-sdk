/**
 * Web/Browser utilities for KAIOS
 * Provides React hooks and browser-specific functionality
 */

import { Kaios } from '../../core/Kaios.js'
import type {
  KaiosConfig,
  KaiosSpeech,
  KaiosStatus,
  EmotionToken,
  HybridExpression
} from '../../core/types.js'

/**
 * Create a browser-configured KAIOS instance
 */
export function createBrowserKaios(config: Omit<KaiosConfig, 'stateBackend'> & {
  persistToLocalStorage?: boolean
}): Kaios {
  const { persistToLocalStorage = true, ...rest } = config

  return new Kaios({
    ...rest,
    stateBackend: persistToLocalStorage
      ? { type: 'localStorage' }
      : { type: 'memory' }
  })
}

/**
 * React hook types (for documentation - actual hooks in separate React package)
 */
export interface UseKaiosReturn {
  kaios: Kaios | null
  status: KaiosStatus | null
  isReady: boolean
  speak: (input: string) => Promise<KaiosSpeech>
  feel: (input: string) => Promise<HybridExpression>
  emotion: EmotionToken
}

/**
 * React hook factory for KAIOS
 * Usage with React:
 *
 * @example
 * ```tsx
 * // In your React app
 * import { useState, useEffect, useCallback } from 'react'
 * import { createBrowserKaios } from '@kaios/expression-sdk/web'
 *
 * function useKaios(config: KaiosConfig) {
 *   const [kaios, setKaios] = useState<Kaios | null>(null)
 *   const [status, setStatus] = useState<KaiosStatus | null>(null)
 *   const [isReady, setIsReady] = useState(false)
 *
 *   useEffect(() => {
 *     const instance = createBrowserKaios(config)
 *     instance.initialize().then(() => {
 *       setKaios(instance)
 *       setIsReady(true)
 *       instance.getStatus().then(setStatus)
 *     })
 *     return () => instance.dispose()
 *   }, [])
 *
 *   const speak = useCallback(async (input: string) => {
 *     if (!kaios) throw new Error('KAIOS not initialized')
 *     const result = await kaios.speak({ input })
 *     kaios.getStatus().then(setStatus)
 *     return result
 *   }, [kaios])
 *
 *   return { kaios, status, isReady, speak }
 * }
 * ```
 */
export function createUseKaios(_config: KaiosConfig): () => UseKaiosReturn {
  // This is a factory that returns a hook-like function
  // Actual React integration would be in a separate @kaios/react package
  throw new Error('For React integration, use @kaios/react package or implement your own hook')
}

/**
 * CSS class names for KAIOS components
 */
export const CSS_CLASSES = {
  // Container classes
  container: 'kaios-container',
  chatContainer: 'kaios-chat-container',
  messageContainer: 'kaios-message-container',

  // Message classes
  message: 'kaios-message',
  messageUser: 'kaios-message--user',
  messageKaios: 'kaios-message--kaios',
  messageContent: 'kaios-message__content',
  messageTime: 'kaios-message__time',
  messageEmotion: 'kaios-message__emotion',
  messageExpression: 'kaios-message__expression',

  // Emotion classes
  emotionHappy: 'kaios-emotion--happy',
  emotionSad: 'kaios-emotion--sad',
  emotionAngry: 'kaios-emotion--angry',
  emotionThink: 'kaios-emotion--think',
  emotionSurprised: 'kaios-emotion--surprised',
  emotionAwkward: 'kaios-emotion--awkward',
  emotionQuestion: 'kaios-emotion--question',
  emotionCurious: 'kaios-emotion--curious',
  emotionNeutral: 'kaios-emotion--neutral',

  // Status classes
  status: 'kaios-status',
  statusLevel: 'kaios-status__level',
  statusXp: 'kaios-status__xp',
  statusVocab: 'kaios-status__vocab',

  // Input classes
  input: 'kaios-input',
  inputField: 'kaios-input__field',
  inputButton: 'kaios-input__button',

  // Animation classes
  animateFadeIn: 'kaios-animate--fade-in',
  animateSlideIn: 'kaios-animate--slide-in',
  animatePulse: 'kaios-animate--pulse',
  animateGlitch: 'kaios-animate--glitch'
} as const

/**
 * Get CSS class for emotion
 */
export function getEmotionClass(emotion: EmotionToken): string {
  const map: Record<EmotionToken, string> = {
    EMOTE_HAPPY: CSS_CLASSES.emotionHappy,
    EMOTE_SAD: CSS_CLASSES.emotionSad,
    EMOTE_ANGRY: CSS_CLASSES.emotionAngry,
    EMOTE_THINK: CSS_CLASSES.emotionThink,
    EMOTE_SURPRISED: CSS_CLASSES.emotionSurprised,
    EMOTE_AWKWARD: CSS_CLASSES.emotionAwkward,
    EMOTE_QUESTION: CSS_CLASSES.emotionQuestion,
    EMOTE_CURIOUS: CSS_CLASSES.emotionCurious,
    EMOTE_NEUTRAL: CSS_CLASSES.emotionNeutral
  }
  return map[emotion] || CSS_CLASSES.emotionNeutral
}

/**
 * Default CSS styles (can be injected into page)
 */
export const DEFAULT_STYLES = `
.kaios-container {
  font-family: 'Consolas', 'Monaco', monospace;
  max-width: 600px;
  margin: 0 auto;
}

.kaios-chat-container {
  display: flex;
  flex-direction: column;
  height: 400px;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
}

.kaios-message-container {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  background: #1a1a1a;
}

.kaios-message {
  margin-bottom: 12px;
  padding: 8px 12px;
  border-radius: 8px;
  max-width: 80%;
}

.kaios-message--user {
  background: #2d2d2d;
  margin-left: auto;
}

.kaios-message--kaios {
  background: #1e3a5f;
}

.kaios-message__content {
  color: #fff;
}

.kaios-message__expression {
  font-size: 1.2em;
  margin-right: 8px;
}

.kaios-message__time {
  font-size: 0.75em;
  color: #666;
  margin-top: 4px;
}

/* Emotion colors */
.kaios-emotion--happy { color: #4ade80; }
.kaios-emotion--sad { color: #60a5fa; }
.kaios-emotion--angry { color: #f87171; }
.kaios-emotion--think { color: #22d3d3; }
.kaios-emotion--surprised { color: #facc15; }
.kaios-emotion--awkward { color: #c084fc; }
.kaios-emotion--question { color: #22d3d3; }
.kaios-emotion--curious { color: #facc15; }
.kaios-emotion--neutral { color: #d1d5db; }

/* Input */
.kaios-input {
  display: flex;
  padding: 12px;
  background: #2d2d2d;
  border-top: 1px solid #333;
}

.kaios-input__field {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #444;
  border-radius: 4px;
  background: #1a1a1a;
  color: #fff;
  outline: none;
}

.kaios-input__field:focus {
  border-color: #6366f1;
}

.kaios-input__button {
  margin-left: 8px;
  padding: 8px 16px;
  background: #6366f1;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
}

.kaios-input__button:hover {
  background: #4f46e5;
}

/* Animations */
.kaios-animate--fade-in {
  animation: kaios-fade-in 0.3s ease-out;
}

.kaios-animate--slide-in {
  animation: kaios-slide-in 0.3s ease-out;
}

.kaios-animate--pulse {
  animation: kaios-pulse 2s infinite;
}

.kaios-animate--glitch {
  animation: kaios-glitch 0.3s infinite;
}

@keyframes kaios-fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes kaios-slide-in {
  from { transform: translateY(10px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes kaios-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

@keyframes kaios-glitch {
  0%, 100% { transform: translate(0); }
  25% { transform: translate(-2px, 1px); }
  50% { transform: translate(2px, -1px); }
  75% { transform: translate(-1px, 2px); }
}
`

/**
 * Inject default styles into document
 */
export function injectStyles(): void {
  if (typeof document === 'undefined') return

  const styleId = 'kaios-default-styles'
  if (document.getElementById(styleId)) return

  const style = document.createElement('style')
  style.id = styleId
  style.textContent = DEFAULT_STYLES
  document.head.appendChild(style)
}

/**
 * Create a simple chat widget element
 */
export function createChatWidget(container: HTMLElement, kaios: Kaios): {
  destroy: () => void
} {
  // Inject styles
  injectStyles()

  // Create container
  container.className = CSS_CLASSES.container

  const chatContainer = document.createElement('div')
  chatContainer.className = CSS_CLASSES.chatContainer

  const messageContainer = document.createElement('div')
  messageContainer.className = CSS_CLASSES.messageContainer

  const inputContainer = document.createElement('div')
  inputContainer.className = CSS_CLASSES.input

  const input = document.createElement('input')
  input.className = CSS_CLASSES.inputField
  input.placeholder = 'Talk to KAIOS...'
  input.type = 'text'

  const button = document.createElement('button')
  button.className = CSS_CLASSES.inputButton
  button.textContent = 'Send'

  inputContainer.appendChild(input)
  inputContainer.appendChild(button)

  chatContainer.appendChild(messageContainer)
  chatContainer.appendChild(inputContainer)

  container.appendChild(chatContainer)

  // Add message helper
  const addMessage = (content: string, isUser: boolean, emotion?: EmotionToken) => {
    const msg = document.createElement('div')
    msg.className = `${CSS_CLASSES.message} ${isUser ? CSS_CLASSES.messageUser : CSS_CLASSES.messageKaios} ${CSS_CLASSES.animateFadeIn}`

    const contentEl = document.createElement('div')
    contentEl.className = CSS_CLASSES.messageContent
    if (emotion) {
      contentEl.classList.add(getEmotionClass(emotion))
    }
    contentEl.textContent = content

    msg.appendChild(contentEl)
    messageContainer.appendChild(msg)
    messageContainer.scrollTop = messageContainer.scrollHeight
  }

  // Handle send
  const handleSend = async () => {
    const text = input.value.trim()
    if (!text) return

    addMessage(text, true)
    input.value = ''

    try {
      const response = await kaios.speak({ input: text })

      // Format response with expression
      let displayText = ''
      if (response.expressions.length > 0) {
        displayText = response.expressions[0].kaimoji + ' '
      }
      displayText += response.rawInput

      addMessage(displayText, false, response.emotion)
    } catch (error) {
      console.error('KAIOS error:', error)
      addMessage('*connection glitch* (>_<)', false, 'EMOTE_SAD')
    }
  }

  button.addEventListener('click', handleSend)
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleSend()
  })

  return {
    destroy: () => {
      container.innerHTML = ''
    }
  }
}

// Re-export Kaios for convenience
export { Kaios }
