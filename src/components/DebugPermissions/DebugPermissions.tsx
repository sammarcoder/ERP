'use client';

import { useEffect, useState } from 'react';

export default function TokenDebug() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        console.log('🔄 Fetching access token for debug...');
        const response = await fetch('/auth/access-token');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Raw token response:', data);
        
        if (data.token && typeof data.token === 'string') {
          const parts = data.token.split('.');
          if (parts.length === 3) {
            const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
            console.log('Decoded token payload:', payload);
            setTokenInfo(payload);
          } else {
            throw new Error('Invalid JWT format');
          }
        } else {
          throw new Error('No token found in response');
        }
      } catch (error) {
        console.error('Token debug error:', error);
        setError(error instanceof Error ? error.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  if (loading) {
    return <div className="p-4 bg-gray-100 rounded">Loading token info...</div>;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-300 rounded">
        <h3 className="font-bold text-red-800 mb-2">Token Debug Error:</h3>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!tokenInfo) {
    return (
      <div className="p-4 bg-yellow-100 border border-yellow-300 rounded">
        <p className="text-yellow-800">No token information available</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">🔍 Raw Access Token Contents:</h3>
      <div className="text-sm space-y-1">
        <p><strong>User:</strong> {tokenInfo.sub}</p>
        <p><strong>Audience:</strong> {JSON.stringify(tokenInfo.aud)}</p>
        <p><strong>Permissions (direct):</strong> <code>{JSON.stringify(tokenInfo.permissions || 'NOT FOUND')}</code></p>
        <p><strong>Permissions (namespaced):</strong> <code>{JSON.stringify(tokenInfo['https://erp-system-api.com/permissions'] || 'NOT FOUND')}</code></p>
        <p><strong>Roles:</strong> <code>{JSON.stringify(tokenInfo['https://erp-system-api.com/roles'] || 'NOT FOUND')}</code></p>
        <p><strong>Scope:</strong> <code>{tokenInfo.scope || 'NOT FOUND'}</code></p>
        <p><strong>All Token Keys:</strong> <code>{Object.keys(tokenInfo).join(', ')}</code></p>
      </div>
      
      <details className="mt-4">
        <summary className="cursor-pointer font-semibold">🔍 Full Token Payload</summary>
        <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto max-h-60">
          {JSON.stringify(tokenInfo, null, 2)}
        </pre>
      </details>
    </div>
  );
}
