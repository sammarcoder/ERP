// export const getApiPort = (): number => {
//   if (typeof window !== 'undefined') {
//     // Client-side: check frontend port
//     const frontendPort = window.location.port;
//     return frontendPort === '3001' ? 4001 : 4000;
//   } else {
//     // Server-side: check NODE_ENV
//     return process.env.NODE_ENV === 'test' ? 4001 : 4000;
//   }
// };

// export const getApiBaseUrl = (endpoint: string = ''): string => {
//   const port = getApiPort();
  
//   if (typeof window !== 'undefined') {
//     // Client-side: use hostname for LAN compatibility
//     return `http://${window.location.hostname}:${port}/api${endpoint}`;
//   } else {
//     // Server-side: use localhost
//     return `http://localhost:${port}/api${endpoint}`;
//   }
// };

// /**
//  * Get current environment mode
//  */
// export const getEnvironmentMode = (): 'development' | 'test' => {
//   if (typeof window !== 'undefined') {
//     return window.location.port === '3001' ? 'test' : 'development';
//   }
//   return process.env.NODE_ENV === 'test' ? 'test' : 'development';
// };













































// lib/apiConfig.ts

export const getApiPort = (): number => {
  if (typeof window !== 'undefined') {
    const frontendPort = window.location.port;
    return frontendPort === '3001' ? 4001 : 4000;
  }
  return process.env.NODE_ENV === 'test' ? 4001 : 4000;
};

export const getApiBaseUrl = (endpoint: string = ''): string => {
  const port = getApiPort();
  if (typeof window !== 'undefined') {
    return `http://${window.location.hostname}:${port}/api${endpoint}`;
  }
  return `http://localhost:${port}/api${endpoint}`;
};

export const getEnvironmentMode = (): 'development' | 'test' => {
  if (typeof window !== 'undefined') {
    return window.location.port === '3001' ? 'test' : 'development';
  }
  return process.env.NODE_ENV === 'test' ? 'test' : 'development';
};
