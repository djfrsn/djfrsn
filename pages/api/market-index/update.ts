import handleMarketIndexJobRequest from 'lib/marketIndex/handleMarketIndexJobRequest';
import { NextApiRequest, NextApiResponse } from 'next';

// curl -H "Content-Type: application/json" -d "{\"marketIndexId\": \"2\"}" http://localhost:3000/api/market-index/update
// curl -H "Content-Type: application/json" -d "{\"marketIndexId\": \"2\"}" https://blockwizards.herokuapp.com/api/market-index/update

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    const { error, job } = await handleMarketIndexJobRequest(request.body)

    console.log('error', error)
    console.log('jobId', job.jobId)

    return error
      ? response.status(405).send(error)
      : response.status(200).send(job)
  } else {
    return response.status(405).send({ message: 'Method not allowed' })
  }
}
