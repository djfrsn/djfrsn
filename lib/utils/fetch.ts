import got, { Response } from 'got';

// import PQueue from 'p-queue';

// let got
// import('got')
//   .then(t => {
//     got = t
//   })
//   .catch(err => {
//     console.error(err)
//   })

// Docs
// got: https://www.npmjs.com/package/got
// p-queue: https://www.npmjs.com/package/p-queue

// const queue = new PQueue({ concurrency: 50, interval: 60000, intervalCap: 250 })

const instance = got.extend({
  hooks: {
    beforeRetry: [
      (error, retryCount) => {
        console.log(`Retrying [${retryCount}]: ${error.body.toString()}`)
      },
    ],
  },
  retry: { limit: 3, methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'] },
  mutableDefaults: true,
})

async function fetchApi(url: any, options?: any): Promise<any> {
  if (!url) throw new Error('Url is required')

  try {
    const response: Response = await instance(url, options).json()

    return response
  } catch (error) {
    console.error(error)

    return null
  }
}

export default fetchApi
