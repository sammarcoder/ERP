

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import SelectableTable from '@/components/SelectableTable';

// // Interfaces (same as your original)
// interface ControlHead1 {
//   id: number;
//   zHead1: string;
// }

// interface ControlHead2 {
//   id: number;
//   zHead2: string;
//   zHead1Id: number;
// }

// interface CoaType {
//   id: number;
//   zType: string;
// }

// interface SalesMan {
//   id: number;
//   name: string;
//   city: string;
//   address: string;
//   telephone: string;
// }

// interface Transporter {
//   id: number;
//   name: string;
//   contactPerson?: string;
//   phone?: string;
//   address?: string;
//   isActive: boolean;
// }

// // Updated Form data interface with NEW FIELDS
// interface CoaFormData {
//   id?: number;
//   acName: string;
//   ch1Id: number;
//   ch2Id: number;
//   coaTypeId: number;
//   setupName: string;
//   address: string;           // Fixed: was "adress"
//   city: string;
//   personName: string;
//   mobileNo: string;
//   taxStatus: boolean;
//   ntn: string;
//   cnic: string;
//   salesLimit: string;
//   credit: string;
//   creditDays: string;        // Fixed: was "creditDoys"
//   salesMan: string;
//   isJvBalance: boolean;
//   discountA: number;
//   discountB: number;
//   discountC: number;
//   batch_no?: string;
//   // YOUR NEW EXPENSE FIELDS
//   Transporter_ID: number | null;
//   freight_crt: number;
//   labour_crt: number;
//   bility_expense: number;
//   other_expense: number;
// }

// export default function EfficientCoaForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const coaId = searchParams.get('id');
//   const isEditMode = Boolean(coaId);

//   // State for API data
//   const [controlHead1List, setControlHead1List] = useState<ControlHead1[]>([]);
//   const [controlHead2List, setControlHead2List] = useState<ControlHead2[]>([]);
//   const [filteredControlHead2List, setFilteredControlHead2List] = useState<ControlHead2[]>([]);
//   const [coaTypeList, setCoaTypeList] = useState<CoaType[]>([]);
//   const [salesManList, setSalesManList] = useState<SalesMan[]>([]);
//   const [transporterList, setTransporterList] = useState<Transporter[]>([]);
  
//   // Loading states
//   const [loading, setLoading] = useState({
//     ch1: true,
//     ch2: true,
//     coaType: true,
//     salesMan: true,
//     transporter: true,
//     coaData: isEditMode
//   });
  
//   // Form state with NEW FIELDS
//   const [formData, setFormData] = useState<CoaFormData>({
//     acName: '',
//     ch1Id: 0,
//     ch2Id: 0,
//     coaTypeId: 0,
//     setupName: '',
//     address: '',               // Fixed
//     city: '',
//     personName: '',
//     mobileNo: '',
//     taxStatus: false,
//     ntn: '',
//     cnic: '',
//     salesLimit: '',
//     credit: '',
//     creditDays: '',           // Fixed
//     salesMan: '',
//     isJvBalance: false,
//     discountA: 0,
//     discountB: 0,
//     discountC: 0,
//     batch_no: '',
//     // NEW EXPENSE FIELDS
//     Transporter_ID: null,
//     freight_crt: 0.00,
//     labour_crt: 0.00,
//     bility_expense: 0.00,
//     other_expense: 0.00,
//   });
  
//   // UI state
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [apiErrors, setApiErrors] = useState<{[key: string]: string}>({});

//   // Fetch all data on component mount
//   useEffect(() => {
//     fetchControlHead1();
//     fetchControlHead2();
//     fetchCoaTypes();
//     fetchSalesmen();
//     fetchTransporters();     // NEW: Fetch transporters
    
//     if (isEditMode && coaId) {
//       fetchCoaData(coaId);
//     }
//   }, [isEditMode, coaId]);

//   // Filter Control Head 2 when Control Head 1 changes
//   useEffect(() => {
//     if (formData.ch1Id) {
//       const filtered = controlHead2List.filter(ch2 => ch2.zHead1Id === Number(formData.ch1Id));
//       setFilteredControlHead2List(filtered);
      
