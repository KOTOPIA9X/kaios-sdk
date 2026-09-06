'use strict';

// src/audio/intelligence/music-theory.ts
var BASE_FREQ = 432;
var PHI = 1.618033988749895;
var FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144];
var CIRCLE_OF_FIFTHS = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
var SEMITONE_RATIO = Math.pow(2, 1 / 12);
var SCALES = {
  // Major modes
  major: [0, 2, 4, 5, 7, 9, 11],
  // Ionian - bright, happy
  dorian: [0, 2, 3, 5, 7, 9, 10],
  // Minor with raised 6th - jazzy, soulful
  phrygian: [0, 1, 3, 5, 7, 8, 10],
  // Spanish, exotic
  lydian: [0, 2, 4, 6, 7, 9, 11],
  // Dreamy, floating
  mixolydian: [0, 2, 4, 5, 7, 9, 10],
  // Bluesy, rock
  aeolian: [0, 2, 3, 5, 7, 8, 10],
  // Natural minor - melancholic
  locrian: [0, 1, 3, 5, 6, 8, 10],
  // Unstable, dark
  // Pentatonic - universally pleasing, great for lofi
  majorPentatonic: [0, 2, 4, 7, 9],
  // Happy, universal
  minorPentatonic: [0, 3, 5, 7, 10],
  // Bluesy, soulful
  // Japanese scales - cottagecore, peaceful
  hirajoshi: [0, 2, 3, 7, 8],
  // Japanese, mysterious
  insen: [0, 1, 5, 7, 10],
  // Melancholic Japanese
  iwato: [0, 1, 5, 6, 10],
  // Dark Japanese
  // Blues & Jazz
  blues: [0, 3, 5, 6, 7, 10],
  // Classic blues
  bebop: [0, 2, 4, 5, 7, 9, 10, 11],
  // Jazz bebop
  // Electronic / Breakcore
  chromatic: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  wholeTone: [0, 2, 4, 6, 8, 10],
  // Dreamy, unstable
  diminished: [0, 2, 3, 5, 6, 8, 9, 11],
  // Tense, dramatic
  // Lo-fi favorites
  lofi: [0, 2, 3, 5, 7, 9, 10],
  // Dorian (most common in lofi)
  chillhop: [0, 2, 4, 7, 9],
  // Major pentatonic
  // Special
  prometheus: [0, 2, 4, 6, 9, 10],
  // Scriabin's mystic scale
  enigmatic: [0, 1, 4, 6, 8, 10, 11]
  // Verdi's scale
};
var CHORDS = {
  // Triads
  major: [0, 4, 7],
  minor: [0, 3, 7],
  diminished: [0, 3, 6],
  augmented: [0, 4, 8],
  sus2: [0, 2, 7],
  sus4: [0, 5, 7],
  // Sevenths - essential for lofi/jazz
  maj7: [0, 4, 7, 11],
  // Dreamy, nostalgic
  min7: [0, 3, 7, 10],
  // Smooth, melancholic
  dom7: [0, 4, 7, 10],
  // Tension, blues
  dim7: [0, 3, 6, 9],
  // Dramatic tension
  halfDim7: [0, 3, 6, 10],
  // m7b5, jazz staple
  minMaj7: [0, 3, 7, 11],
  // Mysterious
  // Extended - lofi heaven
  maj9: [0, 4, 7, 11, 14],
  // Super dreamy
  min9: [0, 3, 7, 10, 14],
  // Smooth, sophisticated
  dom9: [0, 4, 7, 10, 14],
  // Funky
  add9: [0, 4, 7, 14],
  // Open, airy
  min11: [0, 3, 7, 10, 14, 17],
  // Very jazzy
  maj13: [0, 4, 7, 11, 14, 21],
  // Full, lush
  // Altered - for tension/resolution
  dom7sharp9: [0, 4, 7, 10, 15],
  // Hendrix chord
  dom7flat9: [0, 4, 7, 10, 13],
  // Dark tension
  dom7sharp11: [0, 4, 7, 10, 18],
  // Lydian dominant
  // Power chords - breakcore
  power: [0, 7],
  power5: [0, 7, 12]
};
var LOFI_PROGRESSIONS = [
  [1, 6, 4, 5],
  // I-vi-IV-V (most common)
  [2, 5, 1, 6],
  // ii-V-I-vi (jazz turnaround)
  [1, 5, 6, 4],
  // I-V-vi-IV (pop progression)
  [6, 4, 1, 5],
  // vi-IV-I-V (emotional)
  [1, 4, 6, 5],
  // I-IV-vi-V
  [2, 5, 1, 1],
  // ii-V-I-I (jazz standard)
  [1, 3, 4, 4],
  // I-iii-IV-IV (dreamy)
  [6, 5, 4, 5],
  // vi-V-IV-V (emo progression)
  [1, 7, 6, 6],
  // I-vii-vi-vi (descending)
  [4, 5, 3, 6]
  // IV-V-iii-vi (royal road)
];
var CHORD_EMOTIONS = {
  happy: ["major", "maj7", "add9", "sus2"],
  sad: ["minor", "min7", "min9", "minMaj7"],
  dreamy: ["maj9", "min11", "sus4", "add9"],
  tense: ["dim7", "dom7", "dom7sharp9", "halfDim7"],
  peaceful: ["maj7", "add9", "sus2", "maj9"],
  nostalgic: ["min7", "maj7", "min9", "add9"],
  mysterious: ["minMaj7", "dim7", "augmented", "halfDim7"],
  powerful: ["power", "power5", "sus4", "major"]
};
function midiToFreq(midi) {
  return BASE_FREQ * Math.pow(2, (midi - 69) / 12);
}
function freqToMidi(freq) {
  return 69 + 12 * Math.log2(freq / BASE_FREQ);
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
function getScaleFrequencies(root, scaleName, octave = 4) {
  const scale = SCALES[scaleName] || SCALES.major;
  const rootFreq = noteToFreq(`${root}${octave}`);
  return scale.map((interval) => rootFreq * Math.pow(SEMITONE_RATIO, interval));
}
function getChordFrequencies(root, chordName, octave = 4) {
  const chord = CHORDS[chordName] || CHORDS.major;
  const rootFreq = noteToFreq(`${root}${octave}`);
  return chord.map((interval) => rootFreq * Math.pow(SEMITONE_RATIO, interval));
}
function getHarmonics(fundamental, count = 8) {
  return Array.from({ length: count }, (_, i) => fundamental * (i + 1));
}
function getConsonance(freq1, freq2) {
  const ratio = freq1 > freq2 ? freq1 / freq2 : freq2 / freq1;
  const simpleRatios = [
    { ratio: 1, name: "unison", consonance: 1 },
    { ratio: 2, name: "octave", consonance: 0.95 },
    { ratio: 1.5, name: "perfect fifth", consonance: 0.9 },
    { ratio: 4 / 3, name: "perfect fourth", consonance: 0.85 },
    { ratio: 5 / 4, name: "major third", consonance: 0.8 },
    { ratio: 6 / 5, name: "minor third", consonance: 0.75 },
    { ratio: 5 / 3, name: "major sixth", consonance: 0.7 },
    { ratio: 8 / 5, name: "minor sixth", consonance: 0.65 }
  ];
  let bestMatch = 0;
  for (const { ratio: r, consonance } of simpleRatios) {
    if (Math.abs(ratio - r) < 0.05) {
      bestMatch = Math.max(bestMatch, consonance);
    }
  }
  return bestMatch || 0.3;
}
function getRelativeKey(root, isMinor) {
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const idx = notes.indexOf(root.replace("b", "#"));
  if (isMinor) {
    return notes[(idx + 3) % 12];
  } else {
    return notes[(idx + 9) % 12];
  }
}
function getChordFunction(degree) {
  switch (degree) {
    case 1:
    case 6:
      return "tonic";
    case 2:
    case 4:
      return "subdominant";
    case 5:
    case 7:
      return "dominant";
    case 3:
    default:
      return "mediant";
  }
}
function calculateTension(chordDegrees) {
  let tension = 0;
  for (let i = 0; i < chordDegrees.length; i++) {
    const degree = chordDegrees[i];
    const func = getChordFunction(degree);
    if (func === "dominant") tension += 0.3;
    if (func === "subdominant") tension += 0.15;
    if (func === "tonic") tension -= 0.2;
    if (i > 0 && func !== "tonic" && getChordFunction(chordDegrees[i - 1]) !== "tonic") {
      tension += 0.1;
    }
  }
  return Math.max(0, Math.min(1, tension));
}
function suggestNextChord(currentDegree, tension) {
  const suggestions = [];
  if (tension > 0.7) {
    suggestions.push(1);
  }
  if (currentDegree === 5) {
    suggestions.push(1, 6);
  }
  if (currentDegree === 4) {
    suggestions.push(5, 1);
  }
  if (currentDegree === 2) {
    suggestions.push(5);
  }
  if (suggestions.length === 0) {
    suggestions.push(4, 5, 6, 2);
  }
  return suggestions;
}
function optimizeVoicing(currentVoices, nextChord, rootOctave = 3) {
  if (currentVoices.length === 0) {
    return nextChord.map((interval, i) => {
      const octaveShift = Math.floor(i / 4);
      return midiToFreq(rootOctave * 12 + 12 + interval + octaveShift * 12);
    });
  }
  const optimized = [];
  for (const interval of nextChord) {
    let bestFreq = midiToFreq(rootOctave * 12 + 12 + interval);
    let bestDistance = Infinity;
    for (let octave = rootOctave - 1; octave <= rootOctave + 2; octave++) {
      const freq = midiToFreq(octave * 12 + 12 + interval);
      const minDistance = Math.min(...currentVoices.map(
        (v) => Math.abs(freqToMidi(freq) - freqToMidi(v))
      ));
      if (minDistance < bestDistance) {
        bestDistance = minDistance;
        bestFreq = freq;
      }
    }
    optimized.push(bestFreq);
  }
  return optimized;
}
var MusicTheory = {
  BASE_FREQ,
  PHI,
  FIBONACCI,
  SCALES,
  CHORDS,
  LOFI_PROGRESSIONS,
  CHORD_EMOTIONS,
  midiToFreq,
  freqToMidi,
  noteToFreq,
  getScaleFrequencies,
  getChordFrequencies,
  getHarmonics,
  getConsonance,
  getRelativeKey,
  getChordFunction,
  calculateTension,
  suggestNextChord,
  optimizeVoicing
};

// src/audio/intelligence/rhythm-engine.ts
function euclidean(hits, steps, rotation = 0) {
  if (hits >= steps) return Array(steps).fill(1);
  if (hits === 0) return Array(steps).fill(0);
  let pattern = [];
  for (let i = 0; i < hits; i++) pattern.push([1]);
  for (let i = 0; i < steps - hits; i++) pattern.push([0]);
  while (true) {
    const lastIndex = pattern.length - 1;
    const lastValue = pattern[lastIndex];
    let count = 0;
    for (let i = lastIndex; i >= 0; i--) {
      if (JSON.stringify(pattern[i]) === JSON.stringify(lastValue)) {
        count++;
      } else {
        break;
      }
    }
    if (count === pattern.length || count <= 1) break;
    const distributed = [];
    const remaining = [];
    for (let i = 0; i < pattern.length; i++) {
      if (i < pattern.length - count) {
        distributed.push(pattern[i]);
      } else {
        remaining.push(pattern[i]);
      }
    }
    pattern = [];
    for (let i = 0; i < Math.max(distributed.length, remaining.length); i++) {
      if (i < distributed.length && i < remaining.length) {
        pattern.push([...distributed[i], ...remaining[i]]);
      } else if (i < distributed.length) {
        pattern.push(distributed[i]);
      } else {
        pattern.push(remaining[i]);
      }
    }
  }
  const result = pattern.flat();
  if (rotation !== 0) {
    const r = (rotation % steps + steps) % steps;
    return [...result.slice(r), ...result.slice(0, r)];
  }
  return result;
}
var EUCLIDEAN_PATTERNS = {
  tresillo: { hits: 3, steps: 8, name: "Cuban Tresillo" },
  cinquillo: { hits: 5, steps: 8, name: "Afro-Cuban Cinquillo" },
  clave32: { hits: 5, steps: 16, name: "Son Clave 3-2" },
  clave23: { hits: 5, steps: 16, name: "Son Clave 2-3" },
  samba: { hits: 7, steps: 16, name: "Brazilian Samba" },
  venda: { hits: 5, steps: 12, name: "South African Venda" },
  aksak: { hits: 4, steps: 9, name: "Turkish Aksak" },
  arabic: { hits: 5, steps: 9, name: "Arabic Rhythm" },
  gahu: { hits: 7, steps: 12, name: "Ghanaian Gahu" },
  bembe: { hits: 7, steps: 12, name: "West African Bembe" },
  fourFloor: { hits: 4, steps: 16, name: "Four on the Floor" },
  offbeat: { hits: 4, steps: 16, name: "Offbeat Hi-hat" }
};
function fibonacciRhythm(length, density = 0.5) {
  const pattern = Array(length).fill(0);
  const fibSet = new Set(FIBONACCI.filter((n) => n <= length));
  for (let i = 0; i < length; i++) {
    if (fibSet.has(i + 1)) {
      pattern[i] = 1;
    }
  }
  const currentDensity = pattern.filter((x) => x === 1).length / length;
  if (currentDensity < density) {
    const toAdd = Math.floor((density - currentDensity) * length);
    for (let i = 0; i < toAdd && i < length; i++) {
      const pos = Math.floor(i * PHI * length % length);
      pattern[pos] = 1;
    }
  }
  return pattern;
}
function goldenGroove(steps) {
  const offsets = [];
  for (let i = 0; i < steps; i++) {
    const baseOffset = i * PHI % 1;
    const groove = (baseOffset - 0.5) * 0.1;
    offsets.push(groove);
  }
  return offsets;
}
function polyrhythm(a, b, steps) {
  const lcm = a * b / gcd(a, b);
  const scaledSteps = Math.max(steps, lcm);
  const layerA = Array(scaledSteps).fill(0);
  const layerB = Array(scaledSteps).fill(0);
  const stepA = scaledSteps / a;
  for (let i = 0; i < a; i++) {
    layerA[Math.floor(i * stepA)] = 1;
  }
  const stepB = scaledSteps / b;
  for (let i = 0; i < b; i++) {
    layerB[Math.floor(i * stepB)] = 1;
  }
  return { layerA, layerB };
}
function gcd(a, b) {
  return b === 0 ? a : gcd(b, a % b);
}
var POLYRHYTHMS = {
  threeAgainstTwo: [3, 2],
  // West African
  fourAgainstThree: [4, 3],
  // Jazz
  fiveAgainstFour: [5, 4],
  // Complex groove
  fiveAgainstThree: [5, 3],
  // Very complex
  sevenAgainstFour: [7, 4],
  // Extreme
  threeAgainstFour: [3, 4]
  // Same as 4:3 reversed
};
function applySwing(pattern, swingAmount = 0.3, subdivision = 2) {
  const timings = [];
  for (let i = 0; i < pattern.length; i++) {
    const subPos = i % subdivision;
    let timing = i / pattern.length;
    if (subPos % 2 === 1) {
      timing += swingAmount * 0.5 / pattern.length;
    }
    timings.push(timing);
  }
  return { pattern, timings };
}
function humanize(timings, amount = 0.02) {
  return timings.map((t) => {
    const variation = (Math.random() - 0.5) * 2 * amount;
    return t + variation;
  });
}
function velocityVariation(pattern, accentPattern) {
  const velocities = [];
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === 0) {
      velocities.push(0);
      continue;
    }
    let velocity = 0.7 + Math.random() * 0.2;
    if (accentPattern && accentPattern[i % accentPattern.length] === 1) {
      velocity = Math.min(1, velocity + 0.2);
    }
    if (i % 4 === 0) velocity = Math.min(1, velocity + 0.1);
    velocities.push(velocity);
  }
  return velocities;
}
var AMEN_SLICES = [
  { start: 0, duration: 0.125, pitch: 0, reverse: false, volume: 1 },
  // Kick
  { start: 0.125, duration: 0.125, pitch: 0, reverse: false, volume: 0.9 },
  // Snare
  { start: 0.25, duration: 0.125, pitch: 0, reverse: false, volume: 0.8 },
  // Hat
  { start: 0.375, duration: 0.125, pitch: 0, reverse: false, volume: 0.9 },
  // Snare
  { start: 0.5, duration: 0.125, pitch: 0, reverse: false, volume: 1 },
  // Kick
  { start: 0.625, duration: 0.125, pitch: 0, reverse: false, volume: 0.8 },
  // Hat
  { start: 0.75, duration: 0.125, pitch: 0, reverse: false, volume: 0.9 },
  // Snare
  { start: 0.875, duration: 0.125, pitch: 0, reverse: false, volume: 0.7 }
  // Hat
];
function generateBreakcoreChops(slices, intensity = 0.5, length = 16) {
  const chops = [];
  for (let i = 0; i < length; i++) {
    const originalSlice = slices[Math.floor(Math.random() * slices.length)];
    const chop = {
      ...originalSlice,
      start: originalSlice.start,
      duration: originalSlice.duration
    };
    if (Math.random() < intensity * 0.5) {
      chop.pitch = Math.floor((Math.random() - 0.5) * 12 * intensity);
    }
    if (Math.random() < intensity * 0.3) {
      chop.reverse = true;
    }
    if (Math.random() < intensity * 0.4) {
      chop.stutter = Math.floor(Math.random() * 4) + 2;
    }
    if (Math.random() < intensity * 0.3) {
      chop.duration = chop.duration / 2;
    }
    if (Math.random() < intensity * 0.2) {
      chop.filter = 200 + Math.random() * 2e3;
    }
    chop.volume = 0.6 + Math.random() * 0.4;
    chops.push(chop);
  }
  return chops;
}
function thoughtAmen(complexity = 0.5, bars = 2) {
  const steps = bars * 16;
  const kickHits = Math.floor(4 * bars * (1 - complexity * 0.5));
  const snareHits = Math.floor(4 * bars);
  const hatHits = Math.floor(8 * bars * (1 + complexity * 0.5));
  const kicks = euclidean(kickHits, steps);
  const snares = euclidean(snareHits, steps, 4);
  const hats = euclidean(hatHits, steps);
  const chops = [];
  for (let i = 0; i < steps; i++) {
    const hasKick = kicks[i] === 1;
    const hasSnare = snares[i] === 1;
    const hasHat = hats[i] === 1;
    if (hasKick) {
      chops.push({
        start: 0,
        duration: 0.125,
        pitch: Math.random() < complexity ? Math.floor((Math.random() - 0.5) * 4) : 0,
        reverse: false,
        volume: 0.9 + Math.random() * 0.1,
        stutter: Math.random() < complexity * 0.3 ? 2 : void 0
      });
    }
    if (hasSnare) {
      chops.push({
        start: 0.125,
        duration: 0.125,
        pitch: Math.random() < complexity * 0.5 ? Math.floor((Math.random() - 0.5) * 6) : 0,
        reverse: Math.random() < complexity * 0.2,
        volume: 0.85 + Math.random() * 0.15
      });
    }
    if (hasHat && !hasKick && !hasSnare) {
      chops.push({
        start: 0.25 + Math.random() * 0.25,
        duration: 0.0625,
        pitch: Math.floor(Math.random() * 3),
        reverse: false,
        volume: 0.5 + Math.random() * 0.3
      });
    }
  }
  return { kicks, snares, hats, chops };
}
var LOFI_PATTERNS = {
  dustyBoom: {
    name: "Dusty Boom Bap",
    pattern: [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    subdivision: 16,
    swing: 0.2,
    humanize: 0.03
  },
  lateNight: {
    name: "Late Night",
    pattern: [1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0],
    subdivision: 16,
    swing: 0.15,
    humanize: 0.02
  },
  jazzySwing: {
    name: "Jazzy Swing",
    pattern: [1, 0, 1, 0, 0, 1, 1, 0, 1, 0, 0, 1],
    subdivision: 12,
    // Triplet feel
    swing: 0.3,
    humanize: 0.04
  },
  rainyDay: {
    name: "Rainy Day",
    pattern: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
    subdivision: 16,
    swing: 0.1,
    humanize: 0.05
  }
};
var BREAKCORE_PATTERNS = {
  amenChop: {
    name: "Amen Chop",
    pattern: euclidean(7, 16),
    subdivision: 16,
    swing: 0,
    humanize: 0
  },
  glitchCore: {
    name: "Glitch Core",
    pattern: euclidean(11, 16),
    subdivision: 16,
    swing: 0,
    humanize: 0
  },
  jungleist: {
    name: "Jungleist",
    pattern: euclidean(9, 16, 2),
    subdivision: 16,
    swing: 0.05,
    humanize: 0.01
  },
  speedcore: {
    name: "Speedcore",
    pattern: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    subdivision: 16,
    swing: 0,
    humanize: 0
  }
};
var COTTAGECORE_PATTERNS = {
  gentleWaltz: {
    name: "Gentle Waltz",
    pattern: [1, 0, 0, 1, 0, 0],
    subdivision: 6,
    swing: 0,
    humanize: 0.03
  },
  forestDance: {
    name: "Forest Dance",
    pattern: [1, 0, 1, 0, 0, 1, 0, 0],
    subdivision: 8,
    swing: 0.1,
    humanize: 0.04
  },
  meadowStroll: {
    name: "Meadow Stroll",
    pattern: fibonacciRhythm(8, 0.4),
    subdivision: 8,
    swing: 0.15,
    humanize: 0.05
  }
};
function generateRhythm(options2) {
  const { genre, complexity, energy } = options2;
  let kick;
  let snare;
  let hat;
  let percussion;
  switch (genre) {
    case "breakcore":
      kick = euclidean(Math.floor(4 + complexity * 6), 16);
      snare = euclidean(Math.floor(4 + complexity * 4), 16, 4);
      hat = euclidean(Math.floor(8 + complexity * 8), 16);
      percussion = euclidean(Math.floor(3 + complexity * 5), 16, 2);
      break;
    case "lofi":
      kick = euclidean(Math.floor(3 + complexity * 2), 16);
      snare = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
      hat = euclidean(Math.floor(6 + complexity * 4), 16);
      percussion = fibonacciRhythm(16, 0.2 + complexity * 0.2);
      break;
    case "cottagecore":
      kick = euclidean(Math.floor(2 + complexity), 8);
      snare = fibonacciRhythm(8, 0.3);
      hat = euclidean(Math.floor(3 + complexity * 2), 8);
      percussion = goldenGroove(8).map((g) => Math.abs(g) > 0.03 ? 1 : 0);
      break;
    case "frutiger":
      kick = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
      snare = [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
      hat = euclidean(8 + Math.floor(energy * 4), 16);
      percussion = euclidean(Math.floor(2 + complexity * 3), 16, 1);
      break;
    case "ambient":
    default:
      kick = fibonacciRhythm(16, 0.15);
      snare = fibonacciRhythm(16, 0.1);
      hat = euclidean(Math.floor(2 + complexity * 3), 16);
      percussion = goldenGroove(16).map((g) => Math.abs(g) > 0.04 ? 1 : 0);
      break;
  }
  const baseSwing = genre === "lofi" ? 0.2 : genre === "breakcore" ? 0 : 0.1;
  return {
    kick: {
      name: `${genre}-kick`,
      pattern: kick,
      subdivision: 16,
      swing: baseSwing + options2.swing * 0.2,
      humanize: genre === "breakcore" ? 0 : 0.02 + complexity * 0.02
    },
    snare: {
      name: `${genre}-snare`,
      pattern: snare,
      subdivision: 16,
      swing: baseSwing + options2.swing * 0.2,
      humanize: genre === "breakcore" ? 0 : 0.03
    },
    hat: {
      name: `${genre}-hat`,
      pattern: hat,
      subdivision: 16,
      swing: baseSwing + options2.swing * 0.3,
      humanize: 0.01 + complexity * 0.02
    },
    percussion: {
      name: `${genre}-perc`,
      pattern: percussion,
      subdivision: 16,
      swing: baseSwing,
      humanize: 0.03
    }
  };
}
var RhythmEngine = {
  euclidean,
  EUCLIDEAN_PATTERNS,
  fibonacciRhythm,
  goldenGroove,
  polyrhythm,
  POLYRHYTHMS,
  applySwing,
  humanize,
  velocityVariation,
  AMEN_SLICES,
  generateBreakcoreChops,
  thoughtAmen,
  LOFI_PATTERNS,
  BREAKCORE_PATTERNS,
  COTTAGECORE_PATTERNS,
  generateRhythm
};

// src/audio/intelligence/genre-engine.ts
var GENRE_PROFILES = {
  lofi: {
    name: "Lo-fi Hip Hop",
    description: "Dusty, nostalgic beats with jazz samples and vinyl warmth",
    bpmRange: [70, 95],
    preferredBPM: 85,
    preferredScales: ["dorian", "minorPentatonic", "lofi", "aeolian"],
    preferredChords: ["min7", "maj7", "min9", "add9", "dom7"],
    progressionStyle: "jazzy",
    keyPreferences: ["C", "D", "F", "G", "Bb"],
    timeSignature: [4, 4],
    swingAmount: 0.2,
    rhythmComplexity: 0.4,
    grooveTightness: 0.6,
    brightness: 0.3,
    warmth: 0.8,
    saturation: 0.6,
    spaceReverb: 0.4,
    lofiAmount: 0.7,
    glitchAmount: 0.1,
    useVinylCrackle: true,
    useTapeWobble: true,
    useNatureAmbience: false,
    useSynthPads: true,
    useAcousticElements: true,
    useDigitalGlitch: false,
    buildupStyle: "gradual",
    transitionStyle: "smooth",
    sectionLength: 8,
    preferredSamples: ["piano", "rhodes", "guitar", "strings", "vinyl"],
    sampleProcessing: {
      pitchShift: [-3, 3],
      timeStretch: [0.9, 1.1],
      filterCutoff: [400, 4e3],
      bitCrush: 0.2,
      reverb: 0.4,
      delay: 0.3,
      chorus: 0.2,
      distortion: 0.1
    }
  },
  cottagecore: {
    name: "Cottagecore",
    description: "Pastoral, gentle acoustic sounds with nature ambience",
    bpmRange: [80, 120],
    preferredBPM: 100,
    preferredScales: ["major", "majorPentatonic", "lydian", "mixolydian"],
    preferredChords: ["major", "add9", "sus2", "maj7", "sus4"],
    progressionStyle: "simple",
    keyPreferences: ["C", "G", "D", "F", "A"],
    timeSignature: [4, 4],
    swingAmount: 0.1,
    rhythmComplexity: 0.3,
    grooveTightness: 0.5,
    brightness: 0.6,
    warmth: 0.9,
    saturation: 0.3,
    spaceReverb: 0.5,
    lofiAmount: 0.2,
    glitchAmount: 0,
    useVinylCrackle: false,
    useTapeWobble: false,
    useNatureAmbience: true,
    useSynthPads: false,
    useAcousticElements: true,
    useDigitalGlitch: false,
    buildupStyle: "gradual",
    transitionStyle: "fade",
    sectionLength: 8,
    preferredSamples: ["acoustic_guitar", "piano", "strings", "harp", "flute", "birds", "rain", "wind"],
    sampleProcessing: {
      pitchShift: [0, 0],
      timeStretch: [1, 1],
      filterCutoff: [200, 8e3],
      bitCrush: 0,
      reverb: 0.5,
      delay: 0.2,
      chorus: 0.3,
      distortion: 0
    }
  },
  frutiger: {
    name: "Frutiger Aero",
    description: "Glossy Y2K futurism with optimistic synths and bubbly textures",
    bpmRange: [110, 140],
    preferredBPM: 128,
    preferredScales: ["major", "lydian", "majorPentatonic", "wholeTone"],
    preferredChords: ["major", "maj7", "add9", "sus4", "augmented"],
    progressionStyle: "simple",
    keyPreferences: ["C", "F", "G", "D", "Bb"],
    timeSignature: [4, 4],
    swingAmount: 0,
    rhythmComplexity: 0.4,
    grooveTightness: 0.9,
    brightness: 0.9,
    warmth: 0.5,
    saturation: 0.4,
    spaceReverb: 0.6,
    lofiAmount: 0,
    glitchAmount: 0.1,
    useVinylCrackle: false,
    useTapeWobble: false,
    useNatureAmbience: false,
    useSynthPads: true,
    useAcousticElements: false,
    useDigitalGlitch: false,
    buildupStyle: "gradual",
    transitionStyle: "smooth",
    sectionLength: 8,
    preferredSamples: ["synth_pad", "glass", "bubble", "shimmer", "pluck"],
    sampleProcessing: {
      pitchShift: [0, 5],
      timeStretch: [1, 1.2],
      filterCutoff: [1e3, 16e3],
      bitCrush: 0,
      reverb: 0.6,
      delay: 0.4,
      chorus: 0.5,
      distortion: 0
    }
  },
  breakcore: {
    name: "Breakcore",
    description: "Chaotic chopped breaks with extreme tempo and time signature changes",
    bpmRange: [160, 300],
    preferredBPM: 180,
    preferredScales: ["chromatic", "diminished", "phrygian", "locrian"],
    preferredChords: ["diminished", "augmented", "dom7sharp9", "power"],
    progressionStyle: "chaotic",
    keyPreferences: ["C", "C#", "D", "F#", "G"],
    timeSignature: [4, 4],
    // But often broken/irregular
    swingAmount: 0,
    rhythmComplexity: 0.95,
    grooveTightness: 0.3,
    brightness: 0.5,
    warmth: 0.3,
    saturation: 0.9,
    spaceReverb: 0.2,
    lofiAmount: 0.3,
    glitchAmount: 0.9,
    useVinylCrackle: true,
    useTapeWobble: false,
    useNatureAmbience: false,
    useSynthPads: true,
    useAcousticElements: false,
    useDigitalGlitch: true,
    buildupStyle: "chaotic",
    transitionStyle: "glitch",
    sectionLength: 4,
    preferredSamples: ["amen", "breakbeat", "glitch", "noise", "stab"],
    sampleProcessing: {
      pitchShift: [-12, 12],
      timeStretch: [0.5, 2],
      filterCutoff: [100, 12e3],
      bitCrush: 0.4,
      reverb: 0.2,
      delay: 0.3,
      chorus: 0,
      distortion: 0.7
    }
  },
  ambient: {
    name: "Ambient",
    description: "Atmospheric, meditative soundscapes with slow evolution",
    bpmRange: [60, 90],
    preferredBPM: 72,
    preferredScales: ["lydian", "wholeTone", "hirajoshi", "majorPentatonic"],
    preferredChords: ["maj9", "add9", "sus2", "sus4", "min11"],
    progressionStyle: "minimal",
    keyPreferences: ["C", "D", "E", "G", "A"],
    timeSignature: [4, 4],
    swingAmount: 0,
    rhythmComplexity: 0.1,
    grooveTightness: 0.2,
    brightness: 0.4,
    warmth: 0.7,
    saturation: 0.2,
    spaceReverb: 0.9,
    lofiAmount: 0.1,
    glitchAmount: 0,
    useVinylCrackle: false,
    useTapeWobble: false,
    useNatureAmbience: true,
    useSynthPads: true,
    useAcousticElements: false,
    useDigitalGlitch: false,
    buildupStyle: "none",
    transitionStyle: "fade",
    sectionLength: 16,
    preferredSamples: ["pad", "drone", "texture", "rain", "wind", "water"],
    sampleProcessing: {
      pitchShift: [-5, 5],
      timeStretch: [0.5, 1.5],
      filterCutoff: [100, 6e3],
      bitCrush: 0,
      reverb: 0.9,
      delay: 0.5,
      chorus: 0.4,
      distortion: 0
    }
  },
  vaporwave: {
    name: "Vaporwave",
    description: "Slowed, dreamy 80s/90s nostalgia with chopped samples",
    bpmRange: [60, 100],
    preferredBPM: 80,
    preferredScales: ["dorian", "mixolydian", "majorPentatonic", "lydian"],
    preferredChords: ["maj7", "min7", "dom9", "add9", "min9"],
    progressionStyle: "jazzy",
    keyPreferences: ["C", "F", "G", "Bb", "Eb"],
    timeSignature: [4, 4],
    swingAmount: 0.15,
    rhythmComplexity: 0.3,
    grooveTightness: 0.5,
    brightness: 0.5,
    warmth: 0.6,
    saturation: 0.7,
    spaceReverb: 0.7,
    lofiAmount: 0.5,
    glitchAmount: 0.3,
    useVinylCrackle: true,
    useTapeWobble: true,
    useNatureAmbience: false,
    useSynthPads: true,
    useAcousticElements: false,
    useDigitalGlitch: true,
    buildupStyle: "gradual",
    transitionStyle: "fade",
    sectionLength: 8,
    preferredSamples: ["synth_80s", "saxophone", "vocal_chop", "fm_bass", "slap_bass"],
    sampleProcessing: {
      pitchShift: [-7, 0],
      // Pitched down (chopped and screwed)
      timeStretch: [0.7, 1],
      // Slowed
      filterCutoff: [200, 6e3],
      bitCrush: 0.3,
      reverb: 0.7,
      delay: 0.5,
      chorus: 0.6,
      distortion: 0.2
    }
  }
};
function generateProgression(genre, key = "C", bars = 4) {
  const profile = GENRE_PROFILES[genre];
  const progression = [];
  const scale = SCALES[profile.preferredScales[0]] || SCALES.major;
  const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const keyIndex = notes.indexOf(key);
  const getScaleNote = (degree) => {
    const interval = scale[(degree - 1) % scale.length];
    return notes[(keyIndex + interval) % 12];
  };
  switch (profile.progressionStyle) {
    case "jazzy":
      const lofiProg = LOFI_PROGRESSIONS[Math.floor(Math.random() * LOFI_PROGRESSIONS.length)];
      for (let bar = 0; bar < bars; bar++) {
        const degree = lofiProg[bar % lofiProg.length];
        const root = getScaleNote(degree);
        const chordType = profile.preferredChords[Math.floor(Math.random() * profile.preferredChords.length)];
        progression.push({ root, type: chordType, degree });
      }
      break;
    case "simple":
      const simpleProg = [1, 4, 5, 1];
      for (let bar = 0; bar < bars; bar++) {
        const degree = simpleProg[bar % simpleProg.length];
        const root = getScaleNote(degree);
        const chordType = profile.preferredChords[0];
        progression.push({ root, type: chordType, degree });
      }
      break;
    case "complex":
      let prevDegree = 1;
      for (let bar = 0; bar < bars; bar++) {
        const movements = [-5, -4, -2, 2, 4, 5];
        const movement = movements[Math.floor(Math.random() * movements.length)];
        let degree = (prevDegree + movement - 1) % 7 + 1;
        if (degree < 1) degree += 7;
        const root = getScaleNote(degree);
        const chordType = profile.preferredChords[Math.floor(Math.random() * profile.preferredChords.length)];
        progression.push({ root, type: chordType, degree });
        prevDegree = degree;
      }
      break;
    case "minimal":
      const minimalProg = [1, 1, 4, 1];
      for (let bar = 0; bar < bars; bar++) {
        const degree = minimalProg[bar % minimalProg.length];
        const root = getScaleNote(degree);
        const chordType = profile.preferredChords[0];
        progression.push({ root, type: chordType, degree });
      }
      break;
    case "chaotic":
      for (let bar = 0; bar < bars; bar++) {
        const degree = Math.floor(Math.random() * 7) + 1;
        const root = notes[Math.floor(Math.random() * 12)];
        const chordType = profile.preferredChords[Math.floor(Math.random() * profile.preferredChords.length)];
        progression.push({ root, type: chordType, degree });
      }
      break;
  }
  return progression;
}
function generateMelody(genre, chord, length = 8, octave = 4) {
  const profile = GENRE_PROFILES[genre];
  const scaleFreqs = getScaleFrequencies(chord.root, profile.preferredScales[0], octave);
  const chordFreqs = getChordFrequencies(chord.root, chord.type, octave);
  const melody = [];
  switch (genre) {
    case "lofi":
      for (let i = 0; i < length; i++) {
        if (Math.random() > 0.5) {
          melody.push(0);
        } else if (Math.random() > 0.3) {
          melody.push(chordFreqs[Math.floor(Math.random() * chordFreqs.length)]);
        } else {
          melody.push(scaleFreqs[Math.floor(Math.random() * scaleFreqs.length)]);
        }
      }
      break;
    case "cottagecore":
      let currentNote = Math.floor(scaleFreqs.length / 2);
      for (let i = 0; i < length; i++) {
        if (Math.random() > 0.3) {
          melody.push(scaleFreqs[currentNote]);
          const step = Math.random() > 0.5 ? 1 : -1;
          currentNote = Math.max(0, Math.min(scaleFreqs.length - 1, currentNote + step));
        } else {
          melody.push(0);
        }
      }
      break;
    case "frutiger":
      for (let i = 0; i < length; i++) {
        const idx = i % chordFreqs.length;
        melody.push(chordFreqs[idx]);
      }
      break;
    case "breakcore":
      for (let i = 0; i < length; i++) {
        if (Math.random() > 0.4) {
          const freq = scaleFreqs[Math.floor(Math.random() * scaleFreqs.length)];
          const offset = Math.pow(2, (Math.random() - 0.5) * 0.5);
          melody.push(freq * offset);
        } else {
          melody.push(0);
        }
      }
      break;
    case "ambient":
      let lastNote = scaleFreqs[Math.floor(scaleFreqs.length / 2)];
      for (let i = 0; i < length; i++) {
        if (i % 4 === 0 && Math.random() > 0.3) {
          lastNote = scaleFreqs[Math.floor(Math.random() * scaleFreqs.length)];
        }
        melody.push(Math.random() > 0.2 ? lastNote : 0);
      }
      break;
    case "vaporwave":
      const pitchFactor = Math.pow(2, -3 / 12);
      for (let i = 0; i < length; i++) {
        if (Math.random() > 0.3) {
          const idx = i % chordFreqs.length;
          melody.push(chordFreqs[idx] * pitchFactor);
        } else {
          melody.push(0);
        }
      }
      break;
    default:
      for (let i = 0; i < length; i++) {
        melody.push(scaleFreqs[Math.floor(Math.random() * scaleFreqs.length)]);
      }
  }
  return melody;
}
function generateBassLine(genre, progression, stepsPerChord = 4) {
  const bassLine = [];
  for (const chord of progression) {
    const rootFreq = getChordFrequencies(chord.root, chord.type, 2)[0];
    const fifth = rootFreq * 1.5;
    const octave = rootFreq * 2;
    switch (genre) {
      case "lofi":
        for (let i = 0; i < stepsPerChord; i++) {
          if (i === 0) bassLine.push(rootFreq);
          else if (i === 2) bassLine.push(Math.random() > 0.5 ? fifth : rootFreq);
          else bassLine.push(0);
        }
        break;
      case "cottagecore":
        for (let i = 0; i < stepsPerChord; i++) {
          bassLine.push(i % 2 === 0 ? rootFreq : 0);
        }
        break;
      case "frutiger":
        for (let i = 0; i < stepsPerChord; i++) {
          bassLine.push(rootFreq);
        }
        break;
      case "breakcore":
        for (let i = 0; i < stepsPerChord; i++) {
          if (Math.random() > 0.3) {
            const note = [rootFreq, fifth, octave][Math.floor(Math.random() * 3)];
            bassLine.push(note * (Math.random() > 0.8 ? 0.5 : 1));
          } else {
            bassLine.push(0);
          }
        }
        break;
      case "ambient":
        for (let i = 0; i < stepsPerChord; i++) {
          bassLine.push(rootFreq);
        }
        break;
      case "vaporwave":
        const slowFactor = 0.8;
        for (let i = 0; i < stepsPerChord; i++) {
          if (i === 0 || i === 2) bassLine.push(rootFreq * slowFactor);
          else if (i === 3) bassLine.push(fifth * slowFactor);
          else bassLine.push(0);
        }
        break;
      default:
        for (let i = 0; i < stepsPerChord; i++) {
          bassLine.push(i === 0 ? rootFreq : 0);
        }
    }
  }
  return bassLine;
}
function generateEffectChain(genre) {
  const profile = GENRE_PROFILES[genre];
  const chain = {
    filter: {
      type: profile.brightness < 0.5 ? "lowpass" : "highpass",
      cutoff: 400 + profile.brightness * 4e3,
      resonance: 0.5 + profile.warmth * 0.5
    },
    reverb: {
      decay: 1 + profile.spaceReverb * 4,
      wet: profile.spaceReverb
    },
    delay: {
      time: profile.preferredBPM ? 6e4 / profile.preferredBPM / 4 : 200,
      // Quarter note
      feedback: 0.3 + profile.spaceReverb * 0.3,
      wet: 0.2 + profile.spaceReverb * 0.3
    },
    distortion: {
      amount: profile.saturation * 0.5
    }
  };
  if (profile.lofiAmount > 0.3) {
    chain.bitcrusher = {
      bits: Math.floor(16 - profile.lofiAmount * 8),
      sampleRate: 44100 * (1 - profile.lofiAmount * 0.5)
    };
  }
  if (profile.useTapeWobble) {
    chain.wobble = {
      rate: 0.5 + Math.random() * 1,
      depth: profile.lofiAmount * 0.02
    };
  }
  if (profile.useVinylCrackle) {
    chain.vinyl = {
      crackle: profile.lofiAmount * 0.5,
      noise: profile.lofiAmount * 0.2
    };
  }
  return chain;
}
function generateSection(genre, options2 = {}) {
  const profile = GENRE_PROFILES[genre];
  const key = options2.key || profile.keyPreferences[Math.floor(Math.random() * profile.keyPreferences.length)];
  const bars = options2.bars || profile.sectionLength;
  options2.bpm || profile.preferredBPM;
  const energy = options2.energy ?? 0.5;
  const progression = generateProgression(genre, key, bars);
  const chords = progression.map((p) => ({
    root: p.root,
    type: p.type,
    frequencies: getChordFrequencies(p.root, p.type, 3)
  }));
  const melody = [];
  for (let i = 0; i < bars; i++) {
    const chord = progression[i];
    const chordMelody = generateMelody(genre, chord, 4);
    melody.push(...chordMelody);
  }
  const rhythm = generateRhythm({
    genre,
    complexity: profile.rhythmComplexity * (0.8 + energy * 0.4),
    energy,
    swing: profile.swingAmount
  });
  const bass = generateBassLine(genre, progression, 4);
  const effects = generateEffectChain(genre);
  return {
    chords,
    melody,
    rhythm,
    bass,
    effects,
    duration: bars
  };
}
var GenreEngine = {
  GENRE_PROFILES,
  generateProgression,
  generateMelody,
  generateBassLine,
  generateEffectChain,
  generateSection
};

// src/audio/intelligence/dj-engine.ts
function generateChopAndScrew(_duration, intensity = 0.7) {
  const config = {
    slowdown: 0.85 - intensity * 0.2,
    // 65-85% speed
    pitchShift: -3 - Math.floor(intensity * 4),
    // -3 to -7 semitones
    chopDensity: 0.2 + intensity * 0.4,
    // How often to chop
    screwIntensity: intensity,
    reverb: 0.4 + intensity * 0.4,
    // Heavy reverb
    phaser: 0.2 + intensity * 0.3
    // Syrupy phaser
  };
  const chops = [];
  let position = 0;
  while (position < 1) {
    const gap = 1 / PHI * (0.1 + Math.random() * 0.2);
    position += gap;
    if (position >= 1) break;
    if (Math.random() < config.chopDensity) {
      const chopLength = 0.02 + Math.random() * 0.08;
      chops.push({
        time: position,
        duration: chopLength,
        repeat: Math.random() < 0.5 ? 2 : Math.random() < 0.3 ? 3 : 1,
        pitchOffset: Math.random() < 0.3 ? -2 : 0,
        reverse: Math.random() < 0.1,
        fadeIn: Math.random() < 0.2 ? 0.1 : 0,
        fadeOut: Math.random() < 0.3 ? 0.2 : 0
      });
    }
  }
  return { config, chops };
}
function screwVocal(position, syllableLength = 0.1) {
  const chops = [];
  const repeats = 2 + Math.floor(Math.random() * 3);
  for (let i = 0; i < repeats; i++) {
    chops.push({
      time: position,
      duration: syllableLength * (1 + i * 0.1),
      // Each repeat slightly longer
      repeat: 1,
      pitchOffset: -i * 0.5,
      // Slight pitch drop each repeat
      reverse: false,
      fadeIn: 0,
      fadeOut: i === repeats - 1 ? 0.3 : 0
    });
  }
  return chops;
}
function calculateBPM(beatPositions, durationMs) {
  if (beatPositions.length < 2) return 120;
  let totalInterval = 0;
  for (let i = 1; i < beatPositions.length; i++) {
    totalInterval += beatPositions[i] - beatPositions[i - 1];
  }
  const avgInterval = totalInterval / (beatPositions.length - 1);
  const intervalMs = avgInterval * durationMs;
  return Math.round(6e4 / intervalMs);
}
function generateBeatGrid(bpm, durationMs, timeSignature = [4, 4]) {
  const beatMs = 6e4 / bpm;
  const totalBeats = Math.floor(durationMs / beatMs);
  const beatPositions = [];
  const downbeats = [];
  const transients = [];
  for (let i = 0; i < totalBeats; i++) {
    const position = i * beatMs / durationMs;
    beatPositions.push(position);
    if (i % timeSignature[0] === 0) {
      downbeats.push(position);
    }
    if (timeSignature[0] === 4 && (i % 4 === 1 || i % 4 === 3)) {
      transients.push(position);
    }
  }
  return { bpm, timeSignature, beatPositions, downbeats, transients };
}
function calculateStretchRatio(sourceBPM, targetBPM) {
  return targetBPM / sourceBPM;
}
function findMixPoint(trackA, _trackB, preferredPosition = 0.75) {
  const nearestDownbeatA = trackA.downbeats.reduce(
    (prev, curr) => Math.abs(curr - preferredPosition) < Math.abs(prev - preferredPosition) ? curr : prev
  );
  return {
    trackA: {
      position: nearestDownbeatA,
      volume: 1,
      filter: 1
      // Full brightness
    },
    trackB: {
      position: 0,
      // Start of track B
      volume: 0,
      filter: 0.5
      // Start filtered
    },
    crossfade: -1
    // Start on A
  };
}
function generateTransition(type, bpm, intensity = 0.5) {
  const config = {
    type,
    duration: type === "cut" ? 0 : type === "stutter" ? 2 : 8,
    curve: type === "filter" ? "s-curve" : "linear",
    effectIntensity: intensity
  };
  const steps = generateTransitionSteps(config);
  return { ...config, steps };
}
function generateTransitionSteps(config, _bpm) {
  const steps = [];
  const numSteps = Math.ceil(config.duration * 4);
  for (let i = 0; i <= numSteps; i++) {
    const t = i / numSteps;
    let crossfade;
    switch (config.curve) {
      case "exponential":
        crossfade = Math.pow(t, 2);
        break;
      case "logarithmic":
        crossfade = Math.sqrt(t);
        break;
      case "s-curve":
        crossfade = t * t * (3 - 2 * t);
        break;
      default:
        crossfade = t;
    }
    const step = {
      time: t,
      volumeA: 1 - crossfade,
      volumeB: crossfade,
      filterA: 1 - crossfade * 0.5,
      // A gets darker
      filterB: 0.5 + crossfade * 0.5
      // B gets brighter
    };
    switch (config.type) {
      case "echo":
        step.effect = {
          type: "delay",
          value: config.effectIntensity * (1 - Math.abs(t - 0.5) * 2)
        };
        break;
      case "filter":
        step.filterA = 1 - crossfade * 0.8;
        step.filterB = 0.2 + crossfade * 0.8;
        break;
      case "backspin":
        if (t > 0.3 && t < 0.5) {
          step.effect = { type: "backspin", value: 1 - (t - 0.3) * 5 };
        }
        break;
      case "stutter":
        if (t < 0.5) {
          const stutterPos = Math.floor(t * 8) / 8;
          step.effect = { type: "stutter", value: stutterPos };
        }
        break;
    }
    steps.push(step);
  }
  return steps;
}
function generateChopPoints(_duration, numChops, style = "golden") {
  const points = [0];
  switch (style) {
    case "grid":
      for (let i = 1; i < numChops; i++) {
        points.push(i / numChops);
      }
      break;
    case "golden":
      for (let i = 1; i < numChops; i++) {
        points.push(i / PHI % 1);
      }
      points.sort((a, b) => a - b);
      break;
    case "fibonacci":
      const fibSum = FIBONACCI.slice(0, numChops).reduce((a, b) => a + b, 0);
      let cumSum = 0;
      for (let i = 0; i < Math.min(numChops, FIBONACCI.length); i++) {
        cumSum += FIBONACCI[i];
        points.push(cumSum / fibSum);
      }
      break;
    case "random":
      for (let i = 1; i < numChops; i++) {
        let point;
        let attempts = 0;
        do {
          point = Math.random();
          attempts++;
        } while (attempts < 100 && points.some((p) => Math.abs(p - point) < 0.05));
        points.push(point);
      }
      points.sort((a, b) => a - b);
      break;
  }
  return points;
}
function rearrangeSlices(numSlices, style) {
  const original = Array.from({ length: numSlices }, (_, i) => i);
  switch (style) {
    case "shuffle":
      const shuffled = [...original];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    case "reverse":
      return [...original].reverse();
    case "palindrome":
      return [...original, ...original.slice(0, -1).reverse()];
    case "breakcore":
      const breakcore = [];
      for (let i = 0; i < numSlices * 2; i++) {
        const slice = Math.floor(Math.random() * numSlices);
        breakcore.push(slice);
        if (Math.random() < 0.3) {
          breakcore.push(slice);
        }
      }
      return breakcore;
    case "intelligent":
      const intelligent = [];
      for (let i = 0; i < numSlices; i++) {
        intelligent.push(original[i]);
        if (i > 2 && Math.random() < 0.2) {
          intelligent.push(original[Math.floor(Math.random() * i)]);
        }
      }
      return intelligent;
  }
}
function generateStutter(divisions = 8, style) {
  let pattern;
  let pitchRamp = 0;
  let volumeDecay = 0;
  switch (style) {
    case "buildup":
      pattern = [1, 0, 0, 0, 1, 0, 1, 1];
      pitchRamp = 0.5;
      volumeDecay = -0.05;
      break;
    case "breakdown":
      pattern = [1, 1, 1, 0, 1, 0, 0, 0];
      pitchRamp = -0.5;
      volumeDecay = 0.1;
      break;
    case "random":
      pattern = Array.from(
        { length: divisions },
        () => Math.random() > 0.4 ? 1 : 0
      );
      pitchRamp = (Math.random() - 0.5) * 2;
      volumeDecay = Math.random() * 0.2;
      break;
    case "trance":
      pattern = [1, 0, 1, 0, 1, 0, 1, 0];
      pitchRamp = 0;
      volumeDecay = 0;
      break;
  }
  return {
    divisions,
    pattern,
    pitchRamp,
    volumeDecay,
    gateLength: style === "trance" ? 0.5 : 0.8
  };
}
function generateTapeStop(durationMs) {
  const steps = Math.ceil(durationMs / 10);
  const pitchCurve = [];
  const speedCurve = [];
  for (let i = 0; i < steps; i++) {
    const t = i / steps;
    const factor = Math.pow(1 - t, 2);
    speedCurve.push(factor);
    pitchCurve.push(12 * Math.log2(factor));
  }
  return { pitchCurve, speedCurve };
}
function generateScratch(style) {
  const positions = [];
  const speeds = [];
  switch (style) {
    case "baby":
      for (let i = 0; i < 10; i++) {
        positions.push(Math.sin(i * 0.5) * 0.1);
        speeds.push(Math.cos(i * 0.5));
      }
      break;
    case "chirp":
      positions.push(0, 0.05, 0.05, 0);
      speeds.push(1, 1, 0, 0);
      break;
    case "transform":
      for (let i = 0; i < 8; i++) {
        positions.push(i * 0.02);
        speeds.push(i % 2 === 0 ? 1 : 0);
      }
      break;
    case "flare":
      const flarePattern = [1, 0, 1, 0, 1, -1, 0, -1, 0, -1];
      for (let i = 0; i < flarePattern.length; i++) {
        positions.push(i * 0.015);
        speeds.push(flarePattern[i]);
      }
      break;
  }
  return { positions, speeds };
}
function analyzeCompatibility(trackA, trackB) {
  const bpmRatio = Math.min(trackA.bpm, trackB.bpm) / Math.max(trackA.bpm, trackB.bpm);
  const bpmCompatibility = bpmRatio > 0.94 ? 1 : bpmRatio > 0.88 ? 0.8 : bpmRatio > 0.75 ? 0.5 : 0.2;
  const notes = ["C", "G", "D", "A", "E", "B", "F#", "Db", "Ab", "Eb", "Bb", "F"];
  const keyA = notes.indexOf(trackA.key.replace("m", ""));
  const keyB = notes.indexOf(trackB.key.replace("m", ""));
  const keyDistance = Math.min(
    Math.abs(keyA - keyB),
    12 - Math.abs(keyA - keyB)
  );
  const keyCompatibility = keyDistance === 0 ? 1 : keyDistance <= 1 ? 0.9 : keyDistance <= 2 ? 0.7 : keyDistance <= 3 ? 0.5 : 0.3;
  const isRelative = trackA.key.includes("m") !== trackB.key.includes("m") && keyDistance === 3;
  return {
    bpmCompatibility,
    keyCompatibility: isRelative ? Math.min(1, keyCompatibility + 0.2) : keyCompatibility,
    overallScore: bpmCompatibility * 0.6 + keyCompatibility * 0.4,
    suggestedStretch: trackB.bpm / trackA.bpm
  };
}
function generateMix(trackAInfo, trackBInfo, mixStyle) {
  const mixPoint = findMixPoint(trackAInfo);
  let transitionType;
  let effects = [];
  switch (mixStyle) {
    case "smooth":
      transitionType = "filter";
      effects = ["lowpass sweep", "reverb swell"];
      break;
    case "quick":
      transitionType = "cut";
      effects = ["echo out"];
      break;
    case "creative":
      transitionType = Math.random() > 0.5 ? "backspin" : "stutter";
      effects = ["tape stop", "vinyl scratch", "stutter"];
      break;
  }
  const transition = generateTransition(
    transitionType,
    trackAInfo.bpm,
    mixStyle === "creative" ? 0.8 : 0.5
  );
  return { mixPoint, transition, effects };
}
var DJEngine = {
  // Chop & Screw
  generateChopAndScrew,
  screwVocal,
  // Beat matching
  calculateBPM,
  generateBeatGrid,
  calculateStretchRatio,
  findMixPoint,
  // Transitions
  generateTransition,
  // Sample manipulation
  generateChopPoints,
  rearrangeSlices,
  // Effects
  generateStutter,
  generateTapeStop,
  generateScratch,
  // Intelligent mixing
  analyzeCompatibility,
  generateMix
};

// src/audio/intelligence/arrangement-engine.ts
var SECTION_TEMPLATES = {
  intro: {
    energy: 0.3,
    tension: 0.2,
    elements: {
      drums: false,
      bass: false,
      chords: true,
      melody: false,
      pads: true,
      fx: true,
      vocals: false,
      percussion: false
    }
  },
  verse: {
    energy: 0.5,
    tension: 0.4,
    elements: {
      drums: true,
      bass: true,
      chords: true,
      melody: false,
      pads: false,
      fx: false,
      vocals: true,
      percussion: true
    }
  },
  prechorus: {
    energy: 0.6,
    tension: 0.7,
    elements: {
      drums: true,
      bass: true,
      chords: true,
      melody: true,
      pads: true,
      fx: true,
      vocals: true,
      percussion: true
    }
  },
  chorus: {
    energy: 0.8,
    tension: 0.5,
    elements: {
      drums: true,
      bass: true,
      chords: true,
      melody: true,
      pads: true,
      fx: false,
      vocals: true,
      percussion: true
    }
  },
  bridge: {
    energy: 0.4,
    tension: 0.6,
    elements: {
      drums: false,
      bass: true,
      chords: true,
      melody: true,
      pads: true,
      fx: true,
      vocals: true,
      percussion: false
    }
  },
  breakdown: {
    energy: 0.2,
    tension: 0.3,
    elements: {
      drums: false,
      bass: false,
      chords: true,
      melody: false,
      pads: true,
      fx: true,
      vocals: false,
      percussion: false
    }
  },
  buildup: {
    energy: 0.6,
    tension: 0.9,
    elements: {
      drums: true,
      bass: true,
      chords: true,
      melody: false,
      pads: true,
      fx: true,
      vocals: false,
      percussion: true
    }
  },
  drop: {
    energy: 1,
    tension: 0.3,
    elements: {
      drums: true,
      bass: true,
      chords: true,
      melody: true,
      pads: false,
      fx: false,
      vocals: false,
      percussion: true
    }
  },
  outro: {
    energy: 0.3,
    tension: 0.1,
    elements: {
      drums: false,
      bass: false,
      chords: true,
      melody: true,
      pads: true,
      fx: true,
      vocals: false,
      percussion: false
    }
  }
};
var STRUCTURE_TEMPLATES = {
  "verse-chorus": ["intro", "verse", "chorus", "verse", "chorus", "bridge", "chorus", "outro"],
  "verse-chorus-short": ["intro", "verse", "chorus", "verse", "chorus", "outro"],
  "buildup-drop": ["intro", "buildup", "drop", "breakdown", "buildup", "drop", "outro"],
  "buildup-drop-extended": ["intro", "verse", "buildup", "drop", "breakdown", "verse", "buildup", "drop", "outro"],
  "ambient": ["intro", "verse", "bridge", "verse", "outro"],
  "lofi": ["intro", "verse", "verse", "bridge", "verse", "outro"],
  "breakcore": ["intro", "drop", "breakdown", "drop", "breakdown", "buildup", "drop", "outro"],
  "freeform": ["intro", "verse", "bridge", "chorus", "outro"]
};
function generateEnergyCurve(sections) {
  const curve = [];
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const baseEnergy = section.energy;
    for (let bar = 0; bar < section.bars; bar++) {
      const barProgress = bar / section.bars;
      const goldenMod = Math.sin(barProgress * Math.PI * PHI) * 0.1;
      let buildFactor = 0;
      if (section.type === "buildup") {
        buildFactor = barProgress * 0.3;
      } else if (section.type === "verse") {
        buildFactor = barProgress * 0.1;
      }
      curve.push(Math.max(0, Math.min(1, baseEnergy + goldenMod + buildFactor)));
    }
  }
  return curve;
}
function generateTensionCurve(sections) {
  const curve = [];
  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];
    const baseTension = section.tension;
    for (let bar = 0; bar < section.bars; bar++) {
      const barProgress = bar / section.bars;
      const transitionTension = barProgress > 0.75 ? (barProgress - 0.75) * 2 : 0;
      const releaseFactor = barProgress < 0.1 ? (0.1 - barProgress) * 2 : 0;
      curve.push(Math.max(0, Math.min(
        1,
        baseTension + transitionTension - releaseFactor
      )));
    }
  }
  return curve;
}
function generateArrangement(options2) {
  const profile = GENRE_PROFILES[options2.genre];
  const key = options2.key || profile.keyPreferences[Math.floor(Math.random() * profile.keyPreferences.length)];
  const bpm = options2.bpm || profile.preferredBPM;
  let totalBars;
  if (typeof options2.duration === "number") {
    totalBars = options2.duration;
  } else {
    totalBars = options2.duration === "short" ? 32 : options2.duration === "medium" ? 64 : options2.duration === "long" ? 128 : 64;
  }
  let structureKey = options2.structure;
  if (options2.structure === "custom" || options2.structure === "freeform") {
    if (options2.genre === "lofi") structureKey = "lofi";
    else if (options2.genre === "breakcore") structureKey = "breakcore";
    else if (options2.genre === "ambient") structureKey = "ambient";
    else structureKey = "verse-chorus";
  }
  const structure = STRUCTURE_TEMPLATES[structureKey] || STRUCTURE_TEMPLATES["verse-chorus"];
  const barsPerSection = Math.floor(totalBars / structure.length);
  const sections = structure.map((type, index) => {
    const template = SECTION_TEMPLATES[type];
    let energyMod = 0;
    if (options2.energy === "chill") energyMod = -0.2;
    else if (options2.energy === "high") energyMod = 0.2;
    else if (options2.energy === "dynamic") {
      energyMod = (template.energy || 0.5) > 0.5 ? 0.15 : -0.15;
    }
    let bars = barsPerSection;
    if (type === "intro" || type === "outro") bars = Math.min(8, barsPerSection);
    if (type === "buildup") bars = Math.min(4, barsPerSection);
    if (type === "drop" || type === "chorus") bars = Math.max(8, barsPerSection);
    return {
      type,
      name: `${type}-${index + 1}`,
      bars,
      energy: Math.max(0, Math.min(1, (template.energy || 0.5) + energyMod)),
      tension: template.tension || 0.5,
      elements: template.elements || {
        drums: true,
        bass: true,
        chords: true,
        melody: true,
        pads: true,
        fx: true,
        vocals: false,
        percussion: true
      }
    };
  });
  const energyCurve = generateEnergyCurve(sections);
  const tensionCurve = generateTensionCurve(sections);
  const transitions = [];
  let currentBar = 0;
  for (let i = 0; i < sections.length - 1; i++) {
    currentBar += sections[i].bars;
    const energyChange = sections[i + 1].energy - sections[i].energy;
    let transitionType;
    if (energyChange > 0.3) {
      transitionType = "buildup";
    } else if (energyChange < -0.3) {
      transitionType = "filter";
    } else if (options2.genre === "breakcore") {
      transitionType = Math.random() > 0.5 ? "cut" : "stutter";
    } else {
      transitionType = "fade";
    }
    transitions.push({
      position: currentBar,
      type: transitionType
    });
  }
  for (const section of sections) {
    section.generated = generateSection(options2.genre, {
      key,
      bars: section.bars,
      bpm,
      energy: section.energy
    });
  }
  return {
    genre: options2.genre,
    key,
    bpm,
    timeSignature: profile.timeSignature,
    totalBars: sections.reduce((sum, s) => sum + s.bars, 0),
    sections,
    energyCurve,
    tensionCurve,
    transitions
  };
}
function getLiveState(arrangement, currentBar, currentBeat = 0) {
  let barCount = 0;
  let currentSectionIndex = 0;
  for (let i = 0; i < arrangement.sections.length; i++) {
    if (barCount + arrangement.sections[i].bars > currentBar) {
      currentSectionIndex = i;
      break;
    }
    barCount += arrangement.sections[i].bars;
  }
  const currentSection = arrangement.sections[currentSectionIndex];
  const barsIntoSection = currentBar - barCount;
  const barsUntilNext = currentSection.bars - barsIntoSection;
  const curveIndex = Math.min(currentBar, arrangement.energyCurve.length - 1);
  const energy = arrangement.energyCurve[curveIndex];
  const tension = arrangement.tensionCurve[curveIndex];
  const suggestions = [];
  if (barsUntilNext <= 4) {
    suggestions.push(`Prepare for ${arrangement.sections[currentSectionIndex + 1]?.type || "end"}`);
  }
  if (tension > 0.7) {
    suggestions.push("High tension - consider release");
  }
  if (energy < 0.3 && currentSection.type !== "intro" && currentSection.type !== "outro") {
    suggestions.push("Low energy - add elements");
  }
  if (currentSection.type === "buildup" && barsUntilNext <= 2) {
    suggestions.push("Drop incoming - build tension!");
  }
  return {
    currentSection: currentSectionIndex,
    currentBar: barsIntoSection,
    currentBeat,
    energy,
    tension,
    nextSectionIn: barsUntilNext,
    suggestedActions: suggestions
  };
}
function getActiveElements(arrangement, bar) {
  const state = getLiveState(arrangement, bar);
  const section = arrangement.sections[state.currentSection];
  const elements = { ...section.elements };
  const intensity = {
    drums: section.elements.drums ? state.energy : 0,
    bass: section.elements.bass ? 0.7 + state.energy * 0.3 : 0,
    chords: section.elements.chords ? 0.6 + state.tension * 0.4 : 0,
    melody: section.elements.melody ? 0.5 + state.energy * 0.5 : 0,
    pads: section.elements.pads ? 0.8 - state.energy * 0.3 : 0,
    // Pads decrease with energy
    fx: section.elements.fx ? state.tension : 0,
    vocals: section.elements.vocals ? 0.7 + state.energy * 0.3 : 0,
    percussion: section.elements.percussion ? state.energy * 0.8 : 0
  };
  return { ...elements, intensity };
}
function generateVariation(section, variationType) {
  const variation = { ...section };
  switch (variationType) {
    case "subtle":
      variation.energy = Math.max(0, Math.min(1, section.energy + (Math.random() - 0.5) * 0.1));
      break;
    case "moderate":
      variation.energy = Math.max(0, Math.min(1, section.energy + (Math.random() - 0.5) * 0.2));
      variation.tension = Math.max(0, Math.min(1, section.tension + (Math.random() - 0.5) * 0.2));
      if (Math.random() > 0.7) variation.elements.percussion = !section.elements.percussion;
      if (Math.random() > 0.8) variation.elements.fx = !section.elements.fx;
      break;
    case "dramatic":
      variation.energy = Math.max(0, Math.min(1, 1 - section.energy));
      variation.tension = Math.max(0, Math.min(1, section.tension + (Math.random() - 0.5) * 0.4));
      const keys = Object.keys(variation.elements);
      for (const key of keys) {
        if (Math.random() > 0.6) {
          variation.elements[key] = !section.elements[key];
        }
      }
      break;
  }
  variation.name = `${section.name}-var`;
  return variation;
}
function addFills(arrangement, fillDensity = 0.3) {
  const fills = [];
  for (const transition of arrangement.transitions) {
    fills.push({
      bar: transition.position - 1,
      type: "transition-fill",
      intensity: 0.8
    });
  }
  for (let bar = 4; bar < arrangement.totalBars; bar += 4) {
    if (Math.random() < fillDensity) {
      if (!fills.some((f) => Math.abs(f.bar - bar) < 2)) {
        fills.push({
          bar,
          type: bar % 8 === 0 ? "phrase-fill" : "mini-fill",
          intensity: bar % 8 === 0 ? 0.6 : 0.4
        });
      }
    }
  }
  return fills.sort((a, b) => a.bar - b.bar);
}
var ArrangementEngine = {
  SECTION_TEMPLATES,
  STRUCTURE_TEMPLATES,
  generateArrangement,
  getLiveState,
  getActiveElements,
  generateVariation,
  addFills
};

