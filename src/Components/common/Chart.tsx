// src/components/Chart.tsx
import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

type ChartType = 'line' | 'bar' | 'doughnut';

interface ChartProps {
  type: ChartType;
  data: ChartData<ChartType>;
  options?: ChartOptions<ChartType>;
}

const ChartComponent: React.FC<ChartProps> = ({ type, data, options }) => {
  if (type === 'line') {
    return (
      <Line
        data={data as ChartData<'line'>}
        options={options as ChartOptions<'line'>}
      />
    );
  } else if (type === 'bar') {
    return (
      <Bar
        data={data as ChartData<'bar'>}
        options={options as ChartOptions<'bar'>}
      />
    );
  } else if (type === 'doughnut') {
    return (
      <Doughnut
        data={data as ChartData<'doughnut'>}
        options={options as ChartOptions<'doughnut'>}
      />
    );
  } else {
    return null;
  }
};

export default ChartComponent;
