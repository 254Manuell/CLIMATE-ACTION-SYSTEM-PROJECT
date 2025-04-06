"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts"

// Sample data for charts
const hourlyData = [
  { time: "00:00", PM25: 25, NO2: 15, O3: 30 },
  { time: "01:00", PM25: 22, NO2: 14, O3: 32 },
  { time: "02:00", PM25: 20, NO2: 13, O3: 35 },
  { time: "03:00", PM25: 18, NO2: 12, O3: 38 },
  { time: "04:00", PM25: 15, NO2: 10, O3: 40 },
  { time: "05:00", PM25: 20, NO2: 12, O3: 38 },
  { time: "06:00", PM25: 30, NO2: 18, O3: 35 },
  { time: "07:00", PM25: 45, NO2: 25, O3: 30 },
  { time: "08:00", PM25: 65, NO2: 35, O3: 25 },
  { time: "09:00", PM25: 70, NO2: 40, O3: 22 },
  { time: "10:00", PM25: 68, NO2: 38, O3: 20 },
  { time: "11:00", PM25: 65, NO2: 36, O3: 18 },
  { time: "12:00", PM25: 60, NO2: 34, O3: 20 },
  { time: "13:00", PM25: 55, NO2: 32, O3: 22 },
  { time: "14:00", PM25: 50, NO2: 30, O3: 25 },
  { time: "15:00", PM25: 48, NO2: 28, O3: 28 },
  { time: "16:00", PM25: 52, NO2: 30, O3: 25 },
  { time: "17:00", PM25: 60, NO2: 35, O3: 22 },
  { time: "18:00", PM25: 65, NO2: 38, O3: 20 },
  { time: "19:00", PM25: 60, NO2: 35, O3: 22 },
  { time: "20:00", PM25: 50, NO2: 30, O3: 25 },
  { time: "21:00", PM25: 45, NO2: 25, O3: 28 },
  { time: "22:00", PM25: 35, NO2: 20, O3: 30 },
  { time: "23:00", PM25: 30, NO2: 18, O3: 32 },
]

const correlationData = [
  { PM25: 25, NO2: 15, temp: 20, humidity: 65, z: 1 },
  { PM25: 35, NO2: 20, temp: 22, humidity: 60, z: 2 },
  { PM25: 45, NO2: 25, temp: 24, humidity: 55, z: 3 },
  { PM25: 55, NO2: 30, temp: 26, humidity: 50, z: 4 },
  { PM25: 65, NO2: 35, temp: 28, humidity: 45, z: 5 },
  { PM25: 75, NO2: 40, temp: 30, humidity: 40, z: 6 },
  { PM25: 70, NO2: 38, temp: 29, humidity: 42, z: 5 },
  { PM25: 60, NO2: 32, temp: 27, humidity: 48, z: 4 },
  { PM25: 50, NO2: 28, temp: 25, humidity: 52, z: 3 },
  { PM25: 40, NO2: 22, temp: 23, humidity: 58, z: 2 },
  { PM25: 30, NO2: 18, temp: 21, humidity: 62, z: 1 },
]

export default function AnalysisPage() {
  const [pollutant, setPollutant] = useState("PM25")
  const [timeframe, setTimeframe] = useState("24h")

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Analysis</h2>
          <div className="flex items-center gap-2">
            <Select defaultValue="PM25" onValueChange={setPollutant}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select pollutant" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PM25">PM2.5</SelectItem>
                <SelectItem value="NO2">NO₂</SelectItem>
                <SelectItem value="O3">O₃</SelectItem>
                <SelectItem value="CO">CO</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="24h" onValueChange={setTimeframe}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Tabs defaultValue="live" className="space-y-4">
          <TabsList>
            <TabsTrigger value="live">Live Data</TabsTrigger>
            <TabsTrigger value="trends">Trends</TabsTrigger>
            <TabsTrigger value="correlations">Correlations</TabsTrigger>
            <TabsTrigger value="predictions">Predictions</TabsTrigger>
          </TabsList>

          <TabsContent value="live" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Live Air Quality Data</CardTitle>
                <CardDescription>Real-time pollutant levels over the past 24 hours</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart
                    data={hourlyData}
                    margin={{
                      top: 10,
                      right: 30,
                      left: 0,
                      bottom: 0,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="PM25" stroke="#8884d8" activeDot={{ r: 8 }} strokeWidth={2} />
                    <Line type="monotone" dataKey="NO2" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="O3" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Current Readings</CardTitle>
                  <CardDescription>Latest pollutant measurements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">PM2.5</div>
                        <div className="text-xs text-muted-foreground">Fine particulate matter</div>
                      </div>
                      <div className="font-bold text-red-500">65 µg/m³</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">NO₂</div>
                        <div className="text-xs text-muted-foreground">Nitrogen dioxide</div>
                      </div>
                      <div className="font-bold text-yellow-500">35 ppb</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">O₃</div>
                        <div className="text-xs text-muted-foreground">Ozone</div>
                      </div>
                      <div className="font-bold text-green-500">25 ppb</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">CO</div>
                        <div className="text-xs text-muted-foreground">Carbon monoxide</div>
                      </div>
                      <div className="font-bold text-green-500">1.2 ppm</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Sources</CardTitle>
                  <CardDescription>Active monitoring stations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">CBD Central Station</div>
                        <div className="text-xs text-muted-foreground">Main monitoring station</div>
                      </div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Bus Terminal</div>
                        <div className="text-xs text-muted-foreground">Traffic monitoring</div>
                      </div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Market Area</div>
                        <div className="text-xs text-muted-foreground">Commercial zone</div>
                      </div>
                      <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Active</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-sm font-medium">Residential Zone</div>
                        <div className="text-xs text-muted-foreground">Residential area</div>
                      </div>
                      <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">Maintenance</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pollution Trends</CardTitle>
                <CardDescription>Historical data analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Trends analysis will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="correlations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pollutant Correlations</CardTitle>
                <CardDescription>Relationships between different pollutants and weather conditions</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <ResponsiveContainer width="100%" height={400}>
                  <ScatterChart
                    margin={{
                      top: 20,
                      right: 20,
                      bottom: 20,
                      left: 20,
                    }}
                  >
                    <CartesianGrid />
                    <XAxis type="number" dataKey="PM25" name="PM2.5" unit="µg/m³" />
                    <YAxis type="number" dataKey="NO2" name="NO₂" unit="ppb" />
                    <ZAxis type="number" dataKey="z" range={[60, 400]} />
                    <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                    <Legend />
                    <Scatter name="Pollutant Correlation" data={correlationData} fill="#8884d8" />
                  </ScatterChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Predictive Models</CardTitle>
                <CardDescription>Machine learning-based predictions</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Prediction models will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

