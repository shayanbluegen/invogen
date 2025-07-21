import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { LoadingState, EmptyState } from '~/components/ui/loading-state'
import { Table } from '~/components/ui/table'
import { cn } from '~/lib/utils'

interface DataTableSectionProps {
  title?: string
  description?: string
  loading?: boolean
  loadingMessage?: string
  isEmpty?: boolean
  emptyTitle?: string
  emptyDescription?: string
  emptyIcon?: ReactNode
  emptyAction?: ReactNode
  children: ReactNode
  className?: string
  headerAction?: ReactNode
}

export function DataTableSection({
  title,
  description,
  loading = false,
  loadingMessage = 'Loading...',
  isEmpty = false,
  emptyTitle = 'No data found',
  emptyDescription = 'There are no items to display',
  emptyIcon,
  emptyAction,
  children,
  className,
  headerAction
}: DataTableSectionProps) {
  return (
    <Card className={className}>
      {(title || description || headerAction) && (
        <CardHeader className={cn(
          "flex flex-row items-center justify-between space-y-0",
          !description && "pb-4"
        )}>
          <div className="space-y-1">
            {title && <CardTitle className="text-xl font-semibold">{title}</CardTitle>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </CardHeader>
      )}
      
      <CardContent className="p-0">
        {loading ? (
          <LoadingState message={loadingMessage} className="h-64" />
        ) : isEmpty ? (
          <EmptyState
            title={emptyTitle}
            description={emptyDescription}
            icon={emptyIcon}
            action={emptyAction}
            className="h-64"
          />
        ) : (
          <div className="overflow-hidden">
            <Table>
              {children}
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
