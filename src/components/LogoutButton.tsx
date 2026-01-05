// "use client";

// export default function LogoutButton() {
//   return (
//     <a
//       href="/auth/logout"
//       className="button logout"
//     >
//       Log Out
//     </a>
//   );
// }




















// "use client";

// import { Button } from "@/components/ui/Button";

// export default function LogoutButton() {
//   return (
//     <Button
//       variant="secondary"
//       size="md"
//       onClick={() => window.location.href = '/auth/logout'}
//     >
//       Log Out
//     </Button>
//   );
// }
































"use client"

import { signOut, useSession } from "next-auth/react"

export default function LogoutButton() {
  const { data: session } = useSession()

  const handleSignOut = async () => {
    try {
      // Get Keycloak logout URL to also logout from Keycloak server
      const keycloakLogoutUrl = `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER || 'http://localhost:8080/realms/ERP'}/protocol/openid-connect/logout`
      
      // Step 1: Sign out from Next.js (clears local session)
      await signOut({ 
        redirect: false // Don't redirect yet
      })
      
      // Step 2: Also logout from Keycloak server to clear SSO session
      const logoutParams = new URLSearchParams({
        post_logout_redirect_uri: `${window.location.origin}/login`,
        client_id: 'ERP-integerate'
      })
      
      // Redirect to Keycloak logout which will clear Keycloak session
      // and then redirect back to our login page
      window.location.href = `${keycloakLogoutUrl}?${logoutParams.toString()}`
      
    } catch (error) {
      console.error('Logout error:', error)
      // Fallback: force redirect to login
      window.location.href = '/login'
    }
  }

  if (!session) return null

  return (
    <button
      onClick={handleSignOut}
      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md"
    >
      Sign Out
    </button>
  )
}
