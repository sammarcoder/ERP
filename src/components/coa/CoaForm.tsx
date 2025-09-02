




// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { useRouter, useSearchParams } from 'next/navigation';

// // // Your existing interfaces
// // interface ControlHead1 {
// //   id: number;
// //   zHead1: string;
// // }

// // interface ControlHead2 {
// //   id: number;
// //   zHead2: string;
// //   zHead1Id: number;
// // }

// // interface CoaType {
// //   id: number;
// //   zType: string;
// // }

// // interface SalesMan {
// //   id: number;
// //   name: string;
// //   city: string;
// //   adress: string;
// //   telephone: string;
// // }

// // interface CoaFormData {
// //   id?: number;
// //   acName: string;
// //   ch1Id: number;
// //   ch2Id: number;
// //   coaTypeId: number;
// //   setupName: string;
// //   adress: string;
// //   city: string;
// //   personName: string;
// //   mobileNo: string;
// //   taxStatus: boolean;
// //   ntn: string;
// //   cnic: string;
// //   salesLimit: string;
// //   credit: string;
// //   creditDoys: string;
// //   salesMan: string;
// //   isJvBalance: boolean;
// // }

// // export default function CoaForm() {
// //   const router = useRouter();
// //   const searchParams = useSearchParams();
// //   const coaId = searchParams.get('id');
// //   const isEditMode = Boolean(coaId);

// //   // State for API data
// //   const [controlHead1List, setControlHead1List] = useState<ControlHead1[]>([]);
// //   const [controlHead2List, setControlHead2List] = useState<ControlHead2[]>([]);
// //   const [filteredControlHead2List, setFilteredControlHead2List] = useState<ControlHead2[]>([]);
// //   const [coaTypeList, setCoaTypeList] = useState<CoaType[]>([]);
// //   const [salesManList, setSalesManList] = useState<SalesMan[]>([]);
  
// //   // Loading states
// //   const [loading, setLoading] = useState({
// //     ch1: true,
// //     ch2: true,
// //     coaType: true,
// //     salesMan: true,
// //     coaData: isEditMode
// //   });
  
// //   // Form state
// //   const [formData, setFormData] = useState<CoaFormData>({
// //     acName: '',
// //     ch1Id: 0,
// //     ch2Id: 0,
// //     coaTypeId: 0,
// //     setupName: '',
// //     adress: '',
// //     city: '',
// //     personName: '',
// //     mobileNo: '',
// //     taxStatus: false,
// //     ntn: '',
// //     cnic: '',
// //     salesLimit: '',
// //     credit: '',
// //     creditDoys: '',
// //     salesMan: '',
// //     isJvBalance: false
// //   });
  
// //   // UI state
// //   const [submitting, setSubmitting] = useState(false);
// //   const [message, setMessage] = useState({ type: '', text: '' });
// //   const [apiErrors, setApiErrors] = useState<{[key: string]: string}>({});

// //   // Fetch all required data on component mount
// //   useEffect(() => {
// //     fetchControlHead1();
// //     fetchControlHead2();
// //     fetchCoaTypes();
// //     fetchSalesmen();
    
// //     if (isEditMode && coaId) {
// //       fetchCoaData(coaId);
// //     }
// //   }, [isEditMode, coaId]);

// //   // Filter Control Head 2 when Control Head 1 changes
// //   useEffect(() => {
// //     if (formData.ch1Id) {
// //       const filtered = controlHead2List.filter(ch2 => ch2.zHead1Id === Number(formData.ch1Id));
// //       setFilteredControlHead2List(filtered);
      
// //       // Reset ch2Id if it's not in the filtered list (but not during initial load in edit mode)
// //       if (!loading.coaData && !filtered.find(ch2 => ch2.id === formData.ch2Id)) {
// //         setFormData(prev => ({ ...prev, ch2Id: 0 }));
// //       }
// //     } else {
// //       setFilteredControlHead2List([]);
// //       if (!loading.coaData) {
// //         setFormData(prev => ({ ...prev, ch2Id: 0 }));
// //       }
// //     }
// //   }, [formData.ch1Id, controlHead2List, loading.coaData]);

// //   // Fetch COA data for editing
// //   const fetchCoaData = async (id: string) => {
// //     try {
// //       setLoading(prev => ({ ...prev, coaData: true }));
// //       setApiErrors(prev => ({ ...prev, coaData: '' }));
      
// //       console.log('Fetching COA data for editing, ID:', id);
// //       const response = await fetch(`http://${window.location.hostname}:5000/api/z-coa/get/${id}`);
      
// //       if (!response.ok) {
// //         throw new Error(`Failed to fetch COA data: ${response.status}`);
// //       }
      
// //       const data = await response.json();
// //       console.log('COA data for editing:', data);
      
// //       // Pre-populate form with existing data
// //       setFormData({
// //         id: data.id,
// //         acName: data.acName || '',
// //         ch1Id: data.ch1Id || 0,
// //         ch2Id: data.ch2Id || 0,
// //         coaTypeId: data.coaTypeId || 0,
// //         setupName: data.setupName || '',
// //         adress: data.adress || '',
// //         city: data.city || '',
// //         personName: data.personName || '',
// //         mobileNo: data.mobileNo || '',
// //         taxStatus: Boolean(data.taxStatus),
// //         ntn: data.ntn || '',
// //         cnic: data.cnic || '',
// //         salesLimit: data.salesLimit || '',
// //         credit: data.credit || '',
// //         creditDoys: data.creditDoys || '',
// //         salesMan: data.salesMan || '',
// //         isJvBalance: Boolean(data.isJvBalance)
// //       });
      
// //     } catch (error) {
// //       console.error('Error fetching COA data:', error);
// //       setApiErrors(prev => ({ 
// //         ...prev, 
// //         coaData: error instanceof Error ? error.message : 'Unknown error' 
// //       }));
// //       setMessage({
// //         type: 'error',
// //         text: 'Failed to load COA data for editing'
// //       });
// //     } finally {
// //       setLoading(prev => ({ ...prev, coaData: false }));
// //     }
// //   };

// //   // All your existing fetch functions (same as your original code)
// //   const fetchControlHead1 = async () => {
// //     try {
// //       setLoading(prev => ({ ...prev, ch1: true }));
// //       setApiErrors(prev => ({ ...prev, ch1: '' }));
      
// //       console.log('Fetching Control Head 1 data...');
// //       const response = await fetch(`http://${window.location.hostname}:5000/api/z-control-head1`);
      
// //       if (!response.ok) {
// //         throw new Error(`Failed to fetch Control Head 1 data: ${response.status}`);
// //       }
      
// //       const data = await response.json();
// //       console.log('Control Head 1 data:', data);
      
// //       setControlHead1List(Array.isArray(data) ? data : []);
      
// //     } catch (error) {
// //       console.error('Error fetching Control Head 1:', error);
// //       setApiErrors(prev => ({ 
// //         ...prev, 
// //         ch1: error instanceof Error ? error.message : 'Unknown error' 
// //       }));
// //       setControlHead1List([]);
// //     } finally {
// //       setLoading(prev => ({ ...prev, ch1: false }));
// //     }
// //   };

// //   const fetchControlHead2 = async () => {
// //     try {
// //       setLoading(prev => ({ ...prev, ch2: true }));
// //       setApiErrors(prev => ({ ...prev, ch2: '' }));
      
// //       console.log('Fetching Control Head 2 data...');
// //       const response = await fetch(`http://${window.location.hostname}:5000/api/z-control-head2/get`);
      
// //       if (!response.ok) {
// //         throw new Error(`Failed to fetch Control Head 2 data: ${response.status}`);
// //       }
      
// //       const text = await response.text();
// //       console.log('Control Head 2 response:', text);
      
// //       let data;
// //       try {
// //         data = text ? JSON.parse(text) : [];
// //       } catch (e) {
// //         console.error('JSON parse error:', e);
// //         throw new Error('Invalid JSON response from Control Head 2 API');
// //       }
      
// //       if (!Array.isArray(data)) {
// //         console.warn('Control Head 2 data is not an array:', data);
// //         if (data && typeof data === 'object') {
// //           const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
// //           if (possibleArrays.length > 0) {
// //             data = possibleArrays[0];
// //           } else {
// //             data = [data];
// //           }
// //         } else {
// //           data = [];
// //         }
// //       }
      
// //       console.log('Processed Control Head 2 data:', data);
// //       setControlHead2List(data);
      
// //     } catch (error) {
// //       console.error('Error fetching Control Head 2:', error);
// //       setApiErrors(prev => ({ 
// //         ...prev, 
// //         ch2: error instanceof Error ? error.message : 'Unknown error' 
// //       }));
// //       setControlHead2List([]);
// //     } finally {
// //       setLoading(prev => ({ ...prev, ch2: false }));
// //     }
// //   };

// //   const fetchCoaTypes = async () => {
// //     try {
// //       setLoading(prev => ({ ...prev, coaType: true }));
// //       setApiErrors(prev => ({ ...prev, coaType: '' }));
      
// //       console.log('Fetching COA Types data...');
// //       const response = await fetch(`http://${window.location.hostname}:5000/api/z-coa-type`);
      
// //       console.log('COA Types response status:', response.status);
      
// //       if (!response.ok) {
// //         throw new Error(`Failed to fetch COA Types data: ${response.status}`);
// //       }
      
// //       const text = await response.text();
// //       console.log('COA Types raw response:', text);
      
