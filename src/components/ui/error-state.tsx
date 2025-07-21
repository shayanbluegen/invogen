import { ReactNode } from 'react'
import { AlertCircle, RotateCcw } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { cn } from '~/lib/utils'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  retryLabel?: string
  className?: string
  variant?: 'alert' | 'page'
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
  retryLabel = 'Try Again',
  className,
  variant = 'page'
}: ErrorStateProps) {
  if (variant === 'alert') {
    return (
      <Alert variant="destructive" className={className}>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {message}
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center h-full space-y-4",
      className
    )}>
      <div className="text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-1">{message}</p>
      </div>
      {onRetry && (
        <Button onClick={onRetry} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          {retryLabel}
        </Button>
      )}
    </div>
  )
}

interface SuccessStateProps {
  message: string
  className?: string
}

export function SuccessState({ message, className }: SuccessStateProps) {
  return (
    <Alert className={cn("border-green-200 bg-green-50", className)}>
      <AlertCircle className="h-4 w-4 text-green-600" />
      <AlertDescription className="text-green-800">
        {message}
      </AlertDescription>
    </Alert>
  )
}
