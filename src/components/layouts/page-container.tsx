import { ReactNode } from 'react'
import { cn } from '~/lib/utils'

interface PageContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full'
}

export function PageContainer({ 
  children, 
  className,
  maxWidth = 'full'
}: PageContainerProps) {
  return (
    <div className={cn(
      "p-8 space-y-8",
      maxWidth !== 'full' && maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  )
}
