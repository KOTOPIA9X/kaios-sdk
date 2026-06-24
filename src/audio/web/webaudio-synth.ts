/**
 * WebAudio FM-Rhodes synth — KAIOS's real timbre in the browser.
 *
 * The SDK's only sound output was the terminal sox synth (sine + reverb). This is the voice from
 * love.kaios.chat's `letter/piano.js` — itself "ported from the SDK piano engine" — brought home:
 * an FM electric-piano (Rhodes-ish) with two detuned carriers (chorus/air), a bell-tine FM attack
 * that decays to a mellow body, a soft ADSR, a smooth (non-metallic) convolution reverb, and a
 * barely-there tape-air bed (Yoshimura warmth). 432Hz tuning, via the SDK's `noteToFreq`.
 *
 * It is a drop-in OUTPUT backend: the PianoEngine composes notes and emits them through a
 * `playNoteCallback(note, duration, velocity)`; pass `synth.play` as that callback and the
 * generative brain plays through this voice. Browser-only (needs Web Audio); a no-op elsewhere.
 *
 * @example
 * ```ts
 * const synth = new WebAudioSynth()
 * await synth.resume()                 // from a user gesture (browsers gate audio)
 * piano.setPlayNoteCallback(synth.play) // the brain now plays through the Rhodes
 * // or directly:
 * synth.strike(noteToFreq('Eb4'), 3, 0.7, 0.5)
 * ```
 */
import { noteToFreq } from '../intelligence/music-theory.js'

// WebAudio objects are typed loosely so the SDK compiles without the DOM lib; the public API is typed.
type Ctx = any

export interface WebAudioSynthOptions {
  /** master output level after fade-in (default 0.22) */
  masterGain?: number
  /** reverb tail length, seconds (default 4.2) */
  reverbSeconds?: number
  /** reverb decay shaping (default 2.4) */
  reverbDecay?: number
  /** master lowpass cutoff Hz — felt, never harsh (default 6200) */
  lowpassHz?: number
}

const rnd = (a: number, b: number): number => a + Math.random() * (b - a)

export class WebAudioSynth {
  private ctx: Ctx = null
  private dry: any = null
  private verb: any = null
  private airGain: any = null
  private readonly opt: Required<WebAudioSynthOptions>

  constructor(opts: WebAudioSynthOptions = {}) {
    this.opt = {
      masterGain: opts.masterGain ?? 0.22,
      reverbSeconds: opts.reverbSeconds ?? 4.2,
      reverbDecay: opts.reverbDecay ?? 2.4,
      lowpassHz: opts.lowpassHz ?? 6200,
    }
  }

  /** Whether Web Audio is available (browser). */
  static get available(): boolean {
    const g = globalThis as any
    return typeof g.AudioContext !== 'undefined' || typeof g.webkitAudioContext !== 'undefined'
  }

  /** Resume/start the audio context — call from a user gesture (browsers gate audio start). */
  async resume(): Promise<void> {
    this.build()
    try { await this.ctx?.resume?.() } catch { /* ignore */ }
  }

