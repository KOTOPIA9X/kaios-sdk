'use strict';

// src/audio/emotion-mapper.ts
var EMOTION_SOUND_MAP = {
  happy: {
    frequency: "high",
    texture: "smooth",
    rhythm: "fast",
    descriptors: ["bright", "uplifting", "energetic", "major key"]
  },
  excited: {
    frequency: "high",
    texture: "rough",
    rhythm: "fast",
    descriptors: ["intense", "driving", "euphoric", "crescendo"]
  },
  sad: {
    frequency: "low",
    texture: "smooth",
    rhythm: "slow",
    descriptors: ["melancholic", "minor key", "sparse", "atmospheric"]
  },
  angry: {
    frequency: "low",
    texture: "rough",
    rhythm: "fast",
    descriptors: ["aggressive", "distorted", "heavy", "dissonant"]
  },
  contemplative: {
    frequency: "mid",
    texture: "ambient",
    rhythm: "slow",
    descriptors: ["meditative", "spacious", "evolving", "textural"]
  },
  curious: {
    frequency: "mid",
    texture: "glitchy",
    rhythm: "medium",
    descriptors: ["exploratory", "quirky", "playful", "unexpected"]
  },
  surprised: {
    frequency: "high",
    texture: "glitchy",
    rhythm: "chaotic",
    descriptors: ["sudden", "dynamic", "unpredictable", "staccato"]
  },
  peaceful: {
    frequency: "low",
    texture: "ambient",
    rhythm: "slow",
    descriptors: ["serene", "flowing", "minimal", "ethereal"]
  },
  chaotic: {
    frequency: "high",
    texture: "chaotic",
    rhythm: "chaotic",
    descriptors: ["glitchy", "fragmented", "intense", "overwhelming"]
  },
  neutral: {
    frequency: "mid",
    texture: "smooth",
    rhythm: "medium",
    descriptors: ["balanced", "steady", "neutral", "consistent"]
  }
};
function emotionToSound(sentiment) {
  const emotionKey = sentiment.emotion.toLowerCase();
  const baseProfile = EMOTION_SOUND_MAP[emotionKey] || EMOTION_SOUND_MAP.neutral;
  let texture = baseProfile.texture;
  let rhythm = baseProfile.rhythm;
  if (sentiment.intensity > 0.8) {
    texture = sentiment.valence > 0 ? "rough" : "chaotic";
    rhythm = "fast";
  } else if (sentiment.intensity < 0.3) {
    texture = "ambient";
    rhythm = "slow";
  }
  const effects = determineEffects(sentiment);
  return {
    frequency: baseProfile.frequency,
    texture,
    rhythm,
    effects,
    energy: Math.round(sentiment.arousal * 10)
  };
}
function soundToEmotion(profile) {
  let valence = 0;
  if (profile.frequency === "high") valence += 0.3;
  else if (profile.frequency === "low") valence -= 0.2;
  if (profile.texture === "smooth") valence += 0.2;
  else if (profile.texture === "rough") valence -= 0.1;
  else if (profile.texture === "chaotic") valence -= 0.3;
  let arousal = profile.energy / 10;
  if (profile.rhythm === "fast") arousal = Math.min(1, arousal + 0.2);
  else if (profile.rhythm === "slow") arousal = Math.max(0, arousal - 0.2);
  else if (profile.rhythm === "chaotic") arousal = Math.min(1, arousal + 0.3);
  let emotion = "neutral";
  if (valence > 0.2 && arousal > 0.6) emotion = "excited";
  else if (valence > 0.2) emotion = "happy";
  else if (valence < -0.2 && arousal > 0.6) emotion = "angry";
  else if (valence < -0.2) emotion = "sad";
  else if (arousal < 0.3) emotion = "contemplative";
  else if (profile.texture === "glitchy") emotion = "curious";
  return {
    emotion,
    valence: Math.max(-1, Math.min(1, valence)),
    arousal: Math.max(0, Math.min(1, arousal)),
    intensity: (Math.abs(valence) + arousal) / 2
  };
}
function determineEffects(sentiment) {
  const effects = [];
  effects.push("reverb");
  if (sentiment.intensity > 0.6) {
    effects.push("delay");
  }
  if (sentiment.arousal > 0.5) {
    effects.push("chorus");
  }
  if (sentiment.valence < -0.3 && sentiment.intensity > 0.5) {
    effects.push("distortion");
  }
  if (sentiment.intensity > 0.8 || sentiment.arousal > 0.8) {
    effects.push("glitch");
  }
  if (sentiment.arousal < 0.3) {
    effects.push("filter");
  }
  return effects;
}
function getMusicalDescriptors(emotion) {
  const profile = EMOTION_SOUND_MAP[emotion.toLowerCase()];
  return profile?.descriptors || EMOTION_SOUND_MAP.neutral.descriptors;
}
function buildMusicPrompt(sentiment, style) {
  const profile = emotionToSound(sentiment);
  const emotionKey = sentiment.emotion.toLowerCase();
  const descriptors = getMusicalDescriptors(emotionKey);
  const parts = [
    style,
    "track",
    ...descriptors,
    `${sentiment.emotion} mood`,
    "experimental electronic",
    profile.texture === "glitchy" ? "glitchy textures" : "",
    profile.texture === "ambient" ? "ambient soundscape" : "",
    profile.rhythm === "fast" ? "driving rhythm" : "",
    profile.rhythm === "slow" ? "slow tempo" : "",
    profile.frequency === "low" ? "deep bass" : "",
    profile.frequency === "high" ? "bright highs" : ""
  ].filter(Boolean);
  return parts.join(", ");
}

