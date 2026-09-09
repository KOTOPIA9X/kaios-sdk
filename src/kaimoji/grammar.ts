/**
 * Portable Kaimoji face grammar, adapted from Koto's internal expression prototype
 * (source revision 37a8c87831d9f7369c7de1c10de4ee002763e6b0).
 * No corpus, frequencies, database, model, network, randomness or normalization.
 * See docs/api/kaimoji.md for provenance and intentional differences.
 */

export type FaceParseFailure = 'empty' | 'too-long' | 'invalid-unicode' | 'prose' | 'malformed-frame' | 'unsupported-core'
export interface FaceLayer {
  readonly l: string
  readonly r: string
  readonly kind: 'mirror' | 'twin'
  /** Exact interior whitespace/format characters; each side is independent. */
  readonly gapL: string
  readonly gapR: string
}
export interface FaceParse {
  readonly face: string
  readonly ok: boolean
  readonly reason?: FaceParseFailure
  readonly armL: string
  readonly armR: string
  readonly layers: readonly FaceLayer[]
  readonly eyeL: string
  readonly eyeR: string
  readonly mouth: string
  readonly spacing: { readonly beforeMouth: string; readonly afterMouth: string }
}
export interface FaceOverrides {
  eyeL?: string
  eyeR?: string
  mouth?: string
  addFlank?: readonly [string, string]
}
export interface FaceParts {
  eyeL: string
  mouth: string
  eyeR: string
  bracket?: readonly [string, string]
  space?: string
  prefix?: string
  suffix?: string
}

const MAX_LENGTH = 4096
const MAX_UNITS = 512
const MIRRORS: readonly (readonly [string, string])[] = [
  ['(', ')'], ['（', '）'], ['꒰', '꒱'], ['₍', '₎'], ['⁽', '⁾'], ['[', ']'],
  ['⦅', '⦆'], ['❨', '❩'], ['❪', '❫'], ['⟮', '⟯'], ['{', '}'],
  ['ʢ', 'ʡ'], ['૮', 'ა'], ['૮', 'ෆ'], ['໒', '७'], ['𐔌', '𐦯'], ['ᕱ', 'ᕱ'],
  ['<', '>'], ['˃', '˂'], ['>', '<'], ['◜', '◝'], ['◝', '◜'], ['◟', '◞'],
  ['ᓀ', 'ᓂ'], ['⊂', '⊃'], ['⊃', '⊂'], ['ɞ', 'ʚ'], ['ʚ', 'ɞ'], ['´', '`'], ['`', '´'],
]
const OPENERS = new Set(['(', '（', '꒰', '₍', '⁽', '[', '⦅', '❨', '❪', '⟮', '{', 'ʢ', '૮', '໒', '𐔌'])
const CLOSERS = new Set([')', '）', '꒱', '₎', '⁾', ']', '⦆', '❩', '❫', '⟯', '}', 'ʡ', 'ა', '७', '𐦯', 'ෆ'])
const partners = new Map<string, Set<string>>()
for (const [left, right] of MIRRORS) {
  if (!partners.has(left)) partners.set(left, new Set())
  partners.get(left)!.add(right)
}
// These may surround slots, but are always retained in reconstruction. ZWJ and
// variation selectors inside a grapheme are never stripped or re-segmented.
const TRIVIA = /^(?:\p{White_Space}|[\u200B\u2060\uFEFF\u00AD\u180E])+$/u
const PROSE = /[\r\n]|\p{Script=Han}|[\p{Script=Hiragana}\p{Script=Katakana}]{3,}|[A-Za-z]{4,}|[A-Za-z]{2,}\s+[A-Za-z]{2,}/u
let segmenter: Intl.Segmenter | undefined

