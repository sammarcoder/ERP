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

// // Updated Form data interface with discount fields
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
//   discountA: number; // NEW
//   discountB: number; // NEW
//   discountC: number; // NEW
//   batch_no?: string; // NEW
// }

// export default function CoaForm() {
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

//   // Updated Form state with discount fields
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
//     isJvBalance: false,
//     discountA: 0, // NEW
//     discountB: 0, // NEW
//     discountC: 0, // NEW
//     batch_no: ''  // NEW
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

//   // Updated: Fetch existing COA data for editing
//   const fetchCoaData = async (id: string) => {
//     try {
//       setLoading(prev => ({ ...prev, coaData: true }));
//       setApiErrors(prev => ({ ...prev, coaData: '' }));

//       console.log('Fetching COA data for editing, ID:', id);
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get/${id}`);

//       if (!response.ok) {
//         throw new Error(`Failed to fetch COA data: ${response.status}`);
//       }

//       const result = await response.json();
//       const data = result.success ? result.data : result;
//       console.log('COA data for editing:', data);

//       // Pre-populate form with existing data including discount fields
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
//         isJvBalance: Boolean(data.isJvBalance),
//         discountA: parseFloat(data.discountA) || 0, // NEW
//         discountB: parseFloat(data.discountB) || 0, // NEW
//         discountC: parseFloat(data.discountC) || 0,  // NEW
//         batch_no: data.batch_no || '' // NEW
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

//   // All your existing fetch functions remain the same
//   const fetchControlHead1 = async () => {
//     try {
//       setLoading(prev => ({ ...prev, ch1: true }));
//       setApiErrors(prev => ({ ...prev, ch1: '' }));

//       console.log('Fetching Control Head 1 data...');
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-control-head1`);

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

//   const fetchControlHead2 = async () => {
//     try {
//       setLoading(prev => ({ ...prev, ch2: true }));
//       setApiErrors(prev => ({ ...prev, ch2: '' }));

//       console.log('Fetching Control Head 2 data...');
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-control-head2/get`);

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

//   const fetchCoaTypes = async () => {
//     try {
//       setLoading(prev => ({ ...prev, coaType: true }));
//       setApiErrors(prev => ({ ...prev, coaType: '' }));

//       console.log('Fetching COA Types data...');
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa-type`);

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

//   const fetchSalesmen = async () => {
//     try {
//       setLoading(prev => ({ ...prev, salesMan: true }));
//       setApiErrors(prev => ({ ...prev, salesMan: '' }));

