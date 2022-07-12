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

export const modalContentIdVar = makeVar<string>(
  typeof window !== 'undefined' && localStorage.getItem('modalContentId')
)

export const modalContentVar = makeVar<object>({})

// Local state: https://www.apollographql.com/docs/react/local-state/local-state-management
// reactive variables, fields, persistence: https://www.apollographql.com/docs/react/local-state/managing-state-with-field-policies/#storing-local-state-in-reactive-variables

export const clientCache: InMemoryCache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
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
