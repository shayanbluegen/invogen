import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { TrendingUp, TrendingDown } from 'lucide-react'
import { cn } from '~/lib/utils'

interface MetricCardProps {
  title: string
  value: string | number
  icon?: ReactNode
  trend?: {
    value: number
    label?: string
  }
  description?: string
  className?: string
}

export function MetricCard({
  title,
  value,
  icon,
  trend,
  description,
  className
}: MetricCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === 'number') {
      return val.toLocaleString()
    }
    return val
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatValue(value)}
        </div>
        {trend && (
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {trend.value >= 0 ? (
              <TrendingUp className="h-3 w-3 mr-1 text-green-600" />
            ) : (
              <TrendingDown className="h-3 w-3 mr-1 text-red-600" />
            )}
            <span className={cn(
              trend.value >= 0 ? 'text-green-600' : 'text-red-600'
            )}>
              {Math.abs(trend.value).toFixed(1)}%
            </span>
            {trend.label && (
              <span className="ml-1">{trend.label}</span>
            )}
          </div>
        )}
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

interface MetricsSectionProps {
  children: ReactNode
  className?: string
  columns?: 1 | 2 | 3 | 4
}

export function MetricsSection({ 
  children, 
  className,
  columns = 3 
}: MetricsSectionProps) {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }

  return (
    <div className={cn(
      'grid gap-6',
      gridCols[columns],
      className
    )}>
      {children}
    </div>
  )
}
