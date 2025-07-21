'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { CalendarIcon, Trash2, FileText } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { PageContainer } from '~/components/layouts/page-container'
import { PageHeader } from '~/components/layouts/page-header'
import { ErrorState } from '~/components/ui/error-state'
import { Calendar } from '~/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { cn } from '~/lib/utils'
import { invoiceSchema } from '~/lib/schemas'
import { TemplateSelector } from '~/components/pdf-templates/template-selector'
import { PDFPreview } from '~/components/pdf-templates/pdf-preview'
import { getCurrencyOptions } from '~/lib/currency'


interface Client {
  id: string
  name: string
  email: string | null
  address: string | null
}

export default function NewInvoicePage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState('modern-minimalist')
  const [company, setCompany] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const form = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: '',
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      items: [{ description: '', quantity: 1, unitPrice: 0 }],
      notes: '',
      taxRate: 10,
      currency: 'USD', // Default currency, will be updated when company data loads
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  })

  const watchedValues = form.watch()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setError(null)

        const [clientsResponse, companyResponse] = await Promise.all([
          fetch('/api/clients'),
          fetch('/api/company')
        ])

        if (clientsResponse.ok) {
          const clientsData = await clientsResponse.json()
          setClients(clientsData)
        } else {
          console.error('Failed to fetch clients')
        }

        if (companyResponse.ok) {
          const companyData = await companyResponse.json()
          setCompany(companyData)
          // Set default currency from company settings
          if (companyData.defaultCurrency) {
            form.setValue('currency', companyData.defaultCurrency)
          }
        } else {
          console.error('Failed to fetch company data')
        }
      } catch (error) {
        console.error('Failed to fetch data:', error)
        setError('Failed to load required data. Please refresh the page.')
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (watchedValues.clientId) {
      const client = clients.find(c => c.id === watchedValues.clientId)
      setSelectedClient(client || null)
    }
  }, [watchedValues.clientId, clients])

  const onSubmit = async (data: any) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          templateId: selectedTemplate, // Include the selected template
        }),
      })

      if (response.ok) {
        router.push('/dashboard/invoices')
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create invoice')
      }
    } catch (error) {
      console.error('Failed to create invoice:', error)
      setError('Failed to create invoice. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  const calculateSubtotal = () => {
    const result = watchedValues.items?.reduce((sum, item) => {
      const quantity = Number(item.quantity) || 0;
      const unitPrice = Number(item.unitPrice) || 0;
      return sum + (quantity * unitPrice);
    }, 0) || 0;
    return isNaN(result) ? 0 : result;
  }

  const calculateTax = () => {
    const subtotal = calculateSubtotal();
    const taxRate = Number(watchedValues.taxRate) || 0;
    const result = (subtotal * taxRate) / 100;
    return isNaN(result) ? 0 : result;
  }

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const result = subtotal + tax;
    return isNaN(result) ? 0 : result;
  }

  return (
    <PageContainer>
      <PageHeader
        title="Create Invoice"
        description="Create a new invoice for your client."
        backHref="/dashboard/invoices"
        action={
          <div className="flex items-center gap-3">
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onSelectTemplate={setSelectedTemplate}
            />
          </div>
        }
      />

      {/* Error Alert */}
      {error && (
        <ErrorState variant="alert" message={error} />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className="space-y-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Client Information */}
              <Card>
                <CardHeader>
                  <CardTitle>Client Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Client</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a client" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Invoice Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="issueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Issue Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() || date < new Date('1900-01-01')
                                }
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dueDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>Due Date</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, 'PPP')
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) => date < new Date()}
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="taxRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tax Rate (%)</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="currency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Currency</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {getCurrencyOptions().map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Invoice Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-5">
                        <FormField
                          control={form.control}
                          name={`items.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input placeholder="Item description" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.quantity`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Qty</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <FormField
                          control={form.control}
                          name={`items.${index}.unitPrice`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Unit Price</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  step="0.01"
                                  min="0"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <FormItem>
                          <FormLabel>Amount</FormLabel>
                          <FormControl>
                            <Input
                              type="string"
                              onChange={() => {}}
                              value={`$${((watchedValues.items?.[index]?.quantity || 0) * (watchedValues.items?.[index]?.unitPrice || 0)).toFixed(2)}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </div>
                      <div className="col-span-1">
                        {fields.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
                    className="w-full"
                  >
                    Add Item
                  </Button>
                </CardContent>
              </Card>

              {/* Notes */}
              <Card>
                <CardHeader>
                  <CardTitle>Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Notes</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Any additional notes..."
                            className="resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Actions */}
              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Invoice'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </div>

        {/* Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5" />
                  Invoice Preview
                </CardTitle>

              </div>
            </CardHeader>
            <CardContent className="p-4">
              <PDFPreview
                templateId={selectedTemplate}
                invoice={{
                  number: 'INV-NEW',
                  issueDate: watchedValues.issueDate || new Date(),
                  dueDate: watchedValues.dueDate || new Date(),
                  currency: watchedValues.currency || 'USD',
                  company: company || {
                    name: '[Company Name]',
                    email: '[Company Email]',
                    phone: '[Company Phone]',
                    address: '[Company Address]',
                    website: '[Company Website]',
                  },
                  client: selectedClient ? {
                    name: selectedClient.name,
                    email: selectedClient.email || undefined,
                    address: selectedClient.address || undefined,
                  } : {
                    name: '[Select a client]',
                    email: undefined,
                    address: undefined,
                  },
                  items: watchedValues.items?.map(item => {
                    const quantity = Number(item.quantity) || 1;
                    const unitPrice = Number(item.unitPrice) || 0;
                    const amount = quantity * unitPrice;
                    return {
                      description: item.description || '[Item description]',
                      quantity: isNaN(quantity) ? 1 : quantity,
                      unitPrice: isNaN(unitPrice) ? 0 : unitPrice,
                      amount: isNaN(amount) ? 0 : amount,
                    };
                  }) || [],
                  subtotal: calculateSubtotal(),
                  taxRate: Number(watchedValues.taxRate) || 0,
                  taxAmount: calculateTax(),
                  total: calculateTotal(),
                  notes: watchedValues.notes,
                }}
                maxHeight={800}
                minHeight={500}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  )
}
