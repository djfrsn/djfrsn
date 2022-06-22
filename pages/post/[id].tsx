import { useMutation, useQuery } from '@apollo/client';
import LoadingIndicator from 'components/Loading';
import gql from 'graphql-tag';
import { GetStaticPaths } from 'next';
import Router, { useRouter } from 'next/router';
import { createClient } from 'prismicio';

import Layout from '../../components/Layout';
import prisma from '../../lib/prisma';

const PostQuery = gql`
  query PostQuery($postId: String!) {
    post(postId: $postId) {
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

const PublishMutation = gql`
  mutation PublishMutation($postId: String!) {
    publish(postId: $postId) {
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

const DeleteMutation = gql`
  mutation DeleteMutation($postId: String!) {
    deletePost(postId: $postId) {
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

  const global = await client.getSingle('global')

  return {
    props: { global },
  }
}

function Post(props) {
  const postId = useRouter().query.id
  const { loading, error, data } = useQuery(PostQuery, {
    variables: { postId },
  })

  const [publish] = useMutation(PublishMutation)
  const [deletePost] = useMutation(DeleteMutation)

  if (loading) {
    return <LoadingIndicator />
  }
  if (error) {
    console.log('error', error)
    return <div className="errorText">Error: {error.message}</div>
  }

  let title = data.post.title

  if (!data.post.published) {
    title = `${title} (Draft)`
  }

  const authorName = data.post.author ? data.post.author.name : 'Unknown author'

  return (
    <Layout
      data={{
        page: { title, description: `${title} by ${authorName}` },
        global: props.global.data,
      }}
    >
      <section className="text-ash-100 mt-12">
        <h2>{title}</h2>
        <p className="mt-4">By {authorName}</p>
        <p className="mt-4">{data.post.content}</p>
        {!data.post.published && (
          <button
            className="text-iron-100 bg-ash-100 rounded-sm p-4 mr-4 mt-2"
            onClick={async e => {
              await publish({
                variables: {
                  postId,
                },
              })
              Router.push('/')
            }}
          >
            Publish
          </button>
        )}
        <button
          className="text-iron-100 bg-ash-100 rounded-sm p-4 mt-2"
          onClick={async e => {
            await deletePost({
              variables: {
                postId,
              },
            })
            Router.push('/')
          }}
        >
          Delete
        </button>
      </section>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await prisma.post.findMany({
    where: { published: true },
  })

  return {
    paths: posts.map(({ id }) => ({ params: { id: id.toString() } })),
    fallback: false,
  }
}

export default Post
