'use client'

import { TrashIcon } from 'lucide-react'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ConfirmModal } from '@/components/modals'

type ChapterActionsProps = {
  disabled?: boolean
  isPublished?: boolean
  courseId: string
  chapterId: string
}

export default function ChapterActions({ disabled, isPublished, courseId, chapterId }: ChapterActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const onDelete = async () => {
    try {
      setIsLoading(true)

      await axios.delete(`/api/courses/${courseId}/chapters/${chapterId}`)
      toast.success('Chapter deleted')
      router.refresh()
      router.push(`/teacher/courses/${courseId}`)
    } catch {
      toast.error('Something went wrong!')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-x-2">
      <Button disabled={disabled || isLoading} variant="outline" size="sm" onClick={() => {}}>
        {isPublished ? 'Unpublish' : 'Publish'}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button variant="destructive" size="sm" disabled={isLoading}>
          <TrashIcon className="h-4 w-4" />
        </Button>
      </ConfirmModal>
    </div>
  )
}
