import { PrismicImageProps, SliceLike } from '@prismicio/react';

import { IndexJob } from './interfaces';

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

export type CreateMarketIndexJob = Promise<IndexJob>
