import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface TrendsChartProps {
  className?: string;
}

export const TrendsChart: React.FC<TrendsChartProps> = ({ className }) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'area',
      height: 400,
      background: 'transparent',
      toolbar: {
        show: false
      },
      zoom: {
        enabled: false
      }
    },
    theme: {
      mode: 'light'
    },
    colors: ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'],
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'smooth',
      width: 2
    },
    fill: {
      type: 'gradient',
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.6,
        opacityTo: 0.1,
        stops: [0, 90, 100]
      }
    },
    xaxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    yaxis: {
      title: {
        text: 'Número de Casos',
        style: {
          color: '#374151',
          fontSize: '12px',
          fontWeight: 'bold'
        }
      },
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        }
      }
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 5
    },
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      fontSize: '12px',
      markers: {
        size: 12
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: (value) => `${value} casos`
      }
    }
  };

  const chartData = [
    {
      name: 'Flebite',
      data: [12, 19, 15, 22, 18, 25, 20, 23, 19, 21, 24, 28]
    },
    {
      name: 'Queda',
      data: [8, 12, 10, 15, 9, 18, 14, 16, 12, 14, 17, 20]
    },
    {
      name: 'Lesão por pressão',
      data: [15, 18, 12, 20, 16, 22, 18, 21, 17, 19, 23, 26]
    },
    {
      name: 'Reação adversa',
      data: [6, 8, 11, 9, 14, 12, 10, 13, 11, 12, 15, 18]
    },
    {
      name: 'Erro de medicação',
      data: [9, 7, 13, 11, 8, 15, 12, 14, 10, 13, 16, 19]
    }
  ];

  return (
    <div className={className}>
      <Chart
        options={chartOptions}
        series={chartData}
        type="area"
        height={400}
      />
    </div>
  );
};