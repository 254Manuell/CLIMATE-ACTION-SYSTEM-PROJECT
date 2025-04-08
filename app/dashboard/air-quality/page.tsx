import { Suspense } from 'react';
import { AirQualityForm } from '@/components/forms/air-quality-form';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AirQualityChart } from '@/components/visualizations/air-quality-chart';
import { useEffect, useState } from 'react';
import airQualityService from '@/services/air-quality';

export default function AirQualityPage() {
interface AirQualityReport {
    id: number;
    aqi: number;
    pm25?: number;
    pm10?: number;
    o3?: number;
    no2?: number;
    so2?: number;
    co?: number;
    city: string;
    state: string;
    country: string;
    timestamp: string;
  }

  const [reports, setReports] = useState<AirQualityReport[]>([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await airQualityService.getReports();
        setReports(data.map((report: any) => ({
          ...report,
          id: report.id || 0, // Provide default value for id
        })));
      } catch (error) {
        console.error('Error fetching reports:', error);
      }
    };
    fetchReports();
  }, []);
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Air Quality Monitoring</h1>
      
      <Tabs defaultValue="report" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="report">Submit Report</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="report">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">New Air Quality Report</h2>
              <Suspense fallback={<div>Loading...</div>}>
                <AirQualityForm />
              </Suspense>
            </Card>

            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Air Quality Parameters</h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium">PM2.5 & PM10</h3>
                    <p className="text-sm text-gray-600">Particulate matter measurements in μg/m³</p>
                  </div>
                  <div>
                    <h3 className="font-medium">O3 (Ozone)</h3>
                    <p className="text-sm text-gray-600">Ground-level ozone in ppb</p>
                  </div>
                  <div>
                    <h3 className="font-medium">NO2 (Nitrogen Dioxide)</h3>
                    <p className="text-sm text-gray-600">Measured in ppb</p>
                  </div>
                  <div>
                    <h3 className="font-medium">SO2 (Sulfur Dioxide)</h3>
                    <p className="text-sm text-gray-600">Measured in ppb</p>
                  </div>
                  <div>
                    <h3 className="font-medium">CO (Carbon Monoxide)</h3>
                    <p className="text-sm text-gray-600">Measured in ppm</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Location Tips</h2>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Use precise coordinates for accurate tracking</li>
                  <li>Enable location services for automatic detection</li>
                  <li>Verify the location before submitting</li>
                  <li>Include landmarks for reference if needed</li>
                </ul>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Live Air Quality Data</h2>
              <AirQualityChart latitude={51.5074} longitude={-0.1278} />
            </Card>
            
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Report History</h2>
              <div className="space-y-4">
                {reports.map((report) => (
                  <div key={report.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{report.city}, {report.state}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(report.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">AQI: {report.aqi}</div>
                        <div className="text-sm text-gray-600">
                          PM2.5: {report.pm25} | PM10: {report.pm10}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Air Quality Analytics</h2>
            <p>Detailed analysis and trends will be shown here.</p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
