// // hooks/useItemOrderDispatchReport.ts

// 'use client'
// import { useState, useCallback } from 'react'
// import { useLazyGetItemOrderDispatchReportQuery } from '@/store/slice/reports/reportApi'
// import type { ReportFilters, OrderData, GrandTotals } from '@/store/slice/reports/reportApi'

// const getDefaultDates = () => {
//   const today = new Date();
//   const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  
//   return {
//     dateFrom: firstDay.toISOString().split('T')[0],
//     dateTo: today.toISOString().split('T')[0]
//   };
// };

// export const useItemOrderDispatchReport = () => {
//   const defaultDates = getDefaultDates();
  
//   // ✅ Filter State
//   const [filters, setFilters] = useState<ReportFilters>({
//     dateFrom: defaultDates.dateFrom,
//     dateTo: defaultDates.dateTo,
//     uom: '2',  // Default to UOM2 (Box)
//     coaId: null,
//     itemIds: []
//   });

//   // ✅ Validation errors
//   const [errors, setErrors] = useState<Record<string, string>>({});

//   // ✅ Expanded orders state (for collapsible cards)
//   const [expandedOrders, setExpandedOrders] = useState<Set<number>>(new Set());

//   // ✅ RTK Query lazy trigger
//   const [fetchReport, { data, isLoading, isFetching, error }] = useLazyGetItemOrderDispatchReportQuery();

//   // ✅ Update single filter
//   const updateFilter = useCallback(<K extends keyof ReportFilters>(
//     key: K, 
//     value: ReportFilters[K]
//   ) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//     setErrors(prev => ({ ...prev, [key]: '' }));
//   }, []);

//   // ✅ Reset filters
//   const resetFilters = useCallback(() => {
//     const defaultDates = getDefaultDates();
//     setFilters({
//       dateFrom: defaultDates.dateFrom,
//       dateTo: defaultDates.dateTo,
//       uom: '2',
//       coaId: null,
//       itemIds: []
//     });
//     setErrors({});
//     setExpandedOrders(new Set());
//   }, []);

//   // ✅ Validate filters
//   const validateFilters = useCallback((): boolean => {
//     const newErrors: Record<string, string> = {};
    
//     if (!filters.dateFrom) newErrors.dateFrom = 'Date From is required';
//     if (!filters.dateTo) newErrors.dateTo = 'Date To is required';
//     if (!filters.uom) newErrors.uom = 'UOM is required';
    
//     if (filters.dateFrom && filters.dateTo) {
//       if (new Date(filters.dateFrom) > new Date(filters.dateTo)) {
//         newErrors.dateTo = 'Date To must be after Date From';
//       }
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   }, [filters]);

//   // ✅ Generate report
//   const generateReport = useCallback(async () => {
//     if (!validateFilters()) return;
    
//     await fetchReport({
//       dateFrom: filters.dateFrom,
//       dateTo: filters.dateTo,
//       uom: filters.uom,
//       coaId: filters.coaId || undefined,
//       itemIds: filters.itemIds && filters.itemIds.length > 0 ? filters.itemIds : undefined
//     });

//     // Expand all orders by default
//     if (data?.data) {
//       setExpandedOrders(new Set(data.data.map(o => o.orderId)));
//     }
//   }, [filters, validateFilters, fetchReport, data]);

//   // ✅ Toggle order expansion
//   const toggleOrderExpand = useCallback((orderId: number) => {
//     setExpandedOrders(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(orderId)) {
//         newSet.delete(orderId);
//       } else {
//         newSet.add(orderId);
//       }
//       return newSet;
//     });
//   }, []);

//   // ✅ Expand/Collapse all
//   const expandAll = useCallback(() => {
//     if (data?.data) {
//       setExpandedOrders(new Set(data.data.map(o => o.orderId)));
//     }
//   }, [data]);

//   const collapseAll = useCallback(() => {
//     setExpandedOrders(new Set());
//   }, []);

//   // ✅ Check if order is expanded
//   const isOrderExpanded = useCallback((orderId: number) => {
//     return expandedOrders.has(orderId);
//   }, [expandedOrders]);

