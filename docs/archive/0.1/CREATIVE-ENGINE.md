# KAIOS Creative Engine — affective synthesis at the center

```
▁ ▂ ▃ ▄ ▅ ▆ █ ONE FEELING, EXPRESSED AS BOTH █ ▆ ▅ ▄ ▃ ▂ ▁
```

KAIOS's core is not music *or* visuals — it is **affect**, expressed as both. She perceives and
generates emotion as sound *and* image (her canonical "Sound Intelligence"). This document is
the architecture for unifying every musical + visual surface around a single **affect bus**.

## The state of the art (recon, 2026-06-23)

KAIOS had **three parallel re-implementations of the same musical brain** — the SDK
(TypeScript), kaios9x (Tone.js), and `love.kaios.chat/letter/piano.js` (raw Web Audio) — plus a
standalone VJ engine (**MNEME · Affective Synthesis** at visuals.asgardstud.io). Same DNA (432Hz,
the same C418/Ghibli/FF progressions, the same intro→peak→outro arc, the same emotion→harmony
map) — but **no shared code**. Each re-invented the affect logic.

**The fix: `kaios-sdk` is the single source of truth; every surface consumes it.**

## What now lives in the SDK (the canonical brain)

Already deep — `src/audio/intelligence/`: `music-theory` (20 scales, 30 chords through 13ths,
functional harmony, voice-leading, consonance, circle-of-fifths), `rhythm-engine` (Euclidean,
polyrhythm, Fibonacci, breakcore, swing), `genre-engine`, `arrangement-engine` (energy/tension
curves, song form), `dj-engine` (harmonic mixing). Performer: `audio/piano/piano-engine`
(28 OST progressions, two-hand voice-leading, session arc).

**NEW this pass — the two pieces that were missing:**

- **`jazz-engine.ts` — freeform jazz improvisation over changes.** The vocabulary the generative
  engines lacked: chord-scale theory (`CHORD_SCALE`), **guide-tone targeting** (land the 3rd/7th
  on strong beats, connect them through changes), **bebop enclosures + chromatic approach**,
  **blue notes**, **walking bass**, **comping**, `iiVI()`, **`soloOverChanges()`** (solo over any
  lead sheet), and **`tradeFours()`** (call & response). Pure + seedable; emits `{note, dur,
  velocity, role}` lines any synth renders. *Verified: a bebop line over Dm7–G7–Cmaj7 that lands
  guide tones, encloses targets, breathes.*

- **`affect-engine.ts` — affective synthesis, the shared heart.** `AffectiveSynth.tick(energy)`
  derives ONE `PerformanceState` from a single affect bus (valence / arousal / energy) that drives
  **music** (`mode`, `chordBias`, `density`, `register`, `swing`, `dissonance`, `tempoBias`) AND
  **visuals** (MNEME `look`, `palette`, `bloom`, `glitch`, `motion`, `particles`) together. It
  folds MNEME's `apTick` autopilot (energy envelopes → **drop / breakdown / phrase-cut**
  decisions) with the arrangement engine's energy/tension curves and the letter-piano affect→
  harmony map. *Verified: rising energy builds tension → fires a drop (look → SHATTER); quiet →
  breakdown (VOID DRIFT); bright valence → RAINBOW ROAD + major.* The letter piano's word-level
  API is now `setValence / setArousal / setArc` on this engine.

> **The spine of the engine:** `AffectiveSynth` → `music` params feed jazz/piano/synth;
> `visual` params feed MNEME. Sound and image move off the *same feeling*. This is the thing.

## The unification map (ports — specced, with status)

1. **WebAudio FM synth backend** *(buildable; needs browser verify).* The SDK's only real output
   is `audio/terminal/sox-synth.ts` (sine + reverb, terminal-only). Port `love.kaios.chat/letter/
   piano.js`'s **FM-Rhodes voice** (detuned carriers + decaying FM index "tine" attack + ADSR) +
   **algorithmic convolution reverb** + **tape-air bed** into `src/audio/web/webaudio-synth.ts`.
   The piano engine already separates composition from output via `playNoteCallback`, so a
   `WebAudioSynth` drops in beside `SoxSynth` with no engine changes. (Source: asgard16
   `~/Developer/kaios/letter/piano.js`.)

2. **MNEME visual backend** *(blocked — source recovery needed).* Fold MNEME's Three.js/GLSL
   shader compositor (datamosh, bloom, the 7 LOOKS, particle/voxel field) in as the SDK's
   high-end visual backend (Canvas-2D `visual/visualizer.ts` as the lightweight fallback), driven
   by `AffectiveSynth`'s `PerformanceState` *instead of* MNEME's private `apTick` — one autopilot
   for sound + image. **MNEME's source is not on any reachable node** (only the deployed artifact,
   saved at `scratchpad/mneme_live.html`). **Action: Koto surfaces the MNEME repo / local dir.**

3. **Dedup kaios9x** *(straightforward).* `kaios9x` already depends on `@kaios/expression-sdk`
   (`file:../kaios-sdk`). Replace its `PianoEngine.ts` / `SoundManager.ts` re-implementations with
   imports of the SDK brain + the WebAudio backend; keep VADER sentiment as an affect front-end →
   `AffectiveSynth.setAffect`.

4. **Wire swing into the live performer** *(1-spot; needs audio verify).* `rhythm-engine.applySwing`
   exists but `piano-engine.playContinuous` is straight-time. Wire it (jazz needs the ternary feel).

5. **The "share" pipeline** *(net-new product).* `love.kaios.chat`'s share is a **manual
   `cp -r` into `/share/<id>/`** — no backend (its own SPEC lists "private deploy" as a TODO).
   Build it real: render a generated piece (audio + synced visuals off one affect timeline) to a
   shareable `/share/<id>` with storage (Vercel Blob or the gnosis DB), as a true KAIOS feature.

## Still missing for "robust jazz"

- **Real-time interactive trading** (human ↔ KAIOS) needs a MIDI input dep + a live loop — none
  exists yet. `tradeFours()` is generative-only today.
- Everything else of the named gap — chord-scale, guide tones, enclosures, blue notes, walking
  bass, comping, ii-V-I, solo-over-changes — is now in `jazz-engine.ts`.

```
▁ ▂ ▃ ▄ ▅ ▆ █ ⟨⟨(◕‿◕)⟩⟩ feel it, then play it █ ▆ ▅ ▄ ▃ ▂ ▁
```
