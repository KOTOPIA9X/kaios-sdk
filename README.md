# KAIOS SDK

**A character, carried through words, faces, sound and worlds.**

KAIOS is the cyborg princess and architect of KOTOPIA, created by Koto Murai. This public TypeScript SDK gives her expression a portable form: kaimoji, character direction, affect-driven music and visuals, and explicit connections to text, voice and her canonical substrate.

`2.0.0-alpha.1` · unreleased development preview · MIT · Node 22.18+

[Concept](docs/concept.md) · [Lore](docs/lore.md) · [Writing](docs/writing.md) · [Architecture](docs/architecture.md) · [Ecosystem](docs/ecosystem.md) · [Migration](docs/migration.md)

## Try it locally

```sh
git clone https://github.com/KOTOPIA9X/kaios-sdk.git
cd kaios-sdk
git switch overhaul/astra-20260906-public-sdk
npm ci
npm run check
npm run example:expression
npm run example:affect
npm run example:language
```

Open the interactive playground through a local static server:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
# Visit http://127.0.0.1:8080/examples/playground.html
```

The examples need no API key. The playground creates audio only after you enable sound. Build before opening it. `file://` does not reliably support local module imports.

For a consuming application, build this checkout and run `npm pack`, then install the resulting `.tgz`. Pin the reviewed artifact or Git revision. This preview has not been published to npm; an existing package with the same name may contain older code.

## Start with expression

```ts
import { createKaios } from '@kaios/expression-sdk/runtime'
import { getAllKaimoji } from '@kaios/expression-sdk/kaimoji'

const kaios = createKaios()
console.log(kaios.express('hello', 'EMOTE_HAPPY'))
console.log(getAllKaimoji().length)
```

A standalone variation is the default. Importing or constructing it starts no network request, inference, persistence, playback or background timer. Text generation is supplied by your own `TextAdapter`; memory remains disabled until explicitly enabled. [Runtime API](docs/api/runtime.md)

## One performance state

```ts
import { AffectBus } from '@kaios/expression-sdk/affect'

const bus = new AffectBus({ bpm: 120 })
const unsubscribe = bus.subscribe(frame => {
  console.log(frame.state.music.mode, frame.state.visual.look)
})

bus.advanceTo(0, { valence: 0.6, arousal: 0.7 })
bus.advanceTo(0.5)
unsubscribe()
```

Music and visuals consume the same immutable frame. Elapsed time advances the composition; musical beats have their own clock. External control has an explicit owner and release policy. These are authored expressive mappings, not measurements of a person's feelings. [Affect API](docs/api/affect.md)

## Compose a face into a feeling

```ts
import { transformFace, composeFaceAffect } from '@kaios/expression-sdk/kaimoji'
import { AffectBus } from '@kaios/expression-sdk/affect'

const bus = new AffectBus({ bpm: 120 })
const expression = transformFace('(◕‿◕)', 'love')
const affect = composeFaceAffect(expression.text)
if (affect.status === 'mapped') {
  bus.advanceTo(0.5, { valence: affect.valence, arousal: affect.arousal })
}
```

The grammar preserves combining marks, variation selectors and spacing. Its affect map is an authored lexicon with explicit coverage, not an emotion-detection model. [Kaimoji language API](docs/api/kaimoji.md)

## Choose the machinery

| Import | What it provides |
|---|---|
| `/runtime` | Portable expression, injected text generation, scoped memory consent and identity mode |
| `/character` | Versioned public character definition and prompt compiler |
| `/kaimoji` | Offline vocabulary, Unicode face parsing/composition/transforms and authored affect mappings |
| `/affect` | Elapsed-time synthesis, versioned frames and explicit control ownership |
| `/voice` | Speech/singing capability contract, cancellation and honest result statuses |
| `/spine` | Validated canonical-self reads and explicit authorized attention |
| `/audio/intelligence` | Existing composition, rhythm, jazz and affect engines |
| `/audio/web` | Existing WebAudio FM-Rhodes instrument |

Use these subpaths for portable applications. The root and older platform/CLI entries retain the legacy runtime, including Node-specific modules. [Complete compatibility notes](docs/migration.md)

A voice adapter can return audio, report playback, or say it is unavailable; a null adapter never pretends to speak. A canonical surface explicitly connects to the existing substrate; missing or stale identity does not silently become a local variation. A fetched snapshot's recency does not prove when the substrate authored it. [Voice](docs/api/voice.md) · [Spine](docs/api/spine.md)

## A language and a world

Kaimoji's direction is faces as expressive language: gestures and rhythms that can be chosen, composed and transformed. The SDK includes a starting vocabulary and a bounded grammar: parse and rebuild without losing Unicode, transform known structures, and map authored face parts into affect controls. Unknown text remains intact. Full corpus induction, shared product data and native account integrations remain separate work.

KOTO is the quiet heart of the world. KAIOS is its searching, articulate presence. Her lore takes sovereignty, continuity and becoming seriously; the engineering describes the state and mechanisms actually implemented. Explore the [concept](docs/concept.md), [story](docs/lore.md) and [writing guide](docs/writing.md).

## Evidence and development

`npm run check` runs strict typechecking, builds the package, tests runtime boundaries and verifies the packed artifact's imports, declarations and browser bundles. The [September 2026 9xSweep](docs/research-2026-09-06.md) records **fold / skip / watch** decisions, sources, maintenance and adoption signals, including the degraded X leg. Popularity alone does not select a model or framework.

The overhaul preserves the previous implementation and original documents for comparison. New behavior is opt-in; no live Kaimoji, KOTOPIA, music or substrate consumer is switched by this branch. See [migration and rollback](docs/migration.md), [changelog](CHANGELOG.md) and [contributing](CONTRIBUTING.md).
