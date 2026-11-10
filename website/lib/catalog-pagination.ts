export const CATALOG_MOBILE_PAGE_SIZE = 6
export const CATALOG_DESKTOP_PAGE_SIZE = 12

export function catalogPageSize(isMobile: boolean): number {
  return isMobile ? CATALOG_MOBILE_PAGE_SIZE : CATALOG_DESKTOP_PAGE_SIZE
}

export function catalogOffsetToPage(offset: number, pageSize: number): number {
  if (pageSize <= 0) return 1
  return Math.floor(Math.max(0, offset) / pageSize) + 1
}

export function catalogPageToOffset(page: number, pageSize: number): number {
  return Math.max(0, page - 1) * pageSize
}
