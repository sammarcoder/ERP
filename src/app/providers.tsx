// 'use client'
// import { Provider } from 'react-redux';
// import { store } from '@/store/store';

// export function Providers({ children }: { children: React.ReactNode }) {
//   return (
//     <Provider store={store}>
//       {children}
//     </Provider>
//   );
// }







// app/providers.tsx - This wraps your entire app
'use client';
import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

interface ProvidersProps {
  children: React.ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
};

export default Providers;

















