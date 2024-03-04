'use client'

import MuxPlayer from '@mux/mux-player-react'
import { Loader2Icon, LockIcon } from 'lucide-react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import axios from 'axios'
import { cn } from '@/lib/utils'
import { useConfettiStore } from '@/hooks/use-confetti'

type VideoPlayerProps = {
  playbackId: string
  courseId: string
  chapterId: string
  nextChapterId?: string
  isLocked: boolean
  completeOnEnd: boolean
  title: string
}

export default function VideoPlayer({
  playbackId,
  isLocked,
  title,
  completeOnEnd,
  courseId,
  chapterId,
  nextChapterId,
}: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()
  const confetti = useConfettiStore()

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        await axios.put(`/api/courses/${courseId}/chapters/${chapterId}/progress`, { isCompleted: true })
      }

      if (!nextChapterId) {
        confetti.onOpen()
      }

      toast.success('Progress updated!')
      router.refresh()

      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}`)
      }
    } catch {
      toast.error('Something went wrong')
    }
  }

  return (
    <div className="relative aspect-video">
      {!isReady && !isLocked ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <Loader2Icon className="h-8 w-8 animate-spin text-secondary" />
        </div>
      ) : null}

      {isLocked ? (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
          <LockIcon className="mr-2 h-4 w-4 text-secondary" />
          <p className="text-sm text-secondary">This chapter is locked!</p>
        </div>
      ) : null}

      {!isLocked ? (
        <MuxPlayer
          title={title}
          className={cn({ hidden: !isReady })}
          onCanPlay={() => {
            setIsReady(true)
          }}
          autoPlay
          onEnded={onEnd}
          playbackId={playbackId}
        />
      ) : null}
    </div>
  )
}
