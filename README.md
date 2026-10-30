# Phottam Design System

A monorepo of shared, pure UI component packages for Phottam apps, each documented in Storybook. It is managed with **npm workspaces**, written in **TypeScript**, and publishes to **GitHub Packages** (`npm.pkg.github.com`). Packaging mirrors [phottam-platform-kit](../phottam-platform-kit). Releases are fully automatic on merge (no Changesets).

## Repository structure

```
├── .github/workflows/    # quality-gate.yml (PR checks) and release.yml (publish on merge)
├── ds-b2b/               # @phottamai/ds-b2b: B2B UI primitives + Storybook
├── scripts/
│   ├── bump-version.mjs    # pre-commit hook: bumps the patch version of changed packages
│   ├── release.mjs         # version check + publish, run by CI
│   └── export-tarball.mjs  # npm run export:tar: test a package in an app without publishing
├── package.json          # Workspaces and root scripts
├── .npmrc                # @phottamai scope → GitHub Packages
└── eslint.config.mjs, .prettierrc, .husky/, .lintstagedrc.json
```

## Packages

| Package                                 | Directory | Description                                                                                         |
| :-------------------------------------- | :-------- | :-------------------------------------------------------------------------------------------------- |
| [`@phottamai/ds-b2b`](ds-b2b/README.md) | `ds-b2b/` | Buttons, form items, modals, search, navigation and feedback components ported from phottam-desktop |

To add a package, create a sibling folder with its own `package.json` and add it to `workspaces` in the root `package.json`. The release workflow picks up every non-private workspace automatically.

## Getting started

Prerequisites: Node.js >= 22 (`.nvmrc`) and npm >= 10.

```bash
npm install            # installs every workspace and sets up the Husky pre-commit hook
npm run storybook      # Storybook for @phottamai/ds-b2b on http://localhost:6006
npm run build          # build every package into its dist/
```

| Script                    | What it does                                                      |
| ------------------------- | ----------------------------------------------------------------- |
| `npm run build`           | Builds all packages                                               |
| `npm run build-storybook` | Static Storybook builds                                           |
| `npm run typecheck`       | `tsc --noEmit` in every package                                   |
| `npm run lint`            | ESLint (same rules as platform-kit)                               |
| `npm run format`          | Prettier (single quotes, no semicolons, matching phottam-desktop) |
| `npm run version:check`   | Fail if a package's version is already published                  |
| `npm run export:tar`      | Pack a package into a sibling app for local testing               |

## Releasing

Versions are bumped **when you commit**, and released **when you merge**.

### 1. Commit: the pre-commit hook bumps the version

When a commit includes changes under a package folder (e.g. `ds-b2b/`), the Husky pre-commit hook (`scripts/bump-version.mjs`) increments that package's patch version (`1.0.3` → `1.0.4`). It writes the new version to the package's `package.json` and to `package-lock.json`, and adds both to the same commit.

- **Once per branch.** If your version is already ahead of `origin/main` and `origin/develop`, an earlier commit bumped it, so later commits leave it alone. Run `git fetch` now and then so the hook compares against up-to-date remote branches.
- **Commits that don't touch a package** (root README, CI, tooling) don't bump anything.
- **A new package** that isn't on `origin/main` or `origin/develop` yet keeps its starting version. `ds-b2b`'s first release is `1.0.0`.
- **Minor or major bump:** edit `"version"` in the package's `package.json` yourself (e.g. `1.1.0`). The hook sees it's ahead of the remote and keeps it.
- **Skip for one commit:** `SKIP_VERSION_BUMP=1 git commit …`. (`--no-verify` also skips it, along with lint-staged.)
- The hook runs after `npm install`, which sets up Husky.

### 2. Merge: CI publishes the committed version

`.github/workflows/release.yml` runs on every push to `main` or `develop`: format, lint, typecheck, build, then publish to GitHub Packages. **It publishes exactly the version in `package.json`. It never calculates or commits versions.**

| Merge to  | npm dist-tag | Also                                                                                      |
| --------- | ------------ | ----------------------------------------------------------------------------------------- |
| `main`    | `latest`     | Git tag + GitHub Release (`@phottamai/ds-b2b@1.0.4`) with notes generated from merged PRs |
| `develop` | `develop`    | Git tag + GitHub Release marked as a pre-release                                          |

A plain `npm install @phottamai/ds-b2b` gets the newest `main` release, and `@develop` gets the newest `develop` release.

