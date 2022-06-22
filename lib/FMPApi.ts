import { RateLimit } from 'async-sema';
import fetch from 'lib/fetch';

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
  cik: string
  founded: string
}

class FMPApi {
  apiKey: string
  apiUrl: string
  constructor() {
    this.apiUrl = process.env.FMP_API_URL
    this.apiKey = process.env.FMP_API_KEY
  }

  getApiUrl(apiStr: string, version = 'v3') {
    return `${this.apiUrl}/api/${version}/${apiStr}?apikey=${this.apiKey}`
  }

  get marketIndex() {
    return {
      sp500: async (): Promise<FMPTickerType[]> =>
        await fetch(this.getApiUrl('sp500_constituent')),
    }
  }
}

export default FMPApi
