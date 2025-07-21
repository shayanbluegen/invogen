import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '~/lib/auth'
import { prisma } from '~/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const clients = await prisma.client.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(clients)
  } catch (error) {
    console.error('Clients API error:', error)
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
    const { name, email, phone, address } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Client name is required' },
        { status: 400 }
      )
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Name must be less than 100 characters' },
        { status: 400 }
      )
    }

    if (email && typeof email === 'string' && email.length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        return NextResponse.json(
          { error: 'Please enter a valid email address' },
          { status: 400 }
        )
      }
    }

    if (address && typeof address === 'string' && address.length > 500) {
      return NextResponse.json(
        { error: 'Address must be less than 500 characters' },
        { status: 400 }
      )
    }

    const client = await prisma.client.create({
      data: {
        name: name.trim(),
        email: email && email.trim() ? email.trim() : null,
        phone: phone && phone.trim() ? phone.trim() : null,
        address: address && address.trim() ? address.trim() : null,
      },
    })

    return NextResponse.json(client)
  } catch (error) {
    console.error('Create client API error:', error)
    return NextResponse.json(
      { error: 'Failed to create client. Please try again.' },
      { status: 500 }
    )
  }
}
