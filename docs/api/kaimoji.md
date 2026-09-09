# Kaimoji: faces as language

`@kaios/expression-sdk/kaimoji` exposes the bundled expression library and a portable face grammar. The grammar can parse supported structures, preserve their exact text, edit individual parts and map known parts to authored affect coordinates. It performs no network requests, model inference, database access or random sampling.

```ts
import {
  parseFace, rebuildFace, composeFace, transformFace, composeFaceAffect,
} from '@kaios/expression-sdk/kaimoji'

const face = '♡(ᵔ  ᵕ\tᵔ)♡'
const parsed = parseFace(face)
console.log(rebuildFace(parsed) === face) // true: exact spaces and tab survive
console.log(rebuildFace(parsed, {mouth: 'ω'})) // ♡(ᵔ  ω\tᵔ)♡

console.log(transformFace('(・ω・)', 'cry'))
// {text: '(˃̣̣̥ω˂̣̣̥)', changed: true}

console.log(composeFace({eyeL: '•', mouth: 'ω', eyeR: '•'}))
// (•ω•)

const feeling = composeFaceAffect('(ᵔωᵔ)')
if (feeling.status === 'mapped') {
  // These coordinates can be supplied to an AffectBus as an authored input.
  console.log(feeling.valence, feeling.arousal, feeling.coverage)
}
```

## Parse and preserve

`parseFace(text): FaceParse` returns the original `face`, an `ok` flag, outer `armL`/`armR` text, ordered `layers`, `eyeL`, `mouth`, `eyeR` and exact spacing. Each layer records its left/right glyph and independent `gapL`/`gapR` strings. Core spacing is recorded as `beforeMouth` and `afterMouth`.

The parser peels paired brackets and symmetric outer layers, stopping before a three-part eye–mouth–eye core loses its eyes. One opener may have multiple valid partners, including `૮…ა` and `૮…ෆ`. Nested flanks, paired eyes without a mouth, and framed single-glyph expressions are supported. Wider cores are bounded to seven nontrivia graphemes.

`segmentFace(text): string[]` uses `Intl.Segmenter` with grapheme granularity. Combining marks, emoji modifiers, variation selectors and joined emoji sequences remain attached. Neither segmentation nor reconstruction normalizes, trims or strips the input. Word joiners and zero-width spaces may be retained as trivia between parts; they do not disappear from the output.

This is a bounded structural parser, not a universal face detector. A parsed shape does not prove an emotional reading. Some asymmetric art, unmatched decorative brackets and text-like forms remain unsupported. Prose screening is conservative and inherited from the prototype; it is not a language classifier.

```ts
const unknown = parseFace('hello, world')
console.log(unknown.ok) // false
console.log(rebuildFace(unknown)) // hello, world
console.log(transformFace('hello, world', 'cry'))
// {text: 'hello, world', changed: false, reason: 'prose'}
```

An unparsed result preserves the original string and gives one of `empty`, `too-long`, `invalid-unicode`, `prose`, `malformed-frame` or `unsupported-core`. Keep that original available; a failed parse is not permission to replace, truncate or discard an expression.

Parsing is limited to 4,096 UTF-16 code units and 512 grapheme units. Larger input returns an unparsed result. Non-string arguments throw `TypeError`. The standalone segmenter throws for oversized or ill-formed Unicode input; it does not substitute a code-point splitter when `Intl.Segmenter` is unavailable.

## Compose and edit

`composeFace({eyeL, mouth, eyeR, bracket?, space?, prefix?, suffix?}): string` formats explicit parts. The default bracket is `['(', ')']` and the default spacing is empty. Pass `['', '']` for an unframed expression. This constructor joins the supplied text; it does not certify that the result belongs to the parser's supported grammar.

