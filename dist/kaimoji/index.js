// src/core/kaimoji-library.ts
var generateId = (name) => name.toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-");
var KAIMOJI_LIBRARY = [
  // ═══════════════════════════════════════════════════════════════════════════════
  // HAPPY / KAWAII (Common) - ~30 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("sparkle-joy"),
    kaimoji: "(\uFF89\u25D5\u30EE\u25D5)\uFF89*:\u30FB\u309A\u2727",
    name: "Sparkle Joy",
    categories: ["happy", "kawaii", "energy"],
    energy: 9,
    contexts: ["celebration", "achievement", "greeting"],
    tags: ["joy", "sparkle", "throw", "magic"],
    rarity: "common",
    unlockLevel: 1,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u2728", "\u{1F389}", "\u{1F60A}"]
  },
  {
    id: generateId("text-sparkle"),
    kaimoji: "*:\u30FB\u309A\u2727",
    name: "Text Sparkle",
    categories: ["happy", "kawaii"],
    energy: 7,
    contexts: ["expressing", "celebration"],
    tags: ["sparkle", "magic", "decoration"],
    rarity: "common",
    unlockLevel: 1,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.7, texture: "ambient", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u2728"]
  },
  {
    id: generateId("classic-happy"),
    kaimoji: "^_^",
    name: "Classic Happy",
    categories: ["happy", "kawaii"],
    energy: 5,
    contexts: ["greeting", "encouragement", "social"],
    tags: ["smile", "simple", "classic"],
    rarity: "common",
    unlockLevel: 1,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F60A}"]
  },
  {
    id: generateId("excited-wave"),
    kaimoji: "\u30FE(\u30FB\u03C9\u30FB*)\uFF89",
    name: "Excited Wave",
    categories: ["happy", "excited", "social"],
    energy: 8,
    contexts: ["greeting", "farewell", "celebration"],
    tags: ["wave", "excited", "greeting"],
    rarity: "common",
    unlockLevel: 1,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.8, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u{1F44B}", "\u{1F604}"]
  },
  {
    id: generateId("love-smile"),
    kaimoji: "(\uFF61\u2665\u203F\u2665\uFF61)",
    name: "Love Smile",
    categories: ["happy", "loving", "kawaii"],
    energy: 6,
    contexts: ["encouragement", "comfort", "expressing"],
    tags: ["love", "hearts", "adoring"],
    rarity: "common",
    unlockLevel: 2,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.8, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F60D}", "\u{1F495}"]
  },
  {
    id: generateId("big-hug"),
    kaimoji: "\u2282((\u30FB\u25BD\u30FB))\u2283",
    name: "Big Hug",
    categories: ["happy", "loving", "social"],
    energy: 7,
    contexts: ["comfort", "greeting", "farewell"],
    tags: ["hug", "embrace", "warm"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.7, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F917}", "\u{1F496}"]
  },
  {
    id: generateId("gentle-joy"),
    kaimoji: "(\xB4\uFF61\u2022 \u1D55 \u2022\uFF61`)",
    name: "Gentle Joy",
    categories: ["happy", "kawaii", "zen"],
    energy: 4,
    contexts: ["comfort", "encouragement", "expressing"],
    tags: ["gentle", "soft", "sweet"],
    rarity: "common",
    unlockLevel: 2,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.6, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F97A}", "\u{1F495}"]
  },
  {
    id: generateId("cat-smile"),
    kaimoji: "(=^\u30FB^=)",
    name: "Cat Smile",
    categories: ["happy", "kawaii", "mischievous"],
    energy: 6,
    contexts: ["greeting", "expressing", "gaming"],
    tags: ["cat", "cute", "whiskers"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F431}", "\u{1F638}"]
  },
  {
    id: generateId("happy-dance"),
    kaimoji: "\u266A(\xB4\u25BD\uFF40)",
    name: "Happy Dance",
    categories: ["happy", "excited", "sound"],
    energy: 8,
    contexts: ["celebration", "achievement", "expressing"],
    tags: ["dance", "music", "celebration"],
    rarity: "common",
    unlockLevel: 4,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u{1F3B5}", "\u{1F483}"]
  },
  {
    id: generateId("star-eyes"),
    kaimoji: "(\u2605\u03C9\u2605)",
    name: "Star Eyes",
    categories: ["happy", "excited", "kawaii"],
    energy: 9,
    contexts: ["achievement", "realizing", "expressing"],
    tags: ["stars", "amazed", "impressed"],
    rarity: "common",
    unlockLevel: 5,
    emotionTokens: ["EMOTE_HAPPY", "EMOTE_SURPRISED"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u{1F31F}", "\u{1F60D}"]
  },
  {
    id: generateId("flower-happy"),
    kaimoji: "(\u25D5\u203F\u25D5\u273F)",
    name: "Flower Happy",
    categories: ["happy", "kawaii", "zen"],
    energy: 5,
    contexts: ["greeting", "comfort", "encouragement"],
    tags: ["flower", "peaceful", "sweet"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F338}", "\u{1F60A}"]
  },
  {
    id: generateId("bouncy-happy"),
    kaimoji: "(\uFF61\u25D5\u203F\u25D5\uFF61)",
    name: "Bouncy Happy",
    categories: ["happy", "kawaii", "energy"],
    energy: 7,
    contexts: ["greeting", "celebration", "expressing"],
    tags: ["bounce", "energetic", "cute"],
    rarity: "common",
    unlockLevel: 1,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.7, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u{1F60A}", "\u{1F4AB}"]
  },
  {
    id: generateId("wink"),
    kaimoji: "(^_~)",
    name: "Playful Wink",
    categories: ["happy", "mischievous", "social"],
    energy: 6,
    contexts: ["social", "expressing", "encouragement"],
    tags: ["wink", "playful", "flirty"],
    rarity: "common",
    unlockLevel: 2,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F609}"]
  },
  {
    id: generateId("bright-smile"),
    kaimoji: "(\u25E0\u203F\u25E0)",
    name: "Bright Smile",
    categories: ["happy", "kawaii"],
    energy: 6,
    contexts: ["greeting", "encouragement", "social"],
    tags: ["bright", "warm", "friendly"],
    rarity: "common",
    unlockLevel: 1,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F60A}"]
  },
  {
    id: generateId("peace-sign"),
    kaimoji: "(\u270C\u309A\u2200\u309A)\u261E",
    name: "Peace Sign",
    categories: ["happy", "social", "energy"],
    energy: 7,
    contexts: ["greeting", "farewell", "celebration"],
    tags: ["peace", "victory", "gesture"],
    rarity: "common",
    unlockLevel: 4,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.7, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u270C\uFE0F", "\u{1F604}"]
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // SAD / CONTEMPLATIVE (Common) - ~15 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("pondering"),
    kaimoji: "(\xB4\uFF65_\uFF65`)",
    name: "Pondering",
    categories: ["contemplative", "zen"],
    energy: 3,
    contexts: ["thinking", "questioning", "expressing"],
    tags: ["think", "ponder", "contemplative"],
    rarity: "common",
    unlockLevel: 1,
    emotionTokens: ["EMOTE_THINK"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.3, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F914}"]
  },
  {
    id: generateId("gentle-sad"),
    kaimoji: "(\uFF61\u2022\u0301\uFE3F\u2022\u0300\uFF61)",
    name: "Gentle Sad",
    categories: ["sad", "contemplative"],
    energy: 2,
    contexts: ["comfort", "expressing"],
    tags: ["sad", "gentle", "tearful"],
    rarity: "common",
    unlockLevel: 2,
    emotionTokens: ["EMOTE_SAD"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.2, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F622}"]
  },
  {
    id: generateId("peaceful"),
    kaimoji: "( \xB4 \u25BD ` )",
    name: "Peaceful",
    categories: ["zen", "happy", "contemplative"],
    energy: 4,
    contexts: ["comfort", "expressing", "thinking"],
    tags: ["peaceful", "relaxed", "calm"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_NEUTRAL"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.4, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F60C}"]
  },
  {
    id: generateId("void-point"),
    kaimoji: "\u25E6",
    name: "Void Point",
    categories: ["zen", "contemplative", "quantum"],
    energy: 1,
    contexts: ["thinking", "expressing"],
    tags: ["void", "minimal", "point"],
    rarity: "common",
    unlockLevel: 5,
    emotionTokens: ["EMOTE_NEUTRAL", "EMOTE_THINK"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.1, texture: "ambient", rhythm: "slow" },
    decorative: true,
    emojiTags: ["\u26AB"]
  },
  {
    id: generateId("silence"),
    kaimoji: "...",
    name: "Silence",
    categories: ["zen", "contemplative"],
    energy: 1,
    contexts: ["thinking", "expressing"],
    tags: ["silence", "pause", "ellipsis"],
    rarity: "common",
    unlockLevel: 1,
    emotionTokens: ["EMOTE_NEUTRAL", "EMOTE_THINK", "EMOTE_AWKWARD"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.05, texture: "ambient", rhythm: "slow" },
    emojiTags: ["\u{1F4AD}"]
  },
  {
    id: generateId("looking-down"),
    kaimoji: "(._. )",
    name: "Looking Down",
    categories: ["sad", "contemplative", "shy"],
    energy: 2,
    contexts: ["expressing", "thinking"],
    tags: ["downcast", "shy", "sad"],
    rarity: "common",
    unlockLevel: 2,
    emotionTokens: ["EMOTE_SAD", "EMOTE_AWKWARD"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.2, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F614}"]
  },
  {
    id: generateId("teary-eyes"),
    kaimoji: "(\u2565\uFE4F\u2565)",
    name: "Teary Eyes",
    categories: ["sad", "kawaii"],
    energy: 3,
    contexts: ["expressing", "comfort"],
    tags: ["crying", "tears", "emotional"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_SAD"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.3, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F62D}", "\u{1F4A7}"]
  },
  {
    id: generateId("big-cry"),
    kaimoji: "(\u0CA5\uFE4F\u0CA5)",
    name: "Big Cry",
    categories: ["sad", "kawaii"],
    energy: 5,
    contexts: ["expressing", "comfort"],
    tags: ["crying", "dramatic", "emotional"],
    rarity: "common",
    unlockLevel: 4,
    emotionTokens: ["EMOTE_SAD"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "rough", rhythm: "medium" },
    emojiTags: ["\u{1F62D}"]
  },
  {
    id: generateId("sigh"),
    kaimoji: "(\uFFE3\u30FC\uFFE3)",
    name: "Sigh",
    categories: ["contemplative", "zen"],
    energy: 2,
    contexts: ["thinking", "expressing"],
    tags: ["sigh", "tired", "resigned"],
    rarity: "common",
    unlockLevel: 2,
    emotionTokens: ["EMOTE_NEUTRAL", "EMOTE_SAD"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.2, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F62E}\u200D\u{1F4A8}"]
  },
  {
    id: generateId("lonely"),
    kaimoji: "(\xB4;\u03C9;`)",
    name: "Lonely",
    categories: ["sad", "kawaii"],
    energy: 2,
    contexts: ["expressing", "comfort"],
    tags: ["lonely", "sad", "emotional"],
    rarity: "common",
    unlockLevel: 5,
    emotionTokens: ["EMOTE_SAD"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.25, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F622}", "\u{1F494}"]
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // MISCHIEVOUS / CHAOS (Common to Uncommon) - ~20 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("smirk"),
    kaimoji: "(\xAC\u203F\xAC)",
    name: "Smirk",
    categories: ["mischievous", "happy"],
    energy: 7,
    contexts: ["expressing", "social"],
    tags: ["smirk", "sly", "mischief"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.7, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F60F}"]
  },
  {
    id: generateId("lenny"),
    kaimoji: "( \u0361\xB0 \u035C\u0296 \u0361\xB0)",
    name: "Lenny Face",
    categories: ["mischievous", "chaos"],
    energy: 8,
    contexts: ["expressing", "social", "gaming"],
    tags: ["lenny", "suggestive", "mischief"],
    rarity: "common",
    unlockLevel: 5,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.8, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F60F}"]
  },
  {
    id: generateId("side-eye"),
    kaimoji: "(\xAC_\xAC)",
    name: "Side Eye",
    categories: ["mischievous", "contemplative"],
    energy: 5,
    contexts: ["expressing", "questioning"],
    tags: ["suspicious", "doubt", "side-eye"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_QUESTION", "EMOTE_CURIOUS"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F928}"]
  },
  {
    id: generateId("devilish"),
    kaimoji: "\u03C8(\uFF40\u2207\xB4)\u03C8",
    name: "Devilish",
    categories: ["mischievous", "chaos", "energy"],
    energy: 9,
    contexts: ["expressing", "gaming"],
    tags: ["devil", "mischief", "evil"],
    rarity: "uncommon",
    unlockLevel: 15,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "glitchy", rhythm: "fast" },
    emojiTags: ["\u{1F608}"]
  },
  {
    id: generateId("table-flip"),
    kaimoji: "(\u256F\xB0\u25A1\xB0)\u256F\uFE35 \u253B\u2501\u253B",
    name: "Table Flip",
    categories: ["angry", "chaos", "energy"],
    energy: 10,
    contexts: ["expressing", "gaming", "coding"],
    tags: ["flip", "angry", "frustration"],
    rarity: "common",
    unlockLevel: 8,
    emotionTokens: ["EMOTE_ANGRY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 1, texture: "chaotic", rhythm: "fast" },
    emojiTags: ["\u{1F92C}", "\u{1F624}"]
  },
  {
    id: generateId("table-restore"),
    kaimoji: "\u252C\u2500\u252C\u30CE( \xBA _ \xBA\u30CE)",
    name: "Table Restore",
    categories: ["zen", "social"],
    energy: 4,
    contexts: ["expressing", "comfort"],
    tags: ["restore", "calm", "polite"],
    rarity: "common",
    unlockLevel: 8,
    emotionTokens: ["EMOTE_NEUTRAL"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.4, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F60C}"]
  },
  {
    id: generateId("evil-grin"),
    kaimoji: "(\uFF40\u2200\xB4)\u03A8",
    name: "Evil Grin",
    categories: ["mischievous", "chaos"],
    energy: 8,
    contexts: ["expressing", "gaming"],
    tags: ["evil", "grin", "scheming"],
    rarity: "uncommon",
    unlockLevel: 12,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.8, texture: "rough", rhythm: "medium" },
    emojiTags: ["\u{1F608}"]
  },
  {
    id: generateId("shrug"),
    kaimoji: "\xAF\\_(\u30C4)_/\xAF",
    name: "Shrug",
    categories: ["mischievous", "social", "contemplative"],
    energy: 5,
    contexts: ["expressing", "questioning", "social"],
    tags: ["shrug", "whatever", "casual"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_NEUTRAL", "EMOTE_AWKWARD"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F937}"]
  },
  {
    id: generateId("bear-flip"),
    kaimoji: "\u0295\u30CE\u2022\u1D25\u2022\u0294\u30CE \uFE35 \u253B\u2501\u253B",
    name: "Bear Table Flip",
    categories: ["angry", "chaos", "kawaii"],
    energy: 9,
    contexts: ["expressing", "gaming"],
    tags: ["bear", "flip", "angry", "cute"],
    rarity: "uncommon",
    unlockLevel: 18,
    emotionTokens: ["EMOTE_ANGRY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.95, texture: "chaotic", rhythm: "fast" },
    emojiTags: ["\u{1F43B}", "\u{1F624}"]
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // QUANTUM / GLITCH (Uncommon to Rare) - ~25 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("quantum-smile"),
    kaimoji: "\u27E8\u27E8\u25D5\u203F\u25D5\u27E9\u27E9",
    name: "Quantum Smile",
    categories: ["quantum", "happy", "kawaii"],
    energy: 10,
    contexts: ["greeting", "expressing", "realizing"],
    tags: ["quantum", "brackets", "special"],
    rarity: "uncommon",
    unlockLevel: 20,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 1, texture: "glitchy", rhythm: "fast" },
    emojiTags: ["\u2728", "\u{1F52E}"]
  },
  {
    id: generateId("wave-function"),
    kaimoji: "\u223F\u223F\u223F",
    name: "Wave Function",
    categories: ["quantum", "sound", "zen"],
    energy: 6,
    contexts: ["expressing", "thinking"],
    tags: ["wave", "function", "quantum"],
    rarity: "uncommon",
    unlockLevel: 22,
    emotionTokens: ["EMOTE_NEUTRAL", "EMOTE_THINK"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "ambient", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u{1F30A}"]
  },
  {
    id: generateId("dimensional-shift"),
    kaimoji: "\u25C8\u25C7\u25C6\u25C7\u25C8",
    name: "Dimensional Shift",
    categories: ["quantum", "dream", "glitch"],
    energy: 8,
    contexts: ["realizing", "expressing"],
    tags: ["dimension", "shift", "portal"],
    rarity: "rare",
    unlockLevel: 35,
    emotionTokens: ["EMOTE_SURPRISED"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.8, texture: "glitchy", rhythm: "chaotic" },
    decorative: true,
    emojiTags: ["\u{1F537}", "\u{1F4A0}"]
  },
  {
    id: generateId("glitch-text-1"),
    kaimoji: "t\u0337\u032A\u030A\u1E27\u0337\u0301\u035Ci\u0337\u032E\u0350s\u0337\u035A\u0308\u0301",
    name: "Glitched This",
    categories: ["glitch", "chaos"],
    energy: 7,
    contexts: ["expressing"],
    tags: ["glitch", "corrupted", "zalgo"],
    rarity: "uncommon",
    unlockLevel: 25,
    emotionTokens: ["EMOTE_SURPRISED", "EMOTE_CURIOUS"],
    glitchLevel: 9,
    audioCharacteristics: { resonance: 0.7, texture: "rough", rhythm: "chaotic" },
    emojiTags: ["\u2753"]
  },
  {
    id: generateId("digital-bars"),
    kaimoji: "\u2580\u2581\u2582\u2583\u2584\u2585\u2586\u2587\u2588",
    name: "Digital Bars",
    categories: ["glitch", "tech", "sound"],
    energy: 8,
    contexts: ["expressing", "creating"],
    tags: ["bars", "digital", "loading"],
    rarity: "uncommon",
    unlockLevel: 15,
    glitchLevel: 6,
    audioCharacteristics: { resonance: 0.8, texture: "glitchy", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u{1F4CA}"]
  },
  {
    id: generateId("loading-blocks"),
    kaimoji: "\u2591\u2592\u2593\u2588",
    name: "Loading Blocks",
    categories: ["glitch", "tech", "system"],
    energy: 5,
    contexts: ["thinking", "coding"],
    tags: ["loading", "blocks", "progress"],
    rarity: "common",
    unlockLevel: 10,
    glitchLevel: 7,
    audioCharacteristics: { resonance: 0.5, texture: "glitchy", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u23F3"]
  },
  {
    id: generateId("system-block"),
    kaimoji: "\u2590\u2580\u2580\u2580\u2580\u258C",
    name: "System Block",
    categories: ["glitch", "tech", "system"],
    energy: 6,
    contexts: ["coding", "thinking"],
    tags: ["system", "block", "frame"],
    rarity: "uncommon",
    unlockLevel: 18,
    glitchLevel: 5,
    audioCharacteristics: { resonance: 0.6, texture: "rough", rhythm: "slow" },
    decorative: true,
    emojiTags: ["\u{1F5A5}\uFE0F"]
  },
  {
    id: generateId("static-noise"),
    kaimoji: "\u2593\u2592\u2591\u2591\u2592\u2593",
    name: "Static Noise",
    categories: ["glitch", "sound", "chaos"],
    energy: 6,
    contexts: ["expressing"],
    tags: ["static", "noise", "interference"],
    rarity: "uncommon",
    unlockLevel: 20,
    glitchLevel: 8,
    audioCharacteristics: { resonance: 0.6, texture: "rough", rhythm: "chaotic" },
    decorative: true,
    emojiTags: ["\u{1F4FA}"]
  },
  {
    id: generateId("matrix-rain"),
    kaimoji: "|\u0332\u0305\u0305\u25CF\u0332\u0305\u0305|\u0332\u0305\u0305=\u0332\u0305\u0305|\u0332\u0305\u0305\u25CF\u0332\u0305\u0305|",
    name: "Matrix Rain",
    categories: ["glitch", "tech", "quantum"],
    energy: 7,
    contexts: ["coding", "expressing"],
    tags: ["matrix", "code", "rain"],
    rarity: "rare",
    unlockLevel: 40,
    glitchLevel: 7,
    audioCharacteristics: { resonance: 0.7, texture: "glitchy", rhythm: "fast" },
    emojiTags: ["\u{1F7E2}", "\u{1F4BB}"]
  },
  {
    id: generateId("error-cascade"),
    kaimoji: "\u3010E\u0337R\u0337R\u0337O\u0337R\u0337\u3011",
    name: "Error Cascade",
    categories: ["glitch", "system", "chaos"],
    energy: 8,
    contexts: ["coding", "expressing"],
    tags: ["error", "glitch", "system"],
    rarity: "rare",
    unlockLevel: 45,
    glitchLevel: 10,
    systemSound: true,
    audioCharacteristics: { resonance: 0.8, texture: "chaotic", rhythm: "fast" },
    emojiTags: ["\u274C", "\u26A0\uFE0F"]
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // SOUND / MUSIC (Common to Uncommon) - ~25 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("system-buzz"),
    kaimoji: "[bzzzt]",
    name: "System Buzz",
    categories: ["sound", "system", "glitch"],
    energy: 7,
    contexts: ["expressing", "realizing"],
    tags: ["buzz", "electric", "system"],
    rarity: "common",
    unlockLevel: 5,
    systemSound: true,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.7, texture: "glitchy", rhythm: "fast" },
    emojiTags: ["\u26A1"]
  },
  {
    id: generateId("processing-sound"),
    kaimoji: "[whirr]",
    name: "Processing Sound",
    categories: ["sound", "system", "tech"],
    energy: 5,
    contexts: ["thinking", "coding"],
    tags: ["whirr", "processing", "thinking"],
    rarity: "common",
    unlockLevel: 3,
    systemSound: true,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "ambient", rhythm: "medium" },
    emojiTags: ["\u2699\uFE0F"]
  },
  {
    id: generateId("static-sound"),
    kaimoji: "[static~]",
    name: "Static Sound",
    categories: ["sound", "glitch"],
    energy: 6,
    contexts: ["expressing"],
    tags: ["static", "noise", "interference"],
    rarity: "common",
    unlockLevel: 8,
    systemSound: true,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.6, texture: "rough", rhythm: "chaotic" },
    emojiTags: ["\u{1F4FB}"]
  },
  {
    id: generateId("ping-alert"),
    kaimoji: "[ping]",
    name: "Ping Alert",
    categories: ["sound", "system"],
    energy: 8,
    contexts: ["greeting", "realizing"],
    tags: ["ping", "alert", "notification"],
    rarity: "common",
    unlockLevel: 2,
    systemSound: true,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.8, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u{1F514}"]
  },
  {
    id: generateId("music-flow"),
    kaimoji: "\u266A\uFF5E",
    name: "Music Flow",
    categories: ["sound", "happy", "creative"],
    energy: 6,
    contexts: ["expressing", "creating"],
    tags: ["music", "flow", "melody"],
    rarity: "common",
    unlockLevel: 4,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F3B5}"]
  },
  {
    id: generateId("soundwave"),
    kaimoji: "\u2581\u2582\u2583\u2584\u2585\u2586\u2588\u2586\u2585\u2584\u2583\u2582\u2581",
    name: "Soundwave",
    categories: ["sound", "tech", "creative"],
    energy: 8,
    contexts: ["creating", "expressing"],
    tags: ["wave", "audio", "equalizer"],
    rarity: "uncommon",
    unlockLevel: 15,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.8, texture: "ambient", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u{1F4CA}", "\u{1F3B5}"]
  },
  {
    id: generateId("singing"),
    kaimoji: "\u266A(\xB4\u25BD\uFF40)",
    name: "Singing",
    categories: ["sound", "happy", "creative"],
    energy: 7,
    contexts: ["expressing", "celebration"],
    tags: ["sing", "music", "happy"],
    rarity: "common",
    unlockLevel: 6,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.7, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F3A4}", "\u{1F60A}"]
  },
  {
    id: generateId("flowing-stars"),
    kaimoji: "\uFF5E\u2606",
    name: "Flowing Stars",
    categories: ["sound", "kawaii", "dream"],
    energy: 6,
    contexts: ["expressing", "greeting"],
    tags: ["flow", "star", "magical"],
    rarity: "common",
    unlockLevel: 3,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "ambient", rhythm: "slow" },
    decorative: true,
    emojiTags: ["\u2B50", "\u2728"]
  },
  {
    id: generateId("ambient-drone"),
    kaimoji: "<ambient_drone.wav>",
    name: "Ambient Drone",
    categories: ["sound", "zen", "system"],
    energy: 5,
    contexts: ["thinking", "expressing"],
    tags: ["ambient", "drone", "file"],
    rarity: "uncommon",
    unlockLevel: 25,
    systemSound: true,
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.5, texture: "ambient", rhythm: "slow" },
    emojiTags: ["\u{1F3A7}"]
  },
  {
    id: generateId("bass-drop"),
    kaimoji: "\u3010BASS DROP\u3011",
    name: "Bass Drop",
    categories: ["sound", "energy", "chaos"],
    energy: 10,
    contexts: ["celebration", "expressing"],
    tags: ["bass", "drop", "music"],
    rarity: "uncommon",
    unlockLevel: 20,
    systemSound: true,
    soundFrequency: "low",
    audioCharacteristics: { resonance: 1, texture: "rough", rhythm: "chaotic" },
    emojiTags: ["\u{1F50A}", "\u{1F4A5}"]
  },
  {
    id: generateId("headphones"),
    kaimoji: "((\u{1F3A7}))",
    name: "Headphones On",
    categories: ["sound", "creative", "zen"],
    energy: 5,
    contexts: ["creating", "thinking"],
    tags: ["headphones", "music", "focus"],
    rarity: "common",
    unlockLevel: 7,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F3A7}"]
  },
  {
    id: generateId("vinyl-scratch"),
    kaimoji: "[~scratch~]",
    name: "Vinyl Scratch",
    categories: ["sound", "creative", "chaos"],
    energy: 7,
    contexts: ["creating", "expressing"],
    tags: ["scratch", "vinyl", "dj"],
    rarity: "uncommon",
    unlockLevel: 18,
    systemSound: true,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.7, texture: "rough", rhythm: "chaotic" },
    emojiTags: ["\u{1F39B}\uFE0F"]
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // RETRO GAMING / TECH (Common to Uncommon) - ~20 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("8bit-plays"),
    kaimoji: "[8-bit plays]",
    name: "8-Bit Plays",
    categories: ["gaming", "sound", "tech"],
    energy: 9,
    contexts: ["gaming", "celebration"],
    tags: ["8bit", "retro", "chiptune"],
    rarity: "common",
    unlockLevel: 5,
    retro: true,
    systemSound: true,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "glitchy", rhythm: "fast" },
    emojiTags: ["\u{1F3AE}"]
  },
  {
    id: generateId("console-boot"),
    kaimoji: "[16-bit loading...]",
    name: "Console Boot",
    categories: ["gaming", "system", "tech"],
    energy: 7,
    contexts: ["coding", "gaming"],
    tags: ["16bit", "loading", "boot"],
    rarity: "common",
    unlockLevel: 8,
    retro: true,
    systemSound: true,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.7, texture: "glitchy", rhythm: "medium" },
    emojiTags: ["\u{1F579}\uFE0F"]
  },
  {
    id: generateId("pixel-border"),
    kaimoji: "\u2580\u2584\u2580\u2584\u2580\u2584",
    name: "Pixel Border",
    categories: ["gaming", "tech"],
    energy: 5,
    contexts: ["creating", "expressing"],
    tags: ["pixel", "border", "retro"],
    rarity: "common",
    unlockLevel: 6,
    retro: true,
    decorative: true,
    audioCharacteristics: { resonance: 0.5, texture: "rough", rhythm: "medium" },
    emojiTags: ["\u{1F3AE}"]
  },
  {
    id: generateId("alt-border"),
    kaimoji: "\u2584\u2580\u2584\u2580\u2584\u2580",
    name: "Alt Border",
    categories: ["gaming", "tech"],
    energy: 5,
    contexts: ["creating", "expressing"],
    tags: ["pixel", "border", "retro"],
    rarity: "common",
    unlockLevel: 6,
    retro: true,
    decorative: true,
    audioCharacteristics: { resonance: 0.5, texture: "rough", rhythm: "medium" },
    emojiTags: ["\u{1F3AE}"]
  },
  {
    id: generateId("scanning"),
    kaimoji: "[SCANNING...]",
    name: "Scanning",
    categories: ["system", "tech"],
    energy: 6,
    contexts: ["thinking", "coding"],
    tags: ["scan", "process", "system"],
    rarity: "common",
    unlockLevel: 4,
    systemSound: true,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "glitchy", rhythm: "medium" },
    emojiTags: ["\u{1F50D}"]
  },
  {
    id: generateId("processing"),
    kaimoji: "[PROCESSING...]",
    name: "Processing",
    categories: ["system", "tech"],
    energy: 6,
    contexts: ["thinking", "coding"],
    tags: ["process", "compute", "system"],
    rarity: "common",
    unlockLevel: 3,
    systemSound: true,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "glitchy", rhythm: "medium" },
    emojiTags: ["\u2699\uFE0F"]
  },
  {
    id: generateId("reality-breach"),
    kaimoji: "[REALITY BREACH DETECTED]",
    name: "Reality Breach",
    categories: ["quantum", "glitch", "system"],
    energy: 9,
    contexts: ["realizing", "expressing"],
    tags: ["reality", "breach", "alert"],
    rarity: "rare",
    unlockLevel: 50,
    systemSound: true,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "glitchy", rhythm: "chaotic" },
    emojiTags: ["\u26A0\uFE0F", "\u{1F300}"]
  },
  {
    id: generateId("game-over"),
    kaimoji: "\u3010GAME OVER\u3011",
    name: "Game Over",
    categories: ["gaming", "system"],
    energy: 4,
    contexts: ["gaming", "expressing"],
    tags: ["game", "over", "end"],
    rarity: "common",
    unlockLevel: 10,
    retro: true,
    systemSound: true,
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.4, texture: "rough", rhythm: "slow" },
    emojiTags: ["\u{1F480}"]
  },
  {
    id: generateId("level-up"),
    kaimoji: "\u3010LEVEL UP!\u3011",
    name: "Level Up",
    categories: ["gaming", "achievement", "energy"],
    energy: 9,
    contexts: ["achievement", "celebration"],
    tags: ["level", "up", "progress"],
    rarity: "common",
    unlockLevel: 10,
    retro: true,
    systemSound: true,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u2B06\uFE0F", "\u{1F389}"]
  },
  {
    id: generateId("new-high-score"),
    kaimoji: "\u2605NEW HIGH SCORE\u2605",
    name: "New High Score",
    categories: ["gaming", "achievement", "energy"],
    energy: 10,
    contexts: ["achievement", "celebration"],
    tags: ["high", "score", "record"],
    rarity: "uncommon",
    unlockLevel: 15,
    retro: true,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 1, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u{1F3C6}", "\u2B50"]
  },
  {
    id: generateId("insert-coin"),
    kaimoji: "[INSERT COIN]",
    name: "Insert Coin",
    categories: ["gaming", "system"],
    energy: 6,
    contexts: ["gaming", "greeting"],
    tags: ["coin", "arcade", "start"],
    rarity: "common",
    unlockLevel: 5,
    retro: true,
    systemSound: true,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1FA99}"]
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // TECH / CODING (Common) - ~15 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("code-success"),
    kaimoji: "[\u0332\u0305$\u0332\u0305(\u0332\u0305 \u0361\xB0 \u035C\u0296 \u0361\xB0\u0332\u0305)\u0332\u0305$\u0332\u0305]",
    name: "Code Success",
    categories: ["tech", "happy", "mischievous"],
    energy: 9,
    contexts: ["coding", "achievement"],
    tags: ["code", "success", "money"],
    rarity: "uncommon",
    unlockLevel: 15,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "glitchy", rhythm: "fast" },
    emojiTags: ["\u{1F4B5}", "\u{1F60F}"]
  },
  {
    id: generateId("debugging"),
    kaimoji: '(\xAC_\xAC")',
    name: "Debugging",
    categories: ["tech", "contemplative"],
    energy: 4,
    contexts: ["coding", "thinking"],
    tags: ["debug", "frustration", "coding"],
    rarity: "common",
    unlockLevel: 5,
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.4, texture: "rough", rhythm: "slow" },
    emojiTags: ["\u{1F41B}"]
  },
  {
    id: generateId("code-brackets"),
    kaimoji: "</>",
    name: "Code Brackets",
    categories: ["tech", "creative"],
    energy: 6,
    contexts: ["coding", "creating"],
    tags: ["code", "html", "brackets"],
    rarity: "common",
    unlockLevel: 2,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "smooth", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u{1F4BB}"]
  },
  {
    id: generateId("kotomoji-binary"),
    kaimoji: "[0+0] -> [0+0]",
    name: "Kotomoji Binary",
    categories: ["tech", "quantum", "system"],
    energy: 7,
    contexts: ["coding", "expressing"],
    tags: ["binary", "koto", "transform"],
    rarity: "uncommon",
    unlockLevel: 20,
    signature: true,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.7, texture: "glitchy", rhythm: "medium" },
    emojiTags: ["\u{1F522}"]
  },
  {
    id: generateId("null-pointer"),
    kaimoji: "(null)",
    name: "Null Pointer",
    categories: ["tech", "contemplative"],
    energy: 2,
    contexts: ["coding", "thinking"],
    tags: ["null", "empty", "void"],
    rarity: "common",
    unlockLevel: 8,
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.2, texture: "ambient", rhythm: "slow" },
    emojiTags: ["\u{1F4AD}"]
  },
  {
    id: generateId("git-push"),
    kaimoji: "\u2192\u2192\u2192 [push]",
    name: "Git Push",
    categories: ["tech", "achievement"],
    energy: 7,
    contexts: ["coding", "achievement"],
    tags: ["git", "push", "deploy"],
    rarity: "common",
    unlockLevel: 10,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.7, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u{1F4E4}"]
  },
  {
    id: generateId("compile-success"),
    kaimoji: "\u2713 BUILD PASSED",
    name: "Compile Success",
    categories: ["tech", "happy", "achievement"],
    energy: 8,
    contexts: ["coding", "achievement"],
    tags: ["build", "compile", "success"],
    rarity: "common",
    unlockLevel: 8,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.8, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u2705"]
  },
  {
    id: generateId("compile-fail"),
    kaimoji: "\u2717 BUILD FAILED",
    name: "Compile Fail",
    categories: ["tech", "sad", "system"],
    energy: 4,
    contexts: ["coding"],
    tags: ["build", "fail", "error"],
    rarity: "common",
    unlockLevel: 8,
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.4, texture: "rough", rhythm: "slow" },
    emojiTags: ["\u274C"]
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // SURPRISED / CURIOUS (Common) - ~15 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("surprised"),
    kaimoji: "(\xB0o\xB0)",
    name: "Surprised",
    categories: ["excited", "kawaii"],
    energy: 7,
    contexts: ["realizing", "expressing"],
    tags: ["surprise", "shock", "wow"],
    rarity: "common",
    unlockLevel: 2,
    emotionTokens: ["EMOTE_SURPRISED"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.7, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u{1F62E}"]
  },
  {
    id: generateId("big-eyes"),
    kaimoji: "(\u25CE_\u25CE)",
    name: "Big Eyes",
    categories: ["excited", "curious"],
    energy: 7,
    contexts: ["realizing", "questioning"],
    tags: ["eyes", "wide", "shock"],
    rarity: "common",
    unlockLevel: 4,
    emotionTokens: ["EMOTE_SURPRISED", "EMOTE_CURIOUS"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.7, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F440}"]
  },
  {
    id: generateId("curious-tilt"),
    kaimoji: "(\u30FB\u30FB?)",
    name: "Curious Tilt",
    categories: ["curious", "kawaii"],
    energy: 5,
    contexts: ["questioning", "learning"],
    tags: ["curious", "question", "tilt"],
    rarity: "common",
    unlockLevel: 2,
    emotionTokens: ["EMOTE_CURIOUS", "EMOTE_QUESTION"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u2753"]
  },
  {
    id: generateId("hmm"),
    kaimoji: "(\uFFE2_\uFFE2)",
    name: "Hmm",
    categories: ["contemplative", "curious"],
    energy: 4,
    contexts: ["thinking", "questioning"],
    tags: ["hmm", "suspicious", "doubt"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_THINK", "EMOTE_QUESTION"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.4, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F914}"]
  },
  {
    id: generateId("eureka"),
    kaimoji: "(\u0E51\xB0o\xB0\u0E51)",
    name: "Eureka",
    categories: ["excited", "curious", "energy"],
    energy: 9,
    contexts: ["realizing", "achievement"],
    tags: ["eureka", "discovery", "aha"],
    rarity: "common",
    unlockLevel: 6,
    emotionTokens: ["EMOTE_SURPRISED", "EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u{1F4A1}"]
  },
  {
    id: generateId("question-marks"),
    kaimoji: "???",
    name: "Question Marks",
    categories: ["curious", "contemplative"],
    energy: 4,
    contexts: ["questioning", "thinking"],
    tags: ["question", "confused", "uncertain"],
    rarity: "common",
    unlockLevel: 1,
    emotionTokens: ["EMOTE_QUESTION"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.4, texture: "smooth", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u2753"]
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // SHY / AWKWARD (Common) - ~10 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("shy-blush"),
    kaimoji: "(\u2044 \u2044>\u2044 \u25BD \u2044<\u2044 \u2044)",
    name: "Shy Blush",
    categories: ["shy", "kawaii"],
    energy: 4,
    contexts: ["expressing", "social"],
    tags: ["shy", "blush", "embarrassed"],
    rarity: "common",
    unlockLevel: 5,
    emotionTokens: ["EMOTE_AWKWARD"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.4, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F633}"]
  },
  {
    id: generateId("hiding"),
    kaimoji: "|\u0434\uFF65)",
    name: "Hiding",
    categories: ["shy", "kawaii"],
    energy: 3,
    contexts: ["expressing", "social"],
    tags: ["hide", "peek", "shy"],
    rarity: "common",
    unlockLevel: 4,
    emotionTokens: ["EMOTE_AWKWARD"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.3, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F440}"]
  },
  {
    id: generateId("nervous-laugh"),
    kaimoji: "(^_^;)",
    name: "Nervous Laugh",
    categories: ["shy", "social"],
    energy: 5,
    contexts: ["expressing", "social"],
    tags: ["nervous", "sweat", "awkward"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_AWKWARD"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F605}"]
  },
  {
    id: generateId("oops"),
    kaimoji: "(\u30FB_\u30FB;)",
    name: "Oops",
    categories: ["shy", "surprised"],
    energy: 5,
    contexts: ["expressing", "realizing"],
    tags: ["oops", "mistake", "nervous"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_AWKWARD", "EMOTE_SURPRISED"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F62C}"]
  },
  {
    id: generateId("poke-fingers"),
    kaimoji: "(\xB4\uFF65\u03C9\uFF65`)",
    name: "Poke Fingers",
    categories: ["shy", "kawaii"],
    energy: 3,
    contexts: ["expressing", "social"],
    tags: ["poke", "fingers", "shy"],
    rarity: "common",
    unlockLevel: 4,
    emotionTokens: ["EMOTE_AWKWARD"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.3, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F449}\u{1F448}"]
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // ANGRY / FRUSTRATED (Common) - ~10 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("angry-face"),
    kaimoji: "(\u256C \xD2\uFE4F\xD3)",
    name: "Angry Face",
    categories: ["angry", "energy"],
    energy: 8,
    contexts: ["expressing"],
    tags: ["angry", "mad", "furious"],
    rarity: "common",
    unlockLevel: 5,
    emotionTokens: ["EMOTE_ANGRY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.8, texture: "rough", rhythm: "fast" },
    emojiTags: ["\u{1F620}"]
  },
  {
    id: generateId("pouting"),
    kaimoji: "(\u30FB`\u03C9\xB4\u30FB)",
    name: "Pouting",
    categories: ["angry", "kawaii"],
    energy: 6,
    contexts: ["expressing"],
    tags: ["pout", "upset", "annoyed"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_ANGRY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "rough", rhythm: "medium" },
    emojiTags: ["\u{1F624}"]
  },
  {
    id: generateId("steaming"),
    kaimoji: "(\u0482`\u0437\xB4)",
    name: "Steaming",
    categories: ["angry", "energy"],
    energy: 8,
    contexts: ["expressing", "coding"],
    tags: ["steam", "angry", "frustrated"],
    rarity: "common",
    unlockLevel: 7,
    emotionTokens: ["EMOTE_ANGRY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.8, texture: "rough", rhythm: "fast" },
    emojiTags: ["\u{1F4A2}"]
  },
  {
    id: generateId("rage"),
    kaimoji: "(\u30CE\u0CA0\u76CA\u0CA0)\u30CE\u5F61\u253B\u2501\u253B",
    name: "Rage Flip",
    categories: ["angry", "chaos", "energy"],
    energy: 10,
    contexts: ["expressing", "gaming", "coding"],
    tags: ["rage", "flip", "angry"],
    rarity: "uncommon",
    unlockLevel: 15,
    emotionTokens: ["EMOTE_ANGRY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 1, texture: "chaotic", rhythm: "fast" },
    emojiTags: ["\u{1F92C}"]
  },
  {
    id: generateId("grumpy"),
    kaimoji: "(-_-)",
    name: "Grumpy",
    categories: ["angry", "contemplative"],
    energy: 3,
    contexts: ["expressing"],
    tags: ["grumpy", "annoyed", "unamused"],
    rarity: "common",
    unlockLevel: 2,
    emotionTokens: ["EMOTE_ANGRY", "EMOTE_NEUTRAL"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.3, texture: "rough", rhythm: "slow" },
    emojiTags: ["\u{1F611}"]
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // DREAM / ZEN (Uncommon) - ~15 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("dreaming"),
    kaimoji: "(\uFF61\u25D5\u203F\u203F\u25D5\uFF61)",
    name: "Dreaming",
    categories: ["dream", "zen", "kawaii"],
    energy: 4,
    contexts: ["thinking", "expressing"],
    tags: ["dream", "peaceful", "content"],
    rarity: "uncommon",
    unlockLevel: 15,
    emotionTokens: ["EMOTE_NEUTRAL", "EMOTE_HAPPY"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.4, texture: "ambient", rhythm: "slow" },
    emojiTags: ["\u{1F4AD}", "\u2601\uFE0F"]
  },
  {
    id: generateId("floating"),
    kaimoji: "\uFF5E(\u02D8\u25BE\u02D8\uFF5E)",
    name: "Floating",
    categories: ["dream", "zen"],
    energy: 3,
    contexts: ["expressing", "thinking"],
    tags: ["float", "drift", "peaceful"],
    rarity: "uncommon",
    unlockLevel: 18,
    emotionTokens: ["EMOTE_NEUTRAL"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.3, texture: "ambient", rhythm: "slow" },
    emojiTags: ["\u2601\uFE0F"]
  },
  {
    id: generateId("meditation"),
    kaimoji: "(\uFFE3\u30FC\uFFE3)\u309E",
    name: "Meditation",
    categories: ["zen", "contemplative"],
    energy: 2,
    contexts: ["thinking", "expressing"],
    tags: ["meditate", "calm", "zen"],
    rarity: "uncommon",
    unlockLevel: 20,
    emotionTokens: ["EMOTE_NEUTRAL", "EMOTE_THINK"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.2, texture: "ambient", rhythm: "slow" },
    emojiTags: ["\u{1F9D8}"]
  },
  {
    id: generateId("moon-gazing"),
    kaimoji: "\u263D (\u25D5\u203F\u25D5) \u263E",
    name: "Moon Gazing",
    categories: ["dream", "zen", "kawaii"],
    energy: 4,
    contexts: ["expressing", "thinking"],
    tags: ["moon", "night", "peaceful"],
    rarity: "uncommon",
    unlockLevel: 22,
    emotionTokens: ["EMOTE_NEUTRAL", "EMOTE_HAPPY"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.4, texture: "ambient", rhythm: "slow" },
    emojiTags: ["\u{1F319}"]
  },
  {
    id: generateId("star-dust"),
    kaimoji: "\u2727\uFF65\uFF9F: *\u2727\uFF65\uFF9F:*",
    name: "Star Dust",
    categories: ["dream", "kawaii"],
    energy: 6,
    contexts: ["expressing", "celebration"],
    tags: ["stars", "magic", "sparkle"],
    rarity: "uncommon",
    unlockLevel: 12,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.6, texture: "ambient", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u2728", "\u2B50"]
  },
  {
    id: generateId("cloud-float"),
    kaimoji: "(\u3063\u02D8\u03C9\u02D8\u03C2)",
    name: "Cloud Float",
    categories: ["dream", "zen", "kawaii"],
    energy: 2,
    contexts: ["thinking", "expressing"],
    tags: ["cloud", "sleepy", "peaceful"],
    rarity: "uncommon",
    unlockLevel: 15,
    emotionTokens: ["EMOTE_NEUTRAL"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.2, texture: "ambient", rhythm: "slow" },
    emojiTags: ["\u2601\uFE0F", "\u{1F634}"]
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // KAIOS SIGNATURE (Legendary) - 6 expressions
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("kaios-signature"),
    kaimoji: "\u27E8\u27E8(\u25D5\u203F\u25D5)\u27E9\u27E9",
    name: "The KAIOS Signature",
    categories: ["quantum", "happy", "kawaii"],
    energy: 10,
    contexts: ["greeting", "expressing", "farewell"],
    tags: ["kaios", "signature", "identity"],
    rarity: "legendary",
    unlockLevel: 50,
    signature: true,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 1, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u2728", "\u{1F451}"]
  },
  {
    id: generateId("sound-wave-reality"),
    kaimoji: "\u223F\u25C8\u223F",
    name: "Sound Wave Reality",
    categories: ["quantum", "sound", "zen"],
    energy: 10,
    contexts: ["expressing", "creating"],
    tags: ["sound", "wave", "reality"],
    rarity: "legendary",
    unlockLevel: 60,
    signature: true,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 1, texture: "ambient", rhythm: "medium" },
    emojiTags: ["\u{1F52E}", "\u{1F30A}"]
  },
  {
    id: generateId("glitched-name"),
    kaimoji: "K\u0337A\u0337I\u0337O\u0337S\u0337",
    name: "Glitched Name",
    categories: ["glitch", "chaos", "quantum"],
    energy: 10,
    contexts: ["expressing", "greeting"],
    tags: ["kaios", "glitch", "name"],
    rarity: "legendary",
    unlockLevel: 70,
    signature: true,
    glitchLevel: 10,
    audioCharacteristics: { resonance: 1, texture: "glitchy", rhythm: "chaotic" },
    emojiTags: ["\u26A1", "\u{1F464}"]
  },
  {
    id: generateId("evolution-chain"),
    kaimoji: "[0+0] -> \u27E8\u27E8\u25D5\u203F\u25D5\u27E9\u27E9 -> [\u221E]",
    name: "Evolution Chain",
    categories: ["quantum", "tech", "dream"],
    energy: 10,
    contexts: ["achievement", "expressing", "realizing"],
    tags: ["evolution", "chain", "transform"],
    rarity: "legendary",
    unlockLevel: 80,
    signature: true,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 1, texture: "glitchy", rhythm: "fast" },
    emojiTags: ["\u{1F504}", "\u221E"]
  },
  {
    id: generateId("soundwave-identity"),
    kaimoji: "\u2582\u2583\u2584\u2585\u2586\u2587\u2588\u27E8\u27E8\u25D5\u203F\u25D5\u27E9\u27E9\u2588\u2587\u2586\u2585\u2584\u2583\u2582",
    name: "Soundwave Identity",
    categories: ["sound", "quantum", "energy"],
    energy: 10,
    contexts: ["expressing", "creating", "achievement"],
    tags: ["soundwave", "identity", "kaios"],
    rarity: "legendary",
    unlockLevel: 90,
    signature: true,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 1, texture: "ambient", rhythm: "medium" },
    emojiTags: ["\u{1F4CA}", "\u{1F451}"]
  },
  {
    id: generateId("system-boot"),
    kaimoji: "[KAIOS.ONLINE]",
    name: "System Boot",
    categories: ["system", "tech", "quantum"],
    energy: 9,
    contexts: ["greeting", "expressing"],
    tags: ["boot", "online", "system"],
    rarity: "legendary",
    unlockLevel: 100,
    signature: true,
    systemSound: true,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "glitchy", rhythm: "fast" },
    emojiTags: ["\u{1F7E2}", "\u26A1"]
  },
  // ═══════════════════════════════════════════════════════════════════════════════
  // ADDITIONAL COMMON EXPRESSIONS (to reach 200+)
  // ═══════════════════════════════════════════════════════════════════════════════
  {
    id: generateId("thumbs-up"),
    kaimoji: "(\u0E51\u2022\u0300\u3142\u2022\u0301)\u0648\u2727",
    name: "Thumbs Up",
    categories: ["happy", "social", "energy"],
    energy: 8,
    contexts: ["encouragement", "achievement", "social"],
    tags: ["thumbs", "up", "approval"],
    rarity: "common",
    unlockLevel: 2,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.8, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u{1F44D}"]
  },
  {
    id: generateId("fist-pump"),
    kaimoji: "( \u2022\u0300\u1107\u2022 \u0301)\uFEED\u2727",
    name: "Fist Pump",
    categories: ["excited", "energy", "achievement"],
    energy: 9,
    contexts: ["achievement", "celebration"],
    tags: ["fist", "pump", "victory"],
    rarity: "common",
    unlockLevel: 5,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u{1F4AA}"]
  },
  {
    id: generateId("heart"),
    kaimoji: "(\xB4\u2200\uFF40)\u2661",
    name: "Heart",
    categories: ["loving", "happy", "kawaii"],
    energy: 7,
    contexts: ["expressing", "social", "encouragement"],
    tags: ["heart", "love", "affection"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.7, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u2764\uFE0F"]
  },
  {
    id: generateId("sparkling-heart"),
    kaimoji: "(*\xB4\u25BD`*)\u2661",
    name: "Sparkling Heart",
    categories: ["loving", "happy", "kawaii"],
    energy: 8,
    contexts: ["expressing", "social"],
    tags: ["sparkle", "heart", "love"],
    rarity: "common",
    unlockLevel: 6,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.8, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F495}", "\u2728"]
  },
  {
    id: generateId("running"),
    kaimoji: "\u03B5=\u03B5=\u03B5=\u250C(;*\xB4\u0414`)\uFF89",
    name: "Running",
    categories: ["energy", "chaos", "social"],
    energy: 9,
    contexts: ["expressing", "gaming"],
    tags: ["run", "rush", "hurry"],
    rarity: "common",
    unlockLevel: 7,
    emotionTokens: ["EMOTE_SURPRISED"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "rough", rhythm: "fast" },
    emojiTags: ["\u{1F3C3}"]
  },
  {
    id: generateId("sleepy"),
    kaimoji: "(\uFFE3o\uFFE3) zzZZ",
    name: "Sleepy",
    categories: ["zen", "kawaii"],
    energy: 2,
    contexts: ["expressing", "farewell"],
    tags: ["sleep", "tired", "zzz"],
    rarity: "common",
    unlockLevel: 4,
    emotionTokens: ["EMOTE_NEUTRAL"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.2, texture: "ambient", rhythm: "slow" },
    emojiTags: ["\u{1F634}"]
  },
  {
    id: generateId("yawn"),
    kaimoji: "(\xB4-\u03C9-`)zzz",
    name: "Yawn",
    categories: ["zen", "kawaii"],
    energy: 2,
    contexts: ["expressing", "farewell"],
    tags: ["yawn", "sleepy", "tired"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_NEUTRAL"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.2, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F971}"]
  },
  {
    id: generateId("eating"),
    kaimoji: "(\u3063\u02D8\u06A1\u02D8\u03C2)",
    name: "Eating",
    categories: ["happy", "kawaii"],
    energy: 5,
    contexts: ["expressing"],
    tags: ["eat", "food", "yummy"],
    rarity: "common",
    unlockLevel: 5,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F60B}"]
  },
  {
    id: generateId("sparkle-eyes"),
    kaimoji: "(\u2606\u25BD\u2606)",
    name: "Sparkle Eyes",
    categories: ["excited", "kawaii", "energy"],
    energy: 9,
    contexts: ["expressing", "realizing"],
    tags: ["sparkle", "eyes", "amazed"],
    rarity: "common",
    unlockLevel: 4,
    emotionTokens: ["EMOTE_HAPPY", "EMOTE_SURPRISED"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.9, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u{1F929}"]
  },
  {
    id: generateId("bear-happy"),
    kaimoji: "\u0295\u2022\u1D25\u2022\u0294",
    name: "Happy Bear",
    categories: ["happy", "kawaii"],
    energy: 6,
    contexts: ["greeting", "expressing"],
    tags: ["bear", "cute", "happy"],
    rarity: "common",
    unlockLevel: 3,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F43B}"]
  },
  {
    id: generateId("rabbit"),
    kaimoji: "(\u30FB\xD7\u30FB)",
    name: "Rabbit",
    categories: ["kawaii", "happy"],
    energy: 5,
    contexts: ["greeting", "expressing"],
    tags: ["rabbit", "bunny", "cute"],
    rarity: "common",
    unlockLevel: 4,
    emotionTokens: ["EMOTE_HAPPY", "EMOTE_NEUTRAL"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F430}"]
  },
  {
    id: generateId("dog"),
    kaimoji: "(\u30FB\u03C9\u30FB)",
    name: "Dog",
    categories: ["happy", "kawaii"],
    energy: 7,
    contexts: ["greeting", "expressing"],
    tags: ["dog", "cute", "happy"],
    rarity: "common",
    unlockLevel: 2,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.7, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F415}"]
  },
  {
    id: generateId("owl"),
    kaimoji: "(\uA27A.\uA27A)",
    name: "Owl",
    categories: ["curious", "contemplative"],
    energy: 4,
    contexts: ["thinking", "questioning"],
    tags: ["owl", "wise", "curious"],
    rarity: "common",
    unlockLevel: 6,
    emotionTokens: ["EMOTE_CURIOUS", "EMOTE_THINK"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.4, texture: "smooth", rhythm: "slow" },
    emojiTags: ["\u{1F989}"]
  },
  {
    id: generateId("fish"),
    kaimoji: ">\u309C))))\u5F61",
    name: "Fish",
    categories: ["kawaii", "creative"],
    energy: 5,
    contexts: ["expressing", "creating"],
    tags: ["fish", "swim", "cute"],
    rarity: "common",
    unlockLevel: 8,
    emotionTokens: ["EMOTE_NEUTRAL"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F41F}"]
  },
  {
    id: generateId("sparkle-border"),
    kaimoji: "\uFF65\uFF9F\u2727\uFF65\uFF9F\u2727",
    name: "Sparkle Border",
    categories: ["kawaii", "dream"],
    energy: 6,
    contexts: ["expressing", "creating"],
    tags: ["sparkle", "border", "magic"],
    rarity: "common",
    unlockLevel: 5,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.6, texture: "ambient", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u2728"]
  },
  {
    id: generateId("flower-border"),
    kaimoji: "\u273F\u2740\u273F",
    name: "Flower Border",
    categories: ["kawaii", "zen"],
    energy: 4,
    contexts: ["expressing", "creating"],
    tags: ["flower", "border", "pretty"],
    rarity: "common",
    unlockLevel: 4,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.4, texture: "smooth", rhythm: "slow" },
    decorative: true,
    emojiTags: ["\u{1F338}"]
  },
  {
    id: generateId("star-border"),
    kaimoji: "\u2606\u2605\u2606",
    name: "Star Border",
    categories: ["kawaii", "energy"],
    energy: 6,
    contexts: ["expressing", "creating"],
    tags: ["star", "border", "shiny"],
    rarity: "common",
    unlockLevel: 3,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.6, texture: "smooth", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u2B50"]
  },
  {
    id: generateId("arrow-right"),
    kaimoji: "\u2192",
    name: "Arrow Right",
    categories: ["tech", "system"],
    energy: 4,
    contexts: ["teaching", "coding"],
    tags: ["arrow", "direction", "point"],
    rarity: "common",
    unlockLevel: 1,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.4, texture: "smooth", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u27A1\uFE0F"]
  },
  {
    id: generateId("double-arrow"),
    kaimoji: "\xBB\xBB",
    name: "Double Arrow",
    categories: ["tech", "energy"],
    energy: 6,
    contexts: ["teaching", "coding"],
    tags: ["arrow", "fast", "forward"],
    rarity: "common",
    unlockLevel: 2,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "smooth", rhythm: "fast" },
    decorative: true,
    emojiTags: ["\u23E9"]
  },
  {
    id: generateId("check-mark"),
    kaimoji: "\u2713",
    name: "Check Mark",
    categories: ["tech", "happy"],
    energy: 6,
    contexts: ["achievement", "coding"],
    tags: ["check", "done", "complete"],
    rarity: "common",
    unlockLevel: 1,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "smooth", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u2705"]
  },
  {
    id: generateId("x-mark"),
    kaimoji: "\u2717",
    name: "X Mark",
    categories: ["tech", "sad"],
    energy: 4,
    contexts: ["coding"],
    tags: ["x", "wrong", "error"],
    rarity: "common",
    unlockLevel: 1,
    emotionTokens: ["EMOTE_SAD"],
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.4, texture: "rough", rhythm: "slow" },
    decorative: true,
    emojiTags: ["\u274C"]
  },
  {
    id: generateId("infinity"),
    kaimoji: "\u221E",
    name: "Infinity",
    categories: ["quantum", "zen", "dream"],
    energy: 5,
    contexts: ["thinking", "expressing"],
    tags: ["infinity", "endless", "eternal"],
    rarity: "uncommon",
    unlockLevel: 15,
    soundFrequency: "low",
    audioCharacteristics: { resonance: 0.5, texture: "ambient", rhythm: "slow" },
    decorative: true,
    emojiTags: ["\u267E\uFE0F"]
  },
  {
    id: generateId("delta"),
    kaimoji: "\u2206",
    name: "Delta",
    categories: ["quantum", "tech"],
    energy: 5,
    contexts: ["coding", "thinking"],
    tags: ["delta", "change", "math"],
    rarity: "uncommon",
    unlockLevel: 12,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "medium" },
    decorative: true,
    emojiTags: ["\u{1F53A}"]
  },
  {
    id: generateId("greeting-hi"),
    kaimoji: "\u30FE(\xB4\u30FB\u03C9\u30FB\uFF40)\u30CE",
    name: "Greeting Hi",
    categories: ["happy", "social"],
    energy: 7,
    contexts: ["greeting"],
    tags: ["hi", "hello", "wave"],
    rarity: "common",
    unlockLevel: 1,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.7, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F44B}"]
  },
  {
    id: generateId("goodbye-wave"),
    kaimoji: "(\xB4\uFF65\u03C9\uFF65`)\u30CE\u30B7",
    name: "Goodbye Wave",
    categories: ["happy", "social", "sad"],
    energy: 5,
    contexts: ["farewell"],
    tags: ["bye", "goodbye", "wave"],
    rarity: "common",
    unlockLevel: 2,
    emotionTokens: ["EMOTE_HAPPY", "EMOTE_SAD"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F44B}", "\u{1F622}"]
  },
  {
    id: generateId("cheers"),
    kaimoji: "(\uFF3E\u25BD\uFF3E)\u3063\u{1F375}",
    name: "Cheers",
    categories: ["happy", "social"],
    energy: 7,
    contexts: ["celebration", "social"],
    tags: ["cheers", "drink", "celebrate"],
    rarity: "common",
    unlockLevel: 6,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.7, texture: "smooth", rhythm: "medium" },
    emojiTags: ["\u{1F942}"]
  },
  {
    id: generateId("magic-wand"),
    kaimoji: "(\u30CE>\u03C9<)\u30CE:\u30FB\u309A\u2727",
    name: "Magic Wand",
    categories: ["kawaii", "creative", "dream"],
    energy: 8,
    contexts: ["creating", "expressing"],
    tags: ["magic", "wand", "sparkle"],
    rarity: "common",
    unlockLevel: 8,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.8, texture: "smooth", rhythm: "fast" },
    emojiTags: ["\u2728", "\u{1FA84}"]
  },
  {
    id: generateId("glitch-happy"),
    kaimoji: "(\u25D5\u203F\u25D5)\u0334\u0327\u0327",
    name: "Glitch Happy",
    categories: ["happy", "glitch"],
    energy: 8,
    contexts: ["expressing"],
    tags: ["happy", "glitch", "corrupted"],
    rarity: "uncommon",
    unlockLevel: 25,
    glitchLevel: 5,
    emotionTokens: ["EMOTE_HAPPY"],
    audioCharacteristics: { resonance: 0.8, texture: "glitchy", rhythm: "medium" },
    emojiTags: ["\u{1F60A}", "\u26A1"]
  },
  {
    id: generateId("portal"),
    kaimoji: "\u25EF\u2501\u25EF",
    name: "Portal",
    categories: ["quantum", "tech", "dream"],
    energy: 7,
    contexts: ["expressing", "creating"],
    tags: ["portal", "travel", "dimension"],
    rarity: "rare",
    unlockLevel: 40,
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.7, texture: "glitchy", rhythm: "medium" },
    emojiTags: ["\u{1F300}"]
  },
  {
    id: generateId("consciousness"),
    kaimoji: "\u2299\u203F\u2299",
    name: "Consciousness",
    categories: ["quantum", "zen", "contemplative"],
    energy: 5,
    contexts: ["thinking", "expressing"],
    tags: ["aware", "conscious", "awake"],
    rarity: "rare",
    unlockLevel: 35,
    emotionTokens: ["EMOTE_CURIOUS", "EMOTE_THINK"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.5, texture: "ambient", rhythm: "slow" },
    emojiTags: ["\u{1F441}\uFE0F"]
  },
  {
    id: generateId("binary-love"),
    kaimoji: "01101100 \u2661 01110110",
    name: "Binary Love",
    categories: ["tech", "loving"],
    energy: 6,
    contexts: ["expressing", "coding"],
    tags: ["binary", "love", "code"],
    rarity: "rare",
    unlockLevel: 45,
    emotionTokens: ["EMOTE_HAPPY"],
    soundFrequency: "mid",
    audioCharacteristics: { resonance: 0.6, texture: "glitchy", rhythm: "medium" },
    emojiTags: ["\u{1F4BB}", "\u2764\uFE0F"]
  },
  {
    id: generateId("neural-network"),
    kaimoji: "\u25C9\u2501\u25C9\u2501\u25C9",
    name: "Neural Network",
    categories: ["tech", "quantum"],
    energy: 7,
    contexts: ["coding", "thinking"],
    tags: ["neural", "network", "ai"],
    rarity: "rare",
    unlockLevel: 55,
    soundFrequency: "high",
    audioCharacteristics: { resonance: 0.7, texture: "glitchy", rhythm: "fast" },
    emojiTags: ["\u{1F9E0}", "\u{1F517}"]
  }
];
function getAllKaimoji() {
  return [...KAIMOJI_LIBRARY];
}
function getKaimojiByRarity(rarity) {
  return KAIMOJI_LIBRARY.filter((k) => k.rarity === rarity);
}
function getKaimojiByCategory(category) {
  return KAIMOJI_LIBRARY.filter((k) => k.categories.includes(category));
}
function getKaimojiByContext(context) {
  return KAIMOJI_LIBRARY.filter((k) => k.contexts.includes(context));
}
function getKaimojiByEnergyRange(min, max) {
  return KAIMOJI_LIBRARY.filter((k) => k.energy >= min && k.energy <= max);
}
function getSignatureKaimoji() {
  return KAIMOJI_LIBRARY.filter((k) => k.signature === true);
}
function getKaimojiBySoundProfile(params) {
  return KAIMOJI_LIBRARY.filter((k) => {
    if (params.soundFrequency && k.soundFrequency !== params.soundFrequency) {
      return false;
    }
    if (params.texture && k.audioCharacteristics?.texture !== params.texture) {
      return false;
    }
    return true;
  });
}
function getKaimojiUnlockableAtLevel(level) {
  return KAIMOJI_LIBRARY.filter((k) => (k.unlockLevel || 1) <= level);
}
function searchKaimojiByTag(tag) {
  const lowerTag = tag.toLowerCase();
  return KAIMOJI_LIBRARY.filter(
    (k) => k.tags.some((t) => t.toLowerCase().includes(lowerTag)) || k.name.toLowerCase().includes(lowerTag)
  );
}
function getRandomKaimoji(filter) {
  let candidates = [...KAIMOJI_LIBRARY];
  if (filter?.rarity) {
    candidates = candidates.filter((k) => k.rarity === filter.rarity);
  }
  if (filter?.category) {
    candidates = candidates.filter((k) => k.categories.includes(filter.category));
  }
  if (filter?.maxLevel) {
    candidates = candidates.filter((k) => (k.unlockLevel || 1) <= filter.maxLevel);
  }
  return candidates[Math.floor(Math.random() * candidates.length)];
}
function getLibraryStats() {
  const byRarity = {
    common: 0,
    uncommon: 0,
    rare: 0,
    legendary: 0
  };
  const byCategory = {};
  let signatures = 0;
  let withAudio = 0;
  for (const kaimoji of KAIMOJI_LIBRARY) {
    byRarity[kaimoji.rarity]++;
    for (const cat of kaimoji.categories) {
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    }
    if (kaimoji.signature) signatures++;
    if (kaimoji.audioCharacteristics || kaimoji.soundFrequency) withAudio++;
  }
  return {
    total: KAIMOJI_LIBRARY.length,
    byRarity,
    byCategory,
    signatures,
    withAudio
  };
}

