export interface AirQualityComponents {
  co: number;
  no: number;
  no2: number;
  o3: number;
  so2: number;
  pm2_5: number;
  pm10: number;
  nh3: number;
}

export interface AirQualityData {
  aqi: number;
  components: AirQualityComponents;
  timestamp: string;
  location?: {
    lat: number;
    lon: number;
    name?: string;
  };
}

export type WebSocketMessage = {
  type: 'air_quality_update' | 'error';
  data?: AirQualityData;
  message?: string;
}

declare module '@/services/air-quality' {
  export type { AirQualityData, AirQualityComponents, WebSocketMessage };

  export class AirQualityService {
    subscribe(callback: (data: AirQualityData) => void, latitude: number, longitude: number): () => void;
    unsubscribe(callback: (data: AirQualityData) => void): void;
    getLatestData(latitude: number, longitude: number): Promise<AirQualityData>;
    submitReport(data: Omit<AirQualityData, 'id' | 'timestamp'>): Promise<AirQualityData>;
    getReports(skip?: number, limit?: number): Promise<AirQualityData[]>;
  }

  const airQualityService: AirQualityService;
  export default airQualityService;
}

declare module '@/components/forms/air-quality-form' {
  export function AirQualityForm(): JSX.Element;
}

declare module '@/components/visualizations/air-quality-chart' {
  interface AirQualityChartProps {
    latitude: number;
    longitude: number;
  }
  export function AirQualityChart(props: AirQualityChartProps): JSX.Element;
}
