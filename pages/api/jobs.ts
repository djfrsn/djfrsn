import { deleteKeysByPattern } from 'lib/db/redis';
import validKey from 'lib/utils/validKey';
import { NextApiRequest, NextApiResponse } from 'next';

// curl -X "DELETE" -H "Content-Type: application/json" -d "{\"access_key\": \"secret\"}" https://blockwizards.herokuapp.com/api/jobs

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
      await deleteKeysByPattern('bull:')
      return response.status(200).send(true)
    }
    return response.status(200).send(true)
  } else {
    return response.status(405).send({ message: 'Method not allowed' })
  }
}
