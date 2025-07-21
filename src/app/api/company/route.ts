import { NextRequest, NextResponse } from 'next/server'
import { getCurrentUser } from '~/lib/auth'
import { prisma } from '~/lib/prisma'

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const company = await prisma.company.findUnique({
      where: { userId: user.id },
    })

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 })
    }

    return NextResponse.json(company)
  } catch (error) {
    console.error('Get company API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { name, email, phone, address, website } = body

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Company name is required' },
        { status: 400 }
      )
    }

    if (name.length > 100) {
      return NextResponse.json(
        { error: 'Company name must be less than 100 characters' },
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

    if (website && typeof website === 'string' && website.length > 0) {
      try {
        new URL(website)
      } catch {
        return NextResponse.json(
          { error: 'Please enter a valid website URL' },
          { status: 400 }
        )
      }
    }

    const company = await prisma.company.upsert({
      where: { userId: user.id },
      update: {
        name: name.trim(),
        email: email && email.trim() ? email.trim() : null,
        phone: phone && phone.trim() ? phone.trim() : null,
        address: address && address.trim() ? address.trim() : null,
        website: website && website.trim() ? website.trim() : null,
      },
      create: {
        name: name.trim(),
        email: email && email.trim() ? email.trim() : null,
        phone: phone && phone.trim() ? phone.trim() : null,
        address: address && address.trim() ? address.trim() : null,
        website: website && website.trim() ? website.trim() : null,
        userId: user.id,
      },
    })

    return NextResponse.json(company)
  } catch (error) {
    console.error('Update company API error:', error)
    return NextResponse.json(
      { error: 'Failed to save company information. Please try again.' },
      { status: 500 }
    )
  }
}
