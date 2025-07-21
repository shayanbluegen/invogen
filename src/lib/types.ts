export interface InvoiceData {
  number: string
  issueDate: Date
  dueDate: Date
  company: {
    name: string
    email?: string
    phone?: string
    address?: string
    website?: string
  }
  client: {
    name: string
    email?: string
    address?: string
  }
  items: Array<{
    description: string
    quantity: number
    unitPrice: number
    amount: number
  }>
  subtotal: number
  taxRate: number
  taxAmount: number
  total: number
  notes?: string
}

export interface InvoiceDataWithId extends InvoiceData {
  id: string
}
