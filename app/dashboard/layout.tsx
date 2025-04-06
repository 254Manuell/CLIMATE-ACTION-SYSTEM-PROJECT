import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, LineChart, LogOut, Menu, MessageSquare, Settings, User } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900"
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/analysis"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900"
              >
                <LineChart className="h-5 w-5" />
                Analysis
              </Link>
              <Link
                href="/blog"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900"
              >
                <MessageSquare className="h-5 w-5" />
                Blog
              </Link>
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900"
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
              <Link
                href="/profile/settings"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-500 hover:text-gray-900"
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 md:ml-0">
          <span className="text-xl font-bold text-green-600">ClimaAct</span>
        </Link>
        <nav className="hidden flex-1 md:flex md:gap-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/analysis"
            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
          >
            <LineChart className="h-4 w-4" />
            Analysis
          </Link>
          <Link href="/blog" className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900">
            <MessageSquare className="h-4 w-4" />
            Blog
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/profile">
            <Button variant="ghost" size="icon" className="rounded-full">
              <img
                src="/placeholder.svg?height=32&width=32"
                width="32"
                height="32"
                className="rounded-full"
                alt="User"
              />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
          <Link href="/">
            <Button variant="ghost" size="icon">
              <LogOut className="h-5 w-5" />
              <span className="sr-only">Log out</span>
            </Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  )
}

