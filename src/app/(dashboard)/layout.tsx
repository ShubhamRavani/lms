import Navbar from './_components/navbar'
import Sidebar from './_components/sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-50 h-16 w-full md:pl-56">
        <Navbar />
      </div>

      <div className="fixed inset-y-0 z-50 hidden h-full w-56 flex-col md:flex">
        <Sidebar />
      </div>

      <main className="pt-16 md:pl-56">{children}</main>
    </div>
  )
}
