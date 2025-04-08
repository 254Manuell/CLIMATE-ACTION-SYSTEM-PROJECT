import { Suspense } from 'react';
import { ProfileForm } from '@/components/forms/profile-form';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProfileSettingsPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
              <Suspense fallback={<div>Loading...</div>}>
                <ProfileForm />
              </Suspense>
            </Card>

            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Profile Completeness</h2>
                <div className="space-y-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full w-3/4"></div>
                  </div>
                  <p className="text-sm text-gray-600">Your profile is 75% complete</p>
                  <ul className="list-disc list-inside text-sm space-y-1">
                    <li>Add a profile picture</li>
                    <li>Verify your email</li>
                    <li>Set notification preferences</li>
                  </ul>
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4">Account Status</h2>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Email Verification</span>
                    <span className="text-green-600">Verified</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Account Type</span>
                    <span>Standard</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Member Since</span>
                    <span>April 2025</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Settings</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Air Quality Alerts</h3>
                  <p className="text-sm text-gray-600">Get notified when air quality changes significantly</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Action Plan Reminders</h3>
                  <p className="text-sm text-gray-600">Receive reminders about your action plan tasks</p>
                </div>
                <input type="checkbox" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">Weekly Reports</h3>
                  <p className="text-sm text-gray-600">Get weekly summaries of air quality data</p>
                </div>
                <input type="checkbox" />
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Security Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Change Password</h3>
                <button className="text-blue-600 hover:underline">Update Password</button>
              </div>
              <div>
                <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                <button className="text-blue-600 hover:underline">Enable 2FA</button>
              </div>
              <div>
                <h3 className="font-medium mb-2">Login History</h3>
                <button className="text-blue-600 hover:underline">View History</button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
