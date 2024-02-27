'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Prisma } from '@prisma/client'
import { Loader2Icon, PlusCircleIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import ChaptersList from './chapters-list'

type ChaptersFormProps = {
  initialData: Prisma.CourseGetPayload<{ include: { chapters: true } }>
  courseId: string
}

const formSchema = z.object({
  title: z.string().min(1, 'Chapter title is required!'),
})

type FormSchema = z.infer<typeof formSchema>

export default function ChaptersForm({ initialData, courseId }: ChaptersFormProps) {
  const [isCreating, setIsCreating] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  const router = useRouter()

  const toggleCreating = () => {
    setIsCreating((current) => !current)
  }

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: '' },
  })

  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: FormSchema) => {
    try {
      await axios.post(`/api/courses/${courseId}/chapters`, values)
      toast.success('Chapter created!')
      toggleCreating()
      router.refresh()
    } catch {
      toast.error('Something went wrong!')
    }
  }

  const onReorder = async (data: Array<{ id: string; position: number }>) => {
    try {
      setIsUpdating(true)

      await axios.put(`/api/courses/${courseId}/chapters/reorder`, { list: data })
      toast.success('Chapters reordered!')
      router.refresh()
    } catch {
      toast.error('Something went wrong!')
    } finally {
      setIsUpdating(false)
    }
  }

  const onEdit = (id: string) => {
    router.push(`/teacher/courses/${courseId}/chapters/${id}`)
  }

  return (
    <div className="relative mt-6 rounded-md border bg-slate-100 p-4 md:mt-0">
      {isUpdating ? (
        <div className="absolute right-0 top-0 flex h-full w-full items-center justify-center rounded-md bg-slate-500/20">
          <Loader2Icon className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : null}

      <div className="flex items-center justify-between font-medium">
        Course chapters
        <Button variant="ghost" onClick={toggleCreating}>
          {isCreating ? (
            'Cancel'
          ) : (
            <>
              <PlusCircleIcon className="mr-2 h-4 w-4" />
              Add a chapter
            </>
          )}
        </Button>
      </div>

      {isCreating ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="e.g.Introduction to the course" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Create
              </Button>
            </div>
          </form>
        </Form>
      ) : null}

      {!isCreating ? (
        <div className="mt-4 space-y-2 text-center">
          <p className={cn('text-sm', { 'italic text-slate-500': !initialData?.chapters.length })}>
            {!initialData?.chapters.length ? 'No Chapters' : null}
            <ChaptersList onEdit={onEdit} onReorder={onReorder} items={initialData.chapters ?? []} />
          </p>
          <p className="text-xs text-muted-foreground">Drag and drop to reorder the chapters</p>
        </div>
      ) : null}
    </div>
  )
}
