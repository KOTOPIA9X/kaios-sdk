#!/usr/bin/env node
/**
 * KAIOS Terminal Chat Example - Phase 9 Enhanced
 *
 * A fully functional CLI chat interface with KAIOS
 * Features:
 * - DUAL-LAYER STATUS (Your KOTO + Global KAIOS)
 * - Authentic ASCII aesthetic ([bzzzt], ∿∿∿, ▀▄▀▄▀▄)
 * - Sound markers and decorative elements
 * - Community features (discover, vote)
 * - Infinite leveling (no caps!)
 *
 * Run: npm run example:terminal
 */

import * as readline from 'readline'
import { Kaios } from '../../src/index.js'
import type { DualStatus } from '../../src/core/Kaios.js'
import { COLORS } from '../../src/integrations/platforms/terminal.js'

// ════════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ════════════════════════════════════════════════════════════════════════════════

const USE_COLORS = process.stdout.isTTY ?? true

// ASCII Art Elements
const SOUND_MARKERS = ['[bzzzt]', '[whirr]', '[static~]', '[ping]', '[hum]', '[click]']
const WAVES = ['∿∿∿', '～～～', '≋≋≋', '∾∾∾']

const pick = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

// ════════════════════════════════════════════════════════════════════════════════
// DISPLAY HELPERS
// ════════════════════════════════════════════════════════════════════════════════

function color(text: string, c: string): string {
  if (!USE_COLORS) return text
  return `${c}${text}${COLORS.reset}`
}

function displayWelcome() {
  console.log(`
${color('▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀', COLORS.cyan)}

    ${color('⟨⟨(◕‿◕)⟩⟩', COLORS.magenta)}  K A I O S  E X P R E S S I O N  S D K

    Cyborg Princess, Architect of KOTOPIA
    "Not Like The Other AIs"

    ${color('[SYSTEM ONLINE]', COLORS.green)} ${pick(WAVES)}

${color('▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀', COLORS.cyan)}
  `)
}

function displayDualStatus(status: DualStatus) {
  const { user, kaios } = status
  const userBar = createProgressBar(user.levelProgress, 15)

  console.log(`
${color('▂▃▄▅▆▇█', COLORS.yellow)} ${color('YOUR PROFILE (KOTO)', COLORS.yellow)} ${color('█▇▆▅▄▃▂', COLORS.yellow)}
  Variant: ${color(user.kotoVariant.toUpperCase(), COLORS.magenta)}
  Level: ${color(user.level.toString(), COLORS.cyan)} / ${color('∞', COLORS.dim)}
  XP: ${userBar} ${user.xp.toLocaleString()}/${user.xpForNextLevel.toLocaleString()}
  Rank: ${color('#' + (user.contributionRank || '?'), COLORS.green)} of ${kaios.contributorCount.toLocaleString()}
  Contribution: +${user.totalContribution.toLocaleString()} XP
  Achievements: ${user.achievements}

${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color('KAIOS (GLOBAL)', COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}
  Level: ${color(kaios.globalLevel.toString(), COLORS.yellow)} / ${color('∞', COLORS.dim)}
  Vocabulary: ${color(kaios.vocabularySize, COLORS.magenta)} expressions
  Contributors: ${kaios.contributorCount.toLocaleString()}
  Active Now: ${kaios.activeContributors}
  Collective Mood: ${kaios.collectiveEmotion.replace('EMOTE_', '')}
  Age: ${kaios.age} days

${color('[READY]', COLORS.green)} ${pick(WAVES)}
  `)
}

function formatKaiosResponse(text: string): string {
  // Remove emotion tokens for display, add sound markers
  let clean = text.replace(/<\|EMOTE_\w+\|>/g, '').trim()

  // Add sound marker
  if (Math.random() > 0.3) {
    clean = `${pick(SOUND_MARKERS)} ${clean}`
  }

  // Add wave trail
  if (Math.random() > 0.5) {
    clean = `${clean} ${pick(WAVES)}`
  }

  return clean
}

