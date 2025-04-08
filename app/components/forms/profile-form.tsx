import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/use-toast';

const profileSchema = z.object({
  fullName: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z.string()
    .email('Invalid email address')
    .min(5, 'Email must be at least 5 characters')
    .max(255, 'Email must be less than 255 characters'),
  phoneNumber: z.string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number format. Please use international format')
    .optional(),
  notificationPreferences: z.object({
    email: z.boolean(),
    push: z.boolean(),
    sms: z.boolean(),
  }),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileForm({ initialData }: { initialData?: Partial<ProfileFormData> }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: initialData,
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update profile',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">Full Name</label>
        <Input
          {...register('fullName')}
          placeholder="John Doe"
          className="w-full"
        />
        {errors.fullName && (
          <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          {...register('email')}
          type="email"
          placeholder="john@example.com"
          className="w-full"
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Phone Number (Optional)</label>
        <Input
          {...register('phoneNumber')}
          type="tel"
          placeholder="+1234567890"
          className="w-full"
        />
        {errors.phoneNumber && (
          <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Notification Preferences</label>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('notificationPreferences.email')}
            id="email-notifications"
          />
          <label htmlFor="email-notifications">Email Notifications</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('notificationPreferences.push')}
            id="push-notifications"
          />
          <label htmlFor="push-notifications">Push Notifications</label>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register('notificationPreferences.sms')}
            id="sms-notifications"
          />
          <label htmlFor="sms-notifications">SMS Notifications</label>
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Updating...' : 'Update Profile'}
      </Button>
    </form>
  );
}
