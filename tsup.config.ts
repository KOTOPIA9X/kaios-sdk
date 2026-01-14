import { defineConfig } from 'tsup'

export default defineConfig({
  entry: {
    'index': 'src/index.ts',
    'integrations/platforms/terminal': 'src/integrations/platforms/terminal.ts',
    'integrations/platforms/web': 'src/integrations/platforms/web.ts',
    'integrations/platforms/game': 'src/integrations/platforms/game.ts',
    'integrations/platforms/discord': 'src/integrations/platforms/discord.ts',
    'integrations/llm/index': 'src/integrations/llm/index.ts',
    'audio/index': 'src/audio/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: true,
  splitting: true,
  clean: true,
  treeshake: true,
  minify: false,
  sourcemap: true,
  target: 'es2022',
  outDir: 'dist',
  external: [
    '@anthropic-ai/sdk',
    '@supabase/supabase-js',
    'openai',
    'discord.js',
    'three'
  ],
  esbuildOptions(options) {
    options.banner = {
      js: '// KAIOS Expression SDK - Not Like The Other AIs',
    }
  }
})
