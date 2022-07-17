import './global.css';

import { ApolloClient, ApolloProvider } from '@apollo/client';
import { PrismicPreview } from '@prismicio/next';
import { PrismicProvider } from '@prismicio/react';
import { clientCache } from 'lib/cache';
import Link from 'next/link';
import { event, GoogleAnalytics, usePageViews } from 'nextjs-google-analytics';

import { linkResolver, repositoryName } from '../prismicio';

import type { NextWebVitalsMetric } from 'next/app'

const client = new ApolloClient({
  cache: clientCache,
  uri: '/api',
})

function MyApp({ Component, pageProps }) {
  usePageViews()

  return (
    <ApolloProvider client={client}>
      <PrismicProvider
        linkResolver={linkResolver}
        internalLinkComponent={({ href, children, ...props }) => (
          <Link href={href}>
            <a {...props}>{children}</a>
          </Link>
        )}
      >
        <PrismicPreview repositoryName={repositoryName}>
          <GoogleAnalytics />
          <Component {...pageProps} />
        </PrismicPreview>
      </PrismicProvider>
    </ApolloProvider>
  )
}

export function reportWebVitals({
  id,
  name,
  label,
  value,
}: NextWebVitalsMetric) {
  event(name, {
    category: label === 'web-vital' ? 'Web Vitals' : 'Next.js custom metric',
    value: Math.round(name === 'CLS' ? value * 1000 : value),
    label: id, // id unique to current page load
    nonInteraction: true, // avoids affecting bounce rate.
  })
}

export default MyApp
