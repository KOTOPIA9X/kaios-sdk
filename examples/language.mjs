import { parseFace, rebuildFace, transformFace, composeFaceAffect } from '@kaios/expression-sdk/kaimoji'
import { AffectBus } from '@kaios/expression-sdk/affect'

const original = '(◕‿◕)'
console.log('Exact round trip:', rebuildFace(parseFace(original)))
for (const operation of ['love', 'cry', 'cat']) {
  const expression = transformFace(original, operation)
  const affect = composeFaceAffect(expression.text)
  if (affect.status !== 'mapped') {
    console.log({expression, affect}); continue
  }
  const bus = new AffectBus({bpm: 120})
  bus.advanceTo(0, {valence: affect.valence, arousal: affect.arousal})
  const frame = bus.advanceTo(0.5)
  console.log({face: expression.text, authoredEmotion: affect.emotion, coverage: affect.coverage,
    mode: frame.state.music.mode, look: frame.state.visual.look})
}
console.log('Unknown text preserved:', transformFace('hello, world', 'cry'))
