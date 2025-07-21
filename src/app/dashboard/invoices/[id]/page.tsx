'use client'

import { use, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { ArrowLeft, AlertCircle, RotateCcw, ChevronDown } from 'lucide-react'
import Link from 'next/link'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { PDFPreview } from '~/components/pdf-templates/pdf-preview'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '~/components/ui/alert-dialog'

interface Invoice {
  id: string
  number: string
  issueDate: string
  dueDate: string
  status: string
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  notes?: string
  theme?: string
  client: {
    id: string
    name: string
    email?: string
    address?: string
  }
  company: {
    id: string
    name: string
    email?: string
    phone?: string
    address?: string
    website?: string
  }
  items: Array<{
    id: string
    description: string
    quantity: number
    unitPrice: number
    amount: number
  }>
}

export default function InvoiceViewPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const router = useRouter()
  const resolvedParams = use(params)
  const [invoice, setInvoice] = useState<Invoice | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [updatingStatus, setUpdatingStatus] = useState(false)


  const fetchInvoice = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/invoices/${resolvedParams.id}`)

      if (response.ok) {
        const invoiceData = await response.json()
        setInvoice(invoiceData)
      } else if (response.status === 404) {
        setError('Invoice not found')
        setTimeout(() => router.push('/dashboard/invoices'), 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to load invoice')
      }
    } catch (error) {
      console.error('Failed to fetch invoice:', error)
      setError('Failed to load invoice. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchInvoice()
  }, [resolvedParams.id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const response = await fetch(`/api/invoices/${resolvedParams.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/dashboard/invoices')
      }
    } catch (error) {
      console.error('Failed to delete invoice:', error)
    } finally {
      setDeleting(false)
    }
  }

  const handleStatusUpdate = async (newStatus: string) => {
    setUpdatingStatus(true)
    try {
      const response = await fetch(`/api/invoices/${resolvedParams.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: newStatus,
        }),
      })

      if (response.ok) {
        const updatedInvoice = await response.json()
        setInvoice(updatedInvoice)
      } else {
        const errorData = await response.json()
        console.error('Failed to update status:', errorData)
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Paid</Badge>
      case 'PENDING':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Pending</Badge>
      case 'OVERDUE':
        return <Badge variant="destructive">Overdue</Badge>
      case 'DRAFT':
        return <Badge variant="outline">Draft</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading invoice...</div>
      </div>
    )
  }

  if (error || !invoice) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Invoice</h1>
            <p className="text-muted-foreground">View invoice details.</p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button onClick={fetchInvoice} variant="outline" size="sm">
              Try Again
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }



  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/invoices">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Invoice {invoice.number}</h1>
            <div className="flex items-center gap-2 mt-1">
              {getStatusBadge(invoice.status)}
              <span className="text-muted-foreground">
                Due {format(new Date(invoice.dueDate), 'MMM dd, yyyy')}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" disabled={updatingStatus}>
                {updatingStatus ? 'Updating...' : 'Change Status'}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleStatusUpdate('DRAFT')}
                disabled={invoice.status === 'DRAFT'}
              >
                Draft
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate('PENDING')}
                disabled={invoice.status === 'PENDING'}
              >
                Pending
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate('PAID')}
                disabled={invoice.status === 'PAID'}
              >
                Paid
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate('OVERDUE')}
                disabled={invoice.status === 'OVERDUE'}
              >
                Overdue
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusUpdate('CANCELLED')}
                disabled={invoice.status === 'CANCELLED'}
              >
                Cancelled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Invoice</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete invoice {invoice.number}? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Deleting...' : 'Delete'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Invoice Preview */}
      <Card>
        <CardContent className="p-4">
          <PDFPreview
            templateId={invoice.theme || "modern-minimalist"}
            invoice={{
              number: invoice.number,
              issueDate: new Date(invoice.issueDate),
              dueDate: new Date(invoice.dueDate),
              company: invoice.company,
              client: invoice.client,
              items: invoice.items.map(item => ({
                ...item,
                quantity: Number(item.quantity) || 0,
                unitPrice: Number(item.unitPrice) || 0,
                amount: Number(item.amount) || 0,
              })),
              subtotal: Number(invoice.subtotal) || 0,
              taxRate: Number(invoice.taxRate) || 0,
              taxAmount: Number(invoice.taxAmount) || 0,
              total: Number(invoice.total) || 0,
              notes: invoice.notes,
            }}
            minHeight={600}
          />
        </CardContent>
      </Card>
    </div>
  )
}
