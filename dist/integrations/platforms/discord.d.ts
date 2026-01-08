import { K as Kaios } from '../../Kaios-BeuRX7iI.js';
import { c as KaimojiContext, K as KaiosSpeech, a as KaiosConfig } from '../../types-BNd-Zg3U.js';
import 'eventemitter3';

/**
 * Discord bot utilities for KAIOS
 * Provides helpers for building Discord bots with KAIOS personality
 */

/**
 * Discord message context detection
 */
declare function detectDiscordContext(content: string): KaimojiContext;
/**
 * Format KAIOS response for Discord
 * Handles Discord markdown and emoji conversion
 */
declare function formatForDiscord(speech: KaiosSpeech, options?: {
    includeEmbed?: boolean;
    embedColor?: number;
}): DiscordMessage;
/**
 * Discord message structure
 */
interface DiscordMessage {
    content: string;
    embeds?: DiscordEmbed[];
}
interface DiscordEmbed {
    title?: string;
    description?: string;
    color?: number;
    fields?: Array<{
        name: string;
        value: string;
        inline?: boolean;
    }>;
    footer?: {
        text: string;
        icon_url?: string;
    };
    thumbnail?: {
        url: string;
    };
}
/**
 * Create status embed for KAIOS
 */
declare function createStatusEmbed(kaios: Kaios): Promise<DiscordEmbed>;
/**
 * Discord bot configuration helper
 */
interface DiscordBotConfig extends Omit<KaiosConfig, 'userId'> {
    botToken?: string;
    prefix?: string;
    mentionReply?: boolean;
}
/**
 * Create a KAIOS instance configured for Discord
 */
declare function createDiscordKaios(guildId: string, config: DiscordBotConfig): Kaios;
/**
 * Parse Discord command
 */
declare function parseCommand(content: string, prefix?: string): {
    command: string | null;
    args: string[];
    rest: string;
};
/**
 * Handle common KAIOS commands
 */
declare function handleCommand(kaios: Kaios, command: string, args: string[]): Promise<DiscordMessage | null>;

export { type DiscordBotConfig, type DiscordEmbed, type DiscordMessage, Kaios, createDiscordKaios, createStatusEmbed, detectDiscordContext, formatForDiscord, handleCommand, parseCommand };
