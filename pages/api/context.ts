import { PrismaClient } from '@prisma/client';
import { MicroRequest } from 'apollo-server-micro/dist/types';
import { ServerResponse } from 'http';
import prisma from 'lib/prisma';

export interface Context {
  req: MicroRequest
  res: ServerResponse
  prisma: PrismaClient
}

const createContext = ({
  req,
  res,
}: {
  req: MicroRequest
  res: ServerResponse
}): Context => {
  return {
    req,
    res,
    prisma,
  }
}

export default createContext
