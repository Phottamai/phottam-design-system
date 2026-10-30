/** Default compact ⋯ menu panel/row styling shared by listing and deck cards. */
export const listingCardMenuPanelClass =
  'w-max min-w-[9.5rem] max-w-[min(100vw-1.5rem,20rem)] overflow-visible rounded-lg border border-gray-300/90 bg-[#f0f0f2] shadow-[0_4px_16px_rgba(0,0,0,0.1)] dark:border-gray-600 dark:bg-gray-800'

export const listingCardMenuRowClass =
  "flex w-full items-center gap-2.5 whitespace-nowrap py-1.5 pl-2.5 pr-3 text-left font-['Frank_Ruhl_Libre'] text-[12px] font-medium text-neutral-900 transition-colors hover:bg-gray-200/90 dark:text-neutral-100 dark:hover:bg-gray-700/70"

export const listingCardMenuDeleteRowClass = `${listingCardMenuRowClass} text-red-600 hover:bg-red-100/80 dark:text-red-400 dark:hover:bg-red-950/50`

export const listingCardMenuIconClass =
  'h-3.5 w-3.5 shrink-0 text-neutral-700 dark:text-neutral-300'

export const listingCardMenuButtonOpenClass = 'bg-gray-100 dark:bg-gray-800'

export const listingCardMenuButtonClass =
  'inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#1A0B3B] bg-white text-[#1A0B3B] transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-violet-300 dark:bg-ph-dark-lite dark:text-violet-200 dark:hover:bg-gray-700'
