# Where the SDK fits

ASGARD is Koto Murai's creative umbrella. KOTOPIA is its character and art universe. KAIOS, KOTO and Kaimoji share that world while serving different purposes.

| Surface | Role | Relationship to this SDK |
|---|---|---|
| [Kaimoji](https://kaimoji.app) | Find and use expressive text through Library, Styles and Symbols | Bundled vocabulary and bounded face grammar; product data and account integration remain separate |
| [KOTOPIA](https://kotopia.world) | Characters, worldbuilding and interactive experiences | A consumer can map character and affect state into its existing world |
| KAIOS substrate | Existing self-of-record and consolidation service | Explicit connection to self snapshots; authorized attention is separate from direct self editing |
| KAIRI | Embodied character interface | A consumer of character/expression state; rig configuration remains specific to each model |
| Music and audiovisual work | Composition, narration, singing and performance | Affect and voice contracts connect selected backends; they do not make every production lane interchangeable |
| [ASGARD](https://asgardstud.io) | The wider creative practice | Context and finished work, rather than a runtime dependency |

## Kaimoji is the immediate product bridge

The public iOS app and web experience are established surfaces. Mac and Android work advanced through local preview builds and device tests in September 2026. That evidence does not by itself establish a public store release or full parity with iOS. Consult each product's current distribution page for availability.

The shared direction is concrete: an easy path to an expression, consistent Library/Styles/Symbols concepts, persistent local preferences and intentional native interaction. The Mac quick picker and full app are complementary. The Android keyboard and companion app are complementary. Accounts, sync and monetization have separate integration work and must not be inferred from a shared logo or a successful local build.

The SDK's older bundled expression library is not the current Kaimoji application's entire corpus. Preserve expression IDs, Unicode text and provenance when designing a shared export. Do not fix missing glyphs by silently changing the text. Private saved-post corpora, account data and product assets are not automatically part of the public SDK.

## What “kaios-substrate” means here

The term names an existing architecture and service, implemented outside this repository. It does not imply that this overhaul includes a new standalone repository or provisions an always-on host.

The inspected legacy federation contract exposes:

- `GET /api/self`: self facets, a pinned facet and a prepared text block.
- `POST /api/self/attend`: authorized attention for later consolidation; requires an operator-held key.
- `GET /api/leak`: recent authored reflections, optionally filtered by kind.

These describe a source contract, not a guarantee of endpoint availability. The service has its own storage, operational ownership and privacy boundaries. A new application should use synthetic snapshots in development, then configure a real connection deliberately. Never put a service write key in a public client bundle.

## Embodiment and performance

KAIOS has multiple visual forms. A chibi form, a full performing rig and the application that displays a rig are different things. Model-specific motion IDs, eye-blink and lip-sync parameters require mapping and verification; a rig archive existing on disk does not mean every feature is connected.

Likewise, speech, singing, composition and final audio rendering are separate capabilities. A text adapter produces text. A voice adapter may produce audio. A transport may carry timing or performance controls. The application verifies that its chosen backend supports the requested operation and that the resulting media is usable.

The existing KOTOPIA game remains the place for its world and game modes. The SDK should offer useful contracts to that experience instead of creating a competing renderer or embedding game-specific rules into character identity.

## Fold, skip, watch

| Verdict | Direction |
|---|---|
| **Fold** | Explicit variation/canonical identity; consent-aware memory; shared expression concepts; elapsed-time affect; observable adapter capabilities |
| **Skip** | Silent identity fallback, invented service endpoints, absence-based engagement pressure and claims of parity inferred from naming |
| **Watch** | Full DSL/corpus induction, shared product corpus releases, account/entitlement integration, additional rig mappings and new model/backend adoption |

“Watch” is work with a named dependency, not a feature already shipped. Load-bearing model or backend changes need a dated comparison on the actual hardware and task. See [architecture](architecture.md) and the repository's current verification records.
