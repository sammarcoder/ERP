// // store/hooks.ts
// import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
// import type { RootState, AppDispatch } from './index';

// // Typed hooks for better TypeScript support
// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

// // Custom hooks for specific slices
// export const useOrderState = () => useAppSelector(state => state.order);
// export const useItemsState = () => useAppSelector(state => state.items);
// export const useAccountsState = () => useAppSelector(state => state.accounts);
// export const useUIState = () => useAppSelector(state => state.ui);
// export const useCalculationState = () => useAppSelector(state => state.calculation);

// // Selector hooks for computed values
// export const useOrderTotals = () => useAppSelector(state => {
//   const { details } = state.order;
//   return {
//     grossTotal: details.reduce((sum, item) => sum + (item.grossTotal || 0), 0),
//     netTotal: details.reduce((sum, item) => sum + (item.netTotal || 0), 0),
//     itemCount: details.length,
//     totalDiscount: details.reduce((sum, item) => sum + ((item.grossTotal || 0) - (item.netTotal || 0)), 0)
//   };
// });

// export const useFilteredItems = () => useAppSelector(state => {
//   const { items, classFilters } = state.items;
  
//   if (!items.length) return [];
  
//   let filtered = items;
  
//   if (classFilters.itemClass1) {
//     filtered = filtered.filter(item => item.itemClass1 === classFilters.itemClass1);
//   }
//   if (classFilters.itemClass2) {
//     filtered = filtered.filter(item => item.itemClass2 === classFilters.itemClass2);
//   }
//   if (classFilters.itemClass3) {
//     filtered = filtered.filter(item => item.itemClass3 === classFilters.itemClass3);
//   }
//   if (classFilters.itemClass4) {
//     filtered = filtered.filter(item => item.itemClass4 === classFilters.itemClass4);
//   }
  
//   return filtered;
// });


















// // store/hooks.ts - KEEP YOUR ORIGINAL
// import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
// import type { RootState, AppDispatch } from './index';

// export const useAppDispatch = () => useDispatch<AppDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
