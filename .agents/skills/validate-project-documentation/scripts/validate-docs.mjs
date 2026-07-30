import { execFileSync } from 'node:child_process'
import { existsSync, readFileSync } from 'node:fs'
import { dirname, extname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, '../../../..')
const errors = []

const canonicalRepository = 'https://github.com/deandrenn2/dock-buttons'
const canonicalDemo = 'https://deandrenn2.github.io/dock-buttons/'

const requiredFiles = [
  'README.md',
  'AGENTS.md',
  'packages/core/README.md',
  'packages/core/package.json',
  'packages/shadcn/README.md',
  'packages/shadcn/package.json',
  'apps/demo/vite.config.ts',
  'apps/demo/public/404.html',
  'openspec/specs/demo-base-path/spec.md',
  '.github/workflows/release.yml',
]

const read = (relativePath) => {
  const absolutePath = join(repoRoot, relativePath)
  if (!existsSync(absolutePath)) {
    errors.push(`Missing required documentation file: ${relativePath}`)
    return ''
  }
  return readFileSync(absolutePath, 'utf8')
}

for (const file of requiredFiles) read(file)

const packageExpectations = [
  ['packages/core/package.json', '@deandre-dock/buttons'],
  ['packages/shadcn/package.json', '@deandre-dock/buttons-shadcn'],
]

for (const [file, expectedName] of packageExpectations) {
  const contents = read(file)
  if (!contents) continue

  const packageJson = JSON.parse(contents)
  if (packageJson.name !== expectedName) {
    errors.push(`${file}: expected package name ${expectedName}`)
  }
  if (packageJson.homepage !== canonicalDemo) {
    errors.push(`${file}: homepage must be ${canonicalDemo}`)
  }
  if (packageJson.repository?.url !== `${canonicalRepository}.git`) {
    errors.push(`${file}: repository.url must be ${canonicalRepository}.git`)
  }
}

const coreReadme = read('packages/core/README.md')
const shadcnReadme = read('packages/shadcn/README.md')
for (const [file, contents] of [
  ['packages/core/README.md', coreReadme],
  ['packages/shadcn/README.md', shadcnReadme],
]) {
  for (const prop of ['layout', 'align', 'sessionStorageKey']) {
    if (!contents.includes(`\`${prop}\``)) {
      errors.push(`${file}: missing ButtonDock prop documentation for ${prop}`)
    }
  }
}

const viteConfig = read('apps/demo/vite.config.ts')
if (!viteConfig.includes("'/dock-buttons/'")) {
  errors.push("apps/demo/vite.config.ts: production base must include '/dock-buttons/'")
}

const spaFallback = read('apps/demo/public/404.html')
if (!spaFallback.includes("var base = '/dock-buttons'")) {
  errors.push("apps/demo/public/404.html: SPA fallback must use '/dock-buttons'")
}

const releaseWorkflow = read('.github/workflows/release.yml')
if (!releaseWorkflow.includes('id-token: write')) {
  errors.push('.github/workflows/release.yml: npm Trusted Publishing requires id-token: write')
}
if (!releaseWorkflow.includes('publish: pnpm changeset publish')) {
  errors.push('.github/workflows/release.yml: expected Changesets publish command')
}

const activeExtensions = new Set(['.md', '.json', '.yml', '.yaml', '.ts', '.tsx', '.js', '.html'])
const activeFiles = execFileSync('git', ['ls-files', '-z'], {
  cwd: repoRoot,
  encoding: 'utf8',
})
  .split('\0')
  .filter(Boolean)
  .filter(
    (file) =>
      !file.startsWith('openspec/changes/archive/') &&
      activeExtensions.has(extname(file)) &&
      !file.endsWith('CHANGELOG.md'),
  )

const oldRepositoryPattern = /https:\/\/github\.com\/deandrenn2\/dock(?!-buttons)(?:\.git|\/|$)/
const oldDemoPattern = /https:\/\/deandrenn2\.github\.io\/dock(?!-buttons)(?:\/|$)/

for (const file of activeFiles) {
  const contents = readFileSync(join(repoRoot, file), 'utf8')
  if (oldRepositoryPattern.test(contents)) {
    errors.push(`${file}: references the former deandrenn2/dock repository`)
  }
  if (oldDemoPattern.test(contents)) {
    errors.push(`${file}: references the former /dock/ GitHub Pages URL`)
  }
}

const markdownFiles = activeFiles.filter((file) => file.endsWith('.md'))
const markdownLinkPattern = /\[[^\]]*]\(([^)]+)\)/g

for (const file of markdownFiles) {
  const contents = readFileSync(join(repoRoot, file), 'utf8')
  for (const match of contents.matchAll(markdownLinkPattern)) {
    const target = match[1].trim().replace(/^<|>$/g, '')
    if (
      !target ||
      target.startsWith('#') ||
      /^[a-z][a-z\d+.-]*:/i.test(target) ||
      target.includes('{{')
    ) {
      continue
    }

    const localTarget = decodeURIComponent(target.split('#')[0].split('?')[0])
    if (!localTarget) continue

    const resolvedTarget = resolve(repoRoot, dirname(file), localTarget)
    if (!existsSync(resolvedTarget)) {
      errors.push(`${file}: local link target does not exist: ${target}`)
    }
  }
}

if (errors.length > 0) {
  console.error('Documentation validation failed:')
  for (const error of errors) console.error(`- ${error}`)
  process.exit(1)
}

console.log(
  `Documentation validation passed (${activeFiles.length} active files, ${markdownFiles.length} Markdown files).`,
)
