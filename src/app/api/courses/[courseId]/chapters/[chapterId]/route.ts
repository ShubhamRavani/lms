import { auth } from '@clerk/nextjs'
import { NextResponse } from 'next/server'
import Mux from '@mux/mux-node'
import { db } from '@/lib/db'

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
})

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

    if (values.videoUrl) {
      /** Cleaning up existing data */
      const existingMuxData = await db.muxData.findFirst({ where: { chapterId: params.chapterId } })
      if (existingMuxData) {
        await video.assets.delete(existingMuxData.assetId)
        await db.muxData.delete({ where: { id: existingMuxData.id } })
      }

      const asset = await video.assets.create({
        input: values.videoUrl,
        playback_policy: ['public'],
        test: false,
      })

      await db.muxData.create({
        data: {
          chapterId: params.chapterId,
          assetId: asset.id,
          playbackId: asset.playback_ids?.[0]?.id,
        },
      })
    }

    return NextResponse.json(chapter)
  } catch {
    return new NextResponse('Internal server error', { status: 500 })
  }
}