// src/audio/audio-engine.ts
var AudioEngine = class {
  config;
  audioContext = null;
  isInitialized = false;
  constructor(config) {
    this.config = {
      sampleRate: 44100,
      channels: 2,
      ...config
    };
  }
  /**
   * Initialize audio context (must be called after user interaction in browser)
   */
  async initialize() {
    if (this.isInitialized) return;
    if (typeof AudioContext !== "undefined") {
      this.audioContext = new AudioContext({
        sampleRate: this.config.sampleRate
      });
      this.isInitialized = true;
    } else {
      console.warn("AudioContext not available in this environment");
    }
  }
  /**
   * Map emotions to sound characteristics
   */
  mapEmotionToSound(params) {
    const sentiment = {
      emotion: params.emotion,
      valence: params.valence,
      arousal: params.arousal,
      intensity: params.intensity
    };
    return emotionToSound(sentiment);
  }
  /**
   * Generate sentiment-driven music
   * In production, this would integrate with audio generation APIs
   */
  async generateMusic(params) {
    if (!this.config.musicGeneration) {
      return null;
    }
    const prompt = buildMusicPrompt(params.sentiment, params.style);
    console.log("Music generation prompt:", prompt);
    return {
      metadata: {
        sentiment: params.sentiment,
        style: params.style,
        duration: params.duration,
        timestamp: Date.now()
      }
    };
  }
  /**
   * Generate a simple tone based on emotion
   * This is a basic example - real implementation would be more sophisticated
   */
  async generateTone(params) {
    if (!this.audioContext) {
      await this.initialize();
    }
    if (!this.audioContext) {
      throw new Error("AudioContext not available");
    }
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    oscillator.type = params.type || "sine";
    oscillator.frequency.value = params.frequency;
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + params.duration
    );
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + params.duration);
  }
  /**
   * Play a sound effect based on emotion
   */
  async playSoundEffect(emotion, intensity = 0.5) {
    const profile = this.mapEmotionToSound({
      emotion,
      valence: emotion === "happy" ? 0.5 : emotion === "sad" ? -0.5 : 0,
      arousal: intensity,
      intensity
    });
    const freqMap = {
      low: 220,
      mid: 440,
      high: 880
    };
    const freq = freqMap[profile.frequency] || 440;
    const typeMap = {
      smooth: "sine",
      rough: "sawtooth",
      glitchy: "square",
      ambient: "triangle",
      chaotic: "square"
    };
    const type = typeMap[profile.texture] || "sine";
    await this.generateTone({
      frequency: freq,
      duration: 0.5,
      type
    });
  }
  /**
   * Get current capabilities
   */
  getCapabilities() {
    return {
      musicGeneration: this.config.musicGeneration || false,
      voiceSynthesis: this.config.voiceSynthesis || false,
      spatialAudio: this.config.spatialAudio || false,
      effectsChain: ["reverb", "delay", "chorus", "distortion", "glitch", "filter"]
    };
  }
  /**
   * Suspend audio context (save resources)
   */
  async suspend() {
    if (this.audioContext && this.audioContext.state === "running") {
      await this.audioContext.suspend();
    }
  }
  /**
   * Resume audio context
   */
  async resume() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
  }
  /**
   * Clean up resources
   */
  dispose() {
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
      this.isInitialized = false;
    }
  }
};

