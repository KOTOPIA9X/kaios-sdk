import { A as Affect } from '../affect-engine-OOEew1HW.js';

/** Provider-neutral voice seam. Importing it performs no I/O or initialization. */

interface VoiceCapabilities {
    readonly speech: boolean;
    readonly singing: boolean;
    /** Informational: this v1 request API returns complete output, not a stream. */
    readonly streaming: boolean;
    /** Whether this adapter actually consumes the requested affect parameters. */
    readonly affect: boolean;
}
interface VoiceRequest {
    text: string;
    mode?: 'speech' | 'singing';
    voiceId?: string;
    affect?: Affect;
    signal?: AbortSignal;
}
interface VoiceAudio {
    data: Uint8Array;
    mimeType: string;
}
/** `ready` is generated audio; only an adapter that played it may return `played`. */
type VoiceResult = {
    status: 'ready';
    audio: VoiceAudio;
} | {
    status: 'played';
} | {
    status: 'unavailable';
    reason: string;
} | {
    status: 'cancelled';
} | {
    status: 'error';
    message: string;
};
interface VoiceAdapter {
    readonly id: string;
    readonly capabilities: VoiceCapabilities;
    speak(request: VoiceRequest): Promise<VoiceResult>;
}
/** An explicit silent fallback, never a successful-playback placeholder. */
declare function createNullVoiceAdapter(reason?: string): VoiceAdapter;
/**
 * Validate capability use, contain provider failures, and observe cancellation.
 * The injected adapter owns credentials, synthesis, playback, and device cleanup.
 * Cancellation returns promptly; stopping underlying work requires adapter cooperation.
 */
declare function createVoice(adapter?: VoiceAdapter): VoiceAdapter;

export { type VoiceAdapter, type VoiceAudio, type VoiceCapabilities, type VoiceRequest, type VoiceResult, createNullVoiceAdapter, createVoice };
