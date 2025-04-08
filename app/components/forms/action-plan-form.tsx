import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';

const actionPlanSchema = z.object({
  title: z.string()
    .min(3, 'Title must be at least 3 characters')
    .max(255, 'Title must be less than 255 characters')
    .regex(/^[\w\s-]+$/, 'Title can only contain letters, numbers, spaces, and hyphens'),
  description: z.string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description must be less than 1000 characters'),
  targetAqi: z.number()
    .min(0, 'Target AQI must be positive')
    .max(500, 'Target AQI must be less than 500')
    .transform(Math.round),
  startDate: z.string()
    .refine(date => new Date(date) >= new Date(), 'Start date must be in the future')
    .refine(date => !isNaN(new Date(date).getTime()), 'Invalid date format'),
  endDate: z.string()
    .refine(date => !isNaN(new Date(date).getTime()), 'Invalid date format'),
}).refine(data => new Date(data.endDate) > new Date(data.startDate), {
  message: 'End date must be after start date',
  path: ['endDate'],
});

type ActionPlanFormData = z.infer<typeof actionPlanSchema>;

export function ActionPlanForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ActionPlanFormData>({
    resolver: zodResolver(actionPlanSchema),
  });

  const onSubmit = async (data: ActionPlanFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/action-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create action plan');

      toast({
        title: 'Success',
        description: 'Action plan created successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create action plan',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <Input
          {...register('title')}
          placeholder="Action Plan Title"
          className="w-full"
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <Textarea
          {...register('description')}
          placeholder="Description"
          className="w-full"
        />
        {errors.description && (
          <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <Input
          {...register('targetAqi', { valueAsNumber: true })}
          type="number"
          placeholder="Target AQI"
          className="w-full"
        />
        {errors.targetAqi && (
          <p className="text-red-500 text-sm mt-1">{errors.targetAqi.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Input
            {...register('startDate')}
            type="date"
            className="w-full"
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate.message}</p>
          )}
        </div>

        <div>
          <Input
            {...register('endDate')}
            type="date"
            className="w-full"
          />
          {errors.endDate && (
            <p className="text-red-500 text-sm mt-1">{errors.endDate.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Creating...' : 'Create Action Plan'}
      </Button>
    </form>
  );
}
