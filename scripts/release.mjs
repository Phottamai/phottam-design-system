/**
 * Version check + publish for every public workspace package (see .github/workflows).
 *
 *   node scripts/release.mjs --check             # fail if a package's version is already published
 *   node scripts/release.mjs --channel main      # check, then publish with dist-tag "latest"
 *   node scripts/release.mjs --channel develop   # check, then publish with dist-tag "develop"
 *   add --changed-since <git ref> to only consider packages with changes since that ref
 *
 * The version comes from the package's package.json, bumped by the pre-commit hook
 * (scripts/bump-version.mjs). If a changed package's version already exists on the registry,
 * nobody incremented it, and the run fails. Packages without changes are skipped.
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const DIST_TAGS = { main: 'latest', develop: 'develop' }

const run = (cmd, args, cwd, { quiet = false } = {}) =>
  execFileSync(cmd, args, {
    cwd,
    encoding: 'utf8',
    // quiet: capture stderr (e.g. the expected E404 for a first release) instead of printing it
    stdio: quiet ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'pipe', 'inherit']
  }).trim()

function publishedVersions(name) {
  try {
    const out = run('npm', ['view', name, 'versions', '--json'], ROOT, { quiet: true })
    const parsed = JSON.parse(out || '[]')
    return Array.isArray(parsed) ? parsed : [parsed]
  } catch (error) {
    // Never published yet.
    if (String(error.stderr ?? error.message).includes('E404')) return []
    throw error
  }
}

function packages() {
  const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
  return (rootPkg.workspaces ?? [])
    .map((dir) => {
      const pkgDir = path.join(ROOT, dir)
      return { pkgDir, ...JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8')) }
    })
    .filter((pkg) => !pkg.private)
}

/** Whether anything under the package changed since `ref` (no ref, or an unknown one, counts as changed). */
function changedSince(ref, pkgDir) {
  if (!ref || /^0+$/.test(ref)) return true
  try {
    const dir = path.relative(ROOT, pkgDir)
    return (
      run('git', ['diff', '--name-only', `${ref}...HEAD`, '--', dir], ROOT, { quiet: true }) !== ''
    )
  } catch {
    return true
  }
}

const argValue = (args, name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null)

function main() {
  const args = process.argv.slice(2)
  const checkOnly = args.includes('--check')
  const channel = argValue(args, '--channel')
  const since = argValue(args, '--changed-since')
  const tag = DIST_TAGS[channel]
  if (!checkOnly && !tag) {
    console.error(`Usage: release.mjs --check | --channel main|develop (got "${channel}")`)
    process.exit(1)
  }

  const pkgs = packages().filter((pkg) => {
    if (changedSince(since, pkg.pkgDir)) return true
    console.log(`⏭  ${pkg.name} has no changes since ${since}, skipping`)
    return false
  })
  const alreadyPublished = pkgs.filter((pkg) => publishedVersions(pkg.name).includes(pkg.version))

  if (alreadyPublished.length) {
    for (const pkg of alreadyPublished) {
      console.error(
        `❌ ${pkg.name}@${pkg.version} is already published. The version was not incremented.\n` +
          `   Commit with the pre-commit hook enabled (it bumps the patch version),\n` +
          `   or set a higher "version" in ${path.relative(ROOT, pkg.pkgDir)}/package.json.`
      )
    }
    process.exit(1)
  }

  for (const pkg of pkgs) {
    console.log(`✅ ${pkg.name}@${pkg.version} is not published yet`)
  }
  if (checkOnly) return

  const released = []
  for (const pkg of pkgs) {
    console.log(`📦 Publishing ${pkg.name}@${pkg.version} (dist-tag: ${tag})`)
    run('npm', ['publish', '--tag', tag], pkg.pkgDir)
    released.push({ name: pkg.name, version: pkg.version, tag })
  }

  if (process.env.GITHUB_OUTPUT) {
    fs.appendFileSync(process.env.GITHUB_OUTPUT, `released=${JSON.stringify(released)}\n`)
  }
}

main()
