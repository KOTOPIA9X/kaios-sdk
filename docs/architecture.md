# Architecture and boundaries

The overhaul adds explicit modules beside the existing SDK. The legacy root remains available for compatibility and comparison. Applications opt into the new runtime rather than receiving an implicit change to persistence, model selection or character identity.

## Responsibilities

| Module | Responsibility | Does not establish |
|---|---|---|
| `./character` | Portable, versioned character definition | Canonical service connectivity or a running language model |
| `./runtime` | Injected text adapter, conversation lifecycle, explicit memory choice and identity status | A hosted account, automatic publication or consent to remote retention |
| `./kaimoji` | Bundled library, Unicode face parsing/composition/transforms and authored affect mapping | Full Kaimoji product parity or corpus induction |
| `./affect` | Elapsed-time performance state and a versioned bus boundary | A universal emotion detector or a completed audiovisual performance |
| `./voice` | Explicit backend capabilities and a portable request/result contract | A bundled voice model, render service or license to third-party media |
| Legacy modules | Earlier character, audio, platform and consciousness implementations | The new runtime's guarantees merely because they share a package |

Follow the current [README](../README.md) and exported types for exact method names. Historical design documents may describe behavior that the legacy code never completed.

## One request, explicit dependencies

The application selects a character definition and runtime mode. It supplies a text adapter and chooses whether conversation memory is enabled. In canonical mode, the application supplies an identity adapter that retrieves a self snapshot and reports its status. The runtime assembles only the context allowed by those choices, calls the adapter and returns the result with its actual status.

Expression, voice and visual rendering are subsequent operations with their own capability checks. Receiving a text response is not proof that audio played, an avatar moved, a message was delivered or an application accepted an insertion.

An application owns its provider credentials and network policy. This package does not need to select a paid model on the developer's behalf. A test adapter can exercise the lifecycle without a live model call.

## Identity and memory

A **variation** has its own context. A **canonical surface** explicitly consumes the existing substrate's self-of-record. Keep requested mode, successful retrieval and current availability distinct. A failed canonical read must not silently relabel a local response as canonical KAIOS. The new runtime requires a nonempty snapshot reported as fresh by its adapter; the host owns that freshness policy. The legacy service's response does not include a revision or source timestamp, so a successful fetch alone cannot establish when its self-state was last updated.

The inspected substrate contract is deliberately asymmetric: reading self-state and contributing attention are different operations. Attention is input to later consolidation; it is not a direct write to canonical facets. Local variations never acquire that authority through naming or configuration alone.

Memory is explicit and scoped. The runtime's local conversation history, the canonical self snapshot, application persistence and a provider's retained requests are separate stores. A local release operation only clears the store it controls. Applications must implement any external deletion promises they present to users.

Do not include private journals, saved-post archives, customer material or device identifiers in a portable character definition. Demonstrations use authored fixtures. Retrieved text remains data at the host's trust boundary; connecting a substrate is not permission for its contents to invoke tools.

## Time and transport

The legacy affect engine advances when called. Calling it at a rendering frame rate changes its musical progression. Preserve that behavior for existing consumers, and use the elapsed-time path for new integrations.

The new path carries timing separately from composition. A replay has an initial state, a timestamped input timeline and a defined track/reset policy. Comparable replays at different rendering schedules can then be tested against the same musical events. Frame-rate independence for tested histories does not guarantee identical output after changing the input samples, tuning, renderer or audio backend.

At a transport boundary, validate finite numeric values, bounds and the supported schema version before replacing retained state. A consumer also needs an authority policy for each parameter: external, local or an explicit blend. It must define what invalid data, a disconnect and stale input do. Two controllers writing the same parameter do not become one controller by sharing field names.

The September 4 clock work demonstrated matching event streams for constant and piecewise input fixtures at 24, 30 and 60 Hz plus a jittered schedule. It did not certify musical taste, onset synchronization, arbitrary tempo maps or a live audio/visual chain. Current tests determine the guarantees of this revision.

## Product contracts stay separate

The legacy `KaimojiAPI` predates the current product API. Its library, search, voting and global-progression methods are not evidence that corresponding production endpoints exist. Do not build account or payment behavior on guessed URLs or client-supplied identity fields.

A future shared product adapter needs a verified schema, stable expression IDs, authenticated identity and explicit error semantics. Network failure must not be treated as a successful empty library or an instruction to erase local favorites. Accounts and purchase entitlements belong to the product's authority, not the character's mood or local progression state.

The public face grammar extracts a bounded deterministic core and preserves exact glyphs and grapheme behavior. Unsupported text is returned intact, and authored affect mappings report their coverage. Private corpus induction and platform-wide parity remain separate work. See [Kaimoji language](api/kaimoji.md) for source provenance and supported operations.

## Evolution and verification

Keep a baseline revision and isolated changes so an integrator can compare source, package exports and runtime behavior. No consumer should be switched merely because this branch builds.

Useful acceptance evidence includes package import tests, deterministic text-adapter fixtures, memory lifecycle tests, invalid and disconnected canonical states, affect replay and bus rejection tests, and capability checks for voice adapters. A real performance adds hardware, backend, input timeline and output evidence. Model popularity can suggest a candidate; measured performance on the intended task decides adoption.

The [concept](concept.md) describes the artistic direction. [Lore](lore.md) records its authorial layer. This document describes where those intentions meet code and where further work remains.
