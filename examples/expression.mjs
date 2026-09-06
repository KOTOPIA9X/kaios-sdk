import { createKaios, createSessionMemory } from '@kaios/expression-sdk/runtime'
import { getAllKaimoji } from '@kaios/expression-sdk/kaimoji'

const offline = createKaios()
console.log('KAIOS · offline expression')
console.log(offline.express('hello', 'EMOTE_HAPPY'))
console.log(`${getAllKaimoji().length} bundled expressions`)
console.log(await offline.reply('hello'))

// A deterministic fixture proves the integration without calling a model.
const store = createSessionMemory()
const fixture = createKaios({
  text: {id: 'example-fixture', async generate() { return {text: 'a little room for a new idea (◕‿◕)', model: 'scripted-example'} }},
  memory: {store, sessionId: 'example'},
})
fixture.setMemoryConsent(true)
console.log(await fixture.reply('let us make something'))
await fixture.forget()
console.log('History after release:', await store.read('example'))
