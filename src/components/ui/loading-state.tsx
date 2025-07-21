import { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '~/lib/utils'

interface LoadingStateProps {
  message?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8'
}

export function LoadingState({ 
  message = 'Loading...', 
  className,
  size = 'md'
}: LoadingStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center h-full space-y-4",
      className
    )}>
      <Loader2 className={cn("animate-spin text-muted-foreground", sizeClasses[size])} />
      <div className="text-muted-foreground text-center">
        {message}
      </div>
    </div>
  )
}

interface EmptyStateProps {
  title: string
  description?: string
  icon?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  className
}: EmptyStateProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center h-full space-y-4 text-center",
      className
    )}>
      {icon && (
        <div className="text-muted-foreground">
          {icon}
        </div>
      )}
      <div>
        <h3 className="text-lg font-semibold">{title}</h3>
        {description && (
          <p className="text-muted-foreground mt-1">{description}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
