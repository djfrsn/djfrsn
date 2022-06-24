import IORedis from 'ioredis';
import devOnlyIgnoreTLSReject from 'lib/devOnlyIgnoreTLSReject';

devOnlyIgnoreTLSReject()

const connection = new IORedis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
})

export default connection
