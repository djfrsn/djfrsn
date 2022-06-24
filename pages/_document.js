import { sp500QueueScheduler } from 'lib/db/queue';
import { Head, Html, Main, NextScript } from 'next/document';

const onShutdown = async () => {
  await sp500QueueScheduler.close()
}

if (process.env.NEXT_MANUAL_SIG_HANDLE) {
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM: ', 'cleaning up')
    await onShutdown()
    process.exit(0)
  })

  process.on('SIGINT', async () => {
    console.log('Received SIGINT: ', 'cleaning up')
    await onShutdown()
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
