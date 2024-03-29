import fetch from 'lib/utils/fetch';

interface apiArgs {
  outputsize: 'compact' | 'full' | 'compact'
}
class AlphaVantageApi {
  apiKey: string
  apiUrl: string
  constructor() {
    this.apiUrl = process.env.ALPHA_VANTAGE_API_URL
    this.apiKey = process.env.ALPHA_VANTAGE_API_KEY
  }
  async fetchTimeSeriesDaily(
    symbol: string,
    outputsize?: apiArgs['outputsize']
  ) {
    const data = await fetch(
      `${this.apiUrl}/query?function=TIME_SERIES_DAILY&symbol=${symbol}&outputsize=${outputsize}&apikey=${this.apiKey}`,
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
        if (Array.isArray(symbols)) {
          for (const symbol of symbols) {
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
