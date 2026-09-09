import test from 'node:test'
import assert from 'node:assert/strict'
import { AffectiveSynthV2 } from '../src/audio/intelligence/affect-clock-v2.ts'
import { AffectiveSynth } from '../src/audio/intelligence/affect-engine.ts'

const initial = { valence: 0.3, arousal: 0.75, energy: 0.75 }
const close = (a, b, tolerance = 1e-10) => assert.ok(Math.abs(a-b) < tolerance, `${a} != ${b}`)
const sampleTimes = fps => Array.from({length: fps * 16}, (_, i) => (i+1)/fps)
const jitterTimes = () => {
  let t = 0, i = 0, out = []
  while (t < 16) { t = Math.min(16, t + [0.011, 0.071, 0.025, 0.043][i++ % 4]); out.push(t) }
  return out
}
const inputs = [
  [0, initial], [2.137, {valence: -0.4, arousal: 0.2, energy: 0.05}],
  [5.019, {valence: 0.8, arousal: 0.9, energy: 1}],
  [11.001, {valence: 0, arousal: 0.1, energy: 0}],
]
function replay(times, changes = [[0, initial]]) {
  const synth = new AffectiveSynthV2({bpm: 120, affect: initial})
  const all = [...new Set([...times, ...changes.map(([t]) => t), 1, 8, 16])].sort((a,b) => a-b)
  const events = [], snapshots = []
  for (const t of all) {
    const result = synth.advanceTo(t, changes.find(([at]) => at === t)?.[1])
    events.push(...result.events)
    if ([1, 8, 16].includes(t)) snapshots.push(result.state)
  }
  return {events, snapshots}
}
function sameReplay(a,b) {
  assert.deepEqual(a.events,b.events)
  for (let i=0;i<a.snapshots.length;i++) {
    const x=a.snapshots[i], y=b.snapshots[i]
    for (const key of ['energyFast','energySlow','tension']) close(x[key],y[key])
    for (const key of ['arc','beat','rising','drop','breakdown','phraseCut']) assert.equal(x[key],y[key])
  }
}