//       if (!loading.coaData && !filtered.find(ch2 => ch2.id === formData.ch2Id)) {
//         setFormData(prev => ({ ...prev, ch2Id: 0 }));
//       }
//     } else {
//       setFilteredControlHead2List([]);
//       if (!loading.coaData) {
//         setFormData(prev => ({ ...prev, ch2Id: 0 }));
//       }
//     }
//   }, [formData.ch1Id, controlHead2List, loading.coaData]);

//   // NEW: Fetch transporters
//   const fetchTransporters = async () => {
//     try {
//       setLoading(prev => ({ ...prev, transporter: true }));
//       setApiErrors(prev => ({ ...prev, transporter: '' }));
      
//       const response = await fetch(`http://${window.location.hostname}:4000/api/transporter`);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch transporters: ${response.status}`);
//       }
      
//       const result = await response.json();
//       let transporters = [];
      
//       if (result.success && Array.isArray(result.data)) {
//         transporters = result.data;
//       } else if (Array.isArray(result)) {
//         transporters = result;
//       }
      
//       setTransporterList(transporters);
      
//     } catch (error) {
//       console.error('Error fetching transporters:', error);
//       setApiErrors(prev => ({ 
//         ...prev, 
//         transporter: error instanceof Error ? error.message : 'Unknown error' 
//       }));
//     } finally {
//       setLoading(prev => ({ ...prev, transporter: false }));
//     }
//   };

//   // Fetch COA data for editing (updated with NEW FIELDS)
//   const fetchCoaData = async (id: string) => {
//     try {
//       setLoading(prev => ({ ...prev, coaData: true }));
//       setApiErrors(prev => ({ ...prev, coaData: '' }));
      
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get/${id}`);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch COA data: ${response.status}`);
//       }
      
//       const result = await response.json();
//       const data = result.success ? result.data : result;
      
//       // Pre-populate form with existing data INCLUDING NEW FIELDS
//       setFormData({
//         id: data.id,
//         acName: data.acName || '',
//         ch1Id: data.ch1Id || 0,
//         ch2Id: data.ch2Id || 0,
//         coaTypeId: data.coaTypeId || 0,
//         setupName: data.setupName || '',
//         address: data.address || data.adress || '',    // Handle both old and new
//         city: data.city || '',
//         personName: data.personName || '',
//         mobileNo: data.mobileNo || '',
//         taxStatus: Boolean(data.taxStatus),
//         ntn: data.ntn || '',
//         cnic: data.cnic || '',
//         salesLimit: data.salesLimit || '',
//         credit: data.credit || '',
//         creditDays: data.creditDays || data.creditDoys || '', // Handle both old and new
//         salesMan: data.salesMan || '',
//         isJvBalance: Boolean(data.isJvBalance),
//         discountA: parseFloat(data.discountA) || 0,
//         discountB: parseFloat(data.discountB) || 0,
//         discountC: parseFloat(data.discountC) || 0,
//         batch_no: data.batch_no || '',
//         // NEW FIELDS
//         Transporter_ID: data.Transporter_ID || null,
//         freight_crt: parseFloat(data.freight_crt) || 0.00,
//         labour_crt: parseFloat(data.labour_crt) || 0.00,
//         bility_expense: parseFloat(data.bility_expense) || 0.00,
//         other_expense: parseFloat(data.other_expense) || 0.00,
//       });
      
//     } catch (error) {
//       console.error('Error fetching COA data:', error);
//       setApiErrors(prev => ({ 
//         ...prev, 
//         coaData: error instanceof Error ? error.message : 'Unknown error' 
//       }));
//       setMessage({
//         type: 'error',
//         text: 'Failed to load COA data for editing'
//       });
//     } finally {
//       setLoading(prev => ({ ...prev, coaData: false }));
//     }
//   };

