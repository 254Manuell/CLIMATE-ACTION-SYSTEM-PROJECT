import { FileQuestion } from 'lucide-react'
import { Button } from './ui/button'
import Link from 'next/link'

export function NotFound() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-4 text-center">
      <FileQuestion className="h-16 w-16 text-gray-400 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Page Not Found</h1>
      <p className="text-gray-600 mb-6">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <Button>Return to Home</Button>
      </Link>
    </div>
  )
}