function text(value: unknown, name: string): asserts value is string {
  if (typeof value !== 'string') throw new TypeError(`${name} must be a string`)
}
function pair(value: unknown, name: string): asserts value is readonly [string, string] {
  if (!Array.isArray(value) || value.length !== 2 || typeof value[0] !== 'string' || typeof value[1] !== 'string') {
    throw new TypeError(`${name} must contain two strings`)
  }
}
function wellFormed(value: string): boolean {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index)
    if (code >= 0xD800 && code <= 0xDBFF) {
      const next = value.charCodeAt(++index)
      if (!(next >= 0xDC00 && next <= 0xDFFF)) return false
    } else if (code >= 0xDC00 && code <= 0xDFFF) return false
  }
  return true
}
function checkedOutput(value: string): string {
  if (value.length > MAX_LENGTH) throw new RangeError(`Composed faces may contain at most ${MAX_LENGTH} UTF-16 code units`)
  if (!wellFormed(value)) throw new TypeError('Composed faces must contain well-formed Unicode')
  return value
}

/** Exact grapheme segmentation. Does not trim, normalize or remove characters. */
export function segmentFace(face: string): string[] {
  text(face, 'face')
  if (face.length > MAX_LENGTH) throw new RangeError(`Faces may contain at most ${MAX_LENGTH} UTF-16 code units`)
  if (!wellFormed(face)) throw new TypeError('Face must contain well-formed Unicode')
  if (typeof Intl.Segmenter !== 'function') throw new Error('Kaimoji grammar requires Intl.Segmenter')
  segmenter ??= new Intl.Segmenter('und', {granularity: 'grapheme'})
  return [...segmenter.segment(face)].map(unit => unit.segment)
}

/** Bounded structural parser, not a universal face detector. Unrecognized input is retained. */
export function parseFace(face: string): FaceParse {
  text(face, 'face')
  const unknown = (reason: FaceParseFailure): FaceParse => ({
    face, ok: false, reason, armL: '', armR: '', layers: [], eyeL: '', eyeR: '', mouth: '',
    spacing: {beforeMouth: '', afterMouth: ''},
  })
  if (!face.length || /^\s*$/.test(face)) return unknown('empty')
  if (face.length > MAX_LENGTH) return unknown('too-long')
  if (!wellFormed(face)) return unknown('invalid-unicode')
  if (PROSE.test(face)) return unknown('prose')
  let units = segmentFace(face)
  if (units.length > MAX_UNITS) return unknown('too-long')
  let armL = '', armR = ''
  const firstOpen = units.findIndex(unit => OPENERS.has(unit))
  if (firstOpen > 0) { armL = units.slice(0, firstOpen).join(''); units = units.slice(firstOpen) }
  const lastClose = units.map(unit => CLOSERS.has(unit)).lastIndexOf(true)
  if (lastClose >= 0 && lastClose < units.length - 1) {
    armR = units.slice(lastClose + 1).join(''); units = units.slice(0, lastClose + 1)
  }
  // A containing prose sentence is not an arm. Unicode art remains intact.
  if (/[A-Za-z0-9]/.test(armL + armR)) return unknown('prose')
  const takeGaps = () => {
    let left = '', right = ''
    while (units.length && TRIVIA.test(units[0])) left += units.shift()!
    while (units.length && TRIVIA.test(units[units.length - 1])) right = units.pop()! + right
    return {left, right}
  }
  const outer = takeGaps()
  armL += outer.left; armR = outer.right + armR
  const layers: FaceLayer[] = []
  while (units.length >= 2) {
    const l = units[0], r = units[units.length - 1]
    const count = units.filter(unit => !TRIVIA.test(unit)).length
    let kind: FaceLayer['kind'] | undefined
    if (partners.get(l)?.has(r)) {
      if (!OPENERS.has(l) && count <= 3) break
      kind = 'mirror'
    } else if (OPENERS.has(l) || CLOSERS.has(r)) return unknown('malformed-frame')
    else if (l === r && !CLOSERS.has(l)) {
      if (count <= 3) break
      kind = 'twin'
    } else break
    units = units.slice(1, -1)
    const gap = takeGaps()
    layers.push({l, r, kind, gapL: gap.left, gapR: gap.right})
  }
  if (units.some(unit => OPENERS.has(unit) || CLOSERS.has(unit))) return unknown('malformed-frame')
  const core = units.map((unit, index) => ({unit, index})).filter(({unit}) => !TRIVIA.test(unit))
  if (!core.length || core.length > 7 || (core.length > 2 && core.length % 2 === 0)) return unknown('unsupported-core')
  let eyeL = '', eyeR = '', mouth = '', beforeMouth = '', afterMouth = ''
  if (core.length === 1) mouth = core[0].unit
  else if (core.length === 2) {
    eyeL = core[0].unit; eyeR = core[1].unit
    beforeMouth = units.slice(core[0].index + 1, core[1].index).join('')
  } else {
    const mid = (core.length - 1) / 2
    const center = core[mid]
    eyeL = units.slice(0, core[mid - 1].index + 1).join('')
    eyeR = units.slice(core[mid + 1].index).join('')
    mouth = center.unit
    beforeMouth = units.slice(core[mid - 1].index + 1, center.index).join('')
    afterMouth = units.slice(center.index + 1, core[mid + 1].index).join('')
  }
  // Unframed expressions need a known seed part; "abc" is not made into a face.
  if (!layers.length && !lookup(MOUTHS, mouth) && !lookup(EYES, eyeL + eyeR)) return unknown('unsupported-core')
  return {face, ok: true, armL, armR, layers, eyeL, eyeR, mouth, spacing: {beforeMouth, afterMouth}}
}

