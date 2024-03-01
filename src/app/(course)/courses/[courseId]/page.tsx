import { redirect } from 'next/navigation'
import { db } from '@/lib/db'

export default async function CourseDetailsPage({ params }: { params: { courseId: string } }) {
  const course = await db.course.findUnique({
    where: { id: params.courseId },
    include: { chapters: { where: { isPublished: true }, orderBy: { positiuon: 'asc' } } },
  })

  if (!course) {
    return redirect('/')
  }

  return redirect(`/courses/${params.courseId}/chapters/${course.chapters[0].id}`)
}
