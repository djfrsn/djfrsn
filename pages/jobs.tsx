import Layout from 'components/Layout';
import Loading from 'components/Loading';
import { request } from 'graphql-request';
import gql from 'graphql-tag';
import { QUEUE } from 'lib/const';
import moment from 'moment';
import fetch from 'node-fetch';
import useSWR from 'swr';

import { createClient } from '../prismicio';

const fetcher = url => fetch(url).then(res => res.json())
const gqlFetcher = query => request('/api', query)

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
        <p className="text-iced-100">Tickers</p>
        <p className="break-words text-xxs lg:text-xs">
          {data.symbols.join(',')}
        </p>
      </div>
    )
  },
}

function JobInfo({ data }) {
  const createdAt = moment(data.job.createdAt)
  const children = data.job.children
  const hasChildren = children.length > 0
  const messageParts = data.message.split('/')

  return (
    <div>
      <p>
        <span className="text-iced-200">State</span> {data.state}
      </p>
      <p className="text-xs">
        <span className="text-iced-200">Created</span> {createdAt.fromNow()} -{' '}
        {createdAt.format('M-D h:ma')}
      </p>
      <p>
        <span className="text-maxYellow-100">{messageParts[0]}</span>
        <span className="text-iced-100">/</span>
        {messageParts[1]}
      </p>
      <div className="text-xs">
        <p>Progress: {data.job.progress}</p>
        <p>Attempts: {data.job.attemptsMade}</p>
      </div>
      <div className="mt-6">
        <span className="text-iced-100 mb-1 block">
          Children
          <span className="text-ash-100 text-xxs">
            ({data.job.children.length})
          </span>
        </span>
        {hasChildren && (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {children.map(childJob => (
              <div key={childJob.id} className="mb-2 text-xs">
                <p className="text-iced-neon">{childJob.name}</p>
                <p>
                  <span className="text-iced-200">Progress</span>{' '}
                  {childJob.progress}
                </p>
                <p>
                  <span className="text-iced-200">Attempts</span>{' '}
                  {childJob.attemptsMade}
                </p>
                {formatJobData[childJob.name] && (
                  <div>{formatJobData[childJob.name](childJob.data)}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const Job = ({ job }) => {
  const { data, error } = useSWR(
    `/api/market-index/status?jobId=${job.jobId}`,
    fetcher,
    { refreshInterval: 1000 }
  )

  if (error) return <div>failed to load</div>
  if (!data) return <Loading />

  return (
    <article className="mt-10 ml-2">
      <h2>
        <span className="text-iced-100">Queue</span>{' '}
        <span>{job.queueName}</span>
      </h2>
      <h3>
        <span className="text-iced-100">Job</span> <span>{job.name}</span>
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
  const { error, data } = useSWR(JobQuery, gqlFetcher, {
    refreshInterval: 15000,
  })

  if (!data) {
    return <Loading />
  }
  if (error) {
    return <div className="errorText">Error: {error.message}</div>
  }

  const jobs = data.jobs
  const jobsCount = jobs.length

  return (
    <Layout
      data={{
        page: { ...page.data, title: `${page.data.title}(${jobsCount})` },
        global: global.data,
      }}
    >
      <div className="mb-16">
        <h1 className="text-maxYellow-100">
          Jobs
          <span className="text-xs text-iced-100">
            ({jobsCount}
            {jobsCount === 0 && ' queued'})
          </span>
        </h1>
        {jobsCount > 0 &&
          jobs.map(job => {
            return <Job key={job.id} job={job} />
          })}
      </div>
    </Layout>
  )
}

export default Jobs
