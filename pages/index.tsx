import { createClient } from 'prismicio';

export async function getStaticProps() {
  const client = createClient()
  const [page, global] = await Promise.all([
    client.getSingle('homepage'),
    client.getSingle('global'),
  ])

  console.log('PATH', {
    destination: `/${page.data.redirectPath.uid}`,
    permanent: false,
  })

  return {
    props: {
      page,
      global,
      redirect: {
        destination: `/${page.data.redirectPath.uid}`,
        permanent: false,
      },
    },
  }
}

const Homepage = ({ page, global }) => {
  return null
}

export default Homepage
