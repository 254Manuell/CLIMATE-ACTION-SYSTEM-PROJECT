export interface AirQualityComponents {
  co: number
  no: number
  no2: number
  o3: number
  so2: number
  pm2_5: number
  pm10: number
}

export interface AirQualityData {
  aqi: number
  components: AirQualityComponents
  timestamp: string
  location?: {
    lat: number
    lon: number
    name?: string
  }
}

export type WebSocketMessage = {
  type: 'air_quality_update' | 'error'
  data?: AirQualityData
  message?: string
}
