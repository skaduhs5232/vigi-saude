import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface MonthlyComparisonChartProps {
  className?: string;
}

export const MonthlyComparisonChart: React.FC<MonthlyComparisonChartProps> = ({ className }) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 400,
      background: 'transparent',
      toolbar: {
        show: false
      },
      stacked: false
    },
    theme: {
      mode: 'light'
    },
    colors: ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '60%',
        borderRadius: 4,
        borderRadiusApplication: 'end'
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
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
    fill: {
      opacity: 1
    },
    grid: {
      borderColor: '#e5e7eb',
      strokeDashArray: 5
    },
    legend: {
      position: 'top',
      horizontalAlign: 'center',
      fontSize: '12px',
      markers: {
        size: 6,
        shape: 'circle'
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
      data: [12, 19, 15, 22, 18, 25]
    },
    {
      name: 'Queda',
      data: [8, 12, 10, 15, 9, 18]
    },
    {
      name: 'Lesão por pressão',
      data: [15, 18, 12, 20, 16, 22]
    },
    {
      name: 'Reação adversa',
      data: [6, 8, 11, 9, 14, 12]
    },
    {
      name: 'Erro de medicação',
      data: [9, 7, 13, 11, 8, 15]
    }
  ];

  return (
    <div className={className}>
      <Chart
        options={chartOptions}
        series={chartData}
        type="bar"
        height={400}
      />
    </div>
  );
};