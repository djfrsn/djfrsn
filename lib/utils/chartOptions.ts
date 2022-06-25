const chartOptions = {
  simple: {
    responsive: true,
    cubicInterpolationMode: 'monotone',
    pointRadius: 0,
    layout: {
      padding: 1,
    },
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
    plugins: {
      tooltip: { enabled: false },
    },
  },
}

export default chartOptions