// //       let data;
// //       try {
// //         data = text ? JSON.parse(text) : [];
// //       } catch (e) {
// //         console.error('JSON parse error:', e);
// //         throw new Error('Invalid JSON response from COA Types API');
// //       }
      
// //       if (!Array.isArray(data)) {
// //         console.warn('COA Types data is not an array:', data);
// //         if (data && typeof data === 'object') {
// //           if (Array.isArray(data.data)) {
// //             data = data.data;
// //           } else if (data.coaTypes && Array.isArray(data.coaTypes)) {
// //             data = data.coaTypes;
// //           } else {
// //             const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
// //             if (possibleArrays.length > 0) {
// //               data = possibleArrays[0];
// //             } else {
// //               data = [data];
// //             }
// //           }
// //         } else {
// //           data = [];
// //         }
// //       }
      
// //       console.log('Processed COA Types data:', data);
// //       setCoaTypeList(data);
      
// //     } catch (error) {
// //       console.error('Error fetching COA Types:', error);
// //       setApiErrors(prev => ({ 
// //         ...prev, 
// //         coaType: error instanceof Error ? error.message : 'Unknown error' 
// //       }));
// //       setCoaTypeList([]);
// //     } finally {
// //       setLoading(prev => ({ ...prev, coaType: false }));
// //     }
// //   };

// //   const fetchSalesmen = async () => {
// //     try {
// //       setLoading(prev => ({ ...prev, salesMan: true }));
// //       setApiErrors(prev => ({ ...prev, salesMan: '' }));
      
// //       console.log('Fetching Salesmen data...');
// //       const response = await fetch(`http://${window.location.hostname}:5000/api/z-control/salesman`);
      
// //       if (!response.ok) {
// //         throw new Error(`Failed to fetch Salesmen data: ${response.status}`);
// //       }
      
// //       const text = await response.text();
// //       console.log('Salesmen raw response:', text);
      
// //       let rawData;
// //       try {
// //         rawData = text ? JSON.parse(text) : [];
// //       } catch (e) {
// //         console.error('JSON parse error:', e);
// //         throw new Error('Invalid JSON response from Salesmen API');
// //       }
      
// //       console.log("Salesmen API response object:", rawData);
      
// //       let salesmen: SalesMan[] = [];
      
// //       if (Array.isArray(rawData)) {
// //         salesmen = rawData;
// //       } else if (rawData && typeof rawData === 'object') {
// //         if (Array.isArray(rawData.data)) {
// //           salesmen = rawData.data;
// //         } else if (rawData.salesmen && Array.isArray(rawData.salesmen)) {
// //           salesmen = rawData.salesmen;
// //         } else {
// //           salesmen = [rawData];
// //         }
// //       }
      
// //       console.log('Processed salesmen data:', salesmen);
// //       setSalesManList(salesmen);
      
// //     } catch (error) {
// //       console.error('Error fetching Salesmen:', error);
// //       setApiErrors(prev => ({ 
// //         ...prev, 
// //         salesMan: error instanceof Error ? error.message : 'Unknown error' 
// //       }));
// //       setSalesManList([]);
// //     } finally {
// //       setLoading(prev => ({ ...prev, salesMan: false }));
// //     }
// //   };

// //   // Handle form input changes
// //   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
// //     const { name, value } = e.target;
// //     setFormData({
// //       ...formData,
// //       [name]: value
// //     });
// //   };

// //   // Handle radio button changes
// //   const handleRadioChange = (name: string, value: boolean) => {
// //     setFormData({
// //       ...formData,
// //       [name]: value
// //     });
// //   };

// //   // Handle form submission
// //   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
// //     e.preventDefault();
    
// //     // Basic validation
// //     if (!formData.acName.trim()) {
// //       setMessage({ type: 'error', text: 'Account Name is required' });
// //       return;
// //     }
    
// //     if (!formData.ch1Id) {
// //       setMessage({ type: 'error', text: 'Please select a Control Head 1' });
// //       return;
// //     }
    
// //     if (!formData.ch2Id) {
// //       setMessage({ type: 'error', text: 'Please select a Control Head 2' });
// //       return;
// //     }
    
// //     if (!formData.coaTypeId) {
// //       setMessage({ type: 'error', text: 'Please select a COA Type' });
// //       return;
// //     }
    
// //     try {
// //       setSubmitting(true);
// //       setMessage({ type: '', text: '' });
      
// //       console.log(`${isEditMode ? 'Updating' : 'Creating'} COA:`, formData);
      
// //       const url = isEditMode 
// //         ? `http://${window.location.hostname}:5000/api/z-coa/update/${coaId}`
// //         : `http://${window.location.hostname}:5000/api/z-coa/create`;
        
// //       const method = isEditMode ? 'PUT' : 'POST';
      
// //       const response = await fetch(url, {
// //         method,
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(formData)
// //       });
      
// //       if (!response.ok) {
// //         const errorData = await response.json();
// //         throw new Error(errorData.message || `Request failed with status ${response.status}`);
// //       }
      
// //       const responseData = await response.json();
// //       console.log('Server response:', responseData);
      
// //       setMessage({
// //         type: 'success',
// //         text: `COA ${isEditMode ? 'updated' : 'created'} successfully!`
// //       });
      
// //       // If creating, reset form. If updating, redirect to list
// //       if (!isEditMode) {
// //         setFormData({
// //           acName: '',
// //           ch1Id: 0,
// //           ch2Id: 0,
// //           coaTypeId: 0,
// //           setupName: '',
// //           adress: '',
// //           city: '',
// //           personName: '',
// //           mobileNo: '',
// //           taxStatus: false,
// //           ntn: '',
// //           cnic: '',
// //           salesLimit: '',
// //           credit: '',
// //           creditDoys: '',
// //           salesMan: '',
// //           isJvBalance: false
// //         });
// //         setFilteredControlHead2List([]);
// //       } else {
// //         // Redirect to list after update
// //         setTimeout(() => {
// //           router.push('/coa');
// //         }, 2000);
// //       }
      
// //     } catch (error: any) {
// //       console.error(`Error ${isEditMode ? 'updating' : 'creating'} COA:`, error);
// //       setMessage({
// //         type: 'error',
// //         text: error?.message || `Failed to ${isEditMode ? 'update' : 'create'} COA`
// //       });
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   // Determine if there are any API errors
// //   const hasApiErrors = Object.values(apiErrors).some(error => error !== '');

// //   // Check if all data is loaded
// //   const isLoading = loading.ch1 || loading.ch2 || loading.coaType || loading.salesMan || loading.coaData;

// //   return (
// //     <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
// //       {/* Header */}
// //       <div className="mb-8">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <h1 className="text-3xl font-bold text-gray-900 mb-2">
// //               {isEditMode ? 'Edit Chart of Account' : 'Create New Chart of Account'}
// //             </h1>
// //             <p className="text-gray-600">
// //               {isEditMode 
// //                 ? 'Update the account information below.' 
// //                 : 'Fill in the information below to create a new chart of account.'
// //               }
// //             </p>
// //           </div>
// //           <button
// //             onClick={() => router.push('/coa')}
// //             className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
// //           >
// //             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
// //             </svg>
// //             <span>Back to List</span>
// //           </button>
// //         </div>
// //       </div>
      
// //       {/* Display message */}
// //       {message.text && (
// //         <div className={`mb-6 p-4 rounded-lg border ${
// //           message.type === 'success' 
// //             ? 'bg-green-50 text-green-800 border-green-200' 
// //             : 'bg-red-50 text-red-800 border-red-200'
// //         }`}>
// //           <div className="flex items-center">
// //             {message.type === 'success' ? (
// //               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //             ) : (
// //               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
// //               </svg>
// //             )}
// //             {message.text}
// //           </div>
// //         </div>
// //       )}
      
// //       {/* Display API errors */}
// //       {hasApiErrors && (
// //         <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mb-6 rounded-r-lg">
// //           <h3 className="font-bold">Warning: Some data failed to load</h3>
// //           <ul className="list-disc ml-5 mt-2">
// //             {Object.entries(apiErrors).map(([key, error]) => 
// //               error ? <li key={key}>{key}: {error}</li> : null
// //             )}
// //           </ul>
// //           <div className="mt-3 flex flex-wrap gap-3">
// //             {apiErrors.ch1 && (
// //               <button onClick={fetchControlHead1} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
// //                 Retry Control Head 1
// //               </button>
// //             )}
// //             {apiErrors.ch2 && (
// //               <button onClick={fetchControlHead2} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
// //                 Retry Control Head 2
// //               </button>
// //             )}
// //             {apiErrors.coaType && (
// //               <button onClick={fetchCoaTypes} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
// //                 Retry COA Types
// //               </button>
// //             )}
// //             {apiErrors.salesMan && (
// //               <button onClick={fetchSalesmen} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
// //                 Retry Salesmen
// //               </button>
// //             )}
// //             {apiErrors.coaData && isEditMode && (
// //               <button onClick={() => fetchCoaData(coaId!)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
// //                 Retry COA Data
// //               </button>
// //             )}
// //           </div>
// //         </div>
// //       )}
      
// //       {/* Loading state */}
// //       {isLoading ? (
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
// //           <div className="flex justify-center items-center">
// //             <div className="text-center">
// //               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
// //               <p className="text-gray-600">
// //                 {isEditMode ? 'Loading data for editing...' : 'Loading data...'}
// //               </p>
// //             </div>
// //           </div>
// //         </div>
// //       ) : (
// //         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
// //           <form onSubmit={handleSubmit}>
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
// //               {/* Account Name */}
// //               <div className="md:col-span-2">
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Account Name *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="acName"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.acName}
// //                   onChange={handleInputChange}
// //                   disabled={submitting}
// //                   required
// //                   placeholder="Enter account name"
// //                 />
// //               </div>
              
