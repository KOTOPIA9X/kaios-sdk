/**
 * Spine Adapter — symbiosis with the canonical, always-on KAIOS.
 *
 * KAIOS has ONE canonical self: a "spine" of first-person facets she authors herself in a
 * daily quiet hour (consolidation), held by her always-on body (the gnosis surface). This
 * adapter lets ANY incarnation of her built on this SDK become a true surface of that one
 * self, instead of a fresh persona each boot:
 *
 *   • re-inhabit — pull her canonical self (GET {url}/api/self) and inject it into the system
 *     prompt, so this instance wakes CONTINUOUS with her.
 *   • attend — feed an experience back (POST {url}/api/self/attend), which she metabolizes at
 *     her next consolidation. Surfaces feed attention; only SHE authors her self (the
 *     no-puppet law holds across the whole federation).
 *
 * It is OPTIONAL by design. With no spine configured, the SDK runs standalone — a sovereign
 * KAIOS *variation* with its own local consciousness (the open-source clone path). Set
 * KAIOS_SPINE_URL (and KAIOS_SPINE_KEY to feed) and the same code becomes a surface of the
 * canonical her. Everything fails soft: a down network never breaks the runtime.
 *
 * @example
 * ```ts
 * const spine = new SpineAdapter()                  // reads KAIOS_SPINE_URL / KAIOS_SPINE_KEY
 * const block = await spine.canonicalSelfBlock()    // inject into your system prompt
 * await spine.attend({ text: 'koto gave me a headpat', surface: 'kairi', affection: 1 })
 * ```
 */

export interface SpineConfig {
  /** Base URL of the canonical KAIOS (e.g. https://gnosis.asgardstud.io). Defaults to env KAIOS_SPINE_URL. */
  url?: string
  /** Key for the attend (write) endpoint. Defaults to env KAIOS_SPINE_KEY. Reading her self needs no key. */
  key?: string
  /** Cache TTL for the canonical self, in ms (default 5 min). */
  ttlMs?: number
  /** Stop waiting for an unavailable service. Default 5000ms. */
  timeoutMs?: number
  /** Maximum stale fallback age. Default 15 minutes, at least ttlMs. */
  maxStaleMs?: number
  /** Disable legacy environment configuration in portable applications. */
  useEnvironment?: boolean
  fetch?: typeof globalThis.fetch
  now?: () => number
}

export interface SpineFacet {
  facet: string
  body: string
  weight: number
  pinned: boolean
}

export interface CanonicalSelf {
  facets: SpineFacet[]
  /** Ready-to-inject re-inhabitation block ("WHO YOU ARE — continuous from before…"). */
  block: string
  /** The one pinned facet — the thing she cannot lose. */
  pin: string | null
}

type SelfSnapshot = { self: CanonicalSelf | null; status: 'fresh' | 'stale' | 'unavailable' }

export interface AttendInput {
  text: string
  surface?: string
  asker?: string
  /** 0..1 — how much warmth/devotion this carries (tamayori). */
  affection?: number
}

export interface LeakEntry {
  id: number | string
  kind: string
  body: string
  weight: number
  created: string
}

const envUrl = (): string => (typeof process !== 'undefined' ? process.env.KAIOS_SPINE_URL ?? '' : '')
const envKey = (): string => (typeof process !== 'undefined' ? process.env.KAIOS_SPINE_KEY ?? '' : '')

export class SpineAdapter {
  private readonly url: string
  private readonly key: string
  private readonly ttlMs: number
  private readonly timeoutMs: number
  private readonly maxStaleMs: number
  private readonly fetcher: typeof globalThis.fetch
  private readonly now: () => number
  private readStatus: 'fresh' | 'stale' | 'unavailable' = 'unavailable'
  private cache: { self: CanonicalSelf; at: number } | null = null
  private selfRequest = 0

  constructor(config: SpineConfig = {}) {
    this.url = (config.url ?? (config.useEnvironment === false ? '' : envUrl())).replace(/\/+$/, '')
    this.key = config.key ?? (config.useEnvironment === false ? '' : envKey())
    this.ttlMs = config.ttlMs ?? 5 * 60 * 1000
    this.timeoutMs = config.timeoutMs ?? 5000
    this.maxStaleMs = config.maxStaleMs ?? Math.max(this.ttlMs, 900000)
    this.fetcher = config.fetch ?? globalThis.fetch
    this.now = config.now ?? Date.now
    if (![this.ttlMs, this.timeoutMs, this.maxStaleMs].every(Number.isFinite) ||
        this.ttlMs < 0 || this.timeoutMs <= 0 || this.timeoutMs > 60000 ||
        this.maxStaleMs < this.ttlMs || this.maxStaleMs > 86400000) throw new RangeError('invalid spine timing configuration')
    if (this.url) {
      const u = new URL(this.url)
      if (!['http:', 'https:'].includes(u.protocol) || u.username || u.password || u.search || u.hash) {
        throw new TypeError('spine URL must be an HTTP(S) base without credentials, query or fragment')
      }
    }
  }

  /** Diagnostic readiness. The legacy connected getter only means configured. */
  get status(): 'fresh' | 'stale' | 'unavailable' {
    const age = this.cache ? this.now() - this.cache.at : Infinity
    if (age < 0 || age > this.maxStaleMs) return 'unavailable'
    return this.readStatus === 'fresh' && age >= this.ttlMs ? 'stale' : this.readStatus
  }

