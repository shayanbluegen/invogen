import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export interface User {
  id: string
  name: string
  email: string
  company?: {
    id: string
    name: string
    email?: string | null
    phone?: string | null
    address?: string | null
    logo?: string | null
    website?: string | null
  } | null
}

export async function login(email: string, password: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { company: true },
    })

    if (!user) {
      return null
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return null
    }

    // Set session cookie
    const cookieStore = await cookies()
    cookieStore.set('session', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
    }
  } catch (error) {
    console.error('Login error:', error)
    return null
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
      return null
    }

    const user = await prisma.user.findUnique({
      where: { id: sessionCookie.value },
      include: { company: true },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      company: user.company,
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/login')
  }
  return user
}
