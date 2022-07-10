import { SliceZone } from '@prismicio/react';
import classnames from 'classnames';
import { FooterType, GlobalType, PageType } from 'lib/types';
import theme from 'lib/utils/theme';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { components } from 'slices';

import Footer from './Footer';
import styles from './layout.module.css';
import LoadingIndicator from './Loading';
import Modal from './Modal';
import Navigation from './Navigation';

export default function Layout({
  className = '',
  data,
  children,
}: {
  className?: string
  data: { page: PageType; global: GlobalType; footer?: FooterType }
  children?: React.ReactNode
}) {
  const router = useRouter()
  const withFooter = data.footer

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
        <Navigation
          navigation={data.global.navigation}
          global={data.global}
          listStyle
        />
        <main
          className={classnames(
            { [styles.withFooter]: withFooter },
            styles.mainContainer
          )}
        >
          <div className={styles.mainColumn}>
            {children}
            <SliceZone
              slices={data.page.slices || []}
              components={components}
            />
          </div>
        </main>
        {withFooter && <Footer data={data.footer} />}
      </div>

      <Modal />
    </>
  )
}