//       console.log('Fetching Salesmen data...');
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-control/salesman`);

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

//     // Special handling for number inputs
//     if (['discountA', 'discountB', 'discountC'].includes(name)) {
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

//   // Handle radio button changes
//   const handleRadioChange = (name: string, value: boolean) => {
//     setFormData({
//       ...formData,
//       [name]: value
//     });
//   };

//   // Handle form submission for both create and update
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

//     try {
//       setSubmitting(true);
//       setMessage({ type: '', text: '' });

//       console.log(`${isEditMode ? 'Updating' : 'Creating'} COA:`, formData);

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
//           isJvBalance: false,
//           discountA: 0, // Reset discount fields
//           discountB: 0,
//           discountC: 0,
//           batch_no: ''  // Reset batch_no
//         });
//         setFilteredControlHead2List([]);
//       } else {
//         // Optionally redirect to list after successful update
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

//   // Handle delete operation
//   const handleDelete = async () => {
//     if (!isEditMode || !coaId) return;

//     const confirmed = window.confirm('Are you sure you want to delete this COA? This action cannot be undone.');
//     if (!confirmed) return;

//     try {
//       setMessage({ type: '', text: '' });

//       console.log('Deleting COA with ID:', coaId);

//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/delete/${coaId}`, {
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

//               {/* NEW DISCOUNT FIELDS */}
//               {/* Discount A */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Discount A (%)
//                 </label>
//                 <input
//                   type="text"
//                   step="0.01"
//                   min="0"
//                   max="100"
//                   name="discountA"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.discountA}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter discount A percentage (0-100)"
//                 />
//               </div>

//               {/* Discount B */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Discount B (%)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   max="100"
//                   name="discountB"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.discountB}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter discount B percentage (0-100)"
//                 />
//               </div>

//               {/* Discount C */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Discount C (%)
//                 </label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   max="100"
//                   name="discountC"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.discountC}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter discount C percentage (0-100)"
//                 />
//               </div>
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Batch No
//                 </label>
//                 <input
//                   type="text"
//                   name="batch_no"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.batch_no}
//                   onChange={handleInputChange}
//                 />
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























































// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import SelectableTable from '@/components/SelectableTable'; // Import SelectableTable

// // Updated interfaces
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

// // NEW: Transporter interface
// interface Transporter {
//   id: number;
//   name: string;
//   contactPerson?: string;
//   phone?: string;
//   address?: string;
//   isActive: boolean;
// }

// // Updated Form data interface with new fields
// interface CoaFormData {
//   id?: number;
//   acName: string;
//   ch1Id: number;
//   ch2Id: number;
//   coaTypeId: number;
//   setupName: string;
//   address: string;           // Fixed typo: was "adress"
//   city: string;
//   personName: string;
//   mobileNo: string;
//   taxStatus: boolean;
//   ntn: string;
//   cnic: string;
//   salesLimit: string;
//   credit: string;
//   creditDays: string;        // Fixed typo: was "creditDoys"
//   salesMan: string;
//   isJvBalance: boolean;
//   discountA: number;
//   discountB: number;
//   discountC: number;
//   batch_no?: string;
//   // NEW FIELDS
//   Transporter_ID: number | null;
//   freight_crt: number;
//   labour_crt: number;
//   bility_expense: number;
//   other_expense: number;
// }

// export default function CoaForm() {
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
//   const [transporterList, setTransporterList] = useState<Transporter[]>([]); // NEW: Transporter list

//   // Loading states
//   const [loading, setLoading] = useState({
//     ch1: true,
//     ch2: true,
//     coaType: true,
//     salesMan: true,
//     transporter: true,     // NEW: Transporter loading
//     coaData: isEditMode
//   });

//   // Updated Form state with new fields
//   const [formData, setFormData] = useState<CoaFormData>({
//     acName: '',
//     ch1Id: 0,
//     ch2Id: 0,
//     coaTypeId: 0,
//     setupName: '',
//     address: '',           // Fixed typo
//     city: '',
//     personName: '',
//     mobileNo: '',
//     taxStatus: false,
//     ntn: '',
//     cnic: '',
//     salesLimit: '',
//     credit: '',
//     creditDays: '',        // Fixed typo
//     salesMan: '',
//     isJvBalance: false,
//     discountA: 0,
//     discountB: 0,
//     discountC: 0,
//     batch_no: '',
//     // NEW FIELDS
//     Transporter_ID: null,
//     freight_crt: 0.00,
//     labour_crt: 0.00,
//     bility_expense: 0.00,
//     other_expense: 0.00
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

//   // NEW: Fetch transporters function
//   const fetchTransporters = async () => {
//     try {
//       setLoading(prev => ({ ...prev, transporter: true }));
//       setApiErrors(prev => ({ ...prev, transporter: '' }));

//       console.log('Fetching Transporters data...');
//       const response = await fetch(`http://${window.location.hostname}:4000/api/transporter`);

//       if (!response.ok) {
//         throw new Error(`Failed to fetch Transporters data: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('Transporters data:', result);

//       // Handle different response formats
//       let transporters = [];
//       if (result.success && Array.isArray(result.data)) {
//         transporters = result.data;
//       } else if (Array.isArray(result)) {
//         transporters = result;
//       }

//       setTransporterList(transporters);

//     } catch (error) {
//       console.error('Error fetching Transporters:', error);
//       setApiErrors(prev => ({ 
//         ...prev, 
//         transporter: error instanceof Error ? error.message : 'Unknown error' 
//       }));
//       setTransporterList([]);
//     } finally {
//       setLoading(prev => ({ ...prev, transporter: false }));
//     }
//   };

//   // Updated: Fetch existing COA data for editing with new fields
//   const fetchCoaData = async (id: string) => {
//     try {
//       setLoading(prev => ({ ...prev, coaData: true }));
//       setApiErrors(prev => ({ ...prev, coaData: '' }));

//       console.log('Fetching COA data for editing, ID:', id);
//       const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get/${id}`);

//       if (!response.ok) {
//         throw new Error(`Failed to fetch COA data: ${response.status}`);
//       }

//       const result = await response.json();
//       const data = result.success ? result.data : result;
//       console.log('COA data for editing:', data);

//       // Pre-populate form with existing data including new fields
//       setFormData({
//         id: data.id,
//         acName: data.acName || '',
//         ch1Id: data.ch1Id || 0,
//         ch2Id: data.ch2Id || 0,
//         coaTypeId: data.coaTypeId || 0,
//         setupName: data.setupName || '',
//         address: data.address || data.adress || '',    // Handle both old and new field names
//         city: data.city || '',
//         personName: data.personName || '',
//         mobileNo: data.mobileNo || '',
//         taxStatus: Boolean(data.taxStatus),
//         ntn: data.ntn || '',
//         cnic: data.cnic || '',
//         salesLimit: data.salesLimit || '',
//         credit: data.credit || '',
//         creditDays: data.creditDays || data.creditDoys || '', // Handle both old and new field names
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
//         other_expense: parseFloat(data.other_expense) || 0.00
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

//   // Keep all your existing fetch functions (fetchControlHead1, fetchControlHead2, fetchCoaTypes, fetchSalesmen)
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

//   // Handle form input changes (updated for new fields)
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

//   // NEW: Handle SelectableTable changes
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

//   // Updated form submission with new fields
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

//     // NEW: Validate expense fields (must be non-negative)
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

//       console.log(`${isEditMode ? 'Updating' : 'Creating'} COA:`, formData);

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
//       console.log('Server response:', responseData);

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
//           other_expense: 0.00
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

//   // Keep your existing handleDelete function
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

//   // Check if all data is loaded (updated to include transporter)
//   const isLoading = loading.ch1 || loading.ch2 || loading.coaType || loading.salesMan || loading.transporter || loading.coaData;

//   return (
//     <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
//       {/* Keep your existing header section */}
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

//       {/* Keep your existing message and error handling sections */}
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

//       {/* Keep your existing API errors section but add transporter */}
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
//             {/* NEW: Transporter retry button */}
//             {apiErrors.transporter && (
//               <button onClick={fetchTransporters} className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700">
//                 Retry Transporters
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

//       {/* Keep your loading state */}
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

//               {/* Keep ALL your existing form fields exactly as they are... */}
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

//               {/* NEW: Transporter Selection using SelectableTable */}
//               <div>
//                 <SelectableTable
//                   label="Transporter"
//                   name="Transporter_ID"
//                   value={formData.Transporter_ID}
//                   onChange={handleSelectableTableChange}
//                   options={transporterList.map(transporter => ({
//                     id: transporter.id,
//                     label: transporter.name,
//                     contactPerson: transporter.contactPerson || '-',
//                     phone: transporter.phone || '-',
//                     address: transporter.address || '-',
//                     status: transporter.isActive ? 'Active' : 'Inactive'
//                   }))}
//                   placeholder="Select Transporter (Optional)"
//                   disabled={submitting || transporterList.length === 0}
//                   displayKey="label"
//                   valueKey="id"
//                   columns={[
//                     { key: 'label', label: 'Name', width: '30%' },
//                     { key: 'contactPerson', label: 'Contact Person', width: '25%' },
//                     { key: 'phone', label: 'Phone', width: '20%' },
//                     { key: 'address', label: 'Address', width: '25%' }
//                   ]}
//                   pageSize={8}
//                 />
//                 {apiErrors.transporter && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {apiErrors.transporter}
//                   </p>
//                 )}
//               </div>

//               {/* Setup Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Setup Name
//                 </label>
//                 <input
//                   type="text"
//                   name="setupName"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.setupName}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter setup name"
//                 />
//               </div>

//               {/* Address (Fixed typo) */}
//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Address
//                 </label>
//                 <input
//                   type="text"
//                   name="address"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.address}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter full address"
//                 />
//               </div>

//               {/* Keep ALL your other existing fields: City, Person Name, Mobile, NTN, CNIC, Sales Limit, Credit, Credit Days, Sales Man, Discount A, B, C, Batch No, Tax Status radio, JV Balance radio */}

//               {/* City */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
//                 <input
//                   type="text"
//                   name="city"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter city"
//                 />
//               </div>

//               {/* Person Name */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Person Name</label>
//                 <input
//                   type="text"
//                   name="personName"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.personName}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter person name"
//                 />
//               </div>

//               {/* Mobile Number */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
//                 <input
//                   type="text"
//                   name="mobileNo"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.mobileNo}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter mobile number"
//                 />
//               </div>

//               {/* NTN */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">NTN</label>
//                 <input
//                   type="text"
//                   name="ntn"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.ntn}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter NTN"
//                 />
//               </div>

//               {/* CNIC */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">CNIC</label>
//                 <input
//                   type="text"
//                   name="cnic"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.cnic}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter CNIC"
//                 />
//               </div>

//               {/* Sales Limit */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Sales Limit</label>
//                 <input
//                   type="text"
//                   name="salesLimit"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.salesLimit}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter sales limit"
//                 />
//               </div>

//               {/* Credit */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Credit</label>
//                 <input
//                   type="text"
//                   name="credit"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.credit}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter credit amount"
//                 />
//               </div>

//               {/* Credit Days (Fixed typo) */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Credit Days</label>
//                 <input
//                   type="text"
//                   name="creditDays"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.creditDays}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter credit days"
//                 />
//               </div>

//               {/* Sales Man Dropdown */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Sales Man</label>
//                 <select
//                   name="salesMan"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.salesMan}
//                   onChange={handleInputChange}
//                   disabled={submitting || !Array.isArray(salesManList) || salesManList.length === 0}
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

//               {/* Discount A */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Discount A (%)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   max="100"
//                   name="discountA"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.discountA}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter discount A percentage (0-100)"
//                 />
//               </div>

//               {/* Discount B */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Discount B (%)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   max="100"
//                   name="discountB"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.discountB}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter discount B percentage (0-100)"
//                 />
//               </div>

//               {/* Discount C */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Discount C (%)</label>
//                 <input
//                   type="number"
//                   step="0.01"
//                   min="0"
//                   max="100"
//                   name="discountC"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.discountC}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter discount C percentage (0-100)"
//                 />
//               </div>

//               {/* Batch No */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Batch No</label>
//                 <input
//                   type="text"
//                   name="batch_no"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                   value={formData.batch_no}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   placeholder="Enter batch number"
//                 />
//               </div>

//               {/* NEW EXPENSE FIELDS SECTION */}
//               <div className="md:col-span-2 mt-8">
//                 <div className="border-t border-gray-200 pt-6">
//                   <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
//                     <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
//                     </svg>
//                     Expense Details
//                   </h3>
//                   <p className="text-sm text-gray-600 mb-6">Add expense amounts related to this account (optional)</p>

//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                     {/* Freight Cost */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Freight Cost
//                       </label>
//                       <div className="relative">
//                         <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₨</span>
//                         <input
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           name="freight_crt"
//                           className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                           value={formData.freight_crt}
//                           onChange={handleInputChange}
//                           disabled={submitting}
//                           placeholder="0.00"
//                         />
//                       </div>
//                     </div>

//                     {/* Labour Cost */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Labour Cost
//                       </label>
//                       <div className="relative">
//                         <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₨</span>
//                         <input
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           name="labour_crt"
//                           className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                           value={formData.labour_crt}
//                           onChange={handleInputChange}
//                           disabled={submitting}
//                           placeholder="0.00"
//                         />
//                       </div>
//                     </div>

//                     {/* Utility Expense */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Utility Expense
//                       </label>
//                       <div className="relative">
//                         <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₨</span>
//                         <input
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           name="bility_expense"
//                           className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                           value={formData.bility_expense}
//                           onChange={handleInputChange}
//                           disabled={submitting}
//                           placeholder="0.00"
//                         />
//                       </div>
//                     </div>

//                     {/* Other Expense */}
//                     <div>
//                       <label className="block text-sm font-medium text-gray-700 mb-2">
//                         Other Expense
//                       </label>
//                       <div className="relative">
//                         <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₨</span>
//                         <input
//                           type="number"
//                           step="0.01"
//                           min="0"
//                           name="other_expense"
//                           className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
//                           value={formData.other_expense}
//                           onChange={handleInputChange}
//                           disabled={submitting}
//                           placeholder="0.00"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Expense Summary */}
//                   <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//                     <h4 className="text-sm font-semibold text-blue-800 mb-2">Total Expenses Summary</h4>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//                       <div>
//                         <span className="text-blue-600">Freight:</span>
//                         <span className="font-bold ml-1">₨{formData.freight_crt.toFixed(2)}</span>
//                       </div>
//                       <div>
//                         <span className="text-blue-600">Labour:</span>
//                         <span className="font-bold ml-1">₨{formData.labour_crt.toFixed(2)}</span>
//                       </div>
//                       <div>
//                         <span className="text-blue-600">Utility:</span>
//                         <span className="font-bold ml-1">₨{formData.bility_expense.toFixed(2)}</span>
//                       </div>
//                       <div>
//                         <span className="text-blue-600">Other:</span>
//                         <span className="font-bold ml-1">₨{formData.other_expense.toFixed(2)}</span>
//                       </div>
//                     </div>
//                     <div className="mt-3 pt-3 border-t border-blue-200">
//                       <div className="flex justify-between items-center">
//                         <span className="font-semibold text-blue-800">Total Expenses:</span>
//                         <span className="font-bold text-lg text-blue-900">
//                           ₨{(formData.freight_crt + formData.labour_crt + formData.bility_expense + formData.other_expense).toFixed(2)}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Keep your existing Tax Status and JV Balance radio buttons */}
//               {/* Tax Status Radio Buttons */}
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-3">Tax Status</label>
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
//                 <label className="block text-sm font-medium text-gray-700 mb-3">JV Balance</label>
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































































































// 'use client';

// import React, { useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { toast } from 'react-hot-toast';
// import { useAppDispatch, useAppSelector } from '@/hooks/redux';
// import SelectableTable from '@/components/SelectableTable';
// import {
//   fetchCoaDropdowns,
//   fetchCoaById,
//   saveCoa,
//   deleteCoa,
//   updateField,
//   updateFilteredCh2,
//   setEditMode,
//   resetForm,
//   clearError,
//   type CoaFormData,
// } from '@/store/slice/coaSlice';
// import { fetchTransporters } from '@/store/slice/transporterSlice';

// export default function CoaForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const coaId = searchParams.get('id');
//   const dispatch = useAppDispatch();

//   const { formData, loading, error, dropdownData, isEditMode } = useAppSelector((state) => state.coa);
//   const { transporters } = useAppSelector((state) => state.transporter);

//   useEffect(() => {
//     dispatch(fetchCoaDropdowns());
//     dispatch(fetchTransporters());

//     if (coaId) {
//       dispatch(setEditMode(true));
//       dispatch(fetchCoaById(coaId));
//     } else {
//       dispatch(resetForm());
//     }

//     return () => {
//       dispatch(clearError());
//     };
//   }, [dispatch, coaId]);

//   useEffect(() => {
//     dispatch(updateFilteredCh2());
//   }, [formData.ch1Id, dispatch]);

//   const handleFieldChange = (field: keyof CoaFormData, value: any) => {
//     dispatch(updateField({ field, value }));
//   };

//   const handleSelectableTableChange = (name: string, value: number | null) => {
//     handleFieldChange(name as keyof CoaFormData, value);
//   };

//   const calculateTotalExpenses = () => {
//     return formData.freight_crt + formData.labour_crt + formData.bility_expense + formData.other_expense;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     // Basic validation
//     if (!formData.acName.trim()) {
//       toast.error('Account Name is required');
//       return;
//     }

//     if (!formData.ch1Id) {
//       toast.error('Please select Control Head 1');
//       return;
//     }

//     if (!formData.ch2Id) {
//       toast.error('Please select Control Head 2');
//       return;
//     }

//     if (!formData.coaTypeId) {
//       toast.error('Please select COA Type');
//       return;
//     }

//     try {
//       await dispatch(saveCoa({
//         data: formData,
//         isEdit: isEditMode
//       })).unwrap();

//       toast.success(`COA ${isEditMode ? 'updated' : 'created'} successfully!`);

//       if (isEditMode) {
//         setTimeout(() => router.push('/coa'), 1500);
//       }
//     } catch (error) {
//       toast.error(error as string);
//     }
//   };

//   const handleDelete = async () => {
//     if (!isEditMode || !coaId) return;

//     if (window.confirm('Are you sure you want to delete this COA?')) {
//       try {
//         await dispatch(deleteCoa(coaId)).unwrap();
//         toast.success('COA deleted successfully!');
//         setTimeout(() => router.push('/coa'), 1500);
//       } catch (error) {
//         toast.error(error as string);
//       }
//     }
//   };

//   if (loading.form) {
//     return (
//       <div className="p-6">
//         <div className="flex justify-center items-center py-16">
//           <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//           <span className="ml-3 text-gray-600">Loading COA data...</span>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4">
//       <div className="bg-white rounded-lg shadow">

//         {/* Header */}
//         <div className="p-4 border-b border-gray-200">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-xl font-bold text-gray-900">
//                 {isEditMode ? 'Edit Chart of Account' : 'Create Chart of Account'}
//               </h1>
//               <p className="text-sm text-gray-600 mt-1">
//                 {isEditMode
//                   ? 'Update account information and expense details'
//                   : 'Create a comprehensive account with all details'}
//               </p>
//             </div>
//             <div className="flex space-x-2">
//               <button
//                 onClick={() => router.push('/coa/list')}
//                 className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
//               >
//                 View All COA
//               </button>
//               {isEditMode && (
//                 <div>
//                   <button
//                     onClick={() => router.push('/coa')}
//                     className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
//                   >
//                     Back to List
//                   </button>
//                   <button
//                     onClick={handleDelete}
//                     disabled={loading.submit}
//                     className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
//                   >
//                     Delete
//                   </button>
//                 </div>

//               )}
//             </div>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mx-4 mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
//             <div className="flex justify-between items-center">
//               <span>{error}</span>
//               <button onClick={() => dispatch(clearError())} className="text-red-600">
//                 <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//           </div>
//         )}

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-4">

//           {/* Basic Information Section */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Basic Information</h3>

//             {/* Row 1: Account Name (full width) */}
//             <div className="mb-4 grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
//                 <input
//                   type="text"
//                   value={formData.acName}
//                   onChange={(e) => handleFieldChange('acName', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                   placeholder="Enter account name"
//                   required
//                   disabled={loading.submit}
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Setup Name</label>
//                 <input
//                   type="text"
//                   value={formData.setupName}
//                   onChange={(e) => handleFieldChange('setupName', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter setup name"
//                 />
//               </div>

//               <div className="md:col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
//                 <input
//                   type="text"
//                   value={formData.address}
//                   onChange={(e) => handleFieldChange('address', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Enter complete address"
//                 />
//               </div>
//             </div>

//             {/* Row 2: 4 fields per row */}
//             <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Control Head 1 *</label>
//                 <select
//                   value={formData.ch1Id || ''}
//                   onChange={(e) => handleFieldChange('ch1Id', parseInt(e.target.value) || 0)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={loading.submit}
//                 >
//                   <option value="">Select Control Head 1</option>
//                   {dropdownData.controlHead1.map(ch1 => (
//                     <option key={ch1.id} value={ch1.id}>{ch1.zHead1}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Control Head 2 *</label>
//                 <select
//                   value={formData.ch2Id || ''}
//                   onChange={(e) => handleFieldChange('ch2Id', parseInt(e.target.value) || 0)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={loading.submit || !formData.ch1Id}
//                 >
//                   <option value="">{!formData.ch1Id ? 'Select Control Head 1 first' : 'Select Control Head 2'}</option>
//                   {dropdownData.filteredControlHead2.map(ch2 => (
//                     <option key={ch2.id} value={ch2.id}>{ch2.zHead2}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">COA Type *</label>
//                 <select
//                   value={formData.coaTypeId || ''}
//                   onChange={(e) => handleFieldChange('coaTypeId', parseInt(e.target.value) || 0)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   required
//                   disabled={loading.submit}
//                 >
//                   <option value="">Select COA Type</option>
//                   {dropdownData.coaTypes.map(type => (
//                     <option key={type.id} value={type.id}>{type.zType}</option>
//                   ))}
//                 </select>
//               </div>

//               {/* Transporter using SelectableTable */}
//               <div className=''>
//                 <SelectableTable
//                   label="Transporter"
//                   name="Transporter_ID"
//                   value={formData.Transporter_ID}
//                   onChange={handleSelectableTableChange}
//                   options={transporters.map(t => ({
//                     id: t.id,
//                     label: t.name,
//                     contactPerson: t.contactPerson || '-',
//                     phone: t.phone || '-',
//                     address: t.address || '-',
//                   }))}
//                   placeholder="Select Transporter (Optional)"
//                   disabled={loading.submit}
//                   displayKey="label"
//                   valueKey="id"
//                   columns={[
//                     { key: 'label', label: 'Name', width: '40%' },
//                     { key: 'contactPerson', label: 'Contact', width: '30%' },
//                     { key: 'phone', label: 'Phone', width: '30%' }
//                   ]}
//                   pageSize={8}
//                 />
//               </div>
//             </div>

//             {/* Row 3: 3 fields */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

//             </div>
//           </div>

//           {/* Contact & Financial Information */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Contact & Financial</h3>

//             {/* Row 1: 5 fields */}
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
//                 <input
//                   type="text"
//                   value={formData.city}
//                   onChange={(e) => handleFieldChange('city', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="City"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Person Name</label>
//                 <input
//                   type="text"
//                   value={formData.personName}
//                   onChange={(e) => handleFieldChange('personName', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Contact person"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
//                 <input
//                   type="text"
//                   value={formData.mobileNo}
//                   onChange={(e) => handleFieldChange('mobileNo', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Mobile number"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">NTN</label>
//                 <input
//                   type="text"
//                   value={formData.ntn}
//                   onChange={(e) => handleFieldChange('ntn', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="NTN number"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">CNIC</label>
//                 <input
//                   type="text"
//                   value={formData.cnic}
//                   onChange={(e) => handleFieldChange('cnic', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="CNIC"
//                 />
//               </div>
//             </div>

//             {/* Row 2: 5 fields */}
//             <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Sales Limit</label>
//                 <input
//                   type="text"
//                   value={formData.salesLimit}
//                   onChange={(e) => handleFieldChange('salesLimit', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Sales limit"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Credit</label>
//                 <input
//                   type="text"
//                   value={formData.credit}
//                   onChange={(e) => handleFieldChange('credit', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Credit limit"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Credit Days</label>
//                 <input
//                   type="text"
//                   value={formData.creditDays}
//                   onChange={(e) => handleFieldChange('creditDays', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Days"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Sales Man</label>
//                 <select
//                   value={formData.salesMan}
//                   onChange={(e) => handleFieldChange('salesMan', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">Select Sales Man</option>
//                   {dropdownData.salesmen.map(man => (
//                     <option key={man.id} value={man.id}>{man.name}</option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Batch No</label>
//                 <input
//                   type="text"
//                   value={formData.batch_no}
//                   onChange={(e) => handleFieldChange('batch_no', e.target.value)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="Batch number"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Discounts & Status */}
//           <div className="mb-6">
//             <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Discounts & Status</h3>

//             <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Discount A (%)</label>
//                 <input
//                   type="text"
//                   step="0.01"
//                   min="0"
//                   max="100"
//                   value={formData.discountA}
//                   onChange={(e) => handleFieldChange('discountA', parseFloat(e.target.value) || 0)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="0.00"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Discount B (%)</label>
//                 <input
//                   type="text"
//                   step="0.01"
//                   min="0"
//                   max="100"
//                   value={formData.discountB}
//                   onChange={(e) => handleFieldChange('discountB', parseFloat(e.target.value) || 0)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="0.00"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Discount C (%)</label>
//                 <input
//                   type="text"
//                   step="0.01"
//                   min="0"
//                   max="100"
//                   value={formData.discountC}
//                   onChange={(e) => handleFieldChange('discountC', parseFloat(e.target.value) || 0)}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//                   placeholder="0.00"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Tax Status</label>
//                 <div className="flex space-x-4 mt-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="taxStatus"
//                       checked={formData.taxStatus === true}
//                       onChange={() => handleFieldChange('taxStatus', true)}
//                       className="mr-2"
//                     />
//                     Registered
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="taxStatus"
//                       checked={formData.taxStatus === false}
//                       onChange={() => handleFieldChange('taxStatus', false)}
//                       className="mr-2"
//                     />
//                     Unregistered
//                   </label>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">JV Balance</label>
//                 <div className="flex space-x-4 mt-2">
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="isJvBalance"
//                       checked={formData.isJvBalance === true}
//                       onChange={() => handleFieldChange('isJvBalance', true)}
//                       className="mr-2"
//                     />
//                     Yes
//                   </label>
//                   <label className="flex items-center">
//                     <input
//                       type="radio"
//                       name="isJvBalance"
//                       checked={formData.isJvBalance === false}
//                       onChange={() => handleFieldChange('isJvBalance', false)}
//                       className="mr-2"
//                     />
//                     No
//                   </label>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* NEW: Expense Management Section */}
//           <div className="mb-6">
//             <div className="flex justify-between items-center mb-4">
//               <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200 flex-1">Expense Management</h3>
//               <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-semibold ml-4">
//                 Total: ₨{calculateTotalExpenses().toFixed(2)}
//               </span>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Freight Cost</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₨</span>
//                   <input
//                     type="text"
//                     step="0.01"
//                     min="0"
//                     value={formData.freight_crt}
//                     onChange={(e) => handleFieldChange('freight_crt', parseFloat(e.target.value) || 0)}
//                     className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//                     placeholder="0.00"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Labour Cost</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₨</span>
//                   <input
//                     type="text"
//                     step="0.01"
//                     min="0"
//                     value={formData.labour_crt}
//                     onChange={(e) => handleFieldChange('labour_crt', parseFloat(e.target.value) || 0)}
//                     className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//                     placeholder="0.00"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Utility Expense</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₨</span>
//                   <input
//                     type="text"
//                     step="0.01"
//                     min="0"
//                     value={formData.bility_expense}
//                     onChange={(e) => handleFieldChange('bility_expense', parseFloat(e.target.value) || 0)}
//                     className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//                     placeholder="0.00"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-gray-700 mb-2">Other Expense</label>
//                 <div className="relative">
//                   <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₨</span>
//                   <input
//                     type="text"
//                     step="0.01"
//                     min="0"
//                     value={formData.other_expense}
//                     onChange={(e) => handleFieldChange('other_expense', parseFloat(e.target.value) || 0)}
//                     className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
//                     placeholder="0.00"
//                   />
//                 </div>
//               </div>
//               <div className="pt-6 w-40 border-t border-gray-200">
//                 <button
//                   type="submit"
//                   disabled={loading.submit}
//                   className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
//                 >
//                   {loading.submit ? (
//                     <div className="flex items-center justify-center">
//                       <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
//                       {isEditMode ? 'Updating...' : 'Creating...'}
//                     </div>
//                   ) : (
//                     isEditMode ? 'Update COA' : 'Create COA'
//                   )}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Submit Button */}

//         </form>
//       </div>
//     </div>
//   );
// }












































































'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import SelectableTable from '@/components/SelectableTable';
import {
  fetchCoaDropdowns,
  fetchCoaById,
  saveCoa,
  deleteCoa,
  updateField,
  updateFilteredCh2,
  setEditMode,
  resetForm,
  clearError,
  type CoaFormData,
} from '@/store/slice/coaSlice';
import { fetchTransporters } from '@/store/slice/transporterSlice';

function CoaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const coaId = searchParams.get('id');
  const dispatch = useAppDispatch();

  const { formData, loading, error, dropdownData, isEditMode } = useAppSelector((state) => state.coa);
  const { transporters } = useAppSelector((state) => state.transporter);

  useEffect(() => {
    dispatch(fetchCoaDropdowns());
    dispatch(fetchTransporters());

    if (coaId) {
      dispatch(setEditMode(true));
      dispatch(fetchCoaById(coaId));
    } else {
      dispatch(resetForm());
    }

    return () => {
      dispatch(clearError());
    };
  }, [dispatch, coaId]);

  useEffect(() => {
    dispatch(updateFilteredCh2());
  }, [formData.ch1Id, dispatch]);

  const handleFieldChange = (field: keyof CoaFormData, value: any) => {
    dispatch(updateField({ field, value }));
  };

  const handleSelectableTableChange = (name: string, value: number | null) => {
    handleFieldChange(name as keyof CoaFormData, value);
  };

  // Format mobile number as user types
  const handleMobileChange = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '');

    // Format as: 0000-0000000
    let formatted = digits;
    if (digits.length > 4) {
      formatted = `${digits.slice(0, 4)}-${digits.slice(4, 11)}`;
    }

    handleFieldChange('mobileNo', formatted);
  };

  const calculateTotalExpenses = () => {
    return formData.freight_crt + formData.labour_crt + formData.bility_expense + formData.other_expense;
  };

  // Check if COA Type allows editing remaining fields
  const canEditRemainingFields = () => {
    return [1, 6, 7].includes(formData.coaTypeId);
  };

  // Check if should show foreign currency field
  const shouldShowForeignCurrency = () => {
    return formData.coaTypeId === 7;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.acName.trim()) {
      toast.error('Account Name is required');
      return;
    }

    if (!formData.ch1Id) {
      toast.error('Please select Control Head 1');
      return;
    }

    if (!formData.ch2Id) {
      toast.error('Please select Control Head 2');
      return;
    }

    if (!formData.coaTypeId) {
      toast.error('Please select COA Type');
      return;
    }

    try {
      await dispatch(saveCoa({
        data: formData,
        isEdit: isEditMode
      })).unwrap();

      toast.success(`COA ${isEditMode ? 'updated' : 'created'} successfully!`);

      if (isEditMode) {
        setTimeout(() => router.push('/coa'), 1500);
      }
    } catch (error) {
      toast.error(error as string);
    }
  };

  const handleDelete = async () => {
    if (!isEditMode || !coaId) return;

    if (window.confirm('Are you sure you want to delete this COA?')) {
      try {
        await dispatch(deleteCoa(coaId)).unwrap();
        toast.success('COA deleted successfully!');
        setTimeout(() => router.push('/coa'), 1500);
      } catch (error) {
        toast.error(error as string);
      }
    }
  };

  if (loading.form || loading.dropdowns) {
    return (
      <div className="p-6">
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading COA data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="bg-white rounded-lg shadow">

        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isEditMode ? 'Edit Chart of Account' : 'Create Chart of Account'}
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {isEditMode ? 'Update account information' : 'Create a new chart of account'}
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => router.push('/coa/list')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm"
              >
                View All COA
              </button>
              {isEditMode && (
                <button
                  onClick={handleDelete}
                  disabled={loading.submit}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm disabled:opacity-50"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border-l-4 border-red-400 text-red-700">
            <div className="flex justify-between items-center">
              <span>{error}</span>
              <button onClick={() => dispatch(clearError())} className="text-red-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">

          {/* ROW 1: Control Head 1, Control Head 2, COA Type, Account Name, JV Balance */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Primary Information</h3>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Control Head 1 *</label>
                <select
                  value={formData.ch1Id || ''}
                  onChange={(e) => handleFieldChange('ch1Id', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading.submit}
                >
                  <option value="">Select Control Head 1</option>
                  {dropdownData.controlHead1.map(ch1 => (
                    <option key={ch1.id} value={ch1.id}>{ch1.zHead1}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Control Head 2 *</label>
                <select
                  value={formData.ch2Id || ''}
                  onChange={(e) => handleFieldChange('ch2Id', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={!formData.ch1Id || loading.submit}
                >
                  <option value="">{!formData.ch1Id ? 'Select Control Head 1 first' : 'Select Control Head 2'}</option>
                  {dropdownData.filteredControlHead2.map(ch2 => (
                    <option key={ch2.id} value={ch2.id}>{ch2.zHead2}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">COA Type *</label>
                <select
                  value={formData.coaTypeId || ''}
                  onChange={(e) => handleFieldChange('coaTypeId', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading.submit}
                >
                  <option value="">Select COA Type</option>
                  {dropdownData.coaTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.zType}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Name *</label>
                <input
                  type="text"
                  value={formData.acName}
                  onChange={(e) => handleFieldChange('acName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Account name"
                  required
                  disabled={loading.submit}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">JV Balance</label>
                <div className="flex space-x-3 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isJvBalance"
                      checked={formData.isJvBalance === true}
                      onChange={() => handleFieldChange('isJvBalance', true)}
                      className="mr-1"
                      disabled={loading.submit}
                    />
                    <span className="text-sm">Yes</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="isJvBalance"
                      checked={formData.isJvBalance === false}
                      onChange={() => handleFieldChange('isJvBalance', false)}
                      className="mr-1"
                      disabled={loading.submit}
                    />
                    <span className="text-sm">No</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* CONDITIONAL: Show remaining fields only if coaType = 1, 6, or 7 */}
          {canEditRemainingFields() && (
            <>
              {/* ROW 2: Setup Name, Address, City, Person Name */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Contact Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Setup Name</label>
                    <input
                      type="text"
                      value={formData.setupName}
                      onChange={(e) => handleFieldChange('setupName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Setup name"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleFieldChange('address', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Complete address"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleFieldChange('city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="City name"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Person Name</label>
                    <input
                      type="text"
                      value={formData.personName}
                      onChange={(e) => handleFieldChange('personName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Contact person"
                      disabled={loading.submit}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub City</label>
                    <input
                      type="text"
                      value={formData.sub_city}
                      onChange={(e) => handleFieldChange('sub_city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Sub city"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile</label>
                    <input
                      type="text"
                      value={formData.mobileNo}
                      onChange={(e) => handleMobileChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0300-1234567"
                      maxLength={12}
                      disabled={loading.submit}
                    />
                  </div>
                </div>
              </div>

              {/* ROW 3: Sub Customer, Sub City, Mobile, Sales Limit, Credit, Credit Days, Sales Man */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Customer & Financial Details</h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub Customer</label>
                    <div className="flex space-x-3 mt-2">
                       {/* <label className="block text-sm font-medium text-gray-700 mb-2">Sub City</label> */}
                    <input
                      type="text"
                      value={formData.sub_customer}
                      onChange={(e) => handleFieldChange('sub_customer', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Sub customer"
                      disabled={loading.submit}
                    />
                      {/* <label className="flex items-center">
                        <input
                          type="radio"
                          name="sub_customer"
                          checked={formData.sub_customer === true}
                          onChange={() => handleFieldChange('sub_customer', true)}
                          className="mr-1"
                          disabled={loading.submit}
                        />
                        <span className="text-sm">Yes</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="sub_customer"
                          checked={formData.sub_customer === false}
                          onChange={() => handleFieldChange('sub_customer', false)}
                          className="mr-1"
                          disabled={loading.submit}
                        />
                        <span className="text-sm">No</span> */}
                      {/* </label> */}
                    </div>
                  </div>

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sub City</label>
                    <input
                      type="text"
                      value={formData.sub_city}
                      onChange={(e) => handleFieldChange('sub_city', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Sub city"
                      disabled={loading.submit}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile (0000-0000000)</label>
                    <input
                      type="text"
                      value={formData.mobileNo}
                      onChange={(e) => handleMobileChange(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0300-1234567"
                      maxLength={12}
                      disabled={loading.submit}
                    />
                  </div> */}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Limit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.salesLimit}
                      onChange={(e) => handleFieldChange('salesLimit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Sales limit"
                      disabled={loading.submit}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.credit}
                      onChange={(e) => handleFieldChange('credit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Credit limit"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit Days</label>
                    <input
                      type="number"
                      value={formData.creditDays}
                      onChange={(e) => handleFieldChange('creditDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Days"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Man</label>
                    <select
                      value={formData.salesMan}
                      onChange={(e) => handleFieldChange('salesMan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={loading.submit}
                    >
                      <option value="">Select Sales Man</option>
                      {dropdownData.salesmen.map(man => (
                        <option key={man.id} value={man.id}>{man.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.credit}
                      onChange={(e) => handleFieldChange('credit', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Credit limit"
                      disabled={loading.submit}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Credit Days</label>
                    <input
                      type="number"
                      value={formData.creditDays}
                      onChange={(e) => handleFieldChange('creditDays', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Days"
                      disabled={loading.submit}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Sales Man</label>
                    <select
                      value={formData.salesMan}
                      onChange={(e) => handleFieldChange('salesMan', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      disabled={loading.submit}
                    >
                      <option value="">Select Sales Man</option>
                      {dropdownData.salesmen.map(man => (
                        <option key={man.id} value={man.id}>{man.name}</option>
                      ))}
                    </select>
                  </div> */}
                </div>
              </div>

              {/* ROW 4: Discount A, B, C, Tax Status, NTN, CNIC */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">Discounts & Tax Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount A (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discountA}
                      onChange={(e) => handleFieldChange('discountA', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount B (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discountB}
                      onChange={(e) => handleFieldChange('discountB', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Discount C (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={formData.discountC}
                      onChange={(e) => handleFieldChange('discountC', parseFloat(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Status</label>
                    <div className="flex space-x-2 mt-2">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="taxStatus"
                          checked={formData.taxStatus === true}
                          onChange={() => handleFieldChange('taxStatus', true)}
                          className="mr-1"
                          disabled={loading.submit}
                        />
                        <span className="text-xs">Registered</span>
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="taxStatus"
                          checked={formData.taxStatus === false}
                          onChange={() => handleFieldChange('taxStatus', false)}
                          className="mr-1"
                          disabled={loading.submit}
                        />
                        <span className="text-xs">Unregistered</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">NTN</label>
                    <input
                      type="text"
                      value={formData.ntn}
                      onChange={(e) => handleFieldChange('ntn', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="NTN number"
                      disabled={loading.submit}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CNIC</label>
                    <input
                      type="text"
                      value={formData.cnic}
                      onChange={(e) => handleFieldChange('cnic', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="CNIC"
                      disabled={loading.submit}
                    />
                  </div>
                </div>
              </div>

              {/* ROW 5: Transporter + Expense Management + Foreign Currency (if coaType = 7) */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 pb-2 border-b border-gray-200 flex-1">
                    Transporter & Expense Management
                  </h3>
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-lg text-sm font-semibold ml-4">
                    Total: ₨{calculateTotalExpenses().toFixed(2)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 mb-4">
                  {/* Transporter Selection */}
                  <div>
                    <SelectableTable
                      label="Transporter"
                      name="Transporter_ID"
                      value={formData.Transporter_ID}
                      onChange={handleSelectableTableChange}
                      options={transporters.map(t => ({
                        id: t.id,
                        label: t.name,
                        contactPerson: t.contactPerson || '-',
                        phone: t.phone || '-',
                      }))}
                      placeholder="Select Transporter"
                      disabled={loading.submit}
                      displayKey="label"
                      valueKey="id"
                      columns={[
                        { key: 'label', label: 'Name', width: '50%' },
                        { key: 'contactPerson', label: 'Contact', width: '25%' },
                        { key: 'phone', label: 'Phone', width: '25%' }
                      ]}
                      pageSize={8}
                    />
                  </div>

                  {/* Freight Cost */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Freight Cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.freight_crt}
                        onChange={(e) => handleFieldChange('freight_crt', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        disabled={loading.submit}
                      />
                    </div>
                  </div>

                  {/* Labour Cost */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Labour Cost</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.labour_crt}
                        onChange={(e) => handleFieldChange('labour_crt', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        disabled={loading.submit}
                      />
                    </div>
                  </div>

                  {/* Utility Expense */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Utility Expense</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.bility_expense}
                        onChange={(e) => handleFieldChange('bility_expense', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        disabled={loading.submit}
                      />
                    </div>
                  </div>

                  {/* Other Expense */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Other Expense</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.other_expense}
                        onChange={(e) => handleFieldChange('other_expense', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        disabled={loading.submit}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">str</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">₨</span>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.str}
                        onChange={(e) => handleFieldChange('str', parseFloat(e.target.value) || 0)}
                        className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        disabled={loading.submit}
                      />
                    </div>
                  </div>
                  {/* Batch Number */}
                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch No</label>
                    <input
                      type="text"
                      value={formData.batch_no}
                      onChange={(e) => handleFieldChange('batch_no', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="Batch number"
                      disabled={loading.submit}
                    />
                  </div> */}
                  {shouldShowForeignCurrency() && (
                    <div className="grid grid-cols-1 md:grid-cols-1  rounded-lg">
                      <label className="block text-sm font-medium text-yellow-800 ">
                        Foreign Currency
                      </label>
                      <div>

                        <input
                          type="text"
                          value={formData.foreign_currency || ''}
                          onChange={(e) => handleFieldChange('foreign_currency', e.target.value)}
                          className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white"
                          placeholder="Enter foreign currency"
                          disabled={loading.submit}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* CONDITIONAL: Foreign Currency field when coaType = 7 */}
                {/* {shouldShowForeignCurrency() && (
                  <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div>
                      <label className="block text-sm font-medium text-yellow-800 mb-2">
                        🌍 Foreign Currency (COA Type 7)
                      </label>
                      <input
                        type="text"
                        value={formData.foreign_currency || ''}
                        onChange={(e) => handleFieldChange('foreign_currency', e.target.value)}
                        className="w-full px-3 py-2 border border-yellow-300 rounded-lg focus:ring-2 focus:ring-yellow-500 bg-white"
                        placeholder="Enter foreign currency (e.g., USD, EUR, GBP)"
                        disabled={loading.submit}
                      />
                    </div>
                  </div>
                )} */}
              </div>
            </>
          )}

          {/* Message when COA Type doesn't allow editing */}
          {/* {!canEditRemainingFields() && formData.coaTypeId > 0 && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 font-medium">
                ℹ️ Additional fields are only available for COA Types 1, 6, and 7.
                Please select one of these types to configure detailed information.
              </p>
            </div>
          )} */}

          {/* Submit Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              disabled={loading.submit}
              className="w-40 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              {loading.submit ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isEditMode ? 'Updating...' : 'Creating...'}
                </div>
              ) : (
                isEditMode ? 'Update COA' : 'Create COA'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CoaForm;  // ← DEFAULT EXPORT
