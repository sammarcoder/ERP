



// import { configureStore } from '@reduxjs/toolkit';
// import transporterReducer from './slice/transporterSlice';
// import coaReducer from './slice/coaSlice';
// import { uomApi } from './slice/uomSlice';
// import { salesmanApi } from './slice/salesmanSlice';
// // import { itemsClassApi } from './slice/itemsClassSlice';
// import { itemClassApi } from './slice/itemsClassSlice'; // Updated import
// // import { controlHead2Api } from './slice/itemsClassSlice'; // Add this
// import { currencyApi } from './slice/currencySlice'; // Add this
// import { journalVoucherApi } from './slice/journalVoucherSlice'; // Add this


// export const store = configureStore({
//   reducer: {
//     transporter: transporterReducer,
//     coa: coaReducer,
//     [uomApi.reducerPath]: uomApi.reducer,
//     [salesmanApi.reducerPath]: salesmanApi.reducer,
//     [itemClassApi.reducerPath]: itemClassApi.reducer,
//     // [itemsClassApi.reducerPath]: itemsClassApi.reducer,
//     // [controlHead2Api.reducerPath]: controlHead2Api.reducer,
//     [currencyApi.reducerPath]: currencyApi.reducer, // Add this
//     [journalVoucherApi.reducerPath]: journalVoucherApi.reducer, // Add this

//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
//       },
//     })
//       .concat(uomApi.middleware)
//       .concat(salesmanApi.middleware) // 
//       // .concat(itemsClassApi.middleware) // Add this
//       // .concat(controlHead2Api.middleware)// Add this
//       .concat(itemClassApi.middleware)
//       .concat(currencyApi.middleware) // Add this
//       .concat(journalVoucherApi.middleware), // Add this
// });

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;










































import { configureStore } from '@reduxjs/toolkit';
import transporterReducer from './slice/transporterSlice';
import coaReducer from './slice/coaSlice';
import { uomApi } from './slice/uomSlice';
import { salesmanApi } from './slice/salesmanSlice';
import { itemClassApi } from './slice/itemsClassSlice';
import { currencyApi } from './slice/currencySlice';
import { journalVoucherApi } from './slice/journalVoucherSlice'; // ✅ FIXED

export const store = configureStore({
  reducer: {
    transporter: transporterReducer,
    coa: coaReducer,
    [uomApi.reducerPath]: uomApi.reducer,
    [salesmanApi.reducerPath]: salesmanApi.reducer,
    [itemClassApi.reducerPath]: itemClassApi.reducer,
    [currencyApi.reducerPath]: currencyApi.reducer,
    [journalVoucherApi.reducerPath]: journalVoucherApi.reducer, // ✅ FIXED
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    })
    .concat(uomApi.middleware)
    .concat(salesmanApi.middleware)
    .concat(itemClassApi.middleware)
    .concat(currencyApi.middleware)
    .concat(journalVoucherApi.middleware), // ✅ FIXED
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
