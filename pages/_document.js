import gracefulShutdown from 'lib/utils/gracefulShutdown';
import theme from 'lib/utils/theme';
import { Head, Html, Main, NextScript } from 'next/document';

if (process.env.NEXT_MANUAL_SIG_HANDLE) {
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM: ', 'cleaning up')
    gracefulShutdown()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    console.log('Received SIGINT: ', 'cleaning up')
    gracefulShutdown()
    process.exit(0)
  })
}

export default function Document(props) {
  return (
    <Html data-theme={theme(props)} lang="en">
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
