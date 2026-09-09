# Portable character runtime

Import from `@kaios/expression-sdk/runtime`. Construction performs no IO. A standalone variation is the default. The legacy root `Kaios` class remains available, but its lifecycle and integrations differ.

```ts
import { createKaios, createSessionMemory, type TextAdapter } from '@kaios/expression-sdk/runtime'

const text: TextAdapter = {
  id: 'my-application',
  async generate({ system, messages, signal }) {
    // Implement with your selected provider or authenticated application proxy.
    const response = await fetch('/api/character', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ system, messages }),
      signal,
    })
    if (!response.ok) throw new Error('Text service unavailable')
    return response.json() // { text: string, model: string } — actual serving model
  },
}
const kaios = createKaios({ text, memory: {store: createSessionMemory(), sessionId: 'demo'} })
console.log(kaios.express('hello', 'EMOTE_HAPPY'))
kaios.setMemoryConsent(true) // after the application obtains consent
const reply = await kaios.reply('hello')
await kaios.forget()
```

The endpoint in this example belongs to the consuming application; the SDK does not provision it. Provider keys belong on its server. `TextAdapter.generate` receives a character system prompt, bounded user/assistant history and the current input. It returns text and the actual model ID. Provider failures are reported without echoing raw diagnostics into responses.

`reply()` returns `generated`, `unavailable`, `cancelled` or `error`. A generated result includes `provider`, `model`, requested `identity`, expression and memory status. No text adapter returns `unavailable`; `express()` still works offline. The expression detector is a keyword-based artistic convenience. Pass an explicit emotion when the scene already supplies it.

## Memory and release

Configuring a store does not grant consent. `setMemoryConsent(true)` enables reads and writes for the configured session. The default request history is at most 20 messages; `maxMessages` accepts 1–100. The reference store keeps at most 100 messages per session in memory and returns copies. Inject `SessionMemory` for durable storage.

`setMemoryConsent(false)` stops future retention and invalidates in-flight turns' retention permission. `forget()` revokes immediately and clears the session after pending writes settle. It does not delete canonical facets, reflections, provider logs, exported files or another device's independent store. A durable adapter must make a completed `clear()` authoritative over its prior writes and propagate failure.

Turns are serialized per runtime to keep conversational history ordered. Use separate instances/session IDs for independent conversations. Do not re-enable consent until a requested `forget()` has completed. Hosts own authentication, storage access control, provider retention policy and UI consent.

## Canonical surface

```ts
import { SpineAdapter } from '@kaios/expression-sdk/spine'
const identity = new SpineAdapter({url: 'https://your-substrate.example', useEnvironment: false})
const surface = createKaios({text, identity: {mode: 'canonical', adapter: identity}})
```

A canonical identity adapter must return a nonempty block and `status: 'fresh'`. Stale, missing and failed snapshots return `unavailable` before inference. The built-in spine adapter uses HTTP retrieval/cache recency; the legacy service exposes no source revision timestamp. Stronger revision verification belongs in a host adapter. See [spine](spine.md).

## Cancellation and deadlines

Pass `{signal}` to `reply()`. The active turn has a 30-second read/inference budget (`timeoutMs`, positive and at most 120000). Cancellation and deadlines race identity reads, memory reads and inference, release the turn queue and ignore late output. The combined signal is passed to the text adapter; providers must cooperate to stop their own work.

Once a memory append has started, the runtime waits for that actual write to settle before a following clear. It does not claim a deletion is complete while a prior uncooperative write could restore the history. A store whose append or clear never settles can prevent `forget()` from completing; durable stores need their own bounded, correctly ordered operations. Cancellation after append starts suppresses the generated reply once the write settles but does not retroactively undo a completed write. Use `forget()` to clear retained history.
