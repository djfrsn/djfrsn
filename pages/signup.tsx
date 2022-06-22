import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import Router from 'next/router';
import { createClient } from 'prismicio';
import React, { useState } from 'react';

import Layout from '../components/Layout';

const SignupMutation = gql`
  mutation SignupMutation($name: String, $email: String!) {
    signupUser(name: $name, email: $email) {
      id
      name
      email
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

function Signup(props) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  const [signup] = useMutation(SignupMutation)

  return (
    <Layout data={{ page: props.page.data, global: props.global.data }}>
      <div>
        <form
          onSubmit={async e => {
            e.preventDefault()

            await signup({
              variables: {
                name: name,
                email: email,
              },
            })
            Router.push('/')
          }}
        >
          <h1>Signup user</h1>
          <input
            autoFocus
            onChange={e => setName(e.target.value)}
            placeholder="Name"
            type="text"
            value={name}
          />
          <input
            onChange={e => setEmail(e.target.value)}
            placeholder="Email address)"
            type="text"
            value={email}
          />
          <input disabled={!name || !email} type="submit" value="Signup" />
          <a className="link" href="#" onClick={() => Router.push('/')}>
            or Cancel
          </a>
        </form>
      </div>
    </Layout>
  )
}

export default Signup
