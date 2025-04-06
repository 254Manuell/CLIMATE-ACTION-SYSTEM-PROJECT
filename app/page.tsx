import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture.PNG-Po2XEuQapow1B9toPdqxgQnihq4n7Z.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/30 z-0"></div>

      <div className="container flex flex-col items-center justify-center gap-8 z-10 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl text-white">
          CLIMATE ACTION SYSTEM
        </h1>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-2xl font-medium text-white">ClimAct</h2>
          <Link href="/about">
            <Button variant="ghost" className="text-white hover:bg-white/20 text-xl">
              ABOUT US
            </Button>
          </Link>
          <Link href="/login">
            <Button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-full text-lg w-64">
              LOGIN/SIGN UP
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