`rebuildFace(parsed, overrides?): string` accepts `eyeL`, `mouth`, `eyeR` and an optional two-string `addFlank`. Unchanged parts, layers and spacing survive exactly. With no overrides, every result produced by `parseFace` reconstructs to the original input, including unparsed input. Overrides on an unparsed result leave its text intact.

`transformFace(text, operation): FaceTransformResult` returns `{text, changed, reason?}`. `FACE_OPERATIONS` contains:

| Operation | Change |
|---|---|
| `cry` | Replace the eyes with combining-mark tears; retain an existing mouth |
| `blush` | Add a pair of blush flanks once |
| `cat` | Use `ω` as the mouth and change a round `()` bracket layer to `૮ა` |
| `calm` | Replace existing eyes with `ᴗ` and an existing mouth with `ᵕ` |
| `love` | Replace existing eyes with `♡`; supply a mouth if absent |
| `sparkle` | Add an outer `✧` pair once |

These operations are deterministic and idempotent on the tested supported forms. A repeated operation that makes no change reports `already-applied`; unparsed input returns its original parse reason. Unknown operations and malformed part arguments throw `TypeError`. A composed or expanded result beyond the size limit throws `RangeError`. Render results as text, not HTML.

## Compose an affect mapping

`composeFaceAffect(text): FaceAffectResult` uses a fixed part lexicon from the existing prototype. It combines known mouth and eye mappings, then applies recognized flank/arm modifiers and explicit heart/tear rules. Only the lookup view can omit combining marks; the face and parse remain untouched.

A mapped result for `(ᵔωᵔ)` is:

```ts
{
  status: 'mapped',
  method: 'authored-parts-v1',
  emotion: 'cozy', // one of the authored display categories
  valence: 0.7,   // -1..1
  arousal: 0.39,  // 0..1
  coverage: 'eyes-and-mouth' // or 'eyes' or 'mouth'
}
```

Unknown parts return `{status:'unmapped', reason:'unknown-parts'}`; unsupported structure returns `unparsed`. There is no model fallback and no fabricated neutral score for unknown input.

The categories are `joy`, `love`, `sad`, `excited`, `smug`, `shy`, `sleepy`, `angry`, `surprised`, `cozy`, `pleading` and `neutral`. They are compositional labels, not a validated measure of the author or reader's emotion. `coverage` states which part groups contributed; it is not a probability or accuracy estimate. A host can choose whether a partial mapping is appropriate for its use.

## Provenance and scope

This module adapts the symmetric-peeling parser, rebuild/operators and authored part semantics from the project's internal Kaimoji prototype, source revision **`37a8c87831d9f7369c7de1c10de4ee002763e6b0`**, specifically `face-grammar.ts`, `face-affect.ts` and `part-affect.ts`.

The public extraction includes the pure structural and compositional kernels plus fixed, project-authored glyph mappings. It excludes personal save histories, frequency weights, generated corpus files, source posts, database induction, provider calls and model prompts. No personal corpus was used as an evaluation set for this extraction.

Several prototype behaviors intentionally change: exact spacing and variation selectors are preserved; unmatched frames fail conservatively; input/output size is bounded; unknown text survives; cat and sparkle operations avoid repeated changes; affect reports part coverage instead of an uncalibrated confidence number. The prototype's duplicate `_` mouth entry is represented once using its effective final value. The authored angry hint is now reachable in the display taxonomy. This is not byte-for-byte behavioral parity with the internal experimental DSL.

**Fold:** the tested portable grammar and deterministic part mapping. **Watch:** personal dialect learning, frequency-conditioned generation, shared product corpus distribution, multilingual calibration and broader asymmetric art. The bundled SDK library is still distinct from the complete, evolving Kaimoji app corpus.

Tests cover exact Unicode round trips, unequal spacing, nested and one-to-many brackets, combining tears, emoji joiners, variation selectors, malformed input, deterministic transformations, sparse arguments and unknown semantic results. See [the source tests](../../tests/kaimoji-grammar.test.mjs) and [architecture](../architecture.md).
