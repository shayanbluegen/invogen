import { NextResponse } from 'next/server'
import { getCurrentUser } from '~/lib/auth'
import { prisma } from '~/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const currentDate = new Date()
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)

    // Get current month revenue
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
      },
    })

    const currentMonthRevenue = currentMonthInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.total),
      0
    )

    // Get last month revenue for comparison
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
      },
    })

    const lastMonthRevenue = lastMonthInvoices.reduce(
      (sum, invoice) => sum + Number(invoice.total),
      0
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
