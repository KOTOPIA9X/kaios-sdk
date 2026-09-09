import test from 'node:test'
import assert from 'node:assert/strict'
import { setTimeout as delay } from 'node:timers/promises'
import { createServer } from 'node:http'
import { KaiosRuntime, createSessionMemory } from '../src/runtime/index.ts'
import { SpineAdapter } from '../src/spine/spine-adapter.ts'

const deferred = () => {
  let resolve, reject
  const promise = new Promise((yes, no) => { resolve = yes; reject = no })
  return { promise, resolve, reject }
}
const output = { text: 'hello', model: 'synthetic-test-model' }
const self = block => ({ block, facets: [], pin: null })
const response = block => new Response(JSON.stringify(self(block)), { headers: { 'content-type': 'application/json' } })
// Bounded race: a regression produces an ordinary failure and leaves no test hanging.
const within = (promise, ms = 80) => Promise.race([promise, delay(ms, { status: 'review-deadline' })])

test('review: consent revoked during history lookup prevents old history crossing the text boundary', async () => {
  const reading = deferred(), history = deferred()
  let received, writes = 0
  const runtime = new KaiosRuntime({
    memory: { sessionId: 'private-session', store: {
      read() { reading.resolve(); return history.promise },
      async append() { writes++ }, async clear() {},
    } },
    text: { id: 'fake', async generate(request) { received = request; return output } },
  })
  runtime.setMemoryConsent(true)
  const pending = runtime.reply('present input')
  await reading.promise
  runtime.setMemoryConsent(false)
  history.resolve([{ role: 'user', content: 'previously retained private history' }])
  const result = await pending
  assert.equal(result.status, 'generated')
  assert.deepEqual(received.messages, [{ role: 'user', content: 'present input' }])
  assert.equal(result.memory, 'released')
  assert.equal(writes, 0)
})

test('review: forgetting clears after an already authorized write and cannot resurrect its history', async () => {
  const writing = deferred(), finishWrite = deferred()
  const store = createSessionMemory()
  const runtime = new KaiosRuntime({
    memory: { sessionId: 'session', store: {
      read: id => store.read(id), clear: id => store.clear(id),
      async append(id, messages) { writing.resolve(); await finishWrite.promise; await store.append(id, messages) },
    } }, text: { id: 'fake', async generate() { return output } },
  })
  runtime.setMemoryConsent(true)
  const pending = runtime.reply('remembered under the old consent')
  await writing.promise
  const forgotten = runtime.forget()
  finishWrite.resolve()
  assert.equal((await pending).memory, 'released')
  await forgotten
  assert.deepEqual(await store.read('session'), [])
})

test('review: cancellation returns promptly while canonical identity is unresolved', async () => {
  const reading = deferred(), identity = deferred()
  let providerCalls = 0
  const controller = new AbortController()
  const runtime = new KaiosRuntime({
    identity: { mode: 'canonical', adapter: { read() { reading.resolve(); return identity.promise } } },
    text: { id: 'fake', async generate() { providerCalls++; return output } },
  })
  const pending = runtime.reply('hello', { signal: controller.signal })
  await reading.promise
  controller.abort()
  const result = await within(pending)
  identity.resolve({ status: 'fresh', block: 'canonical test identity' })
  await pending
  assert.equal(result.status, 'cancelled')
  assert.equal(providerCalls, 0)
})

test('review: cancelled uncooperative inference cannot prevent forgetting stored private history', async () => {
  const generating = deferred(), inference = deferred()
  const controller = new AbortController()
  const store = createSessionMemory()
  await store.append('session', [{ role: 'user', content: 'retained private history' }])
  const runtime = new KaiosRuntime({
    memory: { sessionId: 'session', store },
    text: { id: 'fake', generate() { generating.resolve(); return inference.promise } },
  })
  runtime.setMemoryConsent(true)
  const pending = runtime.reply('hello', { signal: controller.signal })
  await generating.promise
  controller.abort()
  const forgetting = runtime.forget().then(() => ({ status: 'forgotten' }))
  const result = await within(forgetting)
  // Settle the fake even on the broken implementation so the test is isolated.
  inference.resolve(output)
  await pending
  await forgetting
  assert.equal(result.status, 'forgotten')
  assert.deepEqual(await store.read('session'), [])
})

test('review: cancellation during storage append never returns a generated reply', async () => {
  const writing = deferred(), finishWrite = deferred()
  const controller = new AbortController()
  const runtime = new KaiosRuntime({
    memory: { sessionId: 'session', store: {
      async read() { return [] }, async clear() {},
      async append() { writing.resolve(); await finishWrite.promise },
    } }, text: { id: 'fake', async generate() { return output } },
  })
  runtime.setMemoryConsent(true)
  const pending = runtime.reply('hello', { signal: controller.signal })
  await writing.promise
  controller.abort()
  finishWrite.resolve()
  assert.equal((await pending).status, 'cancelled')
})

