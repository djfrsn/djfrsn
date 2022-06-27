function arrayHasItems(array: any[]): boolean {
  return Array.isArray(array) && !!array.length
}

export default arrayHasItems
