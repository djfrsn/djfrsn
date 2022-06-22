import { isArray } from '@apollo/client/cache/inmemory/helpers';
import { RateLimit } from 'async-sema';
import fetch from 'node-fetch';

const rateLimit = RateLimit(5, { timeUnit: 60000, uniformDistribution: true })

interface apiArgs {
  outputsize: 'compact' | 'full' | 'compact'
}
class AlphaVantageApi {
  apiKey: string
  constructor({ apiKey }: { apiKey: string }) {
    this.apiKey = apiKey
  }
  async fetchTimeSeriesDaily(
    symbol: string,
    outputsize?: apiArgs['outputsize']
  ) {
    const data = await fetch(
      `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputsize}&apikey=${this.apiKey}`,
      {
        method: 'GET',
      }
    )
    const res = await data.json()

    return res
  }

  get core() {
    return {
      daily: async (
        symbols: string | string[],
        outputsize?: apiArgs['outputsize']
      ) => {
        // TODO: alpha api should rate limit itself....fetch method should rate limit itself so it can fetch from the watchlist as quickly as possible
        let res = []
        if (isArray(symbols)) {
          console.log('fetching', symbols.length, ' symbols')
          for (const symbol of symbols) {
            await rateLimit()
            const data = await this.fetchTimeSeriesDaily(symbol, outputsize)
            console.log('fetch', symbol)
            res.push(data)
          }
        } else {
          res = await this.fetchTimeSeriesDaily(symbols, outputsize)
        }

        return res
      },
    }
  }
}

export default AlphaVantageApi
