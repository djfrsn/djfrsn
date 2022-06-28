export const getDependenciesCount = (dependencies: {
  nextProcessedCursor?: number
  processed?: Record<string, any>
  nextUnprocessedCursor?: number
  unprocessed?: string[]
}): number => {
  return (
    Object.keys(dependencies.processed).length + dependencies.unprocessed.length
  )
}
