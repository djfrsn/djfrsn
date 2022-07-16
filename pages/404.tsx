import Layout from 'components/Layout';
import Link from 'next/link';

import { createClient } from '../prismicio';

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const global = await client.getSingle('global')

  return {
    props: { global },
  }
}

export default function Custom404(props) {
  return (
    <Layout
      data={{
        page: { title: '404', description: 'Page Not Found' },
        global: props.global.data,
      }}
    >
      <div className="w-full mt-32 lg:mt-64 flex flex-col items-center justify-center">
        <h3 className="text-center text-maxYellow-100">
          Error: 404 ⚠️ Page Not Found
        </h3>
        <Link href="/">
          <a className="mt-12 text-lg link font-bold no-underline">
            Return Home
          </a>
        </Link>
      </div>
    </Layout>
  )
}