//   // ✅ Get status badge color
//   const getStatusColor = useCallback((status: string) => {
//     switch (status) {
//       case 'Complete': return 'bg-green-100 text-green-700 border-green-300';
//       case 'Partial': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
//       case 'Pending': return 'bg-red-100 text-red-700 border-red-300';
//       case 'Over Dispatch': return 'bg-purple-100 text-purple-700 border-purple-300';
//       default: return 'bg-gray-100 text-gray-700 border-gray-300';
//     }
//   }, []);

//   // ✅ Get order status color
//   const getOrderStatusColor = useCallback((status: string) => {
//     switch (status?.toLowerCase()) {
//       case 'complete': return 'bg-green-500';
//       case 'partial': return 'bg-yellow-500';
//       case 'pending': return 'bg-red-500';
//       default: return 'bg-gray-500';
//     }
//   }, []);

//   // ✅ Get UOM label
//   const getUomLabel = useCallback((uom: '1' | '2' | '3') => {
//     switch (uom) {
//       case '1': return 'Primary (Pcs/Pkt)';
//       case '2': return 'Secondary (Box)';
//       case '3': return 'Tertiary (Crt)';
//       default: return 'Unknown';
//     }
//   }, []);

//   // ✅ Format date
//   const formatDate = useCallback((dateString: string) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: 'short',
//       year: 'numeric'
//     });
//   }, []);

//   // ✅ Format number
//   const formatNumber = useCallback((num: number) => {
//     return num.toLocaleString();
//   }, []);

//   return {
//     // State
//     filters,
//     errors,
//     expandedOrders,
    
//     // Data
//     reportData: data?.data || [] as OrderData[],
//     grandTotals: data?.grandTotals || { totalOrders: 0, totalOrderQty: 0, totalDispatchQty: 0, totalDifference: 0 } as GrandTotals,
    
//     // Loading states
//     isLoading,
//     isFetching,
//     error: error ? 'Failed to generate report' : null,
//     hasData: !!data?.data?.length,
    
//     // Actions
//     updateFilter,
//     resetFilters,
//     generateReport,
//     toggleOrderExpand,
//     expandAll,
//     collapseAll,
//     isOrderExpanded,
    
//     // Helpers
//     getStatusColor,
//     getOrderStatusColor,
//     getUomLabel,
//     formatDate,
//     formatNumber
//   };
// };











































// hooks/useItemOrderDispatchReport.ts

'use client'
import { useState, useCallback } from 'react'
import { useLazyGetItemOrderDispatchReportQuery } from '@/store/slice/reports/reportApi'
import type { ReportFilters, CustomerData, GrandTotals } from '@/store/slice/reports/reportApi'

const getDefaultDates = () => {
  const today = new Date();
  // const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
   const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1;
  
  return {
    // dateFrom: firstDay.toISOString().split('T')[0],
    dateFrom: '2026-01-01',
    dateTo: `2026-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`
    // dateTo: today.toISOString().split('T')[0]
  };
};

