export { E as EmotionSystem, K as KAIMOJI_LIBRARY, g as getAllKaimoji, a as getKaimojiByCategory, b as getKaimojiByContext, c as getKaimojiByEnergyRange, d as getKaimojiByRarity, e as getKaimojiBySoundProfile, f as getKaimojiUnlockableAtLevel, h as getLibraryStats, i as getRandomKaimoji, j as getSignatureKaimoji, s as searchKaimojiByTag } from '../kaimoji-library-BJBf3DN3.cjs';
export { e as emotionToKaomoji, i as isValidEmotion, p as parseResponse } from '../parseEmotions-BUWaGnhq.cjs';
export { h as EmotionState, E as EmotionToken, g as Kaimoji, i as KaimojiCategory, a as KaimojiContext } from '../types-0SKyQiZK.cjs';
import '../spine/spine-adapter.cjs';

/**
 * Portable Kaimoji face grammar, adapted from Koto's internal expression prototype
 * (source revision 37a8c87831d9f7369c7de1c10de4ee002763e6b0).
 * No corpus, frequencies, database, model, network, randomness or normalization.
 * See docs/api/kaimoji.md for provenance and intentional differences.
 */
type FaceParseFailure = 'empty' | 'too-long' | 'invalid-unicode' | 'prose' | 'malformed-frame' | 'unsupported-core';
interface FaceLayer {
    readonly l: string;
    readonly r: string;
    readonly kind: 'mirror' | 'twin';
    /** Exact interior whitespace/format characters; each side is independent. */
    readonly gapL: string;
    readonly gapR: string;
}
interface FaceParse {
    readonly face: string;
    readonly ok: boolean;
    readonly reason?: FaceParseFailure;
    readonly armL: string;
    readonly armR: string;
    readonly layers: readonly FaceLayer[];
    readonly eyeL: string;
    readonly eyeR: string;
    readonly mouth: string;
    readonly spacing: {
        readonly beforeMouth: string;
        readonly afterMouth: string;
    };
}
interface FaceOverrides {
    eyeL?: string;
    eyeR?: string;
    mouth?: string;
    addFlank?: readonly [string, string];
}
interface FaceParts {
    eyeL: string;
    mouth: string;
    eyeR: string;
    bracket?: readonly [string, string];
    space?: string;
    prefix?: string;
    suffix?: string;
}
/** Exact grapheme segmentation. Does not trim, normalize or remove characters. */
declare function segmentFace(face: string): string[];
/** Bounded structural parser, not a universal face detector. Unrecognized input is retained. */
declare function parseFace(face: string): FaceParse;
/** Rebuild recognized structure. With no overrides this is exact, including trivia. */
declare function rebuildFace(parsed: FaceParse, overrides?: FaceOverrides): string;
/** Compose explicit slots. This formats text; it does not certify a valid parse or meaning. */
declare function composeFace(parts: FaceParts): string;
declare const FACE_OPERATIONS: readonly ["cry", "blush", "cat", "calm", "love", "sparkle"];
type FaceOperation = (typeof FACE_OPERATIONS)[number];
interface FaceTransformResult {
    text: string;
    changed: boolean;
    reason?: FaceParseFailure | 'already-applied';
}
/** Deterministic slot operations. Unsupported text is returned unchanged with a reason. */
declare function transformFace(face: string, operation: FaceOperation): FaceTransformResult;
type FaceEmotion = 'joy' | 'love' | 'sad' | 'excited' | 'smug' | 'shy' | 'sleepy' | 'angry' | 'surprised' | 'cozy' | 'pleading' | 'neutral';
type FaceAffectResult = {
    status: 'mapped';
    method: 'authored-parts-v1';
    emotion: FaceEmotion;
    valence: number;
    arousal: number;
    coverage: 'eyes-and-mouth' | 'eyes' | 'mouth';
} | {
    status: 'unmapped';
    reason: 'unparsed' | 'unknown-parts';
};
/** Authored compositional mapping, not a measured emotion or a probabilistic confidence. */
declare function composeFaceAffect(face: string): FaceAffectResult;

export { FACE_OPERATIONS, type FaceAffectResult, type FaceEmotion, type FaceLayer, type FaceOperation, type FaceOverrides, type FaceParse, type FaceParseFailure, type FaceParts, type FaceTransformResult, composeFace, composeFaceAffect, parseFace, rebuildFace, segmentFace, transformFace };
