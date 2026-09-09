import test from 'node:test'
import assert from 'node:assert/strict'
import { AffectBus, isAffectFrame, isPerformanceState } from '../src/affect/index.ts'

const initial = { valence: 0.3, arousal: 0.75, energy: 0.75 }
const remote = () => new AffectBus({ sourceId: 'stage', affect: initial })

test('a bus shares one immutable clock result with all consumers and keeps old frames intact', () => {
  const bus = new AffectBus({ sourceId: 'local', bpm: 120, affect: initial })
  const seen = []
  const unsubscribe = bus.subscribe(frame => seen.push(frame))
  const first = bus.advanceTo(1)
  assert.equal(first.version, 1)
  assert.equal(first.sourceId, 'local')
  assert.equal(first.state.beat, 2)
  assert.equal(first.clock.timeSeconds, 1)
  assert.equal(first.events.length, 2)
  assert.equal(seen[0], first)
  assert.equal(bus.getSnapshot(), first)
  assert.throws(() => { first.state.music.chordBias.push('mutation') }, TypeError)
  assert.throws(() => { first.events[0].beat = 999 }, TypeError)
  bus.advanceTo(1)
  assert.deepEqual(bus.getSnapshot().events, [])
  assert.equal(first.events.length, 2)
  unsubscribe()
  unsubscribe()
  bus.advanceTo(2)
  assert.equal(seen.length, 2)
})

test('external ownership excludes competitors, validates its source, and copies accepted frames', () => {
  const bus = new AffectBus({ sourceId: 'local' })
  const producer = remote()
  const owner = bus.claimExternal('stage', { atSeconds: 0, staleAfterSeconds: 1 })
  assert.throws(() => bus.claimExternal('other', { atSeconds: 0 }), /owner/i)
  const before = bus.getSnapshot()
  const wrong = structuredClone(producer.advanceTo(0.25))
  wrong.sourceId = 'impostor'
  assert.throws(() => owner.receive(wrong, 0.25), /source/i)
  assert.equal(bus.getSnapshot(), before)
  const payload = structuredClone(producer.advanceTo(0.5))
  const frame = owner.receive(payload, 0.5)
  payload.state.visual.palette[0] = 'mutated'
  assert.equal(frame.sourceId, 'stage')
  assert.equal(frame.state.visual.palette[0], '#FF4DB8')
  assert.equal(bus.getSnapshot(), frame)
  assert.throws(() => owner.receive(payload, 0.5), /sequence/i)
  assert.equal(bus.getSnapshot(), frame)
  owner.release()
  assert.equal(bus.getSnapshot().sourceId, 'local')
  assert.equal(bus.getSnapshot().clock.timeSeconds, 0.5)
  owner.release()
  assert.throws(() => owner.receive(producer.advanceTo(1), 1), /owner|released/i)
})

test('staleness and track reset release old leases only on the explicit host clock', () => {
  const bus = new AffectBus({ sourceId: 'local' })
  const producer = remote()
  const owner = bus.claimExternal('stage', { atSeconds: 0, staleAfterSeconds: 1 })
  owner.receive(producer.advanceTo(0.5), 0.5)
  assert.equal(bus.advanceTo(1.49).sourceId, 'stage')
  assert.equal(bus.advanceTo(1.5).sourceId, 'local')
  assert.throws(() => owner.receive(producer.advanceTo(1.5), 1.5), /owner|released/i)
  const next = bus.claimExternal('stage', { atSeconds: 1.5 })
  bus.resetTrack(0, { affect: initial, bpm: 90 })
  assert.equal(bus.getSnapshot().clock.track, 1)
  assert.equal(bus.getSnapshot().clock.bpm, 90)
  assert.equal(bus.getSnapshot().state.energyFast, 0)
  assert.throws(() => next.receive(producer.advanceTo(2), 0), /owner|released/i)
})

