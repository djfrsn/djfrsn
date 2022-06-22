import {
  CategoryScale,
  Chart as ChartJS,
  ChartData,
  CoreChartOptions,
  DatasetChartOptions,
  ElementChartOptions,
  LinearScale,
  LineControllerChartOptions,
  LineElement,
  PluginChartOptions,
  PointElement,
  ScaleChartOptions,
  Title,
  Tooltip,
} from 'chart.js';
import { _DeepPartialObject } from 'chart.js/types/utils';
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

function LineChart({
  options,
  data,
}: {
  options: _DeepPartialObject<
    CoreChartOptions<'line'> &
      ElementChartOptions<'line'> &
      PluginChartOptions<'line'> &
      DatasetChartOptions<'line'> &
      ScaleChartOptions &
      LineControllerChartOptions
  >
  data: ChartData<'line'>
}) {
  return <Line options={options} data={data} />
}

export default LineChart
