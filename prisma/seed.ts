import { Prisma, PrismaClient } from '@prisma/client';
import { MARKET_INDEX, MARKET_INTERVAL } from 'lib/const';

const prisma = new PrismaClient()

const userData: Prisma.UserCreateInput[] = [
  {
    name: 'Alice',
    email: 'alice@prisma.io',
    posts: {
      create: [
        {
          title: 'Join the Prisma Slack',
          content: 'https://slack.prisma.io',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Nilu',
    email: 'nilu@prisma.io',
    posts: {
      create: [
        {
          title: 'Follow Prisma on Twitter',
          content: 'https://www.twitter.com/prisma',
          published: true,
        },
      ],
    },
  },
  {
    name: 'Mahmoud',
    email: 'mahmoud@prisma.io',
    posts: {
      create: [
        {
          title: 'Ask a question about Prisma on GitHub',
          content: 'https://www.github.com/prisma/prisma/discussions',
          published: true,
        },
        {
          title: 'Prisma on YouTube',
          content: 'https://pris.ly/youtube',
        },
      ],
    },
  },
]

const marketIndexData = [
  {
    name: MARKET_INDEX.sp500,
    displayName: 'S&P 500',
  },
]

const marketIntervalData = [
  {
    name: MARKET_INTERVAL.oneday,
  },
]

export async function main() {
  try {
    console.log(`Start seeding ...`)
    for (const u of userData) {
      const user = await prisma.user.create({
        data: u,
      })
      console.log(`Created user with id: ${user.id}`)
    }
    for (const u of marketIntervalData) {
      const marketInterval = await prisma.marketInterval.create({
        data: u,
      })
      console.log(`Created market interval with id: ${marketInterval.id}`)
    }
    for (const u of marketIndexData) {
      const marketIndex = await prisma.marketIndex.create({
        data: u,
      })
      console.log(`Created market index with id: ${marketIndex.id}`)
    }
    console.log(`Seeding finished.`)
  } catch (err) {
    console.error(err)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

main()