### The build fails if the version wasn't incremented

If a package changed but its version **already exists on GitHub Packages**, nobody incremented it. CI fails with:

```
❌ @phottamai/ds-b2b@1.0.4 is already published. The version was not incremented.
```

This is checked twice:

1. **On every PR**, in the quality gate, against the PR's base branch, so you find out before merging.
2. **On merge**, in the release workflow, right before publishing.

To fix it, make any commit that touches the package (the hook bumps it), or raise `"version"` in its `package.json`. Packages that didn't change are skipped, so docs-only or CI-only PRs pass without a bump. Check locally with `npm run version:check` (needs `NODE_AUTH_TOKEN`).

Two branches that both bumped to the same version both pass their own PR check. After the first merges, the second one's version is taken, and its release fails. Rebase it, then commit again (or edit the version) to bump past it.

> **Keeping develop builds out of an app:** dist-tags only apply to bare installs. A version range such as `^1.0.0` in an app's `package.json` resolves to the highest matching version, which can be a `develop` release. Apps that must only get `main` releases should pin an exact version (`"@phottamai/ds-b2b": "1.0.4"`) and bump it deliberately.

### PR quality gate

Every PR runs the version check, Prettier, ESLint, typecheck, the package build and the Storybook build (`quality-gate.yml`). Since merging publishes immediately, make this gate a required check in the branch protection for `main` and `develop`.

## Using the packages in other repositories

The packages install from GitHub Packages, exactly like `@phottamai/ui-components` from platform-kit. If an app already installs platform-kit packages, steps 1 and 2 are done.

### 1. Point the `@phottamai` scope at GitHub Packages

Add an `.npmrc` at the app's repo root. phottam-web, Phottam-b2b-pwa and phottam-b2c already have this file.

```ini
@phottamai:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

### 2. Provide a token

- **Locally:** create a GitHub personal access token (classic) with the `read:packages` scope. If the Phottamai org uses SSO, authorise the token for it. Then export it in your shell profile:
  ```bash
  export NODE_AUTH_TOKEN="ghp_..."
  ```
- **In CI:** set `NODE_AUTH_TOKEN` the same way the app's pipeline already does for platform-kit packages.

### 3. Install

```bash
npm install @phottamai/ds-b2b
```

Peer dependencies are `react` and `react-dom` (>=18), `framer-motion` (>=10) and `react-icons` (>=4). Every Phottam app already has them.

### 4. Wire up styles in each app

The components use Tailwind utility classes, which **the app's own Tailwind generates** by scanning the package. A small precompiled `styles.css` covers the rest. Pick the recipe for your app:

| App             | Stack                 | What to change                                                                          |
| --------------- | --------------------- | --------------------------------------------------------------------------------------- |
| phottam-desktop | Electron + Vite, TW 3 | `tailwind.config.ts` content path, plus `styles.css` in `src/renderer/src/main.tsx`     |
| phottam-web     | Next.js 16, TW 3      | `tailwind.config.ts` preset and content path, plus `styles.css` in `src/app/layout.tsx` |
| Phottam-b2b-pwa | Next.js 16, TW 4      | `app/globals.css` theme import, plus `styles.css` in `app/layout.tsx`                   |
| phottam-b2c     | Next.js 16, TW 4      | Same as b2b-pwa, **plus** a class-based dark variant (see below)                        |

#### phottam-desktop (Tailwind 3)

The desktop config already defines the `ph-*` colours and the app already loads its fonts, so only two changes are needed.

```ts
// tailwind.config.ts
content: [
  // ...existing entries
  './node_modules/@phottamai/ds-b2b/dist/**/*.{js,cjs}'
],
```

```ts
// src/renderer/src/main.tsx
import '@phottamai/ds-b2b/styles.css'
```

#### phottam-web (Tailwind 3)

```ts
// tailwind.config.ts
import dsB2bPreset from '@phottamai/ds-b2b/tailwind-preset'

export default {
  presets: [dsB2bPreset],
  content: [
    // ...existing entries
    './node_modules/@phottamai/ds-b2b/dist/**/*.{js,cjs}'
  ]
  // darkMode: 'class' is already set
}
```

```tsx
// src/app/layout.tsx
import '@phottamai/ds-b2b/styles.css'
import './globals.css'
```

#### Phottam-b2b-pwa (Tailwind 4)

Tailwind 4 reads its setup from CSS, so `tailwind.config.js` isn't involved.

```css
/* app/globals.css */
@import 'tailwindcss';
@import '@phottamai/ds-b2b/tailwind.css'; /* tokens + scans the package */

