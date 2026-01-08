/**
 * Effects Chain - Audio effects processing for Sound Intelligence
 * Provides reverb, delay, glitch, and other effects
 */

export interface EffectParams {
  name: string
  params: Record<string, number>
}

export interface ReverbParams {
  roomSize: number // 0-1
  damping: number // 0-1
  wetDry: number // 0-1
}

export interface DelayParams {
  time: number // seconds
  feedback: number // 0-1
  wetDry: number // 0-1
}

export interface GlitchParams {
  amount: number // 0-1
  type: 'stutter' | 'bitcrush' | 'tape'
}

export interface ChorusParams {
  rate: number // Hz
  depth: number // 0-1
  wetDry: number // 0-1
}

export interface DistortionParams {
  amount: number // 0-1
  type: 'soft' | 'hard' | 'fuzz'
}

/**
 * Audio effects chain processor
 */
export class EffectsChain {
  private audioContext: AudioContext | null = null
  private effects: Map<string, AudioNode> = new Map()

  constructor(audioContext?: AudioContext) {
    this.audioContext = audioContext || null
  }

  /**
   * Set audio context
   */
  setContext(context: AudioContext): void {
    this.audioContext = context
  }

  /**
   * Apply reverb effect
   */
  async applyReverb(
    inputNode: AudioNode,
    params: ReverbParams
  ): Promise<AudioNode> {
    if (!this.audioContext) {
      throw new Error('AudioContext not set')
    }

    // Create convolver for reverb
    const convolver = this.audioContext.createConvolver()

    // Generate impulse response
    const impulseResponse = this.generateImpulseResponse(
      this.audioContext,
      params.roomSize * 3, // Duration in seconds
      params.damping
    )
    convolver.buffer = impulseResponse

    // Create wet/dry mix
    const dryGain = this.audioContext.createGain()
    const wetGain = this.audioContext.createGain()
    const output = this.audioContext.createGain()

    dryGain.gain.value = 1 - params.wetDry
    wetGain.gain.value = params.wetDry

    inputNode.connect(dryGain)
    inputNode.connect(convolver)
    convolver.connect(wetGain)

    dryGain.connect(output)
    wetGain.connect(output)

    this.effects.set('reverb', convolver)

    return output
  }

  /**
   * Apply delay effect
   */
  applyDelay(
    inputNode: AudioNode,
    params: DelayParams
  ): AudioNode {
    if (!this.audioContext) {
      throw new Error('AudioContext not set')
    }

    const delay = this.audioContext.createDelay(5)
    delay.delayTime.value = params.time

    const feedback = this.audioContext.createGain()
    feedback.gain.value = params.feedback

    const dryGain = this.audioContext.createGain()
    const wetGain = this.audioContext.createGain()
    const output = this.audioContext.createGain()

    dryGain.gain.value = 1 - params.wetDry
    wetGain.gain.value = params.wetDry

    // Connect delay feedback loop
    inputNode.connect(delay)
    delay.connect(feedback)
    feedback.connect(delay)

    // Mix dry and wet
    inputNode.connect(dryGain)
    delay.connect(wetGain)

    dryGain.connect(output)
    wetGain.connect(output)

    this.effects.set('delay', delay)

    return output
  }

  /**
   * Apply chorus effect
   */
  applyChorus(
    inputNode: AudioNode,
    params: ChorusParams
  ): AudioNode {
    if (!this.audioContext) {
      throw new Error('AudioContext not set')
    }

    // Create modulated delay for chorus
    const delay1 = this.audioContext.createDelay()
    const delay2 = this.audioContext.createDelay()

    delay1.delayTime.value = 0.02
    delay2.delayTime.value = 0.025

    // LFO for modulation
    const lfo = this.audioContext.createOscillator()
    const lfoGain = this.audioContext.createGain()

    lfo.frequency.value = params.rate
    lfoGain.gain.value = params.depth * 0.002

    lfo.connect(lfoGain)
    lfoGain.connect(delay1.delayTime)

    // Create another LFO slightly detuned
    const lfo2 = this.audioContext.createOscillator()
    const lfo2Gain = this.audioContext.createGain()

    lfo2.frequency.value = params.rate * 1.1
    lfo2Gain.gain.value = params.depth * 0.002

    lfo2.connect(lfo2Gain)
    lfo2Gain.connect(delay2.delayTime)

    // Mix
    const dryGain = this.audioContext.createGain()
    const wetGain = this.audioContext.createGain()
    const output = this.audioContext.createGain()

    dryGain.gain.value = 1 - params.wetDry
    wetGain.gain.value = params.wetDry * 0.5

    inputNode.connect(dryGain)
    inputNode.connect(delay1)
    inputNode.connect(delay2)
    delay1.connect(wetGain)
    delay2.connect(wetGain)

    dryGain.connect(output)
    wetGain.connect(output)

    lfo.start()
    lfo2.start()

    this.effects.set('chorus', delay1)

    return output
  }

