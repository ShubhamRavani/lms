'use client'

import { CheckCircleIcon, XCircleIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { useConfettiStore } from '@/hooks/use-confetti'

type CourseProgressButtonProps = {
  chapterId: string
  courseId: string
  nextChapterId?: string
  isComplete: boolean
}

export default function CourseProgressButton({
  chapterId,
  courseId,
  nextChapterId,
  isComplete,
}: CourseProgressButtonProps) {
  const router = useRouter()
  const confetti = useConfettiStore()
  const [isLoading, setIsLoading] = useState(false)

  const Icon = isComplete ? XCircleIcon : CheckCircleIcon

  const onClick = async () => {
    try {
      setIsLoading(true)
      await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, { isCompleted: !isComplete })

      /** Course is completed */
      if (isComplete && !nextChapterId) {
        confetti.onOpen()
      }

      if (!isComplete && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
      }

      toast.success('Progress updated')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant={isComplete ? 'outline' : 'success'}
      className="w-full md:w-auto"
      onClick={onClick}
      disabled={isLoading}
    >
      {isComplete ? 'Mark as not Completed' : 'Mark as Complete'}
      <Icon className="ml-2 h-4 w-4" />
    </Button>
  )
}