// //               {/* Control Head 1 Dropdown */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Control Head 1 *
// //                 </label>
// //                 <select
// //                   name="ch1Id"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.ch1Id || ''}
// //                   onChange={handleInputChange}
// //                   disabled={submitting || controlHead1List.length === 0}
// //                   required
// //                 >
// //                   <option value="">Select Control Head 1</option>
// //                   {controlHead1List && controlHead1List.length > 0 ? 
// //                     controlHead1List.map(ch1 => (
// //                       <option key={ch1.id} value={ch1.id}>
// //                         {ch1.zHead1}
// //                       </option>
// //                     )) : 
// //                     <option value="" disabled>No data available</option>
// //                   }
// //                 </select>
// //                 {apiErrors.ch1 && (
// //                   <p className="mt-1 text-sm text-red-600">
// //                     {apiErrors.ch1}
// //                   </p>
// //                 )}
// //               </div>
              
// //               {/* Control Head 2 Dropdown */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Control Head 2 *
// //                 </label>
// //                 <select
// //                   name="ch2Id"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.ch2Id || ''}
// //                   onChange={handleInputChange}
// //                   disabled={submitting || !formData.ch1Id || filteredControlHead2List.length === 0}
// //                   required
// //                 >
// //                   <option value="">
// //                     {!formData.ch1Id 
// //                       ? 'Select Control Head 1 first' 
// //                       : 'Select Control Head 2'}
// //                   </option>
// //                   {filteredControlHead2List && filteredControlHead2List.length > 0 ? 
// //                     filteredControlHead2List.map(ch2 => (
// //                       <option key={ch2.id} value={ch2.id}>
// //                         {ch2.zHead2}
// //                       </option>
// //                     )) : 
// //                     (formData.ch1Id && <option value="" disabled>No Control Head 2 found for selected Control Head 1</option>)
// //                   }
// //                 </select>
// //                 {apiErrors.ch2 && (
// //                   <p className="mt-1 text-sm text-red-600">
// //                     {apiErrors.ch2}
// //                   </p>
// //                 )}
// //               </div>
              
// //               {/* COA Type Dropdown */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   COA Type *
// //                 </label>
// //                 <select
// //                   name="coaTypeId"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.coaTypeId || ''}
// //                   onChange={handleInputChange}
// //                   disabled={submitting || coaTypeList.length === 0}
// //                   required
// //                 >
// //                   <option value="">Select COA Type</option>
// //                   {coaTypeList && coaTypeList.length > 0 ? 
// //                     coaTypeList.map(type => (
// //                       <option key={type.id} value={type.id}>
// //                         {type.zType}
// //                       </option>
// //                     )) : 
// //                     <option value="" disabled>No data available</option>
// //                   }
// //                 </select>
// //                 {apiErrors.coaType && (
// //                   <p className="mt-1 text-sm text-red-600">
// //                     {apiErrors.coaType}
// //                   </p>
// //                 )}
// //               </div>
              
// //               {/* Setup Name */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Setup Name *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="setupName"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.setupName}
// //                   onChange={handleInputChange}
// //                   disabled={submitting}
// //                   required
// //                   placeholder="Enter setup name"
// //                 />
// //               </div>
              
// //               {/* Address */}
// //               <div className="md:col-span-2">
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Address *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="adress"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.adress}
// //                   onChange={handleInputChange}
// //                   disabled={submitting}
// //                   required
// //                   placeholder="Enter full address"
// //                 />
// //               </div>
              
// //               {/* City */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   City *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="city"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.city}
// //                   onChange={handleInputChange}
// //                   disabled={submitting}
// //                   required
// //                   placeholder="Enter city"
// //                 />
// //               </div>
              
// //               {/* Person Name */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Person Name *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="personName"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.personName}
// //                   onChange={handleInputChange}
// //                   disabled={submitting}
// //                   required
// //                   placeholder="Enter person name"
// //                 />
// //               </div>
              
// //               {/* Mobile Number */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Mobile Number *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="mobileNo"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.mobileNo}
// //                   onChange={handleInputChange}
// //                   disabled={submitting}
// //                   required
// //                   placeholder="Enter mobile number"
// //                 />
// //               </div>
              
// //               {/* NTN */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   NTN *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="ntn"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.ntn}
// //                   onChange={handleInputChange}
// //                   disabled={submitting}
// //                   required
// //                   placeholder="Enter NTN"
// //                 />
// //               </div>
              
// //               {/* CNIC */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   CNIC *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="cnic"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.cnic}
// //                   onChange={handleInputChange}
// //                   disabled={submitting}
// //                   required
// //                   placeholder="Enter CNIC"
// //                 />
// //               </div>
              
// //               {/* Sales Limit */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Sales Limit *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="salesLimit"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.salesLimit}
// //                   onChange={handleInputChange}
// //                   disabled={submitting}
// //                   required
// //                   placeholder="Enter sales limit"
// //                 />
// //               </div>
              
// //               {/* Credit */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Credit *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="credit"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.credit}
// //                   onChange={handleInputChange}
// //                   disabled={submitting}
// //                   required
// //                   placeholder="Enter credit amount"
// //                 />
// //               </div>
              
// //               {/* Credit Days */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Credit Days *
// //                 </label>
// //                 <input
// //                   type="text"
// //                   name="creditDoys"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.creditDoys}
// //                   onChange={handleInputChange}
// //                   disabled={submitting}
// //                   required
// //                   placeholder="Enter credit days"
// //                 />
// //               </div>
              
// //               {/* Sales Man Dropdown */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-2">
// //                   Sales Man *
// //                 </label>
// //                 <select
// //                   name="salesMan"
// //                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
// //                   value={formData.salesMan}
// //                   onChange={handleInputChange}
// //                   disabled={submitting || !Array.isArray(salesManList) || salesManList.length === 0}
// //                   required
// //                 >
// //                   <option value="">Select Sales Man</option>
// //                   {Array.isArray(salesManList) && salesManList.length > 0 ? 
// //                     salesManList.map(man => (
// //                       <option key={man.id} value={man.id}>
// //                         {man.name}
// //                       </option>
// //                     )) : 
// //                     <option value="" disabled>No salesmen available</option>
// //                   }
// //                 </select>
// //                 {apiErrors.salesMan && (
// //                   <p className="mt-1 text-sm text-red-600">
// //                     {apiErrors.salesMan}
// //                   </p>
// //                 )}
// //               </div>
              
// //               {/* Tax Status Radio Buttons */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-3">
// //                   Tax Status *
// //                 </label>
// //                 <div className="space-y-2">
// //                   <label className="inline-flex items-center">
// //                     <input
// //                       type="radio"
// //                       name="taxStatus"
// //                       className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
// //                       checked={formData.taxStatus === true}
// //                       onChange={() => handleRadioChange('taxStatus', true)}
// //                       disabled={submitting}
// //                     />
// //                     <span className="ml-2 text-sm text-gray-700">Tax Registered</span>
// //                   </label>
// //                   <br />
// //                   <label className="inline-flex items-center">
// //                     <input
// //                       type="radio"
// //                       name="taxStatus"
// //                       className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
// //                       checked={formData.taxStatus === false}
// //                       onChange={() => handleRadioChange('taxStatus', false)}
// //                       disabled={submitting}
// //                     />
// //                     <span className="ml-2 text-sm text-gray-700">Unregistered</span>
// //                   </label>
// //                 </div>
// //               </div>
              
// //               {/* JV Balance Radio Buttons */}
// //               <div>
// //                 <label className="block text-sm font-medium text-gray-700 mb-3">
// //                   JV Balance *
// //                 </label>
// //                 <div className="space-y-2">
// //                   <label className="inline-flex items-center">
// //                     <input
// //                       type="radio"
// //                       name="isJvBalance"
// //                       className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
// //                       checked={formData.isJvBalance === true}
// //                       onChange={() => handleRadioChange('isJvBalance', true)}
// //                       disabled={submitting}
// //                     />
// //                     <span className="ml-2 text-sm text-gray-700">Yes</span>
// //                   </label>
// //                   <br />
// //                   <label className="inline-flex items-center">
// //                     <input
// //                       type="radio"
// //                       name="isJvBalance"
// //                       className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
// //                       checked={formData.isJvBalance === false}
// //                       onChange={() => handleRadioChange('isJvBalance', false)}
// //                       disabled={submitting}
// //                     />
// //                     <span className="ml-2 text-sm text-gray-700">No</span>
// //                   </label>
// //                 </div>
// //               </div>
// //             </div>
            
// //             {/* Submit Button */}
// //             <div className="mt-8 pt-6 border-t border-gray-200">
// //               <div className="flex space-x-4">
// //                 <button
// //                   type="button"
// //                   onClick={() => router.push('/coa')}
// //                   className="flex-1 py-3 px-6 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200"
// //                   disabled={submitting}
// //                 >
// //                   Cancel
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   className={`flex-1 py-3 px-6 rounded-lg text-white font-medium transition-colors duration-200 ${
// //                     submitting || hasApiErrors 
// //                       ? 'bg-blue-400 cursor-not-allowed' 
// //                       : 'bg-blue-600 hover:bg-blue-700'
// //                   }`}
// //                   disabled={submitting || hasApiErrors}
// //                 >
// //                   {submitting 
// //                     ? (isEditMode ? 'Updating...' : 'Creating...') 
// //                     : (isEditMode ? 'Update COA' : 'Create COA')
// //                   }
// //                 </button>
// //               </div>
// //             </div>
// //           </form>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

























































// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';

// // Define interfaces for API responses
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
//   adress: string;
//   telephone: string;
// }

// // Form data interface
// interface CoaFormData {
//   id?: number;
//   acName: string;
//   ch1Id: number;
//   ch2Id: number;
//   coaTypeId: number;
//   setupName: string;
//   adress: string;
//   city: string;
//   personName: string;
//   mobileNo: string;
//   taxStatus: boolean;
//   ntn: string;
//   cnic: string;
//   salesLimit: string;
//   credit: string;
//   creditDoys: string;
//   salesMan: string;
//   isJvBalance: boolean;
// }

// export default function Page() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const coaId = searchParams.get('id'); // Get ID from URL params for edit mode
//   const isEditMode = Boolean(coaId); // Determine if we're in edit mode

//   // State for API data
//   const [controlHead1List, setControlHead1List] = useState<ControlHead1[]>([]);
//   const [controlHead2List, setControlHead2List] = useState<ControlHead2[]>([]);
//   const [filteredControlHead2List, setFilteredControlHead2List] = useState<ControlHead2[]>([]);
//   const [coaTypeList, setCoaTypeList] = useState<CoaType[]>([]);
//   const [salesManList, setSalesManList] = useState<SalesMan[]>([]);
  
//   // Loading states
//   const [loading, setLoading] = useState({
//     ch1: true,
//     ch2: true,
//     coaType: true,
//     salesMan: true,
//     coaData: isEditMode // Add loading state for COA data in edit mode
//   });
  
//   // Form state
//   const [formData, setFormData] = useState<CoaFormData>({
//     acName: '',
//     ch1Id: 0,
//     ch2Id: 0,
//     coaTypeId: 0,
//     setupName: '',
//     adress: '',
//     city: '',
//     personName: '',
//     mobileNo: '',
//     taxStatus: false,
//     ntn: '',
//     cnic: '',
//     salesLimit: '',
//     credit: '',
//     creditDoys: '',
//     salesMan: '',
//     isJvBalance: false
//   });
  
//   // UI state
//   const [submitting, setSubmitting] = useState(false);
//   const [message, setMessage] = useState({ type: '', text: '' });
//   const [apiErrors, setApiErrors] = useState<{[key: string]: string}>({});

//   // Fetch all required data on component mount
//   useEffect(() => {
//     fetchControlHead1();
//     fetchControlHead2();
//     fetchCoaTypes();
//     fetchSalesmen();
    
//     // If in edit mode, fetch the existing COA data
//     if (isEditMode && coaId) {
//       fetchCoaData(coaId);
//     }
//   }, [isEditMode, coaId]);

//   // Filter Control Head 2 when Control Head 1 changes
//   useEffect(() => {
//     if (formData.ch1Id) {
//       const filtered = controlHead2List.filter(ch2 => ch2.zHead1Id === Number(formData.ch1Id));
//       setFilteredControlHead2List(filtered);
      
//       // Reset ch2Id if it's not in the filtered list (but not during initial data load in edit mode)
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

//   // NEW: Fetch existing COA data for editing
//   const fetchCoaData = async (id: string) => {
//     try {
//       setLoading(prev => ({ ...prev, coaData: true }));
//       setApiErrors(prev => ({ ...prev, coaData: '' }));
      
//       console.log('Fetching COA data for editing, ID:', id);
//       const response = await fetch(`http://${window.location.hostname}:5000/api/z-coa/get/${id}`);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch COA data: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('COA data for editing:', data);
      
//       // Pre-populate form with existing data
//       setFormData({
//         id: data.id,
//         acName: data.acName || '',
//         ch1Id: data.ch1Id || 0,
//         ch2Id: data.ch2Id || 0,
//         coaTypeId: data.coaTypeId || 0,
//         setupName: data.setupName || '',
//         adress: data.adress || '',
//         city: data.city || '',
//         personName: data.personName || '',
//         mobileNo: data.mobileNo || '',
//         taxStatus: Boolean(data.taxStatus),
//         ntn: data.ntn || '',
//         cnic: data.cnic || '',
//         salesLimit: data.salesLimit || '',
//         credit: data.credit || '',
//         creditDoys: data.creditDoys || '',
//         salesMan: data.salesMan || '',
//         isJvBalance: Boolean(data.isJvBalance)
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

//   // Fetch Control Head 1 data
//   const fetchControlHead1 = async () => {
//     try {
//       setLoading(prev => ({ ...prev, ch1: true }));
//       setApiErrors(prev => ({ ...prev, ch1: '' }));
      
//       console.log('Fetching Control Head 1 data...');
//       const response = await fetch(`http://${window.location.hostname}:5000/api/z-control-head1`);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch Control Head 1 data: ${response.status}`);
//       }
      
//       const data = await response.json();
//       console.log('Control Head 1 data:', data);
      
//       setControlHead1List(Array.isArray(data) ? data : []);
      
//     } catch (error) {
//       console.error('Error fetching Control Head 1:', error);
//       setApiErrors(prev => ({ 
//         ...prev, 
//         ch1: error instanceof Error ? error.message : 'Unknown error' 
//       }));
//       setControlHead1List([]);
//     } finally {
//       setLoading(prev => ({ ...prev, ch1: false }));
//     }
//   };

//   // Fetch Control Head 2 data
//   const fetchControlHead2 = async () => {
//     try {
//       setLoading(prev => ({ ...prev, ch2: true }));
//       setApiErrors(prev => ({ ...prev, ch2: '' }));
      
//       console.log('Fetching Control Head 2 data...');
//       const response = await fetch(`http://${window.location.hostname}:5000/api/z-control-head2/get`);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch Control Head 2 data: ${response.status}`);
//       }
      
//       const text = await response.text();
//       console.log('Control Head 2 response:', text);
      
//       let data;
//       try {
//         data = text ? JSON.parse(text) : [];
//       } catch (e) {
//         console.error('JSON parse error:', e);
//         throw new Error('Invalid JSON response from Control Head 2 API');
//       }
      
//       if (!Array.isArray(data)) {
//         console.warn('Control Head 2 data is not an array:', data);
//         if (data && typeof data === 'object') {
//           const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
//           if (possibleArrays.length > 0) {
//             data = possibleArrays[0];
//           } else {
//             data = [data];
//           }
//         } else {
//           data = [];
//         }
//       }
      
//       console.log('Processed Control Head 2 data:', data);
//       setControlHead2List(data);
      
//     } catch (error) {
//       console.error('Error fetching Control Head 2:', error);
//       setApiErrors(prev => ({ 
//         ...prev, 
//         ch2: error instanceof Error ? error.message : 'Unknown error' 
//       }));
//       setControlHead2List([]);
//     } finally {
//       setLoading(prev => ({ ...prev, ch2: false }));
//     }
//   };

//   // Fetch COA Types
//   const fetchCoaTypes = async () => {
//     try {
//       setLoading(prev => ({ ...prev, coaType: true }));
//       setApiErrors(prev => ({ ...prev, coaType: '' }));
      
//       console.log('Fetching COA Types data...');
//       const response = await fetch(`http://${window.location.hostname}:5000/api/z-coa-type`);
      
//       console.log('COA Types response status:', response.status);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch COA Types data: ${response.status}`);
//       }
      
//       const text = await response.text();
//       console.log('COA Types raw response:', text);
      
//       let data;
//       try {
//         data = text ? JSON.parse(text) : [];
//       } catch (e) {
//         console.error('JSON parse error:', e);
//         throw new Error('Invalid JSON response from COA Types API');
//       }
      
//       if (!Array.isArray(data)) {
//         console.warn('COA Types data is not an array:', data);
//         if (data && typeof data === 'object') {
//           if (Array.isArray(data.data)) {
//             data = data.data;
//           } else if (data.coaTypes && Array.isArray(data.coaTypes)) {
//             data = data.coaTypes;
//           } else {
//             const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
//             if (possibleArrays.length > 0) {
//               data = possibleArrays[0];
//             } else {
//               data = [data];
//             }
//           }
//         } else {
//           data = [];
//         }
//       }
      
//       console.log('Processed COA Types data:', data);
//       setCoaTypeList(data);
      
//     } catch (error) {
//       console.error('Error fetching COA Types:', error);
//       setApiErrors(prev => ({ 
//         ...prev, 
//         coaType: error instanceof Error ? error.message : 'Unknown error' 
//       }));
//       setCoaTypeList([]);
//     } finally {
//       setLoading(prev => ({ ...prev, coaType: false }));
//     }
//   };

//   // Fetch Salesmen
//   const fetchSalesmen = async () => {
//     try {
//       setLoading(prev => ({ ...prev, salesMan: true }));
//       setApiErrors(prev => ({ ...prev, salesMan: '' }));
      
//       console.log('Fetching Salesmen data...');
//       const response = await fetch(`http://${window.location.hostname}:5000/api/z-control/salesman`);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch Salesmen data: ${response.status}`);
//       }
      
//       const text = await response.text();
//       console.log('Salesmen raw response:', text);
      
