import { compileCharacterPrompt, KAIOS_CHARACTER, type CharacterDefinition } from '../character/index.js'
import { EmotionSystem } from '../core/emotion-system.js'
import { emotionToKaomoji, isValidEmotion, parseResponse } from '../llm/parseEmotions.js'
import type { EmotionToken } from '../core/types.js'

export interface Message { role: 'user' | 'assistant'; content: string }
export interface TextRequest { system: string; messages: readonly Message[]; signal?: AbortSignal }
export interface TextResponse { text: string; model: string }
/** Inject a provider on the server, or an authenticated application proxy in a browser. */
export interface TextAdapter {
  readonly id: string
  generate(request: TextRequest): Promise<TextResponse>
}
/**
 * Reads/appends require consent; clear is an explicit forget operation.
 * An append must settle only after its write is complete. The runtime cannot safely
 * abandon a noncooperative write: forget waits for actual writes before clearing.
 */
export interface SessionMemory {
  read(sessionId: string): Promise<readonly Message[]>
  append(sessionId: string, messages: readonly Message[]): Promise<void>
  clear(sessionId: string): Promise<void>
}
export interface IdentitySnapshot { block: string; status: 'fresh' | 'stale' | 'unavailable' }
export interface CanonicalIdentityAdapter { read(): Promise<IdentitySnapshot> }
export type RuntimeIdentity = { mode: 'variation' } | { mode: 'canonical'; adapter: CanonicalIdentityAdapter }
export interface RuntimeConfig {
  character?: CharacterDefinition
  identity?: RuntimeIdentity
  text?: TextAdapter
  memory?: { store: SessionMemory; sessionId: string; maxMessages?: number }
  /** Read/inference deadline per active reply, default 30s, maximum 120s. Does not abandon storage writes. */
  timeoutMs?: number
}
export interface Expression { emotion: EmotionToken; face: string }
export type Reply =
  | { status: 'generated'; text: string; expression: Expression; provider: string; model: string;
      identity: 'variation' | 'canonical'; memory: 'disabled' | 'remembered' | 'released' | 'error' }
  | { status: 'unavailable' | 'cancelled' | 'error'; reason: string }

type ReplyFailure = Exclude<Reply, {status: 'generated'}>

/** Observe cancellation even when an injected adapter does not cooperate. */
function replyBoundary(external: AbortSignal | undefined, timeoutMs: number) {
  const controller = new AbortController()
  let failure: ReplyFailure | undefined
  const interrupt = (next: ReplyFailure) => {
    if (failure) return
    failure = next
    controller.abort()
  }
  const onExternalAbort = () => interrupt({status: 'cancelled', reason: 'request cancelled'})
  external?.addEventListener('abort', onExternalAbort, {once: true})
  if (external?.aborted) onExternalAbort()
  const timer = setTimeout(() => interrupt({status: 'error', reason: 'request timed out'}), timeoutMs)
  return {
    signal: controller.signal,
    failure: () => failure,
    async wait<T>(operation: () => Promise<T>): Promise<T> {
      if (failure) throw new Error('request interrupted')
      let onAbort: (() => void) | undefined
      try {
        const interrupted = new Promise<never>((_, reject) => {
          onAbort = () => reject(new Error('request interrupted'))
          controller.signal.addEventListener('abort', onAbort, {once: true})
        })
        // Both branches stay observed, including any late adapter rejection.
        return await Promise.race([Promise.resolve().then(() => {
          if (failure) throw new Error('request interrupted')
          return operation()
        }), interrupted])
      } finally {
        if (onAbort) controller.signal.removeEventListener('abort', onAbort)
      }
    },
    close() {
      clearTimeout(timer)
      external?.removeEventListener('abort', onExternalAbort)
    },
  }
}

/** In-memory reference store. A host can inject durable storage with the same contract. */
export function createSessionMemory(): SessionMemory {
  const sessions = new Map<string, Message[]>()
  const copy = (messages: readonly Message[]) => messages.map(({role, content}) => ({role, content}))
  return {
    async read(id) { return copy(sessions.get(id) ?? []) },
    async append(id, messages) { sessions.set(id, [...(sessions.get(id) ?? []), ...copy(messages)].slice(-100)) },
    async clear(id) { sessions.delete(id) },
  }
}

/** Public portable runtime. Constructors/imports start no IO, timers, inference or playback. */
export class KaiosRuntime {
  private readonly prompt: string
  private readonly identity: RuntimeIdentity
  private readonly text?: TextAdapter
  private readonly memory?: RuntimeConfig['memory']
  private readonly maxMessages: number
  private readonly timeoutMs: number
  private consent = false
  private epoch = 0
  private queue: Promise<unknown> = Promise.resolve()

  constructor(config: RuntimeConfig = {}) {
    this.prompt = compileCharacterPrompt(config.character ?? KAIOS_CHARACTER)
    const identity = config.identity ?? {mode: 'variation'}
    if (identity.mode !== 'variation' && identity.mode !== 'canonical') throw new TypeError('unknown identity mode')
    if (identity.mode === 'canonical' && typeof identity.adapter?.read !== 'function') throw new TypeError('canonical identity requires a read adapter')
    this.identity = identity.mode === 'canonical' ? {mode: 'canonical', adapter: identity.adapter} : {mode: 'variation'}
    this.text = config.text
    this.memory = config.memory ? {...config.memory} : undefined
    this.maxMessages = config.memory?.maxMessages ?? 20
    this.timeoutMs = config.timeoutMs ?? 30000
    if (!Number.isFinite(this.timeoutMs) || this.timeoutMs <= 0 || this.timeoutMs > 120000) {
      throw new RangeError('timeoutMs must be finite in (0, 120000]')
    }
    if (!Number.isInteger(this.maxMessages) || this.maxMessages < 1 || this.maxMessages > 100) {
      throw new RangeError('maxMessages must be an integer in [1, 100]')
    }
    if (this.memory && !this.memory.sessionId.trim()) throw new TypeError('memory requires a sessionId')
  }

