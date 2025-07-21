import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '~/lib/auth'
import { prisma } from '~/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      userId: user.id,
    }

    if (status && status !== 'all') {
      where.status = status.toUpperCase()
    }

    if (search) {
      where.OR = [
        { number: { contains: search, mode: 'insensitive' } },
        { client: { name: { contains: search, mode: 'insensitive' } } },
        { client: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    // Get invoices with pagination
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          client: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.invoice.count({ where }),
    ])

    return NextResponse.json({
      invoices: invoices.map(invoice => ({
        id: invoice.id,
        number: invoice.number,
        client: {
          name: invoice.client.name,
          email: invoice.client.email,
        },
        status: invoice.status,
        total: Number(invoice.total),
        dueDate: invoice.dueDate,
        issueDate: invoice.issueDate,
        createdAt: invoice.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Invoices API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      clientId,
      issueDate,
      dueDate,
      items,
      notes,
      taxRate = 0,
      templateId = 'modern-minimalist', // Default template if not provided
    } = body

    // Validate required fields
    if (!clientId || !issueDate || !dueDate || !items || items.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = items.reduce((sum: number, item: any) => 
      sum + (item.quantity * item.unitPrice), 0
    )
    const taxAmount = (subtotal * taxRate) / 100
    const total = subtotal + taxAmount

    // Generate invoice number
    const lastInvoice = await prisma.invoice.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      select: { number: true },
    })

    let invoiceNumber = 'INV-001'
    if (lastInvoice) {
      const lastNumber = parseInt(lastInvoice.number.split('-')[1])
      invoiceNumber = `INV-${String(lastNumber + 1).padStart(3, '0')}`
    }

    // Get user's company
    const company = await prisma.company.findUnique({
      where: { userId: user.id },
    })

    if (!company) {
      return NextResponse.json(
        { error: 'Company not found' },
        { status: 400 }
      )
    }

    // Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        number: invoiceNumber,
        issueDate: new Date(issueDate),
        dueDate: new Date(dueDate),
        subtotal,
        taxRate,
        taxAmount,
        total,
        notes,
        theme: templateId, // Save the selected template ID
        userId: user.id,
        companyId: company.id,
        clientId,
        items: {
          create: items.map((item: any) => ({
            description: item.description,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            amount: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        client: true,
        items: true,
      },
    })

    return NextResponse.json(invoice)
  } catch (error) {
    console.error('Create invoice API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
