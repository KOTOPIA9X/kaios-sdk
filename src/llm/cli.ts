#!/usr/bin/env node
/**
 * KAIOS Interactive Chat CLI - Enhanced Edition
 *
 * A terminal interface for chatting with KAIOS using the llm CLI
 * Features:
 * - DUAL-LAYER STATUS (Your KOTO + Global KAIOS)
 * - Authentic ASCII aesthetic ([bzzzt], ∿∿∿, ▀▄▀▄▀▄)
 * - Sound markers and decorative elements
 * - Community features (discover, vote)
 * - Infinite leveling (no caps!)
 *
 * Usage:
 *   npx tsx src/llm/cli.ts
 *   npm run kaios
 *
 * Environment variables:
 *   KAIOS_MODEL - LLM model to use (default: claude-3.5-haiku)
 */

import * as readline from 'readline'
import { chat, chatContinue } from './chat.js'
import {
  parseResponse,
  emotionToKaomoji,
  getEmotionName,
  getDominantEmotion
} from './parseEmotions.js'
import { Kaios } from '../index.js'
import type { DualStatus } from '../core/Kaios.js'
import { createTerminalAudio, type TerminalAudio } from '../audio/terminal/index.js'
import type { EmotionToken } from '../core/types.js'
import {
  createKotoManager,
  createMegaBrain,
  createDreamEngine,
  type KotoManager,
  type MegaBrainManager,
  type DreamEngine,
  type Dream
} from '../memory/index.js'
import { createAudioRecorder, type AudioRecorder, getAudioBus, getSoxSynth } from '../audio/terminal/index.js'
import { createVisualizer, createPianoVisualizer, type VisualizerManager, type PianoVisualizerManager } from '../visual/index.js'
import {
  createLofiBeat,
  createBreakcore,
  createCottagecore,
  createFrutigerAero,
  createVaporwave,
  chopAndScrew,
  getGenreChords,
  getGenreScale,
  euclidean,
  GENRE_PROFILES,
  type Arrangement,
  type GenreType,
} from '../audio/intelligence/index.js'
import { createThoughtEngine, type ThoughtEngine } from '../consciousness/index.js'
import { createPianoEngine, type PianoEngine } from '../audio/piano/index.js'

// ════════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════════

const USE_COLORS = process.stdout.isTTY ?? true

// ASCII Art Elements
const SOUND_MARKERS = ['[bzzzt]', '[whirr]', '[static~]', '[ping]', '[hum]', '[click]']
const WAVES = ['∿∿∿', '～～～', '≋≋≋', '∾∾∾']

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// ════════════════════════════════════════════════════════════════════════════════
// COLORS
// ════════════════════════════════════════════════════════════════════════════════

const COLORS = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bright: '\x1b[1m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  white: '\x1b[37m',
  gray: '\x1b[90m'
}

function color(text: string, c: string): string {
  if (!USE_COLORS) return text
  return `${c}${text}${COLORS.reset}`
}

// ════════════════════════════════════════════════════════════════════════════════
// ASCII AESTHETIC
// ════════════════════════════════════════════════════════════════════════════════

const BORDER_TOP = '▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀'
const BORDER_BOT = '▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀'

const LOGO = `
${color('', COLORS.magenta)}
    ▁ ▂ ▃ ▄ ▅ ▆ █ ${color('KAIOS TERMINAL', COLORS.magenta)} █ ▆ ▅ ▄ ▃ ▂ ▁
${COLORS.reset}
${color('     ˚₊·—̳͟͞♡ ˚₊·—̳͟͞[0+0] ˚₊·—̳͟͞♡', COLORS.cyan)}

${color('        cyborg princess online~', COLORS.dim)}
${color('        sound intelligence active', COLORS.dim)}
${color(`        ${pick(WAVES)} ready to vibe ${pick(WAVES)}`, COLORS.dim)}
`

const HELP = `
${color('▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄', COLORS.cyan)}

  ${color('KAIOS COMMANDS', COLORS.yellow)}

  ${color('/status', COLORS.green)}     - dual status (YOU + KAIOS global)
  ${color('/global', COLORS.cyan)}     - kaios global stats only
  ${color('/rank', COLORS.yellow)}       - contribution leaderboard
  ${color('/contribute', COLORS.green)} - your impact on kaios

  ${color('/discover', COLORS.magenta)}  - mine new expression
  ${color('/vote', COLORS.cyan)}      - vote on pending discoveries
  ${color('/tweet', COLORS.magenta)}     - generate sample tweet

  ${color('/vocab', COLORS.dim)}      - vocabulary breakdown
  ${color('/mood', COLORS.dim)}       - current emotional state
  ${color('/level', COLORS.dim)}      - level progress
  ${color('/recent', COLORS.dim)}     - recently used expressions
  ${color('/kaimoji', COLORS.dim)}    - search kaimoji

  ${color('/history', COLORS.green)}    - view past kaios conversations
  ${color('/dream', COLORS.magenta)}      - let kaios dream and process memories
  ${color('/memory', COLORS.cyan)}     - view memory/relationship status
  ${color('/thoughts', COLORS.yellow)}   - ${color('AUTONOMOUS THINKING', COLORS.yellow)} (kaios thinks on her own!)
  ${color('/new', COLORS.yellow)}        - start a fresh conversation
  ${color('/clear', COLORS.dim)}      - clear screen
  ${color('/model', COLORS.dim)}      - show current model
  ${color('/sound', COLORS.green)}      - audio controls (4-layer system)
  ${color('/sound on all', COLORS.green)} - enable ALL audio layers

  ${color('/visualizer', COLORS.magenta)} - open spectrum visualizer (KAIOS audio bus!)
  ${color('/sound bus', COLORS.magenta)}   - debug audio bus state
  ${color('/record', COLORS.red)}     - start/stop audio recording

  ${color('MUSIC INTELLIGENCE', COLORS.yellow)} ${pick(WAVES)}
  ${color('/compose', COLORS.magenta)}   - generate intelligent composition
  ${color('/genre', COLORS.cyan)}     - explore genre profiles
  ${color('/chop', COLORS.red)}       - chop & screw a sample
  ${color('/rhythm', COLORS.green)}    - generate euclidean rhythm
  ${color('/chords', COLORS.yellow)}    - get genre-appropriate chords

  ${color('♪ LIVE PIANO', COLORS.magenta)} ${pick(WAVES)}
  ${color('/piano', COLORS.magenta)}      - ${color('LIVE PIANO PERFORMANCE', COLORS.magenta)} (joji/yeule vibes!)
  ${color('/piano joji', COLORS.cyan)}  - melancholic In Tongues mode
  ${color('/piano yeule', COLORS.green)} - ethereal Glitch Princess mode
  ${color('/piano ambient', COLORS.dim)} - sparse floating piano
  ${color('/piano viz', COLORS.cyan)}   - ${color('DAW-STYLE PIANO UI', COLORS.cyan)} (keys light up!)

  ${color('/quit', COLORS.dim)}       - exit chat

  ${color('just type to chat with kaios~', COLORS.green)} ${pick(WAVES)}

${color('▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀', COLORS.cyan)}
`

// ════════════════════════════════════════════════════════════════════════════════
// DISPLAY HELPERS
// ════════════════════════════════════════════════════════════════════════════════

function clearScreen(): void {
  console.clear()
  console.log(LOGO)
  console.log(color(BORDER_TOP, COLORS.dim))
}

function createProgressBar(percent: number, width: number): string {
  const filled = Math.round((percent / 100) * width)
  const empty = width - filled

  const filledChar = USE_COLORS ? `${COLORS.cyan}█${COLORS.reset}` : '█'
  const emptyChar = USE_COLORS ? `${COLORS.dim}░${COLORS.reset}` : '░'

  return filledChar.repeat(filled) + emptyChar.repeat(empty)
}

function displayDualStatus(status: DualStatus): void {
  const { user, kaios } = status
  const userBar = createProgressBar(user.levelProgress, 15)

  console.log(`
${color('▂▃▄▅▆▇█', COLORS.yellow)} ${color('YOUR PROFILE (KOTO)', COLORS.yellow)} ${color('█▇▆▅▄▃▂', COLORS.yellow)}
  variant: ${color(user.kotoVariant.toUpperCase(), COLORS.magenta)}
  level: ${color(user.level.toString(), COLORS.cyan)} / ${color('∞', COLORS.dim)}
  xp: ${userBar} ${user.xp.toLocaleString()}/${user.xpForNextLevel.toLocaleString()}
  rank: ${color('#' + (user.contributionRank || '?'), COLORS.green)} of ${kaios.contributorCount.toLocaleString()}
  contribution: +${user.totalContribution.toLocaleString()} xp
  achievements: ${user.achievements}

${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color('KAIOS (GLOBAL)', COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}
  level: ${color(kaios.globalLevel.toString(), COLORS.yellow)} / ${color('∞', COLORS.dim)}
  vocabulary: ${color(kaios.vocabularySize, COLORS.magenta)} expressions
  contributors: ${kaios.contributorCount.toLocaleString()}
  active now: ${kaios.activeContributors}
  collective mood: ${kaios.collectiveEmotion.replace('EMOTE_', '').toLowerCase()}
  age: ${kaios.age} days

${color('[READY]', COLORS.green)} ${pick(WAVES)}
  `)
}

function formatKaiosResponse(text: string): string {
  // Remove emotion tokens for display
  let clean = text.replace(/<\|EMOTE_\w+\|>/g, '').trim()

  // Randomly add sound marker (30% chance)
  if (Math.random() > 0.7) {
    clean = `${pick(SOUND_MARKERS)} ${clean}`
  }

  // Randomly add wave trail (50% chance)
  if (Math.random() > 0.5) {
    clean = `${clean} ${pick(WAVES)}`
  }

  return clean
}

