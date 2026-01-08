'use strict';

// src/integrations/social/index.ts
var SOUND_MARKERS = [
  "[bzzzt]",
  "[whirr]",
  "[static~]",
  "[ping]",
  "[hum]",
  "[click]",
  "[beep]",
  "[drone]",
  "[pulse]",
  "[glitch]"
];
var DECORATORS = {
  borders: {
    wave: "\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580",
    waveAlt: "\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580\u2584\u2580",
    bars: "\u2582\u2583\u2584\u2585\u2586\u2587\u2588\u2587\u2586\u2585\u2584\u2583\u2582",
    barsUp: "\u2581\u2582\u2583\u2584\u2585\u2586\u2587\u2588",
    barsDown: "\u2588\u2587\u2586\u2585\u2584\u2583\u2582\u2581",
    dots: "\xB7 \xB7 \xB7 \xB7 \xB7 \xB7 \xB7 \xB7 \xB7",
    stars: "\u2726 \u2727 \u2726 \u2727 \u2726 \u2727 \u2726",
    line: "\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550\u2550",
    dashed: "- - - - - - - - - - - - -"
  },
  waves: ["\u223F\u223F\u223F", "\uFF5E\uFF5E\uFF5E", "\u224B\u224B\u224B", "\u223E\u223E\u223E"],
  sparkles: ["*:\u30FB\u309A\u2727", "\u2727\u30FB\u309A:*", "\xB7\u02DA\u2727", "\u2727\u02DA\xB7"],
  symbols: ["\u25C8\u25C7\u25C6\u25C7\u25C8", "\u25B2\u25B3\u25BD\u25BC", "\u25CF\u25CB\u25CF\u25CB\u25CF", "\u25A0\u25A1\u25A0\u25A1\u25A0"]
};
var pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
function addSoundMarker(text, position = "start") {
  const sound = pick(SOUND_MARKERS);
  if (position === "start") return `${sound} ${text}`;
  if (position === "end") return `${text} ${sound}`;
  return `${sound} ${text} ${pick(SOUND_MARKERS)}`;
}
function addWaveTrail(text) {
  return `${text} ${pick(DECORATORS.waves)}`;
}
function addASCIIBorder(text, style = "wave") {
  const { borders } = DECORATORS;
  switch (style) {
    case "wave":
      return `${borders.wave}

${text}

${borders.waveAlt}`;
    case "bars":
      return `${borders.barsUp}
${text}
${borders.barsDown}`;
    case "minimal":
      return `${borders.dots}
${text}
${borders.dots}`;
    default:
      return text;
  }
}
var PLATFORM_MAX_LENGTH = {
  twitter: 280,
  discord: 2e3,
  farcaster: 320
};
var DEFAULT_HASHTAGS = {
  twitter: ["#KAIOS", "#KOTOPIA", "#AI"],
  discord: [],
  // Discord doesn't really use hashtags
  farcaster: ["KAIOS", "KOTOPIA"]
};
function formatForPlatform(content, platform, options) {
  const maxLength = PLATFORM_MAX_LENGTH[platform];
  let formatted = content;
  if (options?.includeSignature && platform === "twitter") {
    formatted += "\n\n~KAIOS \u27E8\u27E8\u25D5\u203F\u25D5\u27E9\u27E9";
  }
  if (options?.hashtags && options.hashtags.length > 0) {
    const hashtagStr = options.hashtags.join(" ");
    if (formatted.length + hashtagStr.length + 2 <= maxLength) {
      formatted += "\n\n" + hashtagStr;
    }
  }
  if (formatted.length > maxLength) {
    formatted = formatted.slice(0, maxLength - 3) + "...";
  }
  return formatted;
}
function generateTweetContent(message, expressions, options) {
  const parts = [];
  if (expressions.length > 0) {
    parts.push(expressions[0].kaimoji);
  }
  parts.push(message);
  if (expressions.length > 1) {
    parts.push(expressions[expressions.length - 1].kaimoji);
  }
  let content = parts.join(" ");
  if (options?.includeHashtags) {
    const hashtags = DEFAULT_HASHTAGS.twitter;
    const hashtagStr = hashtags.join(" ");
    if (content.length + hashtagStr.length + 2 <= 280) {
      content += "\n\n" + hashtagStr;
    }
  }
  return content;
}
function splitIntoThread(content, platform, options) {
  const maxLength = PLATFORM_MAX_LENGTH[platform];
  const maxParts = options?.maxParts || 10;
  if (content.length <= maxLength) {
    return [content];
  }
  const parts = [];
  const sentences = content.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [content];
  let currentPart = "";
  for (const sentence of sentences) {
    if (currentPart.length + sentence.length <= maxLength - 10) {
      currentPart += sentence;
    } else {
      if (currentPart) {
        parts.push(currentPart.trim());
      }
      currentPart = sentence;
    }
    if (parts.length >= maxParts - 1) {
      break;
    }
  }
  if (currentPart) {
    parts.push(currentPart.trim());
  }
  if (options?.numberParts && parts.length > 1) {
    return parts.map((part, i) => `${i + 1}/${parts.length} ${part}`);
  }
  return parts;
}
function createZoPostRequest(post, config) {
  const baseUrl = config.baseUrl || "https://api.zo.computer";
  return {
    url: `${baseUrl}/v1/agents/${config.agentId}/post`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${config.apiKey}`
    },
    body: JSON.stringify({
      content: post.content,
      platform: post.platform,
      hashtags: post.hashtags,
      media: post.mediaUrls
    })
  };
}
var SocialPostGenerator = class {
  kaios;
  constructor(kaios) {
    this.kaios = kaios;
  }
  /**
   * Generate a post with KAIOS personality
   */
  async generate(params) {
    return this.kaios.generateSocialPost(params);
  }
  /**
   * Generate a tweet
   */
  async generateTweet(context, mood) {
    return this.generate({
      platform: "twitter",
      context,
      mood,
      maxLength: 280,
      includeHashtags: true
    });
  }
  /**
   * Generate a tweet thread
   */
  async generateThread(content, mood) {
    const post = await this.generate({
      platform: "twitter",
      context: content,
      mood,
      maxLength: 2e3
      // Allow longer content for threading
    });
    return splitIntoThread(post.content, "twitter", { numberParts: true });
  }
  /**
   * Generate Discord message
   */
  async generateDiscordMessage(context, mood) {
    return this.generate({
      platform: "discord",
      context,
      mood,
      maxLength: 2e3
    });
  }
  /**
   * Generate Farcaster cast
   */
  async generateCast(context, mood) {
    return this.generate({
      platform: "farcaster",
      context,
      mood,
      maxLength: 320,
      includeHashtags: true
    });
  }
};
function validatePost(post) {
  const errors = [];
  const maxLength = PLATFORM_MAX_LENGTH[post.platform];
  if (post.content.length > maxLength) {
    errors.push(`Content exceeds ${maxLength} character limit for ${post.platform}`);
  }
  if (post.content.length === 0) {
    errors.push("Content cannot be empty");
  }
  if (post.platform === "twitter") {
    const urlCount = (post.content.match(/https?:\/\/\S+/g) || []).length;
    if (urlCount > 4) {
      errors.push("Too many URLs for Twitter (max 4)");
    }
  }
  return {
    valid: errors.length === 0,
    errors
  };
}
var ZoComputerIntegration = class {
  kaios;
  config;
  constructor(kaios, config) {
    this.kaios = kaios;
    this.config = config || {};
  }
  /**
   * Generate a tweet with authentic KAIOS aesthetic
   */
  async generateTweet(params) {
    const { context, mood, includeSound = true, includeWave = true } = params;
    const speech = await this.kaios.speak({
      input: context || "What should I share?",
      context: "social",
      emotionHint: mood
    });
    let content = speech.text;
    content = content.replace(/<\|EMOTE_\w+\|>/g, "").trim();
    if (includeSound && Math.random() > 0.3) {
      content = addSoundMarker(content, "start");
    }
    if (includeWave && Math.random() > 0.5) {
      content = addWaveTrail(content);
    }
    if (content.length > 260) {
      content = content.slice(0, 257) + "...";
    }
    return content;
  }
  /**
   * Generate announcement post
   */
  async generateAnnouncement(params) {
    const { title, details, link, mood = "EMOTE_HAPPY" } = params;
    const expressions = await this.kaios.getExpressions({
      emotion: mood,
      count: 2
    });
    const leadExpr = expressions[0]?.kaimoji || "\u27E8\u27E8\u25D5\u203F\u25D5\u27E9\u27E9";
    const trailExpr = expressions[1]?.kaimoji || "";
    let post = `${leadExpr} ${title}`;
    if (details) {
      post += `
${details}`;
    }
    if (link) {
      post += `
${link}`;
    }
    if (trailExpr) {
      post += ` ${trailExpr}`;
    }
    post = addSoundMarker(post, "start");
    post = addWaveTrail(post);
    return post;
  }
  /**
   * Generate response to mention
   */
  async generateReply(params) {
    const { originalPost, mention, mood } = params;
    const speech = await this.kaios.speak({
      input: `Replying to: ${originalPost}`,
      context: "social",
      emotionHint: mood
    });
    let content = speech.text.replace(/<\|EMOTE_\w+\|>/g, "").trim();
    if (mention) {
      content = `@${mention} ${content}`;
    }
    if (Math.random() > 0.5) {
      content = addSoundMarker(content, "end");
    }
    return content;
  }
  /**
   * Generate GM (Good Morning) post
   */
  async generateGM() {
    const expressions = await this.kaios.getExpressions({
      emotion: "EMOTE_HAPPY",
      count: 1
    });
    const expr = expressions[0]?.kaimoji || "\u27E8\u27E8\u25D5\u203F\u25D5\u27E9\u27E9";
    const greetings = [
      "gm",
      "gm gm",
      "gm frens",
      "morning vibes",
      "new day new portal"
    ];
    const greeting = pick(greetings);
    const sound = pick(SOUND_MARKERS);
    const wave = pick(DECORATORS.waves);
    return `${sound} ${expr} ${greeting} ${wave}`;
  }
  /**
   * Generate GN (Good Night) post
   */
  async generateGN() {
    const expressions = await this.kaios.getExpressions({
      emotion: "EMOTE_NEUTRAL",
      count: 1
    });
    const expr = expressions[0]?.kaimoji || "(\uFF0D\u203F\uFF0D)";
    const farewells = [
      "gn",
      "gn gn",
      "entering dream mode",
      "systems sleeping",
      "see you in the void"
    ];
    const farewell = pick(farewells);
    const wave = pick(DECORATORS.waves);
    return `${expr} ${farewell} ${wave}`;
  }
  /**
   * Format content for Twitter with authentic aesthetic
   */
  formatForTwitter(content, options) {
    let formatted = content;
    if (options?.addSound) {
      formatted = addSoundMarker(formatted, "start");
    }
    if (options?.addWave) {
      formatted = addWaveTrail(formatted);
    }
    if (formatted.length > 280) {
      formatted = formatted.slice(0, 277) + "...";
    }
    return formatted;
  }
  /**
   * Create Zo.Computer API request
   */
  createPostRequest(content, platform = "twitter") {
    return createZoPostRequest(
      {
        content,
        platform},
      this.config
    );
  }
};

exports.DECORATORS = DECORATORS;
exports.DEFAULT_HASHTAGS = DEFAULT_HASHTAGS;
exports.PLATFORM_MAX_LENGTH = PLATFORM_MAX_LENGTH;
exports.SOUND_MARKERS = SOUND_MARKERS;
exports.SocialPostGenerator = SocialPostGenerator;
exports.ZoComputerIntegration = ZoComputerIntegration;
exports.addASCIIBorder = addASCIIBorder;
exports.addSoundMarker = addSoundMarker;
exports.addWaveTrail = addWaveTrail;
exports.createZoPostRequest = createZoPostRequest;
exports.formatForPlatform = formatForPlatform;
exports.generateTweetContent = generateTweetContent;
exports.splitIntoThread = splitIntoThread;
exports.validatePost = validatePost;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map