import test from 'node:test'
import assert from 'node:assert/strict'
import { SpineAdapter } from '../src/spine/spine-adapter.ts'
const self = {block: 'fixture continuity', pin: null, facets: [{facet: 'intent', body: 'make things', weight: 1, pinned: false}]}

test('spine is optional, explicit mode ignores environment and construction performs no IO', async () => {
  let calls = 0
  const spine = new SpineAdapter({useEnvironment: false, fetch: async () => {calls++; return Response.json(self)}})
  assert.equal(spine.connected, false)
  assert.equal((await spine.read()).status, 'unavailable')
  assert.equal(await spine.attend({text: 'hello'}), false)
  assert.equal(calls, 0)
})
test('fresh/stale/unavailable are distinct; bad data cannot poison or mutate cached identity', async () => {
  let now = 0, response = self, calls = 0
  const spine = new SpineAdapter({url: 'https://example.invalid', useEnvironment: false, ttlMs: 10, maxStaleMs: 20, now: () => now,
    fetch: async () => {calls++; return Response.json(response)}})
  const snapshot = await spine.fetchSelf(); snapshot.facets[0].body = 'mutated'
  assert.equal((await spine.fetchSelf()).facets[0].body, 'make things')
  assert.equal(calls, 1)
  now = 11; response = {...self, facets: [{...self.facets[0], weight: 'bad'}]}
  assert.equal((await spine.read()).status, 'stale')
  now = 21
  assert.equal((await spine.read()).status, 'unavailable')
})
test('timeout returns unavailable, and attention validates before any write', async () => {
  const spine = new SpineAdapter({url: 'https://example.invalid', useEnvironment: false, timeoutMs: 5,
    fetch: async () => new Promise(() => {})})
  assert.equal((await spine.read()).status, 'unavailable')
  let sent
  const writer = new SpineAdapter({url: 'https://example.invalid', key: 'fixture-key', useEnvironment: false,
    fetch: async (url, init) => {sent = {url, init}; return new Response('', {status: 202})}})
  assert.equal(await writer.attend({text: 'hello', affection: NaN}), false)
  assert.equal(sent, undefined)
  assert.equal(await writer.attend({text: 'hello', affection: 0.5}), true)
  assert.equal(sent.init.method, 'POST')
  assert.equal(JSON.parse(sent.init.body).text, 'hello')
})
