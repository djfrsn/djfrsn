import { RateLimit } from 'async-sema';
import fetch from 'lib/fetch';
import { isArray } from 'nexus/dist/utils';

// Docs: https://site.financialmodelingprep.com/developer/docs

const rateLimit = RateLimit(15, { timeUnit: 60000, uniformDistribution: true })

interface apiArgs {
  outputsize: 'compact' | 'full' | 'compact'
}

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
  }

  getApiUrl(apiStr: string, version = 'v3') {
    const apiKeySeperator = apiStr.includes('?') ? '&' : '?'
    return `${this.apiUrl}/api/${version}/${apiStr}${apiKeySeperator}apikey=${this.apiKey}`
  }

  get marketIndex() {
    return {
      async sp500(): Promise<FMPTickerType[]> {
        return await fetch(this.getApiUrl('sp500_constituent'))
      },
    }
  }

  get core() {
    const getApiUrl = this.getApiUrl.bind(this)

    return {
      async dailyHistoricalPrice(
        symbols: string | string[]
      ): Promise<{ symbol: string; historical: FMPPriceType[] }[]> {
        let res = []
        const makeUrl = val => `historical-price-full/${val}?serietype=line`

        if (isArray(symbols)) {
          console.log('fetching', symbols.length, ' symbols')
          for (const symbol of symbols) {
            await rateLimit()
            console.log('fetch', symbol)
            const data = await await fetch(getApiUrl(makeUrl(symbol)))
            console.log('fetch', symbol, ' complete')
            res.push(data)
          }
        } else {
          res = await await fetch(getApiUrl(makeUrl(symbols)))
        }

        return res
      },
    }
  }
}

export default FMPApi