@custom-variant dark (&:where(.dark, .dark *)); /* already present */
```

```tsx
// app/layout.tsx
import '@phottamai/ds-b2b/styles.css'
import './globals.css'
```

#### phottam-b2c (Tailwind 4)

Do the same as b2b-pwa. b2c also needs a class-based dark variant, which it doesn't have today. Without it, Tailwind 4 follows the OS colour scheme while the package's `styles.css` follows the `.dark` class, and the two drift apart.

```css
/* app/globals.css */
@import 'tailwindcss';
@import '@phottamai/ds-b2b/tailwind.css';
@custom-variant dark (&:where(.dark, .dark *));
```

```tsx
// app/layout.tsx
import '@phottamai/ds-b2b/styles.css'
import './globals.css'
```

#### Fonts (optional, all apps)

`import '@phottamai/ds-b2b/fonts.css'` loads Plus Jakarta Sans. Like the desktop app, it also **renames Frank Ruhl Libre, Satoshi, DM Sans and others to Plus Jakarta Sans.** Leave it out of apps that use the real fonts (phottam-web and b2b-pwa do). phottam-desktop already ships its own copy.

### 5. Use the components

```tsx
'use client'

import { useState } from 'react'
import { Button, ConfirmationModal, Input, SearchInput } from '@phottamai/ds-b2b'

export function ClientsToolbar() {
  const [query, setQuery] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)

  return (
    <>
      <SearchInput value={query} onChange={setQuery} rotatingHints={['client name', 'email']} />
      <Button text="Delete selected" nature="danger" onClick={() => setConfirmOpen(true)} />
      <ConfirmationModal
        isOpen={confirmOpen}
        type="danger"
        title="Delete clients?"
        message="This can't be undone."
        confirmText="Delete"
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => setConfirmOpen(false)}
      />
    </>
  )
}
```

- **Next.js:** the package bundle is marked `"use client"`, so components can be imported anywhere, including Server Components, and they render on the server without errors. Event-handler props (`onClick`, `onChange`) can only be passed from a Client Component, as usual in Next.
- **Electron/Vite:** import and use directly.
- **Browse everything** in Storybook (`npm run storybook` in this repo). Every prop is documented there with live controls.

### 6. Update

Every merge to `main` or `develop` that changes a package publishes a new version. Pin an exact version if the app must only get `main` releases (see [Releasing](#releasing)). To update:

```bash
npm install @phottamai/ds-b2b@latest    # newest stable (from main)
npm install @phottamai/ds-b2b@develop   # newest develop release, for testing unreleased work
```

What changed in each version is listed under the repo's **Releases** on GitHub (notes are generated from the merged PRs).

### Troubleshooting

| Symptom                                              | Fix                                                                                                                                                          |
| ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm install` fails with **401 / 403**               | `NODE_AUTH_TOKEN` is missing, lacks `read:packages`, or isn't SSO-authorised for the Phottamai org.                                                          |
| `npm install` fails with **404**                     | The `.npmrc` scope line is missing, so npm looked on npmjs.com. Or the version hasn't been published yet.                                                    |
| Components render **unstyled or partly styled**      | The app's Tailwind isn't scanning the package: check the `content` path (TW 3) or the `tailwind.css` import (TW 4). Restart the dev server.                  |
| `bg-ph-dark…` **colours missing**                    | The preset (TW 3) or `tailwind.css` (TW 4) isn't loaded.                                                                                                     |
| Checkbox has **no tick**, phone input looks native   | `@phottamai/ds-b2b/styles.css` isn't imported.                                                                                                               |
| **Dark mode is half-applied**                        | The app needs class-based dark mode (`darkMode: 'class'` on TW 3, the `@custom-variant dark` line on TW 4) and a `.dark` class on `<html>`.                  |
| Shadows or purple shades look **slightly different** | Expected on Tailwind 4, which changed some default scales and palettes. See the [package README](ds-b2b/README.md#differences-you-may-notice-on-tailwind-4). |

## Local testing in an app (no publish)

```bash
# from the repo root: prompts for package and target app
npm run export:tar
# or directly
npm run export:tar -- ds-b2b phottam-web
```

The script builds the package, runs `npm pack`, copies the tarball to `<app>/local_packages/` and points the app's `package.json` at it. Then run `npm install` in the app. Revert the `package.json` change before committing there.
