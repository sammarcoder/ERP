import { auth, signIn } from "../../../auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  const session = await auth()
  
  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            ERP System Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            sign in 
          </p>
        </div>
        
        <div className="mt-8 space-y-6">
          <form
            action={async () => {
              "use server"
              await signIn("keycloak", { redirectTo: "/dashboard" })
            }}
          >
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in 
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
