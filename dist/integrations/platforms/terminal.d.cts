import { K as Kaios } from '../../Kaios-gza--3cs.cjs';
import { E as EmotionToken, K as KaiosSpeech } from '../../types-BNd-Zg3U.cjs';
import 'eventemitter3';

/**
 * Terminal/CLI utilities for KAIOS
 * Provides readline interface and formatting for terminal applications
 */

declare const COLORS: {
    readonly reset: "\u001B[0m";
    readonly bright: "\u001B[1m";
    readonly dim: "\u001B[2m";
    readonly italic: "\u001B[3m";
    readonly underline: "\u001B[4m";
    readonly black: "\u001B[30m";
    readonly red: "\u001B[31m";
    readonly green: "\u001B[32m";
    readonly yellow: "\u001B[33m";
    readonly blue: "\u001B[34m";
    readonly magenta: "\u001B[35m";
    readonly cyan: "\u001B[36m";
    readonly white: "\u001B[37m";
    readonly bgBlack: "\u001B[40m";
    readonly bgRed: "\u001B[41m";
    readonly bgGreen: "\u001B[42m";
    readonly bgYellow: "\u001B[43m";
    readonly bgBlue: "\u001B[44m";
    readonly bgMagenta: "\u001B[45m";
    readonly bgCyan: "\u001B[46m";
    readonly bgWhite: "\u001B[47m";
};
/**
 * Color map for emotions
 */
declare const EMOTION_COLORS: Record<EmotionToken, string>;
/**
 * Format KAIOS speech for terminal output
 */
declare function formatSpeech(speech: KaiosSpeech, options?: {
    useColors?: boolean;
    showTimestamp?: boolean;
}): string;
/**
 * Format status bar for KAIOS
 */
declare function formatStatusBar(kaios: Kaios, options?: {
    useColors?: boolean;
    compact?: boolean;
}): string;
/**
 * Print a welcome message for KAIOS terminal session
 */
declare function printWelcome(options?: {
    useColors?: boolean;
}): void;
/**
 * Create a simple prompt string
 */
declare function createPrompt(options?: {
    username?: string;
    useColors?: boolean;
}): string;
/**
 * Format KAIOS response prefix
 */
declare function createResponsePrefix(options?: {
    useColors?: boolean;
}): string;
/**
 * Simple terminal chat utility
 */
interface TerminalChatOptions {
    kaios: Kaios;
    username?: string;
    useColors?: boolean;
    showWelcome?: boolean;
    onMessage?: (input: string, response: KaiosSpeech) => void;
}
/**
 * Create a readline interface for KAIOS chat
 * Returns cleanup function
 */
declare function createTerminalChat(options: TerminalChatOptions): Promise<{
    start: () => void;
    stop: () => void;
}>;

export { COLORS, EMOTION_COLORS, type TerminalChatOptions, createPrompt, createResponsePrefix, createTerminalChat, formatSpeech, formatStatusBar, printWelcome };
