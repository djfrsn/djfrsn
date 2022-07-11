import { makeVar } from '@apollo/client';
import { InMemoryLRUCache } from '@apollo/utils.keyvaluecache';
import { megabytesToBytes } from 'lib/utils/numbers';
import { minutesToMilliseconds } from 'lib/utils/time';

export const isModalOpenVar = makeVar<boolean>(
  !!localStorage.getItem('isModalOpen')
)

// Initializes to an empty array
export const modalContentIdVar = makeVar<string>('')

/**
 * @see {@link @https://www.apollographql.com/docs/apollo-server/performance/cache-backends/#configuring-in-memory-caching}
 */
const cache = new InMemoryLRUCache({
  maxSize: megabytesToBytes(100),
  ttl: minutesToMilliseconds(5),
})

export default cache