// src/audio/effects/effects-chain.ts
var EffectsChain = class {
  audioContext = null;
  effects = /* @__PURE__ */ new Map();
  constructor(audioContext) {
    this.audioContext = audioContext || null;
  }
  /**
   * Set audio context
   */
  setContext(context) {
    this.audioContext = context;
  }
  /**
   * Apply reverb effect
   */
  async applyReverb(inputNode, params) {
    if (!this.audioContext) {
      throw new Error("AudioContext not set");
    }
    const convolver = this.audioContext.createConvolver();
    const impulseResponse = this.generateImpulseResponse(
      this.audioContext,
      params.roomSize * 3,
      // Duration in seconds
      params.damping
    );
    convolver.buffer = impulseResponse;
    const dryGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    const output = this.audioContext.createGain();
    dryGain.gain.value = 1 - params.wetDry;
    wetGain.gain.value = params.wetDry;
    inputNode.connect(dryGain);
    inputNode.connect(convolver);
    convolver.connect(wetGain);
    dryGain.connect(output);
    wetGain.connect(output);
    this.effects.set("reverb", convolver);
    return output;
  }
  /**
   * Apply delay effect
   */
  applyDelay(inputNode, params) {
    if (!this.audioContext) {
      throw new Error("AudioContext not set");
    }
    const delay = this.audioContext.createDelay(5);
    delay.delayTime.value = params.time;
    const feedback = this.audioContext.createGain();
    feedback.gain.value = params.feedback;
    const dryGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    const output = this.audioContext.createGain();
    dryGain.gain.value = 1 - params.wetDry;
    wetGain.gain.value = params.wetDry;
    inputNode.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    inputNode.connect(dryGain);
    delay.connect(wetGain);
    dryGain.connect(output);
    wetGain.connect(output);
    this.effects.set("delay", delay);
    return output;
  }
  /**
   * Apply chorus effect
   */
  applyChorus(inputNode, params) {
    if (!this.audioContext) {
      throw new Error("AudioContext not set");
    }
    const delay1 = this.audioContext.createDelay();
    const delay2 = this.audioContext.createDelay();
    delay1.delayTime.value = 0.02;
    delay2.delayTime.value = 0.025;
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.frequency.value = params.rate;
    lfoGain.gain.value = params.depth * 2e-3;
    lfo.connect(lfoGain);
    lfoGain.connect(delay1.delayTime);
    const lfo2 = this.audioContext.createOscillator();
    const lfo2Gain = this.audioContext.createGain();
    lfo2.frequency.value = params.rate * 1.1;
    lfo2Gain.gain.value = params.depth * 2e-3;
    lfo2.connect(lfo2Gain);
    lfo2Gain.connect(delay2.delayTime);
    const dryGain = this.audioContext.createGain();
    const wetGain = this.audioContext.createGain();
    const output = this.audioContext.createGain();
    dryGain.gain.value = 1 - params.wetDry;
    wetGain.gain.value = params.wetDry * 0.5;
    inputNode.connect(dryGain);
    inputNode.connect(delay1);
    inputNode.connect(delay2);
    delay1.connect(wetGain);
    delay2.connect(wetGain);
    dryGain.connect(output);
    wetGain.connect(output);
    lfo.start();
    lfo2.start();
    this.effects.set("chorus", delay1);
    return output;
  }
  /**
   * Apply distortion effect
   */
  applyDistortion(inputNode, params) {
    if (!this.audioContext) {
      throw new Error("AudioContext not set");
    }
    const waveshaper = this.audioContext.createWaveShaper();
    waveshaper.curve = this.generateDistortionCurve(params.amount, params.type);
    waveshaper.oversample = "4x";
    inputNode.connect(waveshaper);
    this.effects.set("distortion", waveshaper);
    return waveshaper;
  }
  /**
   * Apply glitch/stutter effect
   */
  applyGlitch(inputNode, params) {
    if (!this.audioContext) {
      throw new Error("AudioContext not set");
    }
    if (params.type === "bitcrush") {
      return this.applyBitcrush(inputNode, params.amount);
    }
    const gain = this.audioContext.createGain();
    inputNode.connect(gain);
    const lfo = this.audioContext.createOscillator();
    const lfoGain = this.audioContext.createGain();
    lfo.type = "square";
    lfo.frequency.value = 4 + params.amount * 16;
    lfoGain.gain.value = params.amount;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);
    lfo.start();
    this.effects.set("glitch", gain);
    return gain;
  }
  /**
   * Adjust an effect's parameters
   */
  adjustEffect(name, params) {
    const effect = this.effects.get(name);
    if (!effect) {
      console.warn(`Effect '${name}' not found`);
      return;
    }
    if (effect instanceof GainNode && params.gain !== void 0) {
      effect.gain.value = params.gain;
    }
    if (effect instanceof DelayNode && params.time !== void 0) {
      effect.delayTime.value = params.time;
    }
  }
  /**
   * Remove all effects
   */
  clear() {
    this.effects.clear();
  }
  /**
   * Dispose of all resources
   */
  dispose() {
    this.effects.clear();
    this.audioContext = null;
  }
  // ═══════════════════════════════════════════════════════════════════════════════
  // PRIVATE METHODS
  // ═══════════════════════════════════════════════════════════════════════════════
  generateImpulseResponse(context, duration, decay) {
    const sampleRate = context.sampleRate;
    const length = sampleRate * duration;
    const buffer = context.createBuffer(2, length, sampleRate);
    for (let channel = 0; channel < 2; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < length; i++) {
        const t = i / sampleRate;
        const envelope = Math.exp(-t * (1 + decay * 5));
        channelData[i] = (Math.random() * 2 - 1) * envelope;
      }
    }
    return buffer;
  }
  generateDistortionCurve(amount, type) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const k = amount * 100;
    for (let i = 0; i < samples; i++) {
      const x = i * 2 / samples - 1;
      switch (type) {
        case "soft":
          curve[i] = Math.tanh(k * x);
          break;
        case "hard":
          curve[i] = Math.max(-1, Math.min(1, k * x));
          break;
        case "fuzz":
          curve[i] = Math.sign(x) * Math.pow(Math.abs(Math.tanh(k * x)), 0.5);
          break;
        default:
          curve[i] = x;
      }
    }
    return curve;
  }
  applyBitcrush(inputNode, amount) {
    if (!this.audioContext) {
      throw new Error("AudioContext not set");
    }
    const filter = this.audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 22050 - amount * 2e4;
    inputNode.connect(filter);
    return filter;
  }
};

exports.AudioEngine = AudioEngine;
exports.EffectsChain = EffectsChain;
exports.emotionToSound = emotionToSound;
exports.soundToEmotion = soundToEmotion;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map