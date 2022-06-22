import { useMutation } from '@apollo/client';
import LoadingIndicator from 'components/Loading';
import gql from 'graphql-tag';
import Router from 'next/router';
import { createClient } from 'prismicio';
import React, { useState } from 'react';

import Layout from '../components/Layout';

const CreateDraftMutation = gql`
  mutation CreateDraftMutation(
    $title: String!
    $content: String
    $authorEmail: String!
  ) {
    createDraft(title: $title, content: $content, authorEmail: $authorEmail) {
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
    client.getSingle('signup'),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

function Create(props) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [authorEmail, setAuthorEmail] = useState('')

  const [createDraft, { loading, error }] = useMutation(CreateDraftMutation)

  if (loading) {
    return <LoadingIndicator />
  }
  if (error) {
    return <div className="errorText">Error: {error.message}</div>
  }

  return (
    <Layout data={{ page: props.page.data, global: props.global.data }}>
      <div>
        <form
          onSubmit={async e => {
            e.preventDefault()

            await createDraft({
              variables: {
                title,
                content,
                authorEmail,
              },
            })
            Router.push('/drafts')
          }}
        >
          <h1>Create Draft</h1>
          <input
            autoFocus
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            type="text"
            value={title}
          />
          <input
            onChange={e => setAuthorEmail(e.target.value)}
            placeholder="Author (email adress)"
            type="text"
            value={authorEmail}
          />
          <textarea
            cols={50}
            onChange={e => setContent(e.target.value)}
            placeholder="Content"
            rows={8}
            value={content}
          />
          <input
            disabled={!content || !title || !authorEmail}
            type="submit"
            value="Create"
          />
          <a className="link" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
    </Layout>
  )
}

export default Create
