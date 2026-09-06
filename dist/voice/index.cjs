'use strict';

// src/voice/index.ts
function createNullVoiceAdapter(reason = "No voice adapter is connected") {
  return Object.freeze({
    id: "null",
    capabilities: Object.freeze({ speech: false, singing: false, streaming: false, affect: false }),
    async speak(request) {
      return request.signal?.aborted ? { status: "cancelled" } : { status: "unavailable", reason };
    }
  });
}
function validRequest(request) {
  if (!request || typeof request.text !== "string" || !request.text.trim()) return false;
  if (request.mode !== void 0 && request.mode !== "speech" && request.mode !== "singing") return false;
  if (request.voiceId !== void 0 && (typeof request.voiceId !== "string" || !request.voiceId.trim())) return false;
  const affect = request.affect;
  if (affect !== void 0) {
    if (!affect || typeof affect !== "object") return false;
    for (const [key, min, max] of [["valence", -1, 1], ["arousal", 0, 1], ["energy", 0, 1]]) {
      const value = affect[key];
      if (key === "energy" && value === void 0) continue;
      if (typeof value !== "number" || !Number.isFinite(value) || value < min || value > max) return false;
    }
  }
  return request.signal === void 0 || typeof request.signal?.aborted === "boolean" && typeof request.signal.addEventListener === "function" && typeof request.signal.removeEventListener === "function";
}
function validResult(value) {
  if (!value || typeof value !== "object" || !("status" in value)) return false;
  switch (value.status) {
    case "played":
    case "cancelled":
      return true;
    case "unavailable":
      return "reason" in value && typeof value.reason === "string" && value.reason.trim().length > 0;
    case "error":
      return "message" in value && typeof value.message === "string" && value.message.trim().length > 0;
    case "ready": {
      if (!("audio" in value) || !value.audio || typeof value.audio !== "object") return false;
      const audio = value.audio;
      return "data" in audio && audio.data instanceof Uint8Array && audio.data.byteLength > 0 && "mimeType" in audio && typeof audio.mimeType === "string" && audio.mimeType.startsWith("audio/");
    }
    default:
      return false;
  }
}
function createVoice(adapter = createNullVoiceAdapter()) {
  if (!adapter || typeof adapter.id !== "string" || !adapter.id.trim() || typeof adapter.speak !== "function" || !adapter.capabilities || !["speech", "singing", "streaming", "affect"].every((key) => typeof adapter.capabilities[key] === "boolean"))
    throw new TypeError("A voice adapter needs an id, explicit capabilities, and a speak function");
  const capabilities = Object.freeze({ ...adapter.capabilities });
  return Object.freeze({
    id: adapter.id,
    capabilities,
    async speak(request) {
      if (!validRequest(request)) return { status: "error", message: "Invalid voice request" };
      if (request.signal?.aborted) return { status: "cancelled" };
      const mode = request.mode ?? "speech";
      if (!capabilities[mode]) return { status: "unavailable", reason: `Adapter ${adapter.id} does not support ${mode}` };
      if (request.affect && !capabilities.affect) return { status: "unavailable", reason: `Adapter ${adapter.id} does not support affect parameters` };
      let onAbort;
      const signal = request.signal;
      try {
        const cancelled = signal ? new Promise((resolve) => {
          onAbort = () => resolve({ status: "cancelled" });
          signal.addEventListener("abort", onAbort, { once: true });
        }) : void 0;
        const result = Promise.resolve(adapter.speak(request));
        const output = await (cancelled ? Promise.race([result, cancelled]) : result);
        if (signal?.aborted) return { status: "cancelled" };
        return validResult(output) ? output : { status: "error", message: "Voice adapter returned an invalid result" };
      } catch {
        if (signal?.aborted) return { status: "cancelled" };
        return { status: "error", message: "Voice adapter failed" };
      } finally {
        if (signal && onAbort) signal.removeEventListener("abort", onAbort);
      }
    }
  });
}

exports.createNullVoiceAdapter = createNullVoiceAdapter;
exports.createVoice = createVoice;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map