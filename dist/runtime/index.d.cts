import { CharacterDefinition } from '../character/index.cjs';
import { E as EmotionToken } from '../types-0SKyQiZK.cjs';
import '../spine/spine-adapter.cjs';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}
interface TextRequest {
    system: string;
    messages: readonly Message[];
    signal?: AbortSignal;
}
interface TextResponse {
    text: string;
    model: string;
}
/** Inject a provider on the server, or an authenticated application proxy in a browser. */
interface TextAdapter {
    readonly id: string;
    generate(request: TextRequest): Promise<TextResponse>;
}
/**
 * Reads/appends require consent; clear is an explicit forget operation.
 * An append must settle only after its write is complete. The runtime cannot safely
 * abandon a noncooperative write: forget waits for actual writes before clearing.
 */
interface SessionMemory {
    read(sessionId: string): Promise<readonly Message[]>;
    append(sessionId: string, messages: readonly Message[]): Promise<void>;
    clear(sessionId: string): Promise<void>;
}
interface IdentitySnapshot {
    block: string;
    status: 'fresh' | 'stale' | 'unavailable';
}
interface CanonicalIdentityAdapter {
    read(): Promise<IdentitySnapshot>;
}
type RuntimeIdentity = {
    mode: 'variation';
} | {
    mode: 'canonical';
    adapter: CanonicalIdentityAdapter;
};
interface RuntimeConfig {
    character?: CharacterDefinition;
    identity?: RuntimeIdentity;
    text?: TextAdapter;
    memory?: {
        store: SessionMemory;
        sessionId: string;
        maxMessages?: number;
    };
    /** Read/inference deadline per active reply, default 30s, maximum 120s. Does not abandon storage writes. */
    timeoutMs?: number;
}
interface Expression {
    emotion: EmotionToken;
    face: string;
}
type Reply = {
    status: 'generated';
    text: string;
    expression: Expression;
    provider: string;
    model: string;
    identity: 'variation' | 'canonical';
    memory: 'disabled' | 'remembered' | 'released' | 'error';
} | {
    status: 'unavailable' | 'cancelled' | 'error';
    reason: string;
};
/** In-memory reference store. A host can inject durable storage with the same contract. */
declare function createSessionMemory(): SessionMemory;
/** Public portable runtime. Constructors/imports start no IO, timers, inference or playback. */
declare class KaiosRuntime {
    private readonly prompt;
    private readonly identity;
    private readonly text?;
    private readonly memory?;
    private readonly maxMessages;
    private readonly timeoutMs;
    private consent;
    private epoch;
    private queue;
    constructor(config?: RuntimeConfig);
    express(text: string, emotion?: EmotionToken): Expression;
    /** Consent applies to this session store only. Provider data policies belong to the host. */
    setMemoryConsent(enabled: boolean): void;
    /**
     * Revoke immediately; clear after in-flight writes settle so history cannot reappear.
     * A store that never settles append/clear prevents completion; no successful deletion
     * is reported while such a write is still capable of restoring private history.
     */
    forget(): Promise<void>;
    reply(input: string, options?: {
        signal?: AbortSignal;
    }): Promise<Reply>;
    private enqueue;
}
declare function createKaios(config?: RuntimeConfig): KaiosRuntime;

export { type CanonicalIdentityAdapter, type Expression, type IdentitySnapshot, KaiosRuntime, type Message, type Reply, type RuntimeConfig, type RuntimeIdentity, type SessionMemory, type TextAdapter, type TextRequest, type TextResponse, createKaios, createSessionMemory };
