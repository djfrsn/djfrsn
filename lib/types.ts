import { PrismicImageProps, SliceLike } from '@prismicio/react'

type PageType = {
  title: string
  description: string
  slices?: SliceLike[]
}

type NavigationItemType = {
  title: string
  link: {
    uid: string
    type: string
    slug: string
  }
}

type GlobalType = {
  title: string
  logo: PrismicImageProps['field']
  navigation: NavigationItemType[]
}

interface TickerInfoType {
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

interface TickerType {
  id: number
  symbol: string
  timeSeries: TickerInfoType[]
}
interface DailyTickerFeedQueryType {
  dailyTickerFeed: TickerType[]
}

export type {
  PageType,
  GlobalType,
  NavigationItemType,
  TickerType,
  TickerInfoType,
  DailyTickerFeedQueryType,
}
