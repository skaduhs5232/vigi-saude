import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface SeverityAnalysisChartProps {
  className?: string;
}

export const SeverityAnalysisChart: React.FC<SeverityAnalysisChartProps> = ({ className }) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'light'
    },
    colors: ['#ef4444', '#f59e0b', '#10b981'],
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '55%',
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
      categories: ['Flebite', 'Queda', 'Lesão por pressão', 'Reação adversa', 'Erro de medicação'],
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '11px'
        },
        rotate: -45
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
      horizontalAlign: 'right',
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
      name: 'Alta Gravidade',
      data: [8, 15, 12, 10, 5]
    },
    {
      name: 'Média Gravidade',
      data: [35, 28, 40, 18, 22]
    },
    {
      name: 'Baixa Gravidade',
      data: [68, 46, 51, 32, 36]
    }
  ];

  return (
    <div className={className}>
      <Chart
        options={chartOptions}
        series={chartData}
        type="bar"
        height={350}
      />
    </div>
  );
};