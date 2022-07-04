import { useQuery } from '@apollo/client';
import Layout from 'components/Layout';
import LoadingIndicator from 'components/Loading';
import gql from 'graphql-tag';

import { createClient } from '../prismicio';

const ContractsQuery = gql`
  query ContractsQuery {
    contracts {
      id
      label
    }
  }
`

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    client.getSingle('contract'),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const Contract = ({ page, global }) => {
  const { loading, error, data } = useQuery(ContractsQuery, {
    fetchPolicy: 'cache-and-network',
  })

  if (loading) {
    return <LoadingIndicator />
  }
  if (error) {
    return <div className="errorText">Error: {error.message}</div>
  }

  return (
    <Layout data={{ page: page.data, global: global.data }}>
      {data.contracts.map(contract => (
        <section key={contract.id} className="mt-16">
          {contract.label}
        </section>
      ))}
      {data.contracts.length <= 0 && (
        <div className="mt-16">Contract list unavailable</div>
      )}
    </Layout>
  )
}

export default Contract
