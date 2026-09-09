'use strict';

// src/audio/intelligence/affect-clock-v2.ts
var HZ = 30;
var EPS = 1e-10;
var clamp = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
function range(value, name, lo, hi) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < lo || value > hi)
    throw new RangeError(`${name} must be finite in [${lo}, ${hi}]`);
  return value;
}
function validAffect(a) {
  return {
    valence: range(a.valence, "valence", -1, 1),
    arousal: range(a.arousal, "arousal", 0, 1),
    energy: a.energy === void 0 ? void 0 : range(a.energy, "energy", 0, 1)
  };
}
function options(o) {
  const phrase = range(o.phraseBeats ?? 16, "phraseBeats", 1, 1024);
  if (!Number.isInteger(phrase)) throw new RangeError("phraseBeats must be an integer");
  return {
    start: range(o.startTimeSeconds ?? 0, "startTimeSeconds", 0, 1e9),
    bpm: range(o.bpm ?? 120, "bpm", 1, 400),
    phrase,
    maxGap: range(o.maxGapSeconds ?? 2, "maxGapSeconds", 1e-3, 10),
    affect: validAffect(o.affect ?? { valence: 0, arousal: 0.4 })
  };
}
var AffectiveSynthV2 = class {
  config;
  now;
  affect;
  fast = 0;
  slow = 0;
  tension = 0;
  rising = false;
  breakdown = true;
  arc = "intro";
  grid = 1;
  beat = 0;
  track = 0;
  lastDrop = -Infinity;
  lastPhrase = -Infinity;
  constructor(opts = {}) {
    this.config = options(opts);
    this.now = this.config.start;
    this.affect = this.config.affect;
  }
  /** Explicit new track; omitted options use API defaults, not prior track config.
   * May reset the timestamp origin. Invalid reset leaves the old track untouched.
   */
  resetTrack(atSeconds, opts = {}) {
    const next = options({ ...opts, startTimeSeconds: atSeconds });
    this.config = next;
    this.now = next.start;
    this.affect = next.affect;
    this.fast = 0;
    this.slow = 0;
    this.tension = 0;
    this.rising = false;
    this.breakdown = true;
    this.arc = "intro";
    this.grid = 1;
    this.beat = 0;
    this.lastDrop = -Infinity;
    this.lastPhrase = -Infinity;
    this.track++;
    return this.result([]);
  }
  /** Advance held input to t, then install a sample for [t, next sample).
   * Same-time polls emit no duplicate events. All arguments validate before mutation.
   * Large gaps throw: replay bounded intervals or explicitly reset the track.
   */
  advanceTo(atSeconds, nextAffect) {
    range(atSeconds, "timeSeconds", 0, 1e9);
    if (atSeconds < this.now || atSeconds - this.now > this.config.maxGap + EPS)
      throw new RangeError("time must be nondecreasing and within maxGapSeconds; replay or reset explicitly");
    const sample = nextAffect === void 0 ? void 0 : validAffect(nextAffect);
    const events = [];
    while (true) {
      const gridTime = this.config.start + this.grid / HZ;
      const beatTime = this.config.start + (this.beat + 1) * 60 / this.config.bpm;
      const boundary = Math.min(gridTime, beatTime);
      if (boundary > atSeconds + EPS) break;
      this.integrate(Math.max(this.now, Math.min(boundary, atSeconds)));
      if (gridTime <= boundary + EPS) {
        this.rising = this.fast > this.slow * 1.06 + 0.02;
        this.breakdown = this.slow < 0.18 && this.fast < 0.2;
        this.advanceArc(false);
        this.grid++;
      }
      if (beatTime <= boundary + EPS) {
        this.beat++;
        events.push({ type: "beat", timeSeconds: beatTime, beat: this.beat });
        if (this.beat % this.config.phrase === 0) {
          this.lastPhrase = beatTime;
          events.push({ type: "phrase", timeSeconds: beatTime, beat: this.beat });
        }
        if (this.beat % 4 === 0 && this.fast > this.slow * 1.45 && this.tension > 0.45) {
          this.lastDrop = beatTime;
          this.tension = clamp(this.tension - 0.6);
          this.advanceArc(true);
          events.push({ type: "drop", timeSeconds: beatTime, beat: this.beat });
        }
      }
    }
    this.integrate(atSeconds);
    if (sample) this.affect = sample;
    return this.result(events);
  }
  integrate(to) {
    const dt = to - this.now;
    const energy = this.affect.energy ?? this.affect.arousal;
    this.fast += (energy - this.fast) * -Math.expm1(Math.log(0.91) * HZ * dt);
    this.slow += (energy - this.slow) * -Math.expm1(Math.log(0.988) * HZ * dt);
    this.tension = clamp(this.tension + (this.rising ? 0.04 : -0.02) * HZ * dt);
    this.now = to;
  }
  advanceArc(drop) {
    switch (this.arc) {
      case "intro":
        if (this.slow > 0.25) this.arc = "building";
        break;
      case "building":
        if (drop || this.slow > 0.6) this.arc = "peak";
        break;
      case "peak":
        if (this.slow < 0.45) this.arc = "falling";
        break;
      case "falling":
        if (this.breakdown || this.slow < 0.15) this.arc = "outro";
        break;
    }
  }
  result(events) {
    const { valence: v, arousal: a } = this.affect;
    const drop = this.now - this.lastDrop < 1 / HZ - EPS;
    const phraseCut = this.now - this.lastPhrase < 1 / HZ - EPS;
    const look = this.breakdown ? "VOID DRIFT" : drop ? "SHATTER" : this.tension > 0.6 ? "GLITCHCORE" : v > 0.4 ? "RAINBOW ROAD" : a < 0.3 ? "ETHEREAL" : "CONSTELLATION";
    return {
      state: {
        valence: v,
        arousal: a,
        energyFast: this.fast,
        energySlow: this.slow,
        tension: this.tension,
        arc: this.arc,
        beat: this.beat,
        rising: this.rising,
        breakdown: this.breakdown,
        drop,
        phraseCut,
        // Same artistic map as legacy; tempoBias is descriptive, not clock feedback.
        music: {
          mode: v > 0.25 ? a > 0.6 ? "lydian" : "major" : v < -0.25 ? a > 0.55 ? "phrygian" : "dorian" : "mixolydian",
          chordBias: v > 0.2 ? ["maj7", "maj9", "add9"] : v < -0.2 ? ["min7", "min9", "minMaj7"] : ["dom7", "min7", "halfDim7"],
          register: Math.round(clamp(3 + a * 2, 2, 6)),
          density: clamp(0.25 + a * 0.65),
          swing: clamp(0.5 + (1 - a) * 0.25),
          dissonance: this.tension,
          tempoBias: 0.8 + a * 0.6
        },
        visual: {
          look,
          palette: v >= 0 ? ["#FF4DB8", "#C2F870", "#7FD4FF"] : ["#7FD4FF", "#FF4DB8", "#2A1840"],
          bloom: clamp(0.3 + this.fast * 0.7),
          glitch: clamp(this.tension * 0.8 + (drop ? 0.5 : 0)),
          motion: clamp(this.fast),
          particles: Math.round(a * 28e3)
        }
      },
      events,
      clock: { timeSeconds: this.now, bpm: this.config.bpm, beatPhase: clamp((this.now - this.config.start) * this.config.bpm / 60 - this.beat), track: this.track }
    };
  }
};

