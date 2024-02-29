'use client'

import { SearchIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import qs from 'query-string'
import { Input } from '../ui/input'
import { useDebounce } from '@/hooks/use-debounce'

export default function SearchInput() {
  const [value, setValue] = useState('')
  const debouncedValue = useDebounce(value)

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const currentCategoryId = searchParams.get('categoryId')

  useEffect(
    function updateSearchParams() {
      const url = qs.stringifyUrl(
        {
          url: pathname,
          query: {
            categoryId: currentCategoryId,
            title: debouncedValue,
          },
        },
        { skipNull: true, skipEmptyString: true },
      )

      router.push(url)
    },

    [currentCategoryId, debouncedValue, pathname, router],
  )

  return (
    <div className="relative">
      <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-slate-600" />
      <Input
        onChange={(e) => {
          setValue(e.target.value)
        }}
        className="w-full rounded-full bg-slate-100 pl-9 focus-visible:ring-slate-200 md:w-80"
        placeholder="Search courses..."
      />
    </div>
  )
}
