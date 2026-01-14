
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import transporterReducer from './slice/transporterSlice';
import coaReducer from './slice/coaSlice';
import { uomApi } from './slice/uomSlice';
import { salesmanApi } from './slice/salesmanSlice';

import { itemClassApi } from './slice/itemsClassSlice';
import { currencyApi } from './slice/currencySlice';
import { journalVoucherApi } from './slice/journalVoucherSlice';
import { coaApi } from './slice/coaApi';
import { orderApi } from './slice/orderApi';
import { transporterApi } from './slice/transporterApi';
import { itemsApi } from './slice/itemsApi';
import { grnApi } from './slice/grnApi';
import { gdnApi } from './slice/gdnApi';
// import {salesVoucherApi} from './slice/salesVoucherApi';
import { salesVoucherApi } from './slice/salesVoucherApi';



import { machineApi } from './slice/machineApi';
import { shiftApi } from './slice/shiftApi';
import { departmentApi } from './slice/departmentApi';
import { employeeApi } from './slice/employeeApi';
import { mouldApi } from './slice/mouldApi';
import { mouldingApi } from './slice/mouldingApi';




import { gdnApi2 } from './test/gdnApi';

export const store = configureStore({
  reducer: {
    transporter: transporterReducer,
    coa: coaReducer,
    [uomApi.reducerPath]: uomApi.reducer,
    [salesmanApi.reducerPath]: salesmanApi.reducer,
    [itemClassApi.reducerPath]: itemClassApi.reducer,
    [currencyApi.reducerPath]: currencyApi.reducer,
    [journalVoucherApi.reducerPath]: journalVoucherApi.reducer,
    [coaApi.reducerPath]: coaApi.reducer,
    [orderApi.reducerPath]: orderApi.reducer,
    [transporterApi.reducerPath]: transporterApi.reducer,
    [itemsApi.reducerPath]: itemsApi.reducer,
    [grnApi.reducerPath]: grnApi.reducer,
    [gdnApi.reducerPath]: gdnApi.reducer,
    [salesVoucherApi.reducerPath]: salesVoucherApi.reducer,
    // [gdnApi2.reducerPath]: gdnApi2.reducer,


    [machineApi.reducerPath]: machineApi.reducer,
    [shiftApi.reducerPath]: shiftApi.reducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [employeeApi.reducerPath]: employeeApi.reducer,
     [mouldApi.reducerPath]: mouldApi.reducer,
      [mouldingApi.reducerPath]: mouldingApi.reducer,



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
      .concat(journalVoucherApi.middleware)
      .concat(coaApi.middleware)
      .concat(orderApi.middleware)
      .concat(transporterApi.middleware)
      .concat(itemsApi.middleware)
      .concat(grnApi.middleware)
      .concat(gdnApi.middleware)
      .concat(salesVoucherApi.middleware)
      // .concat(gdnApi2.middleware),


      .concat(machineApi.middleware)
      .concat(shiftApi.middleware)
      .concat(departmentApi.middleware)
      .concat(employeeApi.middleware)
       .concat(mouldApi.middleware)
       .concat(mouldingApi.middleware),
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
