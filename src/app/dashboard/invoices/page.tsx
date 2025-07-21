'use client'

import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  Trash2,
  AlertCircle,
  RotateCcw,
  FileText,
  MoreHorizontal
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { StatusBadge } from '~/components/ui/status-badge'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { PageContainer } from '~/components/layouts/page-container'
import { PageHeader } from '~/components/layouts/page-header'
import { LoadingState, EmptyState } from '~/components/ui/loading-state'
import { ErrorState } from '~/components/ui/error-state'
import { SearchFilterSection } from '~/components/layouts/search-filter-section'
import { DataTableSection } from '~/components/layouts/data-table-section'
import { NameCell, StatusCell, AmountCell, DateCell, ActionsCell } from '~/components/ui/table-cells'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '~/components/ui/table'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'

interface Invoice {
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
  issueDate: string
  createdAt: string
}

interface InvoicesData {
  invoices: Invoice[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function InvoicesPage() {
  const router = useRouter()
  const [data, setData] = useState<InvoicesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchInvoices = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10',
      })

      if (search) params.append('search', search)
      if (status !== 'all') params.append('status', status)

      const response = await fetch(`/api/invoices?${params}`)
      if (response.ok) {
        const invoicesData = await response.json()
        setData(invoicesData)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to load invoices')
      }
    } catch (error) {
      console.error('Failed to fetch invoices:', error)
      setError('Failed to load invoices. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (invoiceId: string) => {
    setDeleting(invoiceId)
    try {
      const response = await fetch(`/api/invoices/${invoiceId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Refresh the invoices list
        fetchInvoices()
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete invoice')
      }
    } catch (error) {
      console.error('Failed to delete invoice:', error)
      alert('Failed to delete invoice. Please try again.')
    } finally {
      setDeleting(null)
    }
  }

  useEffect(() => {
    fetchInvoices()
  }, [search, status, page])

  const getStatusBadge = (status: string) => {
    return <StatusBadge status={status} variant="invoice" />
  }

  return (
    <PageContainer>
      <PageHeader
        title="Invoices"
        description="Manage your invoices here."
        icon={<FileText className="h-8 w-8" />}
        action={
          <Link href="/dashboard/invoices/new">
            <Button>
              Create Invoice
            </Button>
          </Link>
        }
      />

      {/* Filters */}
      <SearchFilterSection
        title="Search & Filter Invoices"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search invoices..."
        filters={
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        }
      />

      {/* Error Alert */}
      {error && (
        <ErrorState variant="alert" message={error} />
      )}

      {/* Invoices Table */}
      <DataTableSection
        loading={loading}
        loadingMessage="Loading invoices..."
        isEmpty={!data?.invoices || data.invoices.length === 0}
        emptyTitle={search || status !== 'all' ? 'No invoices found' : 'No invoices yet'}
        emptyDescription={search || status !== 'all'
          ? 'Try adjusting your search or filters'
          : 'Create your first invoice to get started'
        }
        emptyIcon={<FileText className="h-12 w-12" />}
        emptyAction={!(search || status !== 'all') ? (
          <Link href="/dashboard/invoices/new">
            <Button>Create Your First Invoice</Button>
          </Link>
        ) : undefined}
      >
        <TableHeader>
          <TableRow>
            <TableHead>Invoice #</TableHead>
            <TableHead>Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="w-[70px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
              <TableBody>
                {data?.invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
              <TableCell className="font-medium">{invoice.number}</TableCell>
              <NameCell
                name={invoice.client.name}
                subtitle={invoice.client.email || undefined}
              />
              <StatusCell status={invoice.status} variant="invoice" />
              <DateCell date={invoice.dueDate} />
              <AmountCell amount={invoice.total} currency={invoice.currency} />
              <ActionsCell
                actions={[
                  {
                    label: 'View',
                    onClick: () => router.push(`/dashboard/invoices/${invoice.id}`)
                  },
                  {
                    label: 'Delete',
                    onClick: () => handleDelete(invoice.id),
                    variant: 'destructive'
                  }
                ]}
              />
                  </TableRow>
                ))}
        </TableBody>
      </DataTableSection>

      {/* Pagination */}
      {data && data.pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {((page - 1) * 10) + 1} to {Math.min(page * 10, data.pagination.total)} of {data.pagination.total} invoices
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage(page + 1)}
              disabled={page === data.pagination.pages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
