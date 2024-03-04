import { LucideIcon } from 'lucide-react'
import IconBadge from '@/components/icon-badge'

type InfoCardProps = {
  label: string
  numberOfItems: number
  variant?: 'default' | 'success'
  icon: LucideIcon
}

export default function InfoCard({ icon, variant, label, numberOfItems }: InfoCardProps) {
  return (
    <div className="flex items-center gap-x-2 rounded-md border p-3">
      <IconBadge icon={icon} variant={variant} />

      <div>
        <p className="font-medium">{label}</p>
        <p className="text-sm text-gray-500">
          {numberOfItems} {numberOfItems === 1 ? 'Course' : 'Courses'}
        </p>
      </div>
    </div>
  )
}
