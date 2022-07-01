import { Job, MarketIndex, MarketInterval, TickerInfo } from '@prisma/client';

export interface TickerListInfo {
  id: string
  lastRefreshed: Date
}
export interface Ticker {
  id: number
  symbol: string
  timeSeries: TickerInfo[]
}

export interface IndexJob {
  error?: { message: string }
  job?: Job
}

export interface MarketIndexCronJob {
  timeframe: string
  marketIndex: MarketIndex
}
export interface RefreshMarketIndexJob {
  id: number
  name: string
}

export interface RefreshMarketIndexJob {
  id: number
  name: string
}

export interface TickerData {
  symbol: string
  tickerId: string
}
export interface RefreshMarketIndexTickerJob {
  tickers: TickerData[]
  symbolDict: { [name: string]: { tickerId: string } }
  marketInterval: MarketInterval
  progressIncrement: number
}

export interface CreateSp500TickerOptions {
  query?: string
  job: any
}

export interface MarketIndexJobOptions {
  marketIndex: MarketIndex
}

export interface FMPTicker {
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

export interface FMPPrice {
  date: string
  close: string
  open?: string
}
