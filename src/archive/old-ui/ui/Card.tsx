import { HTMLAttributes, forwardRef } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hover?: boolean
  clickable?: boolean
  animate?: boolean
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({
    className,
    variant = 'default',
    padding = 'md',
    hover = false,
    clickable = false,
    animate = true,
    children,
    ...props
  }, ref) => {
    const baseClasses = 'rounded-2xl transition-all duration-200'
    
    const variants = {
      default: 'bg-white border border-gray-100 shadow-lg',
      elevated: 'bg-white shadow-xl border border-gray-50',
      outlined: 'bg-white border-2 border-gray-200',
      glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-lg',
    }
    
    const paddings = {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    }
    
    const hoverClasses = hover || clickable ? 'hover:shadow-xl hover:scale-105' : ''
    const clickableClasses = clickable ? 'cursor-pointer' : ''

    const cardClasses = cn(
      baseClasses,
      variants[variant],
      paddings[padding],
      hoverClasses,
      clickableClasses,
      className
    )

    const CardComponent = animate ? motion.div : 'div'
    const motionProps = animate ? {
      whileHover: hover || clickable ? { 
        scale: 1.02,
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      } : {},
      whileTap: clickable ? { 
        scale: 0.98,
        transition: { type: 'spring', stiffness: 400, damping: 17 }
      } : {},
    } : {}

    return (
      <CardComponent
        ref={ref}
        className={cardClasses}
        {...motionProps}
        {...props}
      >
        {children}
      </CardComponent>
    )
  }
)

Card.displayName = 'Card'

// Card sub-components
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  title?: string
  subtitle?: string
  action?: React.ReactNode
}

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, title, subtitle, action, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex items-start justify-between mb-4', className)}
      {...props}
    >
      <div className="flex-1">
        {title && (
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {title}
          </h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-600">
            {subtitle}
          </p>
        )}
        {children}
      </div>
      {action && (
        <div className="ml-4 flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  )
)

CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('', className)}
      {...props}
    />
  )
)

CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('mt-6 pt-4 border-t border-gray-100', className)}
      {...props}
    />
  )
)

CardFooter.displayName = 'CardFooter'

export default Card
