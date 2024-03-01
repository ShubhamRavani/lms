import { Prisma } from '@prisma/client'
import NavbarRoutes from '@/components/navbar-routes'
import CourseMobileSidebar from './course-mobile-sidebar'

type CourseNavbarProps = {
  course: Prisma.CourseGetPayload<{ include: { chapters: { include: { userProgress: true } } } }>
  progressCount: number
}

export default function CourseNavbar({ course, progressCount }: CourseNavbarProps) {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  )
}
