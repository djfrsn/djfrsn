import { Job, MarketIndex, TickerInfo } from '@prisma/client';
import { PrismicImageProps, SliceLike } from '@prismicio/react';

export type PageType = {
  title: string
  description: string
  slices?: SliceLike[]
}

export type NavigationItemType = {
  title: string
  link: {
    uid: string
    type: string
    slug: string
  }
}

export type GlobalType = {
  title: string
  logo: PrismicImageProps['field']
  navigation: NavigationItemType[]
}

export interface TickerListInfoType {
  id: number
  lastRefreshed: Date
}
export interface TickerType {
  id: number
  symbol: string
  timeSeries: TickerInfo[]
}
export interface TickerFeedQueryType {
  tickerFeed: TickerType[]
}

export interface MarketIndexJob {
  error?: { message: string }
  job?: Job
}
export interface MarketIndexJobOptions {
  marketIndex: MarketIndex
}

export type CreateMarketIndexJob = Promise<MarketIndexJob>
