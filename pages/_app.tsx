import './global.css';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { Global, MantineProvider } from '@mantine/core';
import { PrismicPreview } from '@prismicio/next';
import { PrismicProvider } from '@prismicio/react';
import theme, { globalStyles } from 'mantine.theme';
import Link from 'next/link';

import { linkResolver, repositoryName } from '../prismicio';

const client = new ApolloClient({
  cache: new InMemoryCache(),
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
          <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
            <Global styles={globalStyles} />
            <Component {...pageProps} />{' '}
          </MantineProvider>
        </PrismicPreview>
      </PrismicProvider>
    </ApolloProvider>
  )
}

export default MyApp
