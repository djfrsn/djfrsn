import { createClient } from '../../prismicio';

export async function getStaticPathsData(type: string) {
  const client = createClient()
  const pages = await client.getAllByType(type)

  const paths = pages.map(page => {
    const category = page.data.category
    const paramName = page.type === 'root-page' ? 'uid' : page.type
    const params = { [paramName]: page.uid }

    // If we aren't rendering /[uid], set the uid as the category uid
    if (category) {
      params.uid = category.uid
    }

    return {
      params,
    }
  })

  // We'll pre-render only these paths at build time.
  // { fallback: false } means other routes should 404.
  return { paths, fallback: false }
}
