import { today } from 'lib/dates';
import prisma from 'lib/prisma';
import { TickerListInfoType } from 'lib/types';

export default async function getTickerListInfo(): Promise<TickerListInfoType> {
  let tickerListInfo = await prisma.tickerListInfo.findFirst()

  if (!tickerListInfo) {
    tickerListInfo = await prisma.tickerListInfo.create({
      data: { lastRefreshed: today.isoString },
    })
  }

  return tickerListInfo
}
