import { cva, type VariantProps } from 'class-variance-authority'
import { AlertTriangleIcon, CheckCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const bannerVariants = cva('flex w-full items-center border p-4 text-center text-sm', {
  variants: {
    variant: {
      warning: 'border-yellow-300 bg-yellow-200/80',
      success: 'border-emerald-800 bg-emerald-700 text-secondary',
    },
  },
  defaultVariants: {
    variant: 'warning',
  },
})

const ICON_MAP = {
  warning: AlertTriangleIcon,
  success: CheckCircleIcon,
}

type BannerProps = VariantProps<typeof bannerVariants> & {
  label: string
}

export default function Banner({ label, variant }: BannerProps) {
  const Icon = ICON_MAP[variant ?? 'warning']

  return (
    <div className={cn(bannerVariants({ variant }))}>
      <Icon className="mr-2 h-4 w-4" />
      {label}
    </div>
  )
}
