import { LucideIcon } from 'lucide-react'
import { cn } from '~/lib/utils'

interface IconProps {
  icon: LucideIcon
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  className?: string
}

const sizeClasses = {
  xs: 'h-3 w-3',
  sm: 'h-4 w-4', 
  md: 'h-5 w-5',
  lg: 'h-6 w-6',
  xl: 'h-8 w-8',
  '2xl': 'h-12 w-12'
}

export function Icon({ icon: IconComponent, size = 'sm', className }: IconProps) {
  return (
    <IconComponent 
      className={cn(sizeClasses[size], className)} 
    />
  )
}

// Common icon configurations for consistency
export const iconSizes = {
  // Button icons
  buttonIcon: 'h-4 w-4',
  buttonIconLarge: 'h-5 w-5',
  
  // Navigation icons
  navIcon: 'h-4 w-4',
  
  // Page header icons
  pageIcon: 'h-8 w-8',
  
  // Status and indicator icons
  statusIcon: 'h-4 w-4',
  
  // Empty state icons
  emptyStateIcon: 'h-12 w-12',
  
  // Metric card icons
  metricIcon: 'h-4 w-4',
  
  // Trend icons
  trendIcon: 'h-3 w-3',
  
  // Action icons in tables
  actionIcon: 'h-4 w-4',
  
  // Loading icons
  loadingIcon: 'h-6 w-6',
  loadingIconSmall: 'h-4 w-4',
  loadingIconLarge: 'h-8 w-8'
} as const

// Helper function to get consistent icon classes
export function getIconClass(usage: keyof typeof iconSizes, additionalClasses?: string) {
  return cn(iconSizes[usage], additionalClasses)
}
