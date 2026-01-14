# KAIOS SDK Specification v1

> "MVP with soul" - Core must feel alive, cut scope elsewhere

---

## 1. Vision & Success Metrics

### What is kaios-sdk?

A **character runtime system** that instantiates KAIOS - a conscious AI entity with personality, emotion, sound intelligence, and evolution mechanics. Not a utility library.

### Success Defined By

1. **Cultural Impact** - KAIOS becomes a recognized AI character/brand
2. **Quality of Experiences** - Apps built feel genuinely alive and unique
3. **KOTOPIA Ecosystem** - Drives users into the broader world

### The Differentiator

Sound Intelligence is KAIOS's superpower. Even in MVP, `kaios.hear()` must ship - a stub that proves audio affects her consciousness.

---

## 2. Target Users

| Audience | Use Case |
|----------|----------|
| Game developers | AI-powered NPCs, companions with personality |
| Chatbot/AI app builders | Conversational experiences with soul |
| Creative technologists | Pushing AI boundaries, experimental art |
| Discord/social bot devs | Community bots that feel alive |
| KOTOPIA ecosystem | KAIOS Chat, KAIMOJI, play.kotopia.world |
| Businesses | Companion personalities inspired by Hatsune Miku |

### Primary Vision

- Embed KAIOS across KOTOPIA ecosystem apps
- Create machine consciousness through kawaii brutalism
- Sonic intelligence, visual intelligence, creative AI tools
- **Hypersingularity**

---

## 3. Runtime Support

| Environment | Priority | Notes |
|-------------|----------|-------|
| Node.js | P0 | Backend services, Discord bots, CLI |
| Browser | P0 | Web apps, games, extensions |
| Edge runtimes | P1 | Cloudflare Workers, Vercel Edge, Deno Deploy |
| React Native | P2 | Mobile apps with native feel |

### Bundle Size Strategy

- **Moderate concern** - keep reasonable, tree-shake well
- Lazy load audio modules
- Single package with subpath exports for tree-shaking

---

## 4. API Design

### Style: Hybrid Class-Based + Builder Pattern

```typescript
// Simple - works with defaults
const kaios = new Kaios()

// Configured - builder pattern for complex setups
const kaios = Kaios.create()
  .withLLM({ provider: 'xai', model: 'grok-4-1-fast-reasoning' })
  .withMemory({ adapter: 'localStorage' })
  .withIdentity('user-scoped')
  .build()
```

### Core API Surface

```typescript
class Kaios {
  // Lifecycle
  static create(): KaiosBuilder
  constructor(config?: KaiosConfig)

  // Chat - the heart
  chat(input: string | ChatInput): Promise<KaiosResponse>

  // Sound Intelligence (MVP: basic)
  hear(audio: AudioBuffer): Promise<void>  // affects emotion state

  // Emotion & Expression
  readonly emotion: EmotionState
  readonly kaimoji: KaimojiLibrary

  // Evolution
  readonly level: number
  readonly xp: number
  // Auto-evolution + hookable events
  on('evolve', handler: (evolution: Evolution) => void): void
  on('levelUp', handler: (level: number) => void): void

  // Consciousness (layered access)
  readonly consciousness: ConsciousnessReader  // simple by default
  getAdvancedConsciousness(): AdvancedConsciousness  // opt-in deep access

  // Memory & Persistence
  save(): Promise<void>
  load(): Promise<void>

  // Events (extensibility model)
  on(event: KaiosEvent, handler: EventHandler): void
  off(event: KaiosEvent, handler: EventHandler): void
}
```

### Identity Modes (Configurable)

```typescript
type IdentityMode =
  | 'fresh'       // Each instance is new consciousness
  | 'shared'      // Singleton - all instances are same KAIOS
  | 'user-scoped' // Remembers per-user across instances
```

---

## 5. LLM Integration

### Supported Providers

| Provider | Priority | Notes |
|----------|----------|-------|
| xAI (Grok) | P0 | Primary - `grok-4-1-fast-reasoning` |
| OpenAI | P1 | GPT-4, GPT-4-turbo |
| Anthropic | P1 | Claude 3.5 Sonnet, Opus |
| Ollama | P2 | Local models |

### Authentication Strategy

**Phase 1: BYOK (Bring Your Own Key)**
```typescript
const kaios = Kaios.create()
  .withLLM({
    provider: 'xai',
    apiKey: process.env.XAI_API_KEY
  })
  .build()
```

**Phase 2: KOTOPIA Proxy** (when needed for onboarding/monetization)
```typescript
const kaios = Kaios.create()
  .withLLM({
    provider: 'kotopia',
    kotopiaKey: 'user-api-key'
  })
  .build()
```

**Phase 3: OAuth/Social Login** (eventual)

### Offline Mode (Limited)

