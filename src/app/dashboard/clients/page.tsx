'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search, MoreHorizontal, Mail, Phone, AlertCircle, RotateCcw, Users } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { PageContainer } from '~/components/layouts/page-container'
import { PageHeader } from '~/components/layouts/page-header'
import { LoadingState, EmptyState } from '~/components/ui/loading-state'
import { ErrorState } from '~/components/ui/error-state'
import { SearchFilterSection } from '~/components/layouts/search-filter-section'
import { DataTableSection } from '~/components/layouts/data-table-section'
import { NameCell, ContactCell, ActionsCell } from '~/components/ui/table-cells'
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

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
}

export default function ClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchClients = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/clients')
      if (response.ok) {
        const clientsData = await response.json()
        setClients(clientsData)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to load clients')
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error)
      setError('Failed to load clients. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClients()
  }, [])

  const handleDelete = async (clientId: string) => {
    setDeleting(clientId)
    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setClients(clients.filter(client => client.id !== clientId))
      } else {
        const errorData = await response.json()
        const errorMessage = errorData.error || 'Failed to delete client'

        // Show more user-friendly error messages
        if (errorMessage.includes('existing invoices')) {
          alert('Cannot delete this client because they have existing invoices. Please delete or reassign their invoices first.')
        } else {
          alert(errorMessage)
        }
      }
    } catch (error) {
      console.error('Failed to delete client:', error)
      alert('Failed to delete client. Please check your connection and try again.')
    } finally {
      setDeleting(null)
    }
  }

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(search.toLowerCase()) ||
    (client.email && client.email.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <PageContainer>
      <PageHeader
        title="Clients"
        description="Manage your clients here."
        icon={<Users className="h-8 w-8" />}
        action={
          <Button onClick={() => router.push('/dashboard/clients/new')}>
            Add Client
          </Button>
        }
      />

      {/* Search */}
      <SearchFilterSection
        title="Search Clients"
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search clients..."
      />

      {/* Error Alert */}
      {error && (
        <ErrorState variant="alert" message={error} />
      )}

      {/* Clients Table */}
      <DataTableSection
        loading={loading}
        loadingMessage="Loading clients..."
        isEmpty={filteredClients.length === 0}
        emptyTitle={search ? 'No clients found matching your search' : 'No clients yet'}
        emptyDescription={search ? 'Try adjusting your search terms' : 'Create your first client to get started'}
        emptyIcon={<Users className="h-12 w-12" />}
        emptyAction={!search ? (
          <Button onClick={() => router.push('/dashboard/clients/new')}>
            Add Your First Client
          </Button>
        ) : undefined}
      >
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Address</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredClients.map((client) => (
            <TableRow key={client.id}>
              <NameCell name={client.name} />
              <ContactCell email={client.email} phone={client.phone} />
              <TableCell>
                <div className="text-sm text-muted-foreground">
                  {client.address || 'No address'}
                </div>
              </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/clients/${client.id}/edit`)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                Delete
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Client</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete {client.name}? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(client.id)}
                                  disabled={deleting === client.id}
                                >
                                  {deleting === client.id ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
            ))}
          </TableBody>
        </DataTableSection>
    </PageContainer>
  )
}
