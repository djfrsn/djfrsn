import addSP500UpdateJobs from 'lib/ticker-feed/addSP500UpdateJobs';
import { NextApiRequest, NextApiResponse } from 'next';

// curl -H "Content-Type: application/json" -d "{\"foo\": \"bar\"}" http://localhost:3000/api/ticker-feed/update
// curl -H "Content-Type: application/json" -d "{\"foo\": \"bar\"}" https://blockwizards.herokuapp.com/api/ticker-feed/update

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  if (request.method === 'POST') {
    const sp500Jobs = await addSP500UpdateJobs()

    return response.status(200).send(sp500Jobs)
    // return response.status(200).send(res)
  } else {
    return response.status(405).send('Method not allowed')
  }
}
