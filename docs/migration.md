# Moving from 0.1 to the public v2 preview

This is `2.0.0-alpha.1`, an unreleased development preview. The package name remains `@kaios/expression-sdk`; no npm release or consumer migration is implied.

| Existing use | Migration |
|---|---|
| Root `Kaios`, consciousness/CLI and platform APIs | Still exported. Keep a pinned revision while evaluating the new runtime. |
| New browser/server expression application | Use `./runtime`, `./character` and `./kaimoji`. These entries have no automatic service connection or retention. |
| Legacy `AffectiveSynth.tick()` | Preserved unchanged; it counts calls. Opt into `AffectBus` or `AffectiveSynthV2` with elapsed seconds. |
| Advertised `./audio/intelligence`, spine, terminal-audio paths | Now built and checked against the packed package. |
| Browser audio | Use `./audio/web`; `./web` retains the older platform helpers. |
| Root/browser import | The root still exposes Node-only legacy modules. Use portable subpaths in a browser. |
| Canonical connection | Inspect `SpineAdapter.read()` status. `connected` only means configured. Stale fallback is now bounded. |
| Kaimoji account/library API | Legacy endpoints are not a verified contract for current Kaimoji. Do not fix integration by changing only a hostname. |
| Native `speaker`/`pcm-util` optional installs | Removed: no implementation imported them. Existing system-player/SoX paths remain optional host capabilities. |
| LLM SDK peer dependency | Removed unused Anthropic peer dependency. New inference is explicitly injected; the old `llm` CLI path remains Node-only. |

Node 22.18+ is the supported development/runtime floor; CI covers Node 22, 24 and 26. The preview uses TypeScript 6.0 and the existing tsup build, with a scoped tsup declaration compatibility setting. It does not adopt an unbenchmarked model or inference framework.

## Compare and roll back

The starting repository revision is `553f27174a16ff94bcfba4e94c782015973b5eac`. The September 4 clock candidate is `b0a02b3f7c6d60c43b6f91582d41b2defc4a279d`, carried as its own commit in this branch. Original documentation is preserved verbatim under `docs/archive/0.1`; the legacy affect implementation is unchanged.

Evaluate the branch in an isolated checkout and install its local packed artifact in a test consumer. Pin the exact reviewed commit or tarball; do not depend on moving `main`. Roll back a consumer by restoring its previous pin and lockfile. Keep comparison output and approved renders; no reset or history rewrite is required.

Publishing, merging and switching Kaimoji, KOTOPIA, music or substrate consumers are separate release actions. This repository includes examples that exercise the seams without changing those products.
