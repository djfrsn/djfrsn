import prisma from 'lib/db/prisma';
import { TickerListInfoType } from 'lib/types';
import { today } from 'lib/utils/dates';

export default async function getTickerListInfo(): Promise<TickerListInfoType> {
  let tickerListInfo = await prisma.tickerListInfo.findFirst()

  if (!tickerListInfo) {
    tickerListInfo = await prisma.tickerListInfo.create({
      data: { lastRefreshed: today.isoString },
    })
  }

  return tickerListInfo
}
