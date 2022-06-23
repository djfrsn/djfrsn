import { useQuery } from '@apollo/client';
import Container from 'components/Container';
import Tickers from 'components/TickerFeed/Tickers';
import gql from 'graphql-tag';
import { TickerType } from 'lib/types';

const TickerFeedQuery = gql`
  query TickerFeed($limit: Int) {
    tickerFeed {
      id
      symbol
      timeSeries(limit: $limit) {
        id
        date
        tickerId
        close
      }
    }
  }
`

const TickerFeed = ({ limit }) => {
  const {
    loading,
    error,
    data,
  }: {
    loading?: boolean
    error?: { message: string }
    data: { tickerFeed: TickerType[] }
  } = useQuery(TickerFeedQuery, {
    fetchPolicy: 'cache-and-network',
    variables: { limit },
  })

  return (
    <Container loading={loading} error={error}>
      <Tickers data={data?.tickerFeed || []} />
    </Container>
  )
}

export default TickerFeed
