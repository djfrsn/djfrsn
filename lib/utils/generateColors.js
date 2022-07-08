const color = require('color')

/**
 * Generate color gradient based on range of values
 * @usage generateColor('#dc2626')
 * @param {string} val - color value passed to 'color' module
 * @param {Object} options - options to tune output
 * @returns { [name: string]: string }
 */
function generateColor(
  val,
  options = {
    base: 500,
    range: [50, 100, 200, 300, 400, 500, 600, 700, 800, 900],
    increment: 0.1,
    incrementBase: 0.2,
  }
) {
  const { base, range, increment, incrementBase } = options
  const colorGradient = {}

  range.forEach(num => {
    const baseIdx = range.indexOf(base)
    const numIdx = range.indexOf(num)
    const method = num > base ? 'darken' : 'lighten'
    const distanceFromBase =
      method === 'lighten' ? baseIdx - numIdx : numIdx - baseIdx
    const incVal = increment * distanceFromBase + incrementBase
    colorGradient[num] =
      num === base ? color(val).hex() : color(val)[method](incVal).hex()
  })

  return colorGradient
}

/**
 * Output color gradient
 * @param {Object} values - Key value pair of names and color values
 * @returns {Object} - Key value pair of names and color values with gradient range
 */
function generateColors(values) {
  return Object.keys(values).reduce((generatedColors, valueKey) => {
    return { ...generatedColors, [valueKey]: generateColor(values[valueKey]) }
  }, {})
}

module.exports = generateColors
