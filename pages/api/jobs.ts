import { refreshMarketQueue, refreshMarketsQueue } from 'lib/db/queue';
import validKey from 'lib/utils/validKey';
import { NextApiRequest, NextApiResponse } from 'next';

// curl -X "DELETE" -H "Content-Type: application/json" -d "{\"access_key\": \"secret\"}" https://dennisjefferson.xyz/api/jobs
// curl -X "DELETE" -H "Content-Type: application/json" -d "{\"access_key\": \"secret\"}" http://localhost:3000/api/jobs

/**
 * Description: CRUD access to jobs in Redis
 * @constructor
 */
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'DELETE') {
    if (validKey(request.body.access_key)) {
      await Promise.all([
        refreshMarketsQueue.obliterate(),
        refreshMarketQueue.obliterate(),
      ])
      return response.status(200).send(true)
    } else {
      return response.status(200).send(false)
    }
  } else {
    return response.status(405).send({ message: 'Method not allowed' })
  }
}
