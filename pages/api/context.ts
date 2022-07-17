import { PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';
import { Transaction as SentryTransaction } from '@sentry/types';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';

import prisma from '../../lib/db/prisma';

export interface Context {
  req: MicroRequest
  res: ServerResponse
  prisma: PrismaClient
  sentryTransaction: SentryTransaction
}

const createContext = ({
  req,
  res,
}: {
  req: MicroRequest
  res: ServerResponse
}): Context => {
  const sentryTransaction = Sentry.startTransaction({
    op: 'gql',
    name: 'GraphQLTransaction', // this will be the default name, unless the gql query has a name
  })

  return {
    req,
    res,
    prisma,
    sentryTransaction,
  }
}

export default createContext
