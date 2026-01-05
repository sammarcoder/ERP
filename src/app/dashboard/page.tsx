// import React from 'react'
// import Form from './Form'

// function page() {
//   return (
//     <div>page1212
//         <Form/>
//     </div>
//   )
// }

// export default page





















import { auth } from "../../../auth"
import TokenDisplay from "../token-display/page"
import LogoutButton from "@/components/LogoutButton"

export default async function Dashboard() {
  const session = await auth() // This will always exist due to middleware

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              ERP Dashboard
            </h1>
            
            {/* User Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-6">
              <h2 className="text-lg font-semibold text-blue-900 mb-2">
                Welcome, {session?.user.name}!
              </h2>
              <p className="text-blue-700">Email: {session?.user.email}</p>
            </div>

            {/* User Roles */}
            <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
              <h3 className="text-lg font-semibold text-green-900 mb-3">
                Your Roles:
              </h3>
              <div className="flex flex-wrap gap-2">
                {session?.user.roles && session.user.roles.length > 0 ? (
                  session.user.roles.map((role: string) => (
                    <span
                      key={role}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                    >
                      {role}
                    </span>
                  ))
                ) : (
                  <p className="text-green-700">No roles assigned</p>
                )}
              </div>
            </div>

            {/* Token Display Component */}
            {session && <TokenDisplay session={session} />}

            {/* Logout Button */}
            <div className="mt-6">
              <LogoutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
