import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    "index": "src/index.ts",
    "runtime/index": "src/runtime/index.ts",
    "character/index": "src/character/index.ts",
    "kaimoji/index": "src/kaimoji/index.ts",
    "affect/index": "src/affect/index.ts",
    "voice/index": "src/voice/index.ts",
    "spine/spine-adapter": "src/spine/spine-adapter.ts",
    "audio/intelligence/index": "src/audio/intelligence/index.ts",
    "audio/web/webaudio-synth": "src/audio/web/webaudio-synth.ts",
    "integrations/platforms/terminal": "src/integrations/platforms/terminal.ts",
    "integrations/platforms/web": "src/integrations/platforms/web.ts",
    "integrations/platforms/game": "src/integrations/platforms/game.ts",
    "integrations/platforms/discord": "src/integrations/platforms/discord.ts",
    "audio/index": "src/audio/index.ts",
    "integrations/social/index": "src/integrations/social/index.ts",
    "llm/index": "src/llm/index.ts",
    "audio/terminal/index": "src/audio/terminal/index.ts",
    "consciousness/index": "src/consciousness/index.ts"
},
  format: ['esm', 'cjs'],
  dts: { compilerOptions: { ignoreDeprecations: '6.0' } },
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  platform: 'node',
  external: ['discord.js', 'three', 'tone'],
})
