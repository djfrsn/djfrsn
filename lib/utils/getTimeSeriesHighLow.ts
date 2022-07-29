import { TickerInfo } from '@prisma/client';

const getTimeSeriesHighLow = timeSeries => {
  let high: TickerInfo | null = null
  let low: TickerInfo | null = null

  timeSeries.forEach(item => {
    const itemClose = Number(item.close)
    if (!high || (high.close && itemClose > Number(high.close))) high = item
    if (!low || (low.close && itemClose < Number(low.close))) low = item
  })

  return { high, low }
}

export default getTimeSeriesHighLow
