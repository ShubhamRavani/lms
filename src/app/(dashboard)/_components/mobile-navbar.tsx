import { MenuIcon } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import Sidebar from './sidebar'

export default function MobileNavbar() {
  return (
    <div>
      <Sheet>
        <SheetTrigger className="transition hover:opacity-75 md:hidden" asChild>
          <div>
            <MenuIcon />
          </div>
        </SheetTrigger>
        <SheetContent side="left" className="bg-white p-0">
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  )
}
