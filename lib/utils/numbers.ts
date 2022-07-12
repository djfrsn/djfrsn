import numeral from 'numeral';

export const megabytesToBytes = (numOfMegabytes: number): number =>
  Math.pow(2, 20) * numOfMegabytes

export const formatUSD = (num: number | string) => {
  if (typeof num === 'string') num = Number(num)

  if (num > 999999999) {
    return '$' + numeral(num).format('0,0.000a')
  } else
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(num)
}
