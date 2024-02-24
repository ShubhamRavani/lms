'use client'

import { Attachement, Course } from '@prisma/client'
import { FileIcon, Loader2Icon, PlusCircleIcon, XIcon } from 'lucide-react'
import { z } from 'zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import FileUpload from '@/components/file-upload'

type AttachmentFormProps = {
  initialData: Course & { attachements: Attachement[] }
  courseId: string
}

const formSchema = z.object({
  url: z.string({ required_error: 'File is required!' }),
})

type FormSchema = z.infer<typeof formSchema>

export default function AttachmentForm({ initialData, courseId }: AttachmentFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const router = useRouter()

  const toggleEdit = () => setIsEditing((current) => !current)

  const onSubmit = async (values: FormSchema) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values)
      toast.success('Course updated!')
      toggleEdit()
      router.refresh()
    } catch {
      toast.error('Something went wrong!')
    }
  }

  const onDelete = (id: string) => async () => {
    try {
      setDeletingId(id)
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`)
      toast.success('Attachment deleted')
      router.refresh()
    } catch {
      toast.error('Something went wrong')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="mt-6 rounded-md border bg-slate-100 p-4 md:mt-0">
      <div className="flex items-center justify-between font-medium">
        Course attachments
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? 'Cancel' : null}

          {!isEditing ? (
            <>
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add a file
            </>
          ) : null}
        </Button>
      </div>

      {!isEditing && (
        <>
          {initialData.attachements?.length === 0 && (
            <p className="mt-2 text-sm italic text-slate-500">No attachments yet</p>
          )}
          {initialData.attachements.length > 0 ? (
            <div>
              {initialData.attachements.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex w-full items-center rounded-md border border-sky-200 bg-sky-100 p-3 text-sky-700"
                >
                  <FileIcon className="mr-2 h-4 w-4 flex-shrink-0" />
                  <p className="truncate text-sm">{attachment.name}</p>
                  {deletingId === attachment.id ? (
                    <Loader2Icon className="h-4 w-4 animate-spin" />
                  ) : (
                    <button className="ml-auto transition hover:opacity-75" onClick={onDelete(attachment.id)}>
                      <XIcon className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}

      {isEditing ? (
        <div>
          <FileUpload
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url })
              }
            }}
          />

          <div className="mt-4 text-xs text-muted-foreground">
            Add anything your students might need to complete the course
          </div>
        </div>
      ) : null}
    </div>
  )
}
