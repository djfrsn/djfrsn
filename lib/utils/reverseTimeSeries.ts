import memoizeOne from 'memoize-one';

const reverseTimeSeries = memoizeOne(timeSeries =>
  timeSeries.map(set => Number(set.close)).reverse()
)

export default reverseTimeSeries
