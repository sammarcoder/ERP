// import { auth0 } from "../../../lib/auth0";

// export default async function Debug() {
//   try {
//     const session = await auth0.getSession();
//     const accessToken = await auth0.getAccessToken();
    
//     return (
//       <div className="p-6">
//         <h1 className="text-2xl mb-4">Debug Information</h1>
        
//         <div className="mb-6">
//           <h2 className="font-bold mb-2">Session User:</h2>
//           <pre className="bg-gray-100 p-4 overflow-auto text-sm">
//             {JSON.stringify(session?.user, null, 2)}
//           </pre>
//         </div>
        
//         <div className="mb-6">
//           <h2 className="font-bold mb-2">Access Token Info:</h2>
//           <p className="mb-2">
//             <strong>Has Token:</strong> {accessToken ? "YES" : "NO"}
//             {/* {accessToken} */}
//           </p>
//           {accessToken && typeof accessToken === 'string' && (
//             <p className="break-all bg-gray-100 p-4 text-xs">
//               <strong>First 200 chars:</strong><br/>
//               {accessToken.substring(0, 200)}...
//             </p>
//           )}
//         </div>

//         <div className="mb-6">
//           <h2 className="font-bold mb-2">Environment Check:</h2>
//           <p><strong>AUTH0_AUDIENCE configured:</strong> {process.env.AUTH0_AUDIENCE ? 'YES' : 'NO'}</p>
//         </div>
//       </div>
//     );
//   } catch (error) {
//     return (
//       <div className="p-6">
//         <h1 className="text-red-600">Error</h1>
//         <p>{error.message}</p>
//       </div>
//     );
//   }
// }




























// import { auth0 } from "../../../lib/auth0";

// export default async function Debug() {
//   try {
//     const session = await auth0.getSession();
//     const accessToken = await auth0.getAccessToken();
    
//     // Try to decode token manually (for debugging only)
//     let tokenPayload = null;
//     if (accessToken && typeof accessToken === 'string') {
//       try {
//         // Split JWT and decode payload (unsafe - for debugging only)
//         const parts = accessToken.split('.');
//         if (parts.length === 3) {
//           const payload = Buffer.from(parts[1], 'base64').toString();
//           tokenPayload = JSON.parse(payload);
//         }
//       } catch (e) {
//         tokenPayload = "Token is encrypted (JWE) - cannot decode client-side";
//       }
//     }
    
//     return (
//       <div className="p-6">
//         <h1 className="text-2xl mb-4">Debug Information</h1>
        
//         <div className="mb-6">
//           <h2 className="font-bold mb-2">Session User (ID Token):</h2>
//           <pre className="bg-gray-100 p-4 overflow-auto text-sm">
//             {JSON.stringify(session?.user, null, 2)}
//           </pre>
//         </div>
        
//         <div className="mb-6">
//           <h2 className="font-bold mb-2">Access Token Payload:</h2>
//           <pre className="bg-gray-100 p-4 overflow-auto text-sm">
//             {typeof tokenPayload === 'string' 
//               ? tokenPayload 
//               : JSON.stringify(tokenPayload, null, 2)
//             }
//           </pre>
//         </div>
//       </div>
//     );
//   } catch (error) {
//     return (
//       <div className="p-6">
//         <h1 className="text-red-600">Error</h1>
//         <p>{error.message}</p>
//       </div>
//     );
//   }
// }






















import { auth0 } from "../../../lib/auth0";

export default async function Debug() {
  try {
    const session = await auth0.getSession();
    const accessToken = await auth0.getAccessToken();
    
    return (
      <div className="p-6">
        <h1 className="text-2xl mb-4">Complete Debug</h1>
        
        <div className="mb-6">
          <h2 className="font-bold mb-2">ID Token (from session.user):</h2>
          <pre className="bg-gray-100 p-4 overflow-auto text-sm">
            {JSON.stringify(session?.user, null, 2)}
          </pre>
        </div>
        
        <div className="mb-6">
          <h2 className="font-bold mb-2">Access Token Info:</h2>
          <p><strong>Token exists:</strong> {accessToken ? 'YES' : 'NO'}</p>
          <p><strong>Token type:</strong> {typeof accessToken}</p>
          <p><strong>Token value type:</strong> {accessToken === null ? 'null' : Array.isArray(accessToken) ? 'array' : typeof accessToken}</p>
          
          {accessToken && typeof accessToken === 'string' && (
            <div className="mt-2">
              <p><strong>Token preview:</strong></p>
              <p className="text-xs break-all bg-gray-100 p-2">
                {accessToken.substring(0, 200)}...
              </p>
            </div>
          )}
          
          {accessToken && typeof accessToken !== 'string' && (
            <div className="mt-2">
              <p><strong>Token content:</strong></p>
              <pre className="text-xs bg-gray-100 p-2 overflow-auto">
                {JSON.stringify(accessToken, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="mb-6">
          <h2 className="font-bold mb-2">Raw Session Object:</h2>
          <pre className="bg-gray-100 p-4 overflow-auto text-xs">
            {JSON.stringify(session, null, 2)}
          </pre>
        </div>
      </div>
    );
  } catch (error) {
    return <div className="p-6 text-red-600">Error: {error.message}</div>;
  }
}
