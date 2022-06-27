export async function getServerSideProps(context) {
  const [page, global] = await Promise.all([
    context.client.getSingle('homepage'),
    context.client.getSingle('global'),
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