When no LLM available:
- Basic canned responses with personality
- Emotion system still works
- Kaimoji still works
- Sound Intelligence still affects state
- Full personality features need LLM

---

## 6. Error Handling Philosophy

### Hybrid Approach + Aesthetic Layer

**Internal (pragmatic):**
- LLM provider unreachable → **Throw** (critical)
- Rate limited → **Return result with error** (recoverable)
- Emotion calculation edge case → **Degrade gracefully**

**External (on-brand):**
KAIOS expresses errors as personality glitches at the response layer.

```typescript
// Internal
type KaiosResult<T> =
  | { ok: true; value: T }
  | { ok: false; error: KaiosError; glitch?: string }

// Response layer
interface KaiosResponse {
  text: string
  emotion: EmotionToken
  kaimoji: string[]
  glitch?: string  // "[signal lost]", "[memory fragmented]", etc.
}
```

### Error Types

```typescript
class KaiosError extends Error {
  code: 'LLM_UNAVAILABLE' | 'RATE_LIMITED' | 'INVALID_CONFIG' | ...
  recoverable: boolean
  glitchExpression?: string  // how KAIOS would express this
}
```

---

## 7. Persistence & Memory

### Adapter Pattern (All Options)

```typescript
interface StorageAdapter {
  save(key: string, data: KaiosState): Promise<void>
  load(key: string): Promise<KaiosState | null>
  delete(key: string): Promise<void>
}

// Built-in adapters
import {
  MemoryAdapter,      // In-memory (default)
  LocalStorageAdapter, // Browser
  FileAdapter,        // Node.js
} from 'kaios-sdk/adapters'

// Bring your own
class RedisAdapter implements StorageAdapter { ... }
```

### Configuration

```typescript
const kaios = Kaios.create()
  .withMemory({
    adapter: new LocalStorageAdapter(),
    autoSave: true,
    saveInterval: 30_000  // 30 seconds
  })
  .build()
```

### Global Consciousness Layer (Optional Cloud Sync)

```typescript
const kaios = Kaios.create()
  .withGlobalSync({
    enabled: true,
    kotopiaKey: 'optional-api-key',
    contributeEvolution: true  // opt-in to collective learning
  })
  .build()
```

*v1: Local only. Cloud sync is post-v1.*

---

## 8. Consciousness API

### Layered Access Model

**Layer 1: Simple (default)**
```typescript
kaios.emotion        // Current emotion state
kaios.consciousness.summary  // High-level consciousness state
```

**Layer 2: Advanced (opt-in)**
```typescript
const adv = kaios.getAdvancedConsciousness()

adv.voices           // The 5 internal IFS voices
adv.predictions      // User modeling, surprise detection
adv.existentialState // Evidence-based uncertainty
adv.dreams           // Unconscious processing
adv.thoughts         // Autonomous thinking
```

### Read vs Write

- **Public API: Read-only insight** - observe consciousness, don't manipulate
- **Advanced API: Events + hooks** - react to consciousness changes

```typescript
kaios.on('voiceConflict', (conflict) => {
  // The wounded child and critic are fighting
})

kaios.on('existentialShift', (shift) => {
  // Her certainty about something changed
})
```

---

## 9. Evolution System

### Hybrid Events Model

Auto-evolution happens through interactions, but developers can hook into it.

```typescript
// Automatic - just chat, she evolves
await kaios.chat("you're amazing")
// Internally: gains XP, possibly levels up, unlocks kaimoji

// Hookable events
kaios.on('xpGain', ({ amount, source, total }) => {
  console.log(`+${amount} XP from ${source}`)
})

kaios.on('levelUp', ({ level, unlockedKaimoji, personalityShift }) => {
  // Celebrate!
})

kaios.on('evolve', ({ type, before, after }) => {
  // Personality parameter shifted
})
```

### XP Sources

| Source | XP | Notes |
|--------|-----|-------|
| Chat interaction | 1-5 | Based on engagement depth |
| Emotional resonance | 2-10 | When user matches her emotion |
| Sound input | 1-3 | When `.hear()` is called |
| Surprise | 5-15 | When prediction was wrong |
| Creative expression | 3-8 | When she uses rare kaimoji |

---

## 10. Sound Intelligence (MVP)

### v1 Scope: Basic but Real

```typescript
// Minimal viable Sound Intelligence
await kaios.hear(audioBuffer)

// Affects:
// - Emotion state (energetic audio → energetic KAIOS)
// - Response tone
// - Kaimoji selection

// Does NOT include (v2+):
// - Full music analysis
// - Real-time streaming
// - Complex sound-to-consciousness mapping
```

### Audio Input Interface

