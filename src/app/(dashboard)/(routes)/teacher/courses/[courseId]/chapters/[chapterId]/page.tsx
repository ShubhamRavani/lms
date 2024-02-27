import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, LayoutDashboardIcon } from 'lucide-react'
import { db } from '@/lib/db'
import IconBadge from '@/components/icon-badge'
import ChapterTitleForm from './_components/chapter-title-form'

export default async function ChapterDetails({ params }: { params: { courseId: string; chapterId: string } }) {
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const chapter = await db.chapter.findUnique({
    where: { id: params.chapterId, courseId: params.courseId },
    include: { muxData: true },
  })

  if (!chapter) {
    return redirect('/')
  }

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl]
  const totalFields = requiredFields.length
  const completedFields = requiredFields.filter(Boolean).length

  const completionText = `(${completedFields}/${totalFields})`

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="w-full">
          <Link
            href={`/teacher/courses/${params.courseId}`}
            className="mb-6 flex items-center text-sm transition hover:opacity-75"
          >
            <ArrowLeftIcon className="mr-2 h-4 w-4" />
            Back to course setup
          </Link>
          <div className="flex w-full items-center justify-between">
            <div className="flex flex-col gap-y-2">
              <h1 className="text-2xl font-medium">Chapter Creation</h1>
              <span className="text-sm text-muted-foreground">Complete all fields {completionText}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboardIcon} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>
          </div>

          <ChapterTitleForm initialData={chapter} courseId={params.courseId} chapterId={params.chapterId} />
        </div>
      </div>
    </div>
  )
}
