import nodeFetch from 'node-fetch';

// Docs: https://www.npmjs.com/package/node-fetch

class HTTPResponseError extends Error {
  response: Response
  constructor(response, ...args) {
    super(
      `HTTP Error Response: ${response.status} ${response.statusText}`,
      ...args
    )
    this.response = response
  }
}

const checkStatus = response => {
  if (response.ok) {
    // response.status >= 200 && response.status < 300
    return response
  } else {
    throw new HTTPResponseError(response)
  }
}

async function fetch(
  url: RequestInfo,
  options?: RequestInit,
  responseType?: 'json' | 'text'
): Promise<any> {
  if (!url) throw new Error('Url is required')
  if (!responseType) responseType = 'json'

  try {
    const response: Response = await nodeFetch(url, options)
    const data = await response[responseType]()

    checkStatus(response)

    return data
  } catch (error) {
    const errorBody = await error.response.text()

    console.error(error)
    console.error(`Error body: ${errorBody}`)

    return null
  }
}

export default fetch
