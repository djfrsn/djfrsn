import prisma from 'lib/prisma';

async function createTickerInfo(ticker, timeSeries, interval) {
  let tickerInfo = null

  if (timeSeries) {
    const timeSeriesDates = Object.keys(timeSeries)

    if (timeSeriesDates.length > 0) {
      tickerInfo = timeSeriesDates.map(async date => {
        const timeSeriesData = timeSeries[date]

        let tickerInfoExist = await prisma.tickerInfo.findFirst({
          where: { tickerId: ticker.id, interval, date: new Date(date) },
        })

        if (tickerInfoExist === null) {
          return prisma.tickerInfo.create({
            data: {
              date: new Date(date),
              interval: interval,
              open: timeSeriesData['1. open'],
              high: timeSeriesData['2. high'],
              low: timeSeriesData['3. low'],
              close: timeSeriesData['4. close'],
              volume: timeSeriesData['5. volume'],
              tickerId: ticker.id,
            },
          })
        } else {
          return null
        }
      })

      tickerInfo = await Promise.all(tickerInfo)
    } else {
      tickerInfo = await prisma.tickerInfo.findMany({
        where: { tickerId: ticker.id, interval },
      })
    }
  }

  return tickerInfo
}

export default createTickerInfo
