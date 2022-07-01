import { createClient } from 'prismicio';

export async function getServerSideProps() {
  const client = createClient()
  const [page, global] = await Promise.all([
    client.getSingle('homepage'),
    client.getSingle('global'),
  ])

  return {
    props: {
      page,
      global,
      redirect: {
        destination: `/${page.data.redirectPath.uid}`,
        fallback: true,
      },
    },
  }
}

const Homepage = ({ page, global }) => {
  return null
}

export default Homepage
