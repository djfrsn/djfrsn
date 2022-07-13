import { COLORS } from 'lib/const';

import getTrendDirection from './getTrendDirection';

export const getLineColor = timeSeries =>
  getTrendDirection(timeSeries) !== 'negative'
    ? COLORS.positiveValue
    : COLORS.negativeValue
