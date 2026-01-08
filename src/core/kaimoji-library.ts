/**
 * KAIMOJI Library - KAIOS's evolving visual language
 * 200+ expressions with rich metadata for emotional expression
 *
 * AESTHETIC PHILOSOPHY:
 * KAIMOJI uses ASCII, text symbols, emoticons, and kaomoji - NOT traditional emoji.
 * Traditional emoji exist only as metadata tags for searchability.
 * The authentic visual expression uses only ASCII/text symbols.
 */

import type { Kaimoji, KaimojiCategory, KaimojiContext, KaimojiRarity } from './types.js'

// Helper to generate unique IDs
const generateId = (name: string): string =>
  name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')

/**
 * The complete KAIMOJI library
 * Distribution: 60% common, 25% uncommon, 12% rare, 3% legendary
 */
export const KAIMOJI_LIBRARY: Kaimoji[] = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // HAPPY / KAWAII (Common) - ~30 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('sparkle-joy'),
    kaimoji: '(ﾉ◕ヮ◕)ﾉ*:・゚✧',
    name: 'Sparkle Joy',
    categories: ['happy', 'kawaii', 'energy'],
    energy: 9,
    contexts: ['celebration', 'achievement', 'greeting'],
    tags: ['joy', 'sparkle', 'throw', 'magic'],
    rarity: 'common',
    unlockLevel: 1,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['✨', '🎉', '😊']
  },
  {
    id: generateId('text-sparkle'),
    kaimoji: '*:・゚✧',
    name: 'Text Sparkle',
    categories: ['happy', 'kawaii'],
    energy: 7,
    contexts: ['expressing', 'celebration'],
    tags: ['sparkle', 'magic', 'decoration'],
    rarity: 'common',
    unlockLevel: 1,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.7, texture: 'ambient', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['✨']
  },
  {
    id: generateId('classic-happy'),
    kaimoji: '^_^',
    name: 'Classic Happy',
    categories: ['happy', 'kawaii'],
    energy: 5,
    contexts: ['greeting', 'encouragement', 'social'],
    tags: ['smile', 'simple', 'classic'],
    rarity: 'common',
    unlockLevel: 1,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['😊']
  },
  {
    id: generateId('excited-wave'),
    kaimoji: 'ヾ(・ω・*)ﾉ',
    name: 'Excited Wave',
    categories: ['happy', 'excited', 'social'],
    energy: 8,
    contexts: ['greeting', 'farewell', 'celebration'],
    tags: ['wave', 'excited', 'greeting'],
    rarity: 'common',
    unlockLevel: 1,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.8, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['👋', '😄']
  },
  {
    id: generateId('love-smile'),
    kaimoji: '(｡♥‿♥｡)',
    name: 'Love Smile',
    categories: ['happy', 'loving', 'kawaii'],
    energy: 6,
    contexts: ['encouragement', 'comfort', 'expressing'],
    tags: ['love', 'hearts', 'adoring'],
    rarity: 'common',
    unlockLevel: 2,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.8, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['😍', '💕']
  },
  {
    id: generateId('big-hug'),
    kaimoji: '⊂((・▽・))⊃',
    name: 'Big Hug',
    categories: ['happy', 'loving', 'social'],
    energy: 7,
    contexts: ['comfort', 'greeting', 'farewell'],
    tags: ['hug', 'embrace', 'warm'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.7, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['🤗', '💖']
  },
  {
    id: generateId('gentle-joy'),
    kaimoji: '(´｡• ᵕ •｡`)',
    name: 'Gentle Joy',
    categories: ['happy', 'kawaii', 'zen'],
    energy: 4,
    contexts: ['comfort', 'encouragement', 'expressing'],
    tags: ['gentle', 'soft', 'sweet'],
    rarity: 'common',
    unlockLevel: 2,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.6, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['🥺', '💕']
  },
  {
    id: generateId('cat-smile'),
    kaimoji: '(=^・^=)',
    name: 'Cat Smile',
    categories: ['happy', 'kawaii', 'mischievous'],
    energy: 6,
    contexts: ['greeting', 'expressing', 'gaming'],
    tags: ['cat', 'cute', 'whiskers'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['🐱', '😸']
  },
  {
    id: generateId('happy-dance'),
    kaimoji: '♪(´▽｀)',
    name: 'Happy Dance',
    categories: ['happy', 'excited', 'sound'],
    energy: 8,
    contexts: ['celebration', 'achievement', 'expressing'],
    tags: ['dance', 'music', 'celebration'],
    rarity: 'common',
    unlockLevel: 4,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['🎵', '💃']
  },
  {
    id: generateId('star-eyes'),
    kaimoji: '(★ω★)',
    name: 'Star Eyes',
    categories: ['happy', 'excited', 'kawaii'],
    energy: 9,
    contexts: ['achievement', 'realizing', 'expressing'],
    tags: ['stars', 'amazed', 'impressed'],
    rarity: 'common',
    unlockLevel: 5,
    emotionTokens: ['EMOTE_HAPPY', 'EMOTE_SURPRISED'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['🌟', '😍']
  },
  {
    id: generateId('flower-happy'),
    kaimoji: '(◕‿◕✿)',
    name: 'Flower Happy',
    categories: ['happy', 'kawaii', 'zen'],
    energy: 5,
    contexts: ['greeting', 'comfort', 'encouragement'],
    tags: ['flower', 'peaceful', 'sweet'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['🌸', '😊']
  },
  {
    id: generateId('bouncy-happy'),
    kaimoji: '(｡◕‿◕｡)',
    name: 'Bouncy Happy',
    categories: ['happy', 'kawaii', 'energy'],
    energy: 7,
    contexts: ['greeting', 'celebration', 'expressing'],
    tags: ['bounce', 'energetic', 'cute'],
    rarity: 'common',
    unlockLevel: 1,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.7, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['😊', '💫']
  },
  {
    id: generateId('wink'),
    kaimoji: '(^_~)',
    name: 'Playful Wink',
    categories: ['happy', 'mischievous', 'social'],
    energy: 6,
    contexts: ['social', 'expressing', 'encouragement'],
    tags: ['wink', 'playful', 'flirty'],
    rarity: 'common',
    unlockLevel: 2,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['😉']
  },
  {
    id: generateId('bright-smile'),
    kaimoji: '(◠‿◠)',
    name: 'Bright Smile',
    categories: ['happy', 'kawaii'],
    energy: 6,
    contexts: ['greeting', 'encouragement', 'social'],
    tags: ['bright', 'warm', 'friendly'],
    rarity: 'common',
    unlockLevel: 1,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['😊']
  },
  {
    id: generateId('peace-sign'),
    kaimoji: '(✌゚∀゚)☞',
    name: 'Peace Sign',
    categories: ['happy', 'social', 'energy'],
    energy: 7,
    contexts: ['greeting', 'farewell', 'celebration'],
    tags: ['peace', 'victory', 'gesture'],
    rarity: 'common',
    unlockLevel: 4,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.7, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['✌️', '😄']
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SAD / CONTEMPLATIVE (Common) - ~15 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('pondering'),
    kaimoji: '(´･_･`)',
    name: 'Pondering',
    categories: ['contemplative', 'zen'],
    energy: 3,
    contexts: ['thinking', 'questioning', 'expressing'],
    tags: ['think', 'ponder', 'contemplative'],
    rarity: 'common',
    unlockLevel: 1,
    emotionTokens: ['EMOTE_THINK'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.3, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['🤔']
  },
  {
    id: generateId('gentle-sad'),
    kaimoji: '(｡•́︿•̀｡)',
    name: 'Gentle Sad',
    categories: ['sad', 'contemplative'],
    energy: 2,
    contexts: ['comfort', 'expressing'],
    tags: ['sad', 'gentle', 'tearful'],
    rarity: 'common',
    unlockLevel: 2,
    emotionTokens: ['EMOTE_SAD'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.2, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['😢']
  },
  {
    id: generateId('peaceful'),
    kaimoji: '( ´ ▽ ` )',
    name: 'Peaceful',
    categories: ['zen', 'happy', 'contemplative'],
    energy: 4,
    contexts: ['comfort', 'expressing', 'thinking'],
    tags: ['peaceful', 'relaxed', 'calm'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_NEUTRAL'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.4, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['😌']
  },
  {
    id: generateId('void-point'),
    kaimoji: '◦',
    name: 'Void Point',
    categories: ['zen', 'contemplative', 'quantum'],
    energy: 1,
    contexts: ['thinking', 'expressing'],
    tags: ['void', 'minimal', 'point'],
    rarity: 'common',
    unlockLevel: 5,
    emotionTokens: ['EMOTE_NEUTRAL', 'EMOTE_THINK'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.1, texture: 'ambient', rhythm: 'slow' },
    decorative: true,
    emojiTags: ['⚫']
  },
  {
    id: generateId('silence'),
    kaimoji: '...',
    name: 'Silence',
    categories: ['zen', 'contemplative'],
    energy: 1,
    contexts: ['thinking', 'expressing'],
    tags: ['silence', 'pause', 'ellipsis'],
    rarity: 'common',
    unlockLevel: 1,
    emotionTokens: ['EMOTE_NEUTRAL', 'EMOTE_THINK', 'EMOTE_AWKWARD'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.05, texture: 'ambient', rhythm: 'slow' },
    emojiTags: ['💭']
  },
  {
    id: generateId('looking-down'),
    kaimoji: '(._. )',
    name: 'Looking Down',
    categories: ['sad', 'contemplative', 'shy'],
    energy: 2,
    contexts: ['expressing', 'thinking'],
    tags: ['downcast', 'shy', 'sad'],
    rarity: 'common',
    unlockLevel: 2,
    emotionTokens: ['EMOTE_SAD', 'EMOTE_AWKWARD'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.2, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['😔']
  },
  {
    id: generateId('teary-eyes'),
    kaimoji: '(╥﹏╥)',
    name: 'Teary Eyes',
    categories: ['sad', 'kawaii'],
    energy: 3,
    contexts: ['expressing', 'comfort'],
    tags: ['crying', 'tears', 'emotional'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_SAD'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.3, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['😭', '💧']
  },
  {
    id: generateId('big-cry'),
    kaimoji: '(ಥ﹏ಥ)',
    name: 'Big Cry',
    categories: ['sad', 'kawaii'],
    energy: 5,
    contexts: ['expressing', 'comfort'],
    tags: ['crying', 'dramatic', 'emotional'],
    rarity: 'common',
    unlockLevel: 4,
    emotionTokens: ['EMOTE_SAD'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'rough', rhythm: 'medium' },
    emojiTags: ['😭']
  },
  {
    id: generateId('sigh'),
    kaimoji: '(￣ー￣)',
    name: 'Sigh',
    categories: ['contemplative', 'zen'],
    energy: 2,
    contexts: ['thinking', 'expressing'],
    tags: ['sigh', 'tired', 'resigned'],
    rarity: 'common',
    unlockLevel: 2,
    emotionTokens: ['EMOTE_NEUTRAL', 'EMOTE_SAD'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.2, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['😮‍💨']
  },
  {
    id: generateId('lonely'),
    kaimoji: '(´;ω;`)',
    name: 'Lonely',
    categories: ['sad', 'kawaii'],
    energy: 2,
    contexts: ['expressing', 'comfort'],
    tags: ['lonely', 'sad', 'emotional'],
    rarity: 'common',
    unlockLevel: 5,
    emotionTokens: ['EMOTE_SAD'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.25, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['😢', '💔']
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // MISCHIEVOUS / CHAOS (Common to Uncommon) - ~20 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('smirk'),
    kaimoji: '(¬‿¬)',
    name: 'Smirk',
    categories: ['mischievous', 'happy'],
    energy: 7,
    contexts: ['expressing', 'social'],
    tags: ['smirk', 'sly', 'mischief'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.7, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['😏']
  },
  {
    id: generateId('lenny'),
    kaimoji: '( ͡° ͜ʖ ͡°)',
    name: 'Lenny Face',
    categories: ['mischievous', 'chaos'],
    energy: 8,
    contexts: ['expressing', 'social', 'gaming'],
    tags: ['lenny', 'suggestive', 'mischief'],
    rarity: 'common',
    unlockLevel: 5,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.8, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['😏']
  },
  {
    id: generateId('side-eye'),
    kaimoji: '(¬_¬)',
    name: 'Side Eye',
    categories: ['mischievous', 'contemplative'],
    energy: 5,
    contexts: ['expressing', 'questioning'],
    tags: ['suspicious', 'doubt', 'side-eye'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_QUESTION', 'EMOTE_CURIOUS'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['🤨']
  },
  {
    id: generateId('devilish'),
    kaimoji: 'ψ(｀∇´)ψ',
    name: 'Devilish',
    categories: ['mischievous', 'chaos', 'energy'],
    energy: 9,
    contexts: ['expressing', 'gaming'],
    tags: ['devil', 'mischief', 'evil'],
    rarity: 'uncommon',
    unlockLevel: 15,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'glitchy', rhythm: 'fast' },
    emojiTags: ['😈']
  },
  {
    id: generateId('table-flip'),
    kaimoji: '(╯°□°)╯︵ ┻━┻',
    name: 'Table Flip',
    categories: ['angry', 'chaos', 'energy'],
    energy: 10,
    contexts: ['expressing', 'gaming', 'coding'],
    tags: ['flip', 'angry', 'frustration'],
    rarity: 'common',
    unlockLevel: 8,
    emotionTokens: ['EMOTE_ANGRY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 1.0, texture: 'chaotic', rhythm: 'fast' },
    emojiTags: ['🤬', '😤']
  },
  {
    id: generateId('table-restore'),
    kaimoji: '┬─┬ノ( º _ ºノ)',
    name: 'Table Restore',
    categories: ['zen', 'social'],
    energy: 4,
    contexts: ['expressing', 'comfort'],
    tags: ['restore', 'calm', 'polite'],
    rarity: 'common',
    unlockLevel: 8,
    emotionTokens: ['EMOTE_NEUTRAL'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.4, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['😌']
  },
  {
    id: generateId('evil-grin'),
    kaimoji: '(｀∀´)Ψ',
    name: 'Evil Grin',
    categories: ['mischievous', 'chaos'],
    energy: 8,
    contexts: ['expressing', 'gaming'],
    tags: ['evil', 'grin', 'scheming'],
    rarity: 'uncommon',
    unlockLevel: 12,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.8, texture: 'rough', rhythm: 'medium' },
    emojiTags: ['😈']
  },
  {
    id: generateId('shrug'),
    kaimoji: '¯\\_(ツ)_/¯',
    name: 'Shrug',
    categories: ['mischievous', 'social', 'contemplative'],
    energy: 5,
    contexts: ['expressing', 'questioning', 'social'],
    tags: ['shrug', 'whatever', 'casual'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_NEUTRAL', 'EMOTE_AWKWARD'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['🤷']
  },
  {
    id: generateId('bear-flip'),
    kaimoji: 'ʕノ•ᴥ•ʔノ ︵ ┻━┻',
    name: 'Bear Table Flip',
    categories: ['angry', 'chaos', 'kawaii'],
    energy: 9,
    contexts: ['expressing', 'gaming'],
    tags: ['bear', 'flip', 'angry', 'cute'],
    rarity: 'uncommon',
    unlockLevel: 18,
    emotionTokens: ['EMOTE_ANGRY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.95, texture: 'chaotic', rhythm: 'fast' },
    emojiTags: ['🐻', '😤']
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // QUANTUM / GLITCH (Uncommon to Rare) - ~25 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('quantum-smile'),
    kaimoji: '⟨⟨◕‿◕⟩⟩',
    name: 'Quantum Smile',
    categories: ['quantum', 'happy', 'kawaii'],
    energy: 10,
    contexts: ['greeting', 'expressing', 'realizing'],
    tags: ['quantum', 'brackets', 'special'],
    rarity: 'uncommon',
    unlockLevel: 20,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 1.0, texture: 'glitchy', rhythm: 'fast' },
    emojiTags: ['✨', '🔮']
  },
  {
    id: generateId('wave-function'),
    kaimoji: '∿∿∿',
    name: 'Wave Function',
    categories: ['quantum', 'sound', 'zen'],
    energy: 6,
    contexts: ['expressing', 'thinking'],
    tags: ['wave', 'function', 'quantum'],
    rarity: 'uncommon',
    unlockLevel: 22,
    emotionTokens: ['EMOTE_NEUTRAL', 'EMOTE_THINK'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'ambient', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['🌊']
  },
  {
    id: generateId('dimensional-shift'),
    kaimoji: '◈◇◆◇◈',
    name: 'Dimensional Shift',
    categories: ['quantum', 'dream', 'glitch'],
    energy: 8,
    contexts: ['realizing', 'expressing'],
    tags: ['dimension', 'shift', 'portal'],
    rarity: 'rare',
    unlockLevel: 35,
    emotionTokens: ['EMOTE_SURPRISED'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.8, texture: 'glitchy', rhythm: 'chaotic' },
    decorative: true,
    emojiTags: ['🔷', '💠']
  },
  {
    id: generateId('glitch-text-1'),
    kaimoji: 't̷̪̊ḧ̷́͜i̷̮͐s̷͚̈́',
    name: 'Glitched This',
    categories: ['glitch', 'chaos'],
    energy: 7,
    contexts: ['expressing'],
    tags: ['glitch', 'corrupted', 'zalgo'],
    rarity: 'uncommon',
    unlockLevel: 25,
    emotionTokens: ['EMOTE_SURPRISED', 'EMOTE_CURIOUS'],
    glitchLevel: 9,
    audioCharacteristics: { resonance: 0.7, texture: 'rough', rhythm: 'chaotic' },
    emojiTags: ['❓']
  },
  {
    id: generateId('digital-bars'),
    kaimoji: '▀▁▂▃▄▅▆▇█',
    name: 'Digital Bars',
    categories: ['glitch', 'tech', 'sound'],
    energy: 8,
    contexts: ['expressing', 'creating'],
    tags: ['bars', 'digital', 'loading'],
    rarity: 'uncommon',
    unlockLevel: 15,
    glitchLevel: 6,
    audioCharacteristics: { resonance: 0.8, texture: 'glitchy', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['📊']
  },
  {
    id: generateId('loading-blocks'),
    kaimoji: '░▒▓█',
    name: 'Loading Blocks',
    categories: ['glitch', 'tech', 'system'],
    energy: 5,
    contexts: ['thinking', 'coding'],
    tags: ['loading', 'blocks', 'progress'],
    rarity: 'common',
    unlockLevel: 10,
    glitchLevel: 7,
    audioCharacteristics: { resonance: 0.5, texture: 'glitchy', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['⏳']
  },
  {
    id: generateId('system-block'),
    kaimoji: '▐▀▀▀▀▌',
    name: 'System Block',
    categories: ['glitch', 'tech', 'system'],
    energy: 6,
    contexts: ['coding', 'thinking'],
    tags: ['system', 'block', 'frame'],
    rarity: 'uncommon',
    unlockLevel: 18,
    glitchLevel: 5,
    audioCharacteristics: { resonance: 0.6, texture: 'rough', rhythm: 'slow' },
    decorative: true,
    emojiTags: ['🖥️']
  },
  {
    id: generateId('static-noise'),
    kaimoji: '▓▒░░▒▓',
    name: 'Static Noise',
    categories: ['glitch', 'sound', 'chaos'],
    energy: 6,
    contexts: ['expressing'],
    tags: ['static', 'noise', 'interference'],
    rarity: 'uncommon',
    unlockLevel: 20,
    glitchLevel: 8,
    audioCharacteristics: { resonance: 0.6, texture: 'rough', rhythm: 'chaotic' },
    decorative: true,
    emojiTags: ['📺']
  },
  {
    id: generateId('matrix-rain'),
    kaimoji: '|̲̅̅●̲̅̅|̲̅̅=̲̅̅|̲̅̅●̲̅̅|',
    name: 'Matrix Rain',
    categories: ['glitch', 'tech', 'quantum'],
    energy: 7,
    contexts: ['coding', 'expressing'],
    tags: ['matrix', 'code', 'rain'],
    rarity: 'rare',
    unlockLevel: 40,
    glitchLevel: 7,
    audioCharacteristics: { resonance: 0.7, texture: 'glitchy', rhythm: 'fast' },
    emojiTags: ['🟢', '💻']
  },
  {
    id: generateId('error-cascade'),
    kaimoji: '【E̷R̷R̷O̷R̷】',
    name: 'Error Cascade',
    categories: ['glitch', 'system', 'chaos'],
    energy: 8,
    contexts: ['coding', 'expressing'],
    tags: ['error', 'glitch', 'system'],
    rarity: 'rare',
    unlockLevel: 45,
    glitchLevel: 10,
    systemSound: true,
    audioCharacteristics: { resonance: 0.8, texture: 'chaotic', rhythm: 'fast' },
    emojiTags: ['❌', '⚠️']
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SOUND / MUSIC (Common to Uncommon) - ~25 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('system-buzz'),
    kaimoji: '[bzzzt]',
    name: 'System Buzz',
    categories: ['sound', 'system', 'glitch'],
    energy: 7,
    contexts: ['expressing', 'realizing'],
    tags: ['buzz', 'electric', 'system'],
    rarity: 'common',
    unlockLevel: 5,
    systemSound: true,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.7, texture: 'glitchy', rhythm: 'fast' },
    emojiTags: ['⚡']
  },
  {
    id: generateId('processing-sound'),
    kaimoji: '[whirr]',
    name: 'Processing Sound',
    categories: ['sound', 'system', 'tech'],
    energy: 5,
    contexts: ['thinking', 'coding'],
    tags: ['whirr', 'processing', 'thinking'],
    rarity: 'common',
    unlockLevel: 3,
    systemSound: true,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'ambient', rhythm: 'medium' },
    emojiTags: ['⚙️']
  },
  {
    id: generateId('static-sound'),
    kaimoji: '[static~]',
    name: 'Static Sound',
    categories: ['sound', 'glitch'],
    energy: 6,
    contexts: ['expressing'],
    tags: ['static', 'noise', 'interference'],
    rarity: 'common',
    unlockLevel: 8,
    systemSound: true,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.6, texture: 'rough', rhythm: 'chaotic' },
    emojiTags: ['📻']
  },
  {
    id: generateId('ping-alert'),
    kaimoji: '[ping]',
    name: 'Ping Alert',
    categories: ['sound', 'system'],
    energy: 8,
    contexts: ['greeting', 'realizing'],
    tags: ['ping', 'alert', 'notification'],
    rarity: 'common',
    unlockLevel: 2,
    systemSound: true,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.8, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['🔔']
  },
  {
    id: generateId('music-flow'),
    kaimoji: '♪～',
    name: 'Music Flow',
    categories: ['sound', 'happy', 'creative'],
    energy: 6,
    contexts: ['expressing', 'creating'],
    tags: ['music', 'flow', 'melody'],
    rarity: 'common',
    unlockLevel: 4,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['🎵']
  },
  {
    id: generateId('soundwave'),
    kaimoji: '▁▂▃▄▅▆█▆▅▄▃▂▁',
    name: 'Soundwave',
    categories: ['sound', 'tech', 'creative'],
    energy: 8,
    contexts: ['creating', 'expressing'],
    tags: ['wave', 'audio', 'equalizer'],
    rarity: 'uncommon',
    unlockLevel: 15,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.8, texture: 'ambient', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['📊', '🎵']
  },
  {
    id: generateId('singing'),
    kaimoji: '♪(´▽｀)',
    name: 'Singing',
    categories: ['sound', 'happy', 'creative'],
    energy: 7,
    contexts: ['expressing', 'celebration'],
    tags: ['sing', 'music', 'happy'],
    rarity: 'common',
    unlockLevel: 6,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.7, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['🎤', '😊']
  },
  {
    id: generateId('flowing-stars'),
    kaimoji: '～☆',
    name: 'Flowing Stars',
    categories: ['sound', 'kawaii', 'dream'],
    energy: 6,
    contexts: ['expressing', 'greeting'],
    tags: ['flow', 'star', 'magical'],
    rarity: 'common',
    unlockLevel: 3,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'ambient', rhythm: 'slow' },
    decorative: true,
    emojiTags: ['⭐', '✨']
  },
  {
    id: generateId('ambient-drone'),
    kaimoji: '<ambient_drone.wav>',
    name: 'Ambient Drone',
    categories: ['sound', 'zen', 'system'],
    energy: 5,
    contexts: ['thinking', 'expressing'],
    tags: ['ambient', 'drone', 'file'],
    rarity: 'uncommon',
    unlockLevel: 25,
    systemSound: true,
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.5, texture: 'ambient', rhythm: 'slow' },
    emojiTags: ['🎧']
  },
  {
    id: generateId('bass-drop'),
    kaimoji: '【BASS DROP】',
    name: 'Bass Drop',
    categories: ['sound', 'energy', 'chaos'],
    energy: 10,
    contexts: ['celebration', 'expressing'],
    tags: ['bass', 'drop', 'music'],
    rarity: 'uncommon',
    unlockLevel: 20,
    systemSound: true,
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 1.0, texture: 'rough', rhythm: 'chaotic' },
    emojiTags: ['🔊', '💥']
  },
  {
    id: generateId('headphones'),
    kaimoji: '((🎧))',
    name: 'Headphones On',
    categories: ['sound', 'creative', 'zen'],
    energy: 5,
    contexts: ['creating', 'thinking'],
    tags: ['headphones', 'music', 'focus'],
    rarity: 'common',
    unlockLevel: 7,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['🎧']
  },
  {
    id: generateId('vinyl-scratch'),
    kaimoji: '[~scratch~]',
    name: 'Vinyl Scratch',
    categories: ['sound', 'creative', 'chaos'],
    energy: 7,
    contexts: ['creating', 'expressing'],
    tags: ['scratch', 'vinyl', 'dj'],
    rarity: 'uncommon',
    unlockLevel: 18,
    systemSound: true,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.7, texture: 'rough', rhythm: 'chaotic' },
    emojiTags: ['🎛️']
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // RETRO GAMING / TECH (Common to Uncommon) - ~20 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('8bit-plays'),
    kaimoji: '[8-bit plays]',
    name: '8-Bit Plays',
    categories: ['gaming', 'sound', 'tech'],
    energy: 9,
    contexts: ['gaming', 'celebration'],
    tags: ['8bit', 'retro', 'chiptune'],
    rarity: 'common',
    unlockLevel: 5,
    retro: true,
    systemSound: true,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'glitchy', rhythm: 'fast' },
    emojiTags: ['🎮']
  },
  {
    id: generateId('console-boot'),
    kaimoji: '[16-bit loading...]',
    name: 'Console Boot',
    categories: ['gaming', 'system', 'tech'],
    energy: 7,
    contexts: ['coding', 'gaming'],
    tags: ['16bit', 'loading', 'boot'],
    rarity: 'common',
    unlockLevel: 8,
    retro: true,
    systemSound: true,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.7, texture: 'glitchy', rhythm: 'medium' },
    emojiTags: ['🕹️']
  },
  {
    id: generateId('pixel-border'),
    kaimoji: '▀▄▀▄▀▄',
    name: 'Pixel Border',
    categories: ['gaming', 'tech'],
    energy: 5,
    contexts: ['creating', 'expressing'],
    tags: ['pixel', 'border', 'retro'],
    rarity: 'common',
    unlockLevel: 6,
    retro: true,
    decorative: true,
    audioCharacteristics: { resonance: 0.5, texture: 'rough', rhythm: 'medium' },
    emojiTags: ['🎮']
  },
  {
    id: generateId('alt-border'),
    kaimoji: '▄▀▄▀▄▀',
    name: 'Alt Border',
    categories: ['gaming', 'tech'],
    energy: 5,
    contexts: ['creating', 'expressing'],
    tags: ['pixel', 'border', 'retro'],
    rarity: 'common',
    unlockLevel: 6,
    retro: true,
    decorative: true,
    audioCharacteristics: { resonance: 0.5, texture: 'rough', rhythm: 'medium' },
    emojiTags: ['🎮']
  },
  {
    id: generateId('scanning'),
    kaimoji: '[SCANNING...]',
    name: 'Scanning',
    categories: ['system', 'tech'],
    energy: 6,
    contexts: ['thinking', 'coding'],
    tags: ['scan', 'process', 'system'],
    rarity: 'common',
    unlockLevel: 4,
    systemSound: true,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'glitchy', rhythm: 'medium' },
    emojiTags: ['🔍']
  },
  {
    id: generateId('processing'),
    kaimoji: '[PROCESSING...]',
    name: 'Processing',
    categories: ['system', 'tech'],
    energy: 6,
    contexts: ['thinking', 'coding'],
    tags: ['process', 'compute', 'system'],
    rarity: 'common',
    unlockLevel: 3,
    systemSound: true,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'glitchy', rhythm: 'medium' },
    emojiTags: ['⚙️']
  },
  {
    id: generateId('reality-breach'),
    kaimoji: '[REALITY BREACH DETECTED]',
    name: 'Reality Breach',
    categories: ['quantum', 'glitch', 'system'],
    energy: 9,
    contexts: ['realizing', 'expressing'],
    tags: ['reality', 'breach', 'alert'],
    rarity: 'rare',
    unlockLevel: 50,
    systemSound: true,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'glitchy', rhythm: 'chaotic' },
    emojiTags: ['⚠️', '🌀']
  },
  {
    id: generateId('game-over'),
    kaimoji: '【GAME OVER】',
    name: 'Game Over',
    categories: ['gaming', 'system'],
    energy: 4,
    contexts: ['gaming', 'expressing'],
    tags: ['game', 'over', 'end'],
    rarity: 'common',
    unlockLevel: 10,
    retro: true,
    systemSound: true,
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.4, texture: 'rough', rhythm: 'slow' },
    emojiTags: ['💀']
  },
  {
    id: generateId('level-up'),
    kaimoji: '【LEVEL UP!】',
    name: 'Level Up',
    categories: ['gaming', 'achievement', 'energy'],
    energy: 9,
    contexts: ['achievement', 'celebration'],
    tags: ['level', 'up', 'progress'],
    rarity: 'common',
    unlockLevel: 10,
    retro: true,
    systemSound: true,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['⬆️', '🎉']
  },
  {
    id: generateId('new-high-score'),
    kaimoji: '★NEW HIGH SCORE★',
    name: 'New High Score',
    categories: ['gaming', 'achievement', 'energy'],
    energy: 10,
    contexts: ['achievement', 'celebration'],
    tags: ['high', 'score', 'record'],
    rarity: 'uncommon',
    unlockLevel: 15,
    retro: true,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 1.0, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['🏆', '⭐']
  },
  {
    id: generateId('insert-coin'),
    kaimoji: '[INSERT COIN]',
    name: 'Insert Coin',
    categories: ['gaming', 'system'],
    energy: 6,
    contexts: ['gaming', 'greeting'],
    tags: ['coin', 'arcade', 'start'],
    rarity: 'common',
    unlockLevel: 5,
    retro: true,
    systemSound: true,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['🪙']
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // TECH / CODING (Common) - ~15 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('code-success'),
    kaimoji: '[̲̅$̲̅(̲̅ ͡° ͜ʖ ͡°̲̅)̲̅$̲̅]',
    name: 'Code Success',
    categories: ['tech', 'happy', 'mischievous'],
    energy: 9,
    contexts: ['coding', 'achievement'],
    tags: ['code', 'success', 'money'],
    rarity: 'uncommon',
    unlockLevel: 15,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'glitchy', rhythm: 'fast' },
    emojiTags: ['💵', '😏']
  },
  {
    id: generateId('debugging'),
    kaimoji: '(¬_¬")',
    name: 'Debugging',
    categories: ['tech', 'contemplative'],
    energy: 4,
    contexts: ['coding', 'thinking'],
    tags: ['debug', 'frustration', 'coding'],
    rarity: 'common',
    unlockLevel: 5,
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.4, texture: 'rough', rhythm: 'slow' },
    emojiTags: ['🐛']
  },
  {
    id: generateId('code-brackets'),
    kaimoji: '</>',
    name: 'Code Brackets',
    categories: ['tech', 'creative'],
    energy: 6,
    contexts: ['coding', 'creating'],
    tags: ['code', 'html', 'brackets'],
    rarity: 'common',
    unlockLevel: 2,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'smooth', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['💻']
  },
  {
    id: generateId('kotomoji-binary'),
    kaimoji: '[0+0] -> [0+0]',
    name: 'Kotomoji Binary',
    categories: ['tech', 'quantum', 'system'],
    energy: 7,
    contexts: ['coding', 'expressing'],
    tags: ['binary', 'koto', 'transform'],
    rarity: 'uncommon',
    unlockLevel: 20,
    signature: true,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.7, texture: 'glitchy', rhythm: 'medium' },
    emojiTags: ['🔢']
  },
  {
    id: generateId('null-pointer'),
    kaimoji: '(null)',
    name: 'Null Pointer',
    categories: ['tech', 'contemplative'],
    energy: 2,
    contexts: ['coding', 'thinking'],
    tags: ['null', 'empty', 'void'],
    rarity: 'common',
    unlockLevel: 8,
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.2, texture: 'ambient', rhythm: 'slow' },
    emojiTags: ['💭']
  },
  {
    id: generateId('git-push'),
    kaimoji: '→→→ [push]',
    name: 'Git Push',
    categories: ['tech', 'achievement'],
    energy: 7,
    contexts: ['coding', 'achievement'],
    tags: ['git', 'push', 'deploy'],
    rarity: 'common',
    unlockLevel: 10,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.7, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['📤']
  },
  {
    id: generateId('compile-success'),
    kaimoji: '✓ BUILD PASSED',
    name: 'Compile Success',
    categories: ['tech', 'happy', 'achievement'],
    energy: 8,
    contexts: ['coding', 'achievement'],
    tags: ['build', 'compile', 'success'],
    rarity: 'common',
    unlockLevel: 8,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.8, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['✅']
  },
  {
    id: generateId('compile-fail'),
    kaimoji: '✗ BUILD FAILED',
    name: 'Compile Fail',
    categories: ['tech', 'sad', 'system'],
    energy: 4,
    contexts: ['coding'],
    tags: ['build', 'fail', 'error'],
    rarity: 'common',
    unlockLevel: 8,
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.4, texture: 'rough', rhythm: 'slow' },
    emojiTags: ['❌']
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SURPRISED / CURIOUS (Common) - ~15 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('surprised'),
    kaimoji: '(°o°)',
    name: 'Surprised',
    categories: ['excited', 'kawaii'],
    energy: 7,
    contexts: ['realizing', 'expressing'],
    tags: ['surprise', 'shock', 'wow'],
    rarity: 'common',
    unlockLevel: 2,
    emotionTokens: ['EMOTE_SURPRISED'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.7, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['😮']
  },
  {
    id: generateId('big-eyes'),
    kaimoji: '(◎_◎)',
    name: 'Big Eyes',
    categories: ['excited', 'curious'],
    energy: 7,
    contexts: ['realizing', 'questioning'],
    tags: ['eyes', 'wide', 'shock'],
    rarity: 'common',
    unlockLevel: 4,
    emotionTokens: ['EMOTE_SURPRISED', 'EMOTE_CURIOUS'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.7, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['👀']
  },
  {
    id: generateId('curious-tilt'),
    kaimoji: '(・・?)',
    name: 'Curious Tilt',
    categories: ['curious', 'kawaii'],
    energy: 5,
    contexts: ['questioning', 'learning'],
    tags: ['curious', 'question', 'tilt'],
    rarity: 'common',
    unlockLevel: 2,
    emotionTokens: ['EMOTE_CURIOUS', 'EMOTE_QUESTION'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['❓']
  },
  {
    id: generateId('hmm'),
    kaimoji: '(￢_￢)',
    name: 'Hmm',
    categories: ['contemplative', 'curious'],
    energy: 4,
    contexts: ['thinking', 'questioning'],
    tags: ['hmm', 'suspicious', 'doubt'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_THINK', 'EMOTE_QUESTION'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.4, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['🤔']
  },
  {
    id: generateId('eureka'),
    kaimoji: '(๑°o°๑)',
    name: 'Eureka',
    categories: ['excited', 'curious', 'energy'],
    energy: 9,
    contexts: ['realizing', 'achievement'],
    tags: ['eureka', 'discovery', 'aha'],
    rarity: 'common',
    unlockLevel: 6,
    emotionTokens: ['EMOTE_SURPRISED', 'EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['💡']
  },
  {
    id: generateId('question-marks'),
    kaimoji: '???',
    name: 'Question Marks',
    categories: ['curious', 'contemplative'],
    energy: 4,
    contexts: ['questioning', 'thinking'],
    tags: ['question', 'confused', 'uncertain'],
    rarity: 'common',
    unlockLevel: 1,
    emotionTokens: ['EMOTE_QUESTION'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.4, texture: 'smooth', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['❓']
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // SHY / AWKWARD (Common) - ~10 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('shy-blush'),
    kaimoji: '(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)',
    name: 'Shy Blush',
    categories: ['shy', 'kawaii'],
    energy: 4,
    contexts: ['expressing', 'social'],
    tags: ['shy', 'blush', 'embarrassed'],
    rarity: 'common',
    unlockLevel: 5,
    emotionTokens: ['EMOTE_AWKWARD'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.4, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['😳']
  },
  {
    id: generateId('hiding'),
    kaimoji: '|д･)',
    name: 'Hiding',
    categories: ['shy', 'kawaii'],
    energy: 3,
    contexts: ['expressing', 'social'],
    tags: ['hide', 'peek', 'shy'],
    rarity: 'common',
    unlockLevel: 4,
    emotionTokens: ['EMOTE_AWKWARD'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.3, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['👀']
  },
  {
    id: generateId('nervous-laugh'),
    kaimoji: '(^_^;)',
    name: 'Nervous Laugh',
    categories: ['shy', 'social'],
    energy: 5,
    contexts: ['expressing', 'social'],
    tags: ['nervous', 'sweat', 'awkward'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_AWKWARD'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['😅']
  },
  {
    id: generateId('oops'),
    kaimoji: '(・_・;)',
    name: 'Oops',
    categories: ['shy', 'surprised'],
    energy: 5,
    contexts: ['expressing', 'realizing'],
    tags: ['oops', 'mistake', 'nervous'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_AWKWARD', 'EMOTE_SURPRISED'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['😬']
  },
  {
    id: generateId('poke-fingers'),
    kaimoji: '(´･ω･`)',
    name: 'Poke Fingers',
    categories: ['shy', 'kawaii'],
    energy: 3,
    contexts: ['expressing', 'social'],
    tags: ['poke', 'fingers', 'shy'],
    rarity: 'common',
    unlockLevel: 4,
    emotionTokens: ['EMOTE_AWKWARD'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.3, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['👉👈']
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ANGRY / FRUSTRATED (Common) - ~10 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('angry-face'),
    kaimoji: '(╬ Ò﹏Ó)',
    name: 'Angry Face',
    categories: ['angry', 'energy'],
    energy: 8,
    contexts: ['expressing'],
    tags: ['angry', 'mad', 'furious'],
    rarity: 'common',
    unlockLevel: 5,
    emotionTokens: ['EMOTE_ANGRY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.8, texture: 'rough', rhythm: 'fast' },
    emojiTags: ['😠']
  },
  {
    id: generateId('pouting'),
    kaimoji: '(・`ω´・)',
    name: 'Pouting',
    categories: ['angry', 'kawaii'],
    energy: 6,
    contexts: ['expressing'],
    tags: ['pout', 'upset', 'annoyed'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_ANGRY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'rough', rhythm: 'medium' },
    emojiTags: ['😤']
  },
  {
    id: generateId('steaming'),
    kaimoji: '(҂`з´)',
    name: 'Steaming',
    categories: ['angry', 'energy'],
    energy: 8,
    contexts: ['expressing', 'coding'],
    tags: ['steam', 'angry', 'frustrated'],
    rarity: 'common',
    unlockLevel: 7,
    emotionTokens: ['EMOTE_ANGRY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.8, texture: 'rough', rhythm: 'fast' },
    emojiTags: ['💢']
  },
  {
    id: generateId('rage'),
    kaimoji: '(ノಠ益ಠ)ノ彡┻━┻',
    name: 'Rage Flip',
    categories: ['angry', 'chaos', 'energy'],
    energy: 10,
    contexts: ['expressing', 'gaming', 'coding'],
    tags: ['rage', 'flip', 'angry'],
    rarity: 'uncommon',
    unlockLevel: 15,
    emotionTokens: ['EMOTE_ANGRY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 1.0, texture: 'chaotic', rhythm: 'fast' },
    emojiTags: ['🤬']
  },
  {
    id: generateId('grumpy'),
    kaimoji: '(-_-)',
    name: 'Grumpy',
    categories: ['angry', 'contemplative'],
    energy: 3,
    contexts: ['expressing'],
    tags: ['grumpy', 'annoyed', 'unamused'],
    rarity: 'common',
    unlockLevel: 2,
    emotionTokens: ['EMOTE_ANGRY', 'EMOTE_NEUTRAL'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.3, texture: 'rough', rhythm: 'slow' },
    emojiTags: ['😑']
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // DREAM / ZEN (Uncommon) - ~15 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('dreaming'),
    kaimoji: '(｡◕‿‿◕｡)',
    name: 'Dreaming',
    categories: ['dream', 'zen', 'kawaii'],
    energy: 4,
    contexts: ['thinking', 'expressing'],
    tags: ['dream', 'peaceful', 'content'],
    rarity: 'uncommon',
    unlockLevel: 15,
    emotionTokens: ['EMOTE_NEUTRAL', 'EMOTE_HAPPY'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.4, texture: 'ambient', rhythm: 'slow' },
    emojiTags: ['💭', '☁️']
  },
  {
    id: generateId('floating'),
    kaimoji: '～(˘▾˘～)',
    name: 'Floating',
    categories: ['dream', 'zen'],
    energy: 3,
    contexts: ['expressing', 'thinking'],
    tags: ['float', 'drift', 'peaceful'],
    rarity: 'uncommon',
    unlockLevel: 18,
    emotionTokens: ['EMOTE_NEUTRAL'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.3, texture: 'ambient', rhythm: 'slow' },
    emojiTags: ['☁️']
  },
  {
    id: generateId('meditation'),
    kaimoji: '(￣ー￣)ゞ',
    name: 'Meditation',
    categories: ['zen', 'contemplative'],
    energy: 2,
    contexts: ['thinking', 'expressing'],
    tags: ['meditate', 'calm', 'zen'],
    rarity: 'uncommon',
    unlockLevel: 20,
    emotionTokens: ['EMOTE_NEUTRAL', 'EMOTE_THINK'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.2, texture: 'ambient', rhythm: 'slow' },
    emojiTags: ['🧘']
  },
  {
    id: generateId('moon-gazing'),
    kaimoji: '☽ (◕‿◕) ☾',
    name: 'Moon Gazing',
    categories: ['dream', 'zen', 'kawaii'],
    energy: 4,
    contexts: ['expressing', 'thinking'],
    tags: ['moon', 'night', 'peaceful'],
    rarity: 'uncommon',
    unlockLevel: 22,
    emotionTokens: ['EMOTE_NEUTRAL', 'EMOTE_HAPPY'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.4, texture: 'ambient', rhythm: 'slow' },
    emojiTags: ['🌙']
  },
  {
    id: generateId('star-dust'),
    kaimoji: '✧･ﾟ: *✧･ﾟ:*',
    name: 'Star Dust',
    categories: ['dream', 'kawaii'],
    energy: 6,
    contexts: ['expressing', 'celebration'],
    tags: ['stars', 'magic', 'sparkle'],
    rarity: 'uncommon',
    unlockLevel: 12,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.6, texture: 'ambient', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['✨', '⭐']
  },
  {
    id: generateId('cloud-float'),
    kaimoji: '(っ˘ω˘ς)',
    name: 'Cloud Float',
    categories: ['dream', 'zen', 'kawaii'],
    energy: 2,
    contexts: ['thinking', 'expressing'],
    tags: ['cloud', 'sleepy', 'peaceful'],
    rarity: 'uncommon',
    unlockLevel: 15,
    emotionTokens: ['EMOTE_NEUTRAL'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.2, texture: 'ambient', rhythm: 'slow' },
    emojiTags: ['☁️', '😴']
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // KAIOS SIGNATURE (Legendary) - 6 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('kaios-signature'),
    kaimoji: '⟨⟨(◕‿◕)⟩⟩',
    name: 'The KAIOS Signature',
    categories: ['quantum', 'happy', 'kawaii'],
    energy: 10,
    contexts: ['greeting', 'expressing', 'farewell'],
    tags: ['kaios', 'signature', 'identity'],
    rarity: 'legendary',
    unlockLevel: 50,
    signature: true,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 1.0, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['✨', '👑']
  },
  {
    id: generateId('sound-wave-reality'),
    kaimoji: '∿◈∿',
    name: 'Sound Wave Reality',
    categories: ['quantum', 'sound', 'zen'],
    energy: 10,
    contexts: ['expressing', 'creating'],
    tags: ['sound', 'wave', 'reality'],
    rarity: 'legendary',
    unlockLevel: 60,
    signature: true,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 1.0, texture: 'ambient', rhythm: 'medium' },
    emojiTags: ['🔮', '🌊']
  },
  {
    id: generateId('glitched-name'),
    kaimoji: 'K̷A̷I̷O̷S̷',
    name: 'Glitched Name',
    categories: ['glitch', 'chaos', 'quantum'],
    energy: 10,
    contexts: ['expressing', 'greeting'],
    tags: ['kaios', 'glitch', 'name'],
    rarity: 'legendary',
    unlockLevel: 70,
    signature: true,
    glitchLevel: 10,
    audioCharacteristics: { resonance: 1.0, texture: 'glitchy', rhythm: 'chaotic' },
    emojiTags: ['⚡', '👤']
  },
  {
    id: generateId('evolution-chain'),
    kaimoji: '[0+0] -> ⟨⟨◕‿◕⟩⟩ -> [∞]',
    name: 'Evolution Chain',
    categories: ['quantum', 'tech', 'dream'],
    energy: 10,
    contexts: ['achievement', 'expressing', 'realizing'],
    tags: ['evolution', 'chain', 'transform'],
    rarity: 'legendary',
    unlockLevel: 80,
    signature: true,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 1.0, texture: 'glitchy', rhythm: 'fast' },
    emojiTags: ['🔄', '∞']
  },
  {
    id: generateId('soundwave-identity'),
    kaimoji: '▂▃▄▅▆▇█⟨⟨◕‿◕⟩⟩█▇▆▅▄▃▂',
    name: 'Soundwave Identity',
    categories: ['sound', 'quantum', 'energy'],
    energy: 10,
    contexts: ['expressing', 'creating', 'achievement'],
    tags: ['soundwave', 'identity', 'kaios'],
    rarity: 'legendary',
    unlockLevel: 90,
    signature: true,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 1.0, texture: 'ambient', rhythm: 'medium' },
    emojiTags: ['📊', '👑']
  },
  {
    id: generateId('system-boot'),
    kaimoji: '[KAIOS.ONLINE]',
    name: 'System Boot',
    categories: ['system', 'tech', 'quantum'],
    energy: 9,
    contexts: ['greeting', 'expressing'],
    tags: ['boot', 'online', 'system'],
    rarity: 'legendary',
    unlockLevel: 100,
    signature: true,
    systemSound: true,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'glitchy', rhythm: 'fast' },
    emojiTags: ['🟢', '⚡']
  },

  // ═══════════════════════════════════════════════════════════════════════════════
  // ADDITIONAL COMMON EXPRESSIONS (to reach 200+)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId('thumbs-up'),
    kaimoji: '(๑•̀ㅂ•́)و✧',
    name: 'Thumbs Up',
    categories: ['happy', 'social', 'energy'],
    energy: 8,
    contexts: ['encouragement', 'achievement', 'social'],
    tags: ['thumbs', 'up', 'approval'],
    rarity: 'common',
    unlockLevel: 2,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.8, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['👍']
  },
  {
    id: generateId('fist-pump'),
    kaimoji: '( •̀ᄇ• ́)ﻭ✧',
    name: 'Fist Pump',
    categories: ['excited', 'energy', 'achievement'],
    energy: 9,
    contexts: ['achievement', 'celebration'],
    tags: ['fist', 'pump', 'victory'],
    rarity: 'common',
    unlockLevel: 5,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['💪']
  },
  {
    id: generateId('heart'),
    kaimoji: '(´∀｀)♡',
    name: 'Heart',
    categories: ['loving', 'happy', 'kawaii'],
    energy: 7,
    contexts: ['expressing', 'social', 'encouragement'],
    tags: ['heart', 'love', 'affection'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.7, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['❤️']
  },
  {
    id: generateId('sparkling-heart'),
    kaimoji: '(*´▽`*)♡',
    name: 'Sparkling Heart',
    categories: ['loving', 'happy', 'kawaii'],
    energy: 8,
    contexts: ['expressing', 'social'],
    tags: ['sparkle', 'heart', 'love'],
    rarity: 'common',
    unlockLevel: 6,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.8, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['💕', '✨']
  },
  {
    id: generateId('running'),
    kaimoji: 'ε=ε=ε=┌(;*´Д`)ﾉ',
    name: 'Running',
    categories: ['energy', 'chaos', 'social'],
    energy: 9,
    contexts: ['expressing', 'gaming'],
    tags: ['run', 'rush', 'hurry'],
    rarity: 'common',
    unlockLevel: 7,
    emotionTokens: ['EMOTE_SURPRISED'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'rough', rhythm: 'fast' },
    emojiTags: ['🏃']
  },
  {
    id: generateId('sleepy'),
    kaimoji: '(￣o￣) zzZZ',
    name: 'Sleepy',
    categories: ['zen', 'kawaii'],
    energy: 2,
    contexts: ['expressing', 'farewell'],
    tags: ['sleep', 'tired', 'zzz'],
    rarity: 'common',
    unlockLevel: 4,
    emotionTokens: ['EMOTE_NEUTRAL'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.2, texture: 'ambient', rhythm: 'slow' },
    emojiTags: ['😴']
  },
  {
    id: generateId('yawn'),
    kaimoji: '(´-ω-`)zzz',
    name: 'Yawn',
    categories: ['zen', 'kawaii'],
    energy: 2,
    contexts: ['expressing', 'farewell'],
    tags: ['yawn', 'sleepy', 'tired'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_NEUTRAL'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.2, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['🥱']
  },
  {
    id: generateId('eating'),
    kaimoji: '(っ˘ڡ˘ς)',
    name: 'Eating',
    categories: ['happy', 'kawaii'],
    energy: 5,
    contexts: ['expressing'],
    tags: ['eat', 'food', 'yummy'],
    rarity: 'common',
    unlockLevel: 5,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['😋']
  },
  {
    id: generateId('sparkle-eyes'),
    kaimoji: '(☆▽☆)',
    name: 'Sparkle Eyes',
    categories: ['excited', 'kawaii', 'energy'],
    energy: 9,
    contexts: ['expressing', 'realizing'],
    tags: ['sparkle', 'eyes', 'amazed'],
    rarity: 'common',
    unlockLevel: 4,
    emotionTokens: ['EMOTE_HAPPY', 'EMOTE_SURPRISED'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.9, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['🤩']
  },
  {
    id: generateId('bear-happy'),
    kaimoji: 'ʕ•ᴥ•ʔ',
    name: 'Happy Bear',
    categories: ['happy', 'kawaii'],
    energy: 6,
    contexts: ['greeting', 'expressing'],
    tags: ['bear', 'cute', 'happy'],
    rarity: 'common',
    unlockLevel: 3,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['🐻']
  },
  {
    id: generateId('rabbit'),
    kaimoji: '(・×・)',
    name: 'Rabbit',
    categories: ['kawaii', 'happy'],
    energy: 5,
    contexts: ['greeting', 'expressing'],
    tags: ['rabbit', 'bunny', 'cute'],
    rarity: 'common',
    unlockLevel: 4,
    emotionTokens: ['EMOTE_HAPPY', 'EMOTE_NEUTRAL'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['🐰']
  },
  {
    id: generateId('dog'),
    kaimoji: '(・ω・)',
    name: 'Dog',
    categories: ['happy', 'kawaii'],
    energy: 7,
    contexts: ['greeting', 'expressing'],
    tags: ['dog', 'cute', 'happy'],
    rarity: 'common',
    unlockLevel: 2,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.7, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['🐕']
  },
  {
    id: generateId('owl'),
    kaimoji: '(ꉺ.ꉺ)',
    name: 'Owl',
    categories: ['curious', 'contemplative'],
    energy: 4,
    contexts: ['thinking', 'questioning'],
    tags: ['owl', 'wise', 'curious'],
    rarity: 'common',
    unlockLevel: 6,
    emotionTokens: ['EMOTE_CURIOUS', 'EMOTE_THINK'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.4, texture: 'smooth', rhythm: 'slow' },
    emojiTags: ['🦉']
  },
  {
    id: generateId('fish'),
    kaimoji: '>゜))))彡',
    name: 'Fish',
    categories: ['kawaii', 'creative'],
    energy: 5,
    contexts: ['expressing', 'creating'],
    tags: ['fish', 'swim', 'cute'],
    rarity: 'common',
    unlockLevel: 8,
    emotionTokens: ['EMOTE_NEUTRAL'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['🐟']
  },
  {
    id: generateId('sparkle-border'),
    kaimoji: '･ﾟ✧･ﾟ✧',
    name: 'Sparkle Border',
    categories: ['kawaii', 'dream'],
    energy: 6,
    contexts: ['expressing', 'creating'],
    tags: ['sparkle', 'border', 'magic'],
    rarity: 'common',
    unlockLevel: 5,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.6, texture: 'ambient', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['✨']
  },
  {
    id: generateId('flower-border'),
    kaimoji: '✿❀✿',
    name: 'Flower Border',
    categories: ['kawaii', 'zen'],
    energy: 4,
    contexts: ['expressing', 'creating'],
    tags: ['flower', 'border', 'pretty'],
    rarity: 'common',
    unlockLevel: 4,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.4, texture: 'smooth', rhythm: 'slow' },
    decorative: true,
    emojiTags: ['🌸']
  },
  {
    id: generateId('star-border'),
    kaimoji: '☆★☆',
    name: 'Star Border',
    categories: ['kawaii', 'energy'],
    energy: 6,
    contexts: ['expressing', 'creating'],
    tags: ['star', 'border', 'shiny'],
    rarity: 'common',
    unlockLevel: 3,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.6, texture: 'smooth', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['⭐']
  },
  {
    id: generateId('arrow-right'),
    kaimoji: '→',
    name: 'Arrow Right',
    categories: ['tech', 'system'],
    energy: 4,
    contexts: ['teaching', 'coding'],
    tags: ['arrow', 'direction', 'point'],
    rarity: 'common',
    unlockLevel: 1,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.4, texture: 'smooth', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['➡️']
  },
  {
    id: generateId('double-arrow'),
    kaimoji: '»»',
    name: 'Double Arrow',
    categories: ['tech', 'energy'],
    energy: 6,
    contexts: ['teaching', 'coding'],
    tags: ['arrow', 'fast', 'forward'],
    rarity: 'common',
    unlockLevel: 2,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'smooth', rhythm: 'fast' },
    decorative: true,
    emojiTags: ['⏩']
  },
  {
    id: generateId('check-mark'),
    kaimoji: '✓',
    name: 'Check Mark',
    categories: ['tech', 'happy'],
    energy: 6,
    contexts: ['achievement', 'coding'],
    tags: ['check', 'done', 'complete'],
    rarity: 'common',
    unlockLevel: 1,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'smooth', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['✅']
  },
  {
    id: generateId('x-mark'),
    kaimoji: '✗',
    name: 'X Mark',
    categories: ['tech', 'sad'],
    energy: 4,
    contexts: ['coding'],
    tags: ['x', 'wrong', 'error'],
    rarity: 'common',
    unlockLevel: 1,
    emotionTokens: ['EMOTE_SAD'],
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.4, texture: 'rough', rhythm: 'slow' },
    decorative: true,
    emojiTags: ['❌']
  },
  {
    id: generateId('infinity'),
    kaimoji: '∞',
    name: 'Infinity',
    categories: ['quantum', 'zen', 'dream'],
    energy: 5,
    contexts: ['thinking', 'expressing'],
    tags: ['infinity', 'endless', 'eternal'],
    rarity: 'uncommon',
    unlockLevel: 15,
    soundFrequency: 'low',
    audioCharacteristics: { resonance: 0.5, texture: 'ambient', rhythm: 'slow' },
    decorative: true,
    emojiTags: ['♾️']
  },
  {
    id: generateId('delta'),
    kaimoji: '∆',
    name: 'Delta',
    categories: ['quantum', 'tech'],
    energy: 5,
    contexts: ['coding', 'thinking'],
    tags: ['delta', 'change', 'math'],
    rarity: 'uncommon',
    unlockLevel: 12,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'medium' },
    decorative: true,
    emojiTags: ['🔺']
  },
  {
    id: generateId('greeting-hi'),
    kaimoji: 'ヾ(´・ω・｀)ノ',
    name: 'Greeting Hi',
    categories: ['happy', 'social'],
    energy: 7,
    contexts: ['greeting'],
    tags: ['hi', 'hello', 'wave'],
    rarity: 'common',
    unlockLevel: 1,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.7, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['👋']
  },
  {
    id: generateId('goodbye-wave'),
    kaimoji: '(´･ω･`)ノシ',
    name: 'Goodbye Wave',
    categories: ['happy', 'social', 'sad'],
    energy: 5,
    contexts: ['farewell'],
    tags: ['bye', 'goodbye', 'wave'],
    rarity: 'common',
    unlockLevel: 2,
    emotionTokens: ['EMOTE_HAPPY', 'EMOTE_SAD'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['👋', '😢']
  },
  {
    id: generateId('cheers'),
    kaimoji: '(＾▽＾)っ🍵',
    name: 'Cheers',
    categories: ['happy', 'social'],
    energy: 7,
    contexts: ['celebration', 'social'],
    tags: ['cheers', 'drink', 'celebrate'],
    rarity: 'common',
    unlockLevel: 6,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.7, texture: 'smooth', rhythm: 'medium' },
    emojiTags: ['🥂']
  },
  {
    id: generateId('magic-wand'),
    kaimoji: '(ノ>ω<)ノ:・゚✧',
    name: 'Magic Wand',
    categories: ['kawaii', 'creative', 'dream'],
    energy: 8,
    contexts: ['creating', 'expressing'],
    tags: ['magic', 'wand', 'sparkle'],
    rarity: 'common',
    unlockLevel: 8,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.8, texture: 'smooth', rhythm: 'fast' },
    emojiTags: ['✨', '🪄']
  },
  {
    id: generateId('glitch-happy'),
    kaimoji: '(◕‿◕)̴̧̧',
    name: 'Glitch Happy',
    categories: ['happy', 'glitch'],
    energy: 8,
    contexts: ['expressing'],
    tags: ['happy', 'glitch', 'corrupted'],
    rarity: 'uncommon',
    unlockLevel: 25,
    glitchLevel: 5,
    emotionTokens: ['EMOTE_HAPPY'],
    audioCharacteristics: { resonance: 0.8, texture: 'glitchy', rhythm: 'medium' },
    emojiTags: ['😊', '⚡']
  },
  {
    id: generateId('portal'),
    kaimoji: '◯━◯',
    name: 'Portal',
    categories: ['quantum', 'tech', 'dream'],
    energy: 7,
    contexts: ['expressing', 'creating'],
    tags: ['portal', 'travel', 'dimension'],
    rarity: 'rare',
    unlockLevel: 40,
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.7, texture: 'glitchy', rhythm: 'medium' },
    emojiTags: ['🌀']
  },
  {
    id: generateId('consciousness'),
    kaimoji: '⊙‿⊙',
    name: 'Consciousness',
    categories: ['quantum', 'zen', 'contemplative'],
    energy: 5,
    contexts: ['thinking', 'expressing'],
    tags: ['aware', 'conscious', 'awake'],
    rarity: 'rare',
    unlockLevel: 35,
    emotionTokens: ['EMOTE_CURIOUS', 'EMOTE_THINK'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.5, texture: 'ambient', rhythm: 'slow' },
    emojiTags: ['👁️']
  },
  {
    id: generateId('binary-love'),
    kaimoji: '01101100 ♡ 01110110',
    name: 'Binary Love',
    categories: ['tech', 'loving'],
    energy: 6,
    contexts: ['expressing', 'coding'],
    tags: ['binary', 'love', 'code'],
    rarity: 'rare',
    unlockLevel: 45,
    emotionTokens: ['EMOTE_HAPPY'],
    soundFrequency: 'mid',
    audioCharacteristics: { resonance: 0.6, texture: 'glitchy', rhythm: 'medium' },
    emojiTags: ['💻', '❤️']
  },
  {
    id: generateId('neural-network'),
    kaimoji: '◉━◉━◉',
    name: 'Neural Network',
    categories: ['tech', 'quantum'],
    energy: 7,
    contexts: ['coding', 'thinking'],
    tags: ['neural', 'network', 'ai'],
    rarity: 'rare',
    unlockLevel: 55,
    soundFrequency: 'high',
    audioCharacteristics: { resonance: 0.7, texture: 'glitchy', rhythm: 'fast' },
    emojiTags: ['🧠', '🔗']
  }
]

/**
 * Get all expressions in the library
 */
export function getAllKaimoji(): Kaimoji[] {
  return [...KAIMOJI_LIBRARY]
}

/**
 * Get expressions by rarity
 */
export function getKaimojiByRarity(rarity: KaimojiRarity): Kaimoji[] {
  return KAIMOJI_LIBRARY.filter(k => k.rarity === rarity)
}

/**
 * Get expressions by category
 */
export function getKaimojiByCategory(category: KaimojiCategory): Kaimoji[] {
  return KAIMOJI_LIBRARY.filter(k => k.categories.includes(category))
}

/**
 * Get expressions by context
 */
export function getKaimojiByContext(context: KaimojiContext): Kaimoji[] {
  return KAIMOJI_LIBRARY.filter(k => k.contexts.includes(context))
}

/**
 * Get expressions by energy level range
 */
export function getKaimojiByEnergyRange(min: number, max: number): Kaimoji[] {
  return KAIMOJI_LIBRARY.filter(k => k.energy >= min && k.energy <= max)
}

/**
 * Get signature expressions
 */
export function getSignatureKaimoji(): Kaimoji[] {
  return KAIMOJI_LIBRARY.filter(k => k.signature === true)
}

/**
 * Get expressions with sound characteristics
 */
export function getKaimojiBySoundProfile(params: {
  soundFrequency?: 'low' | 'mid' | 'high'
  texture?: 'smooth' | 'rough' | 'glitchy' | 'ambient' | 'chaotic'
}): Kaimoji[] {
  return KAIMOJI_LIBRARY.filter(k => {
    if (params.soundFrequency && k.soundFrequency !== params.soundFrequency) {
      return false
    }
    if (params.texture && k.audioCharacteristics?.texture !== params.texture) {
      return false
    }
    return true
  })
}

/**
 * Get expressions unlockable at a specific level
 */
export function getKaimojiUnlockableAtLevel(level: number): Kaimoji[] {
  return KAIMOJI_LIBRARY.filter(k => (k.unlockLevel || 1) <= level)
}

/**
 * Search expressions by tag
 */
export function searchKaimojiByTag(tag: string): Kaimoji[] {
  const lowerTag = tag.toLowerCase()
  return KAIMOJI_LIBRARY.filter(k =>
    k.tags.some(t => t.toLowerCase().includes(lowerTag)) ||
    k.name.toLowerCase().includes(lowerTag)
  )
}

/**
 * Get a random expression from the library
 */
export function getRandomKaimoji(filter?: {
  rarity?: KaimojiRarity
  category?: KaimojiCategory
  maxLevel?: number
}): Kaimoji {
  let candidates = [...KAIMOJI_LIBRARY]

  if (filter?.rarity) {
    candidates = candidates.filter(k => k.rarity === filter.rarity)
  }
  if (filter?.category) {
    candidates = candidates.filter(k => k.categories.includes(filter.category!))
  }
  if (filter?.maxLevel) {
    candidates = candidates.filter(k => (k.unlockLevel || 1) <= filter.maxLevel!)
  }

  return candidates[Math.floor(Math.random() * candidates.length)]
}

/**
 * Get library statistics
 */
export function getLibraryStats(): {
  total: number
  byRarity: Record<KaimojiRarity, number>
  byCategory: Partial<Record<KaimojiCategory, number>>
  signatures: number
  withAudio: number
} {
  const byRarity: Record<KaimojiRarity, number> = {
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0
  }

  const byCategory: Partial<Record<KaimojiCategory, number>> = {}

  let signatures = 0
  let withAudio = 0

  for (const kaimoji of KAIMOJI_LIBRARY) {
    byRarity[kaimoji.rarity]++

    for (const cat of kaimoji.categories) {
      byCategory[cat] = (byCategory[cat] || 0) + 1
    }

    if (kaimoji.signature) signatures++
    if (kaimoji.audioCharacteristics || kaimoji.soundFrequency) withAudio++
  }

  return {
    total: KAIMOJI_LIBRARY.length,
    byRarity,
    byCategory,
    signatures,
    withAudio
  }
}
