import Layout from 'components/Layout';
import { getStaticPathsData } from 'lib/utils/getStaticPathsData';
import { GetStaticPaths } from 'next';

import { createClient } from '../prismicio';

export async function getStaticProps({ params, previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    client.getByUID('root-page', params.uid),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const Page = ({ page, global }) => (
  <Layout data={{ page: page?.data, global: global?.data }} />
)

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getStaticPathsData('root-page')

  return paths
}

export default Page
