import { PrismicImageProps, PrismicLinkProps, SliceLike } from '@prismicio/react';

import { IndexJob } from './interfaces';

export type PageType = {
  title: string
  description: string
  showLogo?: boolean
  slices?: SliceLike[]
}

export type FooterType = {
  links: {
    link: PrismicLinkProps['field']
    linkTitle: string
    linkImage: PrismicImageProps['field']
  }[]
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
