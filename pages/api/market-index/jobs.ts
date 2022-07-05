import { flushall } from 'lib/db/redis';
import initMarketIndexCron from 'lib/marketIndex/initMarketIndexCron';
import validKey from 'lib/utils/validKey';
import { NextApiRequest, NextApiResponse } from 'next';

// curl -H "Content-Type: application/json" -d "{\"access_key\": \"secret\"}" http://localhost:3000/api/market-index/jobs
// curl -H "Content-Type: application/json" -d "{\"access_key\": \"secret\"}" https://blockwizards.herokuapp.com/api/market-index/jobs
// curl -X "DELETE" -H "Content-Type: application/json" -d "{\"access_key\": \"secret\"}" http://localhost:3000/api/market-index/jobs

/**
 * Description: Schedule a repeatable job to update market indexes and related ticker info data
 * @constructor
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    const { error, jobs } = await initMarketIndexCron(request.body)

    console.log('error', error)
    console.log('jobs', jobs)

    return error
      ? response.status(405).send(error)
      : response.status(200).send(jobs)
  } else if (request.method === 'DELETE') {
    if (validKey(request.body.access_key)) {
      await flushall()
      return response.status(200).send(true)
    }
    return response.status(200).send(true)
  } else {
    return response.status(405).send({ message: 'Method not allowed' })
  }
}
