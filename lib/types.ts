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

export interface TickerInfoType {
  id: number
  date: string
  interval: string
  open: string
  close: string
  high: string
  low: string
  volume: string
  tickerId?: number
}

export interface TickerListInfoType {
  id: number
  lastRefreshed: Date
}
export interface TickerType {
  id: number
  symbol: string
  timeSeries: TickerInfoType[]
}
export interface DailyTickerFeedQueryType {
  dailyTickerFeed: TickerType[]
}
