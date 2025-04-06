"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bell, Edit, MapPin, Settings, User } from "lucide-react"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-bold text-green-600">
              ClimaAct
            </Link>
          </div>
          <nav className="flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:underline">
              Home
            </Link>
            <Link href="/dashboard" className="text-sm font-medium hover:underline">
              Dashboard
            </Link>
            <Link href="/blog" className="text-sm font-medium hover:underline">
              Blog
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/profile/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                  <span className="sr-only">Settings</span>
                </Button>
              </Link>
              <Link href="/">
                <Button variant="outline" size="sm">
                  Log out
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1 py-12">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/3">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="User" />
                      <AvatarFallback>EB</AvatarFallback>
                    </Avatar>
                    <div className="space-y-1 text-center">
                      <h2 className="text-2xl font-bold">Emmanuel Baraka</h2>
                      <p className="text-sm text-gray-500">emmanuel.baraka@example.com</p>
                      <div className="flex items-center justify-center text-sm text-gray-500">
                        <MapPin className="mr-1 h-4 w-4" />
                        <span>Nairobi, Kenya</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            <div className="md:w-2/3">
              <Tabs defaultValue="profile" className="space-y-4" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="notifications">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile Information</CardTitle>
                      <CardDescription>Your personal information and preferences</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Full Name</h3>
                          <p>Emmanuel Baraka Ngunnzi</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Email</h3>
                          <p>emmanuel.baraka@example.com</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                          <p>+254 712 345 678</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Location</h3>
                          <p>Nairobi, Kenya</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Bio</h3>
                        <p>
                          Environmental advocate and researcher focused on air quality monitoring and climate action in
                          urban areas.
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Monitoring Preferences</CardTitle>
                      <CardDescription>Your preferred locations and pollutants to monitor</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Preferred Locations</h3>
                        <ul className="list-disc list-inside mt-2">
                          <li>CBD Center</li>
                          <li>Bus Terminal</li>
                          <li>Market Area</li>
                        </ul>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Pollutants of Interest</h3>
                        <ul className="list-disc list-inside mt-2">
                          <li>PM2.5</li>
                          <li>NO₂</li>
                          <li>CO</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Notification Settings</CardTitle>
                      <CardDescription>Manage your notification preferences</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p>Notification settings will be displayed here.</p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-gray-500 md:text-left">© 2024 ClimaAct. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-gray-500 hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm text-gray-500 hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

