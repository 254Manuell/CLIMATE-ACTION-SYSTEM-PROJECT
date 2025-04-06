import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Calendar, User } from "lucide-react"

export default function BlogPage() {
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
            <Link href="/about" className="text-sm font-medium hover:underline">
              About
            </Link>
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="outline" size="sm">
                  Log in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">Sign up</Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 bg-green-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">ClimaAct Blog</h1>
                <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Stay informed about air quality, climate action, and environmental news
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <Tabs defaultValue="all" className="space-y-8">
              <div className="flex justify-between items-center">
                <TabsList>
                  <TabsTrigger value="all">All Posts</TabsTrigger>
                  <TabsTrigger value="air-quality">Air Quality</TabsTrigger>
                  <TabsTrigger value="climate-action">Climate Action</TabsTrigger>
                  <TabsTrigger value="research">Research</TabsTrigger>
                </TabsList>
                <div className="hidden md:flex">
                  <Button variant="outline">Subscribe to Newsletter</Button>
                </div>
              </div>

              <TabsContent value="all" className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="p-0">
                      <img
                        alt="Environmental Conservation in Kenya"
                        className="aspect-[4/3] object-cover rounded-t-lg"
                        height="300"
                        src="/images/kenya-conservation.jpg"
                        width="400"
                      />
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Apr 6, 2024</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Emmanuel Ngunnzi</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        Environmental Conservation Efforts in Kenya: Steps Taken Towards Sustainability
                      </CardTitle>
                      <CardDescription>
                        Explore Kenya's significant strides in environmental conservation, from forest protection to renewable energy initiatives and community involvement in sustainability efforts.
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Link href="/blog/environmental-conservation-kenya">
                        <Button variant="ghost" className="gap-1">
                          Read More <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                  <Card>
                    <CardHeader className="p-0">
                      <img
                        alt="Air pollution in Nairobi"
                        className="aspect-[4/3] object-cover rounded-t-lg"
                        height="300"
                        src="/placeholder.svg?height=300&width=400"
                        width="400"
                      />
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Apr 2, 2024</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Emmanuel Baraka</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        Understanding Air Quality Index: What the Numbers Mean
                      </CardTitle>
                      <CardDescription>
                        Learn how to interpret AQI values and what they mean for your health and daily activities in
                        Nairobi's CBD.
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Link href="#">
                        <Button variant="ghost" className="gap-1">
                          Read More <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="p-0">
                      <img
                        alt="Traffic in Nairobi"
                        className="aspect-[4/3] object-cover rounded-t-lg"
                        height="300"
                        src="/placeholder.svg?height=300&width=400"
                        width="400"
                      />
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Mar 28, 2024</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Joram Makasa</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        How Traffic Congestion Impacts Air Quality in Nairobi
                      </CardTitle>
                      <CardDescription>
                        An analysis of the relationship between traffic patterns and air pollution levels in Nairobi's
                        Central Business District.
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Link href="#">
                        <Button variant="ghost" className="gap-1">
                          Read More <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>

                  <Card>
                    <CardHeader className="p-0">
                      <img
                        alt="Community action"
                        className="aspect-[4/3] object-cover rounded-t-lg"
                        height="300"
                        src="/placeholder.svg?height=300&width=400"
                        width="400"
                      />
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Mar 15, 2024</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Sarah Kimani</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        Community-Led Initiatives for Cleaner Air in Nairobi
                      </CardTitle>
                      <CardDescription>
                        Discover how local communities are taking action to monitor and improve air quality in their
                        neighborhoods.
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Link href="#">
                        <Button variant="ghost" className="gap-1">
                          Read More <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>

                <div className="flex justify-center">
                  <Button variant="outline">Load More Articles</Button>
                </div>
              </TabsContent>

              <TabsContent value="air-quality" className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="p-0">
                      <img
                        alt="Air pollution in Nairobi"
                        className="aspect-[4/3] object-cover rounded-t-lg"
                        height="300"
                        src="/placeholder.svg?height=300&width=400"
                        width="400"
                      />
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Apr 2, 2024</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Emmanuel Baraka</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        Understanding Air Quality Index: What the Numbers Mean
                      </CardTitle>
                      <CardDescription>
                        Learn how to interpret AQI values and what they mean for your health and daily activities in
                        Nairobi's CBD.
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Link href="#">
                        <Button variant="ghost" className="gap-1">
                          Read More <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="climate-action" className="space-y-8">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  <Card>
                    <CardHeader className="p-0">
                      <img
                        alt="Environmental Conservation in Kenya"
                        className="aspect-[4/3] object-cover rounded-t-lg"
                        height="300"
                        src="/images/kenya-conservation.jpg"
                        width="400"
                      />
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Apr 6, 2024</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>Emmanuel Ngunnzi</span>
                        </div>
                      </div>
                      <CardTitle className="text-xl mb-2">
                        Environmental Conservation Efforts in Kenya: Steps Taken Towards Sustainability
                      </CardTitle>
                      <CardDescription>
                        Explore Kenya's significant strides in environmental conservation, from forest protection to renewable energy initiatives and community involvement in sustainability efforts.
                      </CardDescription>
                    </CardContent>
                    <CardFooter>
                      <Link href="/blog/environmental-conservation-kenya">
                        <Button variant="ghost" className="gap-1">
                          Read More <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </CardFooter>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="research" className="space-y-8">
                <p>Research articles will be displayed here.</p>
              </TabsContent>
            </Tabs>
          </div>
        </section>
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

