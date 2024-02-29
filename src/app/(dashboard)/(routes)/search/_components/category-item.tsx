'use client'

import { IconType } from 'react-icons'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { cn } from '@/lib/utils'

type CategoryItemProps = {
  label: string
  icon?: IconType
  value?: string
}

export default function CategoryItem({ label, icon: Icon, value }: CategoryItemProps) {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategoryId = searchParams.get('categoryId')
  const currentTitle = searchParams.get('title')

  const isSelected = currentCategoryId === value

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          title: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true },
    )

    router.push(url)
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-x-1 rounded-full border border-slate-200 px-3 py-2 text-sm transition hover:border-primary',
        { 'border-primary bg-sky-200 text-primary': isSelected },
      )}
      type="button"
    >
      {Icon ? <Icon size={20} /> : null} <div className="truncate">{label}</div>{' '}
    </button>
  )
}
