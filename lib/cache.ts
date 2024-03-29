import { InMemoryCache, makeVar } from '@apollo/client';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';

import { megabytesToBytes } from './utils/numbers';
import { minutesToMilliseconds } from './utils/time';

/**
 * @see {@link @https://www.apollographql.com/docs/apollo-server/performance/cache-backends/#configuring-in-memory-caching}
 */
export const serverCache = new InMemoryLRUCache({
  maxSize: megabytesToBytes(100),
  ttl: minutesToMilliseconds(5),
})

export const isModalOpenVar = makeVar<boolean>(
  typeof window !== 'undefined' &&
    localStorage.getItem('isModalOpen') === 'true'
)

export const isModalOpen = open => {
  if (open) localStorage.setItem('isModalOpen', open)

  return isModalOpenVar(open)
}

export const modalContentIdVar = makeVar<string>(
  typeof window !== 'undefined' && localStorage.getItem('modalContentId')
)

export const modalContentId = id => {
  if (id) localStorage.setItem('modalContentId', id)

  return modalContentIdVar(id)
}

export const modalContentVar = makeVar<object>(
  typeof window !== 'undefined' &&
    JSON.parse(localStorage.getItem('modalContent'))
)

export const modalContent = content => {
  if (content) localStorage.setItem('modalContent', JSON.stringify(content))

  return modalContentVar(content)
}

// Local state: https://www.apollographql.com/docs/react/local-state/local-state-management
// reactive variables, fields, persistence: https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/#storing-local-state-in-reactive-variables

export const clientCache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        marketIndexTickers: {
          keyArgs: ['type'],
          merge(existing, incoming, { readField }) {
            const merged = { ...existing }
            incoming.forEach(item => {
              const id = readField('id', item)
              if (typeof id === 'number') merged[id] = item
            })

            return merged
          },
          read(existing) {
            return existing && Object.values(existing)
          },
        },
        isModalOpen: {
          read() {
            return isModalOpenVar()
          },
        },
        modalContentId: {
          read() {
            return modalContentIdVar()
          },
        },
        modalContent: {
          read() {
            return modalContentVar()
          },
        },
      },
    },
  },
})
