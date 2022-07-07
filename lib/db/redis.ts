import IORedis from 'ioredis';
import url from 'node:url';

const REDIS_URL = process.env.REDIS_URL
const redis_uri = url.parse(REDIS_URL)
const redisOptions = REDIS_URL.includes('rediss://')
  ? {
      tls: {
        rejectUnauthorized: false,
      },
    }
  : {}

const connection: IORedis = new IORedis({
  port: Number(redis_uri.port),
  host: redis_uri.hostname,
  password: redis_uri.auth.split(':')[1],
  db: 0,
  maxRetriesPerRequest: null, // https://github.com/OptimalBits/bull/issues/2186
  ...redisOptions,
})

export const obliterate = () =>
  new Promise((resolve, reject) => {
    try {
      connection.obliterate('ASYNC', () => {
        resolve(true)
      })
    } catch (error) {
      reject(error)
    }
  })

export const deleteKeysByPattern = (pattern: string) => {
  return new Promise((resolve, reject) => {
    const stream = connection.scanStream({
      match: pattern,
    })
    stream.on('data', (keys: string[]) => {
      if (keys.length) {
        const pipeline = connection.pipeline()
        keys.forEach(key => {
          pipeline.del(key)
        })
        pipeline.exec()
      }
    })
    stream.on('end', () => {
      resolve(null)
    })
    stream.on('error', e => {
      reject(e)
    })
  })
}

export default connection
