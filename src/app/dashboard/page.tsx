'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import {
  DollarSign,
  FileText,
  Clock,
  MoreHorizontal,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { formatCurrency } from '~/lib/currency'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { StatusBadge } from '~/components/ui/status-badge'
import { PageContainer } from '~/components/layouts/page-container'
import { PageHeader } from '~/components/layouts/page-header'
import { LoadingState, EmptyState } from '~/components/ui/loading-state'
import { ErrorState } from '~/components/ui/error-state'
import { MetricsSection, MetricCard } from '~/components/layouts/metrics-section'
import { DataTableSection } from '~/components/layouts/data-table-section'
import { NameCell, StatusCell, AmountCell, DateCell, ActionsCell } from '~/components/ui/table-cells'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'


interface DashboardData {
  metrics: {
    totalRevenue: {
      current: number
      change: number
    }
    invoicesSent: {
      current: number
      change: number
    }
    pendingInvoices: {
      current: number
      overdue: number
    }
  }
  recentInvoices: Array<{
    id: string
    number: string
    client: {
      name: string
      email: string | null
    }
    status: string
    total: number
    currency: string
    dueDate: string
    createdAt: string
  }>
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [defaultCurrency, setDefaultCurrency] = useState<string>('USD')

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch both dashboard data and company info in parallel
      const [dashboardResponse, companyResponse] = await Promise.all([
        fetch('/api/dashboard'),
        fetch('/api/company')
      ])

      if (!dashboardResponse.ok) {
        throw new Error(`Failed to fetch dashboard data: ${dashboardResponse.status}`)
      }

      const dashboardData = await dashboardResponse.json()
      setData(dashboardData)

      // Get company's default currency if available
      if (companyResponse.ok) {
        const companyData = await companyResponse.json()
        if (companyData.defaultCurrency) {
          setDefaultCurrency(companyData.defaultCurrency)
        }
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setError(error instanceof Error ? error.message : 'Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} variant="invoice" />
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingState message="Loading dashboard..." />
      </PageContainer>
    )
  }

  if (error || !data) {
    return (
      <PageContainer>
        <ErrorState
          message={error || 'Failed to load dashboard data'}
          onRetry={fetchData}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <PageHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your invoices."
      />

      {/* Metrics Cards */}
      <MetricsSection>
        <MetricCard
          title="Total Revenue (This Month)"
          value={formatCurrency(data.metrics.totalRevenue.current, defaultCurrency)}
          icon={<DollarSign className="h-4 w-4" />}
          trend={{
            value: data.metrics.totalRevenue.change,
            label: 'from last month'
          }}
        />

        <MetricCard
          title="Invoices Sent (This Month)"
          value={`+${data.metrics.invoicesSent.current}`}
          icon={<FileText className="h-4 w-4" />}
          trend={{
            value: data.metrics.invoicesSent.change,
            label: 'from last month'
          }}
        />

        <MetricCard
          title="Pending Invoices"
          value={data.metrics.pendingInvoices.current}
          icon={<Clock className="h-4 w-4" />}
          description={`${data.metrics.pendingInvoices.overdue} overdue`}
        />
      </MetricsSection>

      {/* Recent Invoices */}
      <DataTableSection
        title="Recent Invoices"
        description="A list of your most recent invoices."
        isEmpty={data.recentInvoices.length === 0}
        emptyTitle="No invoices found"
        emptyDescription="Create your first invoice to get started"
        emptyIcon={<FileText className="h-12 w-12" />}
      >
        <TableHeader>
          <TableRow>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[70px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.recentInvoices.map((invoice) => (
            <TableRow key={invoice.id}>
              <NameCell
                name={invoice.client.name}
                subtitle={invoice.client.email || 'No email'}
              />
              <StatusCell status={invoice.status} variant="invoice" />
              <DateCell date={invoice.createdAt} />
              <AmountCell amount={invoice.total} currency={invoice.currency} />
              <ActionsCell
                actions={[
                  {
                    label: 'View',
                    onClick: () => router.push(`/dashboard/invoices/${invoice.id}`)
                  },
                  {
                    label: 'Delete',
                    onClick: () => {/* TODO: Implement delete */},
                    variant: 'destructive'
                  }
                ]}
              />
            </TableRow>
          ))}
        </TableBody>
      </DataTableSection>
    </PageContainer>
  )
}
