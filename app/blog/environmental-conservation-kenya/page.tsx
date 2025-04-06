"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, Share2, User } from "lucide-react"

export default function BlogPost() {
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
            <Link href="/blog" className="text-sm font-medium hover:underline">
              Back to Blog
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <article className="container max-w-4xl py-12">
          <div className="mb-8">
            <Link href="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to all articles
            </Link>
            <h1 className="text-4xl font-bold mb-4">
              Environmental Conservation Efforts in Kenya: Steps Taken Towards Sustainability
            </h1>
            <div className="flex items-center text-sm text-gray-500 space-x-4 mb-6">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>Emmanuel Ngunnzi</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Apr 6, 2024</span>
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>8 min read</span>
              </div>
            </div>
            <div className="relative aspect-video w-full mb-8">
              <Image
                src="/images/kenya-conservation.jpg"
                alt="Environmental Conservation in Kenya"
                fill
                className="object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="prose prose-green max-w-none">
            <h2>Introduction</h2>
            <p>
              Kenya has made significant strides in environmental conservation, implementing various measures to protect its
              natural resources and combat climate change. This article explores the key initiatives and their impact on the
              nation's sustainability goals.
            </p>

            <h2>Key Conservation Initiatives</h2>
            <h3>1. Forest Conservation</h3>
            <p>
              Kenya has implemented ambitious reforestation programs, including the goal to achieve 10% forest cover
              nationwide. The government has banned logging in public forests and encouraged community-based forest
              management.
            </p>

            <h3>2. Renewable Energy</h3>
            <p>
              The country has made substantial investments in renewable energy, particularly in geothermal, wind, and solar
              power. The Lake Turkana Wind Power project and the Olkaria Geothermal Plant are prime examples of this
              commitment.
            </p>

            <h3>3. Waste Management</h3>
            <p>
              Kenya has taken bold steps in waste management, including the ban on single-use plastic bags in 2017, which has
              significantly reduced plastic pollution. Various recycling initiatives have been implemented across major
              cities.
            </p>

            <h2>Community Involvement</h2>
            <p>
              Local communities play a crucial role in conservation efforts. Through various programs, communities are
              educated about sustainable practices and involved in conservation projects. The Green Belt Movement, founded by
              Nobel laureate Wangari Maathai, continues to inspire grassroots environmental activism.
            </p>

            <h2>Challenges and Future Outlook</h2>
            <p>
              Despite progress, Kenya faces several challenges in its conservation efforts, including population pressure,
              climate change impacts, and resource constraints. However, continued government commitment and international
              support provide hope for sustainable environmental management.
            </p>

            <h2>Conclusion</h2>
            <p>
              Kenya's environmental conservation efforts demonstrate a strong commitment to sustainability. While challenges
              remain, the combination of government initiatives, community involvement, and international cooperation
              provides a framework for continued progress in environmental protection.
            </p>
          </div>

          <div className="mt-12 border-t pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="outline" className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share Article
                </Button>
              </div>
              <Link href="/blog">
                <Button variant="outline">More Articles</Button>
              </Link>
            </div>
          </div>
        </article>
      </main>

      <footer className="border-t py-6 md:py-8">
        <div className="container flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
          <p className="text-center text-sm text-gray-500 md:text-left">© 2024 ClimaAct. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
