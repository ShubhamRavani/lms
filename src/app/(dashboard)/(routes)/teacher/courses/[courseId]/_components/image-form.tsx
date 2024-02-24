'use client'

import { Course } from '@prisma/client'
import { ImageIcon, PencilIcon, PlusCircleIcon } from 'lucide-react'
import { z } from 'zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/file-upload'

type ImageFormProps = {
  initialData: Course
  courseId: string
}

const formSchema = z.object({
  imageUrl: z.string({ required_error: 'Image is required!' }),
})

type FormSchema = z.infer<typeof formSchema>

export default function ImageForm({ initialData, courseId }: ImageFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const toggleEdit = () => setIsEditing((current) => !current)

  const onSubmit = async (values: FormSchema) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values)
      toast.success('Course updated!')
      toggleEdit()
      router.refresh()
    } catch {
      toast.error('Something went wrong!')
    }
  }

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4 md:mt-0">
      <div className="flex items-center justify-between font-medium">
        Course Image
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? 'Cancel' : null}

          {!isEditing && !initialData?.imageUrl ? (
            <>
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add an image
            </>
          ) : null}

          {!isEditing && initialData?.imageUrl ? (
            <>
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit image
            </>
          ) : null}
        </Button>
      </div>

      {!isEditing &&
        (!initialData?.imageUrl ? (
          <div className="flex h-60 items-center justify-center rounded-md bg-slate-200">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative mt-2 aspect-video">
            <Image alt="upload" fill className="rounded-md object-cover" src={initialData.imageUrl ?? ''} />
          </div>
        ))}

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url })
              }
            }}
          />

          <div className="mt-4 text-xs text-muted-foreground">16:9 aspect ratio recommended</div>
        </div>
      ) : null}
    </div>
  )
}
