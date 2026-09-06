'use strict';

// src/audio/intelligence/music-theory.ts
var BASE_FREQ = 432;
function midiToFreq(midi) {
  return BASE_FREQ * Math.pow(2, (midi - 69) / 12);
}
function noteToFreq(note) {
  const noteMap = {
    "C": 0,
    "C#": 1,
    "Db": 1,
    "D": 2,
    "D#": 3,
    "Eb": 3,
    "E": 4,
    "F": 5,
    "F#": 6,
    "Gb": 6,
    "G": 7,
    "G#": 8,
    "Ab": 8,
    "A": 9,
    "A#": 10,
    "Bb": 10,
    "B": 11
  };
  const match = note.match(/^([A-G][#b]?)(\d+)$/);
  if (!match) return BASE_FREQ;
  const [, noteName, octaveStr] = match;
  const octave = parseInt(octaveStr);
  const semitone = noteMap[noteName] ?? 0;
  const midi = (octave + 1) * 12 + semitone;
  return midiToFreq(midi);
}

// src/audio/web/webaudio-synth.ts
var rnd = (a, b) => a + Math.random() * (b - a);
var WebAudioSynth = class {
  ctx = null;
  dry = null;
  verb = null;
  airGain = null;
  opt;
  constructor(opts = {}) {
    this.opt = {
      masterGain: opts.masterGain ?? 0.22,
      reverbSeconds: opts.reverbSeconds ?? 4.2,
      reverbDecay: opts.reverbDecay ?? 2.4,
      lowpassHz: opts.lowpassHz ?? 6200
    };
  }
  /** Whether Web Audio is available (browser). */
  static get available() {
    const g = globalThis;
    return typeof g.AudioContext !== "undefined" || typeof g.webkitAudioContext !== "undefined";
  }
  /** Resume/start the audio context — call from a user gesture (browsers gate audio start). */
  async resume() {
    this.build();
    try {
      await this.ctx?.resume?.();
    } catch {
    }
  }
  makeReverbIR(seconds, decay) {
    const rate = this.ctx.sampleRate;
    const len = rate * seconds | 0;
    const buf = this.ctx.createBuffer(2, len, rate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) {
        const t = i / len;
        d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, decay);
      }
    }
    return buf;
  }
  build() {
    if (this.ctx) return;
    const g = globalThis;
    const AC = g.AudioContext || g.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    this.ctx = ctx;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    const mlp = ctx.createBiquadFilter();
    mlp.type = "lowpass";
    mlp.frequency.value = this.opt.lowpassHz;
    mlp.Q.value = 0.3;
    mlp.connect(master);
    this.dry = ctx.createGain();
    this.dry.gain.value = 0.5;
    this.dry.connect(mlp);
    const wet = ctx.createGain();
    wet.gain.value = 0.72;
    wet.connect(mlp);
    this.verb = ctx.createConvolver();
    this.verb.buffer = this.makeReverbIR(this.opt.reverbSeconds, this.opt.reverbDecay);
    this.verb.connect(wet);
    const noiseLen = ctx.sampleRate * 2;
    const nb = ctx.createBuffer(1, noiseLen, ctx.sampleRate);
    const nd = nb.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) nd[i] = Math.random() * 2 - 1;
    const airNode = ctx.createBufferSource();
    airNode.buffer = nb;
    airNode.loop = true;
    const af = ctx.createBiquadFilter();
    af.type = "lowpass";
    af.frequency.value = 520;
    af.Q.value = 0.2;
    this.airGain = ctx.createGain();
    this.airGain.gain.value = 0;
    airNode.connect(af);
    af.connect(this.airGain);
    this.airGain.connect(mlp);
    airNode.start();
    master.gain.setValueAtTime(0, ctx.currentTime);
    master.gain.linearRampToValueAtTime(this.opt.masterGain, ctx.currentTime + 2.2);
    this.airGain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 3);
  }
  /** Strike a frequency — the FM-Rhodes voice. `bright` 0..1 scales the tine attack. */
  strike(freq, dur = 3, vel = 0.7, bright = 0.4) {
    this.build();
    const ctx = this.ctx;
    if (!ctx || freq <= 0) return;
    const t0 = ctx.currentTime;
    for (const [k, side] of [[0, -1], [1, 1]]) {
      const detune = side * rnd(3, 7);
      const carrier = ctx.createOscillator();
      carrier.type = "sine";
      carrier.frequency.value = freq;
      carrier.detune.value = detune;
      const mod = ctx.createOscillator();
      mod.type = "sine";
      mod.frequency.value = freq * (k === 0 ? 1 : 2);
      const modGain = ctx.createGain();
      const idxAtk = freq * (2.2 + bright * 3.4);
      const idxBody = freq * 0.5;
      modGain.gain.setValueAtTime(idxAtk, t0);
      modGain.gain.exponentialRampToValueAtTime(Math.max(1, idxBody), t0 + 0.16);
      mod.connect(modGain);
      modGain.connect(carrier.frequency);
      const amp = ctx.createGain();
      const peak = vel * (k === 0 ? 1 : 0.5);
      amp.gain.setValueAtTime(0, t0);
      amp.gain.linearRampToValueAtTime(peak, t0 + 0.014);
      amp.gain.exponentialRampToValueAtTime(Math.max(8e-4, peak * 0.55), t0 + 0.28);
      amp.gain.exponentialRampToValueAtTime(6e-4, t0 + dur);
      const lp = ctx.createBiquadFilter();
      lp.type = "lowpass";
      lp.frequency.value = 900 + vel * 3200 + bright * 2600;
      lp.Q.value = 0.5;
      carrier.connect(amp);
      amp.connect(lp);
      lp.connect(this.dry);
      lp.connect(this.verb);
      carrier.start(t0);
      mod.start(t0);
      const stop = t0 + dur + 0.5;
      carrier.stop(stop);
      mod.stop(stop);
    }
  }
  /** Drop-in for PianoEngine.setPlayNoteCallback — (note, duration, velocity). Arrow-bound. */
  play = async (note, duration = 3, velocity = 0.7) => {
    this.strike(noteToFreq(note), duration, velocity);
  };
  /** Release resources. */
  dispose() {
    try {
      this.ctx?.close?.();
    } catch {
    }
    this.ctx = null;
  }
};
function createWebAudioSynth(opts) {
  return new WebAudioSynth(opts);
}

exports.WebAudioSynth = WebAudioSynth;
exports.createWebAudioSynth = createWebAudioSynth;
//# sourceMappingURL=webaudio-synth.cjs.map
//# sourceMappingURL=webaudio-synth.cjs.map