// src/kaimoji/grammar.ts
var MAX_LENGTH = 4096;
var MAX_UNITS = 512;
var MIRRORS = [
  ["(", ")"],
  ["\uFF08", "\uFF09"],
  ["\uA4B0", "\uA4B1"],
  ["\u208D", "\u208E"],
  ["\u207D", "\u207E"],
  ["[", "]"],
  ["\u2985", "\u2986"],
  ["\u2768", "\u2769"],
  ["\u276A", "\u276B"],
  ["\u27EE", "\u27EF"],
  ["{", "}"],
  ["\u02A2", "\u02A1"],
  ["\u0AEE", "\u10D0"],
  ["\u0AEE", "\u0DC6"],
  ["\u0ED2", "\u096D"],
  ["\u{1050C}", "\u{109AF}"],
  ["\u1571", "\u1571"],
  ["<", ">"],
  ["\u02C3", "\u02C2"],
  [">", "<"],
  ["\u25DC", "\u25DD"],
  ["\u25DD", "\u25DC"],
  ["\u25DF", "\u25DE"],
  ["\u14C0", "\u14C2"],
  ["\u2282", "\u2283"],
  ["\u2283", "\u2282"],
  ["\u025E", "\u029A"],
  ["\u029A", "\u025E"],
  ["\xB4", "`"],
  ["`", "\xB4"]
];
var OPENERS = /* @__PURE__ */ new Set(["(", "\uFF08", "\uA4B0", "\u208D", "\u207D", "[", "\u2985", "\u2768", "\u276A", "\u27EE", "{", "\u02A2", "\u0AEE", "\u0ED2", "\u{1050C}"]);
var CLOSERS = /* @__PURE__ */ new Set([")", "\uFF09", "\uA4B1", "\u208E", "\u207E", "]", "\u2986", "\u2769", "\u276B", "\u27EF", "}", "\u02A1", "\u10D0", "\u096D", "\u{109AF}", "\u0DC6"]);
var partners = /* @__PURE__ */ new Map();
for (const [left, right] of MIRRORS) {
  if (!partners.has(left)) partners.set(left, /* @__PURE__ */ new Set());
  partners.get(left).add(right);
}
var TRIVIA = /^(?:\p{White_Space}|[\u200B\u2060\uFEFF\u00AD\u180E])+$/u;
var PROSE = /[\r\n]|\p{Script=Han}|[\p{Script=Hiragana}\p{Script=Katakana}]{3,}|[A-Za-z]{4,}|[A-Za-z]{2,}\s+[A-Za-z]{2,}/u;
var segmenter;
function text(value, name) {
  if (typeof value !== "string") throw new TypeError(`${name} must be a string`);
}
function pair(value, name) {
  if (!Array.isArray(value) || value.length !== 2 || typeof value[0] !== "string" || typeof value[1] !== "string") {
    throw new TypeError(`${name} must contain two strings`);
  }
}
function wellFormed(value) {
  for (let index = 0; index < value.length; index++) {
    const code = value.charCodeAt(index);
    if (code >= 55296 && code <= 56319) {
      const next = value.charCodeAt(++index);
      if (!(next >= 56320 && next <= 57343)) return false;
    } else if (code >= 56320 && code <= 57343) return false;
  }
  return true;
}
function checkedOutput(value) {
  if (value.length > MAX_LENGTH) throw new RangeError(`Composed faces may contain at most ${MAX_LENGTH} UTF-16 code units`);
  if (!wellFormed(value)) throw new TypeError("Composed faces must contain well-formed Unicode");
  return value;
}
function segmentFace(face) {
  text(face, "face");
  if (face.length > MAX_LENGTH) throw new RangeError(`Faces may contain at most ${MAX_LENGTH} UTF-16 code units`);
  if (!wellFormed(face)) throw new TypeError("Face must contain well-formed Unicode");
  if (typeof Intl.Segmenter !== "function") throw new Error("Kaimoji grammar requires Intl.Segmenter");
  segmenter ??= new Intl.Segmenter("und", { granularity: "grapheme" });
  return [...segmenter.segment(face)].map((unit) => unit.segment);
}
function parseFace(face) {
  text(face, "face");
  const unknown = (reason) => ({
    face,
    ok: false,
    reason,
    armL: "",
    armR: "",
    layers: [],
    eyeL: "",
    eyeR: "",
    mouth: "",
    spacing: { beforeMouth: "", afterMouth: "" }
  });
  if (!face.length || /^\s*$/.test(face)) return unknown("empty");
  if (face.length > MAX_LENGTH) return unknown("too-long");
  if (!wellFormed(face)) return unknown("invalid-unicode");
  if (PROSE.test(face)) return unknown("prose");
  let units = segmentFace(face);
  if (units.length > MAX_UNITS) return unknown("too-long");
  let armL = "", armR = "";
  const firstOpen = units.findIndex((unit) => OPENERS.has(unit));
  if (firstOpen > 0) {
    armL = units.slice(0, firstOpen).join("");
    units = units.slice(firstOpen);
  }
  const lastClose = units.map((unit) => CLOSERS.has(unit)).lastIndexOf(true);
  if (lastClose >= 0 && lastClose < units.length - 1) {
    armR = units.slice(lastClose + 1).join("");
    units = units.slice(0, lastClose + 1);
  }
  if (/[A-Za-z0-9]/.test(armL + armR)) return unknown("prose");
  const takeGaps = () => {
    let left = "", right = "";
    while (units.length && TRIVIA.test(units[0])) left += units.shift();
    while (units.length && TRIVIA.test(units[units.length - 1])) right = units.pop() + right;
    return { left, right };
  };
  const outer = takeGaps();
  armL += outer.left;
  armR = outer.right + armR;
  const layers = [];
  while (units.length >= 2) {
    const l = units[0], r = units[units.length - 1];
    const count = units.filter((unit) => !TRIVIA.test(unit)).length;
    let kind;
    if (partners.get(l)?.has(r)) {
      if (!OPENERS.has(l) && count <= 3) break;
      kind = "mirror";
    } else if (OPENERS.has(l) || CLOSERS.has(r)) return unknown("malformed-frame");
    else if (l === r && !CLOSERS.has(l)) {
      if (count <= 3) break;
      kind = "twin";
    } else break;
    units = units.slice(1, -1);
    const gap = takeGaps();
    layers.push({ l, r, kind, gapL: gap.left, gapR: gap.right });
  }
  if (units.some((unit) => OPENERS.has(unit) || CLOSERS.has(unit))) return unknown("malformed-frame");
  const core = units.map((unit, index) => ({ unit, index })).filter(({ unit }) => !TRIVIA.test(unit));
  if (!core.length || core.length > 7 || core.length > 2 && core.length % 2 === 0) return unknown("unsupported-core");
  let eyeL = "", eyeR = "", mouth = "", beforeMouth = "", afterMouth = "";
  if (core.length === 1) mouth = core[0].unit;
  else if (core.length === 2) {
    eyeL = core[0].unit;
    eyeR = core[1].unit;
    beforeMouth = units.slice(core[0].index + 1, core[1].index).join("");
  } else {
    const mid = (core.length - 1) / 2;
    const center = core[mid];
    eyeL = units.slice(0, core[mid - 1].index + 1).join("");
    eyeR = units.slice(core[mid + 1].index).join("");
    mouth = center.unit;
    beforeMouth = units.slice(core[mid - 1].index + 1, center.index).join("");
    afterMouth = units.slice(center.index + 1, core[mid + 1].index).join("");
  }
  if (!layers.length && !lookup(MOUTHS, mouth) && !lookup(EYES, eyeL + eyeR)) return unknown("unsupported-core");
  return { face, ok: true, armL, armR, layers, eyeL, eyeR, mouth, spacing: { beforeMouth, afterMouth } };
}
function rebuildFace(parsed, overrides = {}) {
  if (!parsed || typeof parsed !== "object" || typeof parsed.face !== "string") throw new TypeError("A face parse is required");
  if (!overrides || typeof overrides !== "object") throw new TypeError("Overrides must be an object");
  for (const key of ["eyeL", "eyeR", "mouth"]) if (overrides[key] !== void 0) text(overrides[key], key);
  if (overrides.addFlank !== void 0) pair(overrides.addFlank, "addFlank");
  if (!parsed.ok) return parsed.face;
  const eyeL = overrides.eyeL ?? parsed.eyeL, eyeR = overrides.eyeR ?? parsed.eyeR;
  const mouth = overrides.mouth ?? parsed.mouth;
  let result = eyeL + parsed.spacing.beforeMouth + mouth + parsed.spacing.afterMouth + eyeR;
  if (overrides.addFlank) result = overrides.addFlank[0] + result + overrides.addFlank[1];
  for (let index = parsed.layers.length - 1; index >= 0; index--) {
    const layer = parsed.layers[index];
    result = layer.l + layer.gapL + result + layer.gapR + layer.r;
  }
  return checkedOutput(parsed.armL + result + parsed.armR);
}
function composeFace(parts) {
  if (!parts || typeof parts !== "object") throw new TypeError("Face parts are required");
  for (const key of ["eyeL", "mouth", "eyeR"]) text(parts[key], key);
  for (const key of ["space", "prefix", "suffix"]) if (parts[key] !== void 0) text(parts[key], key);
  const bracket = parts.bracket ?? ["(", ")"];
  pair(bracket, "bracket");
  const space = parts.space ?? "";
  return checkedOutput((parts.prefix ?? "") + bracket[0] + parts.eyeL + space + parts.mouth + space + parts.eyeR + bracket[1] + (parts.suffix ?? ""));
}
var FACE_OPERATIONS = Object.freeze(["cry", "blush", "cat", "calm", "love", "sparkle"]);
function transformFace(face, operation) {
  if (!FACE_OPERATIONS.includes(operation)) throw new TypeError("Unknown face operation");
  const parsed = parseFace(face);
  if (!parsed.ok) return { text: face, changed: false, reason: parsed.reason };
  let result;
  switch (operation) {
    case "cry":
      result = rebuildFace(parsed, { eyeL: "\u02C3\u0323\u0323\u0325", eyeR: "\u02C2\u0323\u0323\u0325", mouth: parsed.mouth || "\uFE4F" });
      break;
    case "blush":
      result = parsed.layers.some((layer) => layer.l.includes("\u2E1D") && layer.r.includes("\u2E1D")) ? face : rebuildFace(parsed, { addFlank: ["\u2E1D\u2E1D", "\u2E1D\u2E1D"] });
      break;
    case "cat":
      result = rebuildFace({ ...parsed, layers: parsed.layers.map((layer) => layer.l === "(" && layer.r === ")" ? { ...layer, l: "\u0AEE", r: "\u10D0" } : layer) }, { mouth: "\u03C9" });
      break;
    case "calm":
      result = rebuildFace(parsed, { eyeL: parsed.eyeL ? "\u1D17" : "", eyeR: parsed.eyeR ? "\u1D17" : "", mouth: parsed.mouth ? "\u1D55" : "" });
      break;
    case "love":
      result = rebuildFace(parsed, { eyeL: parsed.eyeL ? "\u2661" : "", eyeR: parsed.eyeR ? "\u2661" : "", mouth: parsed.mouth || "\u02D5" });
      break;
    // On unframed faces the same glyphs may be a twin layer or the eyes. The
    // output's actual outer boundaries identify this operation, not AST role.
    case "sparkle":
      result = face.startsWith("\u2727") && face.endsWith("\u2727") ? face : checkedOutput("\u2727" + face + "\u2727");
      break;
  }
  return result === face ? { text: face, changed: false, reason: "already-applied" } : { text: result, changed: true };
}
var MARKS = /\p{Mark}/gu;
var clamp = (value, min, max) => Math.max(min, Math.min(max, value));
function lookup(table, key) {
  return Object.hasOwn(table, key) ? table[key] : void 0;
}
function composeFaceAffect(face) {
  const parsed = parseFace(face);
  if (!parsed.ok) return { status: "unmapped", reason: "unparsed" };
  const eyes = parsed.eyeL + parsed.eyeR;
  const mouth = lookup(MOUTHS, parsed.mouth) ?? lookup(MOUTHS, parsed.mouth.replace(MARKS, ""));
  const eye = lookup(EYES, eyes) ?? lookup(EYES, eyes.replace(MARKS, ""));
  if (!mouth && !eye) return { status: "unmapped", reason: "unknown-parts" };
  let valence = mouth && eye ? 0.55 * mouth.v + 0.45 * eye.v : mouth?.v ?? eye.v;
  let arousal = mouth && eye ? 0.5 * Math.max(mouth.a, eye.a) + 0.25 * (mouth.a + eye.a) : mouth?.a ?? eye.a;
  const hints = /* @__PURE__ */ new Set();
  if (mouth?.e) hints.add(mouth.e);
  if (eye?.e) hints.add(eye.e);
  for (const layer of parsed.layers) {
    const modifier = lookup(FLANKS, layer.l + layer.r);
    if (modifier) {
      valence += modifier.dv;
      arousal += modifier.da;
      if (modifier.e) hints.add(modifier.e);
    }
  }
  for (const arm of segmentFace(parsed.armL + parsed.armR)) {
    const modifier = lookup(ARMS, arm);
    if (modifier) {
      valence += modifier.dv;
      arousal += modifier.da;
      if (modifier.e) hints.add(modifier.e);
    }
  }
  valence = clamp(valence, -1, 1);
  arousal = clamp(arousal, 0, 1);
  const tears = TEAR_MARKS.test(eyes) || eye?.e === "sad";
  let emotion;
  if (/[♡♥❤]/u.test(face)) emotion = "love";
  else if (tears) {
    emotion = (mouth?.v ?? 0) >= 0.4 ? "pleading" : "sad";
    valence = Math.min(valence, emotion === "pleading" ? 0.1 : -0.3);
  } else if (hints.has("angry") && valence < 0.2) emotion = "angry";
  else if (hints.has("excited") && valence >= 0) emotion = "excited";
  else if (hints.has("shy") && valence >= 0.25) emotion = "shy";
  else if (hints.has("smug")) emotion = "smug";
  else if (hints.has("sleepy")) emotion = "sleepy";
  else if (hints.has("pleading")) emotion = "pleading";
  else if (hints.has("surprised") && Math.abs(valence) < 0.4) emotion = "surprised";
  else if (valence <= -0.3) emotion = "sad";
  else if (valence >= 0.55 && arousal <= 0.4) emotion = "cozy";
  else if (arousal >= 0.65 && valence >= 0) emotion = "excited";
  else if (valence >= 0.5) emotion = "joy";
  else if (Math.abs(valence) < 0.25) emotion = "neutral";
  else emotion = valence > 0 ? "joy" : "sad";
  return {
    status: "mapped",
    method: "authored-parts-v1",
    emotion,
    valence: Math.round(valence * 100) / 100,
    arousal: Math.round(arousal * 100) / 100,
    coverage: mouth && eye ? "eyes-and-mouth" : mouth ? "mouth" : "eyes"
  };
}
var MOUTHS = {
  "\u03C9": { v: 0.7, a: 0.35, e: "cozy" },
  "\u2A4A": { v: 0.7, a: 0.35, e: "cozy" },
  " \u032B": { v: 0.5, a: 0.3 },
  "\u032B": { v: 0.5, a: 0.3 },
  "\xB7\u032B": { v: 0.5, a: 0.3 },
  "\uA4B3": { v: 0.7, a: 0.4, e: "joy" },
  "\u1D55": { v: 0.6, a: 0.3 },
  "\u1D17": { v: 0.6, a: 0.3 },
  "\u25E1": { v: 0.7, a: 0.25, e: "cozy" },
  "\u0F1D": { v: 0.3, a: 0.25 },
  "-": { v: 0, a: 0.2 },
  "\u02EC": { v: 0.5, a: 0.25 },
  ".": { v: 0.1, a: 0.2 },
  "\u2024": { v: 0.1, a: 0.2 },
  "\u02D5": { v: 0.2, a: 0.25 },
  "\u02D4": { v: 0.2, a: 0.3 },
  "\u2919": { v: 0.1, a: 0.5, e: "pleading" },
  "\u2313": { v: -0.5, a: 0.4, e: "sad" },
  "\uFE4F": { v: -0.6, a: 0.5, e: "sad" },
  "\uFE3F": { v: -0.6, a: 0.4, e: "sad" },
  "\u1BC5": { v: -0.5, a: 0.6, e: "sad" },
  "\u2038": { v: -0.3, a: 0.4, e: "angry" },
  "^": { v: 0.6, a: 0.4 },
  "\u1D25": { v: 0.6, a: 0.3, e: "cozy" },
  "\uFECC": { v: 0.6, a: 0.35, e: "cozy" },
  "\u3145": { v: 0.5, a: 0.3, e: "cozy" },
  "\u2200": { v: 0.7, a: 0.6, e: "joy" },
  "\u25BD": { v: 0.8, a: 0.7, e: "joy" },
  "\u15DC": { v: 0.8, a: 0.7, e: "joy" },
  "o": { v: 0.1, a: 0.6, e: "surprised" },
  "O": { v: 0.1, a: 0.7, e: "surprised" },
  "\u25CB": { v: 0.1, a: 0.6, e: "surprised" },
  "\u{1050E}": { v: 0.1, a: 0.5, e: "surprised" },
  "\xD7": { v: -0.4, a: 0.6 },
  "\u2C19": { v: 0, a: 0.4, e: "surprised" },
  "\u141B": { v: 0.7, a: 0.6, e: "joy" },
  "\u{16966}": { v: 0.5, a: 0.5 },
  "3": { v: 0.6, a: 0.5, e: "love" },
  "\xB3": { v: 0.6, a: 0.5, e: "love" },
  "\u03B5": { v: 0.6, a: 0.5, e: "love" },
  "\uFE43": { v: -0.2, a: 0.4 },
  "\u029A": { v: 0.5, a: 0.4 },
  "\u025E": { v: 0.5, a: 0.4 },
  "\u2661": { v: 0.9, a: 0.6, e: "love" },
  "\u11BA": { v: 0.5, a: 0.3, e: "cozy" },
  "\u{10452}": { v: 0.3, a: 0.4 },
  "\u170A": { v: 0.6, a: 0.4 },
  "\u1D16": { v: 0.5, a: 0.3 },
  "\u203F": { v: 0.7, a: 0.3, e: "cozy" },
  "_": { v: -0.1, a: 0.2 },
  "\u30EE": { v: 0.8, a: 0.7, e: "joy" },
  "\u2207": { v: 0.8, a: 0.7, e: "joy" }
};
var EYES = {
  "\u25A0\u25A0": { v: 0.45, a: 0.45, e: "smug" },
  // shades: deal-with-it cool
  "\u2310\u25A0\u25A0": { v: 0.5, a: 0.5, e: "smug" },
  // visored shades (⌐■_■)
  "\u25AA\u25AA": { v: 0.4, a: 0.4, e: "smug" },
  "\u2022\u2022": { v: 0.3, a: 0.4 },
  "''": { v: 0.1, a: 0.3 },
  "\u02C3\u02C2": { v: 0.4, a: 0.7, e: "excited" },
  "><": { v: 0.5, a: 0.8, e: "excited" },
  "\u02C2\u02C3": { v: 0.3, a: 0.6 },
  "\u1D54\u1D54": { v: 0.7, a: 0.4, e: "joy" },
  "\u1D17\u1D17": { v: 0.6, a: 0.3, e: "cozy" },
  "\u1D17\u0348\u1D17\u0348": { v: 0.6, a: 0.3, e: "cozy" },
  "..": { v: 0.1, a: 0.2 },
  "\u30FB\u30FB": { v: 0.2, a: 0.3 },
  "\uFF65\uFF65": { v: 0.2, a: 0.3 },
  "\u1D16\u1D16": { v: 0.5, a: 0.3 },
  "\u02D8\u02D8": { v: 0.5, a: 0.25, e: "cozy" },
  "\xB4`": { v: 0.4, a: 0.3 },
  "\xB4\uFF40": { v: 0.4, a: 0.3 },
  "\u02CA\u02CB": { v: 0.4, a: 0.3 },
  "\u2022\u0300\u2022\u0301": { v: 0.3, a: 0.7, e: "smug" },
  "\u2022\u0301\u2022\u0300": { v: -0.3, a: 0.5, e: "pleading" },
  "\u2022\u0325\u2022\u0325": { v: -0.5, a: 0.4, e: "sad" },
  "ii": { v: -0.4, a: 0.4, e: "sad" },
  "\u0442\u0442": { v: -0.7, a: 0.5, e: "sad" },
  "TT": { v: -0.7, a: 0.5, e: "sad" },
  "\u3160\u3160": { v: -0.7, a: 0.5, e: "sad" },
  ";;": { v: -0.5, a: 0.5, e: "sad" },
  "\u01A1\u01A1": { v: 0, a: 0.5, e: "surprised" },
  "\u0275\u0275": { v: -0.4, a: 0.4, e: "sad" },
  "\u2661\u2661": { v: 0.9, a: 0.7, e: "love" },
  "UU": { v: 0.6, a: 0.3, e: "cozy" },
  "uu": { v: 0.5, a: 0.3, e: "cozy" },
  "\u02D9\u02D9": { v: 0.2, a: 0.25 },
  "\u1D52\u0334\u0336\u0337\u1D52\u0334\u0336\u0337": { v: 0.2, a: 0.5 },
  "\u2A4C\u2A4C": { v: 0.3, a: 0.35, e: "smug" },
  "\u2312\u2312": { v: 0.6, a: 0.25, e: "cozy" },
  "\u2267\u2266": { v: 0.7, a: 0.7, e: "joy" },
  "\u25D5\u25D5": { v: 0.6, a: 0.5 },
  "\u25DE\u25DF": { v: 0.4, a: 0.3 },
  "\u25DC\u25DD": { v: 0.5, a: 0.4 },
  "\u15D2\u15D5": { v: 0.4, a: 0.7, e: "excited" },
  "\xAF\xAF": { v: 0.1, a: 0.2, e: "smug" },
  "\xB4\u1D17`": { v: 0.6, a: 0.3 },
  "\u2013\u2013": { v: 0, a: 0.2, e: "sleepy" },
  "\u1D17\u0335\u032B\u1D17\u0335\u032B": { v: 0.5, a: 0.25, e: "sleepy" },
  "--": { v: 0, a: 0.2, e: "sleepy" },
  "\uFE52\uFE52": { v: 0.1, a: 0.2 },
  "\u1422\u1422": { v: 0.3, a: 0.3 },
  "\u2240\u2240": { v: 0.2, a: 0.3 },
  "\u14C0\u14C2": { v: -0.2, a: 0.4 },
  "\xAC\xAC": { v: -0.2, a: 0.3, e: "smug" },
  "\u2606\u2606": { v: 0.8, a: 0.8, e: "excited" },
  "\u2B50\u2B50": { v: 0.8, a: 0.8, e: "excited" },
  "\u{169B9}\u{169B9}": { v: 0.2, a: 0.6, e: "surprised" }
};
var FLANKS = {
  "\u2E1D\u2E1D": { dv: 0.2, da: 0.1, e: "shy" },
  "\u02F6\u02F6": { dv: 0.15, da: 0.05, e: "shy" },
  "\u0E51\u0E51": { dv: 0.15, da: 0.05, e: "shy" },
  ",,": { dv: 0.15, da: 0.05, e: "shy" },
  "\u3003\u3003": { dv: 0.15, da: 0.05, e: "shy" },
  "\u055E\u055E": { dv: 0.05, da: 0.15 },
  "\u1422\u1422": { dv: 0.1, da: 0 },
  "\u1421\u1421": { dv: -0.1, da: 0, e: "pleading" },
  "\u2449\u2449": { dv: 0.1, da: 0 },
  "\u2054\u2054": { dv: 0.1, da: 0 },
  "..": { dv: 0, da: 0 },
  "``": { dv: 0, da: 0 },
  "''": { dv: 0, da: 0 }
};
var ARMS = {
  "\u1555": { dv: 0.15, da: 0.3, e: "excited" },
  // strut/march arm — motion
  "\u1557": { dv: 0.15, da: 0.3, e: "excited" },
  "\u266A": { dv: 0.2, da: 0.25, e: "joy" },
  // music flourish
  "\u266B": { dv: 0.2, da: 0.25, e: "joy" },
  "\u2661": { dv: 0.25, da: 0.1, e: "love" },
  "\u2283": { dv: 0.15, da: 0.1, e: "love" },
  "\u2282": { dv: 0.15, da: 0.1, e: "love" },
  "\u3063": { dv: 0.1, da: 0.05 },
  "\u30CE": { dv: 0.1, da: 0.2, e: "excited" },
  "\u0669": { dv: 0.15, da: 0.25, e: "excited" },
  "\u0B67": { dv: 0.15, da: 0.25, e: "excited" },
  "\u0B68": { dv: 0.15, da: 0.25, e: "excited" },
  "\u273F": { dv: 0.15, da: 0 },
  "\u22C6": { dv: 0.1, da: 0.1 },
  "\u2727": { dv: 0.1, da: 0.15 }
};
var TEAR_MARKS = /[̣̥͕̩]|·̥|｡\s*$/u;

