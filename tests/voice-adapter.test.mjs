import test from 'node:test'
import assert from 'node:assert/strict'
import { createVoice, createNullVoiceAdapter } from '../src/voice/index.ts'

const capabilities = { speech: true, singing: false, streaming: false, affect: false }
const request = { text: 'hello from KAIOS' }

test('the null adapter and absent provider report unavailable without implying playback', async () => {
  const nullAdapter = createNullVoiceAdapter('No voice has been connected')
  assert.deepEqual(await nullAdapter.speak(request), {
    status: 'unavailable', reason: 'No voice has been connected',
  })
  const voice = createVoice()
  assert.equal(voice.capabilities.speech, false)
  assert.equal((await voice.speak(request)).status, 'unavailable')
})

test('ready audio stays distinct from played output; expressive input reaches a capable adapter', async () => {
  const audio = { data: new Uint8Array([1, 2, 3]), mimeType: 'audio/wav' }
  let received
  const voice = createVoice({
    id: 'injected', capabilities: { ...capabilities, affect: true },
    async speak(value) { received = value; return { status: 'ready', audio } },
  })
  const affect = { valence: 0.4, arousal: 0.2 }
  assert.deepEqual(await voice.speak({ ...request, affect }), { status: 'ready', audio })
  assert.deepEqual(received.affect, affect)
  assert.equal(Object.isFrozen(voice.capabilities), true)
  const played = createVoice({ id: 'player', capabilities, async speak() { return { status: 'played' } } })
  assert.deepEqual(await played.speak(request), { status: 'played' })
})

test('unsupported modes and affect return unavailable before invoking a provider', async () => {
  let calls = 0
  const voice = createVoice({ id: 'speech-only', capabilities, async speak() { calls++; return { status: 'played' } } })
  assert.equal((await voice.speak({ ...request, mode: 'singing' })).status, 'unavailable')
  assert.equal((await voice.speak({ ...request, affect: { valence: 0, arousal: 0.5 } })).status, 'unavailable')
  assert.equal(calls, 0)
})

test('provider failure and malformed success produce honest error results', async () => {
  const failure = createVoice({ id: 'thrower', capabilities, async speak() { throw new Error('device disconnected') } })
  assert.deepEqual(await failure.speak(request), { status: 'error', message: 'Voice adapter failed' })
  for (const result of [null, undefined, {}, { status: 'ready', audio: null }, { status: 'ready', audio: { data: new Uint8Array(), mimeType: 'audio/wav' } }]) {
    const voice = createVoice({ id: 'broken', capabilities, async speak() { return result } })
    assert.equal((await voice.speak(request)).status, 'error')
  }
})

test('invalid text and affect fail before adapter invocation', async () => {
  let calls = 0
  const voice = createVoice({ id: 'strict', capabilities: { ...capabilities, affect: true }, async speak() { calls++; return { status: 'played' } } })
  for (const value of [{ text: '' }, { text: '   ' }, { text: 42 }, { ...request, affect: { valence: NaN, arousal: 0.3 } }, { ...request, affect: { valence: 0, arousal: Infinity } }]) {
    assert.equal((await voice.speak(value)).status, 'error')
  }
  assert.equal(calls, 0)
})

test('an already-cancelled request never invokes the provider', async () => {
  let calls = 0
  const controller = new AbortController()
  controller.abort()
  const voice = createVoice({ id: 'cancel', capabilities, async speak() { calls++; return { status: 'played' } } })
  assert.deepEqual(await voice.speak({ ...request, signal: controller.signal }), { status: 'cancelled' })
  assert.equal(calls, 0)
})

test('in-flight cancellation returns promptly and supplies the original signal to the adapter', async () => {
  const controller = new AbortController()
  let receivedSignal
  let rejectProvider
  const voice = createVoice({
    id: 'pending', capabilities,
    speak(value) {
      receivedSignal = value.signal
      return new Promise((resolve, reject) => { rejectProvider = reject })
    },
  })
  const pending = voice.speak({ ...request, signal: controller.signal })
  controller.abort()
  assert.deepEqual(await pending, { status: 'cancelled' })
  assert.equal(receivedSignal, controller.signal)
  rejectProvider(new Error('late provider rejection must be consumed'))
  await new Promise(resolve => setImmediate(resolve))
})