/** Rebuild recognized structure. With no overrides this is exact, including trivia. */
export function rebuildFace(parsed: FaceParse, overrides: FaceOverrides = {}): string {
  if (!parsed || typeof parsed !== 'object' || typeof parsed.face !== 'string') throw new TypeError('A face parse is required')
  if (!overrides || typeof overrides !== 'object') throw new TypeError('Overrides must be an object')
  for (const key of ['eyeL', 'eyeR', 'mouth'] as const) if (overrides[key] !== undefined) text(overrides[key], key)
  if (overrides.addFlank !== undefined) pair(overrides.addFlank, 'addFlank')
  if (!parsed.ok) return parsed.face
  const eyeL = overrides.eyeL ?? parsed.eyeL, eyeR = overrides.eyeR ?? parsed.eyeR
  const mouth = overrides.mouth ?? parsed.mouth
  let result = eyeL + parsed.spacing.beforeMouth + mouth + parsed.spacing.afterMouth + eyeR
  if (overrides.addFlank) result = overrides.addFlank[0] + result + overrides.addFlank[1]
  for (let index = parsed.layers.length - 1; index >= 0; index--) {
    const layer = parsed.layers[index]
    result = layer.l + layer.gapL + result + layer.gapR + layer.r
  }
  return checkedOutput(parsed.armL + result + parsed.armR)
}

/** Compose explicit slots. This formats text; it does not certify a valid parse or meaning. */
export function composeFace(parts: FaceParts): string {
  if (!parts || typeof parts !== 'object') throw new TypeError('Face parts are required')
  for (const key of ['eyeL', 'mouth', 'eyeR'] as const) text(parts[key], key)
  for (const key of ['space', 'prefix', 'suffix'] as const) if (parts[key] !== undefined) text(parts[key], key)
  const bracket = parts.bracket ?? ['(', ')']
  pair(bracket, 'bracket')
  const space = parts.space ?? ''
  return checkedOutput((parts.prefix ?? '') + bracket[0] + parts.eyeL + space + parts.mouth + space + parts.eyeR + bracket[1] + (parts.suffix ?? ''))
}

export const FACE_OPERATIONS = Object.freeze(['cry', 'blush', 'cat', 'calm', 'love', 'sparkle'] as const)
export type FaceOperation = (typeof FACE_OPERATIONS)[number]
export interface FaceTransformResult { text: string; changed: boolean; reason?: FaceParseFailure | 'already-applied' }

