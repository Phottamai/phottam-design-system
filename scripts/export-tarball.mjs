import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import readline from 'readline/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const kitRoot = path.resolve(__dirname, '..')
const kitName = path.basename(kitRoot)
const projectsRoot = path.resolve(kitRoot, '..')

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  try {
    const isRoot = path.resolve(process.cwd()) === kitRoot
    // Packages are the npm workspaces declared in the root package.json.
    const rootPkg = JSON.parse(fs.readFileSync(path.join(kitRoot, 'package.json'), 'utf-8'))
    const availablePackages = (rootPkg.workspaces || []).filter((dir) =>
      fs.existsSync(path.join(kitRoot, dir, 'package.json'))
    )

    const availableRepos = fs.readdirSync(projectsRoot).filter((dir) => {
      const fullPath = path.join(projectsRoot, dir)
      return (
        fs.statSync(fullPath).isDirectory() &&
        dir !== kitName &&
        !dir.startsWith('.') &&
        fs.existsSync(path.join(fullPath, 'package.json'))
      )
    })

    let currentDir = process.cwd()
    let targetRepoName = null

    if (isRoot) {
      const args = process.argv.slice(2)
      let selectedPkg = null

      // Check if first arg matches a package name
      if (args[0] && availablePackages.includes(args[0])) {
        selectedPkg = args[0]
        targetRepoName = args[1] || null
      } else if (args[0] && availableRepos.includes(args[0])) {
        targetRepoName = args[0]
      }

      if (!selectedPkg) {
        console.log(`\n📦 Available packages in ${kitName}:`)
        availablePackages.forEach((pkg, idx) => console.log(`  [${idx + 1}] ${pkg}`))

        const pkgAnswer = await rl.question(
          `\nSelect package to pack [1-${availablePackages.length}] (default: 1): `
        )
        const pkgIndex = pkgAnswer.trim() ? parseInt(pkgAnswer.trim(), 10) - 1 : 0
        selectedPkg = availablePackages[pkgIndex] || availablePackages[0]
      }

      currentDir = path.join(kitRoot, selectedPkg)
    } else {
      targetRepoName = process.argv[2] || null
    }

    const packageJsonPath = path.join(currentDir, 'package.json')
    if (!fs.existsSync(packageJsonPath)) {
      console.error(`❌ package.json not found in ${currentDir}`)
      process.exit(1)
    }

    const pkgData = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    const pkgName = pkgData.name
    const pkgVersion = pkgData.version

    console.log(`\n🚀 Preparing ${pkgName}@${pkgVersion} (${path.basename(currentDir)})...`)

    // Prompt for target repo if not provided
    if (!targetRepoName) {
      console.log('\n🎯 Target Repositories detected:')
      availableRepos.forEach((repo, idx) => {
        const isDefault = repo === 'phottam-web' ? ' (default)' : ''
        console.log(`  [${idx + 1}] ${repo}${isDefault}`)
      })

      const defaultIdx = availableRepos.indexOf('phottam-web')
      const promptDefault = defaultIdx !== -1 ? `${defaultIdx + 1}` : '1'

      const repoAnswer = await rl.question(
        `\nEnter target repo name or number [1-${availableRepos.length}] (default: ${promptDefault}): `
      )

      const trimmed = repoAnswer.trim()
      if (!trimmed) {
        targetRepoName = availableRepos[defaultIdx !== -1 ? defaultIdx : 0]
      } else if (!isNaN(parseInt(trimmed, 10)) && availableRepos[parseInt(trimmed, 10) - 1]) {
        targetRepoName = availableRepos[parseInt(trimmed, 10) - 1]
      } else {
        targetRepoName = trimmed
      }
    }

    const targetRepoPath = path.join(projectsRoot, targetRepoName)
    const targetPkgJsonPath = path.join(targetRepoPath, 'package.json')

    if (!fs.existsSync(targetPkgJsonPath)) {
      console.error(`❌ Target repository package.json not found at: ${targetPkgJsonPath}`)
      process.exit(1)
    }

    // Build package
    console.log(`\n🔨 Building ${pkgName}...`)
    execSync('npm run build', { cwd: currentDir, stdio: 'inherit' })

    // Pack package into tarball
    console.log(`\n📦 Creating tarball via npm pack...`)
    const packOutput = execSync('npm pack', {
      cwd: currentDir,
      encoding: 'utf-8'
    }).trim()
    const tarballFileName = packOutput.split('\n').pop().trim()
    const tarballSourcePath = path.join(currentDir, tarballFileName)

    if (!fs.existsSync(tarballSourcePath)) {
      console.error(`❌ Tarball was not created: ${tarballSourcePath}`)
      process.exit(1)
    }

    // Copy tarball to target repo's local_packages folder
    const targetLocalPackagesDir = path.join(targetRepoPath, 'local_packages')
    if (!fs.existsSync(targetLocalPackagesDir)) {
      fs.mkdirSync(targetLocalPackagesDir, { recursive: true })
    }

    const targetTarballPath = path.join(targetLocalPackagesDir, tarballFileName)
    fs.copyFileSync(tarballSourcePath, targetTarballPath)

    // Remove source tarball
    fs.unlinkSync(tarballSourcePath)
    console.log(`✅ Tarball copied to: ${targetTarballPath}`)

    // Update target repository's package.json
    const targetPkgData = JSON.parse(fs.readFileSync(targetPkgJsonPath, 'utf-8'))
    const relativeTarballPath = `file:./local_packages/${tarballFileName}`

    let updatedSection = null
    if (targetPkgData.dependencies && targetPkgData.dependencies[pkgName]) {
      targetPkgData.dependencies[pkgName] = relativeTarballPath
      updatedSection = 'dependencies'
    } else if (targetPkgData.devDependencies && targetPkgData.devDependencies[pkgName]) {
      targetPkgData.devDependencies[pkgName] = relativeTarballPath
      updatedSection = 'devDependencies'
    } else {
      if (!targetPkgData.dependencies) targetPkgData.dependencies = {}
      targetPkgData.dependencies[pkgName] = relativeTarballPath
      updatedSection = 'dependencies (added)'
    }

    fs.writeFileSync(targetPkgJsonPath, JSON.stringify(targetPkgData, null, 2) + '\n', 'utf-8')
    console.log(`✅ Updated ${targetRepoName}/package.json:`)
    console.log(`   "${pkgName}": "${relativeTarballPath}" (${updatedSection})`)

    console.log(`\n🎉 Success! Next step in ${targetRepoName}:`)
    console.log(`   cd ../${targetRepoName} && npm install\n`)
  } catch (err) {
    console.error('❌ Error exporting tarball:', err.message)
    process.exit(1)
  } finally {
    rl.close()
  }
}

main()
