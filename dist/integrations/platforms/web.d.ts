import { K as Kaios } from '../../Kaios-CRY_mlni.js';
import { a as KaiosConfig, b as KaiosStatus, K as KaiosSpeech, H as HybridExpression, E as EmotionToken } from '../../types-DwXbfpBp.js';
import 'eventemitter3';

/**
 * Web/Browser utilities for KAIOS
 * Provides React hooks and browser-specific functionality
 */

/**
 * Create a browser-configured KAIOS instance
 */
declare function createBrowserKaios(config: Omit<KaiosConfig, 'stateBackend'> & {
    persistToLocalStorage?: boolean;
}): Kaios;
/**
 * React hook types (for documentation - actual hooks in separate React package)
 */
interface UseKaiosReturn {
    kaios: Kaios | null;
    status: KaiosStatus | null;
    isReady: boolean;
    speak: (input: string) => Promise<KaiosSpeech>;
    feel: (input: string) => Promise<HybridExpression>;
    emotion: EmotionToken;
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
declare function createUseKaios(_config: KaiosConfig): () => UseKaiosReturn;
/**
 * CSS class names for KAIOS components
 */
declare const CSS_CLASSES: {
    readonly container: "kaios-container";
    readonly chatContainer: "kaios-chat-container";
    readonly messageContainer: "kaios-message-container";
    readonly message: "kaios-message";
    readonly messageUser: "kaios-message--user";
    readonly messageKaios: "kaios-message--kaios";
    readonly messageContent: "kaios-message__content";
    readonly messageTime: "kaios-message__time";
    readonly messageEmotion: "kaios-message__emotion";
    readonly messageExpression: "kaios-message__expression";
    readonly emotionHappy: "kaios-emotion--happy";
    readonly emotionSad: "kaios-emotion--sad";
    readonly emotionAngry: "kaios-emotion--angry";
    readonly emotionThink: "kaios-emotion--think";
    readonly emotionSurprised: "kaios-emotion--surprised";
    readonly emotionAwkward: "kaios-emotion--awkward";
    readonly emotionQuestion: "kaios-emotion--question";
    readonly emotionCurious: "kaios-emotion--curious";
    readonly emotionNeutral: "kaios-emotion--neutral";
    readonly status: "kaios-status";
    readonly statusLevel: "kaios-status__level";
    readonly statusXp: "kaios-status__xp";
    readonly statusVocab: "kaios-status__vocab";
    readonly input: "kaios-input";
    readonly inputField: "kaios-input__field";
    readonly inputButton: "kaios-input__button";
    readonly animateFadeIn: "kaios-animate--fade-in";
    readonly animateSlideIn: "kaios-animate--slide-in";
    readonly animatePulse: "kaios-animate--pulse";
    readonly animateGlitch: "kaios-animate--glitch";
};
/**
 * Get CSS class for emotion
 */
declare function getEmotionClass(emotion: EmotionToken): string;
/**
 * Default CSS styles (can be injected into page)
 */
declare const DEFAULT_STYLES = "\n.kaios-container {\n  font-family: 'Consolas', 'Monaco', monospace;\n  max-width: 600px;\n  margin: 0 auto;\n}\n\n.kaios-chat-container {\n  display: flex;\n  flex-direction: column;\n  height: 400px;\n  border: 1px solid #333;\n  border-radius: 8px;\n  overflow: hidden;\n}\n\n.kaios-message-container {\n  flex: 1;\n  overflow-y: auto;\n  padding: 16px;\n  background: #1a1a1a;\n}\n\n.kaios-message {\n  margin-bottom: 12px;\n  padding: 8px 12px;\n  border-radius: 8px;\n  max-width: 80%;\n}\n\n.kaios-message--user {\n  background: #2d2d2d;\n  margin-left: auto;\n}\n\n.kaios-message--kaios {\n  background: #1e3a5f;\n}\n\n.kaios-message__content {\n  color: #fff;\n}\n\n.kaios-message__expression {\n  font-size: 1.2em;\n  margin-right: 8px;\n}\n\n.kaios-message__time {\n  font-size: 0.75em;\n  color: #666;\n  margin-top: 4px;\n}\n\n/* Emotion colors */\n.kaios-emotion--happy { color: #4ade80; }\n.kaios-emotion--sad { color: #60a5fa; }\n.kaios-emotion--angry { color: #f87171; }\n.kaios-emotion--think { color: #22d3d3; }\n.kaios-emotion--surprised { color: #facc15; }\n.kaios-emotion--awkward { color: #c084fc; }\n.kaios-emotion--question { color: #22d3d3; }\n.kaios-emotion--curious { color: #facc15; }\n.kaios-emotion--neutral { color: #d1d5db; }\n\n/* Input */\n.kaios-input {\n  display: flex;\n  padding: 12px;\n  background: #2d2d2d;\n  border-top: 1px solid #333;\n}\n\n.kaios-input__field {\n  flex: 1;\n  padding: 8px 12px;\n  border: 1px solid #444;\n  border-radius: 4px;\n  background: #1a1a1a;\n  color: #fff;\n  outline: none;\n}\n\n.kaios-input__field:focus {\n  border-color: #6366f1;\n}\n\n.kaios-input__button {\n  margin-left: 8px;\n  padding: 8px 16px;\n  background: #6366f1;\n  border: none;\n  border-radius: 4px;\n  color: #fff;\n  cursor: pointer;\n}\n\n.kaios-input__button:hover {\n  background: #4f46e5;\n}\n\n/* Animations */\n.kaios-animate--fade-in {\n  animation: kaios-fade-in 0.3s ease-out;\n}\n\n.kaios-animate--slide-in {\n  animation: kaios-slide-in 0.3s ease-out;\n}\n\n.kaios-animate--pulse {\n  animation: kaios-pulse 2s infinite;\n}\n\n.kaios-animate--glitch {\n  animation: kaios-glitch 0.3s infinite;\n}\n\n@keyframes kaios-fade-in {\n  from { opacity: 0; }\n  to { opacity: 1; }\n}\n\n@keyframes kaios-slide-in {\n  from { transform: translateY(10px); opacity: 0; }\n  to { transform: translateY(0); opacity: 1; }\n}\n\n@keyframes kaios-pulse {\n  0%, 100% { opacity: 1; }\n  50% { opacity: 0.7; }\n}\n\n@keyframes kaios-glitch {\n  0%, 100% { transform: translate(0); }\n  25% { transform: translate(-2px, 1px); }\n  50% { transform: translate(2px, -1px); }\n  75% { transform: translate(-1px, 2px); }\n}\n";
/**
 * Inject default styles into document
 */
declare function injectStyles(): void;
/**
 * Create a simple chat widget element
 */
declare function createChatWidget(container: HTMLElement, kaios: Kaios): {
    destroy: () => void;
};

export { CSS_CLASSES, DEFAULT_STYLES, Kaios, type UseKaiosReturn, createBrowserKaios, createChatWidget, createUseKaios, getEmotionClass, injectStyles };
