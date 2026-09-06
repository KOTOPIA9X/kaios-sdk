# Voice

`@kaios/expression-sdk/voice` provides an injected voice contract and an honest silent fallback. It imports no provider SDK, reads no environment variables, and starts no synthesis or playback on import. Your adapter owns credentials, model selection, audio generation, playback and resource cleanup.

```ts
import { createVoice, type VoiceAdapter } from '@kaios/expression-sdk/voice'

// Implement this at the application boundary using your chosen voice service.
declare const adapter: VoiceAdapter

const voice = createVoice(adapter)
const result = await voice.speak({
  text: 'a small signal, finding its way home',
  mode: 'speech',
})

if (result.status === 'ready') {
  // result.audio is generated audio, ready for your playback code.
  console.log(result.audio.mimeType, result.audio.data.byteLength)
} else if (result.status === 'unavailable') {
  console.log(result.reason)
}
```

## Contract

```ts
interface VoiceAdapter {
  readonly id: string
  readonly capabilities: {
    speech: boolean
    singing: boolean
    streaming: boolean
    affect: boolean
  }
  speak(request: VoiceRequest): Promise<VoiceResult>
}

interface VoiceRequest {
  text: string
  mode?: 'speech' | 'singing' // default: speech
  voiceId?: string
  affect?: { valence: number; arousal: number; energy?: number }
  signal?: AbortSignal
}
```

Capabilities describe what the injected adapter actually supports. Set `affect: true` only when it consumes expressive parameters; an adapter that ignores them should declare `false`. `streaming` is informational capability metadata for host/provider selection. This version's `speak` returns complete output and does not expose an audio-stream protocol.

`createVoice(adapter)` snapshots and freezes capability metadata, rejects malformed adapter configuration, and wraps requests with validation and error containment. Empty text, invalid modes/voice IDs, and nonfinite or out-of-range affect return an `error` before invocation. Valence accepts −1 through 1; arousal and optional energy accept 0 through 1. A request for unsupported speech, singing or affect returns `unavailable`; it does not silently drop that request's parameters.

The result is a discriminated union:

| Status | Meaning | Additional fields |
| --- | --- | --- |
| `ready` | Audio was generated; playback is the host's responsibility. | `audio: { data: Uint8Array; mimeType: string }` |
| `played` | The adapter reports that it completed playback. | None |
| `unavailable` | No applicable capability or provider is available. | `reason: string` |
| `cancelled` | The request was cancelled. | None |
| `error` | Validation, generation or adapter execution failed. | `message: string` |

The wrapper checks that a `ready` result has nonempty bytes and an `audio/…` MIME type; it does not decode or independently verify that audio. Likewise, a `played` result relies on the adapter's honest report. Provider exceptions become `error` results, and malformed results cannot masquerade as playback success. Thrown exceptions use a generic message. An adapter that explicitly returns a structured error must supply a display-safe message.

## Cancellation and fallback

```ts
import { createVoice, createNullVoiceAdapter } from '@kaios/expression-sdk/voice'

const silent = createVoice(createNullVoiceAdapter())
console.log((await silent.speak({ text: 'still here' })).status) // unavailable

const controller = new AbortController()
const pending = voice.speak({ text: 'hello', signal: controller.signal })
controller.abort()
await pending // { status: 'cancelled' }
```

An already-aborted request never invokes the provider. The wrapper forwards the original signal and returns promptly when it aborts, even if the provider is still pending. It also consumes late provider rejection and removes its abort listener after completion. Stopping provider work or audio playback requires the adapter to honor that signal; the wrapper cannot stop an external device itself. Without a signal, a stalled provider can remain pending; the host owns timeout policy.

`createVoice()` uses `createNullVoiceAdapter()` by default. The null adapter explicitly advertises no capabilities and returns `unavailable`. Its factory accepts an optional reason string. Silence never reports that sound was played.

There is no default model, paid provider, voice-cloning workflow, browser permission request, or hidden provider fallback. Add and benchmark a concrete adapter in the consuming application before promising latency, singing quality, streaming behavior or expressive control.

Thrown provider exceptions become a generic `Voice adapter failed` result so raw request diagnostics do not escape through the facade. An adapter returning a structured `error` result is responsible for making its message safe to display.
