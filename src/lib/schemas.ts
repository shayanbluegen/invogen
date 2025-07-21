import { z } from 'zod'
import { validateCurrencyCode } from './currency'

export const invoiceItemSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  quantity: z.number().min(0.01, 'Quantity must be greater than 0'),
  unitPrice: z.number().min(0.01, 'Unit price must be greater than 0'),
})

export const invoiceSchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  issueDate: z.date(),
  dueDate: z.date(),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  notes: z.string().optional(),
  taxRate: z.number().min(0).max(100),
  templateId: z.string().optional(),
  currency: z.string()
    .length(3, 'Currency code must be 3 characters')
    .refine(validateCurrencyCode, 'Invalid currency code')
    .default('USD'),
})

export const companySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100, 'Company name must be less than 100 characters'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().optional().refine((val) => {
    if (!val || val === '') return true
    // Basic phone validation - allows various formats
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
    return phoneRegex.test(val.replace(/[\s\-\(\)]/g, ''))
  }, 'Please enter a valid phone number'),
  address: z.string().max(500, 'Address must be less than 500 characters').optional(),
  website: z.string().optional().refine((val) => {
    if (!val || val === '') return true
    try {
      new URL(val)
      return true
    } catch {
      return false
    }
  }, 'Please enter a valid website URL (e.g., https://example.com)'),
  defaultCurrency: z.string()
    .length(3, 'Currency code must be 3 characters')
    .refine(validateCurrencyCode, 'Invalid currency code')
    .default('USD'),
})

export type InvoiceFormData = z.infer<typeof invoiceSchema>
export type InvoiceItemFormData = z.infer<typeof invoiceItemSchema>
export type CompanyFormData = z.infer<typeof companySchema>