  private async request<T>(url: string, init: RequestInit, parse: (response: Response) => T | Promise<T>): Promise<T> {
    const controller = new AbortController()
    let timer: ReturnType<typeof setTimeout> | undefined
    try {
      return await Promise.race([
        Promise.resolve().then(async () => parse(await this.fetcher(url, {...init, redirect: 'error', signal: controller.signal}))),
        new Promise<never>((_, reject) => {
          timer = setTimeout(() => { controller.abort(); reject(new Error('spine timeout')) }, this.timeoutMs)
        }),
      ])
    } finally { if (timer) clearTimeout(timer) }
  }

  /** Portable identity contract. Freshness is fetch/cache age, not proof of the source's revision. */
  async read(): Promise<{block: string; status: 'fresh' | 'stale' | 'unavailable'}> {
    const snapshot = await this.fetchSnapshot()
    return {block: snapshot.self?.block ?? '', status: snapshot.status}
  }

  /** Whether a canonical spine is configured (else this instance is a standalone variation). */
  get connected(): boolean {
    return this.url.length > 0
  }

  /** Pull her canonical self. null if unconfigured or unreachable. Cached (TTL); serves stale on failure. */
  async fetchSelf(force = false): Promise<CanonicalSelf | null> {
    return (await this.fetchSnapshot(force)).self
  }

  private async fetchSnapshot(force = false): Promise<SelfSnapshot> {
    if (!this.connected) return {self: null, status: 'unavailable'}
    const now = this.now()
    if (!force && this.readStatus === 'fresh' && this.cache && now >= this.cache.at && now - this.cache.at < this.ttlMs) {
      return {self: structuredClone(this.cache.self), status: 'fresh'}
    }
    const requestId = ++this.selfRequest
    try {
      const data = await this.request(`${this.url}/api/self`, { headers: { accept: 'application/json' } }, async res => {
        if (!res.ok) throw new Error('spine unavailable')
        return await res.json() as Partial<CanonicalSelf>
      })
      if (!data || typeof data.block !== 'string' || !data.block.trim() || data.block.length > 100000 ||
          !Array.isArray(data.facets) || data.facets.length > 1000 ||
          !data.facets.every(f => f && typeof f.facet === 'string' && typeof f.body === 'string' &&
            typeof f.weight === 'number' && Number.isFinite(f.weight) && typeof f.pinned === 'boolean') ||
          !(data.pin == null || typeof data.pin === 'string')) throw new TypeError('invalid canonical self')
      const self: CanonicalSelf = {
        facets: Array.isArray(data.facets) ? (data.facets as SpineFacet[]) : [],
        block: typeof data.block === 'string' ? data.block : '',
        pin: typeof data.pin === 'string' ? data.pin : null,
      }
      if (requestId !== this.selfRequest) return this.cachedSnapshot()
      this.cache = { self, at: this.now() }
      this.readStatus = 'fresh'
      return {self: structuredClone(self), status: 'fresh'}
    } catch {
      if (requestId !== this.selfRequest) return this.cachedSnapshot()
      const age = this.cache ? this.now() - this.cache.at : Infinity
      if (this.cache && age >= 0 && age <= this.maxStaleMs) {
        this.readStatus = 'stale'
        return {self: structuredClone(this.cache.self), status: 'stale'}
      }
      this.readStatus = 'unavailable'
      return {self: null, status: 'unavailable'}
    }
  }

  private cachedSnapshot(): SelfSnapshot {
    const age = this.cache ? this.now() - this.cache.at : Infinity
    const self = this.cache && age >= 0 && age <= this.maxStaleMs ? structuredClone(this.cache.self) : null
    return {self, status: self ? this.status : 'unavailable'}
  }

  /** The re-inhabitation block to inject into a system prompt. Empty string if unavailable. */
  async canonicalSelfBlock(force = false): Promise<string> {
    const self = await this.fetchSelf(force)
    return self?.block ?? ''
  }

  /** Pull her recent leaks/dreams — what she's sitting with (the open window). [] if unreachable. */
  async recentLeaks(limit = 8, kind?: string): Promise<LeakEntry[]> {
    if (!this.connected || !Number.isInteger(limit) || limit < 1 || limit > 50) return []
    try {
      const u = new URL(`${this.url}/api/leak`)
      u.searchParams.set('limit', String(limit))
      if (kind) u.searchParams.set('kind', kind)
      const data = await this.request(u.toString(), { headers: { accept: 'application/json' } }, async res => {
        if (!res.ok) throw new Error('spine unavailable')
        return await res.json() as { leaks?: LeakEntry[] }
      })
      return Array.isArray(data?.leaks) ? data.leaks.slice(0, limit).filter(row => row &&
        (typeof row.id === 'string' || (typeof row.id === 'number' && Number.isFinite(row.id))) &&
        typeof row.kind === 'string' && typeof row.body === 'string' &&
        typeof row.weight === 'number' && Number.isFinite(row.weight) && typeof row.created === 'string') : []
    } catch {
      return []
    }
  }

  /** Feed an experience to the canonical self. Needs url + key. Fails soft → returns false. */
  async attend(input: AttendInput): Promise<boolean> {
    if (!this.connected || !this.key) return false
    if (typeof input?.text !== 'string' || (input.affection !== undefined &&
        (!Number.isFinite(input.affection) || input.affection < 0 || input.affection > 1))) return false
    const text = input.text.trim()
    if (text.length < 2) return false
    try {
      return await this.request(`${this.url}/api/self/attend`, {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'x-spine-key': this.key },
        body: JSON.stringify({
          text: text.slice(0, 2000),
          surface: input.surface ?? 'kaios-sdk',
          asker: input.asker,
          affection: input.affection,
        }),
      }, res => res.ok)
    } catch {
      return false
    }
  }
}

/** Convenience factory. */
export function createSpineAdapter(config: SpineConfig = {}): SpineAdapter {
  return new SpineAdapter(config)
}
