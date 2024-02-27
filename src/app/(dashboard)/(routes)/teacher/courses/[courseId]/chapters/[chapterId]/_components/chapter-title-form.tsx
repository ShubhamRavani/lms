'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Chapter } from '@prisma/client'
import { PencilIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

type ChapterTitleFormProps = {
  initialData: Chapter
  courseId: string
  chapterId: string
}

const formSchema = z.object({
  title: z.string().min(1, 'Title is required!'),
})

type FormSchema = z.infer<typeof formSchema>

export default function ChapterTitleForm({ initialData, courseId, chapterId }: ChapterTitleFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  const toggleEdit = () => setIsEditing((current) => !current)

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  })

  const { isSubmitting, isValid } = form.formState

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
        Chapter Title
        <Button variant="ghost" onClick={toggleEdit}>
          {isEditing ? (
            'Cancel'
          ) : (
            <>
              <PencilIcon className="mr-2 h-4 w-4" />
              Edit Title
            </>
          )}
        </Button>
      </div>

      {!isEditing ? (
        <p className="mt-2 text-sm">{initialData.title}</p>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="e.g. Introduction to NextJS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  )
}