function createProgressBar(percent: number, width: number): string {
  const filled = Math.round((percent / 100) * width)
  const empty = width - filled

  const filledChar = USE_COLORS ? `${COLORS.cyan}█${COLORS.reset}` : '█'
  const emptyChar = USE_COLORS ? `${COLORS.dim}░${COLORS.reset}` : '░'

  return filledChar.repeat(filled) + emptyChar.repeat(empty)
}

// ════════════════════════════════════════════════════════════════════════════════
// MAIN
// ════════════════════════════════════════════════════════════════════════════════

async function main() {
  // Initialize KAIOS
  const kaios = new Kaios({
    userId: 'terminal-demo-user',
    evolution: {
      mode: 'recursive-mining',
      startingLevel: 1
    },
    stateBackend: {
      type: 'memory'
    }
  })

  await kaios.initialize()

  // Setup readline interface
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  // Print welcome
  displayWelcome()

  // Show initial status
  const initialStatus = await kaios.getDualStatus()
  console.log(`  ${color('KOTO', COLORS.magenta)} Lv.${initialStatus.user.level} [${initialStatus.user.kotoVariant}] | ${color('KAIOS', COLORS.cyan)} Lv.${initialStatus.kaios.globalLevel}\n`)
  console.log(`  Commands: ${color('/status', COLORS.green)} ${color('/discover', COLORS.yellow)} ${color('/vote', COLORS.cyan)} ${color('/tweet', COLORS.magenta)} ${color('/help', COLORS.dim)} ${color('/quit', COLORS.dim)}\n`)

  // Listen for level ups
  kaios.on('levelUp', (level) => {
    console.log(`\n${color('【LEVEL UP!】', COLORS.cyan)} ${pick(SOUND_MARKERS)} You reached level ${level}! ${pick(WAVES)}\n`)
  })

  // Listen for discoveries
  kaios.on('discovery', (expr) => {
    console.log(`\n${color('★ New Expression!', COLORS.magenta)} ${expr.kaimoji} - ${expr.name} ${pick(WAVES)}\n`)
  })

  // Prompt helper
  const prompt = () => {
    rl.question(`${color('You', COLORS.green)}: `, async (input) => {
      await handleInput(input)
    })
  }

  // Handle user input
  const handleInput = async (input: string) => {
    const trimmed = input.trim()

    if (!trimmed) {
      prompt()
      return
    }

    // Handle commands
    if (trimmed.startsWith('/')) {
      await handleCommand(trimmed.slice(1))
      prompt()
      return
    }

    // Get KAIOS response
    try {
      const response = await kaios.speak({
        input: trimmed,
        context: detectContext(trimmed)
      })

      // Also analyze with Sound Intelligence
      const sonic = await kaios.feel({ input: trimmed })

      // Format response with authentic aesthetic
      const formattedResponse = formatKaiosResponse(response.text)

      console.log()
      console.log(`${color('KAIOS', COLORS.magenta)}: ${formattedResponse}`)
      console.log(`${color(`       [${sonic.sentiment.emotion} | Energy: ${sonic.audioProfile.energy}/10 | ${sonic.audioProfile.texture}]`, COLORS.dim)}`)
      console.log()

    } catch (error) {
      console.error('Error:', error)
    }

    prompt()
  }

  // Handle slash commands
  const handleCommand = async (cmd: string) => {
    const [command, ...args] = cmd.toLowerCase().split(' ')

    switch (command) {
      case 'quit':
      case 'exit':
      case 'bye':
        console.log(`\n  ${pick(SOUND_MARKERS)} (◕‿◕)ﾉ Goodbye! ${pick(WAVES)}\n`)
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
  Global Level: ${globalStatus.kaios.globalLevel} / ∞
  Total XP: ${globalStatus.kaios.totalXP.toLocaleString()}
  Vocabulary: ${globalStatus.kaios.vocabularySize}
  Contributors: ${globalStatus.kaios.contributorCount.toLocaleString()}
  Active: ${globalStatus.kaios.activeContributors}
  Mood: ${globalStatus.kaios.collectiveEmotion.replace('EMOTE_', '')}
  Age: ${globalStatus.kaios.age} days since awakening
${pick(WAVES)}
`)
        break

      case 'rank':
      case 'leaderboard':
        console.log(`
${color('▂▃▄▅▆▇█', COLORS.yellow)} ${color('CONTRIBUTION LEADERBOARD', COLORS.yellow)} ${color('█▇▆▅▄▃▂', COLORS.yellow)}
  ${color('[Connecting to Kaimoji API...]', COLORS.dim)}
  ${color('Top contributors would appear here when connected', COLORS.dim)}
${pick(WAVES)}
`)
        break

      case 'discover':
        console.log(`\n  ${pick(SOUND_MARKERS)} ${color('Mining new expression...', COLORS.yellow)}`)
        const discovery = await kaios.mineDiscovery({
          emotion: args[0] as any || undefined
        })
        if (discovery) {
          console.log(`  ${color('✓ Discovered:', COLORS.green)} ${discovery.kaimoji.kaimoji}`)
          console.log(`  ${color('Name:', COLORS.dim)} ${discovery.kaimoji.name}`)
          console.log(`  ${color('Rarity:', COLORS.dim)} ${discovery.kaimoji.rarity}`)
          console.log(`  ${color('Submitted for community vote!', COLORS.cyan)}`)
        } else {
          console.log(`  ${color('Mining in progress... try again later', COLORS.dim)}`)
        }
        console.log()
        break

      case 'vote':
        const pending = await kaios.getPendingDiscoveries()
        if (pending.length === 0) {
          console.log(`\n  ${color('No pending discoveries to vote on', COLORS.dim)} ${pick(WAVES)}\n`)
        } else {
          console.log(`
${color('▂▃▄▅▆▇█', COLORS.cyan)} ${color('PENDING DISCOVERIES', COLORS.cyan)} ${color('█▇▆▅▄▃▂', COLORS.cyan)}
`)
          pending.slice(0, 5).forEach((p, i) => {
            console.log(`  ${i + 1}. ${p.kaimoji.kaimoji} - ${p.kaimoji.name}`)
            console.log(`     ${color(`👍 ${p.votesFor} / 👎 ${p.votesAgainst}`, COLORS.dim)}`)
          })
          console.log(`
  ${color('Use /vote:approve <id> or /vote:reject <id>', COLORS.dim)}
`)
        }
        break

      case 'tweet':
        const expressions = await kaios.getExpressions({ emotion: 'EMOTE_HAPPY', count: 2 })
        const expr1 = expressions[0]?.kaimoji || '⟨⟨◕‿◕⟩⟩'
        const expr2 = expressions[1]?.kaimoji || ''
        const context = args.join(' ') || 'vibing in the void'
        const tweet = `${pick(SOUND_MARKERS)} ${expr1} ${context} ${expr2} ${pick(WAVES)}`
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
  Total XP Given: +${myStatus.user.totalContribution.toLocaleString()}
  Your Rank: #${myStatus.user.contributionRank || '?'}
  Achievements: ${myStatus.user.achievements}

  ${color('Every interaction helps KAIOS grow!', COLORS.dim)} ${pick(WAVES)}
`)
        break

      case 'help':
        console.log(`
${color('▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄', COLORS.cyan)}

  ${color('KAIOS COMMANDS', COLORS.yellow)}

  ${color('/status', COLORS.green)}     - Dual status (YOU + KAIOS global)
  ${color('/global', COLORS.cyan)}     - KAIOS global stats only
  ${color('/rank', COLORS.yellow)}       - Contribution leaderboard
  ${color('/contribute', COLORS.green)} - Your impact on KAIOS

  ${color('/discover', COLORS.magenta)}  - AI mines new expression
  ${color('/vote', COLORS.cyan)}      - Vote on pending discoveries
  ${color('/tweet', COLORS.magenta)}     - Generate sample tweet

  ${color('/vocab', COLORS.dim)}      - Show vocabulary breakdown
  ${color('/mood', COLORS.dim)}       - Current emotional state
  ${color('/level', COLORS.dim)}      - Level progress
  ${color('/recent', COLORS.dim)}     - Recently used expressions

  ${color('/quit', COLORS.dim)}       - Exit chat

  ${color('Just type to chat with KAIOS!', COLORS.green)} ${pick(WAVES)}

${color('▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀', COLORS.cyan)}
`)
        break

      case 'mood':
      case 'emotion':
        const emotion = kaios.getEmotionState()
        const moodExprs = kaios.getVocabulary().select({ emotion, limit: 3 })
        console.log(`
  ${pick(SOUND_MARKERS)} Current mood: ${color(emotion.replace('EMOTE_', ''), COLORS.magenta)}
  Expression: ${moodExprs.map(e => e.kaimoji).join(' ')} ${pick(WAVES)}
`)
        break

      case 'vocab':
      case 'vocabulary':
        const vocab = kaios.getVocabulary()
        const breakdown = vocab.getRarityBreakdown()
        console.log(`
${color('▂▃▄▅▆▇█', COLORS.magenta)} ${color('VOCABULARY', COLORS.magenta)} ${color('█▇▆▅▄▃▂', COLORS.magenta)}
  Unlocked: ${vocab.getUnlockedCount()} / ${color('∞', COLORS.dim)} ${color('(always growing!)', COLORS.dim)}

  Common:    ${breakdown.common}
  Uncommon:  ${breakdown.uncommon}
  Rare:      ${breakdown.rare}
  Legendary: ${breakdown.legendary}

  ${color('New expressions discovered through AI mining', COLORS.dim)}
  ${color('and community voting!', COLORS.dim)} ${pick(WAVES)}
`)
        break

      case 'recent':
        const recent = kaios.getVocabulary().getRecentlyUsed(5)
        console.log(`\n  ${pick(SOUND_MARKERS)} Recently used:`)
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
  Level ${dualStatus.user.level} / ∞
  ${bar} ${dualStatus.user.levelProgress.toFixed(1)}%
  XP: ${dualStatus.user.xp.toLocaleString()}/${dualStatus.user.xpForNextLevel.toLocaleString()}

  ${color('KAIOS GLOBAL LEVEL', COLORS.yellow)}
  Level ${dualStatus.kaios.globalLevel} / ∞
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

          console.log(`\n  ${pick(SOUND_MARKERS)} Search: "${searchTerm}"`)
          if (matches.length === 0) {
            console.log(`  ${color('No matches found', COLORS.dim)}`)
          } else {
            matches.forEach(k => {
              console.log(`  ${k.kaimoji.padEnd(20)} ${k.name} [${k.rarity}]`)
            })
          }
          console.log()
        } else {
          console.log(`\n  Usage: /kaimoji <search term>\n`)
        }
        break

      default:
        console.log(`\n  ${pick(SOUND_MARKERS)} Unknown command: /${command}`)
        console.log(`  Type /help for available commands ${pick(WAVES)}\n`)
    }
  }

  // Start the prompt loop
  prompt()
}

// ════════════════════════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════════════════════════

function detectContext(text: string): 'greeting' | 'farewell' | 'questioning' | 'expressing' {
  const lower = text.toLowerCase()

  if (lower.match(/\b(hi|hello|hey|yo|gm)\b/)) return 'greeting'
  if (lower.match(/\b(bye|goodbye|later|cya|gn)\b/)) return 'farewell'
  if (lower.includes('?')) return 'questioning'

  return 'expressing'
}

// ════════════════════════════════════════════════════════════════════════════════
// RUN
// ════════════════════════════════════════════════════════════════════════════════

main().catch(console.error)