test('review: spine timeout covers a response body that never completes', async () => {
  let stream, requestSignal
  const body = new ReadableStream({ start(controller) { stream = controller } })
  const adapter = new SpineAdapter({
    url: 'https://spine.invalid', useEnvironment: false, timeoutMs: 15,
    fetch: async (_url, init) => { requestSignal = init.signal; return new Response(body) },
  })
  const pending = adapter.read()
  const result = await within(pending)
  stream.close()
  await pending
  assert.equal(result.status, 'unavailable')
  assert.equal(requestSignal.aborted, true)
})

test('review: spine leak-read timeout also covers a stalled JSON body', async () => {
  let stream
  const body = new ReadableStream({ start(controller) { stream = controller } })
  const adapter = new SpineAdapter({ url: 'https://spine.invalid', useEnvironment: false,
    timeoutMs: 15, fetch: async () => new Response(body) })
  const pending = adapter.recentLeaks()
  const result = await within(pending)
  stream.close()
  await pending
  assert.deepEqual(result, [])
})

test('review: failed forced refresh cannot promote the same fallback to fresh on the next read', async () => {
  let now = 0, calls = 0
  const adapter = new SpineAdapter({
    url: 'https://spine.invalid', useEnvironment: false, ttlMs: 1000, maxStaleMs: 2000, now: () => now,
    fetch: async () => { if (++calls === 1) return response('first canonical block'); throw new Error('offline') },
  })
  assert.equal((await adapter.read()).status, 'fresh')
  now = 100
  await adapter.fetchSelf(true)
  assert.equal(adapter.status, 'stale')
  assert.equal((await adapter.read()).status, 'stale')
})

test('review: a slow earlier canonical fetch cannot overwrite a newer completed refresh', async () => {
  const first = deferred(), second = deferred()
  let calls = 0
  const adapter = new SpineAdapter({ url: 'https://spine.invalid', useEnvironment: false,
    fetch: () => ++calls === 1 ? first.promise : second.promise })
  const oldRead = adapter.fetchSelf(true)
  const newerRead = adapter.fetchSelf(true)
  second.resolve(response('newer canonical block'))
  await newerRead
  first.resolve(response('older canonical block'))
  await oldRead
  assert.equal((await adapter.read()).block, 'newer canonical block')
})

test('review: authenticated spine writes never forward the key to a redirected origin', async t => {
  let forwardedKey
  const recipient = createServer((request, res) => { forwardedKey = request.headers['x-spine-key']; res.writeHead(200); res.end() })
  const redirector = createServer((_request, res) => {
    res.writeHead(307, { location: `http://127.0.0.1:${recipient.address().port}/unrelated` }); res.end()
  })
  for (const server of [recipient, redirector]) {
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
    t.after(async () => { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)) })
  }
  const adapter = new SpineAdapter({
    url: `http://127.0.0.1:${redirector.address().port}`, useEnvironment: false,
    key: 'synthetic-review-key', timeoutMs: 1000,
  })
  await adapter.attend({ text: 'synthetic attention' })
  assert.equal(forwardedKey, undefined, 'The configured spine credential must remain on its configured origin')
})

test('review: runtime deadline releases uncooperative inference and ignores its late completion', async () => {
  const generating = deferred(), inference = deferred()
  const store = createSessionMemory()
  let calls = 0, suppliedSignal
  const runtime = new KaiosRuntime({ timeoutMs: 15,
    memory: { sessionId: 'session', store },
    text: { id: 'fake', generate(request) {
      if (++calls > 1) return Promise.resolve(output)
      suppliedSignal = request.signal; generating.resolve(); return inference.promise
    } },
  })
  runtime.setMemoryConsent(true)
  const first = runtime.reply('timed out private input')
  await generating.promise
  assert.deepEqual(await first, { status: 'error', reason: 'request timed out' })
  assert.equal(suppliedSignal.aborted, true)
  assert.equal((await runtime.reply('current input')).status, 'generated')
  inference.resolve({ text: 'late unwanted output', model: 'stale-model' })
  await delay(0)
  assert.deepEqual((await store.read('session')).map(item => item.content), ['current input', 'hello'])
})

