# Verification — public v2 preview

The preview is validated as a software contract. These checks do not establish consciousness, model superiority, musical taste, voice identity or production readiness of another product.

## Reproducible package checks

Run `npm ci` and `npm run check`. The check performs strict TypeScript checking, a complete ESM/CommonJS build, lifecycle/Unicode/clock tests, and a packed-package consumer check. It verifies every exported JavaScript and declaration path, imports all entries in both module formats, compiles ESM and CommonJS TypeScript consumers, and bundles eight portable entry points for a browser.

The final local run passes all 65 tests on Node 22.18 and Node 26.5.0, plus strict typechecking and the packed-package checks (18 ESM/CommonJS entries and eight browser bundles). The dependency audit reports zero known vulnerabilities at the September 6 snapshot. CI is configured for Node 22, 24 and 26, with no publish or deploy step. The examples use deterministic fixtures and synthetic canonical snapshots, with no model account required.

## Frozen consumer acceptance through 9xBench

The existing 9xBench objective scorer was invoked on frozen consumer verifiers against a copied compiled package on asgard16 (Apple M4 Max, 128 GiB RAM, Node 26.5.0). Eleven properties cover export resolution, clock cadence against analytic references, frame immutability and validation, ownership release/staleness, null voice honesty, canonical availability, memory consent and in-flight forgetting, and browser import behavior with IO disabled. Six additional properties cover exact Unicode round-trips, unknown-input preservation, slot-local edits, repeat-stable transformations, explicit authored-affect coverage and grammar parity across module formats.

The candidate passed 17/17 at implementation commit `770b8ffc6145f42e879fbcaf11be52d0fa7ee8d4`. A deliberately broken contracts copy passed 1/11 and failed all ten targeted checks; a lossy grammar copy failed all six grammar checks. Assertions were frozen before scoring. The affect/voice implementer authored the contract verifier, so this is not a blind independent evaluation. It establishes discrimination for these synthetic fixtures, not broad assurance for arbitrary providers or universal face-language coverage. Source and compiled-file digests, verifier hashes, hardware metadata and full scores are retained in the private review receipt. No model, paid inference or live service was called by the benchmark.

## Browser and creative boundaries

The playground was inspected in Chrome at 1280×1266. Presets update the face and performance state; playback advances the beat; hiding the tab stops the demo and disables sound. The initial favicon 404 was corrected. The offline DOM fixture additionally covers phrase timing, frame-gap reset and restart cleanup.

Audible quality, native Safari/iOS audio behavior, arbitrary rigs, streaming speech and live consumer migrations require their own acceptance. The SDK does not select a new voice/model backend based on community popularity.

## Preservation

The original checkout remains at `553f27174a16ff94bcfba4e94c782015973b5eac`. A verified Git bundle preserves all original refs and complete history; untracked design notes were copied separately. Original top-level documentation is retained byte-for-byte in `docs/archive/0.1`, and the legacy affect engine is unchanged. See [migration and rollback](migration.md).
