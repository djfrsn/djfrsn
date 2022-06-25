import { useQuery } from '@apollo/client';
import Layout from 'components/Layout';
import Loading from 'components/Loading';
import gql from 'graphql-tag';
import { QUEUE } from 'lib/const';
import moment from 'moment';
import fetch from 'node-fetch';
import useSWR from 'swr';

import { createClient } from '../prismicio';

const fetcher = url => fetch(url).then(res => res.json())

const JobQuery = gql`
  query JobQuery {
    jobs {
      id
      name
      queueName
      jobId
    }
  }
`

export async function getStaticProps({ previewData }) {
  const client = createClient({ previewData })

  const [page, global] = await Promise.all([
    client.getSingle('jobs'),
    client.getSingle('global'),
  ])

  return {
    props: { page, global },
  }
}

const formatJobData = {
  [QUEUE.marketIndexRefresh.sp500TickerInfo]: data => {
    return (
      <div>
        <span className="text-iced-100">Tickers</span> {data.symbols.join(',')}
      </div>
    )
  },
}

function JobInfo({ data }) {
  const createdAt = moment(data.job.createdAt)

  return (
    <div>
      <p>
        <span className="text-iced-200">State</span> {data.state}
      </p>
      <p className="text-xs">
        <span className="text-iced-200">Created</span> {createdAt.fromNow()} -{' '}
        {createdAt.format('M-D h:ma')}
      </p>
      <p>{data.message}</p>
      <div className="text-xs">
        <p>Progress: {data.job.progress}</p>
        <p>Attempts: {data.job.attemptsMade}</p>
      </div>
      <div className="mt-6">
        <span className="text-iced-100 mb-1 block">Children</span>
        {data.job.children.map(childJob => (
          <div key={childJob.id} className="mb-2 text-xs">
            <p>{childJob.name}</p>
            <p>
              <span className="text-iced-200">Progress</span>{' '}
              {childJob.progress}
            </p>
            <p>
              <span className="text-iced-200">Attempts</span>{' '}
              {childJob.attemptsMade}
            </p>
            {formatJobData[childJob.name] && (
              <p>{formatJobData[childJob.name](childJob.data)}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

const Job = ({ job }) => {
  const { data, error } = useSWR(
    `/api/ticker-feed/status?jobId=${job.jobId}`,
    fetcher
  )

  if (error) return <div>failed to load</div>
  if (!data) return <Loading />
  return (
    <article className="mt-12">
      <h2>
        <span>Queue</span> {job.queueName}
      </h2>
      <h3>
        <span>Job</span> {job.name}
      </h3>
      {data ? (
        <div>
          {data.state ? (
            <JobInfo data={data} />
          ) : (
            <span className="text-crayolaRed-100">{data.message}</span>
          )}
        </div>
      ) : (
        <Loading />
      )}
    </article>
  )
}

const Jobs = ({ page, global }) => {
  const { loading, error, data } = useQuery(JobQuery, {
    fetchPolicy: 'cache-and-network',
  })

  if (loading) {
    return <Loading />
  }
  if (error) {
    return <div className="errorText">Error: {error.message}</div>
  }

  console.log('data', data)

  return (
    <Layout data={{ page: page.data, global: global.data }}>
      <h1 className="text-maxYellow-100">Jobs</h1>
      {data.jobs.map(job => {
        return <Job key={job.id} job={job} />
      })}
    </Layout>
  )
}

export default Jobs