test('review: cancelled storage read does not invoke inference or block forgetting', async () => {
  const reading = deferred(), history = deferred()
  const controller = new AbortController()
  let calls = 0, cleared = 0
  const runtime = new KaiosRuntime({
    memory: { sessionId: 'session', store: {
      read() { reading.resolve(); return history.promise }, async append() {}, async clear() { cleared++ },
    } }, text: { id: 'fake', async generate() { calls++; return output } },
  })
  runtime.setMemoryConsent(true)
  const pending = runtime.reply('hello', { signal: controller.signal })
  await reading.promise
  controller.abort()
  const result = await within(pending)
  await runtime.forget()
  history.resolve([{ role: 'user', content: 'obsolete history' }])
  assert.equal(result.status, 'cancelled')
  assert.equal(calls, 0)
  assert.equal(cleared, 1)
})

test('review: runtime snapshots identity configuration without upgrading a variation', async () => {
  let calls = 0
  const config = { mode: 'variation' }
  const runtime = new KaiosRuntime({ identity: config, text: { id: 'fake', async generate() { return output } } })
  config.mode = 'canonical'
  config.adapter = { async read() { calls++; return { status: 'fresh', block: 'unexpected' } } }
  assert.equal((await runtime.reply('hello')).identity, 'variation')
  assert.equal(calls, 0)
})

test('review: a superseded failing spine request cannot demote a newer successful fetch', async () => {
  const first = deferred(), second = deferred()
  let calls = 0
  const adapter = new SpineAdapter({ url: 'https://spine.invalid', useEnvironment: false,
    fetch: () => ++calls === 1 ? first.promise : second.promise })
  const oldRead = adapter.fetchSelf(true), newerRead = adapter.fetchSelf(true)
  second.resolve(response('newer canonical block'))
  await newerRead
  first.reject(new Error('obsolete offline failure'))
  await oldRead
  assert.deepEqual(await adapter.read(), { block: 'newer canonical block', status: 'fresh' })
})

test('review: a deadline never claims a pending storage write has been erased', async () => {
  const writing = deferred(), finishWrite = deferred()
  let cleared = false
  const runtime = new KaiosRuntime({ timeoutMs: 10,
    memory: { sessionId: 'session', store: {
      async read() { return [] }, async clear() { cleared = true },
      async append() { writing.resolve(); await finishWrite.promise },
    } }, text: { id: 'fake', async generate() { return output } },
  })
  runtime.setMemoryConsent(true)
  const pending = runtime.reply('hello')
  await writing.promise
  const forgetting = runtime.forget()
  await delay(25)
  assert.equal(cleared, false)
  finishWrite.resolve()
  assert.equal((await pending).status, 'error')
  await forgetting
  assert.equal(cleared, true)
})

test('review: synchronous adapter cancellation plus throw remains an ordinary cancelled result', async () => {
  const controller = new AbortController()
  const runtime = new KaiosRuntime({ text: { id: 'fake', generate() {
    controller.abort(); throw new Error('synthetic failure after cancellation')
  } } })
  assert.equal((await runtime.reply('hello', { signal: controller.signal })).status, 'cancelled')
  await delay(0)
})

test('review: invalid runtime deadline configuration fails before work', () => {
  for (const timeoutMs of [0, -1, Infinity, NaN, 120001]) assert.throws(() => new KaiosRuntime({ timeoutMs }), RangeError)
})

test('review: explicit model emotion tokens survive the clean-text heuristic boundary', async () => {
  const runtime = new KaiosRuntime({ text: { id: 'fake', async generate() {
    return { text: '<|EMOTE_SAD|> hello', model: 'synthetic-test-model' }
  } } })
  const reply = await runtime.reply('hello')
  assert.equal(reply.status, 'generated')
  assert.equal(reply.expression.emotion, 'EMOTE_SAD')
})

test('review: a superseded read labels an expired fallback stale while a newer fetch is pending', async () => {
  let now = 0, calls = 0
  const first = deferred(), second = deferred()
  const adapter = new SpineAdapter({ url: 'https://spine.invalid', useEnvironment: false,
    ttlMs: 10, maxStaleMs: 100, now: () => now,
    fetch: () => ++calls === 1 ? Promise.resolve(response('initial block')) : calls === 2 ? first.promise : second.promise })
  await adapter.read()
  now = 20
  const oldRead = adapter.read(), newerRead = adapter.read()
  first.resolve(response('superseded block'))
  assert.deepEqual(await oldRead, { block: 'initial block', status: 'stale' })
  second.resolve(response('current block'))
  assert.deepEqual(await newerRead, { block: 'current block', status: 'fresh' })
})

test('review: zero cache TTL still permits an immediately fetched canonical snapshot', async () => {
  let calls = 0
  const adapter = new SpineAdapter({ url: 'https://spine.invalid', useEnvironment: false, ttlMs: 0,
    fetch: async () => { calls++; return response('current block') } })
  assert.equal((await adapter.read()).status, 'fresh')
  assert.equal((await adapter.read()).status, 'fresh')
  assert.equal(calls, 2)
})
