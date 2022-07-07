import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { Prisma } from '@prisma/client';
import { ApolloServerPluginCacheControl } from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import { DateTimeResolver } from 'graphql-scalars';
import cors from 'micro-cors';
import { NextApiHandler } from 'next';
import { asNexusMethod, booleanArg, intArg, makeSchema, nonNull, objectType, stringArg } from 'nexus';
import path from 'path';

import context from './context';

export const GQLDate = asNexusMethod(DateTimeResolver, 'date')

const largeDatasetCacheHint = { maxAge: 43200 }

const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id')
    t.string('name')
    t.string('email')
  },
})

const Contract = objectType({
  name: 'Contract',
  definition(t) {
    t.string('id')
    t.string('label')
    t.string('name')
    t.boolean('isCall')
    t.boolean('active')
    t.int('strikePrice')
    t.field('dateLive', { type: 'DateTime' })
    t.field('dateExpires', { type: 'DateTime' })
    t.string('underlyingAsset')
    t.string('derivativeType')
    t.string('openInterest')
    t.string('min_increment')
    t.string('multiplier')
  },
})

const Job = objectType({
  name: 'Job',
  definition(t) {
    t.string('id')
    t.field('createdAt', { type: 'DateTime' })
    t.string('modelId')
    t.string('modelName')
    t.string('jobId')
    t.string('name')
    t.string('queueName')
  },
})

const MarketIndex = objectType({
  name: 'MarketIndex',
  definition(t) {
    t.int('id')
    t.string('name')
    t.string('displayName')
    t.field('lastRefreshed', { type: 'DateTime' })
    t.list.field('ticker', {
      type: 'Ticker',
      resolve: async (parent, __, ctx, info) => {
        info.cacheControl.setCacheHint(largeDatasetCacheHint)
        return ctx.prisma.ticker.findMany({
          where: { marketIndexId: Number(parent.id) },
        })
      },
    })
  },
})

const Ticker = objectType({
  name: 'Ticker',
  definition(t) {
    t.int('id')
    t.string('symbol')
    t.string('name')
    t.string('sector')
    t.string('subSector')
    t.string('headQuarter')
    t.string('founded')
    t.list.field('timeSeries', {
      type: 'TickerInfo',
      args: {
        limit: intArg(),
        bypassLimit: booleanArg(),
      },
      resolve: (
        parent,
        args: { limit: number; bypassLimit: boolean },
        ctx,
        info
      ) => {
        info.cacheControl.setCacheHint(largeDatasetCacheHint)
        const options: { take?: Prisma.UserFindManyArgs['take'] } = {}
        const takeLimit = Number(process.env.NEXT_PUBLIC_FEED_TIME_SERIES_LIMIT)

        if (args.limit) options.take = args.limit
        else
          options.take = Number(
            process.env.NEXT_PUBLIC_FEED_TIME_SERIES_LIMIT_DEFAULT
          )

        if (options.take > takeLimit && !args.bypassLimit)
          options.take = takeLimit

        return ctx.prisma.tickerInfo.findMany({
          orderBy: { date: 'desc' },
          where: { tickerId: parent.id },
          ...options,
        })
      },
    })
  },
})

const TickerInfo = objectType({
  name: 'TickerInfo',
  definition(t) {
    t.int('id')
    t.field('date', { type: 'DateTime' })
    t.int('intervalId')
    t.string('interval')
    t.string('open')
    t.string('close')
    t.string('high')
    t.string('low')
    t.string('volume')
    t.nullable.string('tickerId')
    t.nullable.field('ticker', {
      type: 'Ticker',
      resolve: (parent, __, ctx, info) => {
        info.cacheControl.setCacheHint(largeDatasetCacheHint)
        return ctx.prisma.ticker
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .timeSeries()
          .then()
      },
    })
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.list.field('contracts', {
      type: 'Contract',
      resolve: (_, args, ctx) => {
        return ctx.prisma.contract.findMany()
      },
    })

    t.list.field('jobs', {
      type: 'Job',
      resolve: (_, args, ctx, info) => {
        info.cacheControl.setCacheHint({ maxAge: 0 })
        return ctx.prisma.job.findMany()
      },
    })

    t.field('marketIndex', {
      args: {
        name: stringArg(),
      },
      type: 'MarketIndex',
      resolve: async (_, args: { name: string }, ctx, info) => {
        return ctx.prisma.marketIndex.findFirst({
          where: { name: args.name },
        })
      },
    })

    t.list.field('marketIndexTickers', {
      args: {
        marketIndexId: intArg(),
        limit: intArg(),
      },
      type: 'Ticker',
      resolve: async (
        _,
        args: { marketIndexId: number; limit: number },
        ctx,
        info
      ) => {
        info.cacheControl.setCacheHint(largeDatasetCacheHint)
        const options: {
          take?: Prisma.UserFindManyArgs['take']
          where?: { marketIndexId: number }
        } = {}
        if (args.marketIndexId)
          options.where = { marketIndexId: args.marketIndexId }
        if (args.limit) options.take = args.limit

        return ctx.prisma.ticker.findMany(options)
      },
    })
  },
})

const Mutation = objectType({
  name: 'Mutation',
  definition(t) {
    t.field('signupUser', {
      type: 'User',
      args: {
        name: stringArg(),
        email: nonNull(stringArg()),
      },
      resolve: (_, { name, email }, ctx) => {
        return ctx.prisma.user.create({
          data: {
            name,
            email,
          },
        })
      },
    })
  },
})

export const schema = makeSchema({
  types: [
    Query,
    Mutation,
    GQLDate,
    User,
    Job,
    Contract,
    MarketIndex,
    Ticker,
    TickerInfo,
  ],
  outputs: {
    typegen: path.join(process.cwd(), 'generated/nexus-typegen.ts'),
    schema: path.join(process.cwd(), 'generated/schema.graphql'),
  },
})

export const config = {
  api: {
    bodyParser: false,
    responseLimit: '8mb',
  },
}

const apolloServer = new ApolloServer({
  schema,
  context,
  cache: new InMemoryLRUCache(),
  plugins: [
    responseCachePlugin(),
    ApolloServerPluginCacheControl({ defaultMaxAge: 60 * 15 }),
  ],
})

let apolloServerHandler: NextApiHandler

async function getApolloServerHandler() {
  if (!apolloServerHandler) {
    const startServer = await apolloServer.start()

    apolloServerHandler = apolloServer.createHandler({
      path: '/api',
    })
  }

  return apolloServerHandler
}

const handler: NextApiHandler = async (req, res) => {
  const apolloServerHandler = await getApolloServerHandler()

  if (req.method === 'OPTIONS') {
    res.end()
    return
  }

  return apolloServerHandler(req, res)
}

export default cors()(handler)
