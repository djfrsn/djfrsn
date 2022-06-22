import { createClient } from '../prismicio';
import DailyTickerFeedPage from './daily-ticker-feed';

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    client.getSingle('homepage'),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const Homepage = ({ page, global }) => {
  return <DailyTickerFeedPage page={page} global={global} />
}

export default Homepage
