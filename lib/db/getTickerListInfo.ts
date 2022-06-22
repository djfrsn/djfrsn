import prisma from 'lib/prisma';
import { TickerListInfoType } from 'lib/types';
import moment from 'moment';

export default async function getTickerListInfo(): Promise<TickerListInfoType> {
  let tickerListInfo = await prisma.tickerListInfo.findFirst()

  if (!tickerListInfo) {
    tickerListInfo = await prisma.tickerListInfo.create({
      data: { lastRefreshed: moment().toISOString() },
    })
  }

  return tickerListInfo
}
