'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Building2, AlertCircle, CheckCircle2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Textarea } from '~/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Alert, AlertDescription } from '~/components/ui/alert'
import { PageContainer } from '~/components/layouts/page-container'
import { PageHeader } from '~/components/layouts/page-header'
import { ErrorState, SuccessState } from '~/components/ui/error-state'
import { FormSection, FormContainer } from '~/components/layouts/form-section'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { companySchema, type CompanyFormData } from '~/lib/schemas'
import { getCurrencyOptions } from '~/lib/currency'

interface Company {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  website: string | null
  defaultCurrency: string
}

export default function CompanyPage() {
  const [company, setCompany] = useState<Company | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<CompanyFormData>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      website: '',
      defaultCurrency: 'USD',
    },
  })

  const fetchCompany = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch('/api/company')

      if (response.ok) {
        const companyData = await response.json()
        setCompany(companyData)

        const formData = {
          name: companyData.name || '',
          email: companyData.email || '',
          phone: companyData.phone || '',
          address: companyData.address || '',
          website: companyData.website || '',
          defaultCurrency: companyData.defaultCurrency || 'USD',
        }

        // Populate form with company data
        form.reset(formData)
      } else if (response.status === 404) {
        // No company exists yet - this is fine for new users
        setCompany(null)
        setError(null)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to load company information')
      }
    } catch (error) {
      console.error('Failed to fetch company:', error)
      setError('Failed to load company information. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompany()
  }, [form])

  const onSubmit = async (data: CompanyFormData) => {
    setSaving(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/company', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          address: data.address || null,
          website: data.website || null,
          defaultCurrency: data.defaultCurrency,
        }),
      })

      if (response.ok) {
        const updatedCompany = await response.json()
        setCompany(updatedCompany)
        setSuccess('Company information updated successfully!')

        // Clear success message after 5 seconds
        setTimeout(() => setSuccess(null), 5000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to update company information')
      }
    } catch (error) {
      console.error('Failed to update company:', error)
      setError('Failed to update company information. Please check your connection and try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-muted-foreground">Loading company information...</div>
      </div>
    )
  }

  if (error && !company) {
    return (
      <div className="p-8 space-y-8">
        <div className="flex items-center gap-3">
          <Building2 className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Company Settings</h1>
            <p className="text-muted-foreground">Manage your company information that appears on invoices.</p>
          </div>
        </div>

        <div className="max-w-2xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>

          <div className="mt-4">
            <Button onClick={fetchCompany} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <PageContainer maxWidth="2xl">
      <PageHeader
        title="Company Settings"
        description="Manage your company information that appears on invoices."
        icon={<Building2 className="h-8 w-8" />}
      />
      {/* Success Alert */}
      {success && (
        <SuccessState message={success} />
      )}

      {/* Error Alert */}
      {error && (
        <ErrorState variant="alert" message={error} />
      )}

      <FormContainer>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormSection
              title="Company Information"
              description="Update your company details that appear on invoices"
            >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Company Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Company Inc." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contact@yourcompany.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="website"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Website</FormLabel>
                      <FormControl>
                        <Input placeholder="https://yourcompany.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="123 Business St, Suite 100&#10;City, State 12345"
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="defaultCurrency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Default Currency</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select default currency" />
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
            </FormSection>

            <div className="flex gap-4">
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving...' : company ? 'Update Company' : 'Create Company'}
              </Button>
            </div>
          </form>
        </Form>
      </FormContainer>
    </PageContainer>
  )
}
