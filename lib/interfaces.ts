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

export interface MarketIndexJob {
  error?: { message: string }
  job?: Job
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