// src/affect/index.ts
function record(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function shape(value, keys) {
  return record(value) && Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
}
function numberIn(value, min, max = Number.MAX_VALUE) {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}
function integer(value, min = 0) {
  return numberIn(value, min, Number.MAX_SAFE_INTEGER) && Number.isSafeInteger(value);
}
function label(value) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= 128;
}
function isPerformanceState(value) {
  if (!shape(value, ["valence", "arousal", "energyFast", "energySlow", "tension", "arc", "beat", "rising", "drop", "breakdown", "phraseCut", "music", "visual"])) return false;
  if (!numberIn(value.valence, -1, 1) || !["arousal", "energyFast", "energySlow", "tension"].every((key) => numberIn(value[key], 0, 1))) return false;
  if (!integer(value.beat) || !["intro", "building", "peak", "falling", "outro"].includes(value.arc)) return false;
  if (!["rising", "drop", "breakdown", "phraseCut"].every((key) => typeof value[key] === "boolean")) return false;
  const music = value.music;
  if (!shape(music, ["mode", "chordBias", "register", "density", "swing", "dissonance", "tempoBias"])) return false;
  if (!label(music.mode) || !Array.isArray(music.chordBias) || music.chordBias.length < 1 || music.chordBias.length > 32 || ![...music.chordBias].every(label)) return false;
  if (!integer(music.register, 2) || music.register > 6 || !numberIn(music.tempoBias, Number.MIN_VALUE)) return false;
  if (!["density", "swing", "dissonance"].every((key) => numberIn(music[key], 0, 1))) return false;
  const visual = value.visual;
  if (!shape(visual, ["look", "palette", "bloom", "glitch", "motion", "particles"])) return false;
  return label(visual.look) && Array.isArray(visual.palette) && visual.palette.length === 3 && [...visual.palette].every(label) && ["bloom", "glitch", "motion"].every((key) => numberIn(visual[key], 0, 1)) && integer(visual.particles);
}
function isAffectFrame(value) {
  if (!shape(value, ["version", "sourceId", "sequence", "state", "events", "clock"])) return false;
  if (value.version !== 1 || !label(value.sourceId) || !integer(value.sequence) || !isPerformanceState(value.state)) return false;
  const clock = value.clock;
  if (!shape(clock, ["timeSeconds", "bpm", "beatPhase", "track"])) return false;
  if (!numberIn(clock.timeSeconds, 0, 1e9) || !numberIn(clock.bpm, 1, 400) || !numberIn(clock.beatPhase, 0, 1) || !integer(clock.track)) return false;
  if (!Array.isArray(value.events) || value.events.length > 4096) return false;
  let previous = 0;
  for (const event of value.events) {
    if (!shape(event, ["type", "timeSeconds", "beat"]) || !["beat", "phrase", "drop"].includes(event.type)) return false;
    if (!numberIn(event.timeSeconds, previous, clock.timeSeconds + 1e-10) || !integer(event.beat, 1) || event.beat > value.state.beat) return false;
    previous = event.timeSeconds;
  }
  return true;
}
function snapshot(frame) {
  const state = frame.state;
  return Object.freeze({
    version: 1,
    sourceId: frame.sourceId,
    sequence: frame.sequence,
    state: Object.freeze({
      ...state,
      music: Object.freeze({ ...state.music, chordBias: Object.freeze([...state.music.chordBias]) }),
      visual: Object.freeze({ ...state.visual, palette: Object.freeze([...state.visual.palette]) })
    }),
    events: Object.freeze(frame.events.map((event) => Object.freeze({ ...event }))),
    clock: Object.freeze({ ...frame.clock })
  });
}
var AffectBus = class {
  synth;
  sourceId;
  sequence = 0;
  local;
  current;
  owner;
  listeners = /* @__PURE__ */ new Set();
  notifying = false;
  constructor(options2 = {}) {
    this.sourceId = options2.sourceId ?? "local";
    if (!label(this.sourceId)) throw new TypeError("sourceId must be a nonempty string of at most 128 characters");
    this.synth = new AffectiveSynthV2(options2);
    this.local = this.frame(this.synth.advanceTo(options2.startTimeSeconds ?? 0));
    this.current = this.local;
  }
  getSnapshot() {
    return this.current;
  }
  /** No immediate replay; use getSnapshot for the initial render. */
  subscribe(listener) {
    if (typeof listener !== "function") throw new TypeError("listener must be a function");
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  advanceTo(atSeconds, affect) {
    this.assertWritable();
    const result = this.synth.advanceTo(atSeconds, affect);
    this.local = this.frame(result);
    if (this.owner && atSeconds - this.owner.lastAt >= this.owner.staleAfter) this.owner = void 0;
    return this.publish(this.owner?.lastFrame ?? this.local);
  }
  /** Valid reset revokes external ownership. Invalid reset preserves everything. */
  resetTrack(atSeconds, options2 = {}) {
    this.assertWritable();
    const result = this.synth.resetTrack(atSeconds, options2);
    this.owner = void 0;
    this.local = this.frame(result);
    return this.publish(this.local);
  }
  claimExternal(sourceId, options2) {
    this.assertWritable();
    if (this.owner) throw new Error("An external owner already holds this bus; release or advance beyond its stale deadline first");
    if (!label(sourceId) || sourceId === this.sourceId) throw new TypeError("External sourceId must be valid and distinct from the local sourceId");
    const staleAfter = options2.staleAfterSeconds ?? 1;
    if (!numberIn(staleAfter, 1e-3, 3600)) throw new RangeError("staleAfterSeconds must be finite in [0.001, 3600]");
    const result = this.synth.advanceTo(options2.atSeconds);
    this.local = this.frame(result);
    const owner = { sourceId, lastAt: options2.atSeconds, staleAfter };
    this.publish(this.local);
    this.owner = owner;
    return {
      receive: (value, receivedAtSeconds) => {
        this.assertWritable();
        if (this.owner !== owner) throw new Error("External owner has been released");
        if (!isAffectFrame(value)) throw new TypeError("Invalid version 1 affect frame");
        if (value.sourceId !== owner.sourceId) throw new Error("Frame source does not match the external owner");
        const previous = owner.lastFrame;
        if (previous && value.sequence <= previous.sequence) throw new RangeError("Frame sequence must increase within an owner lease");
        if (previous && (value.clock.track < previous.clock.track || value.clock.track === previous.clock.track && (value.clock.timeSeconds < previous.clock.timeSeconds || value.state.beat < previous.state.beat)))
          throw new RangeError("Frame clock must not move backwards within its track");
        if (receivedAtSeconds - owner.lastAt >= owner.staleAfter) throw new Error("External owner is stale; advance the host clock or release before reacquiring");
        const accepted = snapshot(value);
        const local = this.synth.advanceTo(receivedAtSeconds);
        this.local = this.frame(local);
        owner.lastAt = receivedAtSeconds;
        owner.lastFrame = accepted;
        return this.publish(accepted);
      },
      release: () => {
        this.assertWritable();
        if (this.owner !== owner) return;
        this.owner = void 0;
        this.local = this.frame(this.synth.advanceTo(this.local.clock.timeSeconds));
        this.publish(this.local);
      }
    };
  }
  frame(result) {
    return snapshot({ sourceId: this.sourceId, sequence: this.sequence++, ...result });
  }
  assertWritable() {
    if (this.notifying) throw new Error("AffectBus cannot be advanced from a subscriber; schedule host updates outside notification");
  }
  publish(frame) {
    if (this.current === frame) return frame;
    this.current = frame;
    this.notifying = true;
    const errors = [];
    try {
      for (const listener of [...this.listeners]) {
        if (!this.listeners.has(listener)) continue;
        try {
          listener(frame);
        } catch (error) {
          errors.push(error);
        }
      }
    } finally {
      this.notifying = false;
    }
    if (errors.length) throw new AggregateError(errors, "AffectBus subscriber failed; the frame was committed and other subscribers were notified");
    return frame;
  }
};

exports.AffectBus = AffectBus;
exports.AffectiveSynthV2 = AffectiveSynthV2;
exports.isAffectFrame = isAffectFrame;
exports.isPerformanceState = isPerformanceState;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map