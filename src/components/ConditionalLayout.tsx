"use client"

import { usePathname } from "next/navigation"
import Sidebar from "./Sidebar"
import Header from "./Header"

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Routes that should not show sidebar/header (login page)
  const authRoutes = ['/login']
  const isAuthRoute = authRoutes.includes(pathname)
  
  if (isAuthRoute) {
    // Login page - no sidebar, just content
    return <div className="min-h-screen">{children}</div>
  }
  
  // Regular pages - show sidebar and main layout
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 lg:ml-14 p-6 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
