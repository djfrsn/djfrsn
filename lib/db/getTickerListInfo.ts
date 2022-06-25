import prisma from 'lib/db/prisma';
import { TickerListInfo } from 'lib/interfaces';
import { today } from 'lib/utils/dates';

export default async function getTickerListInfo(): Promise<TickerListInfo> {
  let tickerListInfo = await prisma.tickerListInfo.findFirst()

  if (!tickerListInfo) {
    tickerListInfo = await prisma.tickerListInfo.create({
      data: { lastRefreshed: today.isoString },
    })
  }

  return tickerListInfo
}
