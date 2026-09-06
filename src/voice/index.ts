/** Provider-neutral voice seam. Importing it performs no I/O or initialization. */
import type { Affect } from '../audio/intelligence/affect-engine.js'

export interface VoiceCapabilities {
  readonly speech: boolean
  readonly singing: boolean
  /** Informational: this v1 request API returns complete output, not a stream. */
  readonly streaming: boolean
  /** Whether this adapter actually consumes the requested affect parameters. */
  readonly affect: boolean
}

export interface VoiceRequest {
  text: string
  mode?: 'speech' | 'singing'
  voiceId?: string
  affect?: Affect
  signal?: AbortSignal
}

export interface VoiceAudio {
  data: Uint8Array
  mimeType: string
}

/** `ready` is generated audio; only an adapter that played it may return `played`. */
export type VoiceResult =
  | { status: 'ready'; audio: VoiceAudio }
  | { status: 'played' }
  | { status: 'unavailable'; reason: string }
  | { status: 'cancelled' }
  | { status: 'error'; message: string }

export interface VoiceAdapter {
  readonly id: string
  readonly capabilities: VoiceCapabilities
  speak(request: VoiceRequest): Promise<VoiceResult>
}

/** An explicit silent fallback, never a successful-playback placeholder. */
export function createNullVoiceAdapter(reason = 'No voice adapter is connected'): VoiceAdapter {
  return Object.freeze({
    id: 'null',
    capabilities: Object.freeze({ speech: false, singing: false, streaming: false, affect: false }),
    async speak(request: VoiceRequest): Promise<VoiceResult> {
      return request.signal?.aborted ? { status: 'cancelled' } : { status: 'unavailable', reason }
    },
  })
}

function validRequest(request: VoiceRequest): boolean {
  if (!request || typeof request.text !== 'string' || !request.text.trim()) return false
  if (request.mode !== undefined && request.mode !== 'speech' && request.mode !== 'singing') return false
  if (request.voiceId !== undefined && (typeof request.voiceId !== 'string' || !request.voiceId.trim())) return false
  const affect = request.affect
  if (affect !== undefined) {
    if (!affect || typeof affect !== 'object') return false
    for (const [key, min, max] of [['valence', -1, 1], ['arousal', 0, 1], ['energy', 0, 1]] as const) {
      const value = affect[key]
      if (key === 'energy' && value === undefined) continue
      if (typeof value !== 'number' || !Number.isFinite(value) || value < min || value > max) return false
    }
  }
  return request.signal === undefined || (typeof request.signal?.aborted === 'boolean'
    && typeof request.signal.addEventListener === 'function' && typeof request.signal.removeEventListener === 'function')
}

function validResult(value: unknown): value is VoiceResult {
  if (!value || typeof value !== 'object' || !('status' in value)) return false
  switch (value.status) {
    case 'played': case 'cancelled': return true
    case 'unavailable': return 'reason' in value && typeof value.reason === 'string' && value.reason.trim().length > 0
    case 'error': return 'message' in value && typeof value.message === 'string' && value.message.trim().length > 0
    case 'ready': {
      if (!('audio' in value) || !value.audio || typeof value.audio !== 'object') return false
      const audio = value.audio
      return 'data' in audio && audio.data instanceof Uint8Array && audio.data.byteLength > 0
        && 'mimeType' in audio && typeof audio.mimeType === 'string' && audio.mimeType.startsWith('audio/')
    }
    default: return false
  }
}

/**
 * Validate capability use, contain provider failures, and observe cancellation.
 * The injected adapter owns credentials, synthesis, playback, and device cleanup.
 * Cancellation returns promptly; stopping underlying work requires adapter cooperation.
 */
export function createVoice(adapter: VoiceAdapter = createNullVoiceAdapter()): VoiceAdapter {
  if (!adapter || typeof adapter.id !== 'string' || !adapter.id.trim() || typeof adapter.speak !== 'function'
    || !adapter.capabilities || !['speech', 'singing', 'streaming', 'affect'].every(key => typeof adapter.capabilities[key as keyof VoiceCapabilities] === 'boolean'))
    throw new TypeError('A voice adapter needs an id, explicit capabilities, and a speak function')
  const capabilities = Object.freeze({ ...adapter.capabilities })
  return Object.freeze({
    id: adapter.id,
    capabilities,
    async speak(request: VoiceRequest): Promise<VoiceResult> {
      if (!validRequest(request)) return { status: 'error', message: 'Invalid voice request' }
      if (request.signal?.aborted) return { status: 'cancelled' }
      const mode = request.mode ?? 'speech'
      if (!capabilities[mode]) return { status: 'unavailable', reason: `Adapter ${adapter.id} does not support ${mode}` }
      if (request.affect && !capabilities.affect) return { status: 'unavailable', reason: `Adapter ${adapter.id} does not support affect parameters` }
      let onAbort: (() => void) | undefined
      const signal = request.signal
      try {
        // Register before invocation so an adapter that synchronously aborts is covered.
        const cancelled = signal ? new Promise<VoiceResult>(resolve => {
          onAbort = () => resolve({ status: 'cancelled' })
          signal.addEventListener('abort', onAbort, { once: true })
        }) : undefined
        const result = Promise.resolve(adapter.speak(request))
        const output: unknown = await (cancelled ? Promise.race([result, cancelled]) : result)
        if (signal?.aborted) return { status: 'cancelled' }
        return validResult(output) ? output : { status: 'error', message: 'Voice adapter returned an invalid result' }
      } catch {
        if (signal?.aborted) return { status: 'cancelled' }
        // Raw provider exceptions may include request URLs, credentials or private text.
        return { status: 'error', message: 'Voice adapter failed' }
      } finally {
        if (signal && onAbort) signal.removeEventListener('abort', onAbort)
      }
    },
  })
}
