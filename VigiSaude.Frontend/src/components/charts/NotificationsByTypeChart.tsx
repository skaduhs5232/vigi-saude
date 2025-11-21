import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface NotificationsByTypeChartProps {
  className?: string;
}

export const NotificationsByTypeChart: React.FC<NotificationsByTypeChartProps> = ({ className }) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'donut',
      height: 350,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'light'
    },
    colors: ['#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#8dd1e1'],
    labels: ['Flebite', 'Queda', 'Lesão por pressão', 'Reação adversa', 'Erro de medicação'],
    dataLabels: {
      enabled: true,
      style: {
        fontSize: '12px',
        fontWeight: 'bold',
        colors: ['#fff']
      },
      dropShadow: {
        enabled: false
      }
    },
    plotOptions: {
      pie: {
        donut: {
          size: '60%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Total de Casos',
              fontSize: '14px',
              fontWeight: 'bold',
              color: '#374151',
              formatter: () => '426'
            },
            value: {
              show: true,
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937'
            }
          }
        }
      }
    },
    legend: {
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: '12px',
      markers: {
        size: 12,
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5
      }
    },
    responsive: [{
      breakpoint: 640,
      options: {
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const chartData = [111, 89, 103, 60, 63]; // Flebite, Queda, Lesão por pressão, Reação adversa, Erro de medicação

  return (
    <div className={className}>
      <Chart
        options={chartOptions}
        series={chartData}
        type="donut"
        height={350}
      />
    </div>
  );
};