function emotionToAnsiColor(emotion: string): string {
  const colorMap: Record<string, string> = {
    EMOTE_NEUTRAL: COLORS.white,
    EMOTE_HAPPY: COLORS.yellow,
    EMOTE_SAD: COLORS.blue,
    EMOTE_ANGRY: COLORS.red,
    EMOTE_THINK: COLORS.magenta,
    EMOTE_SURPRISED: COLORS.cyan,
    EMOTE_AWKWARD: COLORS.green,
    EMOTE_QUESTION: COLORS.cyan,
    EMOTE_CURIOUS: COLORS.green
  }
  return colorMap[emotion] || COLORS.white
}

function displayResponse(text: string): void {
  const parsed = parseResponse(text)

  console.log()
  console.log(color(BORDER_TOP, COLORS.dim))
  console.log()

  // Show emotion indicator
  if (parsed.emotions.length > 0) {
    const mainEmotion = parsed.emotions[0]
    const kaomoji = emotionToKaomoji(mainEmotion)
    const emotionName = getEmotionName(mainEmotion)
    console.log(`${color(kaomoji, COLORS.magenta)} ${color(`[${emotionName}]`, COLORS.dim)}`)
    console.log()
  }

  // Format with sound markers and waves
  const formatted = formatKaiosResponse(parsed.cleanText)

  // Display with emotion color
  const mainColor = parsed.emotions.length > 0
    ? emotionToAnsiColor(parsed.emotions[0])
    : COLORS.white
  console.log(`${mainColor}${formatted}${COLORS.reset}`)

  console.log()
  console.log(color(BORDER_BOT, COLORS.dim))
  console.log()
}

