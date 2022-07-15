import { COLORS } from 'lib/const';

const chartOptions = {
  simple: {
    normalized: true,
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
  correlation: {
    normalized: true,
    responsive: true,
    cubicInterpolationMode: 'monotone',
    pointRadius: 0,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    stacked: false,
    scales: {
      x: {
        display: false,
      },
      y: {
        type: 'linear',
        display: true,
        position: 'right',
        ticks: {
          color: COLORS.correlationBeta,
        },
        grid: {
          color: COLORS.blackCoffee,
        },
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'left',
        ticks: {
          color: COLORS.correlationBeta,
        },
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
  },
}

export default chartOptions
