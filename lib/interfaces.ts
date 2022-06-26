import { Job, MarketIndex, TickerInfo } from '@prisma/client';

export interface TickerListInfo {
  id: number
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

export interface RefreshMarketIndexJob {
  symbols: string[]
  dict: { [name: string]: string }
}
export interface RefreshMarketIndexTickerJob {
  symbols: string[]
  dict: { [name: string]: string }
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
