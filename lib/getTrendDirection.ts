import { TickerInfo } from '@prisma/client';

function getTrendDirection(
  timeSeries: TickerInfo[]
): 'positive' | 'negative' | 'neutral' | string | null {
  if (timeSeries.length <= 0) return null

  const sortedTimeSeries = timeSeries.slice().sort((a, b) => {
    return new Date(a.date).valueOf() - new Date(b.date).valueOf()
  })

  const firstClose = Number(sortedTimeSeries[0].close)
  const lastClose = Number(sortedTimeSeries[sortedTimeSeries.length - 1].close)

  let direction = 'neutral'

  if (firstClose < lastClose) direction = 'positive'
  else if (firstClose > lastClose) direction = 'negative'

  return direction
}

export default getTrendDirection