//   // Your existing fetch functions (same as original)
//   const fetchControlHead1 = async () => {
//     try {
//       setLoading(prev => ({ ...prev, ch1: true }));
//       setApiErrors(prev => ({ ...prev, ch1: '' }));
      
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-control-head1`);
//       if (!response.ok) throw new Error(`Failed to fetch Control Head 1 data: ${response.status}`);
      
//       const data = await response.json();
//       setControlHead1List(Array.isArray(data) ? data : []);
//     } catch (error) {
//       console.error('Error fetching Control Head 1:', error);
//       setApiErrors(prev => ({ ...prev, ch1: error instanceof Error ? error.message : 'Unknown error' }));
//       setControlHead1List([]);
//     } finally {
//       setLoading(prev => ({ ...prev, ch1: false }));
//     }
//   };

//   const fetchControlHead2 = async () => {
//     try {
//       setLoading(prev => ({ ...prev, ch2: true }));
//       setApiErrors(prev => ({ ...prev, ch2: '' }));
      
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-control-head2/get`);
//       if (!response.ok) throw new Error(`Failed to fetch Control Head 2 data: ${response.status}`);
      
//       const text = await response.text();
//       let data = text ? JSON.parse(text) : [];
//       if (!Array.isArray(data)) {
//         const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
//         data = possibleArrays.length > 0 ? possibleArrays[0] : [data];
//       }
//       setControlHead2List(data);
//     } catch (error) {
//       console.error('Error fetching Control Head 2:', error);
//       setApiErrors(prev => ({ ...prev, ch2: error instanceof Error ? error.message : 'Unknown error' }));
//       setControlHead2List([]);
//     } finally {
//       setLoading(prev => ({ ...prev, ch2: false }));
//     }
//   };

//   const fetchCoaTypes = async () => {
//     try {
//       setLoading(prev => ({ ...prev, coaType: true }));
//       setApiErrors(prev => ({ ...prev, coaType: '' }));
      
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa-type`);
//       if (!response.ok) throw new Error(`Failed to fetch COA Types data: ${response.status}`);
      
//       const text = await response.text();
//       let data = text ? JSON.parse(text) : [];
//       if (!Array.isArray(data)) {
//         if (data.data && Array.isArray(data.data)) data = data.data;
//         else if (data.coaTypes && Array.isArray(data.coaTypes)) data = data.coaTypes;
//         else data = [data];
//       }
//       setCoaTypeList(data);
//     } catch (error) {
//       console.error('Error fetching COA Types:', error);
//       setApiErrors(prev => ({ ...prev, coaType: error instanceof Error ? error.message : 'Unknown error' }));
//       setCoaTypeList([]);
//     } finally {
//       setLoading(prev => ({ ...prev, coaType: false }));
//     }
//   };

//   const fetchSalesmen = async () => {
//     try {
//       setLoading(prev => ({ ...prev, salesMan: true }));
//       setApiErrors(prev => ({ ...prev, salesMan: '' }));
      
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-control/salesman`);
//       if (!response.ok) throw new Error(`Failed to fetch Salesmen data: ${response.status}`);
      
//       const text = await response.text();
//       let rawData = text ? JSON.parse(text) : [];
//       let salesmen = Array.isArray(rawData) ? rawData : rawData.data || [rawData];
//       setSalesManList(salesmen);
//     } catch (error) {
//       console.error('Error fetching Salesmen:', error);
//       setApiErrors(prev => ({ ...prev, salesMan: error instanceof Error ? error.message : 'Unknown error' }));
//       setSalesManList([]);
//     } finally {
//       setLoading(prev => ({ ...prev, salesMan: false }));
//     }
//   };

//   // Handle form input changes (updated for NEW FIELDS)
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     // Special handling for number inputs
//     if (['discountA', 'discountB', 'discountC', 'freight_crt', 'labour_crt', 'bility_expense', 'other_expense'].includes(name)) {
//       const numericValue = parseFloat(value) || 0;
//       setFormData({
//         ...formData,
//         [name]: numericValue
//       });
//     } else {
//       setFormData({
//         ...formData,
//         [name]: value
//       });
//     }
//   };

//   // Handle SelectableTable changes
//   const handleSelectableTableChange = (name: string, value: number | null) => {
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   // Handle radio button changes
//   const handleRadioChange = (name: string, value: boolean) => {
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   // Calculate total expenses
//   const getTotalExpenses = () => {
//     return formData.freight_crt + formData.labour_crt + formData.bility_expense + formData.other_expense;
//   };

