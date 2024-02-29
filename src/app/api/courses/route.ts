import { auth } from '@clerk/nextjs'
import { NextRequest, NextResponse } from 'next/server'
import Mux from '@mux/mux-node'
import { db } from '@/lib/db'

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
})

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    const { title } = await request.json()

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.create({
      data: {
        title,
        createdById: userId,
      },
    })

    return NextResponse.json(course)
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { courseId: string } }) {
  try {
    const { userId } = auth()
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const course = await db.course.findUnique({
      where: { id: params.courseId, createdById: userId },
      include: {
        chapters: { include: { muxData: true } },
      },
    })

    if (!course) {
      return new NextResponse('Not found', { status: 404 })
    }

    /** Removing mux data for all chapters */
    for (const chapter of course.chapters) {
      if (chapter.muxData) {
        await video.assets.delete(chapter.muxData.assetId)
      }
    }

    const deletedCourse = await db.course.delete({ where: { id: params.courseId } })

    return NextResponse.json(deletedCourse)
  } catch {
    return new NextResponse('Internal server exception', { status: 500 })
  }
}
