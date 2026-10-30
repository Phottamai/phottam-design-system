# Phottam Design System

A monorepo of shared, pure UI component packages for Phottam apps, each documented in Storybook. It is managed with **npm workspaces**, written in **TypeScript**, and publishes to **GitHub Packages** (`npm.pkg.github.com`). The setup mirrors [phottam-platform-kit](../phottam-platform-kit).

## Repository structure

```
├── .changeset/           # Changesets config and pending version bumps
├── .github/workflows/    # quality-gate.yml (PR checks) and publish.yml (releases)
├── ds-b2b/          # @phottamai/ds-b2b: B2B UI primitives + Storybook
├── scripts/
│   └── export-tarball.mjs  # npm run export:tar: test a package in an app without publishing
├── package.json          # Workspaces and root scripts
├── .npmrc                # @phottamai scope → GitHub Packages
└── eslint.config.mjs, .prettierrc, .husky/, .lintstagedrc.json
```

## Packages

| Package                                 | Directory | Description                                                                                         |
| :-------------------------------------- | :-------- | :-------------------------------------------------------------------------------------------------- |
| [`@phottamai/ds-b2b`](ds-b2b/README.md) | `ds-b2b/` | Buttons, form items, modals, search, navigation and feedback components ported from phottam-desktop |

To add a package, create a sibling folder with its own `package.json`, add it to `workspaces` in the root `package.json`, and add it to the `options` list in `.github/workflows/publish.yml`.

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
| `npm run changeset`       | Record a version bump for your change                             |
| `npm run export:tar`      | Pack a package into a sibling app for local testing               |

## Publishing

Publishing works exactly like platform-kit.

### Automated (standard releases)

1. Change a package, then run `npm run changeset`. Pick the package and the bump (patch / minor / major).
2. Commit the generated `.changeset/*.md` with your change and merge to `main`.
3. CI opens or updates a **"chore: version packages"** PR.
4. Merging that PR publishes the new versions to GitHub Packages.

`changeset publish` also publishes any package version that isn't on the registry yet. The first merge to `main` therefore publishes `@phottamai/ds-b2b@1.0.0`.

### Manual

Run the **Publish Packages** workflow from the Actions tab and pick a package. It builds and publishes the package at its current version without bumping it.

### PR quality gate

Every PR runs a changeset check, Prettier, ESLint, typecheck, the package build and the Storybook build. Package changes need a changeset. For changes that don't need a release (docs, CI, stories only), run `npx changeset add --empty`.

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

Releases follow semver via Changesets. Update like any dependency:

```bash
npm install @phottamai/ds-b2b@latest
```

Each package's `CHANGELOG.md` lists what changed per version.

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
