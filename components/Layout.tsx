import { SliceZone } from '@prismicio/react';
import classnames from 'classnames';
import { Logo, LogoText } from 'components/Logo';
import MobileNavigation from 'components/MobileNavigation';
import { GlobalType, PageType } from 'lib/types';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { components } from 'slices';

import ModalContext from './context/modal-context';
import styles from './layout.module.css';
import LoadingIndicator from './Loading';
import Navigation from './Navigation';

export default function Layout({
  data,
  children,
}: {
  data: { page: PageType; global: GlobalType }
  children?: React.ReactNode
}) {
  const router = useRouter()
  // TODO: use react context for modal state instead
  const [modalOpen, toggleModal] = useState(false)

  if (router.isFallback) {
    return <LoadingIndicator />
  }

  console.log('data.page.title', data.page.title)

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
      <div className="relative container mx-auto px-6 py-8">
        <ModalContext.Provider value={{ modalOpen }}>
          <MobileNavigation
            title={data.global.title}
            logo={data.global.logo}
            navigation={data.global.navigation}
            toggleModal={toggleModal}
            modalOpen={modalOpen}
          />
          <Navigation navigation={data.global.navigation} />
          <main className={styles.mainContainer}>
            <div className={styles.mainColumn}>
              {children}
              <SliceZone
                slices={data.page.slices || []}
                components={components}
              />
            </div>
            <div className={styles.sideColumn}>
              <div className="ml-auto">
                <LogoText title={data.global.title} />
              </div>
              <div className="flex items-center mt-auto mb-8 ml-auto">
                <Logo src={data.global.logo.url} alt={data.global.logo.alt} />
              </div>
            </div>
          </main>
          <div
            id="modal-root"
            className={classnames('modal', { active: modalOpen })}
          ></div>
        </ModalContext.Provider>
      </div>
    </>
  )
}
