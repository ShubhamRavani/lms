'use client'

import { UserButton } from '@clerk/nextjs'

export default function NavbarRoutes() {
  return (
    <>
      <div className="flex flex-1 justify-center">
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  )
}