//       let rawData;
//       try {
//         rawData = text ? JSON.parse(text) : [];
//       } catch (e) {
//         console.error('JSON parse error:', e);
//         throw new Error('Invalid JSON response from Salesmen API');
//       }
      
//       console.log("Salesmen API response object:", rawData);
      
//       let salesmen: SalesMan[] = [];
      
//       if (Array.isArray(rawData)) {
//         salesmen = rawData;
//       } else if (rawData && typeof rawData === 'object') {
//         if (Array.isArray(rawData.data)) {
//           salesmen = rawData.data;
//         } else if (rawData.salesmen && Array.isArray(rawData.salesmen)) {
//           salesmen = rawData.salesmen;
//         } else {
//           salesmen = [rawData];
//         }
//       }
      
//       console.log('Processed salesmen data:', salesmen);
//       setSalesManList(salesmen);
      
//     } catch (error) {
//       console.error('Error fetching Salesmen:', error);
//       setApiErrors(prev => ({ 
//         ...prev, 
//         salesMan: error instanceof Error ? error.message : 'Unknown error' 
//       }));
//       setSalesManList([]);
//     } finally {
//       setLoading(prev => ({ ...prev, salesMan: false }));
//     }
//   };

//   // Handle form input changes
//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
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

//   // UPDATED: Handle form submission for both create and update
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
    
//     try {
//       setSubmitting(true);
//       setMessage({ type: '', text: '' });
      
//       console.log(`${isEditMode ? 'Updating' : 'Creating'} COA:`, formData);
      
//       const url = isEditMode 
//         ? `http://${window.location.hostname}:5000/api/z-coa/update/${coaId}`
//         : `http://${window.location.hostname}:5000/api/z-coa/create`;
        
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
//       console.log('Server response:', responseData);
      
//       setMessage({
//         type: 'success',
//         text: `COA ${isEditMode ? 'updated' : 'created'} successfully!`
//       });
      
//       // If creating, reset form. If updating, optionally redirect to list
//       if (!isEditMode) {
//         setFormData({
//           acName: '',
//           ch1Id: 0,
//           ch2Id: 0,
//           coaTypeId: 0,
//           setupName: '',
//           adress: '',
//           city: '',
//           personName: '',
//           mobileNo: '',
//           taxStatus: false,
//           ntn: '',
//           cnic: '',
//           salesLimit: '',
//           credit: '',
//           creditDoys: '',
//           salesMan: '',
//           isJvBalance: false
//         });
//         setFilteredControlHead2List([]);
//       } else {
//         // Optionally redirect to list after successful update
//         setTimeout(() => {
//           router.push('/coa/list'); // Adjust this route as needed
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

//   // NEW: Handle delete operation
//   const handleDelete = async () => {
//     if (!isEditMode || !coaId) return;
    
//     const confirmed = window.confirm('Are you sure you want to delete this COA? This action cannot be undone.');
//     if (!confirmed) return;
    
//     try {
//       setMessage({ type: '', text: '' });
      
//       console.log('Deleting COA with ID:', coaId);
      
//       const response = await fetch(`http://${window.location.hostname}:5000/api/z-coa/delete/${coaId}`, {
//         method: 'DELETE',
//       });
      
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || `Delete request failed with status ${response.status}`);
//       }
      
//       const responseData = await response.json();
//       console.log('Delete response:', responseData);
      
//       setMessage({
//         type: 'success',
//         text: 'COA deleted successfully!'
//       });
      
//       // Redirect to list page after successful delete
//       setTimeout(() => {
//         router.push('/coa/list'); // Adjust this route as needed
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

//   // Check if all data is loaded
//   const isLoading = loading.ch1 || loading.ch2 || loading.coaType || loading.salesMan || loading.coaData;

//   return (
//     <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
//       {/* Enhanced Header */}
//       <div className="mb-8">
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">
//               {isEditMode ? 'Edit Chart of Account' : 'Create Chart of Account'}
//             </h1>
//             <p className="text-gray-600">
//               {isEditMode 
//                 ? 'Update the account information below.' 
//                 : 'Fill in the information below to create a new chart of account.'
//               }
//             </p>
//           </div>
//           <div className="flex space-x-3">
//             <button
//               onClick={() => router.push('/coa/list')}
//               className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
//               </svg>
//               <span>View All Accounts</span>
//             </button>
//             {isEditMode && (
//               <button
//                 onClick={handleDelete}
//                 className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
//               >
//                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//                 </svg>
//                 <span>Delete</span>
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
      
