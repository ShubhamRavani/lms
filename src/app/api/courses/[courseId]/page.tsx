import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PATCH(request: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()
    const { courseId } = params
    const values = await request.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.update({
      where: { id: courseId, createdById: userId },
      data: { title: values?.title },
    })

    return NextResponse.json(course)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
