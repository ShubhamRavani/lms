import Link from 'next/link'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Courses() {
  return (
    <div>
      <Link href="/teacher/create">
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create New Course
        </Button>
      </Link>
    </div>
  )
}
