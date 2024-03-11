import { cn } from '@/lib/utils'
import { Progress } from '../ui/progress'

type CourseProgressProps = {
  value: number
  variant?: 'default' | 'success'
  size?: 'default' | 'sm'
}

const COLOR_BY_VARIANT = {
  default: 'text-sky-700',
  success: 'text-emerald-700',
}

const SIZE_BY_VARIANT = {
  default: 'text-sm',
  sm: 'text-xs',
}

export default function CourseProgress({ value, variant, size }: CourseProgressProps) {
  return (
    <div>
      <Progress className="h-2" value={value} variant={variant} />

      <p
        className={cn(
          'mt-2 font-medium text-primary',
          COLOR_BY_VARIANT[variant ?? 'default'],
          SIZE_BY_VARIANT[size ?? 'default'],
        )}
      >
        {Math.round(value)}% Complete
      </p>
    </div>
  )
}
