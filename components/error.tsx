import { AlertTriangle } from 'lucide-react'
import { Button } from './ui/button'

interface ErrorProps {
  title?: string
  message?: string
  retry?: () => void
}

export function Error({ title = 'Error', message = 'Something went wrong', retry }: ErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 text-center">
      <AlertTriangle className="h-12 w-12 text-yellow-500 mb-4" />
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{message}</p>
      {retry && (
        <Button onClick={retry} variant="outline">
          Try Again
        </Button>
      )}
    </div>
  )
}
