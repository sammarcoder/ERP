import { useState, useEffect } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

export const usePermissions = () => {
  const { user, isLoading: userLoading } = useUser();
  const [permissions, setPermissions] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPermissions = async () => {
      if (!user) {
        setPermissions([]);
        setRoles([]);
        setIsLoading(false);
        return;
      }

      try {
        // Method 1: Try to get from user object (ID token)
        const userPermissions = user?.['https://erp-system-api.com/permissions'] || [];
        const userRoles = user?.['https://erp-system-api.com/roles'] || [];
        
        console.log('User Permissions from ID token:', userPermissions);
        console.log('User Roles from ID token:', userRoles);

        if (userPermissions.length > 0) {
          setPermissions(userPermissions);
          setRoles(userRoles);
          setIsLoading(false);
          return;
        }

        // Method 2: Get from access token
        console.log('ID token has no permissions, trying access token...');
        
        const response = await fetch('/auth/access-token');
        if (response.ok) {
          const tokenData = await response.json();
          console.log('Raw token response:', tokenData);
          
          if (tokenData.token && typeof tokenData.token === 'string') {
            try {
              const parts = tokenData.token.split('.');
              if (parts.length === 3) {
                // ✅ Fixed: Use atob instead of Buffer (browser compatibility)
                const payload = JSON.parse(atob(parts[1]));
                console.log('Decoded token payload:', payload);
                
                // ✅ Fixed: Direct extraction without fallback chain that might fail
                let extractedPermissions = [];
                let extractedRoles = [];
                
                // Extract permissions - check exact keys
                if (payload.permissions && Array.isArray(payload.permissions)) {
                  extractedPermissions = payload.permissions;
                  console.log('✅ Found permissions in direct key:', extractedPermissions);
                } else if (payload['https://erp-system-api.com/permissions'] && Array.isArray(payload['https://erp-system-api.com/permissions'])) {
                  extractedPermissions = payload['https://erp-system-api.com/permissions'];
                  console.log('✅ Found permissions in namespaced key:', extractedPermissions);
                } else {
                  console.log('❌ No permissions found in token');
                  console.log('Available keys:', Object.keys(payload));
                  console.log('permissions key value:', payload.permissions);
                  console.log('namespaced permissions key value:', payload['https://erp-system-api.com/permissions']);
                }
                
                // Extract roles
                if (payload['https://erp-system-api.com/roles'] && Array.isArray(payload['https://erp-system-api.com/roles'])) {
                  extractedRoles = payload['https://erp-system-api.com/roles'];
                  console.log('✅ Found roles:', extractedRoles);
                }
                
                console.log('Final extracted permissions:', extractedPermissions);
                console.log('Final extracted roles:', extractedRoles);
                
                setPermissions(extractedPermissions);
                setRoles(extractedRoles);
              }
            } catch (decodeError) {
              console.error('Failed to decode access token:', decodeError);
            }
          }
        }
      } catch (error) {
        console.error('Failed to fetch permissions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPermissions();
  }, [user]);

  const hasPermission = (permission: string): boolean => {
    const result = permissions.includes(permission);
    console.log(`🔍 Checking permission "${permission}":`, result);
    console.log(`Available permissions:`, permissions);
    return result;
  };

  const hasRole = (role: string): boolean => {
    return roles.includes(role);
  };

  return {
    isLoading: userLoading || isLoading,
    isAuthenticated: !!user,
    user,
    permissions,
    roles,
    hasPermission,
    hasRole,
    canReadCurrency: hasPermission('currency:read'),
    canWriteCurrency: hasPermission('currency:write'),
    canDeleteCurrency: hasPermission('currency:delete'),
  };
};
