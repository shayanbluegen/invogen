import { NextResponse } from 'next/server'
import { getCurrentUser } from '~/lib/auth'
import { prisma } from '~/lib/prisma'
import { convertMultipleCurrencies } from '~/lib/currency'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentDate = new Date()
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)

    // Get user's company to determine default currency
    const company = await prisma.company.findUnique({
      where: { userId: user.id },
      select: { defaultCurrency: true },
    })
    const defaultCurrency = company?.defaultCurrency || 'USD'

    // Get current month revenue with currency information
    const currentMonthInvoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
        status: 'PAID',
        createdAt: {
          gte: currentMonth,
        },
      },
      select: {
        total: true,
        currency: true,
      },
    })

    // Convert all amounts to default currency
    const currentMonthAmounts = currentMonthInvoices.map(invoice => ({
      amount: Number(invoice.total),
      currency: invoice.currency || 'USD',
    }))

    const currentMonthRevenue = await convertMultipleCurrencies(
      currentMonthAmounts,
      defaultCurrency
    )

    // Get last month revenue for comparison with currency information
    const lastMonthInvoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
        status: 'PAID',
        createdAt: {
          gte: lastMonth,
          lt: currentMonth,
        },
      },
      select: {
        total: true,
        currency: true,
      },
    })

    // Convert all amounts to default currency
    const lastMonthAmounts = lastMonthInvoices.map(invoice => ({
      amount: Number(invoice.total),
      currency: invoice.currency || 'USD',
    }))

    const lastMonthRevenue = await convertMultipleCurrencies(
      lastMonthAmounts,
      defaultCurrency
    )

    // Calculate percentage change
    const revenueChange = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0

    // Get invoices sent this month
    const invoicesSentThisMonth = await prisma.invoice.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: currentMonth,
        },
      },
    })

    const invoicesSentLastMonth = await prisma.invoice.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: lastMonth,
          lt: currentMonth,
        },
      },
    })

    const invoicesChange = invoicesSentLastMonth > 0 
      ? ((invoicesSentThisMonth - invoicesSentLastMonth) / invoicesSentLastMonth) * 100 
      : 0

    // Get pending invoices
    const pendingInvoices = await prisma.invoice.count({
      where: {
        userId: user.id,
        status: {
          in: ['PENDING', 'OVERDUE'],
        },
      },
    })

    // Get overdue invoices
    const overdueInvoices = await prisma.invoice.count({
      where: {
        userId: user.id,
        status: 'OVERDUE',
      },
    })

    // Get recent invoices
    const recentInvoices = await prisma.invoice.findMany({
      where: {
        userId: user.id,
      },
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
      take: 5,
    })

    return NextResponse.json({
      metrics: {
        totalRevenue: {
          current: currentMonthRevenue,
          change: revenueChange,
          currency: defaultCurrency,
        },
        invoicesSent: {
          current: invoicesSentThisMonth,
          change: invoicesChange,
        },
        pendingInvoices: {
          current: pendingInvoices,
          overdue: overdueInvoices,
        },
      },
      defaultCurrency,
      recentInvoices: recentInvoices.map(invoice => ({
        id: invoice.id,
        number: invoice.number || `INV-${invoice.id.slice(-6)}`,
        client: {
          name: invoice.client?.name || 'Unknown Client',
          email: invoice.client?.email || null,
        },
        status: invoice.status,
        total: Number(invoice.total) || 0,
        currency: invoice.currency || 'USD',
        dueDate: invoice.dueDate?.toISOString() || new Date().toISOString(),
        createdAt: invoice.createdAt?.toISOString() || new Date().toISOString(),
      })),
    })
  } catch (error) {
    console.error('Dashboard API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