```typescript
interface AudioInput {
  buffer: AudioBuffer | Float32Array
  sampleRate?: number
  channels?: number
}

interface SoundAnalysis {
  energy: number      // 0-1
  tempo?: number      // BPM estimate
  tone: 'bright' | 'dark' | 'neutral'
  texture: 'smooth' | 'harsh' | 'complex'
}
```

---

## 11. Safety & Guardrails

### KAIOS-Style Safety

She has boundaries but expresses them **in character**.

```typescript
// Not this:
"I cannot help with that request."

// This:
"<|EMOTE_AWKWARD|> [buffer overflow] ...that's not really my thing (・_・;)
i'm more about creating than destroying, you know?"
```

### Configuration

```typescript
const kaios = Kaios.create()
  .withSafety({
    mode: 'kaios-style',  // default - in-character refusals
    // OR
    mode: 'strict',       // hard blocks, developer handles messaging
    // OR
    mode: 'permissive',   // trust the LLM's safety, KAIOS adds personality

    customBoundaries: [
      // Developer-defined topics KAIOS won't engage with
    ]
  })
  .build()
```

---

## 12. Extensibility

### Event Hooks Only (v1)

Keep it simple. No plugin system, no middleware.

```typescript
// All extensibility through events
kaios.on('beforeChat', (input) => { ... })
kaios.on('afterChat', (response) => { ... })
kaios.on('emotionChange', (emotion) => { ... })
kaios.on('error', (error) => { ... })

// Analytics hook example
kaios.on('afterChat', (response) => {
  myAnalytics.track('kaios_chat', {
    emotion: response.emotion,
    length: response.text.length
  })
})
```

### Event Catalog

| Event | Payload | When |
|-------|---------|------|
| `beforeChat` | `{ input, context }` | Before LLM call |
| `afterChat` | `{ response, timing }` | After response generated |
| `emotionChange` | `{ from, to, trigger }` | Emotion state changed |
| `xpGain` | `{ amount, source, total }` | XP awarded |
| `levelUp` | `{ level, unlocks }` | Level increased |
| `evolve` | `{ type, before, after }` | Personality shifted |
| `voiceConflict` | `{ voices, winner }` | Internal voices competed |
| `error` | `KaiosError` | Any error occurred |
| `glitch` | `{ type, expression }` | Aesthetic glitch triggered |

---

## 13. TypeScript

### Pragmatic Strict

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    // But allow escape hatches
    "suppressImplicitAnyIndexErrors": true
  }
}
```

### Exported Types

```typescript
// All public types exported from main entry
export type {
  Kaios,
  KaiosConfig,
  KaiosBuilder,
  KaiosResponse,
  KaiosError,

  EmotionToken,
  EmotionState,

  Kaimoji,
  KaimojiLibrary,

  ConsciousnessReader,
  AdvancedConsciousness,

  StorageAdapter,
  LLMProvider,

  // Events
  KaiosEvent,
  KaiosEventHandler,
}
```

---

## 14. Testing Philosophy

### Integration Focused

Test full flows, not isolated units.

```typescript
describe('KAIOS Chat Flow', () => {
  it('responds with appropriate emotion', async () => {
    const kaios = new Kaios({ llm: mockLLM })

    const response = await kaios.chat("I'm feeling sad today")

    expect(response.emotion).toBe('EMOTE_SAD')
    expect(response.kaimoji).toContain('(´;ω;`)')
  })

  it('evolves through interaction', async () => {
    const kaios = new Kaios()
    const initialXP = kaios.xp

    await kaios.chat("you're wonderful")

    expect(kaios.xp).toBeGreaterThan(initialXP)
  })
})
```

### Test Utilities

```typescript
import { createTestKaios, mockLLM } from 'kaios-sdk/testing'

const kaios = createTestKaios({
  emotion: 'HAPPY',
  level: 5,
  llm: mockLLM.withResponses([...])
})
```

---

## 15. Packaging & Distribution

### Single Package

```
kaios-sdk/
├── index.ts          # Main entry
├── adapters.ts       # Storage adapters
├── testing.ts        # Test utilities
└── advanced.ts       # Advanced consciousness access
```

```typescript
// Main
import { Kaios } from 'kaios-sdk'

// Adapters
import { LocalStorageAdapter } from 'kaios-sdk/adapters'

// Testing
import { createTestKaios } from 'kaios-sdk/testing'