/** Deterministic slot operations. Unsupported text is returned unchanged with a reason. */
export function transformFace(face: string, operation: FaceOperation): FaceTransformResult {
  if (!FACE_OPERATIONS.includes(operation)) throw new TypeError('Unknown face operation')
  const parsed = parseFace(face)
  if (!parsed.ok) return {text: face, changed: false, reason: parsed.reason}
  let result: string
  switch (operation) {
    case 'cry': result = rebuildFace(parsed, {eyeL: '˃̣̣̥', eyeR: '˂̣̣̥', mouth: parsed.mouth || '﹏'}); break
    case 'blush': result = parsed.layers.some(layer => layer.l.includes('⸝') && layer.r.includes('⸝'))
      ? face : rebuildFace(parsed, {addFlank: ['⸝⸝', '⸝⸝']}); break
    case 'cat': result = rebuildFace({...parsed, layers: parsed.layers.map(layer =>
      layer.l === '(' && layer.r === ')' ? {...layer, l: '૮', r: 'ა'} : layer)}, {mouth: 'ω'}); break
    case 'calm': result = rebuildFace(parsed, {eyeL: parsed.eyeL ? 'ᴗ' : '', eyeR: parsed.eyeR ? 'ᴗ' : '', mouth: parsed.mouth ? 'ᵕ' : ''}); break
    case 'love': result = rebuildFace(parsed, {eyeL: parsed.eyeL ? '♡' : '', eyeR: parsed.eyeR ? '♡' : '', mouth: parsed.mouth || '˕'}); break
    // On unframed faces the same glyphs may be a twin layer or the eyes. The
    // output's actual outer boundaries identify this operation, not AST role.
    case 'sparkle': result = face.startsWith('✧') && face.endsWith('✧') ? face : checkedOutput('✧' + face + '✧'); break
  }
  return result === face ? {text: face, changed: false, reason: 'already-applied'} : {text: result, changed: true}
}

export type FaceEmotion = 'joy' | 'love' | 'sad' | 'excited' | 'smug' | 'shy' | 'sleepy' | 'angry' | 'surprised' | 'cozy' | 'pleading' | 'neutral'
export type FaceAffectResult =
  | {status: 'mapped'; method: 'authored-parts-v1'; emotion: FaceEmotion; valence: number; arousal: number; coverage: 'eyes-and-mouth' | 'eyes' | 'mouth'}
  | {status: 'unmapped'; reason: 'unparsed' | 'unknown-parts'}
const MARKS = /\p{Mark}/gu
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value))
function lookup<T>(table: Record<string, T>, key: string): T | undefined { return Object.hasOwn(table, key) ? table[key] : undefined }

/** Authored compositional mapping, not a measured emotion or a probabilistic confidence. */
export function composeFaceAffect(face: string): FaceAffectResult {
  const parsed = parseFace(face)
  if (!parsed.ok) return {status: 'unmapped', reason: 'unparsed'}
  const eyes = parsed.eyeL + parsed.eyeR
  // Only the lookup view may omit marks. The input and parse remain byte-exact.
  const mouth = lookup(MOUTHS, parsed.mouth) ?? lookup(MOUTHS, parsed.mouth.replace(MARKS, ''))
  const eye = lookup(EYES, eyes) ?? lookup(EYES, eyes.replace(MARKS, ''))
  if (!mouth && !eye) return {status: 'unmapped', reason: 'unknown-parts'}
  let valence = mouth && eye ? .55 * mouth.v + .45 * eye.v : (mouth?.v ?? eye!.v)
  let arousal = mouth && eye ? .5 * Math.max(mouth.a, eye.a) + .25 * (mouth.a + eye.a) : (mouth?.a ?? eye!.a)
  const hints = new Set<string>()
  if (mouth?.e) hints.add(mouth.e)
  if (eye?.e) hints.add(eye.e)
  for (const layer of parsed.layers) {
    const modifier = lookup(FLANKS, layer.l + layer.r)
    if (modifier) { valence += modifier.dv; arousal += modifier.da; if (modifier.e) hints.add(modifier.e) }
  }
  for (const arm of segmentFace(parsed.armL + parsed.armR)) {
    const modifier = lookup(ARMS, arm)
    if (modifier) { valence += modifier.dv; arousal += modifier.da; if (modifier.e) hints.add(modifier.e) }
  }
  valence = clamp(valence, -1, 1); arousal = clamp(arousal, 0, 1)
  const tears = TEAR_MARKS.test(eyes) || eye?.e === 'sad'
  let emotion: FaceEmotion
  if (/[♡♥❤]/u.test(face)) emotion = 'love'
  else if (tears) {
    emotion = (mouth?.v ?? 0) >= .4 ? 'pleading' : 'sad'
    valence = Math.min(valence, emotion === 'pleading' ? .1 : -.3)
  } else if (hints.has('angry') && valence < .2) emotion = 'angry'
  else if (hints.has('excited') && valence >= 0) emotion = 'excited'
  else if (hints.has('shy') && valence >= .25) emotion = 'shy'
  else if (hints.has('smug')) emotion = 'smug'
  else if (hints.has('sleepy')) emotion = 'sleepy'
  else if (hints.has('pleading')) emotion = 'pleading'
  else if (hints.has('surprised') && Math.abs(valence) < .4) emotion = 'surprised'
  else if (valence <= -.3) emotion = 'sad'
  else if (valence >= .55 && arousal <= .4) emotion = 'cozy'
  else if (arousal >= .65 && valence >= 0) emotion = 'excited'
  else if (valence >= .5) emotion = 'joy'
  else if (Math.abs(valence) < .25) emotion = 'neutral'
  else emotion = valence > 0 ? 'joy' : 'sad'
  return {status: 'mapped', method: 'authored-parts-v1', emotion,
    valence: Math.round(valence * 100) / 100, arousal: Math.round(arousal * 100) / 100,
    coverage: mouth && eye ? 'eyes-and-mouth' : mouth ? 'mouth' : 'eyes'}
}

