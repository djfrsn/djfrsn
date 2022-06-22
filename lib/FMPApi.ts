import { RateLimit } from 'async-sema';
import fetch from 'lib/fetch';

const rateLimit = RateLimit(15, { timeUnit: 60000, uniformDistribution: true })

interface apiArgs {
  outputsize: 'compact' | 'full' | 'compact'
}

interface FMPTickerType {}

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