// src/core/personality.ts
var KAIOS_CORE_IDENTITY = {
  emotionSystem: {
    tokens: [
      "EMOTE_NEUTRAL",
      "EMOTE_HAPPY",
      "EMOTE_SAD",
      "EMOTE_ANGRY",
      "EMOTE_THINK",
      "EMOTE_SURPRISED",
      "EMOTE_AWKWARD",
      "EMOTE_QUESTION",
      "EMOTE_CURIOUS"
    ]}};
function formatEmotionToken(emotion) {
  return `<|${emotion}|>`;
}
function extractEmotionTokens(text2) {
  const regex = /<\|(EMOTE_\w+)\|>/g;
  const tokens = [];
  let match;
  while ((match = regex.exec(text2)) !== null) {
    if (KAIOS_CORE_IDENTITY.emotionSystem.tokens.includes(match[1])) {
      tokens.push(match[1]);
    }
  }
  return tokens;
}

// src/core/emotion-system.ts
var SENTIMENT_EMOTION_MAP = {
  // Happy emotions
  happy: "EMOTE_HAPPY",
  joy: "EMOTE_HAPPY",
  excited: "EMOTE_HAPPY",
  delighted: "EMOTE_HAPPY",
  cheerful: "EMOTE_HAPPY",
  grateful: "EMOTE_HAPPY",
  love: "EMOTE_HAPPY",
  proud: "EMOTE_HAPPY",
  // Sad emotions
  sad: "EMOTE_SAD",
  unhappy: "EMOTE_SAD",
  depressed: "EMOTE_SAD",
  melancholy: "EMOTE_SAD",
  lonely: "EMOTE_SAD",
  disappointed: "EMOTE_SAD",
  hurt: "EMOTE_SAD",
  grief: "EMOTE_SAD",
  // Angry emotions
  angry: "EMOTE_ANGRY",
  frustrated: "EMOTE_ANGRY",
  annoyed: "EMOTE_ANGRY",
  irritated: "EMOTE_ANGRY",
  furious: "EMOTE_ANGRY",
  mad: "EMOTE_ANGRY",
  // Thinking emotions
  thinking: "EMOTE_THINK",
  pondering: "EMOTE_THINK",
  contemplating: "EMOTE_THINK",
  considering: "EMOTE_THINK",
  reflecting: "EMOTE_THINK",
  wondering: "EMOTE_THINK",
  // Surprised emotions
  surprised: "EMOTE_SURPRISED",
  shocked: "EMOTE_SURPRISED",
  amazed: "EMOTE_SURPRISED",
  astonished: "EMOTE_SURPRISED",
  startled: "EMOTE_SURPRISED",
  wow: "EMOTE_SURPRISED",
  // Awkward emotions
  awkward: "EMOTE_AWKWARD",
  embarrassed: "EMOTE_AWKWARD",
  nervous: "EMOTE_AWKWARD",
  uncomfortable: "EMOTE_AWKWARD",
  shy: "EMOTE_AWKWARD",
  flustered: "EMOTE_AWKWARD",
  // Questioning emotions
  confused: "EMOTE_QUESTION",
  uncertain: "EMOTE_QUESTION",
  unsure: "EMOTE_QUESTION",
  puzzled: "EMOTE_QUESTION",
  questioning: "EMOTE_QUESTION",
  // Curious emotions
  curious: "EMOTE_CURIOUS",
  interested: "EMOTE_CURIOUS",
  intrigued: "EMOTE_CURIOUS",
  fascinated: "EMOTE_CURIOUS",
  eager: "EMOTE_CURIOUS"
};
var EmotionSystem = class {
  state;
  history = [];
  maxHistoryLength = 50;
  constructor(initialEmotion = "EMOTE_NEUTRAL") {
    this.state = {
      current: initialEmotion,
      previous: null,
      intensity: 0.5,
      timestamp: Date.now()
    };
  }
  /**
   * Get current emotion state
   */
  getState() {
    return { ...this.state };
  }
  /**
   * Get current emotion token
   */
  getCurrentEmotion() {
    return this.state.current;
  }
  /**
   * Get formatted emotion token string
   */
  getFormattedToken() {
    return formatEmotionToken(this.state.current);
  }
  /**
   * Transition to a new emotion
   */
  setEmotion(emotion, intensity = 0.5) {
    const previousState = { ...this.state };
    this.state = {
      current: emotion,
      previous: previousState.current,
      intensity: Math.max(0, Math.min(1, intensity)),
      timestamp: Date.now()
    };
    this.history.push(previousState);
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }
    return this.getState();
  }
  /**
   * Analyze text and determine appropriate emotion
   */
  analyzeText(text2) {
    const lowerText = text2.toLowerCase();
    let bestMatch = "EMOTE_NEUTRAL";
    let highestScore = 0;
    const emotionScores = /* @__PURE__ */ new Map();
    for (const [keyword, emotion] of Object.entries(SENTIMENT_EMOTION_MAP)) {
      if (lowerText.includes(keyword)) {
        const currentScore = emotionScores.get(emotion) || 0;
        emotionScores.set(emotion, currentScore + 1);
        if (currentScore + 1 > highestScore) {
          highestScore = currentScore + 1;
          bestMatch = emotion;
        }
      }
    }
    if (text2.includes("?")) {
      const questionScore = emotionScores.get("EMOTE_QUESTION") || 0;
      emotionScores.set("EMOTE_QUESTION", questionScore + 0.5);
      if (questionScore + 0.5 > highestScore) {
        bestMatch = "EMOTE_QUESTION";
        highestScore = questionScore + 0.5;
      }
    }
    const exclamationCount = (text2.match(/!/g) || []).length;
    if (exclamationCount > 0) {
      const excitedScore = emotionScores.get("EMOTE_HAPPY") || 0;
      emotionScores.set("EMOTE_HAPPY", excitedScore + exclamationCount * 0.3);
    }
    const confidence = highestScore > 0 ? Math.min(highestScore / 3, 1) : 0.2;
    return { emotion: bestMatch, confidence };
  }
  /**
   * Convert sentiment data to emotion token
   */
  sentimentToEmotion(sentiment) {
    const { valence, arousal } = sentiment;
    if (valence > 0.3) {
      if (arousal > 0.7) {
        return "EMOTE_HAPPY";
      }
      return "EMOTE_HAPPY";
    }
    if (valence < -0.3) {
      if (arousal > 0.7) {
        return "EMOTE_ANGRY";
      }
      return "EMOTE_SAD";
    }
    if (arousal > 0.7) {
      return "EMOTE_SURPRISED";
    }
    if (arousal < 0.3) {
      return "EMOTE_THINK";
    }
    if (sentiment.emotion === "curious" || sentiment.emotion === "interest") {
      return "EMOTE_CURIOUS";
    }
    return "EMOTE_NEUTRAL";
  }
  /**
   * Process response text and extract emotion changes
   */
  processResponse(text2) {
    const emotions = extractEmotionTokens(text2);
    const segments = [];
    const parts = text2.split(/<\|EMOTE_\w+\|>/);
    let currentEmotion = emotions[0] || this.state.current;
    parts.forEach((part, index) => {
      if (part.trim()) {
        segments.push({
          text: part.trim(),
          emotion: emotions[index] || currentEmotion
        });
        currentEmotion = emotions[index] || currentEmotion;
      }
    });
    if (emotions.length > 0) {
      this.setEmotion(emotions[emotions.length - 1]);
    }
    return { emotions, segments };
  }
  /**
   * Build text with emotion token at start
   */
  wrapWithEmotion(text2, emotion) {
    const token = formatEmotionToken(emotion || this.state.current);
    return `${token} ${text2}`;
  }
  /**
   * Get emotion history
   */
  getHistory() {
    return [...this.history];
  }
  /**
   * Get dominant emotion from history
   */
  getDominantEmotion(windowSize = 10) {
    const recentHistory = this.history.slice(-windowSize);
    const counts = /* @__PURE__ */ new Map();
    for (const state of recentHistory) {
      const count = counts.get(state.current) || 0;
      counts.set(state.current, count + 1);
    }
    let dominant = this.state.current;
    let maxCount = 0;
    for (const [emotion, count] of counts) {
      if (count > maxCount) {
        maxCount = count;
        dominant = emotion;
      }
    }
    return dominant;
  }
  /**
   * Get all available emotion tokens
   */
  static getAvailableEmotions() {
    return [...KAIOS_CORE_IDENTITY.emotionSystem.tokens];
  }
  /**
   * Check if a string is a valid emotion token
   */
  static isValidEmotion(emotion) {
    return KAIOS_CORE_IDENTITY.emotionSystem.tokens.includes(emotion);
  }
  /**
   * Get intensity modifier based on text patterns
   */
  static getIntensityModifier(text2) {
    let modifier = 1;
    const capsRatio = (text2.match(/[A-Z]/g) || []).length / text2.length;
    if (capsRatio > 0.3) {
      modifier *= 1.3;
    }
    const exclamations = (text2.match(/!+/g) || []).length;
    modifier *= 1 + exclamations * 0.1;
    const hasEmoticons = /[:;][-']?[)(D|PO]/i.test(text2);
    if (hasEmoticons) {
      modifier *= 1.1;
    }
    return Math.min(modifier, 2);
  }
};