test('constant input agrees at 24/30/60 Hz and jitter; envelopes match 30 Hz reference', () => {
  const reference = replay(sampleTimes(30))
  for (const times of [sampleTimes(24),sampleTimes(60),jitterTimes()]) sameReplay(reference,replay(times))
  close(reference.snapshots[0].energyFast,0.75*(1-Math.pow(0.91,30)))
  close(reference.snapshots[0].energySlow,0.75*(1-Math.pow(0.988,30)))
})
test('identical timestamped piecewise inputs agree across render schedules', () => {
  const reference = replay(sampleTimes(30), inputs)
  for (const times of [sampleTimes(24),sampleTimes(60),jitterTimes()]) sameReplay(reference,replay(times,inputs))
})
test('16 musical beats at 120 BPM take 8 seconds; render polls do not duplicate events', () => {
  const synth = new AffectiveSynthV2({bpm:120,affect:initial})
  const events=[]
  for(let t=0;t<=8;t+=0.25) events.push(...synth.advanceTo(t).events)
  assert.equal(events.filter(e=>e.type==='beat').length,16)
  assert.deepEqual(events.filter(e=>e.type==='phrase'),[{type:'phrase',timeSeconds:8,beat:16}])
  assert.deepEqual(synth.advanceTo(8).events,[])
  assert.equal(synth.advanceTo(8).state.beat,16)
})
test('track reset releases outro and clears envelopes, tension, counters and pending pulses', () => {
  const synth = new AffectiveSynthV2({affect:{valence:0,arousal:1,energy:1}})
  for(let t=1;t<=20;t++) synth.advanceTo(t)
  synth.advanceTo(20,{valence:0,arousal:0,energy:0})
  for(let t=21;t<=40;t++) synth.advanceTo(t)
  assert.equal(synth.advanceTo(40).state.arc,'outro')
  const reset=synth.resetTrack(0,{affect:initial,bpm:120})
  assert.equal(reset.state.arc,'intro'); assert.equal(reset.state.beat,0)
  assert.equal(reset.state.energyFast,0); assert.equal(reset.state.tension,0)
  assert.deepEqual(reset.events,[])
  for(let t=1;t<=8;t++) synth.advanceTo(t)
  assert.notEqual(synth.advanceTo(8).state.arc,'outro')
})
test('invalid input/time/config is rejected atomically; long gaps require explicit reset or replay', () => {
  for (const opts of [{bpm:0},{bpm:NaN},{bpm:401},{phraseBeats:1.5},{maxGapSeconds:0},{maxGapSeconds:11}]) {
    assert.throws(()=>new AffectiveSynthV2(opts),RangeError)
  }
  const synth = new AffectiveSynthV2({affect:initial})
  synth.advanceTo(1)
  const before=synth.advanceTo(1)
  for(const t of [NaN,Infinity,-1,0.9,4]) assert.throws(()=>synth.advanceTo(t),RangeError)
  for(const affect of [{...initial,energy:NaN},{...initial,valence:2},{...initial,arousal:Infinity},{...initial,energy:true}]) {
    assert.throws(()=>synth.advanceTo(1.1,affect),RangeError)
  }
  assert.deepEqual(synth.advanceTo(1),before)
  assert.throws(()=>synth.resetTrack(0,{bpm:0}),RangeError)
  assert.deepEqual(synth.advanceTo(1),before)
})
test('samples take effect prospectively and a same-time replacement does not rewrite the past', () => {
  const synth = new AffectiveSynthV2({affect:{valence:0,arousal:0,energy:0}})
  close(synth.advanceTo(1,{valence:0,arousal:1,energy:1}).state.energyFast,0)
  close(synth.advanceTo(2).state.energyFast,1-Math.pow(0.91,30))
})
test('legacy API remains call-counted and compatible', () => {
  const legacy = new AffectiveSynth()
  let state
  for(let i=0;i<30;i++) state=legacy.tick(0.75)
  assert.equal(state.beat,30)
  close(state.energySlow,0.75*(1-Math.pow(0.988,30)))
})
test('bounded batched advance preserves all beat/phrase/drop events and final state', () => {
  const batched = new AffectiveSynthV2({affect:initial,maxGapSeconds:10})
  const rendered = new AffectiveSynthV2({affect:initial,maxGapSeconds:10})
  const events=[]
  let result
  for(let i=1;i<=480;i++) { result=rendered.advanceTo(i/60); events.push(...result.events) }
  const batch=batched.advanceTo(8)
  assert.deepEqual(batch.events,events)
  assert.ok(events.some(e=>e.type==='drop'))
  close(batch.state.tension,result.state.tension)
  close(batch.state.energySlow,result.state.energySlow)
  assert.equal(batch.state.arc,result.state.arc)
})
test('fractional beat times and nonzero origin are independent of render polling', () => {
  function run(fps) {
    const synth=new AffectiveSynthV2({startTimeSeconds:100,bpm:137,affect:initial})
    const events=[]
    for(let i=1;i<=fps*8;i++) events.push(...synth.advanceTo(100+i/fps).events)
    return {events,result:synth.advanceTo(108)}
  }
  const a=run(24),b=run(60)
  assert.deepEqual(a.events,b.events)
  assert.equal(a.result.state.beat,18)
  close(a.result.clock.beatPhase,8*137/60-18)
  close(a.events.find(e=>e.type==='phrase').timeSeconds,100+16*60/137)
  close(a.result.state.energyFast,b.result.state.energyFast)
})
test('caller mutation cannot change held input or retained output state', () => {
  const affect={...initial}
  const synth=new AffectiveSynthV2({affect})
  affect.energy=0
  const first=synth.advanceTo(1)
  first.state.music.chordBias.length=0; first.state.energyFast=NaN
  const next=synth.advanceTo(1)
  close(next.state.energyFast,0.75*(1-Math.pow(0.91,30)))
  assert.equal(next.state.music.chordBias.length,3)
})
