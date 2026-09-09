import test from 'node:test'
import assert from 'node:assert/strict'
import {
  parseFace, rebuildFace, composeFace, transformFace, segmentFace, composeFaceAffect,
  FACE_OPERATIONS,
} from '../src/kaimoji/grammar.ts'

test('graphemes preserve combining marks, variation selectors, joiners and original bytes', () => {
  assert.deepEqual(segmentFace('˃̣̣̥ω˂̣̣̥'), ['˃̣̣̥', 'ω', '˂̣̣̥'])
  assert.deepEqual(segmentFace('❤️👩🏽‍🚀'), ['❤️', '👩🏽‍🚀'])
  assert.equal(segmentFace('•\u2060ω\u200B•').join(''), '•\u2060ω\u200B•')
})

test('exact reconstruction retains nested layers, unequal gaps, astral and emoji glyphs', () => {
  const fixtures = [
    '(・ω・)', '૮₍ ˶• ༝ •˶ ₎ა', '૮•ω•ෆ', '(˃̣̣̥﹏˂̣̣̥)',
    '♡(ᵔ  ᵕ\u3000ᵔ)♡', '  (•\u2060ω\u200B•)  ', '(👩🏽‍🚀ω👩🏽‍🚀)',
    '\u200B♡(•\uFE0E  ω\t•\uFE0E)♡\u2060', '(⸝⸝・ω・⸝⸝)',
    '( ᐛ )', '𐔌•ω•𐦯', '⩌⩌', "⌯'Ⱉ'⌯",
  ]
  for (const text of fixtures) {
    const parsed = parseFace(text)
    assert.equal(parsed.ok, true, `supported fixture: ${text}`)
    assert.equal(rebuildFace(parsed), text)
    assert.equal(parsed.face, text)
  }
})

test('symmetric peeling stops at eyes and records independent whitespace', () => {
  const parsed = parseFace('♡( ᵔ  ᵕ\tᵔ )♡')
  assert.equal(parsed.eyeL, 'ᵔ')
  assert.equal(parsed.eyeR, 'ᵔ')
  assert.equal(parsed.mouth, 'ᵕ')
  assert.deepEqual(parsed.spacing, {beforeMouth: '  ', afterMouth: '\t'})
  assert.equal(parsed.armL, '♡')
  assert.equal(parsed.armR, '♡')
  assert.equal(parsed.layers[0].gapL, ' ')
  assert.equal(parsed.layers[0].gapR, ' ')
  const nested = parseFace('૮₍ ˶• ༝ •˶ ₎ა')
  assert.deepEqual(nested.layers.map(layer => layer.l + layer.r), ['૮ა', '₍₎', '˶˶'])
})

test('unsupported and malformed text stays exact through every operator', () => {
  for (const text of ['just some words', '', '()', '(・ω・]', '(・ω・', '•ω•)', '(⚬╳╳○)', 'hello\nworld', 'a'.repeat(4097)]) {
    const parsed = parseFace(text)
    assert.equal(parsed.ok, false, text)
    assert.equal(rebuildFace(parsed), text)
    for (const operation of FACE_OPERATIONS) {
      const result = transformFace(text, operation)
      assert.equal(result.text, text)
      assert.equal(result.changed, false)
      assert.equal(typeof result.reason, 'string')
    }
  }
})

test('composition accepts explicit slots without normalization', () => {
  assert.equal(composeFace({eyeL: '•', mouth: 'ω', eyeR: '•'}), '(•ω•)')
  assert.equal(composeFace({eyeL: '•\uFE0E', mouth: 'ω', eyeR: '•\uFE0E', space: '\t', bracket: ['૮', 'ෆ'], prefix: '♡', suffix: '✧'}), '♡૮•\uFE0E\tω\t•\uFE0Eෆ✧')
  assert.equal(composeFace({eyeL: '˃̣̣̥', mouth: '﹏', eyeR: '˂̣̣̥', bracket: ['', '']}), '˃̣̣̥﹏˂̣̣̥')
})