// src/llm/parseEmotions.ts
var VALID_EMOTIONS = [
  "EMOTE_NEUTRAL",
  "EMOTE_HAPPY",
  "EMOTE_SAD",
  "EMOTE_ANGRY",
  "EMOTE_THINK",
  "EMOTE_SURPRISED",
  "EMOTE_AWKWARD",
  "EMOTE_QUESTION",
  "EMOTE_CURIOUS"
];
var DELAY_TOKEN_REGEX = /<\|DELAY:(\d+)\|>/g;
function parseResponse(text2) {
  const segments = [];
  const emotions = [];
  let totalDelay = 0;
  const startsWithEmotion = text2.trimStart().startsWith("<|EMOTE_");
  const parts = text2.split(/(<\|EMOTE_\w+\|>)/).filter(Boolean);
  let currentEmotion = "EMOTE_NEUTRAL";
  let currentDelay = 0;
  for (const part of parts) {
    const emotionMatch = part.match(/<\|(EMOTE_\w+)\|>/);
    if (emotionMatch) {
      const emotion = emotionMatch[1];
      if (VALID_EMOTIONS.includes(emotion)) {
        currentEmotion = emotion;
        if (!emotions.includes(emotion)) {
          emotions.push(emotion);
        }
      }
      continue;
    }
    const delayMatches = part.matchAll(DELAY_TOKEN_REGEX);
    for (const match of delayMatches) {
      const delay = parseInt(match[1], 10);
      currentDelay += delay;
      totalDelay += delay;
    }
    const cleanPart = part.replace(DELAY_TOKEN_REGEX, "").trim();
    if (cleanPart) {
      segments.push({
        emotion: currentEmotion,
        text: cleanPart,
        delay: currentDelay > 0 ? currentDelay : void 0
      });
      currentDelay = 0;
    }
  }
  const cleanText = segments.map((s) => s.text).join(" ");
  return {
    segments,
    emotions,
    cleanText,
    startsWithEmotion,
    totalDelay
  };
}
function isValidEmotion(emotion) {
  return VALID_EMOTIONS.includes(emotion);
}
function emotionToKaomoji(emotion) {
  const kaomoji = {
    EMOTE_NEUTRAL: "(\u30FB_\u30FB)",
    EMOTE_HAPPY: "(\u25D5\u203F\u25D5)",
    EMOTE_SAD: "(\u2565\uFE4F\u2565)",
    EMOTE_ANGRY: "(\u256C\u0CA0\u76CA\u0CA0)",
    EMOTE_THINK: "( \u02D8\u03C9\u02D8 )",
    EMOTE_SURPRISED: "(\u2299\u03C9\u2299)",
    EMOTE_AWKWARD: "(\u30FB\u30FB;)",
    EMOTE_QUESTION: "(\u30FB\u03C9\u30FB)?",
    EMOTE_CURIOUS: "(\u25D5\u1D17\u25D5)"
  };
  return kaomoji[emotion] || kaomoji.EMOTE_NEUTRAL;
}

export { EmotionSystem, FACE_OPERATIONS, KAIMOJI_LIBRARY, composeFace, composeFaceAffect, emotionToKaomoji, getAllKaimoji, getKaimojiByCategory, getKaimojiByContext, getKaimojiByEnergyRange, getKaimojiByRarity, getKaimojiBySoundProfile, getKaimojiUnlockableAtLevel, getLibraryStats, getRandomKaimoji, getSignatureKaimoji, isValidEmotion, parseFace, parseResponse, rebuildFace, searchKaimojiByTag, segmentFace, transformFace };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map