import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeftIcon, EyeIcon, LayoutDashboardIcon, VideoIcon } from 'lucide-react'
import { db } from '@/lib/db'
import IconBadge from '@/components/icon-badge'
import ChapterTitleForm from './_components/chapter-title-form'
import ChapterDescriptionForm from './_components/chapter-description-form'
import ChapterAccessForm from './_components/chapter-access-form'
import ChapterVideoForm from './_components/chapter-video-form'
import Banner from '@/components/banner'
import ChapterActions from './_components/chapter-actions'

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

  const isComplete = requiredFields.every(Boolean)

  return (
    <>
      {!chapter.isPublished ? (
        <Banner label="Chapter is not published yet" />
      ) : (
        <Banner variant="success" label="Chapter is published" />
      )}
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
              <ChapterActions disabled={!isComplete} {...params} isPublished={chapter.isPublished} />
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="space-y-4">
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboardIcon} />
              <h2 className="text-xl">Customize your chapter</h2>
            </div>

            <ChapterTitleForm initialData={chapter} {...params} />
            <ChapterDescriptionForm initialData={chapter} {...params} />

            <div className="flex items-center gap-x-2">
              <IconBadge icon={EyeIcon} />
              <h2 className="text-xl">Access Settings</h2>
            </div>
            <ChapterAccessForm initialData={chapter} {...params} />
          </div>
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={VideoIcon} />
                <h2 className="text-xl">Add a video</h2>
              </div>
            </div>

            <ChapterVideoForm initialData={chapter} {...params} />
          </div>
        </div>
      </div>
    </>
  )
}
