import { ReactNode } from 'react'
import { Search } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { cn } from '~/lib/utils'

interface SearchFilterSectionProps {
  title?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  searchPlaceholder?: string
  filters?: ReactNode
  className?: string
  showSearch?: boolean
}

export function SearchFilterSection({
  title = 'Search & Filters',
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  filters,
  className,
  showSearch = true
}: SearchFilterSectionProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4">
          {showSearch && (
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={searchValue}
                  onChange={(e) => onSearchChange?.(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          )}
          {filters && (
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
              {filters}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