//   // Handle form submission (updated with NEW FIELDS validation)
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!formData.acName.trim()) {
//       setMessage({ type: 'error', text: 'Account Name is required' });
//       return;
//     }
    
//     if (!formData.ch1Id) {
//       setMessage({ type: 'error', text: 'Please select a Control Head 1' });
//       return;
//     }
    
//     if (!formData.ch2Id) {
//       setMessage({ type: 'error', text: 'Please select a Control Head 2' });
//       return;
//     }
    
//     if (!formData.coaTypeId) {
//       setMessage({ type: 'error', text: 'Please select a COA Type' });
//       return;
//     }

//     // Validate discount percentages
//     if (formData.discountA < 0 || formData.discountA > 100) {
//       setMessage({ type: 'error', text: 'Discount A must be between 0 and 100' });
//       return;
//     }
    
//     if (formData.discountB < 0 || formData.discountB > 100) {
//       setMessage({ type: 'error', text: 'Discount B must be between 0 and 100' });
//       return;
//     }
    
//     if (formData.discountC < 0 || formData.discountC > 100) {
//       setMessage({ type: 'error', text: 'Discount C must be between 0 and 100' });
//       return;
//     }

//     // NEW: Validate expense fields
//     if (formData.freight_crt < 0) {
//       setMessage({ type: 'error', text: 'Freight cost must be non-negative' });
//       return;
//     }
    
//     if (formData.labour_crt < 0) {
//       setMessage({ type: 'error', text: 'Labour cost must be non-negative' });
//       return;
//     }
    
//     if (formData.bility_expense < 0) {
//       setMessage({ type: 'error', text: 'Utility expense must be non-negative' });
//       return;
//     }
    
//     if (formData.other_expense < 0) {
//       setMessage({ type: 'error', text: 'Other expense must be non-negative' });
//       return;
//     }
    
//     try {
//       setSubmitting(true);
//       setMessage({ type: '', text: '' });
      
//       const url = isEditMode 
//         ? `http://${window.location.hostname}:4000/api/z-coa/update/${coaId}`
//         : `http://${window.location.hostname}:4000/api/z-coa/create`;
        
//       const method = isEditMode ? 'PUT' : 'POST';
      
//       const response = await fetch(url, {
//         method,
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });
     
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `Request failed with status ${response.status}`);
//       }
      
//       const responseData = await response.json();
      
//       setMessage({
//         type: 'success',
//         text: `COA ${isEditMode ? 'updated' : 'created'} successfully!`
//       });
      
//       if (!isEditMode) {
//         // Reset form for creation
//         setFormData({
//           acName: '',
//           ch1Id: 0,
//           ch2Id: 0,
//           coaTypeId: 0,
//           setupName: '',
//           address: '',
//           city: '',
//           personName: '',
//           mobileNo: '',
//           taxStatus: false,
//           ntn: '',
//           cnic: '',
//           salesLimit: '',
//           credit: '',
//           creditDays: '',
//           salesMan: '',
//           isJvBalance: false,
//           discountA: 0,
//           discountB: 0,
//           discountC: 0,
//           batch_no: '',
//           // Reset new fields
//           Transporter_ID: null,
//           freight_crt: 0.00,
//           labour_crt: 0.00,
//           bility_expense: 0.00,
//           other_expense: 0.00,
//         });
//         setFilteredControlHead2List([]);
//       } else {
//         setTimeout(() => {
//           router.push('/coa/list');
//         }, 2000);
//       }
      
//     } catch (error: any) {
//       console.error(`Error ${isEditMode ? 'updating' : 'creating'} COA:`, error);
//       setMessage({
//         type: 'error',
//         text: error?.message || `Failed to ${isEditMode ? 'update' : 'create'} COA`
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!isEditMode || !coaId) return;
    
//     const confirmed = window.confirm('Are you sure you want to delete this COA? This action cannot be undone.');
//     if (!confirmed) return;
    
