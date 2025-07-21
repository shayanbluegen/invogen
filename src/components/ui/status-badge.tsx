import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'

interface StatusBadgeProps {
  status: string
  variant?: 'invoice' | 'client' | 'default'
  className?: string
}

export function StatusBadge({ status, variant = 'default', className }: StatusBadgeProps) {
  const getStatusConfig = () => {
    const normalizedStatus = status.toUpperCase()
    
    if (variant === 'invoice') {
      switch (normalizedStatus) {
        case 'PAID':
          return {
            variant: 'secondary' as const,
            className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            label: 'Paid'
          }
        case 'PENDING':
          return {
            variant: 'secondary' as const,
            className: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
            label: 'Pending'
          }
        case 'OVERDUE':
          return {
            variant: 'destructive' as const,
            className: '',
            label: 'Overdue'
          }
        case 'DRAFT':
          return {
            variant: 'outline' as const,
            className: '',
            label: 'Draft'
          }
        default:
          return {
            variant: 'outline' as const,
            className: '',
            label: status
          }
      }
    }
    
    if (variant === 'client') {
      switch (normalizedStatus) {
        case 'ACTIVE':
          return {
            variant: 'secondary' as const,
            className: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
            label: 'Active'
          }
        case 'INACTIVE':
          return {
            variant: 'secondary' as const,
            className: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
            label: 'Inactive'
          }
        default:
          return {
            variant: 'outline' as const,
            className: '',
            label: status
          }
      }
    }
    
    // Default variant
    return {
      variant: 'outline' as const,
      className: '',
      label: status
    }
  }

  const config = getStatusConfig()
  
  return (
    <Badge 
      variant={config.variant}
      className={cn(config.className, className)}
    >
      {config.label}
    </Badge>
  )
}
