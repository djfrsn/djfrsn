import { useQuery } from '@apollo/client';
import Layout from 'components/Layout';
import LoadingIndicator from 'components/Loading';
import gql from 'graphql-tag';
import Link from 'next/link';

import { createClient } from '../prismicio';

const FeedQuery = gql`
  query FeedQuery {
    feed {
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
    client.getSingle('feed'),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const Post = ({ post }) => (
  <article className="mt-12">
    <Link href="/post/[id]" as={`/post/${post.id}`}>
      <a className="link">
        <h2>{post.title}</h2>
      </a>
    </Link>
    <small>By {post.author ? post.author.name : 'Unknown Author'}</small>
  </article>
)

const Feed = ({ page, global }) => {
  const { loading, error, data } = useQuery(FeedQuery, {
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
      {data.feed.map(post => (
        <section key={post.id} className="post">
          <Post post={post} />
        </section>
      ))}
    </Layout>
  )
}

export default Feed