// src/audio/intelligence/jazz-engine.ts
var NOTE_NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
var PC = { C: 0, "C#": 1, Db: 1, D: 2, "D#": 3, Eb: 3, E: 4, F: 5, "F#": 6, Gb: 6, G: 7, "G#": 8, Ab: 8, A: 9, "A#": 10, Bb: 10, B: 11 };
function nameToMidi(note) {
  const m = note.match(/^([A-G][#b]?)(-?\d+)$/);
  if (!m) return 60;
  return (parseInt(m[2], 10) + 1) * 12 + (PC[m[1]] ?? 0);
}
function midiToName(midi) {
  return NOTE_NAMES[(midi % 12 + 12) % 12] + (Math.floor(midi / 12) - 1);
}
function rng(seed) {
  let s = seed >>> 0 || 1;
  return () => {
    s = s * 1664525 + 1013904223 >>> 0;
    return s / 4294967296;
  };
}
var CHORD_SCALE = {
  maj7: "major",
  maj9: "major",
  major: "major",
  add9: "major",
  maj13: "lydian",
  min7: "dorian",
  min9: "dorian",
  min11: "dorian",
  minor: "dorian",
  minMaj7: "aeolian",
  dom7: "mixolydian",
  dom9: "mixolydian",
  dom7sharp11: "lydian",
  dom7flat9: "diminished",
  dom7sharp9: "diminished",
  halfDim7: "locrian",
  dim7: "diminished",
  sus4: "mixolydian",
  sus2: "major"
};
var intervalsOf = (quality) => CHORDS[quality] || CHORDS.dom7;
var scaleOf = (quality) => SCALES[CHORD_SCALE[quality] || "mixolydian"] || SCALES.mixolydian;
function guideTones(change, octave = 4) {
  const ivs = intervalsOf(change.quality);
  const third = ivs.find((i) => i === 3 || i === 4) ?? 4;
  const seventh = ivs.find((i) => i === 10 || i === 11 || i === 9) ?? 10;
  const root = nameToMidi(`${change.root}${octave}`);
  return [midiToName(root + third), midiToName(root + seventh)];
}
function chordTones(change, octave) {
  const root = nameToMidi(`${change.root}${octave}`);
  return intervalsOf(change.quality).map((i) => root + i);
}
function scaleTones(change, octave) {
  const root = nameToMidi(`${change.root}${octave}`);
  const sc = scaleOf(change.quality);
  return [...sc, ...sc.map((i) => i + 12)].map((i) => root + i);
}
function enclosure(targetMidi) {
  return [targetMidi + 2, targetMidi - 1, targetMidi];
}
function blueNotes(rootName, octave) {
  const r = nameToMidi(`${rootName}${octave}`);
  return [r + 3, r + 6, r + 10];
}
var nearest = (target, pool) => pool.reduce((best, n) => Math.abs(n - target) < Math.abs(best - target) ? n : best, pool[0] ?? target);
function walkingBass(changes, octave = 2, seed = 7) {
  const r = rng(seed);
  const out = [];
  for (let c = 0; c < changes.length; c++) {
    const ch = changes[c];
    const next = changes[(c + 1) % changes.length];
    const bars = ch.bars ?? 1;
    for (let b = 0; b < bars; b++) {
      const root = nameToMidi(`${ch.root}${octave}`);
      const tones = chordTones(ch, octave);
      const nextRoot = nameToMidi(`${next.root}${octave}`);
      const lastBarOfChord = b === bars - 1;
      const approach = lastBarOfChord ? nextRoot + (r() < 0.5 ? -1 : 1) : nearest(root + 5, tones);
      const beat2 = nearest(root + (r() < 0.5 ? 4 : 7), tones);
      const beat3 = nearest(root + (r() < 0.5 ? 7 : 3), tones);
      out.push(
        { note: midiToName(root), dur: 1, velocity: 0.7, role: "root" },
        { note: midiToName(beat2), dur: 1, velocity: 0.55, role: "chord-tone" },
        { note: midiToName(beat3), dur: 1, velocity: 0.55, role: "chord-tone" },
        { note: midiToName(approach), dur: 1, velocity: 0.6, role: "approach" }
      );
    }
  }
  return out;
}
function comp(changes, octave = 4) {
  const hits = [0.5, 1.5, 2.5];
  const out = [];
  let bar = 0;
  for (const ch of changes) {
    const bars = ch.bars ?? 1;
    const voicing = guideTones(ch, octave);
    for (let b = 0; b < bars; b++) {
      for (const at of hits) out.push({ at, bar, voicing, velocity: 0.4 + (at === 0.5 ? 0.1 : 0) });
      bar++;
    }
  }
  return out;
}
function soloOverChanges(changes, opts = {}) {
  const octave = opts.octave ?? 4;
  const swing = opts.swing ?? 0.6;
  const density = opts.density ?? 0.72;
  const bluesiness = opts.bluesiness ?? 0.18;
  const bpb = opts.beatsPerBar ?? 4;
  const r = rng(opts.seed ?? 42);
  const out = [];
  let prev = nameToMidi(`${changes[0].root}${octave}`) + 4;
  const onDur = 0.5 + swing * 0.16;
  const offDur = 1 - onDur;
  for (let c = 0; c < changes.length; c++) {
    const ch = changes[c];
    const next = changes[(c + 1) % changes.length];
    const bars = ch.bars ?? 1;
    const scale = scaleTones(ch, octave);
    const guides = guideTones(ch, octave).map(nameToMidi);
    const blues = blueNotes(ch.root, octave);
    for (let b = 0; b < bars; b++) {
      const slots = bpb * 2;
      const target = guides[Math.floor(r() * guides.length)];
      for (let s = 0; s < slots; s++) {
        const onBeat = s % 2 === 0;
        const strong = s === 0 || s === slots / 2;
        const dur = onBeat ? onDur : offDur;
        if (!strong && r() > density) {
          out.push({ note: "rest", dur, velocity: 0, role: "rest" });
          continue;
        }
        let midi;
        let role;
        if (strong && (s === 0 || r() < 0.6)) {
          midi = nearest(prev, [target, target + 12, target - 12]);
          role = "guide";
        } else if (s >= slots - 2 && b === bars - 1) {
          const nextThird = nameToMidi(guideTones(next, octave)[0]);
          const enc = enclosure(nextThird);
          midi = enc[s - (slots - 2)] ?? nextThird;
          role = "enclosure";
        } else if (r() < bluesiness) {
          midi = nearest(prev, blues);
          role = "blue";
        } else if (r() < 0.78) {
          const dir = r() < 0.5 ? 1 : -1;
          const stepped = nearest(prev + dir * 2, scale);
          midi = stepped;
          role = Math.abs(stepped - prev) <= 2 ? "passing" : "chord-tone";
        } else {
          midi = nearest(prev + (r() < 0.5 ? 5 : -4), scale);
          role = "chord-tone";
        }
        if (midi - prev > 9) midi -= 12;
        if (prev - midi > 9) midi += 12;
        out.push({ note: midiToName(midi), dur, velocity: strong ? 0.85 : 0.6 + r() * 0.12, role });
        prev = midi;
      }
    }
  }
  return out;
}
function iiVI(key = "C", opts = {}) {
  const r = nameToMidi(`${key}3`);
  const ii = midiToName(r + 2).replace(/-?\d+$/, "");
  const V = midiToName(r + 7).replace(/-?\d+$/, "");
  const I = key;
  const changes = [
    { root: ii, quality: "min7", bars: 1 },
    { root: V, quality: "dom7", bars: 1 },
    { root: I, quality: "maj7", bars: 2 }
  ];
  return { changes, line: soloOverChanges(changes, { swing: 0.66, density: 0.8, ...opts }) };
}
function tradeFours(changes, voices = ["kaios", "partner"], baseSeed = 11) {
  const perBar = [];
  for (const ch of changes) for (let b = 0; b < (ch.bars ?? 1); b++) perBar.push({ root: ch.root, quality: ch.quality, bars: 1 });
  const out = [];
  for (let i = 0, turn = 0; i < perBar.length; i += 4, turn++) {
    const bars = perBar.slice(i, i + 4);
    const voice = voices[turn % voices.length];
    const character = voice === "kaios" ? { swing: 0.68, density: 0.78, bluesiness: 0.16 } : { swing: 0.6, density: 0.66, bluesiness: 0.28 };
    out.push({ voice, bars, line: soloOverChanges(bars, { ...character, seed: baseSeed + turn }) });
  }
  return out;
}
var JazzEngine = {
  CHORD_SCALE,
  guideTones,
  enclosure,
  walkingBass,
  comp,
  soloOverChanges,
  iiVI,
  tradeFours
};

// src/audio/intelligence/affect-engine.ts
var LOOKS = ["ETHEREAL", "GLITCHCORE", "SHATTER", "PIN-ART", "CONSTELLATION", "RAINBOW ROAD", "VOID DRIFT"];
var clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
var AffectiveSynth = class {
  es = 0;
  // fast energy envelope
  el = 0;
  // slow energy envelope (the song's shape)
  tension = 0;
  beat = 0;
  phrase;
  arc = "intro";
  arcLocked = false;
  valence = 0;
  arousal = 0.4;
  constructor(opts = {}) {
    this.phrase = opts.phrase ?? 16;
    if (opts.valence != null) this.valence = clamp(opts.valence, -1, 1);
    if (opts.arousal != null) this.arousal = clamp(opts.arousal, 0, 1);
  }
  setAffect(a) {
    this.valence = clamp(a.valence, -1, 1);
    this.arousal = clamp(a.arousal, 0, 1);
  }
  setValence(v) {
    this.valence = clamp(v, -1, 1);
  }
  setArousal(a) {
    this.arousal = clamp(a, 0, 1);
  }
  /** Pin the arc phase (e.g. the prose/narrative says "the drop"); pass null to resume auto. */
  setArc(p) {
    if (p) {
      this.arc = p;
      this.arcLocked = true;
    } else this.arcLocked = false;
  }
  /** Advance one beat with a live energy sample (audio RMS / activity). Returns the unified state. */
  tick(energy) {
    const e = clamp(energy ?? this.arousal, 0, 1);
    this.es += (e - this.es) * 0.09;
    this.el += (e - this.el) * 0.012;
    this.beat++;
    const rising = this.es > this.el * 1.06 + 0.02;
    const edge = this.beat % 4 === 0;
    const drop = edge && this.es > this.el * 1.45 && this.tension > 0.45;
    const breakdown = this.el < 0.18 && this.es < 0.2;
    const phraseCut = this.beat % this.phrase === 0;
    this.tension = clamp(this.tension + (rising ? 0.04 : -0.02) - (drop ? 0.6 : 0), 0, 1);
    if (!this.arcLocked) this.advanceArc(drop, breakdown);
    return {
      valence: this.valence,
      arousal: this.arousal,
      energyFast: this.es,
      energySlow: this.el,
      tension: this.tension,
      arc: this.arc,
      beat: this.beat,
      rising,
      drop,
      breakdown,
      phraseCut,
      music: this.music(),
      visual: this.visual(drop, breakdown)
    };
  }
  advanceArc(drop, breakdown) {
    switch (this.arc) {
      case "intro":
        if (this.el > 0.25) this.arc = "building";
        break;
      case "building":
        if (drop || this.el > 0.6) this.arc = "peak";
        break;
      case "peak":
        if (this.el < 0.45) this.arc = "falling";
        break;
      case "falling":
        if (breakdown || this.el < 0.15) this.arc = "outro";
        break;
    }
  }
  /** valence → mode/quality, arousal → density/register/tempo, tension → dissonance. */
  music() {
    const mode = this.valence > 0.25 ? this.arousal > 0.6 ? "lydian" : "major" : this.valence < -0.25 ? this.arousal > 0.55 ? "phrygian" : "dorian" : "mixolydian";
    const chordBias = this.valence > 0.2 ? ["maj7", "maj9", "add9"] : this.valence < -0.2 ? ["min7", "min9", "minMaj7"] : ["dom7", "min7", "halfDim7"];
    return {
      mode,
      chordBias,
      register: Math.round(clamp(3 + this.arousal * 2, 2, 6)),
      density: clamp(0.25 + this.arousal * 0.65, 0, 1),
      swing: clamp(0.5 + (1 - this.arousal) * 0.25, 0, 1),
      dissonance: this.tension,
      tempoBias: 0.8 + this.arousal * 0.6
    };
  }
  /** drop/breakdown/tension/valence → LOOK + palette + glitch/bloom/motion. (folds MNEME apTick) */
  visual(drop, breakdown) {
    const look = breakdown ? "VOID DRIFT" : drop ? "SHATTER" : this.tension > 0.6 ? "GLITCHCORE" : this.valence > 0.4 ? "RAINBOW ROAD" : this.arousal < 0.3 ? "ETHEREAL" : "CONSTELLATION";
    const palette = this.valence >= 0 ? ["#FF4DB8", "#C2F870", "#7FD4FF"] : ["#7FD4FF", "#FF4DB8", "#2A1840"];
    return {
      look,
      palette,
      bloom: clamp(0.3 + this.es * 0.7, 0, 1),
      glitch: clamp(this.tension * 0.8 + (drop ? 0.5 : 0), 0, 1),
      motion: clamp(this.es, 0, 1),
      particles: Math.round(clamp(this.arousal, 0, 1) * 28e3)
    };
  }
};
function createAffectiveSynth(opts) {
  return new AffectiveSynth(opts);
}
var AffectEngine = { AffectiveSynth, createAffectiveSynth, LOOKS };

// src/audio/intelligence/affect-clock-v2.ts
var HZ = 30;
var EPS = 1e-10;
var clamp2 = (x, lo = 0, hi = 1) => Math.max(lo, Math.min(hi, x));
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
          this.tension = clamp2(this.tension - 0.6);
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
    this.tension = clamp2(this.tension + (this.rising ? 0.04 : -0.02) * HZ * dt);
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
          register: Math.round(clamp2(3 + a * 2, 2, 6)),
          density: clamp2(0.25 + a * 0.65),
          swing: clamp2(0.5 + (1 - a) * 0.25),
          dissonance: this.tension,
          tempoBias: 0.8 + a * 0.6
        },
        visual: {
          look,
          palette: v >= 0 ? ["#FF4DB8", "#C2F870", "#7FD4FF"] : ["#7FD4FF", "#FF4DB8", "#2A1840"],
          bloom: clamp2(0.3 + this.fast * 0.7),
          glitch: clamp2(this.tension * 0.8 + (drop ? 0.5 : 0)),
          motion: clamp2(this.fast),
          particles: Math.round(a * 28e3)
        }
      },
      events,
      clock: { timeSeconds: this.now, bpm: this.config.bpm, beatPhase: clamp2((this.now - this.config.start) * this.config.bpm / 60 - this.beat), track: this.track }
    };
  }
};

