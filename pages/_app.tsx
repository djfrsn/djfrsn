import './global.css';

import { ApolloClient, ApolloProvider } from '@apollo/client';
import { PrismicPreview } from '@prismicio/next';
import { PrismicProvider } from '@prismicio/react';
import { clientCache } from 'lib/cache';
import Link from 'next/link';

import { linkResolver, repositoryName } from '../prismicio';

const client = new ApolloClient({
  cache: clientCache,
  uri: '/api',
})

function MyApp({ Component, pageProps }) {
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
          <Component {...pageProps} />
        </PrismicPreview>
      </PrismicProvider>
    </ApolloProvider>
  )
}

export default MyApp
