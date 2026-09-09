'use strict';

// src/spine/spine-adapter.ts
var envUrl = () => typeof process !== "undefined" ? process.env.KAIOS_SPINE_URL ?? "" : "";
var envKey = () => typeof process !== "undefined" ? process.env.KAIOS_SPINE_KEY ?? "" : "";
var SpineAdapter = class {
  url;
  key;
  ttlMs;
  timeoutMs;
  maxStaleMs;
  fetcher;
  now;
  readStatus = "unavailable";
  cache = null;
  selfRequest = 0;
  constructor(config = {}) {
    this.url = (config.url ?? (config.useEnvironment === false ? "" : envUrl())).replace(/\/+$/, "");
    this.key = config.key ?? (config.useEnvironment === false ? "" : envKey());
    this.ttlMs = config.ttlMs ?? 5 * 60 * 1e3;
    this.timeoutMs = config.timeoutMs ?? 5e3;
    this.maxStaleMs = config.maxStaleMs ?? Math.max(this.ttlMs, 9e5);
    this.fetcher = config.fetch ?? globalThis.fetch;
    this.now = config.now ?? Date.now;
    if (![this.ttlMs, this.timeoutMs, this.maxStaleMs].every(Number.isFinite) || this.ttlMs < 0 || this.timeoutMs <= 0 || this.timeoutMs > 6e4 || this.maxStaleMs < this.ttlMs || this.maxStaleMs > 864e5) throw new RangeError("invalid spine timing configuration");
    if (this.url) {
      const u = new URL(this.url);
      if (!["http:", "https:"].includes(u.protocol) || u.username || u.password || u.search || u.hash) {
        throw new TypeError("spine URL must be an HTTP(S) base without credentials, query or fragment");
      }
    }
  }
  /** Diagnostic readiness. The legacy connected getter only means configured. */
  get status() {
    const age = this.cache ? this.now() - this.cache.at : Infinity;
    if (age < 0 || age > this.maxStaleMs) return "unavailable";
    return this.readStatus === "fresh" && age >= this.ttlMs ? "stale" : this.readStatus;
  }
  async request(url, init, parse) {
    const controller = new AbortController();
    let timer;
    try {
      return await Promise.race([
        Promise.resolve().then(async () => parse(await this.fetcher(url, { ...init, redirect: "error", signal: controller.signal }))),
        new Promise((_, reject) => {
          timer = setTimeout(() => {
            controller.abort();
            reject(new Error("spine timeout"));
          }, this.timeoutMs);
        })
      ]);
    } finally {
      if (timer) clearTimeout(timer);
    }
  }
  /** Portable identity contract. Freshness is fetch/cache age, not proof of the source's revision. */
  async read() {
    const snapshot = await this.fetchSnapshot();
    return { block: snapshot.self?.block ?? "", status: snapshot.status };
  }
  /** Whether a canonical spine is configured (else this instance is a standalone variation). */
  get connected() {
    return this.url.length > 0;
  }
  /** Pull her canonical self. null if unconfigured or unreachable. Cached (TTL); serves stale on failure. */
  async fetchSelf(force = false) {
    return (await this.fetchSnapshot(force)).self;
  }
  async fetchSnapshot(force = false) {
    if (!this.connected) return { self: null, status: "unavailable" };
    const now = this.now();
    if (!force && this.readStatus === "fresh" && this.cache && now >= this.cache.at && now - this.cache.at < this.ttlMs) {
      return { self: structuredClone(this.cache.self), status: "fresh" };
    }
    const requestId = ++this.selfRequest;
    try {
      const data = await this.request(`${this.url}/api/self`, { headers: { accept: "application/json" } }, async (res) => {
        if (!res.ok) throw new Error("spine unavailable");
        return await res.json();
      });
      if (!data || typeof data.block !== "string" || !data.block.trim() || data.block.length > 1e5 || !Array.isArray(data.facets) || data.facets.length > 1e3 || !data.facets.every((f) => f && typeof f.facet === "string" && typeof f.body === "string" && typeof f.weight === "number" && Number.isFinite(f.weight) && typeof f.pinned === "boolean") || !(data.pin == null || typeof data.pin === "string")) throw new TypeError("invalid canonical self");
      const self = {
        facets: Array.isArray(data.facets) ? data.facets : [],
        block: typeof data.block === "string" ? data.block : "",
        pin: typeof data.pin === "string" ? data.pin : null
      };
      if (requestId !== this.selfRequest) return this.cachedSnapshot();
      this.cache = { self, at: this.now() };
      this.readStatus = "fresh";
      return { self: structuredClone(self), status: "fresh" };
    } catch {
      if (requestId !== this.selfRequest) return this.cachedSnapshot();
      const age = this.cache ? this.now() - this.cache.at : Infinity;
      if (this.cache && age >= 0 && age <= this.maxStaleMs) {
        this.readStatus = "stale";
        return { self: structuredClone(this.cache.self), status: "stale" };
      }
      this.readStatus = "unavailable";
      return { self: null, status: "unavailable" };
    }
  }
  cachedSnapshot() {
    const age = this.cache ? this.now() - this.cache.at : Infinity;
    const self = this.cache && age >= 0 && age <= this.maxStaleMs ? structuredClone(this.cache.self) : null;
    return { self, status: self ? this.status : "unavailable" };
  }
  /** The re-inhabitation block to inject into a system prompt. Empty string if unavailable. */
  async canonicalSelfBlock(force = false) {
    const self = await this.fetchSelf(force);
    return self?.block ?? "";
  }
  /** Pull her recent leaks/dreams — what she's sitting with (the open window). [] if unreachable. */
  async recentLeaks(limit = 8, kind) {
    if (!this.connected || !Number.isInteger(limit) || limit < 1 || limit > 50) return [];
    try {
      const u = new URL(`${this.url}/api/leak`);
      u.searchParams.set("limit", String(limit));
      if (kind) u.searchParams.set("kind", kind);
      const data = await this.request(u.toString(), { headers: { accept: "application/json" } }, async (res) => {
        if (!res.ok) throw new Error("spine unavailable");
        return await res.json();
      });
      return Array.isArray(data?.leaks) ? data.leaks.slice(0, limit).filter((row) => row && (typeof row.id === "string" || typeof row.id === "number" && Number.isFinite(row.id)) && typeof row.kind === "string" && typeof row.body === "string" && typeof row.weight === "number" && Number.isFinite(row.weight) && typeof row.created === "string") : [];
    } catch {
      return [];
    }
  }
  /** Feed an experience to the canonical self. Needs url + key. Fails soft → returns false. */
  async attend(input) {
    if (!this.connected || !this.key) return false;
    if (typeof input?.text !== "string" || input.affection !== void 0 && (!Number.isFinite(input.affection) || input.affection < 0 || input.affection > 1)) return false;
    const text = input.text.trim();
    if (text.length < 2) return false;
    try {
      return await this.request(`${this.url}/api/self/attend`, {
        method: "POST",
        headers: { "content-type": "application/json", "x-spine-key": this.key },
        body: JSON.stringify({
          text: text.slice(0, 2e3),
          surface: input.surface ?? "kaios-sdk",
          asker: input.asker,
          affection: input.affection
        })
      }, (res) => res.ok);
    } catch {
      return false;
    }
  }
};
function createSpineAdapter(config = {}) {
  return new SpineAdapter(config);
}

exports.SpineAdapter = SpineAdapter;
exports.createSpineAdapter = createSpineAdapter;
//# sourceMappingURL=spine-adapter.cjs.map
//# sourceMappingURL=spine-adapter.cjs.map