// src/audio/intelligence/index.ts
function createLofiBeat(options2 = {}) {
  return generateArrangement({
    genre: "lofi",
    duration: "medium",
    energy: "chill",
    structure: "verse-chorus",
    ...options2
  });
}
function createBreakcore(options2 = {}) {
  return generateArrangement({
    genre: "breakcore",
    duration: "medium",
    energy: "high",
    structure: "buildup-drop",
    ...options2
  });
}
function createCottagecore(options2 = {}) {
  return generateArrangement({
    genre: "cottagecore",
    duration: "medium",
    energy: "chill",
    structure: "ambient",
    ...options2
  });
}
function createFrutigerAero(options2 = {}) {
  return generateArrangement({
    genre: "frutiger",
    duration: "medium",
    energy: "medium",
    structure: "buildup-drop",
    ...options2
  });
}
function createVaporwave(options2 = {}) {
  return generateArrangement({
    genre: "vaporwave",
    duration: "medium",
    energy: "chill",
    structure: "freeform",
    ...options2
  });
}
function chopAndScrew(durationMs, intensity = 0.7) {
  return generateChopAndScrew(durationMs, intensity);
}
function getGenreChords(genre, key = "C", octave = 3) {
  const profile = GENRE_PROFILES[genre];
  const chordTypes = profile.preferredChords;
  return chordTypes.slice(0, 4).map((type) => ({
    name: `${key}${type}`,
    frequencies: getChordFrequencies(key, type, octave)
  }));
}
function getGenreScale(genre, key = "C", octave = 4) {
  const profile = GENRE_PROFILES[genre];
  const scaleName = profile.preferredScales[0];
  return getScaleFrequencies(key, scaleName, octave);
}
function getGenreRhythm(genre, element = "kick") {
  switch (genre) {
    case "lofi":
      if (element === "kick") return euclidean(3, 16);
      if (element === "snare") return [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0];
      return euclidean(8, 16);
    case "breakcore":
      return euclidean(7 + Math.floor(Math.random() * 5), 16);
    case "cottagecore":
      if (element === "kick") return euclidean(2, 8);
      return euclidean(4, 8);
    case "frutiger":
      if (element === "kick") return [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];
      return euclidean(8, 16);
    default:
      return euclidean(4, 16);
  }
}

