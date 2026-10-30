/**
 * Pre-commit hook (.husky/pre-commit): bumps the patch version of every package that has staged changes.
 *
 * Bumps once per branch: if the package's version is already ahead of the versions on
 * origin/main and origin/develop, it was bumped by an earlier commit and is left alone.
 * A package that doesn't exist on either remote branch yet is new, so its version is kept.
 * The new version is written to the package's package.json and to package-lock.json, and both are staged.
 *
 * Skip it for a single commit with SKIP_VERSION_BUMP=1 git commit ... (or git commit --no-verify).
 */
import { execFileSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const REMOTE_BRANCHES = ['origin/main', 'origin/develop']

// stderr is captured so expected misses (e.g. origin/develop not existing yet) don't print errors.
const git = (...args) =>
  execFileSync('git', args, {
    cwd: ROOT,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  }).trim()

const parse = (version) => {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version ?? '')
  return match ? match.slice(1, 4).map(Number) : null
}

const compare = (a, b) => {
  for (let i = 0; i < 3; i++) if (a[i] !== b[i]) return a[i] - b[i]
  return 0
}

/** Returns the version to commit, or null when no bump is needed. */
export function bumpedVersion(currentVersion, remoteVersions) {
  const current = parse(currentVersion)
  if (!current) throw new Error(`version "${currentVersion}" is not X.Y.Z`)
  // Not on the remote yet: a new package ships with the version it was created with.
  if (!remoteVersions.length) return null

  const remote = remoteVersions.map(parse).filter(Boolean).sort(compare).at(-1)
  if (remote && compare(current, remote) > 0) return null

  const base = remote && compare(remote, current) > 0 ? remote : current
  return [base[0], base[1], base[2] + 1].join('.')
}

function remoteVersion(branch, dir) {
  try {
    return JSON.parse(git('show', `${branch}:${dir}/package.json`)).version
  } catch {
    return null // branch or package doesn't exist on the remote yet
  }
}

function writeJson(file, data) {
  fs.writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`)
}

function main() {
  if (process.env.SKIP_VERSION_BUMP) return

  const rootPkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'))
  const staged = git('diff', '--cached', '--name-only').split('\n').filter(Boolean)

  for (const dir of rootPkg.workspaces ?? []) {
    const pkgFile = path.join(ROOT, dir, 'package.json')
    const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'))
    if (pkg.private) continue

    const changed = staged.some((file) => file.startsWith(`${dir}/`))
    if (!changed) continue

    const remoteVersions = REMOTE_BRANCHES.map((branch) => remoteVersion(branch, dir)).filter(
      Boolean
    )
    const next = bumpedVersion(pkg.version, remoteVersions)
    if (!next) {
      const reason = remoteVersions.length
        ? 'is already ahead of the remote'
        : 'is new (not on the remote yet)'
      console.log(`🔖 ${pkg.name}@${pkg.version} ${reason}, not bumping`)
      continue
    }

    pkg.version = next
    writeJson(pkgFile, pkg)

    const lockFile = path.join(ROOT, 'package-lock.json')
    if (fs.existsSync(lockFile)) {
      const lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'))
      if (lock.packages?.[dir]) {
        lock.packages[dir].version = next
        writeJson(lockFile, lock)
        git('add', 'package-lock.json')
      }
    }
    git('add', `${dir}/package.json`)
    console.log(`🔖 ${pkg.name} bumped to ${next}`)
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) main()
