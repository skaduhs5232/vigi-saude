import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface TimelineChartProps {
  className?: string;
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ className }) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'rangeBar',
      height: 350,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'light'
    },
    colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'],
    plotOptions: {
      bar: {
        horizontal: true,
        barHeight: '50%',
        rangeBarGroupRows: true
      }
    },
    fill: {
      type: 'solid'
    },
    xaxis: {
      type: 'datetime',
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
        },
        datetimeFormatter: {
          year: 'yyyy',
          month: 'MMM',
          day: 'dd',
          hour: 'HH:mm'
        }
      }
    },
    yaxis: {
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
    tooltip: {
      theme: 'light',
      x: {
        format: 'dd/MM/yyyy HH:mm'
      }
    },
    legend: {
      position: 'top',
      horizontalAlign: 'left',
      fontSize: '12px'
    }
  };

  const chartData = [
    {
      name: 'Investigação',
      data: [
        {
          x: 'Caso #001',
          y: [
            new Date('2024-01-15 08:00').getTime(),
            new Date('2024-01-18 17:00').getTime()
          ]
        },
        {
          x: 'Caso #002',
          y: [
            new Date('2024-01-16 09:30').getTime(),
            new Date('2024-01-20 16:00').getTime()
          ]
        },
        {
          x: 'Caso #003',
          y: [
            new Date('2024-01-17 10:00').getTime(),
            new Date('2024-01-22 15:30').getTime()
          ]
        }
      ]
    },
    {
      name: 'Análise',
      data: [
        {
          x: 'Caso #001',
          y: [
            new Date('2024-01-18 18:00').getTime(),
            new Date('2024-01-22 12:00').getTime()
          ]
        },
        {
          x: 'Caso #002',
          y: [
            new Date('2024-01-20 17:00').getTime(),
            new Date('2024-01-25 14:00').getTime()
          ]
        },
        {
          x: 'Caso #003',
          y: [
            new Date('2024-01-22 16:00').getTime(),
            new Date('2024-01-28 11:00').getTime()
          ]
        }
      ]
    },
    {
      name: 'Resolução',
      data: [
        {
          x: 'Caso #001',
          y: [
            new Date('2024-01-22 13:00').getTime(),
            new Date('2024-01-25 17:00').getTime()
          ]
        },
        {
          x: 'Caso #002',
          y: [
            new Date('2024-01-25 15:00').getTime(),
            new Date('2024-01-30 16:00').getTime()
          ]
        }
      ]
    }
  ];

  return (
    <div className={className}>
      <Chart
        options={chartOptions}
        series={chartData}
        type="rangeBar"
        height={350}
      />
    </div>
  );
};