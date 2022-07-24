import Layout from 'components/Layout';
import { GetStaticPaths } from 'next/types';

import { createClient } from '../../prismicio';

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const global = await client.getSingle('global')

  return {
    props: { global },
  }
}

export default function StockPage(props) {
  console.log('props', props)

  return (
    <Layout
      data={{
        page: { title: '404', description: 'Page Not Found' },
        global: props.global?.data,
      }}
    >
      Test
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    // Only `/posts/1` and `/posts/2` are generated at build time
    paths: [{ params: { symbol: '1' } }, { params: { symbol: '2' } }],
    // Enable statically generating additional pages
    // For example: `/posts/3`
    fallback: true,
  }
}
