import NavbarRoutes from '@/components/navbar-routes'
import MobileNavbar from './mobile-navbar'

export default function Navbar() {
  return (
    <div className="flex h-full items-center border-b bg-white p-4 shadow-sm">
      <MobileNavbar />
      <NavbarRoutes />
    </div>
  )
}
