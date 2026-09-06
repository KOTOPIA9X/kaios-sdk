# Affect

`@kaios/expression-sdk/affect` is an opt-in, framework-free clock and shared performance contract. It connects expressive state to music, visuals, or another renderer. It does not schedule frames, open audio devices, or send network messages.

```ts
import { AffectBus } from '@kaios/expression-sdk/affect'

const bus = new AffectBus({
  sourceId: 'character',
  bpm: 120,
  affect: { valence: 0.3, arousal: 0.75, energy: 0.75 },
})

const unsubscribe = bus.subscribe(frame => {
  // Send the same frame.state.music and frame.state.visual to your renderers.
  console.log(frame.state.arc, frame.state.beat, frame.events)
})

bus.advanceTo(0.5)
bus.advanceTo(1, { valence: 0, arousal: 0.2 })
bus.resetTrack(0, { bpm: 90 })
unsubscribe()
```

Times are seconds within the host's current track. `advanceTo(t, affect)` integrates the previously held sample through `t`, then installs the new sample prospectively. Repeating a timestamp is allowed and produces no new local beat events. Time cannot move backwards; reset explicitly for a new track. Gaps larger than `maxGapSeconds` throw before mutation (default 2; configurable from 0.001 through 10). Replay longer intervals in bounded steps, or reset.

The clock separates elapsed-time envelopes, a fixed 30 Hz decision grid, and musical beats. Identical timestamped inputs reproduce the same event history across renderer polling schedules, within floating-point precision. Differently sampled live inputs are different histories. The legacy `AffectiveSynth.tick()` remains call-counted; adopting this bus is explicit.

## Frames and subscriptions

`getSnapshot()` returns the most recent deeply frozen `AffectFrame`:

```ts
interface AffectFrame {
  version: 1
  sourceId: string
  sequence: number
  state: PerformanceState
  events: AffectClockEvent[]
  clock: { timeSeconds: number; bpm: number; beatPhase: number; track: number }
}
```

The actual exported type is deeply readonly. Each snapshot owns its nested arrays and objects. Keeping an old frame is safe. `sequence` increases per producer instance, including across its track resets; choose distinct source IDs for concurrent producers. A sequence from one source is not comparable to another source's sequence.

`subscribe(listener)` returns an idempotent unsubscribe function. It does not replay the initial frame; use `getSnapshot()` for the initial render. Polling a held external snapshot returns the same frame and its same event array. Consume edges once per new `(sourceId, sequence)`, or through subscriptions, rather than replaying events on every render poll. Visual pulse flags have a short physical duration; the event array records edges a slow renderer could otherwise miss.

Listeners run synchronously after the frame commits. A failed listener does not prevent the others receiving it; the operation then throws `AggregateError`. This is a listener failure after a committed update, not a validation failure. Do not call clock/ownership mutation methods from a listener; reentrant updates are rejected. Unsubscribing during a callback is supported.

## External ownership

The host explicitly grants one source a lease. The lease has no transport or authentication mechanism: a source ID is a routing label, not proof of identity.

```ts
const stage = new AffectBus({ sourceId: 'stage', bpm: 120 })
const display = new AffectBus({ sourceId: 'display', bpm: 120 })

const owner = display.claimExternal('stage', {
  atSeconds: 0,
  staleAfterSeconds: 1,
})

owner.receive(stage.advanceTo(0.5), 0.5)
display.advanceTo(1) // still displays the held stage frame
display.advanceTo(1.5) // deadline reached: releases stage and resumes local output
owner.release() // safe after expiry; cannot revoke a subsequent owner
```

`receive(frame: unknown, receivedAtSeconds)` validates and copies a complete version 1 frame. The second argument is an arrival timestamp on the **host clock**; the supplied frame retains its producer's clock. The host clock must still obey its nondecreasing-time and maximum-gap rules. Remote sequence numbers must strictly increase within a lease. Remote track numbers cannot decrease; time and beat cannot decrease within one remote track. A higher track number permits a new time origin.

The local synth continues advancing while the external source owns the visible output. On release or expiry, local output resumes from that host-clock state, without replaying events hidden during ownership. Incoming external state does not overwrite the local synth's internal envelopes. Before the first received frame, local output remains visible.

Staleness is measured from the claim or most recent accepted frame, on host time. The default is 1 second; `staleAfterSeconds` accepts 0.001 through 3600. A receive at or beyond the deadline is rejected. Call `advanceTo` to expire that lease, or release it explicitly, before claiming again. Nothing expires during wall-clock inactivity because the SDK creates no timers. Every valid `resetTrack` releases ownership and restores local output. Omitted reset options use clock defaults, not the previous track's configuration.

`isAffectFrame(unknown)` and `isPerformanceState(unknown)` validate the complete v1 shape, including finite numeric ranges, booleans, arc values, nested music/visual fields, dense arrays, event ordering and clock bounds. Extra object fields require a future version instead of silently crossing the v1 boundary. Labels are bounded nonempty strings; palette labels are not interpreted or applied to the DOM by this module. Event arrays are limited to 4,096 entries. Source labels, mode names and look names are data; renderers decide how to map them.

If you add a browser or network bridge, validate its origin and sender before calling `receive`, enforce payload-size limits at transport ingress, and release the lease when that connection ends. This package does not infer trusted origins, create a `postMessage` listener, or expose credentials.

`AffectiveSynthV2`, its options/results/events, and the shared `Affect`, `PerformanceState`, `MusicParams`, `VisualParams` and `ArcPhase` types are also exported for hosts that only need the clock or contracts.
