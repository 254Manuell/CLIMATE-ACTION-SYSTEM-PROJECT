import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';
import airQualityService from '../../services/air-quality';

const airQualitySchema = z.object({
  city: z.string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must be less than 100 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'City can only contain letters, spaces, and hyphens'),
  state: z.string()
    .min(2, 'State must be at least 2 characters')
    .max(100, 'State must be less than 100 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'State can only contain letters, spaces, and hyphens'),
  country: z.string()
    .min(2, 'Country must be at least 2 characters')
    .max(100, 'Country must be less than 100 characters')
    .regex(/^[a-zA-Z\s-]+$/, 'Country can only contain letters, spaces, and hyphens'),
  latitude: z.number()
    .min(-90, 'Latitude must be between -90 and 90')
    .max(90, 'Latitude must be between -90 and 90')
    .transform(val => Number(val.toFixed(6))),
  longitude: z.number()
    .min(-180, 'Longitude must be between -180 and 180')
    .max(180, 'Longitude must be between -180 and 180')
    .transform(val => Number(val.toFixed(6))),
  pm25: z.number()
    .min(0, 'PM2.5 must be positive')
    .max(1000, 'PM2.5 value is too high')
    .transform(val => Number(val.toFixed(2)))
    .optional(),
  pm10: z.number()
    .min(0, 'PM10 must be positive')
    .max(1000, 'PM10 value is too high')
    .transform(val => Number(val.toFixed(2)))
    .optional(),
  o3: z.number()
    .min(0, 'O3 must be positive')
    .max(500, 'O3 value is too high')
    .transform(val => Number(val.toFixed(2)))
    .optional(),
  no2: z.number()
    .min(0, 'NO2 must be positive')
    .max(500, 'NO2 value is too high')
    .transform(val => Number(val.toFixed(2)))
    .optional(),
  so2: z.number()
    .min(0, 'SO2 must be positive')
    .max(500, 'SO2 value is too high')
    .transform(val => Number(val.toFixed(2)))
    .optional(),
  co: z.number()
    .min(0, 'CO must be positive')
    .max(50, 'CO value is too high')
    .transform(val => Number(val.toFixed(2)))
    .optional(),
}).refine(
  data => data.pm25 != null || data.pm10 != null || data.o3 != null || 
         data.no2 != null || data.so2 != null || data.co != null,
  {
    message: 'At least one air quality measurement is required',
    path: ['pm25'],
  }
);

type AirQualityFormData = z.infer<typeof airQualitySchema>;

export function AirQualityForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<AirQualityFormData>({
    resolver: zodResolver(airQualitySchema),
  });

  const onSubmit = async (data: AirQualityFormData) => {
    try {
      setIsSubmitting(true);
      
      // First, get the latest air quality data from the API
      const latestData = await airQualityService.getLatestData(data.latitude, data.longitude);
      
      // Combine form data with API data
      const reportData = {
        ...data,
        aqi: latestData.aqi,
        pm25: latestData.pm25,
        pm10: latestData.pm10,
        o3: latestData.o3,
        no2: latestData.no2,
        so2: latestData.so2,
        co: latestData.co
      };
      
      // Submit the combined report
      await airQualityService.submitReport(reportData);

      toast({
        title: 'Success',
        description: 'Air quality report submitted successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit air quality report',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            {...register('city')}
            placeholder="City"
            className="w-full"
          />
          {errors.city && (
            <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('state')}
            placeholder="State"
            className="w-full"
          />
          {errors.state && (
            <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>
          )}
        </div>
      </div>

      <div>
        <Input
          {...register('country')}
          placeholder="Country"
          className="w-full"
        />
        {errors.country && (
          <p className="text-red-500 text-sm mt-1">{errors.country.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            {...register('latitude', { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder="Latitude"
            className="w-full"
          />
          {errors.latitude && (
            <p className="text-red-500 text-sm mt-1">{errors.latitude.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('longitude', { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder="Longitude"
            className="w-full"
          />
          {errors.longitude && (
            <p className="text-red-500 text-sm mt-1">{errors.longitude.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            {...register('pm25', { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder="PM2.5"
            className="w-full"
          />
          {errors.pm25 && (
            <p className="text-red-500 text-sm mt-1">{errors.pm25.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('pm10', { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder="PM10"
            className="w-full"
          />
          {errors.pm10 && (
            <p className="text-red-500 text-sm mt-1">{errors.pm10.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            {...register('o3', { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder="O3"
            className="w-full"
          />
          {errors.o3 && (
            <p className="text-red-500 text-sm mt-1">{errors.o3.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('no2', { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder="NO2"
            className="w-full"
          />
          {errors.no2 && (
            <p className="text-red-500 text-sm mt-1">{errors.no2.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            {...register('so2', { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder="SO2"
            className="w-full"
          />
          {errors.so2 && (
            <p className="text-red-500 text-sm mt-1">{errors.so2.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('co', { valueAsNumber: true })}
            type="number"
            step="any"
            placeholder="CO"
            className="w-full"
          />
          {errors.co && (
            <p className="text-red-500 text-sm mt-1">{errors.co.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Submitting...' : 'Submit Report'}
      </Button>
    </form>
  );
}