  /**
   * Apply distortion effect
   */
  applyDistortion(
    inputNode: AudioNode,
    params: DistortionParams
  ): AudioNode {
    if (!this.audioContext) {
      throw new Error('AudioContext not set')
    }

    const waveshaper = this.audioContext.createWaveShaper()

    // Generate distortion curve based on type
    waveshaper.curve = this.generateDistortionCurve(params.amount, params.type)
    waveshaper.oversample = '4x'

    inputNode.connect(waveshaper)

    this.effects.set('distortion', waveshaper)

    return waveshaper
  }

  /**
   * Apply glitch/stutter effect
   */
  applyGlitch(
    inputNode: AudioNode,
    params: GlitchParams
  ): AudioNode {
    if (!this.audioContext) {
      throw new Error('AudioContext not set')
    }

    // For glitch, we use a combination of effects
    if (params.type === 'bitcrush') {
      return this.applyBitcrush(inputNode, params.amount)
    }

    // Stutter effect using rapid gain modulation
    const gain = this.audioContext.createGain()
    inputNode.connect(gain)

    // Create stutter LFO
    const lfo = this.audioContext.createOscillator()
    const lfoGain = this.audioContext.createGain()

    lfo.type = 'square'
    lfo.frequency.value = 4 + params.amount * 16 // 4-20 Hz
    lfoGain.gain.value = params.amount

    lfo.connect(lfoGain)
    lfoGain.connect(gain.gain)

    lfo.start()

    this.effects.set('glitch', gain)

    return gain
  }

  /**
   * Adjust an effect's parameters
   */
  adjustEffect(name: string, params: Record<string, number>): void {
    const effect = this.effects.get(name)
    if (!effect) {
      console.warn(`Effect '${name}' not found`)
      return
    }

    // Apply parameter changes based on effect type
    if (effect instanceof GainNode && params.gain !== undefined) {
      effect.gain.value = params.gain
    }

    if (effect instanceof DelayNode && params.time !== undefined) {
      effect.delayTime.value = params.time
    }
  }

  /**
   * Remove all effects
   */
  clear(): void {
    this.effects.clear()
  }

  /**
   * Dispose of all resources
   */
  dispose(): void {
    this.effects.clear()
    this.audioContext = null
  }

  // ═══════════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════════

  private generateImpulseResponse(
    context: AudioContext,
    duration: number,
    decay: number
  ): AudioBuffer {
    const sampleRate = context.sampleRate
    const length = sampleRate * duration
    const buffer = context.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel)

      for (let i = 0; i < length; i++) {
        const t = i / sampleRate
        const envelope = Math.exp(-t * (1 + decay * 5))
        channelData[i] = (Math.random() * 2 - 1) * envelope
      }
    }

    return buffer
  }

  private generateDistortionCurve(
    amount: number,
    type: 'soft' | 'hard' | 'fuzz'
  ): Float32Array<ArrayBuffer> {
    const samples = 44100
    const curve = new Float32Array(samples) as Float32Array<ArrayBuffer>
    const k = amount * 100

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1

      switch (type) {
        case 'soft':
          // Soft clipping
          curve[i] = Math.tanh(k * x)
          break
        case 'hard':
          // Hard clipping
          curve[i] = Math.max(-1, Math.min(1, k * x))
          break
        case 'fuzz':
          // Asymmetric fuzz
          curve[i] = Math.sign(x) * Math.pow(Math.abs(Math.tanh(k * x)), 0.5)
          break
        default:
          curve[i] = x
      }
    }

    return curve
  }

  private applyBitcrush(inputNode: AudioNode, amount: number): AudioNode {
    if (!this.audioContext) {
      throw new Error('AudioContext not set')
    }

    // Simulate bitcrushing using sample rate reduction
    // This is a simplified version - real bitcrushing would use a ScriptProcessor or AudioWorklet

    const filter = this.audioContext.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 22050 - amount * 20000 // Reduce high frequencies

    inputNode.connect(filter)

    return filter
  }
}
