import prisma from 'lib/prisma';

async function createTicker(symbol: string) {
  let ticker = await prisma.ticker.findFirst({
    where: { symbol },
  })

  if (ticker === null) {
    ticker = await prisma.ticker.create({ data: { symbol } })
  }

  return ticker
}

export default createTicker
