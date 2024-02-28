'use client'

import { Prisma } from '@prisma/client'
import { PencilIcon, PlusCircleIcon, VideoIcon } from 'lucide-react'
import { z } from 'zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import MuxPlayer from '@mux/mux-player-react'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/file-upload'

type ChapterVideoFormProps = {
  initialData: Prisma.ChapterGetPayload<{ include: { muxData: true } }>
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  videoUrl: z.string({ required_error: 'Video is required!' }),
})

type FormSchema = z.infer<typeof formSchema>

export default function ChapterVideoForm({ initialData, courseId, chapterId }: ChapterVideoFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const toggleEdit = () => setIsEditing((current) => !current)

  const onSubmit = async (values: FormSchema) => {
    try {
      await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values)
      toast.success('Chapter updated!')
      toggleEdit()
      router.refresh()
    } catch {
      toast.error('Something went wrong!')
    }
  }

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4 md:mt-0">
      <div className="flex items-center justify-between font-medium">
        Chapter Video
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? 'Cancel' : null}

          {!isEditing && !initialData?.videoUrl ? (
            <>
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add a video
            </>
          ) : null}

          {!isEditing && initialData?.videoUrl ? (
            <>
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit Video
            </>
          ) : null}
        </Button>
      </div>

      {!isEditing &&
        (!initialData?.videoUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <VideoIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <MuxPlayer playbackId={initialData?.muxData?.playbackId ?? ''} />
          </div>
        ))}

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="chapterVideo"
            onChange={(url) => {
              if (url) {
                onSubmit({ videoUrl: url })
              }
            }}
          />

          <div className="mt-4 text-xs text-muted-foreground">Upload this chapter&apos;s video</div>
        </div>
      ) : null}

      {initialData?.videoUrl && !isEditing ? (
        <div className="mt-2 text-xs text-muted-foreground">
          Videos can take a few minutes to process. Refresh the page of video does not appear.
        </div>
      ) : null}
    </div>
  )
}
