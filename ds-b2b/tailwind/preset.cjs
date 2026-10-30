/**
 * Tailwind CSS v3 preset for @phottamai/ds-b2b.
 *
 * Adds the design tokens the components use that stock Tailwind doesn't have.
 * Your own config still wins over anything defined here.
 *
 *   // tailwind.config.js
 *   module.exports = {
 *     presets: [require('@phottamai/ds-b2b/tailwind-preset')],
 *     content: ['./src/**\/*.{ts,tsx}', './node_modules/@phottamai/ds-b2b/dist/**\/*.{js,cjs}']
 *   }
 */
module.exports = {
  theme: {
    extend: {
      colors: {
        'ph-dark': '#05060F',
        'ph-dark-lite': '#12131A',
        'ph-dark-text': '#A3A6AD',
        'ph-border-dark': '#20212A'
      },
      fontFamily: {
        'plus-jakarta': ['"Plus Jakarta Sans"', 'sans-serif']
      }
    }
  }
}
