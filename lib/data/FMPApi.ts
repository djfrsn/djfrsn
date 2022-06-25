import fetch from 'lib/utils/fetch';

import { TickerType } from '../types';
import chunk from '../utils/chunk';

// Docs: https://site.financialmodelingprep.com/developer/docs

interface FMPTickerType {
  symbol: string
  name: string
  sector: string
  subSector: string
  headQuarter: string
  dateFirstAdded: string
  lastRefreshed: string
  cik: string
  founded: string
}
interface FMPPriceType {
  date: string
  close: string
  open?: string
}

class FMPApi {
  apiKey: string
  apiUrl: string
  constructor() {
    this.apiUrl = process.env.FMP_API_URL
    this.apiKey = process.env.FMP_API_KEY
    this.getApiUrl = this.getApiUrl.bind(this)
  }

  getApiUrl(apiStr: string, version = 'v3') {
    const apiKeySeperator = apiStr.includes('?') ? '&' : '?'
    return `${this.apiUrl}/api/${version}/${apiStr}${apiKeySeperator}apikey=${this.apiKey}`
  }

  get marketIndex() {
    const getApiUrl = this.getApiUrl

    return {
      async sp500(): Promise<FMPTickerType[]> {
        return await fetch(getApiUrl('sp500_constituent'))
      },
    }
  }

  get core() {
    const getApiUrl = this.getApiUrl

    return {
      async dailyHistoricalPrice(
        tickers: string | string[] | TickerType[]
      ): Promise<{ symbol: string; historical: FMPPriceType[] }[]> {
        let res = []
        const batchLimit = 3
        const chunkList = tickers.length > 1
        const tickersList =
          chunkList && Array.isArray(tickers)
            ? chunk(tickers, batchLimit)
            : tickers

        if (Array.isArray(tickersList)) {
          console.log('fetching', tickers.length, ' tickers')

          for (const ticker of tickersList) {
            const arg = Array.isArray(ticker)
              ? ticker.map(item => item.symbol).join(',')
              : ticker

            console.log('fetch', arg)

            let data = await fetch(
              getApiUrl(`historical-price-full/${arg}?serietype=line`)
            )

            console.log('fetch', arg, ' complete')

            if (data.historicalStockList) {
              res.push(...data.historicalStockList)
            } else {
              res.push(data)
            }
          }
        } else {
          res = await await fetch(
            getApiUrl(`historical-price-full/${tickers}?serietype=line`)
          )
        }

        return res
      },
    }
  }
}

export default FMPApi