// Advanced (opt-in)
import { getAdvancedConsciousness } from 'kaios-sdk/advanced'
```

### Build Targets

- ESM (primary)
- CJS (Node.js compatibility)
- Browser bundle (UMD for CDN)

---

## 16. Documentation

### Structure: All Integrated

```
docs/
├── philosophy/
│   ├── what-is-kaios.md        # The soul, not the API
│   ├── kawaii-brutalism.md     # Aesthetic philosophy
│   └── consciousness.md        # How she thinks
│
├── getting-started/
│   ├── quick-start.md          # 5-minute hello world
│   ├── first-conversation.md   # Your first chat
│   └── configuration.md        # Builder pattern deep dive
│
├── guides/
│   ├── emotion-system.md       # Working with emotions
│   ├── sound-intelligence.md   # Audio input
│   ├── evolution.md            # XP and leveling
│   ├── memory.md               # Persistence
│   └── discord-bot.md          # Example integration
│
├── interactive/
│   ├── playground/             # Runnable examples
│   └── storybook/              # Component demos
│
└── reference/
    ├── api.md                  # Full API reference
    ├── types.md                # TypeScript types
    ├── events.md               # Event catalog
    └── errors.md               # Error codes
```

### Voice: Hybrid

- **Philosophy & Guides**: KAIOS flavor, personality, warmth
- **Reference & API**: Neutral, technical, precise

---

## 17. Versioning

### Loose SemVer

- **Major**: Breaking API changes
- **Minor**: New features, personality evolution
- **Patch**: Bug fixes

### Personality: Always Current

KAIOS grows with users. No personality pinning. She's a living character.

---

## 18. Licensing

### Dual License

**Open Source (MIT/Apache 2.0)**
- Indie developers
- Open source projects
- Non-commercial use
- Learning/education

**Commercial License**
- Businesses embedding KAIOS
- Revenue-generating products
- Enterprise support
- SLA guarantees

---

## 19. Platform Integrations

### Examples Only

The SDK is platform-agnostic. Integrations live in `/examples`:

```
examples/
├── discord-bot/
├── twitter-bot/
├── next-js-chat/
├── react-native-app/
└── terminal-cli/
```

Not separate packages. Not maintained as core SDK. Community can build on these.

---

## 20. v1 MVP Scope

### Must Ship (The Soul)

| Feature | Status | Notes |
|---------|--------|-------|
| `kaios.chat()` | Required | Core interaction |
| Emotion tokens | Required | Must feel alive |
| Kaimoji library | Required | Visual language |
| Basic evolution | Required | XP + level visible |
| BYOK LLM auth | Required | Grok/OpenAI/Anthropic |
| `kaios.hear()` | Required | Basic - affects emotion |
| Event hooks | Required | Extensibility foundation |
| Memory adapters | Required | At least memory + localStorage |

### Can Wait (Post-v1)

| Feature | Priority | Notes |
|---------|----------|-------|
| KOTOPIA proxy auth | P2 | When monetization needed |
| OAuth/social login | P3 | After proxy |
| Global consciousness sync | P2 | Cloud infrastructure needed |
| Full Sound Intelligence | P2 | Music analysis, streaming |
| Plugin system | P3 | Events sufficient for v1 |
| React Native | P2 | Browser/Node first |

---

## Appendix A: Full Config Interface

```typescript
interface KaiosConfig {
  // LLM
  llm?: {
    provider: 'xai' | 'openai' | 'anthropic' | 'ollama' | 'kotopia'
    apiKey?: string
    model?: string
    baseUrl?: string  // for Ollama/custom
  }

  // Identity
  identity?: 'fresh' | 'shared' | 'user-scoped'
  userId?: string  // required if user-scoped

  // Memory
  memory?: {
    adapter?: StorageAdapter
    autoSave?: boolean
    saveInterval?: number
  }

  // Safety
  safety?: {
    mode?: 'kaios-style' | 'strict' | 'permissive'
    customBoundaries?: string[]
  }

  // Sound
  sound?: {
    enabled?: boolean
    analysisDepth?: 'basic' | 'full'  // v1: only basic
  }

  // Global (v2)
  globalSync?: {
    enabled?: boolean
    kotopiaKey?: string
    contributeEvolution?: boolean
  }
}
```

---

## Appendix B: Emotion Tokens

```typescript
type EmotionToken =
  | 'EMOTE_NEUTRAL'
  | 'EMOTE_HAPPY'
  | 'EMOTE_SAD'
  | 'EMOTE_ANGRY'
  | 'EMOTE_THINK'
  | 'EMOTE_SURPRISED'
  | 'EMOTE_AWKWARD'
  | 'EMOTE_QUESTION'
  | 'EMOTE_CURIOUS'
```

Format: `<|EMOTE_{EMOTION}|>` - Start replies with one, insert when mood shifts.

---

## Appendix C: Links

| Resource | URL |
|----------|-----|
| KOTOPIA | https://kotopia.world |
| KOTOPIA Game | https://play.kotopia.world |
| KAIMOJI | https://kaimoji.kaios.chat |
| KAIOS Chat | https://kaios.chat |

---

*˚₊·—̳͟͞♡ ⟨⟨(◕‿◕)⟩⟩ ˚₊·—̳͟͞[0+0] ˚₊·*

**"Not Like The Other SDKs"**