exports.AMEN_SLICES = AMEN_SLICES;
exports.AffectEngine = AffectEngine;
exports.AffectiveSynth = AffectiveSynth;
exports.AffectiveSynthV2 = AffectiveSynthV2;
exports.ArrangementEngine = ArrangementEngine;
exports.BASE_FREQ = BASE_FREQ;
exports.BREAKCORE_PATTERNS = BREAKCORE_PATTERNS;
exports.CHORDS = CHORDS;
exports.CHORD_EMOTIONS = CHORD_EMOTIONS;
exports.CHORD_SCALE = CHORD_SCALE;
exports.CIRCLE_OF_FIFTHS = CIRCLE_OF_FIFTHS;
exports.COTTAGECORE_PATTERNS = COTTAGECORE_PATTERNS;
exports.DJEngine = DJEngine;
exports.EUCLIDEAN_PATTERNS = EUCLIDEAN_PATTERNS;
exports.FIBONACCI = FIBONACCI;
exports.GENRE_PROFILES = GENRE_PROFILES;
exports.GenreEngine = GenreEngine;
exports.JazzEngine = JazzEngine;
exports.LOFI_PATTERNS = LOFI_PATTERNS;
exports.LOFI_PROGRESSIONS = LOFI_PROGRESSIONS;
exports.LOOKS = LOOKS;
exports.MusicTheory = MusicTheory;
exports.PHI = PHI;
exports.POLYRHYTHMS = POLYRHYTHMS;
exports.RhythmEngine = RhythmEngine;
exports.SCALES = SCALES;
exports.addFills = addFills;
exports.analyzeCompatibility = analyzeCompatibility;
exports.applySwing = applySwing;
exports.calculateBPM = calculateBPM;
exports.calculateStretchRatio = calculateStretchRatio;
exports.calculateTension = calculateTension;
exports.chopAndScrew = chopAndScrew;
exports.comp = comp;
exports.createAffectiveSynth = createAffectiveSynth;
exports.createBreakcore = createBreakcore;
exports.createCottagecore = createCottagecore;
exports.createFrutigerAero = createFrutigerAero;
exports.createLofiBeat = createLofiBeat;
exports.createVaporwave = createVaporwave;
exports.enclosure = enclosure;
exports.euclidean = euclidean;
exports.fibonacciRhythm = fibonacciRhythm;
exports.findMixPoint = findMixPoint;
exports.freqToMidi = freqToMidi;
exports.generateArrangement = generateArrangement;
exports.generateBassLine = generateBassLine;
exports.generateBeatGrid = generateBeatGrid;
exports.generateBreakcoreChops = generateBreakcoreChops;
exports.generateChopAndScrew = generateChopAndScrew;
exports.generateChopPoints = generateChopPoints;
exports.generateEffectChain = generateEffectChain;
exports.generateMelody = generateMelody;
exports.generateMix = generateMix;
exports.generateProgression = generateProgression;
exports.generateRhythm = generateRhythm;
exports.generateScratch = generateScratch;
exports.generateSection = generateSection;
exports.generateStutter = generateStutter;
exports.generateTapeStop = generateTapeStop;
exports.generateTransition = generateTransition;
exports.generateVariation = generateVariation;
exports.getActiveElements = getActiveElements;
exports.getChordFrequencies = getChordFrequencies;
exports.getChordFunction = getChordFunction;
exports.getConsonance = getConsonance;
exports.getGenreChords = getGenreChords;
exports.getGenreRhythm = getGenreRhythm;
exports.getGenreScale = getGenreScale;
exports.getHarmonics = getHarmonics;
exports.getLiveState = getLiveState;
exports.getRelativeKey = getRelativeKey;
exports.getScaleFrequencies = getScaleFrequencies;
exports.goldenGroove = goldenGroove;
exports.guideTones = guideTones;
exports.humanize = humanize;
exports.iiVI = iiVI;
exports.midiToFreq = midiToFreq;
exports.noteToFreq = noteToFreq;
exports.optimizeVoicing = optimizeVoicing;
exports.polyrhythm = polyrhythm;
exports.rearrangeSlices = rearrangeSlices;
exports.screwVocal = screwVocal;
exports.soloOverChanges = soloOverChanges;
exports.suggestNextChord = suggestNextChord;
exports.thoughtAmen = thoughtAmen;
exports.tradeFours = tradeFours;
exports.velocityVariation = velocityVariation;
exports.walkingBass = walkingBass;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map