"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { authService } from "@/lib/auth"
import { useToast } from "@/components/ui/use-toast"
import { z } from "zod"

const emailSchema = z.string().email('Please enter a valid email address')

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      // Validate email
      emailSchema.parse(email)
      setIsLoading(true)

      // Send reset password request
      await authService.resetPassword(email)
      
      // Show success toast and update UI
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions",
        duration: 5000,
      })
      setSubmitted(true)
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message)
      } else {
        setError(err instanceof Error ? err.message : "Failed to send reset email")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to send reset email. Please try again.",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/LOGIN%20SIGN%20UP.PNG-ZnbQNOJbaRKI7N5kIpc3Y3TZdxAfD3.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute top-4 right-4 z-20">
        <button className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded text-sm">
          English (UK) <ChevronDown className="h-4 w-4" />
        </button>
      </div>

      <div className="w-full max-w-md mx-auto z-10">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          <div className="mb-6">
            <Link href="/login" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Login
            </Link>
          </div>

          <h1 className="text-2xl font-bold text-center mb-6">Forgot Password</h1>

          {error && <div className="bg-red-50 text-red-500 px-4 py-2 rounded-md mb-4">{error}</div>}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <p className="text-sm text-gray-500">We'll send you a link to reset your password.</p>

              <Button type="submit" className="w-full bg-green-500 hover:bg-green-600" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="bg-green-50 text-green-600 p-4 rounded-md flex items-center justify-center gap-2">
                <CheckCircle2 className="h-5 w-5" />
                <span>Password reset link sent!</span>
              </div>

              <div className="space-y-2">
                <p className="text-sm text-gray-600">We've sent instructions to:</p>
                <p className="font-medium text-gray-900">{email}</p>
              </div>

              <div className="space-y-4 mt-6">
                <p className="text-sm text-gray-500">
                  Didn't receive the email? Check your spam folder or try these:
                </p>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Make sure the email address is correct</li>
                  <li>• Check your spam or junk folder</li>
                  <li>• Allow emails from our domain</li>
                </ul>
              </div>

              <div className="pt-4">
                <Button
                  onClick={() => setSubmitted(false)}
                  className="w-full bg-gray-100 text-gray-800 hover:bg-gray-200"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

