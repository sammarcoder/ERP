// components/TokenDebug.tsx
'use client';

import { useEffect, useState } from 'react';

export default function TokenDebug() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await fetch('/auth/access-token');
        const data = await response.json();
        
        if (data.token) {
          const payload = JSON.parse(Buffer.from(data.token.split('.')[1], 'base64').toString());
          setTokenInfo(payload);
        }
      } catch (error) {
        console.error('Token debug error:', error);
      }
    };

    fetchToken();
  }, []);

  if (!tokenInfo) return <div>Loading token info...</div>;

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h3 className="font-bold mb-2">Raw Token Contents:</h3>
      <div className="text-sm">
        <p><strong>Permissions (direct):</strong> {JSON.stringify(tokenInfo.permissions)}</p>
        <p><strong>Permissions (namespaced):</strong> {JSON.stringify(tokenInfo['https://erp-system-api.com/permissions'])}</p>
        <p><strong>Roles:</strong> {JSON.stringify(tokenInfo['https://erp-system-api.com/roles'])}</p>
        <p><strong>Scope:</strong> {tokenInfo.scope}</p>
        <p><strong>All Keys:</strong> {Object.keys(tokenInfo).join(', ')}</p>
      </div>
    </div>
  );
}
