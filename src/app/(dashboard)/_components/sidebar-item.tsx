'use client'

import { LucideIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

type SidebarItemProps = {
  icon: LucideIcon
  label: string
  href: string
}

export default function SidebarItem({ icon: Icon, label, href }: SidebarItemProps) {
  const pathname = usePathname()
  const router = useRouter()

  const isActive = (pathname === '/' && href === '/') || pathname === href || pathname?.startsWith(`${href}/`)

  const onClick = () => {
    router.push(href)
  }

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        'flex items-center gap-x-2 pl-6 text-sm font-medium text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600',
        { 'bg-sky-200/20 text-sky-700 hover:bg-sky-200/20 hover:text-sky-700': isActive },
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon size={22} className={cn('text-slate-500', { 'text-sky-700': isActive })} />
        {label}
      </div>

      <div
        className={cn('ml-auto h-full border-2 border-sky-700 opacity-0 transition-all', { 'opacity-100': isActive })}
      />
    </button>
  )
}