test('malformed nested numbers, events, versions and clocks never replace a frame', () => {
  const bus = new AffectBus({ sourceId: 'local' })
  const owner = bus.claimExternal('stage', { atSeconds: 0 })
  const valid = remote().advanceTo(0.5)
  assert.equal(isAffectFrame(valid), true)
  assert.equal(isPerformanceState(valid.state), true)
  const mutations = [
    frame => { frame.version = 2 },
    frame => { frame.sequence = 0.5 },
    frame => { frame.clock.bpm = Infinity },
    frame => { frame.clock.beatPhase = -1 },
    frame => { frame.state.energySlow = NaN },
    frame => { frame.state.music.density = 2 },
    frame => { frame.state.music.tempoBias = -1 },
    frame => { frame.state.music.chordBias = ['maj7', false] },
    frame => { frame.state.music.chordBias = new Array(3) },
    frame => { frame.state.visual.particles = 0.5 },
    frame => { frame.state.visual.palette = ['#000'] },
    frame => { frame.state.visual.palette = new Array(3) },
    frame => { frame.state.visual.bloom = Infinity },
    frame => { frame.state.rising = 1 },
    frame => { frame.state.arc = 'made-up' },
    frame => { frame.state.unversioned = true },
    frame => { frame.events[0].timeSeconds = 10 },
    frame => { frame.events[0].timeSeconds = -0.5 },
  ]
  for (const mutate of mutations) {
    const payload = structuredClone(valid)
    mutate(payload)
    assert.equal(isAffectFrame(payload), false)
    const before = bus.getSnapshot()
    assert.throws(() => owner.receive(payload, 0.5), /frame/i)
    assert.equal(bus.getSnapshot(), before)
  }
  assert.equal(isPerformanceState(null), false)
  assert.equal(isPerformanceState({ music: {}, visual: {} }), false)
  owner.receive(valid, 0.5)
})

test('invalid clock operations and reset are atomic even during external ownership', () => {
  const bus = new AffectBus()
  const owner = bus.claimExternal('stage', { atSeconds: 0 })
  owner.receive(remote().advanceTo(0.5), 0.5)
  const before = bus.getSnapshot()
  assert.throws(() => bus.resetTrack(0, { bpm: 0 }), RangeError)
  assert.throws(() => bus.advanceTo(0.4), RangeError)
  assert.throws(() => bus.advanceTo(4), RangeError)
  assert.equal(bus.getSnapshot(), before)
  assert.throws(() => bus.claimExternal('other', { atSeconds: 0.5 }), /owner/i)
})

test('a released lease cannot revoke its successor or revive after its stale deadline', () => {
  const bus = new AffectBus()
  const previous = bus.claimExternal('stage', { atSeconds: 0 })
  previous.release()
  const next = bus.claimExternal('stage', { atSeconds: 0 })
  previous.release()
  const producer = remote()
  next.receive(producer.advanceTo(0.5), 0.5)
  assert.throws(() => next.receive(producer.advanceTo(1.5), 1.5), /stale/)
  bus.advanceTo(1.5)
  assert.equal(bus.getSnapshot().sourceId, 'local')
})

test('remote track clocks cannot regress; a new track may reset its time origin', () => {
  const bus = new AffectBus()
  const producer = remote()
  const owner = bus.claimExternal('stage', { atSeconds: 0 })
  owner.receive(producer.advanceTo(0.5), 0.25)
  const invalid = structuredClone(producer.advanceTo(0.75))
  invalid.clock.timeSeconds = 0
  invalid.events = []
  assert.throws(() => owner.receive(invalid, 0.5), /clock/)
  assert.equal(owner.receive(producer.resetTrack(0), 0.5).clock.track, 1)
})

test('subscriber failures do not starve consumers or leave an inaccessible external lease', () => {
  const bus = new AffectBus()
  let delivered
  const off = bus.subscribe(() => { throw new Error('renderer failed') })
  bus.subscribe(frame => { delivered = frame })
  assert.throws(() => bus.claimExternal('stage', { atSeconds: 0 }), AggregateError)
  assert.equal(delivered, bus.getSnapshot())
  off()
  const owner = bus.claimExternal('stage', { atSeconds: 0 })
  owner.release()
  const stop = bus.subscribe(() => bus.advanceTo(0.5))
  assert.throws(() => bus.advanceTo(0.25), AggregateError)
  assert.equal(bus.getSnapshot().clock.timeSeconds, 0.25)
  stop()
})
