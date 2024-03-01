import { auth } from '@clerk/nextjs'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import Categories from './_components/categories'
import SearchInput from '@/components/search-input'
import { getCourses } from '@/actions/get-courses'
import CoursesList from '@/components/courses-list'

type SearchProps = {
  searchParams: {
    title: string
    categoryId: string
  }
}

export default async function Search({ searchParams }: SearchProps) {
  const categories = await db.category.findMany({ orderBy: { name: 'asc' } })
  const { userId } = auth()

  if (!userId) {
    return redirect('/')
  }

  const courses = await getCourses({ userId, ...searchParams })

  return (
    <>
      <div className="block px-6 pt-6 md:mb-0 md:hidden">
        <SearchInput />
      </div>

      <div className="space-y-4 p-6">
        <Categories items={categories} />

        <CoursesList items={courses} />
      </div>
    </>
  )
}
