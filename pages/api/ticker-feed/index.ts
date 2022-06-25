import prisma from 'lib/db/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

// Daily specific ticker feed
export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  const tickers = await prisma.tickerInfo.findMany()

  return response.status(200).json(tickers)
}