//     try {
//       setMessage({ type: '', text: '' });
      
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/delete/${coaId}`, {
//         method: 'DELETE',
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `Delete request failed with status ${response.status}`);
//       }
      
//       setMessage({
//         type: 'success',
//         text: 'COA deleted successfully!'
//       });
      
//       setTimeout(() => {
//         router.push('/coa/list');
//       }, 2000);
      
//     } catch (error: any) {
//       console.error('Error deleting COA:', error);
//       setMessage({
//         type: 'error',
//         text: error?.message || 'Failed to delete COA'
//       });
//     }
//   };

//   // Determine if there are any API errors
//   const hasApiErrors = Object.values(apiErrors).some(error => error !== '');

//   // Check if all data is loaded (including transporters)
//   const isLoading = loading.ch1 || loading.ch2 || loading.coaType || loading.salesMan || loading.transporter || loading.coaData;

//   return (
//     <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      
//       {/* Header */}
//       <div className="mb-6">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900 mb-1">
//               {isEditMode ? 'Edit Chart of Account' : 'Create Chart of Account'}
//             </h1>
//             <p className="text-gray-600 text-sm">
//               {isEditMode 
//                 ? 'Update the account information below.' 
//                 : 'Fill in the information below to create a new chart of account.'
//               }
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => router.push('/coa/list')}
//               className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
//             >
//               View All
//             </button>
//             {isEditMode && (
//               <button
//                 onClick={handleDelete}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium text-sm"
//               >
//                 Delete
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Messages */}
//       {message.text && (
//         <div className={`mb-4 p-3 rounded-lg border text-sm ${
//           message.type === 'success' 
//             ? 'bg-green-50 text-green-800 border-green-200' 
//             : 'bg-red-50 text-red-800 border-red-200'
//         }`}>
//           {message.text}
//         </div>
//       )}
      
//       {/* API Errors */}
//       {hasApiErrors && (
//         <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-3 mb-4 text-sm">
//           <h3 className="font-bold">Warning: Some data failed to load</h3>
//           <div className="mt-2 flex flex-wrap gap-2">
//             {apiErrors.ch1 && (
//               <button onClick={fetchControlHead1} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
//                 Retry Control Head 1
//               </button>
//             )}
//             {apiErrors.ch2 && (
//               <button onClick={fetchControlHead2} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
//                 Retry Control Head 2
//               </button>
//             )}
//             {apiErrors.coaType && (
//               <button onClick={fetchCoaTypes} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
//                 Retry COA Types
//               </button>
//             )}
//             {apiErrors.salesMan && (
//               <button onClick={fetchSalesmen} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
//                 Retry Salesmen
//               </button>
//             )}
//             {apiErrors.transporter && (
//               <button onClick={fetchTransporters} className="px-2 py-1 bg-blue-600 text-white rounded text-xs">
//                 Retry Transporters
//               </button>
//             )}
//           </div>
//         </div>
//       )}
      
//       {/* Loading state */}
//       {isLoading ? (
//         <div className="bg-white rounded-lg shadow border p-12">
//           <div className="flex justify-center items-center">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-3"></div>
//               <p className="text-gray-600 text-sm">
//                 {isEditMode ? 'Loading data for editing...' : 'Loading data...'}
//               </p>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow border p-6">
//           <form onSubmit={handleSubmit}>
            
//             {/* SECTION 1: Basic Information - 4 fields per row */}
//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h3>
              
//               {/* Row 1: Account Name (full width) */}
//               <div className="grid grid-cols-1 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Account Name *</label>
//                   <input
//                     type="text"
//                     name="acName"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
//                     value={formData.acName}
//                     onChange={handleInputChange}
//                     disabled={submitting}
//                     required
//                     placeholder="Enter account name"
//                   />
//                 </div>
//               </div>
              
//               {/* Row 2: Control Heads, COA Type, Transporter */}
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Control Head 1 *</label>
//                   <select
//                     name="ch1Id"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.ch1Id || ''}
//                     onChange={handleInputChange}
//                     disabled={submitting || controlHead1List.length === 0}
//                     required
//                   >
//                     <option value="">Select Control Head 1</option>
//                     {controlHead1List.map(ch1 => (
//                       <option key={ch1.id} value={ch1.id}>{ch1.zHead1}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Control Head 2 *</label>
//                   <select
//                     name="ch2Id"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.ch2Id || ''}
//                     onChange={handleInputChange}
//                     disabled={submitting || !formData.ch1Id || filteredControlHead2List.length === 0}
//                     required
//                   >
//                     <option value="">
//                       {!formData.ch1Id ? 'Select Control Head 1 first' : 'Select Control Head 2'}
//                     </option>
//                     {filteredControlHead2List.map(ch2 => (
//                       <option key={ch2.id} value={ch2.id}>{ch2.zHead2}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">COA Type *</label>
//                   <select
//                     name="coaTypeId"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.coaTypeId || ''}
//                     onChange={handleInputChange}
//                     disabled={submitting || coaTypeList.length === 0}
//                     required
//                   >
//                     <option value="">Select COA Type</option>
//                     {coaTypeList.map(type => (
//                       <option key={type.id} value={type.id}>{type.zType}</option>
//                     ))}
//                   </select>
//                 </div>

//                 {/* NEW: Transporter Selection using SelectableTable */}
//                 <div>
//                   <SelectableTable
//                     label="Transporter"
//                     name="Transporter_ID"
//                     value={formData.Transporter_ID}
//                     onChange={handleSelectableTableChange}
//                     options={transporterList.map(transporter => ({
//                       id: transporter.id,
//                       label: transporter.name,
//                       contactPerson: transporter.contactPerson || '-',
//                       phone: transporter.phone || '-',
//                       address: transporter.address || '-',
//                       status: transporter.isActive ? 'Active' : 'Inactive'
//                     }))}
//                     placeholder="Select Transporter (Optional)"
//                     disabled={submitting || transporterList.length === 0}
//                     displayKey="label"
//                     valueKey="id"
//                     columns={[
//                       { key: 'label', label: 'Name', width: '30%' },
//                       { key: 'contactPerson', label: 'Contact Person', width: '25%' },
//                       { key: 'phone', label: 'Phone', width: '20%' },
//                       { key: 'address', label: 'Address', width: '25%' }
//                     ]}
//                     pageSize={8}
//                   />
//                 </div>
//               </div>
              
//               {/* Row 3: Setup Name, Address (Address takes 2 cols) */}
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Setup Name</label>
//                   <input
//                     type="text"
//                     name="setupName"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.setupName}
//                     onChange={handleInputChange}
//                     placeholder="Enter setup name"
//                   />
//                 </div>
                
//                 <div className="md:col-span-2">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
//                   <input
//                     type="text"
//                     name="address"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.address}
//                     onChange={handleInputChange}
//                     placeholder="Enter full address"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* SECTION 2: Contact Information - 4 fields per row */}
//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Contact Information</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
//                   <input
//                     type="text"
//                     name="city"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.city}
//                     onChange={handleInputChange}
//                     placeholder="Enter city"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Person Name</label>
//                   <input
//                     type="text"
//                     name="personName"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.personName}
//                     onChange={handleInputChange}
//                     placeholder="Enter person name"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
//                   <input
//                     type="text"
//                     name="mobileNo"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.mobileNo}
//                     onChange={handleInputChange}
//                     placeholder="Enter mobile number"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">NTN</label>
//                   <input
//                     type="text"
//                     name="ntn"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.ntn}
//                     onChange={handleInputChange}
//                     placeholder="Enter NTN"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* SECTION 3: Financial Information - 4 fields per row */}
//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Financial Information</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">CNIC</label>
//                   <input
//                     type="text"
//                     name="cnic"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.cnic}
//                     onChange={handleInputChange}
//                     placeholder="Enter CNIC"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Sales Limit</label>
//                   <input
//                     type="text"
//                     name="salesLimit"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.salesLimit}
//                     onChange={handleInputChange}
//                     placeholder="Enter sales limit"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Credit</label>
//                   <input
//                     type="text"
//                     name="credit"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.credit}
//                     onChange={handleInputChange}
//                     placeholder="Enter credit amount"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Credit Days</label>
//                   <input
//                     type="text"
//                     name="creditDays"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.creditDays}
//                     onChange={handleInputChange}
//                     placeholder="Enter credit days"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Sales Man</label>
//                   <select
//                     name="salesMan"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.salesMan}
//                     onChange={handleInputChange}
//                     disabled={submitting || !Array.isArray(salesManList) || salesManList.length === 0}
//                   >
//                     <option value="">Select Sales Man</option>
//                     {Array.isArray(salesManList) && salesManList.map(man => (
//                       <option key={man.id} value={man.id}>{man.name}</option>
//                     ))}
//                   </select>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Discount A (%)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     max="100"
//                     name="discountA"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.discountA}
//                     onChange={handleInputChange}
//                     placeholder="0-100"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Discount B (%)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     max="100"
//                     name="discountB"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.discountB}
//                     onChange={handleInputChange}
//                     placeholder="0-100"
//                   />
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Discount C (%)</label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     max="100"
//                     name="discountC"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.discountC}
//                     onChange={handleInputChange}
//                     placeholder="0-100"
//                   />
//                 </div>
//               </div>
//             </div>

//             {/* SECTION 4: NEW EXPENSE FIELDS - 4 fields per row + Summary */}
//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">
//                 Expense Management 
//                 <span className="ml-4 text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
//                   Total: ₨{getTotalExpenses().toFixed(2)}
//                 </span>
//               </h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Freight Cost</label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       name="freight_crt"
//                       className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
//                       value={formData.freight_crt}
//                       onChange={handleInputChange}
//                       placeholder="0.00"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Labour Cost</label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       name="labour_crt"
//                       className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
//                       value={formData.labour_crt}
//                       onChange={handleInputChange}
//                       placeholder="0.00"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Utility Expense</label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       name="bility_expense"
//                       className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
//                       value={formData.bility_expense}
//                       onChange={handleInputChange}
//                       placeholder="0.00"
//                     />
//                   </div>
//                 </div>
                
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Other Expense</label>
//                   <div className="relative">
//                     <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
//                     <input
//                       type="number"
//                       step="0.01"
//                       min="0"
//                       name="other_expense"
//                       className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm"
//                       value={formData.other_expense}
//                       onChange={handleInputChange}
//                       placeholder="0.00"
//                     />
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* SECTION 5: Status & Batch - Compact layout */}
//             <div className="mb-8">
//               <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Status & Configuration</h3>
              
