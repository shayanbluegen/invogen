import { ReactNode } from 'react'
import { Button } from '~/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { cn } from '~/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: ReactNode
  backHref?: string
  action?: ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  icon,
  backHref,
  action,
  className
}: PageHeaderProps) {
  return (
    <div className={cn("flex items-center justify-between", className)}>
      <div className="flex items-center gap-4">
        {backHref && (
          <Link href={backHref}>
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
        )}
        <div className="flex items-center gap-3">
          {icon}
          <div>
            <h1 className="text-3xl font-bold">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
      </div>
      {action && <div>{action}</div>}
    </div>
  )
}
