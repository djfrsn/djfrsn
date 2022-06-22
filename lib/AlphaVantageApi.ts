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
        let res = []
        if (isArray(symbols)) {
          console.log('fetching', symbols.length, ' symbols')
          for (const symbol of symbols) {
            await rateLimit()
            console.log('fetch', symbol)
            const data = await this.fetchTimeSeriesDaily(symbol, outputsize)
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
