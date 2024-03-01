'use client'

import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/format'

type CourseEnrollButtonProps = {
  price: number
  courseId: string
}

export default function CourseEnrollButton({ price }: CourseEnrollButtonProps) {
  return (
    <Button className="w-full md:w-auto" size="sm">
      Enroll for {formatPrice(price)}
    </Button>
  )
}
