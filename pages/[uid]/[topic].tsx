import Layout from 'components/Layout';
import { getStaticPathsData } from 'lib/utils/getStaticPathsData';
import { GetStaticPaths } from 'next';

import { createClient } from '../../prismicio';

export async function getStaticProps({ params, previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    client.getByUID('topic', params.topic),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const TopicPage = ({ page, global }) => (
  <Layout data={{ page: page?.data, global: global?.data }} />
)

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = await getStaticPathsData('topic')

  return paths
}

export default TopicPage
