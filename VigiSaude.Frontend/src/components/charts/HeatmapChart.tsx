import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface HeatmapChartProps {
  className?: string;
}

export const HeatmapChart: React.FC<HeatmapChartProps> = ({ className }) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'heatmap',
      height: 400,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    theme: {
      mode: 'light'
    },
    dataLabels: {
      enabled: false
    },
    colors: ['#3b82f6'],
    title: {
      text: 'Notificações por Setor e Período',
      style: {
        fontSize: '16px',
        fontWeight: 'bold',
        color: '#1f2937'
      }
    },
    xaxis: {
      type: 'category',
      categories: ['0-6h', '6-12h', '12-18h', '18-24h'],
      labels: {
        style: {
          colors: '#6b7280',
          fontSize: '12px'
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
      padding: {
        right: 20
      }
    },
    plotOptions: {
      heatmap: {
        radius: 4,
        enableShades: true,
        shadeIntensity: 0.5,
        reverseNegativeShade: true,
        distributed: false,
        useFillColorAsStroke: false,
        colorScale: {
          ranges: [
            {
              from: 0,
              to: 5,
              name: 'Baixo',
              color: '#dcfce7'
            },
            {
              from: 6,
              to: 15,
              name: 'Moderado',
              color: '#86efac'
            },
            {
              from: 16,
              to: 25,
              name: 'Alto',
              color: '#22c55e'
            },
            {
              from: 26,
              to: 50,
              name: 'Muito Alto',
              color: '#16a34a'
            }
          ]
        }
      }
    },
    tooltip: {
      theme: 'light',
      style: {
        fontSize: '12px'
      },
      y: {
        formatter: (value) => `${value} notificações`
      }
    }
  };

  const chartData = [
    {
      name: 'UTI',
      data: [
        { x: '0-6h', y: 12 },
        { x: '6-12h', y: 18 },
        { x: '12-18h', y: 25 },
        { x: '18-24h', y: 15 }
      ]
    },
    {
      name: 'Emergência',
      data: [
        { x: '0-6h', y: 35 },
        { x: '6-12h', y: 42 },
        { x: '12-18h', y: 38 },
        { x: '18-24h', y: 28 }
      ]
    },
    {
      name: 'Centro Cirúrgico',
      data: [
        { x: '0-6h', y: 8 },
        { x: '6-12h', y: 22 },
        { x: '12-18h', y: 18 },
        { x: '18-24h', y: 12 }
      ]
    },
    {
      name: 'Enfermaria',
      data: [
        { x: '0-6h', y: 15 },
        { x: '6-12h', y: 28 },
        { x: '12-18h', y: 32 },
        { x: '18-24h', y: 22 }
      ]
    },
    {
      name: 'Ambulatório',
      data: [
        { x: '0-6h', y: 5 },
        { x: '6-12h', y: 8 },
        { x: '12-18h', y: 12 },
        { x: '18-24h', y: 6 }
      ]
    }
  ];

  return (
    <div className={className}>
      <Chart
        options={chartOptions}
        series={chartData}
        type="heatmap"
        height={400}
      />
    </div>
  );
};