import React from 'react';
import Chart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface GaugeChartProps {
  className?: string;
  value: number;
  title: string;
  min?: number;
  max?: number;
  unit?: string;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({ 
  className, 
  value, 
  title, 
  min = 0, 
  max = 100,
  unit = '%' 
}) => {
  const chartOptions: ApexOptions = {
    chart: {
      type: 'radialBar',
      height: 300,
      background: 'transparent',
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: '#e5e7eb',
          strokeWidth: '97%',
          margin: 5,
          dropShadow: {
            enabled: true,
            top: 2,
            left: 0,
            color: '#999',
            opacity: 0.1,
            blur: 2
          }
        },
        dataLabels: {
          name: {
            show: true,
            fontSize: '16px',
            fontWeight: 'bold',
            color: '#374151',
            offsetY: -10
          },
          value: {
            show: true,
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#1f2937',
            offsetY: 16,
            formatter: (val) => `${val}${unit}`
          }
        }
      }
    },
    fill: {
      type: 'gradient',
      gradient: {
        shade: 'light',
        type: 'horizontal',
        shadeIntensity: 0.5,
        gradientToColors: value >= 80 ? ['#ef4444'] : value >= 60 ? ['#f59e0b'] : ['#10b981'],
        inverseColors: true,
        opacityFrom: 1,
        opacityTo: 1,
        stops: [0, 100]
      }
    },
    colors: [value >= 80 ? '#fca5a5' : value >= 60 ? '#fde047' : '#86efac'],
    stroke: {
      lineCap: 'round'
    },
    labels: [title]
  };

  return (
    <div className={className}>
      <Chart
        options={chartOptions}
        series={[value]}
        type="radialBar"
        height={300}
      />
    </div>
  );
};