  private makeReverbIR(seconds: number, decay: number): any {
    const rate = this.ctx.sampleRate
    const len = (rate * seconds) | 0
    const buf = this.ctx.createBuffer(2, len, rate)
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c)
      for (let i = 0; i < len; i++) {
        const t = i / len
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay) // soft, smooth tail (not metallic)
      }
    }
    return buf
  }

  private build(): void {
    if (this.ctx) return
    const g = globalThis as any
    const AC = g.AudioContext || g.webkitAudioContext
    if (!AC) return // not a browser — synth is a no-op
    const ctx = new AC()
    this.ctx = ctx
    const master = ctx.createGain(); master.gain.value = 0.0; master.connect(ctx.destination)

    // gentle master lowpass — felt, never harsh
    const mlp = ctx.createBiquadFilter()
    mlp.type = 'lowpass'; mlp.frequency.value = this.opt.lowpassHz; mlp.Q.value = 0.3
    mlp.connect(master)

    this.dry = ctx.createGain(); this.dry.gain.value = 0.5; this.dry.connect(mlp)
    const wet = ctx.createGain(); wet.gain.value = 0.72; wet.connect(mlp)
    this.verb = ctx.createConvolver(); this.verb.buffer = this.makeReverbIR(this.opt.reverbSeconds, this.opt.reverbDecay); this.verb.connect(wet)

    // tape-air bed (Yoshimura warmth) — barely-there filtered noise
    const noiseLen = ctx.sampleRate * 2
    const nb = ctx.createBuffer(1, noiseLen, ctx.sampleRate)
    const nd = nb.getChannelData(0)
    for (let i = 0; i < noiseLen; i++) nd[i] = Math.random() * 2 - 1
    const airNode = ctx.createBufferSource(); airNode.buffer = nb; airNode.loop = true
    const af = ctx.createBiquadFilter(); af.type = 'lowpass'; af.frequency.value = 520; af.Q.value = 0.2
    this.airGain = ctx.createGain(); this.airGain.gain.value = 0.0
    airNode.connect(af); af.connect(this.airGain); this.airGain.connect(mlp)
    airNode.start()

    // master fade-in
    master.gain.setValueAtTime(0.0, ctx.currentTime)
    master.gain.linearRampToValueAtTime(this.opt.masterGain, ctx.currentTime + 2.2)
    this.airGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3.0)
  }

  /** Strike a frequency — the FM-Rhodes voice. `bright` 0..1 scales the tine attack. */
  strike(freq: number, dur = 3, vel = 0.7, bright = 0.4): void {
    this.build()
    const ctx = this.ctx
    if (!ctx || freq <= 0) return
    const t0 = ctx.currentTime

    // two slightly detuned carriers for chorus/air
    for (const [k, side] of [[0, -1], [1, 1]] as Array<[number, number]>) {
      const detune = side * rnd(3, 7)
      const carrier = ctx.createOscillator()
      carrier.type = 'sine'; carrier.frequency.value = freq; carrier.detune.value = detune

      // FM modulator → carrier.frequency (bell-tine attack decaying to mellow body)
      const mod = ctx.createOscillator()
      mod.type = 'sine'; mod.frequency.value = freq * (k === 0 ? 1 : 2) // 1:1 body + 2:1 shimmer
      const modGain = ctx.createGain()
      const idxAtk = freq * (2.2 + bright * 3.4)
      const idxBody = freq * 0.5
      modGain.gain.setValueAtTime(idxAtk, t0)
      modGain.gain.exponentialRampToValueAtTime(Math.max(1, idxBody), t0 + 0.16)
      mod.connect(modGain); modGain.connect(carrier.frequency)

      // amp envelope — soft attack, singing decay, long release
      const amp = ctx.createGain()
      const peak = vel * (k === 0 ? 1 : 0.5)
      amp.gain.setValueAtTime(0, t0)
      amp.gain.linearRampToValueAtTime(peak, t0 + 0.014)
      amp.gain.exponentialRampToValueAtTime(Math.max(0.0008, peak * 0.55), t0 + 0.28)
      amp.gain.exponentialRampToValueAtTime(0.0006, t0 + dur)

      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'; lp.frequency.value = 900 + vel * 3200 + bright * 2600; lp.Q.value = 0.5

      carrier.connect(amp); amp.connect(lp)
      lp.connect(this.dry); lp.connect(this.verb)

      carrier.start(t0); mod.start(t0)
      const stop = t0 + dur + 0.5
      carrier.stop(stop); mod.stop(stop)
    }
  }

  /** Drop-in for PianoEngine.setPlayNoteCallback — (note, duration, velocity). Arrow-bound. */
  play = async (note: string, duration = 3, velocity = 0.7): Promise<void> => {
    this.strike(noteToFreq(note), duration, velocity)
  }

  /** Release resources. */
  dispose(): void { try { this.ctx?.close?.() } catch { /* ignore */ } this.ctx = null }
}

export function createWebAudioSynth(opts?: WebAudioSynthOptions): WebAudioSynth {
  return new WebAudioSynth(opts)
}