//       {/* Display message */}
//       {message.text && (
//         <div className={`mb-6 p-4 rounded-lg border ${
//           message.type === 'success' 
//             ? 'bg-green-50 text-green-800 border-green-200' 
//             : 'bg-red-50 text-red-800 border-red-200'
//         }`}>
//           <div className="flex items-center">
//             {message.type === 'success' ? (
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             ) : (
//               <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//               </svg>
//             )}
//             {message.text}
//           </div>
//         </div>
//       )}
      
//       {/* Display API errors */}
//       {hasApiErrors && (
//         <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mb-6 rounded-r-lg">
//           <h3 className="font-bold">Warning: Some data failed to load</h3>
//           <ul className="list-disc ml-5 mt-2">
//             {Object.entries(apiErrors).map(([key, error]) => 
//               error ? <li key={key}>{key}: {error}</li> : null
//             )}
//           </ul>
//           <div className="mt-3 flex flex-wrap gap-3">
//             {apiErrors.ch1 && (
//               <button onClick={fetchControlHead1} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
//                 Retry Control Head 1
//               </button>
//             )}
//             {apiErrors.ch2 && (
//               <button onClick={fetchControlHead2} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
//                 Retry Control Head 2
//               </button>
//             )}
//             {apiErrors.coaType && (
//               <button onClick={fetchCoaTypes} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
//                 Retry COA Types
//               </button>
//             )}
//             {apiErrors.salesMan && (
//               <button onClick={fetchSalesmen} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
//                 Retry Salesmen
//               </button>
//             )}
//             {apiErrors.coaData && isEditMode && (
//               <button onClick={() => fetchCoaData(coaId!)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
//                 Retry COA Data
//               </button>
//             )}
//           </div>
//         </div>
//       )}
      
//       {/* Loading state */}
//       {isLoading ? (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
//           <div className="flex justify-center items-center">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
//               <p className="text-gray-600">
//                 {isEditMode ? 'Loading data for editing...' : 'Loading data...'}
//               </p>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {/* Account Name */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Account Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="acName"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.acName}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                   placeholder="Enter account name"
//                 />
//               </div>
              
//               {/* Control Head 1 Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Control Head 1 *
//                 </label>
//                 <select
//                   name="ch1Id"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.ch1Id || ''}
//                   onChange={handleInputChange}
//                   disabled={submitting || controlHead1List.length === 0}
//                   required
//                 >
//                   <option value="">Select Control Head 1</option>
//                   {controlHead1List && controlHead1List.length > 0 ? 
//                     controlHead1List.map(ch1 => (
//                       <option key={ch1.id} value={ch1.id}>
//                         {ch1.zHead1}
//                       </option>
//                     )) : 
//                     <option value="" disabled>No data available</option>
//                   }
//                 </select>
//                 {apiErrors.ch1 && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {apiErrors.ch1}
//                   </p>
//                 )}
//               </div>
              
//               {/* Control Head 2 Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Control Head 2 *
//                 </label>
//                 <select
//                   name="ch2Id"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.ch2Id || ''}
//                   onChange={handleInputChange}
//                   disabled={submitting || !formData.ch1Id || filteredControlHead2List.length === 0}
//                   required
//                 >
//                   <option value="">
//                     {!formData.ch1Id 
//                       ? 'Select Control Head 1 first' 
//                       : 'Select Control Head 2'}
//                   </option>
//                   {filteredControlHead2List && filteredControlHead2List.length > 0 ? 
//                     filteredControlHead2List.map(ch2 => (
//                       <option key={ch2.id} value={ch2.id}>
//                         {ch2.zHead2}
//                       </option>
//                     )) : 
//                     (formData.ch1Id && <option value="" disabled>No Control Head 2 found for selected Control Head 1</option>)
//                   }
//                 </select>
//                 {apiErrors.ch2 && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {apiErrors.ch2}
//                   </p>
//                 )}
//               </div>
              
//               {/* COA Type Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   COA Type *
//                 </label>
//                 <select
//                   name="coaTypeId"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.coaTypeId || ''}
//                   onChange={handleInputChange}
//                   disabled={submitting || coaTypeList.length === 0}
//                   required
//                 >
//                   <option value="">Select COA Type</option>
//                   {coaTypeList && coaTypeList.length > 0 ? 
//                     coaTypeList.map(type => (
//                       <option key={type.id} value={type.id}>
//                         {type.zType}
//                       </option>
//                     )) : 
//                     <option value="" disabled>No data available</option>
//                   }
//                 </select>
//                 {apiErrors.coaType && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {apiErrors.coaType}
//                   </p>
//                 )}
//               </div>
              
//               {/* Setup Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Setup Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="setupName"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.setupName}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                   placeholder="Enter setup name"
//                 />
//               </div>
              
//               {/* Address */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Address *
//                 </label>
//                 <input
//                   type="text"
//                   name="adress"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.adress}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                   placeholder="Enter full address"
//                 />
//               </div>
              
//               {/* City */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   City *
//                 </label>
//                 <input
//                   type="text"
//                   name="city"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                   placeholder="Enter city"
//                 />
//               </div>
              
//               {/* Person Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Person Name *
//                 </label>
//                 <input
//                   type="text"
//                   name="personName"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.personName}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                   placeholder="Enter person name"
//                 />
//               </div>
              
//               {/* Mobile Number */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Mobile Number *
//                 </label>
//                 <input
//                   type="text"
//                   name="mobileNo"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.mobileNo}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                   placeholder="Enter mobile number"
//                 />
//               </div>
              
//               {/* NTN */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   NTN *
//                 </label>
//                 <input
//                   type="text"
//                   name="ntn"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.ntn}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                   placeholder="Enter NTN"
//                 />
//               </div>
              
//               {/* CNIC */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   CNIC *
//                 </label>
//                 <input
//                   type="text"
//                   name="cnic"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.cnic}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                   placeholder="Enter CNIC"
//                 />
//               </div>
              
//               {/* Sales Limit */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Sales Limit *
//                 </label>
//                 <input
//                   type="text"
//                   name="salesLimit"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.salesLimit}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                   placeholder="Enter sales limit"
//                 />
//               </div>
              
//               {/* Credit */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Credit *
//                 </label>
//                 <input
//                   type="text"
//                   name="credit"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.credit}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                   placeholder="Enter credit amount"
//                 />
//               </div>
              
//               {/* Credit Days */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Credit Days *
//                 </label>
//                 <input
//                   type="text"
//                   name="creditDoys"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.creditDoys}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                   placeholder="Enter credit days"
//                 />
//               </div>
              
//               {/* Sales Man Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Sales Man *
//                 </label>
//                 <select
//                   name="salesMan"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.salesMan}
//                   onChange={handleInputChange}
//                   disabled={submitting || !Array.isArray(salesManList) || salesManList.length === 0}
//                   required
//                 >
//                   <option value="">Select Sales Man</option>
//                   {Array.isArray(salesManList) && salesManList.length > 0 ? 
//                     salesManList.map(man => (
//                       <option key={man.id} value={man.id}>
//                         {man.name}
//                       </option>
//                     )) : 
//                     <option value="" disabled>No salesmen available</option>
//                   }
//                 </select>
//                 {apiErrors.salesMan && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {apiErrors.salesMan}
//                   </p>
//                 )}
//               </div>
              
//               {/* Tax Status Radio Buttons */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   Tax Status *
//                 </label>
//                 <div className="space-y-2">
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="taxStatus"
//                       className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                       checked={formData.taxStatus === true}
//                       onChange={() => handleRadioChange('taxStatus', true)}
//                       disabled={submitting}
//                     />
//                     <span className="ml-2 text-sm text-gray-700">Tax Registered</span>
//                   </label>
//                   <br />
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="taxStatus"
//                       className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                       checked={formData.taxStatus === false}
//                       onChange={() => handleRadioChange('taxStatus', false)}
//                       disabled={submitting}
//                     />
//                     <span className="ml-2 text-sm text-gray-700">Unregistered</span>
//                   </label>
//                 </div>
//               </div>
              
//               {/* JV Balance Radio Buttons */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">
//                   JV Balance *
//                 </label>
//                 <div className="space-y-2">
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="isJvBalance"
//                       className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                       checked={formData.isJvBalance === true}
//                       onChange={() => handleRadioChange('isJvBalance', true)}
//                       disabled={submitting}
//                     />
//                     <span className="ml-2 text-sm text-gray-700">Yes</span>
//                   </label>
//                   <br />
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="isJvBalance"
//                       className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
//                       checked={formData.isJvBalance === false}
//                       onChange={() => handleRadioChange('isJvBalance', false)}
//                       disabled={submitting}
//                     />
//                     <span className="ml-2 text-sm text-gray-700">No</span>
//                   </label>
//                 </div>
//               </div>
//             </div>
            
//             {/* Submit Button */}
//             <div className="mt-8 pt-6 border-t border-gray-200">
//               <button
//             //   onClick={}
//                 type="submit"
//                 className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors duration-200 ${
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


































































'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Define interfaces for API responses
interface ControlHead1 {
  id: number;
  zHead1: string;
}

interface ControlHead2 {
  id: number;
  zHead2: string;
  zHead1Id: number;
}

interface CoaType {
  id: number;
  zType: string;
}

interface SalesMan {
  id: number;
  name: string;
  city: string;
  adress: string;
  telephone: string;
}

// Updated Form data interface with discount fields
interface CoaFormData {
  id?: number;
  acName: string;
  ch1Id: number;
  ch2Id: number;
  coaTypeId: number;
  setupName: string;
  adress: string;
  city: string;
  personName: string;
  mobileNo: string;
  taxStatus: boolean;
  ntn: string;
  cnic: string;
  salesLimit: string;
  credit: string;
  creditDoys: string;
  salesMan: string;
  isJvBalance: boolean;
  discountA: number; // NEW
  discountB: number; // NEW
  discountC: number; // NEW
}

export default function CoaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const coaId = searchParams.get('id'); // Get ID from URL params for edit mode
  const isEditMode = Boolean(coaId); // Determine if we're in edit mode

  // State for API data
  const [controlHead1List, setControlHead1List] = useState<ControlHead1[]>([]);
  const [controlHead2List, setControlHead2List] = useState<ControlHead2[]>([]);
  const [filteredControlHead2List, setFilteredControlHead2List] = useState<ControlHead2[]>([]);
  const [coaTypeList, setCoaTypeList] = useState<CoaType[]>([]);
  const [salesManList, setSalesManList] = useState<SalesMan[]>([]);
  
  // Loading states
  const [loading, setLoading] = useState({
    ch1: true,
    ch2: true,
    coaType: true,
    salesMan: true,
    coaData: isEditMode // Add loading state for COA data in edit mode
  });
  
  // Updated Form state with discount fields
  const [formData, setFormData] = useState<CoaFormData>({
    acName: '',
    ch1Id: 0,
    ch2Id: 0,
    coaTypeId: 0,
    setupName: '',
    adress: '',
    city: '',
    personName: '',
    mobileNo: '',
    taxStatus: false,
    ntn: '',
    cnic: '',
    salesLimit: '',
    credit: '',
    creditDoys: '',
    salesMan: '',
    isJvBalance: false,
    discountA: 0, // NEW
    discountB: 0, // NEW
    discountC: 0  // NEW
  });
  
  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [apiErrors, setApiErrors] = useState<{[key: string]: string}>({});

  // Fetch all required data on component mount
  useEffect(() => {
    fetchControlHead1();
    fetchControlHead2();
    fetchCoaTypes();
    fetchSalesmen();
    
    // If in edit mode, fetch the existing COA data
    if (isEditMode && coaId) {
      fetchCoaData(coaId);
    }
  }, [isEditMode, coaId]);

  // Filter Control Head 2 when Control Head 1 changes
  useEffect(() => {
    if (formData.ch1Id) {
      const filtered = controlHead2List.filter(ch2 => ch2.zHead1Id === Number(formData.ch1Id));
      setFilteredControlHead2List(filtered);
      
      // Reset ch2Id if it's not in the filtered list (but not during initial data load in edit mode)
      if (!loading.coaData && !filtered.find(ch2 => ch2.id === formData.ch2Id)) {
        setFormData(prev => ({ ...prev, ch2Id: 0 }));
      }
    } else {
      setFilteredControlHead2List([]);
      if (!loading.coaData) {
        setFormData(prev => ({ ...prev, ch2Id: 0 }));
      }
    }
  }, [formData.ch1Id, controlHead2List, loading.coaData]);

  // Updated: Fetch existing COA data for editing
  const fetchCoaData = async (id: string) => {
    try {
      setLoading(prev => ({ ...prev, coaData: true }));
      setApiErrors(prev => ({ ...prev, coaData: '' }));
      
      console.log('Fetching COA data for editing, ID:', id);
      const response = await fetch(`http://${window.location.hostname}:5000/api/z-coa/get/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch COA data: ${response.status}`);
      }
      
      const result = await response.json();
      const data = result.success ? result.data : result;
      console.log('COA data for editing:', data);
      
      // Pre-populate form with existing data including discount fields
      setFormData({
        id: data.id,
        acName: data.acName || '',
        ch1Id: data.ch1Id || 0,
        ch2Id: data.ch2Id || 0,
        coaTypeId: data.coaTypeId || 0,
        setupName: data.setupName || '',
        adress: data.adress || '',
        city: data.city || '',
        personName: data.personName || '',
        mobileNo: data.mobileNo || '',
        taxStatus: Boolean(data.taxStatus),
        ntn: data.ntn || '',
        cnic: data.cnic || '',
        salesLimit: data.salesLimit || '',
        credit: data.credit || '',
        creditDoys: data.creditDoys || '',
        salesMan: data.salesMan || '',
        isJvBalance: Boolean(data.isJvBalance),
        discountA: parseFloat(data.discountA) || 0, // NEW
        discountB: parseFloat(data.discountB) || 0, // NEW
        discountC: parseFloat(data.discountC) || 0  // NEW
      });
      
    } catch (error) {
      console.error('Error fetching COA data:', error);
      setApiErrors(prev => ({ 
        ...prev, 
        coaData: error instanceof Error ? error.message : 'Unknown error' 
      }));
      setMessage({
        type: 'error',
        text: 'Failed to load COA data for editing'
      });
    } finally {
      setLoading(prev => ({ ...prev, coaData: false }));
    }
  };

  // All your existing fetch functions remain the same
  const fetchControlHead1 = async () => {
    try {
      setLoading(prev => ({ ...prev, ch1: true }));
      setApiErrors(prev => ({ ...prev, ch1: '' }));
      
      console.log('Fetching Control Head 1 data...');
      const response = await fetch(`http://${window.location.hostname}:5000/api/z-control-head1`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Control Head 1 data: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Control Head 1 data:', data);
      
      setControlHead1List(Array.isArray(data) ? data : []);
      
    } catch (error) {
      console.error('Error fetching Control Head 1:', error);
      setApiErrors(prev => ({ 
        ...prev, 
        ch1: error instanceof Error ? error.message : 'Unknown error' 
      }));
      setControlHead1List([]);
    } finally {
      setLoading(prev => ({ ...prev, ch1: false }));
    }
  };

  const fetchControlHead2 = async () => {
    try {
      setLoading(prev => ({ ...prev, ch2: true }));
      setApiErrors(prev => ({ ...prev, ch2: '' }));
      
      console.log('Fetching Control Head 2 data...');
      const response = await fetch(`http://${window.location.hostname}:5000/api/z-control-head2/get`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Control Head 2 data: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('Control Head 2 response:', text);
      
      let data;
      try {
        data = text ? JSON.parse(text) : [];
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Invalid JSON response from Control Head 2 API');
      }
      
      if (!Array.isArray(data)) {
        console.warn('Control Head 2 data is not an array:', data);
        if (data && typeof data === 'object') {
          const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
          if (possibleArrays.length > 0) {
            data = possibleArrays[0];
          } else {
            data = [data];
          }
        } else {
          data = [];
        }
      }
      
      console.log('Processed Control Head 2 data:', data);
      setControlHead2List(data);
      
    } catch (error) {
      console.error('Error fetching Control Head 2:', error);
      setApiErrors(prev => ({ 
        ...prev, 
        ch2: error instanceof Error ? error.message : 'Unknown error' 
      }));
      setControlHead2List([]);
    } finally {
      setLoading(prev => ({ ...prev, ch2: false }));
    }
  };

  const fetchCoaTypes = async () => {
    try {
      setLoading(prev => ({ ...prev, coaType: true }));
      setApiErrors(prev => ({ ...prev, coaType: '' }));
      
      console.log('Fetching COA Types data...');
      const response = await fetch(`http://${window.location.hostname}:5000/api/z-coa-type`);
      
      console.log('COA Types response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch COA Types data: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('COA Types raw response:', text);
      
      let data;
      try {
        data = text ? JSON.parse(text) : [];
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Invalid JSON response from COA Types API');
      }
      
      if (!Array.isArray(data)) {
        console.warn('COA Types data is not an array:', data);
        if (data && typeof data === 'object') {
          if (Array.isArray(data.data)) {
            data = data.data;
          } else if (data.coaTypes && Array.isArray(data.coaTypes)) {
            data = data.coaTypes;
          } else {
            const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
            if (possibleArrays.length > 0) {
              data = possibleArrays[0];
            } else {
              data = [data];
            }
          }
        } else {
          data = [];
        }
      }
      
      console.log('Processed COA Types data:', data);
      setCoaTypeList(data);
      
    } catch (error) {
      console.error('Error fetching COA Types:', error);
      setApiErrors(prev => ({ 
        ...prev, 
        coaType: error instanceof Error ? error.message : 'Unknown error' 
      }));
      setCoaTypeList([]);
    } finally {
      setLoading(prev => ({ ...prev, coaType: false }));
    }
  };

  const fetchSalesmen = async () => {
    try {
      setLoading(prev => ({ ...prev, salesMan: true }));
      setApiErrors(prev => ({ ...prev, salesMan: '' }));
      
      console.log('Fetching Salesmen data...');
      const response = await fetch(`http://${window.location.hostname}:5000/api/z-control/salesman`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch Salesmen data: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('Salesmen raw response:', text);
      
      let rawData;
      try {
        rawData = text ? JSON.parse(text) : [];
      } catch (e) {
        console.error('JSON parse error:', e);
        throw new Error('Invalid JSON response from Salesmen API');
      }
      
      console.log("Salesmen API response object:", rawData);
      
      let salesmen: SalesMan[] = [];
      
      if (Array.isArray(rawData)) {
        salesmen = rawData;
      } else if (rawData && typeof rawData === 'object') {
        if (Array.isArray(rawData.data)) {
          salesmen = rawData.data;
        } else if (rawData.salesmen && Array.isArray(rawData.salesmen)) {
          salesmen = rawData.salesmen;
        } else {
          salesmen = [rawData];
        }
      }
      
      console.log('Processed salesmen data:', salesmen);
      setSalesManList(salesmen);
      
    } catch (error) {
      console.error('Error fetching Salesmen:', error);
      setApiErrors(prev => ({ 
        ...prev, 
        salesMan: error instanceof Error ? error.message : 'Unknown error' 
      }));
      setSalesManList([]);
    } finally {
      setLoading(prev => ({ ...prev, salesMan: false }));
    }
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Special handling for number inputs
    if (['discountA', 'discountB', 'discountC'].includes(name)) {
      const numericValue = parseFloat(value) || 0;
      setFormData({
        ...formData,
        [name]: numericValue
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle radio button changes
  const handleRadioChange = (name: string, value: boolean) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission for both create and update
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.acName.trim()) {
      setMessage({ type: 'error', text: 'Account Name is required' });
      return;
    }
    
    if (!formData.ch1Id) {
      setMessage({ type: 'error', text: 'Please select a Control Head 1' });
      return;
    }
    
    if (!formData.ch2Id) {
      setMessage({ type: 'error', text: 'Please select a Control Head 2' });
      return;
    }
    
    if (!formData.coaTypeId) {
      setMessage({ type: 'error', text: 'Please select a COA Type' });
      return;
    }

    // Validate discount percentages
    if (formData.discountA < 0 || formData.discountA > 100) {
      setMessage({ type: 'error', text: 'Discount A must be between 0 and 100' });
      return;
    }
    
    if (formData.discountB < 0 || formData.discountB > 100) {
      setMessage({ type: 'error', text: 'Discount B must be between 0 and 100' });
      return;
    }
    
    if (formData.discountC < 0 || formData.discountC > 100) {
      setMessage({ type: 'error', text: 'Discount C must be between 0 and 100' });
      return;
    }
    
    try {
      setSubmitting(true);
      setMessage({ type: '', text: '' });
      
      console.log(`${isEditMode ? 'Updating' : 'Creating'} COA:`, formData);
      
      const url = isEditMode 
        ? `http://${window.location.hostname}:5000/api/z-coa/update/${coaId}`
        : `http://${window.location.hostname}:5000/api/z-coa/create`;
        
      const method = isEditMode ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Request failed with status ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Server response:', responseData);
      
      setMessage({
        type: 'success',
        text: `COA ${isEditMode ? 'updated' : 'created'} successfully!`
      });
      
      // If creating, reset form. If updating, optionally redirect to list
      if (!isEditMode) {
        setFormData({
          acName: '',
          ch1Id: 0,
          ch2Id: 0,
          coaTypeId: 0,
          setupName: '',
          adress: '',
          city: '',
          personName: '',
          mobileNo: '',
          taxStatus: false,
          ntn: '',
          cnic: '',
          salesLimit: '',
          credit: '',
          creditDoys: '',
          salesMan: '',
          isJvBalance: false,
          discountA: 0, // Reset discount fields
          discountB: 0,
          discountC: 0
        });
        setFilteredControlHead2List([]);
      } else {
        // Optionally redirect to list after successful update
        setTimeout(() => {
          router.push('/coa/list');
        }, 2000);
      }
      
    } catch (error: any) {
      console.error(`Error ${isEditMode ? 'updating' : 'creating'} COA:`, error);
      setMessage({
        type: 'error',
        text: error?.message || `Failed to ${isEditMode ? 'update' : 'create'} COA`
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle delete operation
  const handleDelete = async () => {
    if (!isEditMode || !coaId) return;
    
    const confirmed = window.confirm('Are you sure you want to delete this COA? This action cannot be undone.');
    if (!confirmed) return;
    
    try {
      setMessage({ type: '', text: '' });
      
      console.log('Deleting COA with ID:', coaId);
      
      const response = await fetch(`http://${window.location.hostname}:5000/api/z-coa/delete/${coaId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Delete request failed with status ${response.status}`);
      }
      
      const responseData = await response.json();
      console.log('Delete response:', responseData);
      
      setMessage({
        type: 'success',
        text: 'COA deleted successfully!'
      });
      
      // Redirect to list page after successful delete
      setTimeout(() => {
        router.push('/coa/list');
      }, 2000);
      
    } catch (error: any) {
      console.error('Error deleting COA:', error);
      setMessage({
        type: 'error',
        text: error?.message || 'Failed to delete COA'
      });
    }
  };

  // Determine if there are any API errors
  const hasApiErrors = Object.values(apiErrors).some(error => error !== '');

  // Check if all data is loaded
  const isLoading = loading.ch1 || loading.ch2 || loading.coaType || loading.salesMan || loading.coaData;

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Enhanced Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {isEditMode ? 'Edit Chart of Account' : 'Create Chart of Account'}
            </h1>
            <p className="text-gray-600">
              {isEditMode 
                ? 'Update the account information below.' 
                : 'Fill in the information below to create a new chart of account.'
              }
            </p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => router.push('/coa/list')}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span>View All Accounts</span>
            </button>
            {isEditMode && (
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Display message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-lg border ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border-green-200' 
            : 'bg-red-50 text-red-800 border-red-200'
        }`}>
          <div className="flex items-center">
            {message.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {message.text}
          </div>
        </div>
      )}
      
      {/* Display API errors */}
      {hasApiErrors && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 p-4 mb-6 rounded-r-lg">
          <h3 className="font-bold">Warning: Some data failed to load</h3>
          <ul className="list-disc ml-5 mt-2">
            {Object.entries(apiErrors).map(([key, error]) => 
              error ? <li key={key}>{key}: {error}</li> : null
            )}
          </ul>
          <div className="mt-3 flex flex-wrap gap-3">
            {apiErrors.ch1 && (
              <button onClick={fetchControlHead1} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Retry Control Head 1
              </button>
            )}
            {apiErrors.ch2 && (
              <button onClick={fetchControlHead2} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Retry Control Head 2
              </button>
            )}
            {apiErrors.coaType && (
              <button onClick={fetchCoaTypes} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Retry COA Types
              </button>
            )}
            {apiErrors.salesMan && (
              <button onClick={fetchSalesmen} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Retry Salesmen
              </button>
            )}
            {apiErrors.coaData && isEditMode && (
              <button onClick={() => fetchCoaData(coaId!)} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
                Retry COA Data
              </button>
            )}
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {isEditMode ? 'Loading data for editing...' : 'Loading data...'}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name *
                </label>
                <input
                  type="text"
                  name="acName"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.acName}
                  onChange={handleInputChange}
                  disabled={submitting}
                  required
                  placeholder="Enter account name"
                />
              </div>
              
              {/* Control Head 1 Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Control Head 1 *
                </label>
                <select
                  name="ch1Id"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.ch1Id || ''}
                  onChange={handleInputChange}
                  disabled={submitting || controlHead1List.length === 0}
                  required
                >
                  <option value="">Select Control Head 1</option>
                  {controlHead1List && controlHead1List.length > 0 ? 
                    controlHead1List.map(ch1 => (
                      <option key={ch1.id} value={ch1.id}>
                        {ch1.zHead1}
                      </option>
                    )) : 
                    <option value="" disabled>No data available</option>
                  }
                </select>
                {apiErrors.ch1 && (
                  <p className="mt-1 text-sm text-red-600">
                    {apiErrors.ch1}
                  </p>
                )}
              </div>
              
              {/* Control Head 2 Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Control Head 2 *
                </label>
                <select
                  name="ch2Id"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.ch2Id || ''}
                  onChange={handleInputChange}
                  disabled={submitting || !formData.ch1Id || filteredControlHead2List.length === 0}
                  required
                >
                  <option value="">
                    {!formData.ch1Id 
                      ? 'Select Control Head 1 first' 
                      : 'Select Control Head 2'}
                  </option>
                  {filteredControlHead2List && filteredControlHead2List.length > 0 ? 
                    filteredControlHead2List.map(ch2 => (
                      <option key={ch2.id} value={ch2.id}>
                        {ch2.zHead2}
                      </option>
                    )) : 
                    (formData.ch1Id && <option value="" disabled>No Control Head 2 found for selected Control Head 1</option>)
                  }
                </select>
                {apiErrors.ch2 && (
                  <p className="mt-1 text-sm text-red-600">
                    {apiErrors.ch2}
                  </p>
                )}
              </div>
              
              {/* COA Type Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  COA Type *
                </label>
                <select
                  name="coaTypeId"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.coaTypeId || ''}
                  onChange={handleInputChange}
                  disabled={submitting || coaTypeList.length === 0}
                  required
                >
                  <option value="">Select COA Type</option>
                  {coaTypeList && coaTypeList.length > 0 ? 
                    coaTypeList.map(type => (
                      <option key={type.id} value={type.id}>
                        {type.zType}
                      </option>
                    )) : 
                    <option value="" disabled>No data available</option>
                  }
                </select>
                {apiErrors.coaType && (
                  <p className="mt-1 text-sm text-red-600">
                    {apiErrors.coaType}
                  </p>
                )}
              </div>
              
              {/* Setup Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Setup Name *
                </label>
                <input
                  type="text"
                  name="setupName"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.setupName}
                  onChange={handleInputChange}
                  disabled={submitting}
                  required
                  placeholder="Enter setup name"
                />
              </div>
              
              {/* Address */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Address *
                </label>
                <input
                  type="text"
                  name="adress"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.adress}
                  onChange={handleInputChange}
                  disabled={submitting}
                  required
                  placeholder="Enter full address"
                />
              </div>
              
              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={submitting}
                  required
                  placeholder="Enter city"
                />
              </div>
              
              {/* Person Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Person Name *
                </label>
                <input
                  type="text"
                  name="personName"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.personName}
                  onChange={handleInputChange}
                  disabled={submitting}
                  required
                  placeholder="Enter person name"
                />
              </div>
              
              {/* Mobile Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mobile Number *
                </label>
                <input
                  type="text"
                  name="mobileNo"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.mobileNo}
                  onChange={handleInputChange}
                  disabled={submitting}
                  required
                  placeholder="Enter mobile number"
                />
              </div>
              
              {/* NTN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NTN *
                </label>
                <input
                  type="text"
                  name="ntn"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.ntn}
                  onChange={handleInputChange}
                  disabled={submitting}
                  required
                  placeholder="Enter NTN"
                />
              </div>
              
              {/* CNIC */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CNIC *
                </label>
                <input
                  type="text"
                  name="cnic"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.cnic}
                  onChange={handleInputChange}
                  disabled={submitting}
                  required
                  placeholder="Enter CNIC"
                />
              </div>
              
              {/* Sales Limit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sales Limit *
                </label>
                <input
                  type="text"
                  name="salesLimit"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.salesLimit}
                  onChange={handleInputChange}
                  disabled={submitting}
                  required
                  placeholder="Enter sales limit"
                />
              </div>
              
              {/* Credit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit *
                </label>
                <input
                  type="text"
                  name="credit"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.credit}
                  onChange={handleInputChange}
                  disabled={submitting}
                  required
                  placeholder="Enter credit amount"
                />
              </div>
              
              {/* Credit Days */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Credit Days *
                </label>
                <input
                  type="text"
                  name="creditDoys"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.creditDoys}
                  onChange={handleInputChange}
                  disabled={submitting}
                  required
                  placeholder="Enter credit days"
                />
              </div>
              
              {/* Sales Man Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sales Man *
                </label>
                <select
                  name="salesMan"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.salesMan}
                  onChange={handleInputChange}
                  disabled={submitting || !Array.isArray(salesManList) || salesManList.length === 0}
                  required
                >
                  <option value="">Select Sales Man</option>
                  {Array.isArray(salesManList) && salesManList.length > 0 ? 
                    salesManList.map(man => (
                      <option key={man.id} value={man.id}>
                        {man.name}
                      </option>
                    )) : 
                    <option value="" disabled>No salesmen available</option>
                  }
                </select>
                {apiErrors.salesMan && (
                  <p className="mt-1 text-sm text-red-600">
                    {apiErrors.salesMan}
                  </p>
                )}
              </div>

              {/* NEW DISCOUNT FIELDS */}
              {/* Discount A */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount A (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  name="discountA"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.discountA}
                  onChange={handleInputChange}
                  disabled={submitting}
                  placeholder="Enter discount A percentage (0-100)"
                />
              </div>

              {/* Discount B */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount B (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  name="discountB"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.discountB}
                  onChange={handleInputChange}
                  disabled={submitting}
                  placeholder="Enter discount B percentage (0-100)"
                />
              </div>

              {/* Discount C */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Discount C (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  name="discountC"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  value={formData.discountC}
                  onChange={handleInputChange}
                  disabled={submitting}
                  placeholder="Enter discount C percentage (0-100)"
                />
              </div>
              
              {/* Tax Status Radio Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Tax Status *
                </label>
                <div className="space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="taxStatus"
                      className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      checked={formData.taxStatus === true}
                      onChange={() => handleRadioChange('taxStatus', true)}
                      disabled={submitting}
                    />
                    <span className="ml-2 text-sm text-gray-700">Tax Registered</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="taxStatus"
                      className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      checked={formData.taxStatus === false}
                      onChange={() => handleRadioChange('taxStatus', false)}
                      disabled={submitting}
                    />
                    <span className="ml-2 text-sm text-gray-700">Unregistered</span>
                  </label>
                </div>
              </div>
              
              {/* JV Balance Radio Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  JV Balance *
                </label>
                <div className="space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="isJvBalance"
                      className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      checked={formData.isJvBalance === true}
                      onChange={() => handleRadioChange('isJvBalance', true)}
                      disabled={submitting}
                    />
                    <span className="ml-2 text-sm text-gray-700">Yes</span>
                  </label>
                  <br />
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="isJvBalance"
                      className="form-radio h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      checked={formData.isJvBalance === false}
                      onChange={() => handleRadioChange('isJvBalance', false)}
                      disabled={submitting}
                    />
                    <span className="ml-2 text-sm text-gray-700">No</span>
                  </label>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                type="submit"
                className={`w-full py-3 px-6 rounded-lg text-white font-medium transition-colors duration-200 ${
                  submitting || hasApiErrors 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
                disabled={submitting || hasApiErrors}
              >
                {submitting 
                  ? (isEditMode ? 'Updating...' : 'Creating...') 
                  : (isEditMode ? 'Update COA' : 'Create COA')
                }
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
