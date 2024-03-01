'use client'

import MuxPlayer from '@mux/mux-player-react'
import { Loader2Icon, LockIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

type VideoPlayerProps = {
  playbackId: string
  courseId: string
  chapterId: string
  nextChapterId?: string
  isLocked: boolean
  completeOnEnd: boolean
  title: string
}

export default function VideoPlayer({ playbackId, isLocked, title }: VideoPlayerProps) {
  const [isReady, setIsReady] = useState(false)

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
          onEnded={() => {}}
          autoPlay
          playbackId={playbackId}
        />
      ) : null}
    </div>
  )
}