  express(text: string, emotion?: EmotionToken): Expression {
    if (typeof text !== 'string') throw new TypeError('text must be a string')
    if (emotion !== undefined && !isValidEmotion(emotion)) throw new TypeError('unknown emotion token')
    const selected = emotion ?? new EmotionSystem().analyzeText(text).emotion
    return {emotion: selected, face: emotionToKaomoji(selected)}
  }

  /** Consent applies to this session store only. Provider data policies belong to the host. */
  setMemoryConsent(enabled: boolean): void {
    if (typeof enabled !== 'boolean') throw new TypeError('consent must be boolean')
    if (enabled && !this.memory) throw new Error('Configure a session store before granting consent')
    this.consent = enabled
    this.epoch++
  }

  /**
   * Revoke immediately; clear after in-flight writes settle so history cannot reappear.
   * A store that never settles append/clear prevents completion; no successful deletion
   * is reported while such a write is still capable of restoring private history.
   */
  forget(): Promise<void> {
    this.setMemoryConsent(false)
    return this.enqueue(async () => { await this.memory?.store.clear(this.memory.sessionId) })
  }

  reply(input: string, options: {signal?: AbortSignal} = {}): Promise<Reply> {
    if (typeof input !== 'string' || !input.trim() || input.length > 32000) {
      return Promise.resolve({status: 'error', reason: 'input must contain 1–32000 characters'})
    }
    const epoch = this.epoch
    const hadConsent = this.consent
    const signal = options.signal
    return this.enqueue(async (): Promise<Reply> => {
      if (signal?.aborted) return {status: 'cancelled', reason: 'request cancelled'}
      if (!this.text) return {status: 'unavailable', reason: 'no text adapter configured'}
      const boundary = replyBoundary(signal, this.timeoutMs)
      try {
        let system = this.prompt
        if (this.identity.mode === 'canonical') {
          let snapshot: IdentitySnapshot
          const adapter = this.identity.adapter
          try { snapshot = await boundary.wait(() => adapter.read()) }
          catch { return boundary.failure() ?? {status: 'unavailable', reason: 'canonical identity unavailable'} }
          // A stale or empty identity never silently becomes a fresh canonical response.
          if (snapshot?.status !== 'fresh' || typeof snapshot.block !== 'string' || !snapshot.block.trim()) {
            return {status: 'unavailable', reason: 'fresh canonical identity required'}
          }
          system += `\n\n## Canonical continuity\n${snapshot.block}`
        } else {
          system += '\n\nThis is a standalone KAIOS variation with its own session continuity.'
        }
        const mayRemember = () => !!this.memory && hadConsent && this.consent && epoch === this.epoch
        let history: Message[] = []
        try {
          if (mayRemember()) {
            const saved = await boundary.wait(() => this.memory!.store.read(this.memory!.sessionId))
            history = saved.slice(-this.maxMessages).map(({role, content}) => {
              if (!['user', 'assistant'].includes(role) || typeof content !== 'string') throw new TypeError('invalid history')
              return {role, content}
            })
          }
        } catch { return boundary.failure() ?? {status: 'error', reason: 'session memory could not be read'} }
        if (!mayRemember()) history = []
        if (boundary.failure()) return boundary.failure()!
        const messages: Message[] = [...history, {role: 'user', content: input}]
        let output: TextResponse
        try { output = await boundary.wait(() => this.text!.generate({system, messages, signal: boundary.signal})) }
        catch { return boundary.failure() ?? {status: 'error', reason: 'text adapter failed'} }
        if (boundary.failure()) return boundary.failure()!
        if (typeof output?.text !== 'string' || !output.text.trim() || typeof output.model !== 'string' || !output.model.trim()) {
          return {status: 'error', reason: 'text adapter returned no text or model identity'}
        }
        let memory: 'disabled' | 'remembered' | 'released' | 'error' = hadConsent ? 'released' : 'disabled'
        if (mayRemember()) {
          try {
            await this.memory!.store.append(this.memory!.sessionId, [{role: 'user', content: input}, {role: 'assistant', content: output.text}])
            memory = mayRemember() ? 'remembered' : 'released'
          } catch { memory = 'error' }
        }
        if (boundary.failure()) return boundary.failure()!
        const parsed = parseResponse(output.text)
        return {status: 'generated', text: output.text, expression: this.express(parsed.cleanText, parsed.emotions[0]),
          provider: this.text.id, model: output.model, identity: this.identity.mode, memory}
      } finally { boundary.close() }
    })
  }

  private enqueue<T>(operation: () => Promise<T>): Promise<T> {
    const next = this.queue.then(operation, operation)
    this.queue = next.catch(() => undefined)
    return next
  }
}

export function createKaios(config: RuntimeConfig = {}): KaiosRuntime { return new KaiosRuntime(config) }
