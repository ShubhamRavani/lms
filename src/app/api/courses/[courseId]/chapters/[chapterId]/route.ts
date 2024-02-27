import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(req: Request, { params }: { params: { chapterId: string; courseId: string } }) {
  try {
    const { userId } = await auth()
    // eslint-disable-next-line
    const { isPublished, ...values } = await req.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const ownCourse = await db.course.findUnique({ where: { id: params.courseId, createdById: userId } })
    if (!ownCourse) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const chapter = await db.chapter.update({ where: { id: params.chapterId }, data: { ...values } })

    return NextResponse.json(chapter)
  } catch {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