//               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
//                 {/* Batch Number */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Batch Number</label>
//                   <input
//                     type="text"
//                     name="batch_no"
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
//                     value={formData.batch_no}
//                     onChange={handleInputChange}
//                     placeholder="Enter batch number"
//                   />
//                 </div>
                
//                 {/* Tax Status */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">Tax Status</label>
//                   <div className="space-y-2">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="taxStatus"
//                         className="h-4 w-4 text-green-600"
//                         checked={formData.taxStatus === true}
//                         onChange={() => handleRadioChange('taxStatus', true)}
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Tax Registered</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="taxStatus"
//                         className="h-4 w-4 text-red-600"
//                         checked={formData.taxStatus === false}
//                         onChange={() => handleRadioChange('taxStatus', false)}
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Unregistered</span>
//                     </label>
//                   </div>
//                 </div>

//                 {/* JV Balance */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">JV Balance</label>
//                   <div className="space-y-2">
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="isJvBalance"
//                         className="h-4 w-4 text-blue-600"
//                         checked={formData.isJvBalance === true}
//                         onChange={() => handleRadioChange('isJvBalance', true)}
//                       />
//                       <span className="ml-2 text-sm text-gray-700">Yes</span>
//                     </label>
//                     <label className="flex items-center">
//                       <input
//                         type="radio"
//                         name="isJvBalance"
//                         className="h-4 w-4 text-gray-600"
//                         checked={formData.isJvBalance === false}
//                         onChange={() => handleRadioChange('isJvBalance', false)}
//                       />
//                       <span className="ml-2 text-sm text-gray-700">No</span>
//                     </label>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Submit Button */}
//             <div className="pt-6 border-t border-gray-200">
//               <button
//                 type="submit"
//                 className={`w-full py-3 px-6 rounded-lg text-white font-medium ${
//                   submitting || hasApiErrors 
//                     ? 'bg-blue-400 cursor-not-allowed' 
//                     : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//                 disabled={submitting || hasApiErrors}
//               >
//                 {submitting 
//                   ? (isEditMode ? 'Updating...' : 'Creating...') 
//                   : (isEditMode ? 'Update COA' : 'Create COA')
//                 }
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }
