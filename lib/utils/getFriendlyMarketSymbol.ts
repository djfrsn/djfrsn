const getFriendlyMarketSymbol = str => {
  switch (str) {
    case '^GSPC':
      return 'S&P 500'
    default:
      return str
  }
}

export default getFriendlyMarketSymbol
