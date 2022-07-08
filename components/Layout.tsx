import { SliceZone } from '@prismicio/react';
import classnames from 'classnames';
import MobileNavigation from 'components/MobileNavigation';
import { GlobalType, PageType } from 'lib/types';
import theme from 'lib/utils/theme';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { components } from 'slices';

import styles from './layout.module.css';
import LoadingIndicator from './Loading';
import Navigation from './Navigation';

export default function Layout({
  className = '',
  data,
  children,
}: {
  className?: string
  data: { page: PageType; global: GlobalType }
  children?: React.ReactNode
}) {
  const router = useRouter()

  if (router.isFallback) {
    return <LoadingIndicator />
  }

  useEffect(() => {
    theme(router)
  }, [router.pathname])

  return (
    <>
      <Head>
        <title>{data.page.title}</title>
        <meta name="description" content={data.page.description} />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0a131e" />
        <meta name="msapplication-TileColor" content="#2b5797" />
        <meta name="theme-color" content="#ffffff" />
      </Head>
      <div className={classnames('relative w-full', className)}>
        <MobileNavigation
          title={data.global.title}
          logo={data.page.showLogo === false ? null : data.global.logo}
          navigation={data.global.navigation}
        />
        <Navigation
          navigation={data.global.navigation}
          global={data.global}
          listStyle
        />
        <main className={styles.mainContainer}>
          <div className={styles.mainColumn}>
            {children}
            <SliceZone
              slices={data.page.slices || []}
              components={components}
            />
          </div>
        </main>
      </div>
    </>
  )
}
