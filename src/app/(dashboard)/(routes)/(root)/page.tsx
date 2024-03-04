import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { CheckCircleIcon, ClockIcon } from 'lucide-react'
import { getDashboardCourses } from '@/actions/get-dashboard-courses'
import CoursesList from '@/components/courses-list'
import InfoCard from './_components/info-card'

export default async function Dashboard() {
  const { userId } = auth()
  if (!userId) {
    return redirect('/')
  }

  const { completedCourses, coursesInProgress } = await getDashboardCourses(userId)

  return (
    <div className="space-y-4 p-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <InfoCard icon={ClockIcon} label="In Progress" numberOfItems={coursesInProgress.length} />
        <InfoCard icon={CheckCircleIcon} label="Completed" numberOfItems={completedCourses.length} variant="success" />
      </div>

      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  )
}
