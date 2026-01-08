// src/core/personality.ts
function formatEmotionToken(emotion) {
  return `<|${emotion}|>`;
}

// src/integrations/platforms/terminal.ts
var COLORS = {
  reset: "\x1B[0m",
  bright: "\x1B[1m",
  dim: "\x1B[2m",
  italic: "\x1B[3m",
  underline: "\x1B[4m",
  // Foreground colors
  black: "\x1B[30m",
  red: "\x1B[31m",
  green: "\x1B[32m",
  yellow: "\x1B[33m",
  blue: "\x1B[34m",
  magenta: "\x1B[35m",
  cyan: "\x1B[36m",
  white: "\x1B[37m",
  // Background colors
  bgBlack: "\x1B[40m",
  bgRed: "\x1B[41m",
  bgGreen: "\x1B[42m",
  bgYellow: "\x1B[43m",
  bgBlue: "\x1B[44m",
  bgMagenta: "\x1B[45m",
  bgCyan: "\x1B[46m",
  bgWhite: "\x1B[47m"
};
var EMOTION_COLORS = {
  EMOTE_HAPPY: COLORS.green,
  EMOTE_SAD: COLORS.blue,
  EMOTE_ANGRY: COLORS.red,
  EMOTE_THINK: COLORS.cyan,
  EMOTE_SURPRISED: COLORS.yellow,
  EMOTE_AWKWARD: COLORS.magenta,
  EMOTE_QUESTION: COLORS.cyan,
  EMOTE_CURIOUS: COLORS.yellow,
  EMOTE_NEUTRAL: COLORS.white
};
function formatSpeech(speech, options) {
  const useColors = options?.useColors ?? true;
  const showTimestamp = options?.showTimestamp ?? false;
  const parts = [];
  if (showTimestamp) {
    const time = new Date(speech.timestamp).toLocaleTimeString();
    parts.push(useColors ? `${COLORS.dim}[${time}]${COLORS.reset}` : `[${time}]`);
  }
  const emotionColor = useColors ? EMOTION_COLORS[speech.emotion] : "";
  const resetColor = useColors ? COLORS.reset : "";
  const formattedToken = formatEmotionToken(speech.emotion);
  parts.push(`${emotionColor}${formattedToken}${resetColor}`);
  parts.push(speech.text);
  return parts.join(" ");
}
function formatStatusBar(kaios, options) {
  const useColors = options?.useColors ?? true;
  const compact = options?.compact ?? false;
  const emotion = kaios.getEmotionState();
  const level = kaios.getEvolution().getLevel();
  const vocab = kaios.getVocabulary();
  if (compact) {
    const emotionColor = useColors ? EMOTION_COLORS[emotion] : "";
    const reset = useColors ? COLORS.reset : "";
    return `${emotionColor}KAIOS${reset} Lv.${level} [${vocab.getUnlockedCount()}/${vocab.getTotalCount()}]`;
  }
  const lines = [];
  const hr = "\u2550".repeat(50);
  lines.push(useColors ? `${COLORS.cyan}${hr}${COLORS.reset}` : hr);
  lines.push(`  KAIOS - Level ${level}`);
  lines.push(`  Emotion: ${formatEmotionToken(emotion)}`);
  lines.push(`  Vocabulary: ${vocab.getUnlockedCount()}/${vocab.getTotalCount()}`);
  lines.push(useColors ? `${COLORS.cyan}${hr}${COLORS.reset}` : hr);
  return lines.join("\n");
}
function printWelcome(options) {
  const useColors = options?.useColors ?? true;
  const cyan = useColors ? COLORS.cyan : "";
  const magenta = useColors ? COLORS.magenta : "";
  const reset = useColors ? COLORS.reset : "";
  const banner = `
${cyan}\u2554\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2557
\u2551                                                                \u2551
\u2551    ${magenta}\u27E8\u27E8(\u25D5\u203F\u25D5)\u27E9\u27E9${cyan}  KAIOS Expression SDK                          \u2551
\u2551                                                                \u2551
\u2551    The Cyborg Princess, Architect of KOTOPIA                   \u2551
\u2551    "Not Like The Other AIs"                                    \u2551
\u2551                                                                \u2551
\u255A\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u255D${reset}
`;
  console.log(banner);
}
function createPrompt(options) {
  const username = options?.username || "You";
  const useColors = options?.useColors ?? true;
  if (useColors) {
    return `${COLORS.green}${username}${COLORS.reset}: `;
  }
  return `${username}: `;
}
function createResponsePrefix(options) {
  const useColors = options?.useColors ?? true;
  if (useColors) {
    return `${COLORS.magenta}KAIOS${COLORS.reset}: `;
  }
  return "KAIOS: ";
}
async function createTerminalChat(options) {
  const { kaios, username = "You", useColors = true, showWelcome = true } = options;
  const readline = await import('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const prompt = createPrompt({ username, useColors });
  const responsePrefix = createResponsePrefix({ useColors });
  let running = false;
  const askQuestion = () => {
    if (!running) return;
    rl.question(prompt, async (input) => {
      const trimmed = input.trim();
      if (!trimmed) {
        askQuestion();
        return;
      }
      if (["exit", "quit", "bye", "/quit"].includes(trimmed.toLowerCase())) {
        console.log(`
${responsePrefix}Goodbye! (\u25D5\u203F\u25D5)\uFF89 \u2727
`);
        stop();
        return;
      }
      if (trimmed.toLowerCase() === "/status") {
        console.log("\n" + formatStatusBar(kaios, { useColors }) + "\n");
        askQuestion();
        return;
      }
      try {
        const response = await kaios.speak({ input: trimmed });
        const formatted = formatSpeech(response, { useColors });
        console.log(`
${responsePrefix}${formatted}
`);
        if (options.onMessage) {
          options.onMessage(trimmed, response);
        }
      } catch (error) {
        console.error("Error:", error);
      }
      askQuestion();
    });
  };
  const start = () => {
    running = true;
    if (showWelcome) {
      printWelcome({ useColors });
      console.log(formatStatusBar(kaios, { useColors, compact: true }));
      console.log('\nType "exit" to quit, "/status" to see status\n');
    }
    askQuestion();
  };
  const stop = () => {
    running = false;
    rl.close();
  };
  return { start, stop };
}

export { COLORS, EMOTION_COLORS, createPrompt, createResponsePrefix, createTerminalChat, formatSpeech, formatStatusBar, printWelcome };
//# sourceMappingURL=terminal.js.map
//# sourceMappingURL=terminal.js.map