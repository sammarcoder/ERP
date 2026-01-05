"use client"

import { useSession } from "next-auth/react"
import { hasPermission, hasAnyPermission, hasAllPermissions, getUserPermissions, type Permission } from "@/lib/keycloack/permissions"

export function usePermissions() {
  const { data: session } = useSession()
  
  // Get all user roles (both realm and client roles)
  const userRoles = [
    ...(session?.user?.roles || []), // Realm roles
    ...(session?.user?.resourceAccess?.['ERP-integerate']?.roles || []) // Client roles
  ]
  
  return {
    userRoles,
    hasPermission: (permission: Permission) => hasPermission(userRoles, permission),
    hasAnyPermission: (permissions: Permission[]) => hasAnyPermission(userRoles, permissions),
    hasAllPermissions: (permissions: Permission[]) => hasAllPermissions(userRoles, permissions),
    getUserPermissions: () => getUserPermissions(userRoles),
    isAuthenticated: !!session
  }
}
