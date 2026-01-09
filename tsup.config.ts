import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'integrations/platforms/terminal': 'src/integrations/platforms/terminal.ts',
    'integrations/platforms/web': 'src/integrations/platforms/web.ts',
    'integrations/platforms/game': 'src/integrations/platforms/game.ts',
    'integrations/platforms/discord': 'src/integrations/platforms/discord.ts',
    'integrations/social/index': 'src/integrations/social/index.ts',
    'audio/index': 'src/audio/index.ts',
    'llm/index': 'src/llm/index.ts',
    'consciousness/index': 'src/consciousness/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  splitting: false,
  treeshake: true,
  minify: false,
  external: [
    '@anthropic-ai/sdk',
    'openai',
    'discord.js',
    'three',
    'tone',
    'readline'
  ],
  esbuildOptions(options) {
    options.platform = 'node'
  }
})
