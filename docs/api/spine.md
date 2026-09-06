# Canonical continuity adapter

`SpineAdapter` implements the existing substrate's read/attention seam. It never provisions a server, starts consolidation or directly rewrites self-state.

| Method | Contract |
|---|---|
| `read()` | `{block, status}` for the portable runtime: fresh, stale or unavailable |
| `fetchSelf(force?)` | Validated copied facets/block/pin, or bounded stale fallback, or null |
| `canonicalSelfBlock(force?)` | Legacy string interface; use `read()` when readiness matters |
| `recentLeaks(limit?, kind?)` | Up to 50 validated recent reflection entries; empty on failure |
| `attend(input)` | Explicit authenticated attention submission; false on failure |

Set `url` explicitly. Use `useEnvironment: false` to disable the legacy `KAIOS_SPINE_URL`/`KAIOS_SPINE_KEY` lookup. The constructor performs no requests. `connected` is retained for compatibility and means **configured**, not reachable. `status` reports observed read readiness.

Defaults: five-minute cache TTL, fifteen-minute maximum stale age, five-second request timeout. Time values must be finite; timeout is at most 60 seconds and cache age at most one day. A malformed or empty response does not overwrite a good cached self. The portable runtime declines stale identity; applications using the legacy string API must handle stale state deliberately.

**Fresh means recently retrieved or within the local cache TTL.** The existing `/api/self` payload has no source revision or creation timestamp. This adapter cannot prove when the substrate last authored its self, whether consolidation ran, or whether an upstream cache served an old revision. An application needing that guarantee should implement a revision-aware `CanonicalIdentityAdapter` against a corresponding server contract.

The write key belongs on an application server. Never include it in a browser bundle. Calls to `attend()` are explicit; conversation memory consent does not authorize a separate attention submission. Attention is not a direct edit to the canonical self, and local `forget()` does not erase attention already sent elsewhere.

Fixtures use `example.invalid` and injected fetch functions. No test needs the real canonical service.
