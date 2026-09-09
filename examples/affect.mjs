import { AffectBus } from '@kaios/expression-sdk/affect'

const bus = new AffectBus({bpm: 120, sourceId: 'offline-example'})
let beats = 0
const unsubscribe = bus.subscribe(frame => {
  for (const event of frame.events) {
    if (event.type === 'beat') beats++
    if (event.type === 'phrase') console.log(`Phrase at ${event.timeSeconds}s, beat ${event.beat}`)
  }
})
bus.advanceTo(0, {valence: 0.6, arousal: 0.7})
for (let i = 1; i <= 240; i++) bus.advanceTo(i / 30)
const frame = bus.getSnapshot()
console.log({elapsedSeconds: frame.clock.timeSeconds, beats, mode: frame.state.music.mode, look: frame.state.visual.look})
unsubscribe()
