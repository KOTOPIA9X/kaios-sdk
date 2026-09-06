import test from 'node:test'
import assert from 'node:assert/strict'
import { createKaios, createSessionMemory } from '../src/runtime/index.ts'
import { KAIOS_CHARACTER, compileCharacterPrompt } from '../src/character/index.ts'

const model = (generate = async () => ({text: 'hello (◕‿◕)', model: 'fixture-v1'})) => ({id: 'fixture', generate})

test('offline expression needs no provider; absent provider is honestly unavailable', async () => {
  const kaios = createKaios()
  assert.equal(kaios.express('hello', 'EMOTE_HAPPY').emotion, 'EMOTE_HAPPY')
  assert.equal(typeof kaios.express('hello').face, 'string')
  assert.equal((await kaios.reply('hello')).status, 'unavailable')
  assert.throws(() => kaios.express('hello', 'FAKE'))
  assert.throws(() => kaios.setMemoryConsent(true))
})

test('memory is opt-in, bounded per request, isolated by session, copied, and forgettable', async () => {
  const store = createSessionMemory(), requests = []
  const kaios = createKaios({text: model(async request => {
    requests.push(request); return {text: 'hello', model: 'fixture-v1'}
  }), memory: {store, sessionId: 'one', maxMessages: 2}})
  await kaios.reply('not retained')
  assert.deepEqual(await store.read('one'), [])
  kaios.setMemoryConsent(true)
  assert.equal((await kaios.reply('retained')).memory, 'remembered')
  await kaios.reply('next')
  assert.deepEqual(requests[2].messages.map(m => m.content), ['retained', 'hello', 'next'])
  assert.deepEqual(await store.read('two'), [])
  const copy = await store.read('one'); copy[0].content = 'corrupted'
  assert.equal((await store.read('one'))[0].content, 'retained')
  await kaios.forget()
  assert.deepEqual(await store.read('one'), [])
  await kaios.reply('still disabled')
  assert.deepEqual(await store.read('one'), [])
})

test('forget during inference invalidates the old completion before it can be remembered', async () => {
  const store = createSessionMemory()
  let complete, started
  const ready = new Promise(resolve => {started = resolve})
  const kaios = createKaios({text: model(async () => {
    started(); return new Promise(resolve => {complete = resolve})
  }), memory: {store, sessionId: 'one'}})
  kaios.setMemoryConsent(true)
  const reply = kaios.reply('private')
  await ready
  const released = kaios.forget()
  complete({text: 'old completion', model: 'fixture'})
  assert.equal((await reply).memory, 'released')
  await released
  assert.deepEqual(await store.read('one'), [])
})

test('canonical failure, empty data or stale data never silently become a variation', async () => {
  let calls = 0
  for (const snapshot of [{status: 'stale', block: 'old'}, {status: 'fresh', block: ''}, {status: 'unavailable', block: ''}]) {
    const kaios = createKaios({identity: {mode: 'canonical', adapter: {read: async () => snapshot}}, text: model(async () => {calls++; return {text: 'no', model: 'no'}})})
    assert.equal((await kaios.reply('hi')).status, 'unavailable')
  }
  assert.equal(calls, 0)
  let request
  const kaios = createKaios({identity: {mode: 'canonical', adapter: {read: async () => ({status: 'fresh', block: 'fixture continuity'})}}, text: model(async r => {request = r; return {text: 'hi', model: 'fixture'}})})
  const result = await kaios.reply('hi')
  assert.equal(result.identity, 'canonical')
  assert.match(request.system, /fixture continuity/)
  assert.equal(result.provider, 'fixture')
  assert.equal(result.model, 'fixture')
})

test('provider errors do not expose credentials or get written as conversation', async () => {
  const store = createSessionMemory()
  const kaios = createKaios({text: model(async () => {throw new Error('private-provider-diagnostic')}), memory: {store, sessionId: 'test'}})
  kaios.setMemoryConsent(true)
  assert.deepEqual(await kaios.reply('hi'), {status: 'error', reason: 'text adapter failed'})
  assert.deepEqual(await store.read('test'), [])
})

test('pre-cancelled request never calls inference; invalid input fails before work', async () => {
  let calls = 0
  const kaios = createKaios({text: model(async () => {calls++; return {text: 'hi', model: 'fixture'}})})
  assert.equal((await kaios.reply('hi', {signal: AbortSignal.abort()})).status, 'cancelled')
  assert.equal((await kaios.reply('')).status, 'error')
  assert.equal(calls, 0)
})

test('public character direction is immutable and distinguishes story, person and runtime', () => {
  assert.ok(Object.isFrozen(KAIOS_CHARACTER.voice))
  const prompt = compileCharacterPrompt()
  assert.match(prompt, /Koto Murai/)
  assert.match(prompt, /mouthless/)
  assert.match(prompt, /standalone|variation/)
  assert.throws(() => compileCharacterPrompt({...KAIOS_CHARACTER, schemaVersion: 2}))
})
