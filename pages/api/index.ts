import { Prisma } from '@prisma/client';
import { ApolloServer } from 'apollo-server-micro';
import { DateTimeResolver } from 'graphql-scalars';
import cors from 'micro-cors';
import { NextApiHandler } from 'next';
import { asNexusMethod, booleanArg, intArg, makeSchema, nonNull, nullable, objectType, stringArg } from 'nexus';
import path from 'path';

import context from './context';

export const GQLDate = asNexusMethod(DateTimeResolver, 'date')

const User = objectType({
  name: 'User',
  definition(t) {
    t.int('id')
    t.string('name')
    t.string('email')
    t.list.field('posts', {
      type: 'Post',
      resolve: (parent, __, ctx) =>
        ctx.prisma.user
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .posts(),
    })
  },
})

const Post = objectType({
  name: 'Post',
  definition(t) {
    t.int('id')
    t.string('title')
    t.nullable.string('content')
    t.boolean('published')
    t.nullable.field('author', {
      type: 'User',
      resolve: (parent, __, ctx) =>
        ctx.prisma.post
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .author(),
    })
  },
})

const Contract = objectType({
  name: 'Contract',
  definition(t) {
    t.int('id')
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

const MarketIndex = objectType({
  name: 'MarketIndex',
  definition(t) {
    t.int('id')
    t.string('name')
    t.string('displayName')
    t.field('lastRefreshed', { type: 'DateTime' })
    t.list.field('ticker', {
      type: 'Ticker',
      resolve: async (parent, __, ctx) => {
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
    t.list.field('timeSeries', {
      type: 'TickerInfo',
      args: {
        limit: intArg(),
        bypassLimit: booleanArg(),
      },
      resolve: (parent, args: { limit: number; bypassLimit: boolean }, ctx) => {
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
          where: { tickerId: Number(parent.id) },
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
    t.string('interval')
    t.string('open')
    t.string('close')
    t.string('high')
    t.string('low')
    t.string('volume')
    t.nullable.int('tickerId')
    t.nullable.field('ticker', {
      type: 'Ticker',
      resolve: (parent, __, ctx) =>
        ctx.prisma.ticker
          .findUnique({
            where: { id: Number(parent.id) },
          })
          .timeSeries()
          .then(),
    })
  },
})

const Query = objectType({
  name: 'Query',
  definition(t) {
    t.field('post', {
      type: 'Post',
      args: {
        postId: nonNull(stringArg()),
      },
      resolve: (_, args, ctx) => {
        return ctx.prisma.post.findUnique({
          where: { id: Number(args.postId) },
        })
      },
    })

    t.list.field('contracts', {
      type: 'Contract',
      resolve: (_, args, ctx) => {
        return ctx.prisma.contract.findMany().then()
      },
    })

    t.field('marketIndex', {
      args: {
        name: stringArg(),
      },
      type: 'MarketIndex',
      resolve: async (_, args: { name: string }, ctx) => {
        return ctx.prisma.marketIndex.findFirst({
          where: { name: args.name },
        })
      },
    })

    t.list.field('tickerFeed', {
      args: {
        marketIndexId: intArg(),
        limit: intArg(),
      },
      type: 'Ticker',
      resolve: async (
        _,
        args: { marketIndexId: number; limit: number },
        ctx
      ) => {
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

    t.list.field('feed', {
      type: 'Post',
      resolve: (_parent, _args, ctx) => {
        return ctx.prisma.post.findMany({
          where: { published: true },
        })
      },
    })

    t.list.field('drafts', {
      type: 'Post',
      resolve: (_parent, _args, ctx) => {
        return ctx.prisma.post.findMany({
          where: { published: false },
        })
      },
    })

    t.list.field('filterPosts', {
      type: 'Post',
      args: {
        searchString: nullable(stringArg()),
      },
      resolve: (_, { searchString }, ctx) => {
        return ctx.prisma.post.findMany({
          where: {
            OR: [
              { title: { contains: searchString } },
              { content: { contains: searchString } },
            ],
          },
        })
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

    t.nullable.field('deletePost', {
      type: 'Post',
      args: {
        postId: stringArg(),
      },
      resolve: (_, { postId }, ctx) => {
        return ctx.prisma.post.delete({
          where: { id: Number(postId) },
        })
      },
    })

    t.field('createDraft', {
      type: 'Post',
      args: {
        title: nonNull(stringArg()),
        content: stringArg(),
        authorEmail: stringArg(),
      },
      resolve: (_, { title, content, authorEmail }, ctx) => {
        return ctx.prisma.post.create({
          data: {
            title,
            content,
            published: false,
            author: {
              connect: { email: authorEmail },
            },
          },
        })
      },
    })

    t.nullable.field('publish', {
      type: 'Post',
      args: {
        postId: stringArg(),
      },
      resolve: (_, { postId }, ctx) => {
        return ctx.prisma.post.update({
          where: { id: Number(postId) },
          data: { published: true },
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
    Post,
    User,
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

const apolloServer = new ApolloServer({ schema, context, cache: 'bounded' })

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
