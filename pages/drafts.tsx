import { useQuery } from '@apollo/client';
import LoadingIndicator from 'components/Loading';
import gql from 'graphql-tag';
import Link from 'next/link';
import { createClient } from 'prismicio';

import Layout from '../components/Layout';

const DraftsQuery = gql`
  query DraftsQuery {
    drafts {
      id
      title
      content
      published
      author {
        id
        name
      }
    }
  }
`

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    client.getSingle('drafts'),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const Post = ({ post }) => (
  <Link href="/post/[id]" as={`/post/${post.id}`}>
    <a>
      <h2 className="mt-4">{post.title}</h2>
      <small>By {post.author ? post.author.name : 'Unknown Author'}</small>
      <p className="mt-4">{post.content}</p>
    </a>
  </Link>
)

const Drafts = props => {
  const { loading, error, data } = useQuery(DraftsQuery, {
    fetchPolicy: 'cache-and-network',
  })

  if (loading) {
    return <LoadingIndicator />
  }
  if (error) {
    return <div className="errorText">Error: {error.message}</div>
  }

  return (
    <Layout data={{ page: props.page.data, global: props.global.data }}>
      <div className="page text-ash-100">
        <h1>Drafts</h1>
        <main>
          <section>
            {data.drafts.map(post => (
              <article key={post.id} className="post">
                <Post post={post} />
              </article>
            ))}
          </section>
        </main>
      </div>
    </Layout>
  )
}

export default Drafts
