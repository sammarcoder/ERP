// Define your ERP permissions
export type Permission = 
  | 'currency:read'
  | 'currency:write' 
  | 'currency:delete'
  | 'coa:read'
  | 'coa:write'
  | 'coa:delete'
  | 'users:read'
  | 'users:write'
  | 'reports:read'
  | 'admin:full'

// Role to permission mapping
const rolePermissions: Record<string, Permission[]> = {
  // Currency permissions
  'currency-viewer': ['currency:read'],
  'currency-editor': ['currency:read', 'currency:write'],
  'currency-manager': ['currency:read', 'currency:write', 'currency:delete'],
  
  // COA permissions  
  'coa-viewer': ['coa:read'],
  'coa-editor': ['coa:read', 'coa:write'],
  'coa-manager': ['coa:read', 'coa:write', 'coa:delete'],
  
  // Admin permissions
  'admin': ['currency:read', 'currency:write', 'currency:delete', 'coa:read', 'coa:write', 'coa:delete', 'users:read', 'users:write', 'reports:read', 'admin:full'],
  
  // Default user
  'User': ['currency:read', 'coa:read'] // Basic read access
}

export function hasPermission(userRoles: string[], permission: Permission): boolean {
  if (!userRoles || userRoles.length === 0) return false
  
  // Check if any of the user's roles grant this permission
  return userRoles.some(role => 
    rolePermissions[role]?.includes(permission)
  )
}

export function hasAnyPermission(userRoles: string[], permissions: Permission[]): boolean {
  return permissions.some(permission => hasPermission(userRoles, permission))
}

export function hasAllPermissions(userRoles: string[], permissions: Permission[]): boolean {
  return permissions.every(permission => hasPermission(userRoles, permission))
}

// Get all permissions for user roles
export function getUserPermissions(userRoles: string[]): Permission[] {
  const permissions = new Set<Permission>()
  
  userRoles.forEach(role => {
    const rolePerms = rolePermissions[role] || []
    rolePerms.forEach(perm => permissions.add(perm))
  })
  
  return Array.from(permissions)
}