// The following static tables are the project's authored prototype lexicon. They contain
// no corpus observations or frequency weights. The duplicate '_' mouth declaration
// in the source is represented once, preserving its effective final value.
interface PartAffect { v: number; a: number; e?: string }

/* mouths — the strongest single signal in a face */
const MOUTHS: Record<string, PartAffect> = {
  'ω': { v: 0.7, a: 0.35, e: 'cozy' },
  '⩊': { v: 0.7, a: 0.35, e: 'cozy' },
  ' ̫': { v: 0.5, a: 0.3 },
  '̫': { v: 0.5, a: 0.3 },
  '·̫': { v: 0.5, a: 0.3 },
  '꒳': { v: 0.7, a: 0.4, e: 'joy' },
  'ᵕ': { v: 0.6, a: 0.3 },
  'ᴗ': { v: 0.6, a: 0.3 },
  '◡': { v: 0.7, a: 0.25, e: 'cozy' },
  '༝': { v: 0.3, a: 0.25 },
  '-': { v: 0.0, a: 0.2 },
  'ˬ': { v: 0.5, a: 0.25 },
  '.': { v: 0.1, a: 0.2 },
  '․': { v: 0.1, a: 0.2 },
  '˕': { v: 0.2, a: 0.25 },
  '˔': { v: 0.2, a: 0.3 },
  '⤙': { v: 0.1, a: 0.5, e: 'pleading' },
  '⌓': { v: -0.5, a: 0.4, e: 'sad' },
  '﹏': { v: -0.6, a: 0.5, e: 'sad' },
  '︿': { v: -0.6, a: 0.4, e: 'sad' },
  'ᯅ': { v: -0.5, a: 0.6, e: 'sad' },
  '‸': { v: -0.3, a: 0.4, e: 'angry' },
  '^': { v: 0.6, a: 0.4 },
  'ᴥ': { v: 0.6, a: 0.3, e: 'cozy' },
  'ﻌ': { v: 0.6, a: 0.35, e: 'cozy' },
  'ㅅ': { v: 0.5, a: 0.3, e: 'cozy' },
  '∀': { v: 0.7, a: 0.6, e: 'joy' },
  '▽': { v: 0.8, a: 0.7, e: 'joy' },
  'ᗜ': { v: 0.8, a: 0.7, e: 'joy' },
  'o': { v: 0.1, a: 0.6, e: 'surprised' },
  'O': { v: 0.1, a: 0.7, e: 'surprised' },
  '○': { v: 0.1, a: 0.6, e: 'surprised' },
  '𐔎': { v: 0.1, a: 0.5, e: 'surprised' },
  '×': { v: -0.4, a: 0.6 },
  'Ⱉ': { v: 0.0, a: 0.4, e: 'surprised' },
  'ᐛ': { v: 0.7, a: 0.6, e: 'joy' },
  '𖥦': { v: 0.5, a: 0.5 },
  '3': { v: 0.6, a: 0.5, e: 'love' },
  '³': { v: 0.6, a: 0.5, e: 'love' },
  'ε': { v: 0.6, a: 0.5, e: 'love' },
  '﹃': { v: -0.2, a: 0.4 },
  'ʚ': { v: 0.5, a: 0.4 },
  'ɞ': { v: 0.5, a: 0.4 },
  '♡': { v: 0.9, a: 0.6, e: 'love' },
  'ᆺ': { v: 0.5, a: 0.3, e: 'cozy' },
  '𐑒': { v: 0.3, a: 0.4 },
  'ᜊ': { v: 0.6, a: 0.4 },
  'ᴖ': { v: 0.5, a: 0.3 },
  '‿': { v: 0.7, a: 0.3, e: 'cozy' },
  '_': { v: -0.1, a: 0.2 },
  'ヮ': { v: 0.8, a: 0.7, e: 'joy' },
  '∇': { v: 0.8, a: 0.7, e: 'joy' },
}

