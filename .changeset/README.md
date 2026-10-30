# Changesets

Every change to a published package needs a changeset. Run `npm run changeset`, pick the package and the bump type (patch / minor / major), and commit the generated markdown file with your change.

For changes that don't need a release (docs, CI, Storybook-only stories): `npx changeset add --empty`.
