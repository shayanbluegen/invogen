import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'
import { cn } from '~/lib/utils'

interface FormSectionProps {
  title: string
  description?: string
  children: ReactNode
  className?: string
  headerAction?: ReactNode
}

export function FormSection({
  title,
  description,
  children,
  className,
  headerAction
}: FormSectionProps) {
  return (
    <Card className={className}>
      <CardHeader className={cn(
        headerAction && "flex flex-row items-center justify-between space-y-0"
      )}>
        <div className="space-y-1">
          <CardTitle className="text-lg font-medium">{title}</CardTitle>
          {description && (
            <CardDescription>{description}</CardDescription>
          )}
        </div>
        {headerAction && <div>{headerAction}</div>}
      </CardHeader>
      <CardContent className="space-y-6">
        {children}
      </CardContent>
    </Card>
  )
}

interface FormContainerProps {
  children: ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
}

export function FormContainer({ 
  children, 
  className,
  maxWidth = '2xl'
}: FormContainerProps) {
  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full'
  }

  return (
    <div className={cn(
      'space-y-6',
      maxWidth !== 'full' && maxWidthClasses[maxWidth],
      className
    )}>
      {children}
    </div>
  )
}