export const useItemOrderDispatchReport = () => {
  const defaultDates = getDefaultDates();
  
  // ✅ Filter State
  const [filters, setFilters] = useState<ReportFilters>({
    dateFrom: defaultDates.dateFrom,
    dateTo: defaultDates.dateTo,
    uom: '2',
    coaId: null,
    itemIds: []
  });

  // ✅ Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // ✅ Expanded customers state
  const [expandedCustomers, setExpandedCustomers] = useState<Set<number>>(new Set());

  // ✅ RTK Query lazy trigger
  const [fetchReport, { data, isLoading, isFetching, error }] = useLazyGetItemOrderDispatchReportQuery();

  // ✅ Update single filter
  const updateFilter = useCallback(<K extends keyof ReportFilters>(
    key: K, 
    value: ReportFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  }, []);

  // ✅ Reset filters
  const resetFilters = useCallback(() => {
    const defaultDates = getDefaultDates();
    setFilters({
      dateFrom: defaultDates.dateFrom,
      dateTo: defaultDates.dateTo,
      uom: '2',
      coaId: null,
      itemIds: []
    });
    setErrors({});
    setExpandedCustomers(new Set());
  }, []);

  // ✅ Validate filters
  const validateFilters = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!filters.dateFrom) newErrors.dateFrom = 'Date From is required';
    if (!filters.dateTo) newErrors.dateTo = 'Date To is required';
    if (!filters.uom) newErrors.uom = 'UOM is required';
    
    if (filters.dateFrom && filters.dateTo) {
      if (new Date(filters.dateFrom) > new Date(filters.dateTo)) {
        newErrors.dateTo = 'Date To must be after Date From';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [filters]);

  // ✅ Generate report
  const generateReport = useCallback(async () => {
    if (!validateFilters()) return;
    
    const result = await fetchReport({
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      uom: filters.uom,
      coaId: filters.coaId || undefined,
      itemIds: filters.itemIds && filters.itemIds.length > 0 ? filters.itemIds : undefined
    });

    // Expand all customers by default
    if (result.data?.data) {
      setExpandedCustomers(new Set(result.data.data.map(c => c.customerId)));
    }
  }, [filters, validateFilters, fetchReport]);

  // ✅ Toggle customer expansion
  const toggleCustomerExpand = useCallback((customerId: number) => {
    setExpandedCustomers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(customerId)) {
        newSet.delete(customerId);
      } else {
        newSet.add(customerId);
      }
      return newSet;
    });
  }, []);

  // ✅ Expand/Collapse all
  const expandAll = useCallback(() => {
    if (data?.data) {
      setExpandedCustomers(new Set(data.data.map(c => c.customerId)));
    }
  }, [data]);

  const collapseAll = useCallback(() => {
    setExpandedCustomers(new Set());
  }, []);

  // ✅ Check if customer is expanded
  const isCustomerExpanded = useCallback((customerId: number) => {
    return expandedCustomers.has(customerId);
  }, [expandedCustomers]);

  // ✅ Get status badge color
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case 'Complete': return 'bg-green-100 text-green-700 border-green-300';
      case 'Partial': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Pending': return 'bg-red-100 text-red-700 border-red-300';
      case 'Over Dispatch': return 'bg-purple-100 text-purple-700 border-purple-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  }, []);

  // ✅ Get UOM label
  const getUomLabel = useCallback((uom: '1' | '2' | '3') => {
    switch (uom) {
      case '1': return 'Primary (Pcs/Pkt)';
      case '2': return 'Secondary (Box)';
      case '3': return 'Tertiary (Crt)';
      default: return 'Unknown';
    }
  }, []);
  const getOrderStatusColor = useCallback((status: string) => {
  switch (status?.toLowerCase()) {
    case 'complete': return 'bg-green-100 text-green-700 border-green-300';
    case 'partial': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
    case 'incomplete': return 'bg-orange-100 text-orange-700 border-orange-300';
    case 'pending': return 'bg-red-100 text-red-700 border-red-300';
    default: return 'bg-gray-100 text-gray-700 border-gray-300';
  }
}, []);

  // ✅ Format date
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }, []);

  // ✅ Format number
  const formatNumber = useCallback((num: number) => {
    return num.toLocaleString();
  }, []);

  return {
    // State
    filters,
    errors,
    expandedCustomers,
    
    // Data
    reportData: data?.data || [] as CustomerData[],
    grandTotals: data?.grandTotals || { 
      totalCustomers: 0, 
      totalOrders: 0, 
      totalOrderQty: 0, 
      totalDispatchQty: 0, 
      totalDifference: 0 
    } as GrandTotals,
    
    // Loading states
    isLoading,
    isFetching,
    error: error ? 'Failed to generate report' : null,
    hasData: !!data?.data?.length,
    
    // Actions
    updateFilter,
    resetFilters,
    generateReport,
    toggleCustomerExpand,
    expandAll,
    collapseAll,
    isCustomerExpanded,
    
    // Helpers
    getStatusColor,
    getOrderStatusColor,
    getUomLabel,
    formatDate,
    formatNumber
  };
};