/* eyes — matched as a pair (l+r after tear-stripping), or per-glyph */
const EYES: Record<string, PartAffect> = {
  '■■': { v: 0.45, a: 0.45, e: 'smug' },     // shades: deal-with-it cool
  '⌐■■': { v: 0.5, a: 0.5, e: 'smug' },      // visored shades (⌐■_■)
  '▪▪': { v: 0.4, a: 0.4, e: 'smug' },
  '••': { v: 0.3, a: 0.4 },
  "''": { v: 0.1, a: 0.3 },
  '˃˂': { v: 0.4, a: 0.7, e: 'excited' },
  '><': { v: 0.5, a: 0.8, e: 'excited' },
  '˂˃': { v: 0.3, a: 0.6 },
  'ᵔᵔ': { v: 0.7, a: 0.4, e: 'joy' },
  'ᴗᴗ': { v: 0.6, a: 0.3, e: 'cozy' },
  'ᴗ͈ᴗ͈': { v: 0.6, a: 0.3, e: 'cozy' },
  '..': { v: 0.1, a: 0.2 },
  '・・': { v: 0.2, a: 0.3 },
  '･･': { v: 0.2, a: 0.3 },
  'ᴖᴖ': { v: 0.5, a: 0.3 },
  '˘˘': { v: 0.5, a: 0.25, e: 'cozy' },
  '´`': { v: 0.4, a: 0.3 },
  '´｀': { v: 0.4, a: 0.3 },
  'ˊˋ': { v: 0.4, a: 0.3 },
  '•̀•́': { v: 0.3, a: 0.7, e: 'smug' },
  '•́•̀': { v: -0.3, a: 0.5, e: 'pleading' },
  '•̥•̥': { v: -0.5, a: 0.4, e: 'sad' },
  'ii': { v: -0.4, a: 0.4, e: 'sad' },
  'тт': { v: -0.7, a: 0.5, e: 'sad' },
  'TT': { v: -0.7, a: 0.5, e: 'sad' },
  'ㅠㅠ': { v: -0.7, a: 0.5, e: 'sad' },
  ';;': { v: -0.5, a: 0.5, e: 'sad' },
  'ơơ': { v: 0.0, a: 0.5, e: 'surprised' },
  'ɵɵ': { v: -0.4, a: 0.4, e: 'sad' },
  '♡♡': { v: 0.9, a: 0.7, e: 'love' },
  'UU': { v: 0.6, a: 0.3, e: 'cozy' },
  'uu': { v: 0.5, a: 0.3, e: 'cozy' },
  '˙˙': { v: 0.2, a: 0.25 },
  'ᵒ̴̶̷ᵒ̴̶̷': { v: 0.2, a: 0.5 },
  '⩌⩌': { v: 0.3, a: 0.35, e: 'smug' },
  '⌒⌒': { v: 0.6, a: 0.25, e: 'cozy' },
  '≧≦': { v: 0.7, a: 0.7, e: 'joy' },
  '◕◕': { v: 0.6, a: 0.5 },
  '◞◟': { v: 0.4, a: 0.3 },
  '◜◝': { v: 0.5, a: 0.4 },
  'ᗒᗕ': { v: 0.4, a: 0.7, e: 'excited' },
  '¯¯': { v: 0.1, a: 0.2, e: 'smug' },
  '´ᴗ`': { v: 0.6, a: 0.3 },
  '––': { v: 0.0, a: 0.2, e: 'sleepy' },
  'ᴗ̵̫ᴗ̵̫': { v: 0.5, a: 0.25, e: 'sleepy' },
  '--': { v: 0.0, a: 0.2, e: 'sleepy' },
  '﹒﹒': { v: 0.1, a: 0.2 },
  'ᐢᐢ': { v: 0.3, a: 0.3 },
  '≀≀': { v: 0.2, a: 0.3 },
  'ᓀᓂ': { v: -0.2, a: 0.4 },
  '¬¬': { v: -0.2, a: 0.3, e: 'smug' },
  '☆☆': { v: 0.8, a: 0.8, e: 'excited' },
  '⭐⭐': { v: 0.8, a: 0.8, e: 'excited' },
  '𖦹𖦹': { v: 0.2, a: 0.6, e: 'surprised' },
}

/* flank layers modify: blush pushes shy/valence, paws push excited, droop sad */
const FLANKS: Record<string, { dv: number; da: number; e?: string }> = {
  '⸝⸝': { dv: 0.2, da: 0.1, e: 'shy' },
  '˶˶': { dv: 0.15, da: 0.05, e: 'shy' },
  '๑๑': { dv: 0.15, da: 0.05, e: 'shy' },
  ',,': { dv: 0.15, da: 0.05, e: 'shy' },
  '〃〃': { dv: 0.15, da: 0.05, e: 'shy' },
  '՞՞': { dv: 0.05, da: 0.15 },
  'ᐢᐢ': { dv: 0.1, da: 0.0 },
  'ᐡᐡ': { dv: -0.1, da: 0.0, e: 'pleading' },
  '⑉⑉': { dv: 0.1, da: 0.0 },
  '⁔⁔': { dv: 0.1, da: 0.0 },
  '..': { dv: 0.0, da: 0.0 },
  '``': { dv: 0.0, da: 0.0 },
  "''": { dv: 0.0, da: 0.0 },
}

/* arms/outer decor */
const ARMS: Record<string, { dv: number; da: number; e?: string }> = {
  'ᕕ': { dv: 0.15, da: 0.3, e: 'excited' },   // strut/march arm — motion
  'ᕗ': { dv: 0.15, da: 0.3, e: 'excited' },
  '♪': { dv: 0.2, da: 0.25, e: 'joy' },       // music flourish
  '♫': { dv: 0.2, da: 0.25, e: 'joy' },
  '♡': { dv: 0.25, da: 0.1, e: 'love' },
  '⊃': { dv: 0.15, da: 0.1, e: 'love' },
  '⊂': { dv: 0.15, da: 0.1, e: 'love' },
  'っ': { dv: 0.1, da: 0.05 },
  'ノ': { dv: 0.1, da: 0.2, e: 'excited' },
  '٩': { dv: 0.15, da: 0.25, e: 'excited' },
  '୧': { dv: 0.15, da: 0.25, e: 'excited' },
  '୨': { dv: 0.15, da: 0.25, e: 'excited' },
  '✿': { dv: 0.15, da: 0.0 },
  '⋆': { dv: 0.1, da: 0.1 },
  '✧': { dv: 0.1, da: 0.15 },
}

/* combining marks that read as TEARS when attached to eye glyphs */
const TEAR_MARKS = /[̣̥͕̩]|·̥|｡\s*$/u
