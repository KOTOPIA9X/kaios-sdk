import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdtempSync, readFileSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { build } from 'esbuild'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const temporary = mkdtempSync(join(tmpdir(), 'kaios-package-check-'))
const run = (file, args, cwd = temporary) => execFileSync(file, args, {cwd, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 120000})
try {
  const [packed] = JSON.parse(run('npm', ['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], root))
  const paths = new Set(packed.files.map(file => file.path))
  assert.ok(![...paths].some(path => /(^|\/)(\.env|private|node_modules|\.git)(\/|$)/.test(path)))
  assert.ok(![...paths].some(path => path.startsWith('docs/archive/')), 'Historical prompts are preserved in Git, not shipped in the package')
  run('npm', ['init', '--yes'])
  run('npm', ['install', '--ignore-scripts', '--no-audit', '--no-fund', join(temporary, packed.filename)])
  const packageRoot = join(temporary, 'node_modules/@kaios/expression-sdk')
  const manifest = JSON.parse(readFileSync(join(packageRoot, 'package.json'), 'utf8'))
  const specifiers = []
  for (const [subpath, conditions] of Object.entries(manifest.exports)) {
    if (typeof conditions === 'string') continue
    const specifier = manifest.name + (subpath === '.' ? '' : subpath.slice(1))
    specifiers.push(specifier)
    for (const format of ['import', 'require']) {
      for (const destination of Object.values(conditions[format])) {
        assert.ok(existsSync(join(packageRoot, destination)), `${specifier}: missing ${destination}`)
      }
    }
  }
  const modules = JSON.stringify(specifiers)
  run(process.execPath, ['--input-type=module', '-e', `for (const s of ${modules}) await import(s);`])
  run(process.execPath, ['-e', `for (const s of ${modules}) require(s);`])
  for (const extension of ['mts', 'cts']) {
    const source = specifiers.map((specifier, i) => `import * as module${i} from '${specifier}'; void module${i};`).join('\n')
    const file = join(temporary, `consumer.${extension}`)
    writeFileSync(file, source)
    run(process.execPath, [join(root, 'node_modules/typescript/bin/tsc'), '--ignoreConfig', '--noEmit', '--module', 'NodeNext', '--moduleResolution', 'NodeNext', '--target', 'ES2022', '--skipLibCheck', file])
  }
  const portable = ['runtime', 'character', 'kaimoji', 'affect', 'voice', 'spine', 'audio/intelligence', 'audio/web']
  await build({
    stdin: {contents: portable.map((subpath, i) => `import * as m${i} from '${manifest.name}/${subpath}'; console.log(m${i});`).join('\n'), resolveDir: temporary},
    bundle: true, write: false, platform: 'browser', format: 'esm', logLevel: 'silent',
  })
  console.log(`Packed ${manifest.version}: ${specifiers.length} ESM + CommonJS entries and both declaration paths resolve; ${portable.length} portable entries bundle for browsers.`)
} finally {
  rmSync(temporary, {recursive: true, force: true})
}
