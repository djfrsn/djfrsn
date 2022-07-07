import { createClient } from 'prismicio';
import React from 'react';

import Layout from '../components/Layout';

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    client.getSingle('bio'),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

function Bio(props) {
  return <Layout data={{ page: props.page.data, global: props.global.data }} />
}

export default Bio