test('slot edits preserve untouched emoji, combining marks, frames and gaps', () => {
  const text = '♡( 👩🏽‍🚀  ω\t👩🏽‍🚀 )♡'
  const parsed = parseFace(text)
  assert.equal(rebuildFace(parsed, {mouth: 'ᵕ'}), '♡( 👩🏽‍🚀  ᵕ\t👩🏽‍🚀 )♡')
  assert.equal(rebuildFace(parsed), text)
  assert.equal(transformFace('(・ω・)', 'cry').text, '(˃̣̣̥ω˂̣̣̥)')
  assert.equal(transformFace('♡( ・  ω\t・ )♡', 'cry').text, '♡( ˃̣̣̥  ω\t˂̣̣̥ )♡')
})

test('operators are deterministic and repeated decoration does not accumulate', () => {
  for (const operation of FACE_OPERATIONS) {
    const first = transformFace('(・-・)', operation)
    assert.equal(first.changed, true, operation)
    assert.deepEqual(transformFace('(・-・)', operation), first)
    const second = transformFace(first.text, operation)
    assert.equal(second.text, first.text, operation)
    assert.equal(second.changed, false, operation)
  }
  assert.equal(transformFace('(・-・)', 'cat').text, '૮・ω・ა')
  assert.equal(transformFace('(・-・)', 'blush').text, '(⸝⸝・-・⸝⸝)')
  assert.equal(transformFace('(・-・)', 'sparkle').text, '✧(・-・)✧')
})

test('authored affect reports mapped part coverage and leaves unknown meaning unknown', () => {
  const mapped = composeFaceAffect('(ᵔωᵔ)')
  assert.equal(mapped.status, 'mapped')
  assert.equal(mapped.coverage, 'eyes-and-mouth')
  assert.equal(mapped.method, 'authored-parts-v1')
  assert.ok(mapped.valence > 0)
  assert.ok(mapped.arousal >= 0 && mapped.arousal <= 1)
  assert.equal(composeFaceAffect('(˃̣̣̥﹏˂̣̣̥)').emotion, 'sad')
  assert.equal(composeFaceAffect('(˃̣̣̥ω˂̣̣̥)').emotion, 'pleading')
  assert.equal(composeFaceAffect('(♡ω♡)').emotion, 'love')
  assert.equal(composeFaceAffect('(⚬⌁⚬)').status, 'unmapped')
  assert.equal(composeFaceAffect('plain text').status, 'unmapped')
  assert.equal(composeFaceAffect('(⚬ω⚬)').coverage, 'mouth')
  assert.equal(composeFaceAffect('(•̀‸•́)').emotion, 'angry')
})

test('sparkle is idempotent when an unframed wrapper is parsed as layers or eyes', () => {
  for (const text of ['⩌⩌', 'ω', '˃̣̣̥ω˂̣̣̥', '  ω  ']) {
    const once = transformFace(text, 'sparkle')
    assert.equal(once.text, `✧${text}✧`)
    assert.equal(once.changed, true)
    const twice = transformFace(once.text, 'sparkle')
    assert.equal(twice.text, once.text)
    assert.equal(twice.changed, false)
  }
})

test('invalid arguments fail explicitly; parse results cannot mutate original inputs', () => {
  assert.throws(() => parseFace(null), TypeError)
  assert.throws(() => segmentFace(42), TypeError)
  assert.throws(() => transformFace('(・ω・)', 'invented'), TypeError)
  assert.throws(() => composeFace({eyeL: 7, mouth: 'ω', eyeR: '•'}), TypeError)
  assert.throws(() => composeFace({eyeL: '•', mouth: 'ω', eyeR: '•', bracket: ['(']}), TypeError)
  assert.throws(() => composeFace({eyeL: '•', mouth: 'ω', eyeR: '•', bracket: [, ')']}), TypeError)
  assert.throws(() => rebuildFace(parseFace('(・ω・)'), {mouth: 123}), TypeError)
  assert.throws(() => rebuildFace(parseFace('(・ω・)'), {addFlank: Array(2)}), TypeError)
  assert.equal(parseFace('\ud800').ok, false)
  assert.equal(rebuildFace(parseFace('\ud800')), '\ud800')
  assert.equal(Object.isFrozen(FACE_OPERATIONS), true)
})
