import { ReactNode } from 'react'
import { TableCell } from '~/components/ui/table'
import { Button } from '~/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '~/components/ui/dropdown-menu'
import { MoreHorizontal, Mail, Phone } from 'lucide-react'
import { StatusBadge } from '~/components/ui/status-badge'
import { cn } from '~/lib/utils'

interface NameCellProps {
  name: string
  subtitle?: string
  className?: string
}

export function NameCell({ name, subtitle, className }: NameCellProps) {
  return (
    <TableCell className={cn('font-medium', className)}>
      <div>
        <div className="font-medium">{name}</div>
        {subtitle && (
          <div className="text-sm text-muted-foreground">{subtitle}</div>
        )}
      </div>
    </TableCell>
  )
}

interface ContactCellProps {
  email?: string | null
  phone?: string | null
  className?: string
}

export function ContactCell({ email, phone, className }: ContactCellProps) {
  return (
    <TableCell className={className}>
      <div className="space-y-1">
        {email && (
          <div className="flex items-center text-sm">
            <Mail className="mr-2 h-3 w-3 text-muted-foreground" />
            <span className="truncate">{email}</span>
          </div>
        )}
        {phone && (
          <div className="flex items-center text-sm">
            <Phone className="mr-2 h-3 w-3 text-muted-foreground" />
            <span>{phone}</span>
          </div>
        )}
        {!email && !phone && (
          <span className="text-sm text-muted-foreground">No contact info</span>
        )}
      </div>
    </TableCell>
  )
}

interface StatusCellProps {
  status: string
  variant?: 'invoice' | 'client' | 'default'
  className?: string
}

export function StatusCell({ status, variant = 'default', className }: StatusCellProps) {
  return (
    <TableCell className={className}>
      <StatusBadge status={status} variant={variant} />
    </TableCell>
  )
}

interface AmountCellProps {
  amount: number
  currency?: string
  className?: string
}

export function AmountCell({ amount, currency = '$', className }: AmountCellProps) {
  return (
    <TableCell className={cn('text-right font-medium', className)}>
      {currency}{amount.toLocaleString()}
    </TableCell>
  )
}

interface DateCellProps {
  date: string | Date
  format?: 'short' | 'long'
  className?: string
}

export function DateCell({ date, format = 'short', className }: DateCellProps) {
  const formatDate = (dateValue: string | Date) => {
    try {
      const dateObj = typeof dateValue === 'string' ? new Date(dateValue) : dateValue
      if (format === 'long') {
        return dateObj.toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })
      }
      return dateObj.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch (error) {
      return 'Invalid date'
    }
  }

  return (
    <TableCell className={className}>
      {formatDate(date)}
    </TableCell>
  )
}

interface ActionsCellProps {
  actions: Array<{
    label: string
    onClick: () => void
    variant?: 'default' | 'destructive'
  }>
  className?: string
}

export function ActionsCell({ actions, className }: ActionsCellProps) {
  return (
    <TableCell className={cn('text-center', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {actions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              onClick={action.onClick}
              className={cn(
                action.variant === 'destructive' && 
                'text-destructive focus:text-destructive'
              )}
            >
              {action.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </TableCell>
  )
}
