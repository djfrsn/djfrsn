import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js';
import React from 'react';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip
)

// TODO: specify min/max for scales https://www.chartjs.org/docs/latest/general/performance.html#specify-min-and-max-for-scales

function LineChart({ options, data }: { options; data: ChartData<'line'> }) {
  return <Line options={options} data={data} />
}

export default LineChart
