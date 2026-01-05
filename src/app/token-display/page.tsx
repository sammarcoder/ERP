"use client"

import { useState } from "react"
import { Session } from "next-auth"

interface TokenDisplayProps {
  session: Session
}

export default function TokenDisplay({ session }: TokenDisplayProps) {
  const [showTokens, setShowTokens] = useState<boolean>(false)

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Authentication Tokens
        </h3>
        <button
          onClick={() => setShowTokens(!showTokens)}
          className="px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded-md"
        >
          {showTokens ? 'Hide Tokens' : 'Show Tokens'}
        </button>
      </div>

      {showTokens && (
        <div className="space-y-4">
          {/* Access Token */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Access Token:
            </label>
            <textarea
              readOnly
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md text-xs font-mono bg-gray-50"
              value={session.accessToken || 'Not available'}
            />
          </div>

          {/* ID Token */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Token:
            </label>
            <textarea
              readOnly
              rows={4}
              className="w-full p-2 border border-gray-300 rounded-md text-xs font-mono bg-gray-50"
              value={session.idToken || 'Not available'}
            />
          </div>

          {/* Decoded Token Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Data:
            </label>
            <pre className="w-full p-2 border border-gray-300 rounded-md text-xs bg-gray-50 overflow-auto">
              {JSON.stringify({
                user: session.user,
                expires: session.expires,
                roles: session.user.roles,
                resourceAccess: session.user.resourceAccess
              }, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  )
}
