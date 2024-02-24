'use client'

import z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required!'),
})

export default function Create() {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })
  const { isSubmitting, isValid } = form.formState

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post('/api/courses', values)
      router.push(`/teacher/courses/${response.data.id}`)
      toast.success('Course created successfully!')
    } catch {
      toast.error('Something went wrong!')
    }
  }

  return (
    <div className="flex h-full w-full max-w-5xl p-6 md:items-center md:justify-center">
      <div>
        <h1 className="text-2xl">Name your course</h1>
        <p className="text-sm text-muted-foreground">
          What would you like to name your course? Don&apos;t worry, you can change this later.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input disabled={isSubmitting} placeholder="e.g 'Advanced NextJS" {...field} />
                  </FormControl>
                  <FormDescription>What will you teach in this course?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link href="/">
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                Continue
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
