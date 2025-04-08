"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/app/providers/auth-provider";

interface SecurityEvent {
  type: string;
  timestamp: number;
  details: string;
  location?: string;
}

export default function SecurityLog() {
  const { user } = useAuth();
  const [events, setEvents] = useState<SecurityEvent[]>([]);

  useEffect(() => {
    // In a real app, you would fetch this from your backend
    // This is just a mock implementation
    const mockEvents: SecurityEvent[] = [
      {
        type: "login",
        timestamp: Date.now() - 3600000,
        details: "Successful login",
        location: "Los Angeles, US"
      },
      {
        type: "password_change",
        timestamp: Date.now() - 86400000,
        details: "Password updated",
        location: "Los Angeles, US"
      },
      {
        type: "email_change",
        timestamp: Date.now() - 172800000,
        details: "Email verification sent",
        location: "Los Angeles, US"
      }
    ];

    setEvents(mockEvents);
  }, []);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getEventIcon = (type: string) => {
    switch (type) {
      case "login":
        return "🔐";
      case "password_change":
        return "🔑";
      case "email_change":
        return "📧";
      default:
        return "ℹ️";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Security Activity Log</CardTitle>
        <CardDescription>Recent security-related activities on your account</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-900"
            >
              <div className="text-2xl">{getEventIcon(event.type)}</div>
              <div className="flex-1">
                <p className="font-medium">{event.details}</p>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <span>{formatDate(event.timestamp)}</span>
                  {event.location && (
                    <span className="ml-2">• {event.location}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
