# @phottamai/ds-b2b

Pure UI primitives for Phottam B2B (buttons, form items, modals, search boxes, navigation), ported from **phottam-desktop** (`src/renderer/src/components`) and documented in Storybook.

"Pure" means props in, JSX out. There are no app services, stores, contexts, routing, IPC or `@renderer/*` imports. Markup and Tailwind classes are kept identical to the desktop source, so components render the same in every app.

Works in React 18 and 19, in Vite/Electron and Next.js (App Router and SSR), and with Tailwind CSS 3 or 4.

## Install

The package is published to GitHub Packages, like `@phottamai/ui-components`. The consuming repo needs the same `.npmrc` it already uses for platform-kit:

```ini
@phottamai:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
npm install @phottamai/ds-b2b
```

Peer dependencies: `react`, `react-dom` (>=18), `framer-motion` (>=10) and `react-icons` (>=4). All Phottam apps already have them.

## Set up styles

> **Step-by-step for each Phottam app** (phottam-desktop, phottam-web, Phottam-b2b-pwa, phottam-b2c), including tokens, CI and troubleshooting: see [Using the packages in other repositories](../README.md#using-the-packages-in-other-repositories) in the root README.

Components are styled with Tailwind utility classes, which **your app's Tailwind generates**, plus a small precompiled stylesheet for what utilities can't express. This is the same approach `@phottamai/ui-components` uses.

### 1. Import the stylesheet once

```ts
import '@phottamai/ds-b2b/styles.css'
```

It contains the shared component classes (`phottam-theme`, `theme-input`, …), the modal animations, the loader, the phone-input styles and the checkbox checkmark. It is plain CSS with no preflight and no utilities, and it never targets global elements, so it's safe in any app.

### 2. Let your Tailwind see the components

**Tailwind 3** (phottam-desktop, phottam-web): add the preset and the package's `dist` to `content`.

```ts
// tailwind.config.ts
import dsB2bPreset from '@phottamai/ds-b2b/tailwind-preset'

export default {
  presets: [dsB2bPreset],
  content: ['./src/**/*.{ts,tsx}', './node_modules/@phottamai/ds-b2b/dist/**/*.{js,cjs}'],
  darkMode: 'class'
}
```

**Tailwind 4** (Phottam-b2b-pwa, phottam-b2c): import the theme file. It registers the tokens and the `@source` for you.

```css
/* globals.css */
@import 'tailwindcss';
@import '@phottamai/ds-b2b/tailwind.css';
@custom-variant dark (&:where(.dark, .dark *));
```

The preset and theme add only the tokens stock Tailwind lacks: `ph-dark`, `ph-dark-lite`, `ph-dark-text`, `ph-border-dark` and `font-plus-jakarta`. Every other class the components use exists in both Tailwind 3 and 4. This was checked against Tailwind 4.2 for all 1,727 class candidates.

### 3. Dark mode

Dark styles key off a `.dark` class on an ancestor (usually `<html>`), as in the desktop app.

### 4. Fonts (optional)

```ts
import '@phottamai/ds-b2b/fonts.css'
```

This loads Plus Jakarta Sans and, **like the desktop app, aliases `Frank Ruhl Libre`, `Satoshi`, `DM Sans` and others to it.** Only import it in apps that want that aliasing (phottam-desktop already has its own copy). Apps that use the real Frank Ruhl Libre should skip it.

## Use

```tsx
import { Button, Input, ModalWindow, SearchInput } from '@phottamai/ds-b2b'

<SearchInput value={query} onChange={setQuery} rotatingHints={['client name', 'email']} />
<ModalWindow isOpen={open} onClose={close} title="Create Project" footer={<Button text="Create" />}>
  <Input label="Project name" required />
</ModalWindow>
```

The bundle starts with `"use client"`, so it can be imported straight from Next.js Server Components. Every component server-renders without touching `window` or `document`.

## Develop

From the repo root:

```bash
npm install
npm run storybook        # http://localhost:6006
npm run build            # dist/: ESM + CJS + .d.ts + styles.css + fonts
npm run typecheck
npm run lint
```

Use the paintbrush toolbar button in Storybook to switch light/dark, and the viewport button to check widths from 320px to 1920px.

### Test in an app without publishing

```bash
cd ds-b2b
npm run export:tar -- phottam-web      # builds, packs and links into ../phottam-web
cd ../../phottam-web && npm install
```

This works the same as platform-kit's `export:tar`. It writes `local_packages/<tarball>` and points `package.json` at it, so revert that before committing in the target repo.

### Release

The pre-commit hook bumps this package's patch version on your first commit that changes it. Merging to `main` (`@latest`) or `develop` (`@develop`) publishes that version. CI fails if the version is already published, meaning it wasn't incremented. For a minor or major bump, set `version` in `package.json` yourself. See [Releasing](../README.md#releasing) in the root README.

## Components

| Group      | Component                                                       | Desktop source                       | Desktop usages\* |
| ---------- | --------------------------------------------------------------- | ------------------------------------ | ---------------- |
| Actions    | `Button`                                                        | `components/Button`                  | 114              |
| Form       | `Input` (incl. textarea, password, clearable)                   | `components/Input`                   | 37               |
| Form       | `Label`                                                         | `components/Label`                   | 12               |
| Form       | `Checkbox` (default / card / switch)                            | `components/Checkbox`                | 15               |
| Form       | `ErrorMessage`                                                  | `components/ErrorMessage`            | 11               |
| Form       | `CountIndicator`                                                | `components/CountIndicator`          | 12               |
| Form       | `SearchInput` (+ `RotatingSearchPlaceholder`)                   | `components/SearchInput.tsx`         | 14               |
| Form       | `DatePicker` (+ date utils)                                     | `components/DatePicker`              | 9                |
| Form       | `TimePicker` (+ time utils)                                     | `components/TimePicker`              | 1                |
| Form       | `PhoneInputField` (+ `CountrySelectDropdown`, validation utils) | `components/PhoneInput`              | 9                |
| Form       | `MultiEmailInput`                                               | `components/MultiEmailInput`         | 2                |
| Form       | `PasswordStrength`                                              | `components/PasswordStrength`        | 1                |
| Form       | `AnchoredSelect`, `AnchoredDropdownPanel`                       | `components/AnchoredDropdown`        | 21               |
| Overlays   | `ModalWindow`                                                   | `components/Modal/ModalWindow`       | 62               |
| Overlays   | `ConfirmationModal`                                             | `components/Modal/ConfirmationModal` | 56               |
| Overlays   | `AlertModal`                                                    | `components/AlertModal`              | 0                |
| Overlays   | `TextInputModal`                                                | `components/Modal/TextInputModal`    | 1                |
| Overlays   | `Tooltip`                                                       | `components/Tooltip`                 | 158              |
| Overlays   | `Toast`                                                         | `components/Toast`                   | 2                |
| Overlays   | `AnchoredActionMenu`, `AnchoredActionMenuItem`                  | `components/AnchoredDropdown`        | 18               |
| Navigation | `Switcher`                                                      | `components/Switcher`                | 7                |
| Navigation | `SegmentedTabControl`                                           | `components/SegmentedTabControl`     | 1                |
| Navigation | `Pagination`                                                    | `components/Pagination`              | 26               |
| Navigation | `Breadcrumbs`                                                   | `components/Breadcrumbs`             | 8                |
| Feedback   | `Loader`                                                        | `components/Loader`                  | 2                |
| Feedback   | `ProgressBar`                                                   | `components/Progressbar`             | 0                |
| Feedback   | `EmptyState`                                                    | `components/EmptyState`              | 58               |

\* Number of renderer files importing the component at the time of the port.

Hooks and tokens are exported too: `useClickOutside`, `useRotatingSearchHintIndex`, `useScrollActiveIntoView`, `useAnchoredOverlayPosition`, `useCardMenuPlacement`, `FONT_FRANK`, and the `listingCardMenu*` class tokens.

## Where the package differs from the desktop

Everything not listed here is a straight copy with import paths rewritten.

**API**

- **`CountIndicator`**: `limitKey: InputLimitKey` became `maxLength: number`. The app-specific `INPUT_LIMITS` map stays in the desktop app, which passes `INPUT_LIMITS[key]`.

**Fixes**

- **`AlertModal`**: `useId()` now runs before the `if (!isOpen) return null` early return. The desktop version breaks the Rules of Hooks when `isOpen` toggles.
- **`Checkbox`** (default/card): the box is vertically centred on the label's first line. In the desktop version it sits a few pixels high.

**Needed to work outside the desktop app**

- **`Input`, `Checkbox`**: fallback ids come from `useId()` instead of `Math.random()`. The random ids changed on every render and caused hydration mismatches under SSR.
- **`Tooltip`**: portals into `document.body` only after mount (SSR-safe). It no longer imports `react-tooltip.css`, because react-tooltip injects its own styles.
- **`EmptyState`**: `lottie-react` is lazy-loaded on the client, because `lottie-web` reads `document` when imported.
- **`Checkbox`**: the checkmark and reset come from a scoped `ph-checkbox` class in `styles.css`, not from the desktop's global flowbite form plugin.
- **`DatePicker`, `Breadcrumbs`**: icons come from `react-icons/pi` (the same Phosphor glyphs) instead of `@phosphor-icons/react`. Phosphor 2.1.10's CommonJS build can't be `require()`d.
- **Types**: components use `import type { JSX } from 'react'`, so the declarations work with React 19's types, which drop the global `JSX` namespace.

**Moved**

- **`AnchoredActionMenu`**: class strings from `constants/listingCardStyles.ts` live in `src/tokens/menuStyles.ts`, with `useCardMenuPlacement` next to the menu.
- **`TimePicker`**: `FONT_FRANK` comes from `src/tokens/typography.ts`.
- **`SearchInput`**: `ROTATING_SEARCH_HINT_PREFIX` lives in `searchHints.ts`. The per-page hint lists stay in the app.

## Responsive behaviour

Every component works from 320px phones up to 1920px+ desktops. Each story is checked at 320, 390, 768, 1024, 1440 and 1920px wide, and none overflows the page.

The rule: **at desktop widths (≥640px, Tailwind `sm`) components look exactly like phottam-desktop.** Responsive adjustments only kick in when space runs out:

| Component                             | Narrow-space behaviour                                                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`                              | Never wider than its container; long labels truncate with an ellipsis. Inside a flex row, add `min-w-0` via `customClass` if it should shrink. |
| `ConfirmationModal`                   | Buttons sit side by side in equal halves when both fit, and stack full-width when the dialog is too narrow.                                    |
| `ModalWindow`                         | Header and footer padding drops from 24px to 16px below `sm`. The panel is full-width minus a 16px gutter.                                     |
| `Switcher`, `SegmentedTabControl`     | Tabs scroll horizontally (hidden scrollbar), and the active tab is kept in view (`useScrollActiveIntoView`).                                   |
| `Breadcrumbs`                         | Long titles truncate.                                                                                                                          |
| `Label`                               | Long text wraps, and the "+ Add" action stays on one line.                                                                                     |
| `MultiEmailInput`                     | Long email chips truncate (the full address is in `title`).                                                                                    |
| `Tooltip`                             | Max width is `min(300px, 100vw − 16px)`.                                                                                                       |
| `AnchoredDropdownPanel`, `TimePicker` | Panels are capped at `100vw − 24px`.                                                                                                           |
| `PhoneInputField`                     | The country menu shrinks below 288px to keep a 12px gutter.                                                                                    |
| `EmptyState`                          | The animation is 144px below `sm` and 192px from `sm` up.                                                                                      |

The `LongLabel…`, `ManyTabs`, `LongTitle`, `LongEmails`, `LongTextWithAdd`, `LongButtonLabels` and `LongContent` stories are stress cases kept for regression checks.

## How the package is built

| Output                         | Source                                     | Built by                            |
| ------------------------------ | ------------------------------------------ | ----------------------------------- |
| `dist/index.js`, `index.cjs`   | `src/index.ts`                             | `vite.config.ts` (library mode)     |
| `dist/**/*.d.ts`               | `src/**`                                   | `vite-plugin-dts`                   |
| `dist/styles.css`              | `src/styles/package.css`                   | Tailwind CLI (`@apply` → plain CSS) |
| `dist/fonts.css`, `dist/fonts` | `src/styles/fonts.css`, `src/styles/fonts` | copied                              |
| `tailwind/preset.cjs`          | hand-written                               | shipped as-is (Tailwind 3)          |
| `tailwind/theme.css`           | hand-written                               | shipped as-is (Tailwind 4)          |

All dependencies stay external. `tailwind.config.ts` mirrors phottam-desktop's config and is only used by Storybook and the `styles.css` build. Storybook has its own Vite config in `.storybook/vite.config.ts`.

## Differences you may notice on Tailwind 4

The classes exist in both versions, but Tailwind 4 changed the scale of a few: `shadow-sm` is slightly larger, and the default purple palette differs from the desktop's (desktop maps `purple-*` to violet values). The Tailwind 4 apps keep their own palette.

## Not ported (yet)

These are reusable in the app but not pure, so they were left out of this first pass:

| Component                           | Reason                                                                           |
| ----------------------------------- | -------------------------------------------------------------------------------- |
| `SearchableDropDown`                | Built-in renderers depend on domain types (Client, Event, Invoice) and app utils |
| `Select` (react-select wrapper)     | Uses `ThemeContext` and `PremiumCrown`                                           |
| `DeletionModal`                     | Depends on `DeletionProgressLoader` and flowbite `Kbd`                           |
| `Stepper`, `SkeletonLoader`, `Card` | Shaped around specific screens, not general primitives                           |

Each could be ported by passing its dependencies in as props (for example `renderOption`, `isDark`), but that changes the API, so it should be decided first.

## Known issues carried over from the desktop

- `Pagination` reuses fixed tooltip ids (`pagination-prev` / `pagination-next`), so two paginations on one screen share tooltips.
