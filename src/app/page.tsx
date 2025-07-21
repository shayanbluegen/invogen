import { redirect } from 'next/navigation'

export default function HomePage() {
	// This page should redirect to dashboard or login based on auth state
	// The middleware handles this, but we'll provide a fallback
	redirect('/dashboard')
}
