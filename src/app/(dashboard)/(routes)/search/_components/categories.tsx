'use client'

import { Category } from '@prisma/client'
import {
  FcEngineering,
  FcFilmReel,
  FcMultipleDevices,
  FcMusic,
  FcOldTimeCamera,
  FcSalesPerformance,
  FcSportsMode,
} from 'react-icons/fc'
import { IconType } from 'react-icons'
import CategoryItem from './category-item'

type CategoriesProps = {
  items: Category[]
}

const ICONS_MAP: Record<string, IconType> = {
  'Computer Science': FcMultipleDevices,
  Music: FcMusic,
  Fitness: FcSportsMode,
  Photography: FcOldTimeCamera,
  Accounting: FcSalesPerformance,
  Engineering: FcEngineering,
  Filming: FcFilmReel,
}

export default function Categories({ items }: CategoriesProps) {
  return (
    <div className="flex items-center gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem key={item.id} label={item.name} icon={ICONS_MAP[item.name]} value={item.id} />
      ))}
    </div>
  )
}
