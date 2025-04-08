import { Suspense } from 'react';
import { ActionPlanForm } from '@/components/forms/action-plan-form';
import { Card } from '@/components/ui/card';

export default function ActionPlansPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Create Action Plan</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">New Action Plan</h2>
          <Suspense fallback={<div>Loading...</div>}>
            <ActionPlanForm />
          </Suspense>
        </Card>
        
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Tips for Creating an Action Plan</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Set realistic and achievable goals</li>
              <li>Break down large goals into smaller actions</li>
              <li>Consider both short-term and long-term impacts</li>
              <li>Include measurable targets</li>
              <li>Review and adjust your plan regularly</li>
            </ul>
          </Card>
          
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">AQI Target Guidelines</h2>
            <div className="space-y-2">
              <p><strong>Good (0-50):</strong> Ideal target for sensitive groups</p>
              <p><strong>Moderate (51-100):</strong> Acceptable for most areas</p>
              <p><strong>Unhealthy (101+):</strong> Needs improvement actions</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
