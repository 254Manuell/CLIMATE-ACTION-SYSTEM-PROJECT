import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartData } from 'chart.js';
import { airQualityService } from '../../services/air-quality';
import type { AirQualityData } from '../../../types/air-quality';
import { Card } from '@/components/ui/card';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface AirQualityChartProps {
  latitude: number;
  longitude: number;
}

export function AirQualityChart({ latitude, longitude }: AirQualityChartProps) {
  const [data, setData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [],
  });

  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Subscribe to air quality updates
    const unsubscribe = airQualityService.subscribe((newData: AirQualityData) => {
      setData((prevData: ChartData<'line'>) => {
        const labels = [...(prevData.labels as string[]), newData.timestamp];
        const datasets = [
          {
            label: 'AQI',
            data: [...(prevData.datasets[0]?.data || []), newData.aqi],
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
          {
            label: 'PM2.5',
            data: [...(prevData.datasets[1]?.data || []), newData.components?.pm2_5],
            borderColor: 'rgb(255, 99, 132)',
            tension: 0.1,
          },
          {
            label: 'PM10',
            data: [...(prevData.datasets[2]?.data || []), newData.components?.pm10],
            borderColor: 'rgb(54, 162, 235)',
            tension: 0.1,
          },
        ];

        // Keep only last 24 data points
        if (labels.length > 24) {
          labels.shift();
          datasets.forEach(dataset => dataset.data.shift());
        }

        return { labels, datasets };
      });
      setIsConnected(true);
    }, latitude, longitude);





    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [latitude, longitude]);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Air Quality Trends</h2>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className="text-sm text-gray-500">
            {isConnected ? 'Live Updates' : 'Disconnected'}
          </span>
        </div>
      </div>
      
      <div className="h-[400px]">
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Value',
                },
              },
              x: {
                title: {
                  display: true,
                  text: 'Time',
                },
              },
            },
            plugins: {
              legend: {
                position: 'top' as const,
              },
              tooltip: {
                mode: 'index',
                intersect: false,
              },
            },
          }}
        />
      </div>
    </Card>
  );
}
