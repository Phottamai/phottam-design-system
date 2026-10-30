export type PaginationSlot = number | 'ellipsis'

/** Page indices with ellipsis gaps for compact controls (e.g. 1 2 … 9). */
export function buildPaginationSlots(totalPages: number, currentPage: number): PaginationSlot[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, i) => i)
  }

  const last = totalPages - 1

  if (currentPage <= 2) {
    return [0, 1, 2, 'ellipsis', last]
  }

  if (currentPage >= last - 2) {
    return [0, 'ellipsis', last - 2, last - 1, last]
  }

  return [0, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', last]
}
