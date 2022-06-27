import gracefulShutdown from 'lib/utils/gracefulShutdown';
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

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