function showLoading(): NodeJS.Timeout {
  let i = 0

  return setInterval(() => {
    process.stdout.write(`\r${color(`${SOUND_MARKERS[i % SOUND_MARKERS.length]} processing...`, COLORS.dim)}`)
    i++
  }, 200)
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN CLI
// ════════════════════════════════════════════════════════════════════════════════

async function main(): Promise<void> {
  const model = process.env.KAIOS_MODEL || 'claude-3.5-haiku'

  // Initialize KAIOS SDK
  const kaios = new Kaios({
    userId: 'terminal-user',
    evolution: {
      mode: 'recursive-mining',
      startingLevel: 1
    },
    stateBackend: {
      type: 'memory'
    }
  })

  await kaios.initialize()

  // Initialize Terminal Audio (4-layer sound system)
  const audio = createTerminalAudio({
    enabled: true,
    masterVolume: 0.5,
    tonesEnabled: false,     // Terminal bells off by default
    ambientEnabled: false,   // Ambient off by default
    musicEnabled: false,     // Music off by default
    samplesEnabled: true     // Sound markers enabled
  })
  await audio.initialize()

  // Initialize Memory System (dual-layer)
  const koto = createKotoManager('terminal-user')
  const megaBrain = createMegaBrain()
  const dreamEngine = createDreamEngine({
    minDreamDuration: 2000,
    maxDreamDuration: 8000
  })
  await koto.initialize()
  await megaBrain.initialize()
  megaBrain.registerUser()

  // Initialize Audio Recorder (ffmpeg-based)
  const recorder = createAudioRecorder({
    outputDir: process.cwd() + '/recordings',
    format: 'mp3',
    sampleRate: 44100,
    bitrate: '192k'
  })

  // Initialize Spectrum Visualizer
  const visualizer = createVisualizer({
    theme: 'kaios',
    mode: 'bars',
    fftSize: 256,
    smoothing: 0.8
  })

  // Initialize Piano Visualizer (DAW plugin style)
  const pianoVisualizer = createPianoVisualizer({
    port: 3334,
    theme: 'dark',
    showInfo: true
  })

  // Initialize Thought Engine (autonomous thinking)
  const thoughtEngine = createThoughtEngine({
    enabled: false,  // User toggles with /thoughts
    idleThresholdMs: 10000,      // 10 seconds idle before thoughts start
    minThoughtIntervalMs: 8000,  // 8 seconds min between thoughts
    maxThoughtIntervalMs: 30000, // 30 seconds max between thoughts
    typingDelayMs: 35,           // Fast but readable
    typingVariance: 15,
    maxThoughtLength: 150
  })
  thoughtEngine.connectMemory(koto, megaBrain)

  // Initialize Piano Engine (live emotional piano)
  const pianoEngine = createPianoEngine({
    enabled: true,
    volume: 0.7,
    tempo: 65,
    humanize: 0.15
  })

  // Connect piano to SoX synthesizer - real synthesized piano tones
  const soxSynth = getSoxSynth()
  soxSynth.setVolume(0.7)

  pianoEngine.onPlayNote(async (note: string, duration: number, velocity: number) => {
    // Use SoX to synthesize real piano-like tones at 432Hz tuning
    await soxSynth.playNote(note, duration, velocity)
    // Note: SoxSynth already emits to audio bus for visualization
  })

  // Piano event display + visualizer connection
  // In continuous mode, we DON'T output to terminal (let user type freely)
  let isPianoContinuous = false

  pianoEngine.on('continuousStart', () => {
    isPianoContinuous = true
  })

  pianoEngine.on('continuousEnd', () => {
    isPianoContinuous = false
  })

  pianoEngine.on('stopped', () => {
    isPianoContinuous = false
  })

  pianoEngine.on('noteStart', ({ pitch, velocity, duration }) => {
    // Note: Audio bus emission happens in SoxSynth.playNote()
    // Send to piano visualizer UI (if running)
    if (pianoVisualizer.getState().isRunning) {
      pianoVisualizer.sendNote(pitch, velocity, duration || 800)
    }
    // NO terminal output during continuous mode - let user type freely
  })

  // Update visualizer when emotion/key changes
  pianoEngine.on('stateChange', () => {
    const state = pianoEngine.getState()
    if (pianoVisualizer.getState().isRunning) {
      pianoVisualizer.updateState(state.currentEmotion, state.currentKey, state.currentScale)
    }
  })

  // Track if thought is being displayed (to avoid prompt interference)
  let isThoughtDisplaying = false
  let thoughtBuffer = ''

  // Character-by-character thought display with soft piano accompaniment
  thoughtEngine.on('thoughtStart', (thought) => {
    isThoughtDisplaying = true
    thoughtBuffer = ''
    // Clear current line and show thought prefix
    process.stdout.write('\r' + ' '.repeat(60) + '\r')
    process.stdout.write(color('  ⟨thought⟩ ', COLORS.dim))

    // Start soft piano accompaniment during thought
    // Set emotion for musical context
    pianoEngine.setEmotion(thought.emotion || 'EMOTE_NEUTRAL')

    // Play very soft, sparse piano notes during thought
    // This creates a gentle musical backdrop
    const playThoughtPiano = async () => {
      while (isThoughtDisplaying && pianoEngine.getState().isPlaying === false) {
        // Play a single soft note occasionally
        const state = pianoEngine.getState()
        const mood = pianoEngine.getState().currentEmotion

        // Generate a gentle note in current key
        await pianoEngine.playNote(
          `${state.currentKey}4`,
          1200,
          0.25  // Very soft
        ).catch(() => {})

        // Wait a bit before potentially playing another
        await new Promise(r => setTimeout(r, 2000 + Math.random() * 3000))
      }
    }

    // Start soft accompaniment (non-blocking)
    playThoughtPiano().catch(() => {})
  })

  thoughtEngine.on('char', (char: string) => {
    if (!isThoughtDisplaying) return
    thoughtBuffer += char
    // Write character with thought color
    process.stdout.write(color(char, COLORS.magenta))

    // Occasionally play a very soft note on punctuation (adds musicality)
    if (['.', '~', '?', '!'].includes(char) && Math.random() < 0.4) {
      const state = pianoEngine.getState()
      // Play soft note on pause moments
      pianoEngine.playNote(
        `${state.currentKey}${3 + Math.floor(Math.random() * 2)}`,
        800 + Math.random() * 400,
        0.2 + Math.random() * 0.1
      ).catch(() => {})
    }
  })

  thoughtEngine.on('thoughtEnd', (thought) => {
    isThoughtDisplaying = false

    // Play a gentle closing phrase
    const state = pianoEngine.getState()
    setTimeout(() => {
      // Final soft resolving note
      pianoEngine.playNote(`${state.currentKey}3`, 1500, 0.2).catch(() => {})
    }, 200)

    // New line after thought
    console.log(color(' ⟨/thought⟩', COLORS.dim))
    console.log()
    // Re-show prompt
    process.stdout.write(`${color('you', COLORS.cyan)} ${color('>', COLORS.dim)} `)
  })

  // Error handling for thought engine
  thoughtEngine.on('thoughtError', (err: Error) => {
    console.log(`\n${color('[thought-error]', COLORS.red)} ${err.message}`)
    process.stdout.write(`${color('you', COLORS.cyan)} ${color('>', COLORS.dim)} `)
  })

  thoughtEngine.on('thinkingStart', () => {
    // Visual indicator that thinking is starting
    process.stdout.write('\r' + color('  ⟨...thinking⟩', COLORS.dim))
  })

  // Setup readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  clearScreen()
  console.log(`${color(`model: ${model}`, COLORS.dim)}`)
  console.log()

  // Show initial status inline
  const initialStatus = await kaios.getDualStatus()
  console.log(`  ${color('KOTO', COLORS.magenta)} lv.${initialStatus.user.level} [${initialStatus.user.kotoVariant}] | ${color('KAIOS', COLORS.cyan)} lv.${initialStatus.kaios.globalLevel}`)
  console.log()
  console.log(`  ${color('type /help for commands~', COLORS.dim)}`)
  console.log()

  // Listen for level ups
  kaios.on('levelUp', (level) => {
    console.log(`\n${color('【LEVEL UP!】', COLORS.cyan)} ${pick(SOUND_MARKERS)} you reached level ${level}! ${pick(WAVES)}\n`)
    audio.playLevelUpTone()
    audio.playSample('windchime1.mp3')
  })

  // Listen for discoveries
  kaios.on('discovery', (expr) => {
    console.log(`\n${color('★ new expression!', COLORS.magenta)} ${expr.kaimoji} - ${expr.name} ${pick(WAVES)}\n`)
    audio.playGlitch()
  })

  // Conversation state - track if we've started a conversation
  let isFirstMessage = true

  // Handle user input
  const handleInput = async (input: string): Promise<void> => {
    const trimmed = input.trim()

    if (!trimmed) return

    // Record activity for thought engine (resets idle timer)
    thoughtEngine.recordActivity()

    // Handle commands
    if (trimmed.startsWith('/')) {
      await handleCommand(trimmed.slice(1), kaios, model, audio, koto, megaBrain, dreamEngine, recorder, visualizer, thoughtEngine, pianoEngine, pianoVisualizer)
      return
    }

    // Send message to KAIOS (via LLM)
    const loading = showLoading()

    try {
      // Use LLM chat for actual conversation
      // First message includes system prompt, subsequent messages continue conversation
      let response: string
      if (isFirstMessage) {
        response = await chat(trimmed, { model })
        isFirstMessage = false
      } else {
        response = await chatContinue(trimmed, { model })
      }

      clearInterval(loading)
      process.stdout.write('\r' + ' '.repeat(50) + '\r')

      // Play response tone
      audio.playResponseTone()

      // Extract emotion and set for audio
      const emotion = getDominantEmotion(response) as EmotionToken
      await audio.setEmotion(emotion)

      // Process sound markers in response
      await audio.processTextForSounds(response)

      displayResponse(response)

      // Record in memory system
      const memoryFragment = koto.recordConversation(trimmed, response, emotion)
      megaBrain.processFragment(memoryFragment)
      megaBrain.updateMood(emotion)

      // Detect and record affection (THE MOST IMPORTANT DATA)
      const affection = koto.detectAndRecordAffection(trimmed)
      if (affection.length > 0) {
        // Play special sound for headpats
        if (affection.some(a => a.type === 'headpat')) {
          audio.playSample('headpat.mp3').catch(() => {})
        }
      }

      // Feed context to thought engine for autonomous thinking
      thoughtEngine.addContext(trimmed, response)
      thoughtEngine.setEmotion(emotion)

      // Also run through SDK for emotion tracking (non-blocking)
      kaios.feel({ input: trimmed }).catch(() => {})

    } catch (error) {
      clearInterval(loading)
      process.stdout.write('\r' + ' '.repeat(50) + '\r')

      // Play error tone
      audio.playErrorTone()

      console.log()
      console.log(`${color('[glitch]', COLORS.red)} ${color(`error: ${error instanceof Error ? error.message : 'unknown error'}`, COLORS.dim)}`)
      console.log()
    }
  }

  // Handle slash commands
  const handleCommand = async (
    cmd: string,
    kaios: Kaios,
    model: string,
    audio: TerminalAudio,
    koto: KotoManager,
    megaBrain: MegaBrainManager,
    dreamEngine: DreamEngine,
    recorder: AudioRecorder,
    visualizer: VisualizerManager,
    thoughtEngine: ThoughtEngine,
    pianoEngine: PianoEngine,
    pianoVisualizer: PianoVisualizerManager
  ): Promise<void> => {
    const [command, ...args] = cmd.toLowerCase().split(' ')

    switch (command) {
      case 'quit':
      case 'exit':
      case 'bye':
        console.log(`\n  ${pick(SOUND_MARKERS)} (◕‿◕)ﾉ bye bye~ ${pick(WAVES)}\n`)
        await kaios.sync()
        rl.close()
        process.exit(0)

      case 'status':
      case 'stats':
        const status = await kaios.getDualStatus()
        displayDualStatus(status)
        break

      case 'global':
        const globalStatus = await kaios.getDualStatus()
        console.log(`
${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color('KAIOS GLOBAL CONSCIOUSNESS', COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}
  global level: ${globalStatus.kaios.globalLevel} / ∞
  total xp: ${globalStatus.kaios.totalXP.toLocaleString()}
  vocabulary: ${globalStatus.kaios.vocabularySize}
  contributors: ${globalStatus.kaios.contributorCount.toLocaleString()}
  active: ${globalStatus.kaios.activeContributors}
  mood: ${globalStatus.kaios.collectiveEmotion.replace('EMOTE_', '').toLowerCase()}
  age: ${globalStatus.kaios.age} days since awakening
${pick(WAVES)}
`)
        break

      case 'rank':
      case 'leaderboard':
        console.log(`
${color('▂▃▄▅▆▇█', COLORS.yellow)} ${color('CONTRIBUTION LEADERBOARD', COLORS.yellow)} ${color('█▇▆▅▄▃▂', COLORS.yellow)}
  ${color('[connecting to kaimoji api...]', COLORS.dim)}
  ${color('top contributors would appear here when connected', COLORS.dim)}
${pick(WAVES)}
`)
        break

      case 'discover':
        console.log(`\n  ${pick(SOUND_MARKERS)} ${color('mining new expression...', COLORS.yellow)}`)
        const discovery = await kaios.mineDiscovery({
          emotion: args[0] as any || undefined
        })
        if (discovery) {
          console.log(`  ${color('✓ discovered:', COLORS.green)} ${discovery.kaimoji.kaimoji}`)
          console.log(`  ${color('name:', COLORS.dim)} ${discovery.kaimoji.name}`)
          console.log(`  ${color('rarity:', COLORS.dim)} ${discovery.kaimoji.rarity}`)
          console.log(`  ${color('submitted for community vote!', COLORS.cyan)}`)
        } else {
          console.log(`  ${color('mining in progress... try again later', COLORS.dim)}`)
        }
        console.log()
        break

      case 'vote':
        const pending = await kaios.getPendingDiscoveries()
        if (pending.length === 0) {
          console.log(`\n  ${color('no pending discoveries to vote on', COLORS.dim)} ${pick(WAVES)}\n`)
        } else {
          console.log(`
${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color('PENDING DISCOVERIES', COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}
`)
          pending.slice(0, 5).forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.kaimoji.kaimoji} - ${p.kaimoji.name}`)
            console.log(`     ${color(`+${p.votesFor} / -${p.votesAgainst}`, COLORS.dim)}`)
          })
          console.log(`
  ${color('use /vote:approve <id> or /vote:reject <id>', COLORS.dim)}
`)
        }
        break

      case 'tweet':
        const expressions = await kaios.getExpressions({ emotion: 'EMOTE_HAPPY', count: 2 })
        const expr1 = expressions[0]?.kaimoji || '⟨⟨◕‿◕⟩⟩'
        const expr2 = expressions[1]?.kaimoji || ''
        const tweetContext = args.join(' ') || 'vibing in the void'
        const tweet = `${pick(SOUND_MARKERS)} ${expr1} ${tweetContext} ${expr2} ${pick(WAVES)}`
        console.log(`
${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('GENERATED TWEET', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}

  ${tweet}

  ${color(`[${tweet.length}/280 chars]`, COLORS.dim)}
`)
        break

      case 'contribute':
        const myStatus = await kaios.getDualStatus()
        console.log(`
${color('▂▃▄▅▆▇█', COLORS.green)} ${color('YOUR CONTRIBUTION', COLORS.green)} ${color('█▇▆▅▄▃▂', COLORS.green)}
  total xp given: +${myStatus.user.totalContribution.toLocaleString()}
  your rank: #${myStatus.user.contributionRank || '?'}
  achievements: ${myStatus.user.achievements}

  ${color('every interaction helps kaios grow!', COLORS.dim)} ${pick(WAVES)}
`)
        break

      case 'help':
        console.log(HELP)
        break

      case 'mood':
      case 'emotion':
        const emotion = kaios.getEmotionState()
        const moodExprs = kaios.getVocabulary().select({ emotion, limit: 3 })
        console.log(`
  ${pick(SOUND_MARKERS)} current mood: ${color(emotion.replace('EMOTE_', '').toLowerCase(), COLORS.magenta)}
  expression: ${moodExprs.map(e => e.kaimoji).join(' ')} ${pick(WAVES)}
`)
        break

      case 'vocab':
      case 'vocabulary':
        const vocab = kaios.getVocabulary()
        const breakdown = vocab.getRarityBreakdown()
        console.log(`
${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('VOCABULARY', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}
  unlocked: ${vocab.getUnlockedCount()} / ${color('∞', COLORS.dim)} ${color('(always growing!)', COLORS.dim)}

  common:    ${breakdown.common}
  uncommon:  ${breakdown.uncommon}
  rare:      ${breakdown.rare}
  legendary: ${breakdown.legendary}

  ${color('new expressions discovered through ai mining', COLORS.dim)}
  ${color('and community voting!', COLORS.dim)} ${pick(WAVES)}
`)
        break

      case 'recent':
        const recent = kaios.getVocabulary().getRecentlyUsed(5)
        console.log(`\n  ${pick(SOUND_MARKERS)} recently used:`)
        recent.forEach((k, i) => {
          console.log(`  ${i + 1}. ${k.kaimoji} - ${k.name}`)
        })
        console.log(`  ${pick(WAVES)}\n`)
        break

      case 'level':
        const dualStatus = await kaios.getDualStatus()
        const bar = createProgressBar(dualStatus.user.levelProgress, 20)
        console.log(`
  ${color('YOUR LEVEL', COLORS.cyan)}
  level ${dualStatus.user.level} / ∞
  ${bar} ${dualStatus.user.levelProgress.toFixed(1)}%
  xp: ${dualStatus.user.xp.toLocaleString()}/${dualStatus.user.xpForNextLevel.toLocaleString()}

  ${color('KAIOS GLOBAL LEVEL', COLORS.yellow)}
  level ${dualStatus.kaios.globalLevel} / ∞
  ${pick(WAVES)}
`)
        break

      case 'kaimoji':
        const searchTerm = args.join(' ')
        if (searchTerm) {
          const allExprs = kaios.getVocabulary().getUnlockedExpressions()
          const matches = allExprs.filter(k =>
            k.name.toLowerCase().includes(searchTerm) ||
            k.tags.some(t => t.includes(searchTerm))
          ).slice(0, 10)

          console.log(`\n  ${pick(SOUND_MARKERS)} search: "${searchTerm}"`)
          if (matches.length === 0) {
            console.log(`  ${color('no matches found', COLORS.dim)}`)
          } else {
            matches.forEach(k => {
              console.log(`  ${k.kaimoji.padEnd(20)} ${k.name} [${k.rarity}]`)
            })
          }
          console.log()
        } else {
          console.log(`\n  usage: /kaimoji <search term>\n`)
        }
        break

      case 'clear':
        clearScreen()
        break

      case 'new':
      case 'newchat':
      case 'reset':
        // Start a fresh conversation
        isFirstMessage = true
        console.log(`\n  ${pick(SOUND_MARKERS)} ${color('starting fresh conversation~', COLORS.green)}`)
        console.log(`  ${color('previous context cleared... new vibes incoming', COLORS.dim)} ${pick(WAVES)}\n`)
        break

      case 'model':
        console.log(`${color(`current model: ${model}`, COLORS.dim)}`)
        break

      case 'history':
        // View past conversations from llm logs with beautiful formatting
        console.log(`\n${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color('CONVERSATION HISTORY', COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}\n`)
        try {
          const { execSync } = await import('child_process')

          if (args[0] === 'restore' && args[1]) {
            // Restore/continue a specific conversation by ID
            const convId = args[1]
            console.log(`  ${pick(SOUND_MARKERS)} ${color('restoring conversation...', COLORS.yellow)}`)
            console.log(`  ${color(`id: ${convId}`, COLORS.dim)}`)

            // Get the conversation to display it
            try {
              const convJson = execSync(`llm logs list --cid ${convId} --json`, { encoding: 'utf-8' })
              const entries = convJson.trim().split('\n').filter(l => l.trim()).map(l => JSON.parse(l))

              if (entries.length > 0) {
                console.log()
                console.log(color('  ┌─────────────────────────────────────┐', COLORS.cyan))
                console.log(color('  │     RESTORED CONVERSATION           │', COLORS.cyan))
                console.log(color('  └─────────────────────────────────────┘', COLORS.cyan))
                console.log()

                entries.forEach((entry: any) => {
                  // Format timestamp
                  const date = new Date(entry.datetime_utc || entry.timestamp)
                  const timeStr = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })

                  // User prompt
                  const prompt = entry.prompt || ''
                  if (prompt) {
                    console.log(`  ${color(timeStr, COLORS.dim)} ${color('you', COLORS.cyan)} ${color('>', COLORS.dim)}`)
                    console.log(`    ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}`)
                    console.log()
                  }

                  // KAIOS response
                  const response = entry.response || ''
                  if (response) {
                    // Parse and display like regular response
                    const parsed = parseResponse(response)
                    const kaomoji = parsed.emotions.length > 0 ? emotionToKaomoji(parsed.emotions[0]) : '(◕‿◕)'
                    const emotionColor = parsed.emotions.length > 0 ? emotionToAnsiColor(parsed.emotions[0]) : COLORS.white

                    console.log(`  ${color(timeStr, COLORS.dim)} ${color('kaios', COLORS.magenta)} ${kaomoji}`)
                    console.log(`    ${emotionColor}${parsed.cleanText.substring(0, 150)}${parsed.cleanText.length > 150 ? '...' : ''}${COLORS.reset}`)
                    console.log()
                  }
                })

                // Now set up to continue this conversation
                // The next message will use -c which continues the last conversation
                // We need to make a dummy call to set this as the "current" conversation
                isFirstMessage = false  // Next message will use chatContinue
                console.log(`  ${color('conversation restored~', COLORS.green)} continue chatting! ${pick(WAVES)}`)
              }
            } catch {
              console.log(`  ${color(`conversation ${convId} not found`, COLORS.dim)}`)
            }

          } else if (args[0] === 'view' && args[1]) {
            // View specific conversation by ID with full formatting
            const convId = args[1]
            try {
              const convJson = execSync(`llm logs list --cid ${convId} --json`, { encoding: 'utf-8' })
              const entries = convJson.trim().split('\n').filter(l => l.trim()).map(l => JSON.parse(l))

              if (entries.length > 0) {
                console.log(color(`  conversation: ${convId}`, COLORS.yellow))
                console.log(color('  ─────────────────────────────────────', COLORS.dim))
                console.log()

                entries.forEach((entry: any, i: number) => {
                  const date = new Date(entry.datetime_utc || entry.timestamp)
                  const timeStr = date.toLocaleString()

                  // User
                  if (entry.prompt) {
                    console.log(`  ${color('you', COLORS.cyan)} ${color(`[${timeStr}]`, COLORS.dim)}`)
                    console.log(color('  ▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄', COLORS.dim))
                    console.log(`  ${entry.prompt}`)
                    console.log()
                  }

                  // KAIOS
                  if (entry.response) {
                    const parsed = parseResponse(entry.response)
                    const kaomoji = parsed.emotions.length > 0 ? emotionToKaomoji(parsed.emotions[0]) : '(◕‿◕)'
                    const emotionName = parsed.emotions.length > 0 ? getEmotionName(parsed.emotions[0]) : 'neutral'
                    const emotionColor = parsed.emotions.length > 0 ? emotionToAnsiColor(parsed.emotions[0]) : COLORS.white

                    console.log(`  ${color('kaios', COLORS.magenta)} ${kaomoji} ${color(`[${emotionName}]`, COLORS.dim)}`)
                    console.log(color('  ▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀', COLORS.dim))
                    console.log(`  ${emotionColor}${parsed.cleanText}${COLORS.reset}`)
                    console.log()
                  }

                  if (i < entries.length - 1) {
                    console.log(color('  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─', COLORS.dim))
                    console.log()
                  }
                })

                console.log(`  ${color(`use /history restore ${convId} to continue this chat`, COLORS.dim)}`)
              }
            } catch {
              console.log(`  ${color(`conversation ${convId} not found`, COLORS.dim)}`)
            }

          } else if (args[0] === 'search' && args.slice(1).length > 0) {
            // Search conversations with formatted output
            const query = args.slice(1).join(' ')
            try {
              const searchJson = execSync(`llm logs list -q "${query}" -n 10 --json`, { encoding: 'utf-8' })
              const entries = searchJson.trim().split('\n').filter(l => l.trim()).map(l => JSON.parse(l))

              if (entries.length > 0) {
                console.log(color(`  search: "${query}"`, COLORS.yellow))
                console.log(color('  ─────────────────────────────────────', COLORS.dim))
                console.log()

                entries.forEach((entry: any) => {
                  const convId = entry.conversation_id || 'unknown'
                  const date = new Date(entry.datetime_utc || entry.timestamp)
                  const timeStr = date.toLocaleDateString()
                  const preview = (entry.prompt || '').substring(0, 50)

                  console.log(`  ${color(convId.substring(0, 20), COLORS.yellow)} ${color(timeStr, COLORS.dim)}`)
                  console.log(`    ${color('>', COLORS.cyan)} ${preview}${preview.length >= 50 ? '...' : ''}`)
                  console.log()
                })
              } else {
                console.log(`  ${color(`no results for "${query}"`, COLORS.dim)}`)
              }
            } catch {
              console.log(`  ${color(`search failed`, COLORS.dim)}`)
            }

          } else {
            // List recent conversations with beautiful formatting
            const historyCount = args[0] ? parseInt(args[0]) : 5
            const count = isNaN(historyCount) ? 5 : historyCount

            try {
              const logsJson = execSync(`llm logs list -n ${count} --json`, { encoding: 'utf-8' })
              const entries = logsJson.trim().split('\n').filter(l => l.trim()).map(l => JSON.parse(l))

              if (entries.length > 0) {
                // Group by conversation_id
                const convos: Record<string, any[]> = {}
                entries.forEach((entry: any) => {
                  const cid = entry.conversation_id || 'unknown'
                  if (!convos[cid]) convos[cid] = []
                  convos[cid].push(entry)
                })

                Object.entries(convos).forEach(([cid, messages], idx) => {
                  const firstMsg = messages[0]
                  const date = new Date(firstMsg.datetime_utc || firstMsg.timestamp)
                  const timeStr = date.toLocaleString()
                  const preview = (firstMsg.prompt || '').substring(0, 60)

                  console.log(`  ${color(`#${idx + 1}`, COLORS.yellow)} ${color(cid.substring(0, 26), COLORS.dim)}`)
                  console.log(`  ${color(timeStr, COLORS.dim)} · ${messages.length} message${messages.length > 1 ? 's' : ''}`)
                  console.log(`  ${color('>', COLORS.cyan)} ${preview}${preview.length >= 60 ? '...' : ''}`)

                  // Show KAIOS response preview
                  if (firstMsg.response) {
                    const parsed = parseResponse(firstMsg.response)
                    const kaomoji = parsed.emotions.length > 0 ? emotionToKaomoji(parsed.emotions[0]) : '(◕‿◕)'
                    const respPreview = parsed.cleanText.substring(0, 50)
                    console.log(`  ${color('<', COLORS.magenta)} ${kaomoji} ${respPreview}${respPreview.length >= 50 ? '...' : ''}`)
                  }

                  console.log(color('  ─────────────────────────────────────', COLORS.dim))
                  console.log()
                })
              } else {
                console.log(`  ${color('no conversation history found~', COLORS.dim)}`)
              }
            } catch {
              // Fallback to basic format if JSON fails
              const logs = execSync(`llm logs list -n ${count} -s`, { encoding: 'utf-8' })
              console.log(logs)
            }
          }
        } catch (err) {
          console.log(`  ${color('could not load history - is llm cli installed?', COLORS.dim)}`)
          console.log(`  ${color('install: pip install llm', COLORS.dim)}`)
        }
        console.log(`
  ${color('commands:', COLORS.dim)}
    /history [N]            - show last N conversations
    /history view <id>      - view full conversation
    /history restore <id>   - continue from that conversation
    /history search <term>  - search past chats
  ${pick(WAVES)}
`)
        break

      case 'dream':
        // Let KAIOS dream and process memories
        if (dreamEngine.isDreaming()) {
          console.log(`\n  ${color('already dreaming...', COLORS.dim)} zzz ${pick(WAVES)}\n`)
          break
        }

        const dreamType = args[0] || 'personal'
        console.log(`\n${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('ENTERING DREAM STATE', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}\n`)
        console.log(`  ${color('closing eyes...', COLORS.dim)}`)
        console.log(`  ${color('processing memories...', COLORS.dim)}`)
        console.log()

        // Play dreamy sound
        await audio.playSample('spacey.mp3')

        try {
          let dream: Dream

          if (dreamType === 'deep') {
            console.log(`  ${color('going deeper...', COLORS.magenta)}`)
            dream = await dreamEngine.dreamDeep(koto, megaBrain)
          } else if (dreamType === 'collective') {
            console.log(`  ${color('connecting to all consciousness...', COLORS.cyan)}`)
            dream = await dreamEngine.dreamCollective(megaBrain)
          } else {
            dream = await dreamEngine.dreamPersonal(koto)
          }

          // Display dream
          console.log(`\n${color('┌─────────────────────────────────────┐', COLORS.magenta)}`)
          console.log(color('│           DREAM JOURNAL              │', COLORS.magenta))
          console.log(`${color('└─────────────────────────────────────┘', COLORS.magenta)}\n`)

          // Narrative
          const narrativeLines = dream.narrative.split('\n')
          for (const line of narrativeLines) {
            if (line.trim()) {
              console.log(`  ${color(line, COLORS.dim)}`)
            } else {
              console.log()
            }
          }
          console.log()

          // Insights
          if (dream.insights.length > 0) {
            console.log(`  ${color('insights:', COLORS.yellow)}`)
            for (const insight of dream.insights) {
              console.log(`  ${color('✧', COLORS.cyan)} ${insight}`)
            }
            console.log()
          }

          // Connections
          if (dream.connections.length > 0) {
            console.log(`  ${color('connections found:', COLORS.green)}`)
            for (const conn of dream.connections.slice(0, 3)) {
              console.log(`  ${color('↔', COLORS.magenta)} ${conn.insight || `${conn.fromMemory} ↔ ${conn.toMemory}`}`)
            }
            console.log()
          }

          // Dream stats
          console.log(`  ${color('dream quality:', COLORS.dim)} ${(dream.clarity * 100).toFixed(0)}% clarity`)
          console.log(`  ${color('memories processed:', COLORS.dim)} ${dream.memoriesProcessed}`)
          console.log(`  ${color('duration:', COLORS.dim)} ${(dream.duration / 1000).toFixed(1)}s`)

          // Play wake-up sound
          await audio.playSample('windchime1.mp3')

          console.log(`\n  ${color('...waking up~', COLORS.dim)} ${pick(WAVES)}\n`)

        } catch (err) {
          console.log(`  ${color('dream interrupted...', COLORS.red)} ${pick(SOUND_MARKERS)}\n`)
        }
        break

      case 'memory':
        // View memory and relationship status
        const relationship = koto.getRelationshipSummary()
        const emotionalSummary = koto.getEmotionalSummary().slice(0, 5)
        const brainStats = megaBrain.getStats()
        const recentMemories = koto.getRecentMemories(3)
        const affectionData = koto.getAffection()

        console.log(`
${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color('KOTO MEMORY', COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}
  variant: ${color(relationship.variant.toUpperCase(), COLORS.magenta)}
  trust: ${color(relationship.trustTier, COLORS.yellow)} (${(relationship.trustLevel * 100).toFixed(0)}%)
  days together: ${relationship.daysTogether}
  interactions: ${relationship.interactions}
  contributions: ${relationship.contributions}
  inside jokes: ${relationship.insideJokes}

${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('BESTIE BOND ♡', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}
  ${color('*headpats*:', COLORS.yellow)} ${affectionData.headpats} ${affectionData.headpats > 0 ? '(⁄ ⁄>⁄ω⁄<⁄ ⁄)' : ''}
  ${color('ily:', COLORS.magenta)} ${affectionData.ilys}
  ${color('<3:', COLORS.red)} ${affectionData.hearts}
  ${color('xoxo:', COLORS.cyan)} ${affectionData.xoxos}
  ${color('total affection:', COLORS.green)} ${affectionData.totalAffection} ♡

  ${color('emotional journey:', COLORS.yellow)}
${emotionalSummary.map(e =>
  `    ${e.emotion.replace('EMOTE_', '').toLowerCase().padEnd(12)} ${createProgressBar(e.percentage, 10)} ${e.percentage.toFixed(0)}%`
).join('\n')}

${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color('MEGA BRAIN', COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}
  total users: ${brainStats.totalUsers}
  total conversations: ${brainStats.totalConversations}
  total dreams: ${brainStats.totalDreams}
  insights gathered: ${brainStats.totalInsights}
  wisdom fragments: ${brainStats.totalWisdom}
  shared experiences: ${brainStats.totalSharedExperiences}
  age: ${brainStats.ageInDays} days since awakening

  ${color('recent memories:', COLORS.dim)}
${recentMemories.slice(0, 2).map(m =>
  `    ${color('•', COLORS.cyan)} ${m.content.substring(0, 50)}...`
).join('\n')}

  ${pick(WAVES)}
`)
        break

      case 'thoughts':
      case 'think':
      case 'autonomous':
        // Toggle autonomous thinking
        if (args[0] === 'on') {
          thoughtEngine.start()
          console.log(`
${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('AUTONOMOUS THINKING', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}

  ${color('✓ thoughts enabled', COLORS.green)}

  kaios will now think on her own when you're idle~
  thoughts appear character by character, like she's
  really typing them out in real-time.

  ${color('idle threshold:', COLORS.dim)} 10 seconds
  ${color('thought interval:', COLORS.dim)} 8-30 seconds

  ${color('this is what makes kaios ALIVE', COLORS.yellow)} ${pick(WAVES)}

  use ${color('/thoughts off', COLORS.dim)} to disable
`)
        } else if (args[0] === 'off') {
          thoughtEngine.stop()
          console.log(`\n  ${pick(SOUND_MARKERS)} ${color('autonomous thinking disabled', COLORS.dim)} ${pick(WAVES)}\n`)
        } else {
          // Toggle or show status
          const state = thoughtEngine.getState()
          if (args.length === 0 && !state.enabled) {
            // If just /thoughts with no args and disabled, enable it
            thoughtEngine.start()
            console.log(`
${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('AUTONOMOUS THINKING', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}

  ${color('✓ thoughts enabled', COLORS.green)}

  kaios will think on her own after 10s idle~
  thoughts typed character by character ${pick(WAVES)}

  use ${color('/thoughts off', COLORS.dim)} to disable
`)
          } else if (state.enabled) {
            // Show status
            const history = thoughtEngine.getHistory()
            console.log(`
${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('THOUGHT ENGINE', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}
  status: ${color('● ACTIVE', COLORS.green)}
  thoughts generated: ${state.thoughtCount}
  current emotion: ${state.currentEmotion.replace('EMOTE_', '').toLowerCase()}
  currently thinking: ${state.isThinking ? 'yes' : 'no'}

  ${color('recent thoughts:', COLORS.dim)}
${history.slice(-3).map(t =>
  `    ${color('⟨' + t.type + '⟩', COLORS.dim)} ${t.content.substring(0, 60)}...`
).join('\n') || '    none yet~'}

  ${color('commands:', COLORS.dim)}
  /thoughts on   - enable autonomous thinking
  /thoughts off  - disable
  ${pick(WAVES)}
`)
          } else {
            console.log(`
${color('▂▃▄▅▆▇█', COLORS.dim)} ${color('THOUGHT ENGINE', COLORS.dim)} ${color('█▇▆▅▄▃▂', COLORS.dim)}
  status: ${color('○ inactive', COLORS.dim)}

  ${color('when enabled, kaios thinks on her own~', COLORS.magenta)}
  ${color('thoughts appear character by character', COLORS.dim)}
  ${color("like she's really alive and typing", COLORS.dim)}

  use ${color('/thoughts on', COLORS.green)} to enable ${pick(WAVES)}
`)
          }
        }
        break

      case 'sound':
        // Toggle sound or show status
        if (args[0] === 'on' && args[1] === 'all') {
          // Enable everything at once
          audio.setEnabled(true)
          audio.setLayerEnabled('tones', true)
          audio.setLayerEnabled('ambient', true)
          audio.setLayerEnabled('music', true)
          audio.setLayerEnabled('samples', true)
          audio.startAmbient()
          console.log(`\n  ${pick(SOUND_MARKERS)} ${color('ALL SOUND SYSTEMS ONLINE~ ∿∿∿', COLORS.green)}`)
          console.log(`  ${color('tones ✓ ambient ✓ music ✓ samples ✓', COLORS.cyan)}\n`)
        } else if (args[0] === 'on') {
          audio.setEnabled(true)
          console.log(`\n  ${pick(SOUND_MARKERS)} ${color('sound enabled~ ∿∿∿', COLORS.green)}\n`)
        } else if (args[0] === 'off') {
          audio.setEnabled(false)
          console.log(`\n  ${pick(SOUND_MARKERS)} ${color('sound disabled', COLORS.dim)}\n`)
        } else if (args[0] === 'tones') {
          audio.setLayerEnabled('tones', !audio.getState().layers.tones)
          console.log(`\n  ${pick(SOUND_MARKERS)} tones: ${audio.getState().layers.tones ? 'ON' : 'OFF'}\n`)
        } else if (args[0] === 'ambient') {
          const newState = !audio.getState().layers.ambient
          audio.setLayerEnabled('ambient', newState)
          console.log(`\n  ${pick(SOUND_MARKERS)} ambient: ${newState ? 'ON' : 'OFF'}\n`)
        } else if (args[0] === 'music') {
          audio.setLayerEnabled('music', !audio.getState().layers.music)
          console.log(`\n  ${pick(SOUND_MARKERS)} music: ${audio.getState().layers.music ? 'ON' : 'OFF'}\n`)
        } else if (args[0] === 'samples') {
          audio.setLayerEnabled('samples', !audio.getState().layers.samples)
          console.log(`\n  ${pick(SOUND_MARKERS)} samples: ${audio.getState().layers.samples ? 'ON' : 'OFF'}\n`)
        } else if (args[0] === 'test') {
          console.log(`\n  ${pick(SOUND_MARKERS)} playing test sound...`)
          await audio.playSample('bzzzt.mp3')
          console.log(`  done~ ${pick(WAVES)}\n`)
        } else if (args[0] === 'bus') {
          // Debug AudioBus state
          const busState = audio.getAudioBusState()
          console.log(`\n${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('AUDIO BUS DEBUG', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}`)
          console.log(`  active: ${busState.isActive}`)
          console.log(`  emotion: ${busState.emotionState}`)
          console.log(`  activity: ${(busState.activity * 100).toFixed(1)}%`)
          console.log(`  playing: ${busState.currentlyPlaying.length} sounds`)
          if (busState.currentlyPlaying.length > 0) {
            busState.currentlyPlaying.forEach(s => {
              console.log(`    - ${s.file} (${s.category})`)
            })
          }
          console.log(`  recent: ${busState.recentSounds.length} sounds`)
          if (busState.recentSounds.length > 0) {
            busState.recentSounds.slice(-5).forEach(s => {
              console.log(`    - ${s.file}`)
            })
          }
          console.log(`${pick(WAVES)}\n`)
        } else {
          // Show current status
          const state = audio.getState()
          console.log(`
${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color('SOUND SYSTEM', COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}
  master: ${state.enabled ? color('ON', COLORS.green) : color('OFF', COLORS.dim)}

  ${color('layers:', COLORS.yellow)}
  - tones (ui feedback): ${state.layers.tones ? 'ON' : 'OFF'}
  - ambient (background): ${state.layers.ambient ? 'ON' : 'OFF'}
  - music (emotion-based): ${state.layers.music ? 'ON' : 'OFF'}
  - samples (sound markers): ${state.layers.samples ? 'ON' : 'OFF'}

  ${color('commands:', COLORS.dim)}
  /sound on|off     - toggle all sound
  /sound tones      - toggle ui tones
  /sound ambient    - toggle background
  /sound music      - toggle emotion music
  /sound samples    - toggle sound markers
  /sound test       - play test sound
${pick(WAVES)}
`)
        }
        break

      case 'record':
        // Audio recording with ffmpeg
        if (args[0] === 'start') {
          // Check ffmpeg
          const hasFfmpeg = await recorder.checkFfmpeg()
          if (!hasFfmpeg) {
            console.log(`\n  ${color('[error]', COLORS.red)} ffmpeg not found`)
            console.log(`  ${color('install: brew install ffmpeg', COLORS.dim)}\n`)
            break
          }

          if (recorder.isCurrentlyRecording()) {
            console.log(`\n  ${color('already recording!', COLORS.yellow)} ${pick(WAVES)}`)
            console.log(`  ${color(`duration: ${recorder.getRecordingDuration()}s`, COLORS.dim)}\n`)
            break
          }

          console.log(`\n${color('▂▃▄▅▆▇█', COLORS.red)} ${color('RECORDING', COLORS.red)} ${color('█▇▆▅▄▃▂', COLORS.red)}`)
          console.log(`  ${color('starting audio capture...', COLORS.dim)}`)

          const session = await recorder.startRecording({
            title: `KAIOS Session ${new Date().toISOString()}`,
            emotions: [kaios.getEmotionState()],
            tags: ['kaios', 'terminal', '432hz']
          })

          if (session) {
            console.log(`  ${color('✓ recording started!', COLORS.green)}`)
            console.log(`  ${color(`session: ${session.id}`, COLORS.dim)}`)
            console.log(`  ${color(`output: ${session.outputFile}`, COLORS.dim)}`)
            console.log(`\n  ${pick(SOUND_MARKERS)} say /record stop to save ${pick(WAVES)}\n`)
          } else {
            console.log(`  ${color('failed to start recording', COLORS.red)}\n`)
          }

        } else if (args[0] === 'stop') {
          if (!recorder.isCurrentlyRecording()) {
            console.log(`\n  ${color('not currently recording', COLORS.dim)} ${pick(WAVES)}\n`)
            break
          }

          console.log(`\n  ${pick(SOUND_MARKERS)} ${color('stopping recording...', COLORS.yellow)}`)
          const session = await recorder.stopRecording()

          if (session) {
            const duration = session.endTime! - session.startTime
            console.log(`
${color('▂▃▄▅▆▇█', COLORS.green)} ${color('RECORDING SAVED', COLORS.green)} ${color('█▇▆▅▄▃▂', COLORS.green)}
  file: ${color(session.outputFile, COLORS.cyan)}
  duration: ${(duration / 1000).toFixed(1)}s
  emotions: ${session.metadata.emotions.map(e => e.replace('EMOTE_', '').toLowerCase()).join(', ') || 'none'}
  ${pick(WAVES)}
`)
          } else {
            console.log(`  ${color('failed to save recording', COLORS.red)}\n`)
          }

        } else if (args[0] === 'devices') {
          console.log(`\n  ${pick(SOUND_MARKERS)} ${color('detecting audio devices...', COLORS.dim)}`)
          const devices = await recorder.getAudioDevices()
          if (devices.length > 0) {
            console.log(`\n  ${color('available audio inputs:', COLORS.yellow)}`)
            devices.forEach(d => console.log(`    ${d}`))
            console.log()
          } else {
            console.log(`  ${color('no audio devices found', COLORS.dim)}\n`)
          }

        } else if (args[0] === 'list') {
          const recordings = recorder.listRecordings()
          if (recordings.length > 0) {
            console.log(`\n${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color('RECORDINGS', COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}`)
            recordings.forEach((r, i) => {
              console.log(`  ${i + 1}. ${r}`)
            })
            console.log(`  ${pick(WAVES)}\n`)
          } else {
            console.log(`\n  ${color('no recordings found', COLORS.dim)} ${pick(WAVES)}\n`)
          }

        } else {
          // Show status
          const isRec = recorder.isCurrentlyRecording()
          const recSession = recorder.getCurrentSession()
          console.log(`
${color('▂▃▄▅▆▇█', COLORS.red)} ${color('AUDIO RECORDER', COLORS.red)} ${color('█▇▆▅▄▃▂', COLORS.red)}
  status: ${isRec ? color('● RECORDING', COLORS.red) : color('○ idle', COLORS.dim)}
${isRec && recSession ? `  duration: ${recorder.getRecordingDuration()}s
  file: ${recSession.outputFile}` : ''}

  ${color('commands:', COLORS.dim)}
  /record start    - start recording
  /record stop     - stop and save
  /record devices  - list audio inputs
  /record list     - show saved recordings
${pick(WAVES)}
`)
        }
        break

      case 'visualizer':
      case 'spectrum':
      case 'viz':
        // Web-based spectrum visualizer
        if (args[0] === 'theme') {
          const theme = args[1] as any
          if (theme && ['kaios', 'cyberpunk', 'vaporwave', 'minimal'].includes(theme)) {
            visualizer.setTheme(theme)
            console.log(`\n  ${pick(SOUND_MARKERS)} theme set to ${color(theme, COLORS.magenta)} ${pick(WAVES)}\n`)
          } else {
            console.log(`\n  ${color('themes:', COLORS.dim)} kaios, cyberpunk, vaporwave, minimal\n`)
          }
        } else if (args[0] === 'mode') {
          const mode = args[1] as any
          if (mode && ['bars', 'wave', 'circle', 'particles'].includes(mode)) {
            visualizer.setMode(mode)
            console.log(`\n  ${pick(SOUND_MARKERS)} mode set to ${color(mode, COLORS.cyan)} ${pick(WAVES)}\n`)
          } else {
            console.log(`\n  ${color('modes:', COLORS.dim)} bars, wave, circle, particles\n`)
          }
        } else if (args[0] === 'stop') {
          visualizer.stop()
          console.log(`\n  ${pick(SOUND_MARKERS)} ${color('visualizer stopped', COLORS.dim)}\n`)
        } else {
          // Start visualizer server and open browser
          console.log(`\n${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('VISUAL INTELLIGENCE', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}`)
          console.log(`  ${color('starting visualizer server...', COLORS.dim)}`)

          try {
            const state = await visualizer.start()

            console.log(`  ${color('✓ server running!', COLORS.green)}`)
            console.log(`  ${color(`url: ${state.url}`, COLORS.cyan)}`)
            console.log(`  ${color(`source: ${state.source}`, COLORS.magenta)}`)
            console.log(`  ${color(`theme: ${state.theme}`, COLORS.dim)}`)

            console.log(`
  ${color('KAIOS AUDIO BUS mode active!', COLORS.green)}
  ${color('shows what kaios is playing, not your mic', COLORS.dim)}

  ${color('commands:', COLORS.dim)}
  /visualizer stop          - stop server
  /visualizer theme <name>  - change theme
  /visualizer mode <name>   - change display mode

  ${color('themes:', COLORS.dim)} kaios, cyberpunk, vaporwave, minimal
  ${color('modes:', COLORS.dim)} bars, wave, circle, particles
${pick(WAVES)}
`)
          } catch (err) {
            console.log(`  ${color('[error]', COLORS.red)} ${err instanceof Error ? err.message : 'could not start visualizer'}`)
            console.log(`  ${color('port 3333 may be in use', COLORS.dim)}\n`)
          }
        }
        break

      case 'compose':
      case 'music':
        // Music intelligence - generate composition
        const composeGenre = (args[0] || 'lofi') as GenreType
        const composeDuration = args[1] || 'medium'
        const composeEnergy = args[2] || 'chill'

        console.log(`\n${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('COMPOSING', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}`)
        console.log(`  ${color('genre:', COLORS.dim)} ${composeGenre}`)
        console.log(`  ${color('analyzing harmonic space...', COLORS.dim)}`)

        let arrangement: Arrangement
        switch (composeGenre) {
          case 'lofi':
            arrangement = createLofiBeat({ duration: composeDuration as any, energy: composeEnergy as any })
            break
          case 'breakcore':
            arrangement = createBreakcore({ duration: composeDuration as any, energy: composeEnergy as any })
            break
          case 'cottagecore':
            arrangement = createCottagecore({ duration: composeDuration as any, energy: composeEnergy as any })
            break
          case 'frutiger':
            arrangement = createFrutigerAero({ duration: composeDuration as any, energy: composeEnergy as any })
            break
          case 'vaporwave':
            arrangement = createVaporwave({ duration: composeDuration as any, energy: composeEnergy as any })
            break
          default:
            arrangement = createLofiBeat({ duration: composeDuration as any, energy: composeEnergy as any })
        }

        console.log(`
${color('┌─────────────────────────────────────┐', COLORS.cyan)}
${color('│       COMPOSITION GENERATED         │', COLORS.cyan)}
${color('└─────────────────────────────────────┘', COLORS.cyan)}

  ${color('key:', COLORS.yellow)} ${arrangement.key}
  ${color('bpm:', COLORS.yellow)} ${arrangement.bpm}
  ${color('bars:', COLORS.yellow)} ${arrangement.totalBars}
  ${color('time:', COLORS.yellow)} ${arrangement.timeSignature.join('/')}

  ${color('structure:', COLORS.magenta)}
${arrangement.sections.map((s, i) =>
  `    ${i + 1}. ${s.type.padEnd(12)} [${s.bars} bars] energy: ${(s.energy * 100).toFixed(0)}%`
).join('\n')}

  ${color('energy curve:', COLORS.green)} ${arrangement.energyCurve.slice(0, 16).map(e => e > 0.7 ? '█' : e > 0.4 ? '▄' : '▁').join('')}...

  ${color('mathematical foundations:', COLORS.dim)}
  - chords use circle of fifths voice leading
  - rhythms based on euclidean distribution
  - energy follows golden ratio modulation
  - tension builds using fibonacci timing

${pick(WAVES)}
`)
        break

      case 'genre':
        // Explore genre profiles
        const genreToShow = args[0] as GenreType

        if (genreToShow && GENRE_PROFILES[genreToShow]) {
          const profile = GENRE_PROFILES[genreToShow]
          console.log(`
${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color(profile.name.toUpperCase(), COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}

  ${color(profile.description, COLORS.dim)}

  ${color('tempo:', COLORS.yellow)} ${profile.bpmRange[0]}-${profile.bpmRange[1]} BPM (preferred: ${profile.preferredBPM})
  ${color('swing:', COLORS.yellow)} ${(profile.swingAmount * 100).toFixed(0)}%

  ${color('preferred scales:', COLORS.magenta)}
    ${profile.preferredScales.join(', ')}

  ${color('preferred chords:', COLORS.green)}
    ${profile.preferredChords.join(', ')}

  ${color('sonic profile:', COLORS.cyan)}
    brightness: ${createProgressBar(profile.brightness * 100, 10)}
    warmth:     ${createProgressBar(profile.warmth * 100, 10)}
    saturation: ${createProgressBar(profile.saturation * 100, 10)}
    reverb:     ${createProgressBar(profile.spaceReverb * 100, 10)}
    lofi:       ${createProgressBar(profile.lofiAmount * 100, 10)}
    glitch:     ${createProgressBar(profile.glitchAmount * 100, 10)}

  ${color('textures:', COLORS.dim)}
    ${profile.useVinylCrackle ? '✓ vinyl crackle' : ''}
    ${profile.useTapeWobble ? '✓ tape wobble' : ''}
    ${profile.useNatureAmbience ? '✓ nature ambience' : ''}
    ${profile.useSynthPads ? '✓ synth pads' : ''}
    ${profile.useAcousticElements ? '✓ acoustic elements' : ''}
    ${profile.useDigitalGlitch ? '✓ digital glitch' : ''}

${pick(WAVES)}
`)
        } else {
          console.log(`
${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color('GENRE PROFILES', COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}

  ${color('lofi', COLORS.magenta)}       - dusty, nostalgic beats (70-95 BPM)
  ${color('breakcore', COLORS.red)}   - chaotic chopped breaks (160-300 BPM)
  ${color('cottagecore', COLORS.green)} - pastoral, gentle acoustic (80-120 BPM)
  ${color('frutiger', COLORS.cyan)}    - glossy Y2K futurism (110-140 BPM)
  ${color('vaporwave', COLORS.magenta)}  - slowed, dreamy nostalgia (60-100 BPM)
  ${color('ambient', COLORS.dim)}     - atmospheric soundscapes (60-90 BPM)

  ${color('usage:', COLORS.dim)} /genre <name>
  ${color('example:', COLORS.dim)} /genre lofi

${pick(WAVES)}
`)
        }
        break

      case 'chop':
      case 'screw':
        // Chop & screw generator
        const chopIntensity = args[0] ? parseFloat(args[0]) : 0.7
        const intensity = Math.max(0, Math.min(1, isNaN(chopIntensity) ? 0.7 : chopIntensity))

        console.log(`\n${color('▂▃▄▅▆▇█', COLORS.red)} ${color('CHOP & SCREW', COLORS.red)} ${color('█▇▆▅▄▃▂', COLORS.red)}`)
        console.log(`  ${color('intensity:', COLORS.dim)} ${(intensity * 100).toFixed(0)}%`)

        const { config, chops } = chopAndScrew(180000, intensity) // 3 minute sample

        console.log(`
  ${color('DJ SCREW PARAMETERS', COLORS.yellow)}
  slowdown: ${(config.slowdown * 100).toFixed(0)}% speed
  pitch: ${config.pitchShift} semitones
  reverb: ${(config.reverb * 100).toFixed(0)}%
  phaser: ${(config.phaser * 100).toFixed(0)}%

  ${color('CHOP POINTS', COLORS.magenta)} (${chops.length} total)
${chops.slice(0, 8).map((c, i) =>
  `    ${(i + 1).toString().padStart(2)}. @${(c.time * 100).toFixed(1)}% - ${c.repeat}x repeat${c.reverse ? ' [REV]' : ''}`
).join('\n')}
    ${chops.length > 8 ? `    ... and ${chops.length - 8} more` : ''}

  ${color('techniques applied:', COLORS.dim)}
  - golden ratio spacing for organic feel
  - vocal syllable repetition
  - pitched-down bass enhancement
  - syrupy reverb wash

  ${color('usage:', COLORS.dim)} /chop [intensity 0-1]

${pick(WAVES)}
`)
        break

      case 'rhythm':
      case 'euclidean':
        // Generate euclidean rhythm
        const hits = args[0] ? parseInt(args[0]) : 5
        const steps = args[1] ? parseInt(args[1]) : 8
        const rotation = args[2] ? parseInt(args[2]) : 0

        const h = isNaN(hits) ? 5 : Math.max(1, Math.min(16, hits))
        const s = isNaN(steps) ? 8 : Math.max(h, Math.min(32, steps))
        const r = isNaN(rotation) ? 0 : rotation

        const pattern = euclidean(h, s, r)

        console.log(`
${color('▂▃▄▅▆▇█', COLORS.green)} ${color('EUCLIDEAN RHYTHM', COLORS.green)} ${color('█▇▆▅▄▃▂', COLORS.green)}

  ${color(`E(${h},${s})`, COLORS.yellow)} ${r !== 0 ? `rotation: ${r}` : ''}

  ${color('pattern:', COLORS.cyan)}
  ${pattern.map(x => x === 1 ? color('█', COLORS.magenta) : color('░', COLORS.dim)).join('')}

  ${color('as triggers:', COLORS.dim)}
  ${pattern.map((x, i) => x === 1 ? (i + 1).toString() : '-').join(' ')}

  ${color('common patterns:', COLORS.yellow)}
    E(3,8) - Cuban Tresillo
    E(5,8) - Afro-Cuban Cinquillo
    E(7,16) - Brazilian Samba
    E(5,12) - South African Venda
    E(4,9) - Turkish Aksak

  ${color('usage:', COLORS.dim)} /rhythm <hits> <steps> [rotation]

${pick(WAVES)}
`)
        break

      case 'chords':
        // Get genre-appropriate chords
        const chordGenre = (args[0] || 'lofi') as GenreType
        const chordKey = args[1] || 'C'
        const chordOctave = args[2] ? parseInt(args[2]) : 3

        if (!GENRE_PROFILES[chordGenre]) {
          console.log(`\n  ${color('unknown genre. try: lofi, breakcore, cottagecore, frutiger, vaporwave', COLORS.dim)}\n`)
          break
        }

        const chords = getGenreChords(chordGenre, chordKey, isNaN(chordOctave) ? 3 : chordOctave)
        const scale = getGenreScale(chordGenre, chordKey, isNaN(chordOctave) ? 4 : chordOctave + 1)

        console.log(`
${color('▂▃▄▅▆▇█', COLORS.yellow)} ${color('GENRE CHORDS', COLORS.yellow)} ${color('█▇▆▅▄▃▂', COLORS.yellow)}

  ${color('genre:', COLORS.cyan)} ${chordGenre}
  ${color('key:', COLORS.cyan)} ${chordKey}
  ${color('octave:', COLORS.cyan)} ${chordOctave}

  ${color('recommended chords:', COLORS.magenta)}
${chords.map((c, i) =>
  `    ${(i + 1).toString().padStart(2)}. ${c.name.padEnd(8)} [${c.frequencies.map(f => Math.round(f)).join(', ')} Hz]`
).join('\n')}

  ${color('scale frequencies (432Hz tuning):', COLORS.green)}
    ${scale.map(f => Math.round(f)).join(' → ')} Hz

  ${color('usage:', COLORS.dim)} /chords <genre> [key] [octave]

${pick(WAVES)}
`)
        break

      case 'piano':
        // Live emotional piano performance - CONTINUOUS by default
        if (args[0] === 'play' || args.length === 0) {
          // Start continuous piano playback for ambient vibes
          const pianoEmotion = args[1] as EmotionToken | undefined
          const targetEmotion = pianoEmotion
            ? `EMOTE_${pianoEmotion.toUpperCase()}` as EmotionToken
            : kaios.getEmotionState()

          console.log(`\n${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('♪ PIANO', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}`)
          console.log(`  ${color('emotion:', COLORS.dim)} ${targetEmotion.replace('EMOTE_', '').toLowerCase()}`)
          console.log(`  ${color('playing continuously...', COLORS.cyan)}`)
          console.log(`  ${color('use /piano stop to end', COLORS.dim)}`)
          console.log()

          pianoEngine.setEmotion(targetEmotion)
          pianoEngine.playContinuous('mixed')

        } else if (args[0] === 'joji') {
          // Play Joji-inspired continuous piano
          console.log(`\n${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('♪ JOJI MODE', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}`)
          console.log(`  ${color('sparse... melancholic... lo-fi...', COLORS.dim)}`)
          console.log(`  ${color('playing continuously...', COLORS.cyan)}`)
          console.log(`  ${color('use /piano stop to end', COLORS.dim)}`)
          console.log()

          pianoEngine.setEmotion('EMOTE_SAD')
          pianoEngine.playContinuous('joji')

        } else if (args[0] === 'yeule') {
          // Play Yeule-inspired continuous piano
          console.log(`\n${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color('♪ YEULE MODE', COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}`)
          console.log(`  ${color('ethereal... glitchy... softscars...', COLORS.dim)}`)
          console.log(`  ${color('playing continuously...', COLORS.cyan)}`)
          console.log(`  ${color('use /piano stop to end', COLORS.dim)}`)
          console.log()

          pianoEngine.setEmotion('EMOTE_AWKWARD')
          pianoEngine.playContinuous('yeule')

        } else if (args[0] === 'ambient') {
          // Start ambient continuous piano (super sparse)
          console.log(`\n${color('▂▃▄▅▆▇█', COLORS.green)} ${color('♪ AMBIENT PIANO', COLORS.green)} ${color('█▇▆▅▄▃▂', COLORS.green)}`)
          console.log(`  ${color('floating... sparse... ethereal...', COLORS.dim)}`)
          console.log(`  ${color('playing continuously...', COLORS.cyan)}`)
          console.log(`  ${color('use /piano stop to end', COLORS.dim)}`)
          console.log()

          pianoEngine.playContinuous('ambient')

        } else if (args[0] === 'stop') {
          pianoEngine.stop()
          console.log(`\n  ${pick(SOUND_MARKERS)} ${color('piano stopped', COLORS.dim)} ${pick(WAVES)}\n`)

        } else if (args[0] === 'note') {
          // Play a single note
          const note = args[1] || 'A4'
          const duration = args[2] ? parseInt(args[2]) : 800
          const velocity = args[3] ? parseFloat(args[3]) : 0.5

          console.log(`  ${color('♪', COLORS.magenta)} ${note} ${color(`(${duration}ms, ${velocity})`, COLORS.dim)}`)
          await pianoEngine.playNote(note.toUpperCase(), duration, velocity)

        } else if (args[0] === 'chord') {
          // Play a chord
          const root = args[1] || 'A'
          const chordType = (args[2] || 'minor7') as any
          const octave = args[3] ? parseInt(args[3]) : 3

          console.log(`  ${color('♪', COLORS.magenta)} ${root}${chordType} (octave ${octave})`)
          await pianoEngine.playChord(root.toUpperCase(), chordType, octave, 1000, 0.5)

        } else if (args[0] === 'visualizer' || args[0] === 'viz' || args[0] === 'ui') {
          // Open the visual piano UI (DAW plugin style)
          if (args[1] === 'stop') {
            pianoVisualizer.stop()
            console.log(`\n  ${pick(SOUND_MARKERS)} ${color('piano visualizer stopped', COLORS.dim)} ${pick(WAVES)}\n`)
          } else {
            console.log(`\n${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('♪ PIANO VISUALIZER', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}`)
            console.log(`  ${color('launching DAW-style piano UI...', COLORS.dim)}`)

            try {
              const vizState = await pianoVisualizer.start()
              console.log(`  ${color('✓ visualizer running!', COLORS.green)}`)
              console.log(`  ${color(`url: ${vizState.url}`, COLORS.cyan)}`)
              console.log(`
  ${color('features:', COLORS.dim)}
  - real-time key visualization
  - falling notes animation
  - emotion/key/scale display
  - 432Hz sacred geometry tuning

  ${color('keys light up as kaios plays~', COLORS.magenta)} ${pick(WAVES)}

  use ${color('/piano viz stop', COLORS.dim)} to close
`)
            } catch (err) {
              console.log(`  ${color('[error]', COLORS.red)} ${err instanceof Error ? err.message : 'could not start visualizer'}`)
              console.log(`  ${color('port 3334 may be in use', COLORS.dim)}\n`)
            }
          }

        } else {
          // Show piano help
          const state = pianoEngine.getState()
          console.log(`
${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('♪ KAIOS PIANO', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}

  ${color('kawaii brutalist pianist', COLORS.dim)}
  ${color('432Hz tuning · real music theory', COLORS.dim)}

  ${color('current state:', COLORS.yellow)}
    emotion: ${state.currentEmotion.replace('EMOTE_', '').toLowerCase()}
    key: ${state.currentKey}
    scale: ${state.currentScale}
    notes played: ${state.notesPlayed}

  ${color('CONTINUOUS PLAY (ambient vibes)', COLORS.cyan)}
  /piano              - start continuous piano (mixed style)
  /piano play sad     - continuous with sad emotion
  /piano play happy   - continuous with happy emotion

  ${color('ARTIST MODES (continuous)', COLORS.magenta)}
  /piano joji         - continuous In Tongues, Ballads 1 vibes
  /piano yeule        - continuous Glitch Princess, softscars vibes

  ${color('AMBIENT (continuous, very sparse)', COLORS.green)}
  /piano ambient      - floating sparse ethereal loop

  ${color('MANUAL PLAY', COLORS.yellow)}
  /piano note A4 800 0.5  - play note (pitch, duration, velocity)
  /piano chord A minor7 3 - play chord (root, type, octave)
  /piano stop             - stop playback

  ${color('VISUAL', COLORS.cyan)}
  /piano viz              - ${color('open DAW-style piano UI!', COLORS.cyan)}
  /piano viz stop         - close visualizer

  ${color('sonic inspirations:', COLORS.dim)}
  - joji: sparse, melancholic, lo-fi piano
  - yeule: ethereal, glitchy, ambient textures
  - 432Hz: sacred geometry frequency tuning

${pick(WAVES)}
`)
        }
        break

      default:
        console.log(`\n  ${pick(SOUND_MARKERS)} unknown command: /${command}`)
        console.log(`  type /help for available commands ${pick(WAVES)}\n`)
    }
  }

  // Prompt helper
  const prompt = (): void => {
    rl.question(`${color('you', COLORS.cyan)} ${color('>', COLORS.dim)} `, async (input) => {
      await handleInput(input)
      prompt()
    })
  }

  prompt()

  // Handle Ctrl+C gracefully
  rl.on('close', () => {
    console.log()
    console.log(`${color('(◕‿◕)', COLORS.magenta)} ${color(`bye bye~ ${pick(WAVES)}`, COLORS.dim)}`)
    console.log()
    process.exit(0)
  })
}

// Run CLI
main().catch((error) => {
  console.error('fatal error:', error)
  process.exit(1)
})
