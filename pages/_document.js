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

const FontLoader = ({ theme }) => {
  switch (true) {
    case theme === 'homeroom':
      return (
        <link
          href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500&display=swap"
          rel="stylesheet"
        />
      )
    case theme === 'explorer':
      return (
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;600&display=swap"
          rel="stylesheet"
        />
      )
    default:
      return (
        <link
          href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@300;400;600&family=Lora:wght@400;500&display=swap"
          rel="stylesheet"
        />
      )
  }
}

export default function Document(props) {
  const themeName = theme(props)
  return (
    <Html data-theme={themeName} lang="en">
      <Head>
        <FontLoader theme={themeName} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
