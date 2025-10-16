// // store/index.ts - EXACTLY AS YOU HAD IT WORKING
// import { configureStore } from '@reduxjs/toolkit';
// import transporterReducer from './slice/transporterSlice';
// import coaReducer from './slice/coaSlice'; // Add your COA slice back

// export const store = configureStore({
//   reducer: {
//     transporter: transporterReducer, // Your working transporter
//     coa: coaReducer, // Your working COA
//     // Add other reducers here as your app grows
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
//       },
//     }),
// });

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// // Export for use in other files
// export default store;










// store/index.ts - Your working store
import { configureStore } from '@reduxjs/toolkit';
import transporterReducer from './slice/transporterSlice';
import coaReducer from './slice/coaSlice'; // Make sure you have this

export const store = configureStore({
  reducer: {
    transporter: transporterReducer, // Your working transporter
    coa: coaReducer,                 // Your working COA
    // Add other reducers here as your app grows
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export for use in other files
export default store;
