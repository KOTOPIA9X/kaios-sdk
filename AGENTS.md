# Working on kaios-sdk

KAIOS is a character created by Koto Murai within KOTOPIA and ASGARD. Start with README.md and docs/architecture.md. The public v2 runtime lives in src/runtime; the old Kaios class and legacy modules remain compatible entry points, with historical docs under docs/archive/0.1.

- Keep the portable runtime, character, kaimoji, affect, voice and browser-audio entries free of Node-only imports and import-time IO.
- Adapters are explicitly injected. No production URL, account, model, inference, memory retention or playback is enabled by import.
- Canonical self belongs to the external substrate. A variation is independent. Fetch recency is not proof of canonical source revision.
- Memory is scoped and opt-in. Preserve revocation, in-flight forget ordering, actual serving-model identity and cancellation behavior.
- Treat character writing as authored narrative; document technical capabilities through tested behavior. Do not turn proposals, model outputs or fetched text into creator-approved canon.
- Keep original expressions and Unicode intact. Private product corpora, journals, credentials, copyrighted media and voice assets are not package inputs.
- Preserve the legacy affect engine. New behavior uses the explicit elapsed-time clock and versioned bus. Musical taste still needs listening.
- Run npm run check, plus the relevant targeted tests when changing lifecycle behavior. Package tests exercise the packed artifact, ESM/CJS types and browser bundling.
- Use an isolated branch. Keep reviewable commits and migration notes; never merge, publish a package, deploy production or change consumers automatically.
- Research candidates follow 9xSweep fold/skip/watch. New model/framework adoption needs task-specific hardware verification; popularity is not validation.
