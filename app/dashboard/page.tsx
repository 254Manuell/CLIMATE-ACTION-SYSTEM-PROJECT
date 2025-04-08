"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "../providers/auth-provider"
import { airQualityService } from '../services/air-quality';
import { calculateAQI, getAQICategory } from "../utils/air-quality"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AirQualityData } from '../../types/air-quality'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Download, Info, MapPin } from "lucide-react"
import { LocationSearch } from "../components/location-search"
import {
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

interface LocationData extends AirQualityData {
  location: string;
}

interface ChartDataPoint {
  date: string;
  PM25: number;
  PM10: number;
  NO2: number;
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [areaChartData, setAreaChartData] = useState<ChartDataPoint[]>([]);
  const [currentAQI, setCurrentAQI] = useState<number>(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [currentLatitude, setCurrentLatitude] = useState<number>(37.7749);
  const [currentLongitude, setCurrentLongitude] = useState<number>(-122.4194);
  const [activeTab, setActiveTab] = useState<"overview" | "analytics" | "reports" | "notifications">("overview");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    // Initialize real-time data subscription
    const unsubscribe = airQualityService.subscribe((newData: AirQualityData) => {
      // Update current AQI
      const aqi = calculateAQI(
        newData.components.pm2_5,
        newData.components.pm10,
        newData.components.no2
      );
      setCurrentAQI(aqi);
      setLastUpdate(new Date(newData.timestamp));

      // Update area chart data
      setAreaChartData(prevData => {
        const newChartData = [...prevData];
        if (newChartData.length >= 7) newChartData.shift();
        newChartData.push({
          date: new Date(newData.timestamp).toLocaleTimeString(),
          PM25: newData.components.pm2_5,
          PM10: newData.components.pm10,
          NO2: newData.components.no2
        });
        return newChartData;
      });

      // Update selected location
      setSelectedLocation({ ...newData, location: 'Current Location' });
    }, currentLatitude, currentLongitude);

    // Initial data load
    airQualityService.getLatestData(currentLatitude, currentLongitude).then((data: AirQualityData) => {
      setAreaChartData([{
        date: new Date(data.timestamp).toLocaleTimeString(),
        PM25: data.components.pm2_5,
        PM10: data.components.pm10,
        NO2: data.components.no2
      }]);
      setSelectedLocation({ ...data, location: 'Current Location' });
    }).catch(error => {
      console.error('Error loading initial data:', error);
    });

    return () => {
      unsubscribe();
      airQualityService.disconnect();
    };
  }, [user, loading, router, currentLatitude, currentLongitude])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold mb-4">Welcome, {user?.displayName || user?.email}</h1>
          <div className="flex items-center gap-4 w-1/2">
            <LocationSearch 
              onLocationSelect={useCallback(({ lat, lng, name }) => {
                setCurrentLatitude(lat);
                setCurrentLongitude(lng);
                if (selectedLocation) {
                  setSelectedLocation({ ...selectedLocation, location: name });
                }
              }, [selectedLocation])}
            />
            <Button variant="outline" size="sm" className="h-8 gap-1 shrink-0">
              <Download className="h-3.5 w-3.5" />
              <span>Download</span>
            </Button>
          </div>
        </div>

        <Tabs 
          defaultValue="overview"
          className="space-y-4"
          onValueChange={(value: string) => setActiveTab(value as "overview" | "analytics" | "reports" | "notifications")}
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Current AQI</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{currentAQI}</div>
                  <p className="text-xs text-muted-foreground">
                    {getAQICategory(currentAQI).category}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Last updated: {lastUpdate.toLocaleTimeString()}
                  </p>
                </CardContent>
              </Card>
              {selectedLocation && (
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Current Location</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm">PM2.5: {selectedLocation.components.pm2_5} µg/m³</p>
                      <p className="text-sm">PM10: {selectedLocation.components.pm10} µg/m³</p>
                      <p className="text-sm">NO2: {selectedLocation.components.no2} µg/m³</p>
                    </div>
                  </CardContent>
                </Card>
              )}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">PM2.5</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-red-500"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 0 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{selectedLocation?.components.pm2_5} µg/m³</div>
                  <p className="text-xs text-muted-foreground">+12% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">NO₂</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-yellow-500"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-yellow-500">{selectedLocation?.components.no2} ppb</div>
                  <p className="text-xs text-muted-foreground">-5% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">CO</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="h-4 w-4 text-green-500"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">1.2 ppm</div>
                  <p className="text-xs text-muted-foreground">Normal levels</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Air Quality Trends</CardTitle>
                  <CardDescription>Real-time updates</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <AreaChart data={areaChartData}>
                      <defs>
                        <linearGradient id="colorPM25" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorPM10" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#84cc16" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorNO2" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <CartesianGrid strokeDasharray="3 3" />
                      <Tooltip />
                      <Legend />
                      <Area
                        type="monotone"
                        dataKey="PM25"
                        stroke="#0ea5e9"
                        fillOpacity={1}
                        fill="url(#colorPM25)"
                        name="PM2.5"
                      />
                      <Area
                        type="monotone"
                        dataKey="PM10"
                        stroke="#84cc16"
                        fillOpacity={1}
                        fill="url(#colorPM10)"
                        name="PM10"
                      />
                      <Area
                        type="monotone"
                        dataKey="NO2"
                        stroke="#f59e0b"
                        fillOpacity={1}
                        fill="url(#colorNO2)"
                        name="NO2"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Health Recommendations</CardTitle>
                  <CardDescription>Based on current air quality</CardDescription>
                </CardHeader>
                <CardContent>
                  <Alert className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Sensitive Groups</AlertTitle>
                    <AlertDescription>
                      People with respiratory or heart conditions, the elderly and children should reduce prolonged
                      outdoor activities.
                    </AlertDescription>
                  </Alert>
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertTitle>General Population</AlertTitle>
                    <AlertDescription>
                      Consider reducing intense outdoor activities if you experience symptoms such as sore eyes, cough
                      or sore throat.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Forecast</CardTitle>
                  <CardDescription>Predicted air quality for the next 3 days</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                      <div className="text-lg font-medium">Tomorrow</div>
                      <div className="text-4xl font-bold text-yellow-500">125</div>
                      <div className="text-sm text-muted-foreground">Unhealthy for Sensitive Groups</div>
                    </div>
                    <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                      <div className="text-lg font-medium">In 2 Days</div>
                      <div className="text-4xl font-bold text-orange-500">155</div>
                      <div className="text-sm text-muted-foreground">Unhealthy</div>
                    </div>
                    <div className="flex flex-col items-center space-y-2 rounded-lg border p-4">
                      <div className="text-lg font-medium">In 3 Days</div>
                      <div className="text-4xl font-bold text-green-500">95</div>
                      <div className="text-sm text-muted-foreground">Moderate</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Detailed analysis of air quality data</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Analytics content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Reports</CardTitle>
                <CardDescription>View and download air quality reports</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Reports content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Manage your notification preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Notifications content will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

