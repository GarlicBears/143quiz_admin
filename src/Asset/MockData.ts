// src/Asset/MockData.ts

import { ChartData, ChartOptions } from 'chart.js';

export const chartData: {
  [key: string]: ChartData<'line' | 'bar' | 'doughnut'>;
} = {
  line: {
    labels: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    datasets: [
      {
        label: '월별 방문자 수',
        data: [65, 59, 80, 81, 56, 55, 40, 60, 70, 160, 56, 33],
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  },
  bar: {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Bar Dataset',
        data: [35, 49, 60, 71, 46, 55, 30],
        backgroundColor: 'rgb(255, 99, 132)',
        borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  },
  doughnut: {
    labels: ['Red', 'Blue', 'Yellow'],
    datasets: [
      {
        label: 'Doughnut Dataset',
        data: [300, 50, 100],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 4,
      },
    ],
  },
};

export const chartOptions: ChartOptions<'line' | 'bar' | 'doughnut'> = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Chart Example',
    },
  },
};
