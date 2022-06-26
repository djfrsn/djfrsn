import { createClient } from '../prismicio';

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    client.getSingle('homepage'),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
    redirect: {
      destination: `/${page.data.redirectPath.uid}`,
      permanent: true,
    },
  }
}

const Homepage = ({ page, global }) => {
  return null
}

export default Homepage
