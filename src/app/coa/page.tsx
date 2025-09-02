// 'use client';

// import { useState, useEffect } from 'react';

// // Define interfaces for API responses
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
//   acName: string;
//   ch2Id: number;
//   coaTypeId: number;
//   setupName: string;
//   adress: string;
//   city: string;
//   personName: string;
//   mobileNo: string; // Added missing field
//   taxStatus: boolean;  // Boolean: true = registered, false = unregistered
//   ntn: string;
//   cnic: string;
//   salesLimit: string;
//   credit: string;
//   creditDoys: string;
//   salesMan: string;
//   isJvBalance: boolean;
// }

// export default function Page() {
//   // State for API data
//   const [controlHead2List, setControlHead2List] = useState<ControlHead2[]>([]);
//   const [coaTypeList, setCoaTypeList] = useState<CoaType[]>([]);
//   const [salesManList, setSalesManList] = useState<SalesMan[]>([]);
  
//   // Loading states
//   const [loading, setLoading] = useState({
//     ch2: true,
//     coaType: true,
//     salesMan: true
//   });
  
//   // Form state
//   const [formData, setFormData] = useState<CoaFormData>({
//     acName: '',
//     ch2Id: 0,
//     coaTypeId: 0,
//     setupName: '',
//     adress: '',
//     city: '',
//     personName: '',
//     mobileNo: '', // Added missing field
//     taxStatus: false,  // Default to unregistered
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
//     fetchControlHead2();
//     fetchCoaTypes();
//     fetchSalesmen();
//   }, []);

//   // Fetch Control Head 2 data
//   const fetchControlHead2 = async () => {
//     try {
//       setLoading(prev => ({ ...prev, ch2: true }));
//       setApiErrors(prev => ({ ...prev, ch2: '' }));
      
//       console.log('Fetching Control Head 2 data...');
//       const response = await fetch( `http://${window.location.hostname}:5000/api/z-control-head2/get`);
      
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
      
//       // Ensure we're working with an array
//       if (!Array.isArray(data)) {
//         console.warn('Control Head 2 data is not an array:', data);
//         if (data && typeof data === 'object') {
//           // Try to extract array from response
//           const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
//           if (possibleArrays.length > 0) {
//             data = possibleArrays[0];
//           } else {
//             data = [data]; // Convert to single-item array
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
//       setControlHead2List([]); // Reset to empty array on error
//     } finally {
//       setLoading(prev => ({ ...prev, ch2: false }));
//     }
//   };

//   // Fetch COA Types with improved error handling
//   const fetchCoaTypes = async () => {
//     try {
//       setLoading(prev => ({ ...prev, coaType: true }));
//       setApiErrors(prev => ({ ...prev, coaType: '' }));
      
//       console.log('Fetching COA Types data...');
//       const response = await fetch(`http://${window.location.hostname}:5000/api/z-coa-type`);
//       // const response = await fetch('http://localhost:5000/api/z-coa-type');
      
//       console.log('COA Types response status:', response.status);
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch COA Types data: ${response.status}`);
//       }
      
//       // Get response as text first for debugging
//       const text = await response.text();
//       console.log('COA Types raw response:', text);
      
//       // Parse the JSON
//       let data;
//       try {
//         data = text ? JSON.parse(text) : [];
//       } catch (e) {
//         console.error('JSON parse error:', e);
//         throw new Error('Invalid JSON response from COA Types API');
//       }
      
//       // Ensure we're working with an array
//       if (!Array.isArray(data)) {
//         console.warn('COA Types data is not an array:', data);
//         if (data && typeof data === 'object') {
//           // Try to extract array from response
//           if (Array.isArray(data.data)) {
//             data = data.data;
//           } else if (data.coaTypes && Array.isArray(data.coaTypes)) {
//             data = data.coaTypes;
//           } else {
//             // If it's a single object or has other structure
//             const possibleArrays = Object.values(data).filter(val => Array.isArray(val));
//             if (possibleArrays.length > 0) {
//               data = possibleArrays[0];
//             } else {
//               data = [data]; // Convert to single-item array
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
      
//       // Try fallback endpoint
//       try {
//         console.log('Trying fallback endpoint for COA Types...');
//         const fallbackResponse = await fetch('http://localhost:5000/api/z-coa-type/get');
        
//         if (fallbackResponse.ok) {
//           const fallbackData = await fallbackResponse.json();
//           console.log('Fallback response successful:', fallbackData);
//           setCoaTypeList(Array.isArray(fallbackData) ? fallbackData : []);
//         } else {
//           throw new Error('Fallback endpoint also failed');
//         }
//       } catch (fallbackError) {
//         console.error('Fallback endpoint error:', fallbackError);
//         setApiErrors(prev => ({ 
//           ...prev, 
//           coaType: error instanceof Error ? error.message : 'Unknown error' 
//         }));
//         setCoaTypeList([]); // Reset to empty array on error
//       }
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
      
//       // Handle different possible response formats
//       let salesmen: SalesMan[] = [];
      
//       if (Array.isArray(rawData)) {
//         // If it's already an array, use it directly
//         salesmen = rawData;
//       } else if (rawData && typeof rawData === 'object') {
//         // If it's an object with data property
//         if (Array.isArray(rawData.data)) {
//           salesmen = rawData.data;
//         } else if (rawData.salesmen && Array.isArray(rawData.salesmen)) {
//           salesmen = rawData.salesmen;
//         } else {
//           // If it's a single object, convert to array
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
//       setSalesManList([]); // Reset to empty array on error
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

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
    
//     // Basic validation
//     if (!formData.acName.trim()) {
//       setMessage({ type: 'error', text: 'Account Name is required' });
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
      
//       console.log('Submitting form data:', formData);
      
//       // In a real implementation, you would post to your API
//       const response = await fetch(`http://${window.location.hostname}:5000/api/z-coa/create`, {
//         method: 'POST',
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
//         text: 'COA created successfully!'
//       });
      
//       // Reset form after successful submission
//       setFormData({
//         acName: '',
//         ch2Id: 0,
//         coaTypeId: 0,
//         setupName: '',
//         adress: '',
//         city: '',
//         personName: '',
//         mobileNo: '', // Reset mobile number field
//         taxStatus: false,
//         ntn: '',
//         cnic: '',
//         salesLimit: '',
//         credit: '',
//         creditDoys: '',
//         salesMan: '',
//         isJvBalance: false
//       });
      
//     } catch (error: any) {
//       console.error('Error submitting form:', error);
//       setMessage({
//         type: 'error',
//         text: error?.message || 'Failed to create COA'
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Determine if there are any API errors
//   const hasApiErrors = Object.values(apiErrors).some(error => error !== '');

//   // Check if all data is loaded
//   const isLoading = loading.ch2 || loading.coaType || loading.salesMan;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Create Chart of Account</h1>
      
//       {/* Display message */}
//       {message.text && (
//         <div className={`p-4 mb-4 rounded ${
//           message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//         }`}>
//           {message.text}
//         </div>
//       )}
      
//       {/* Display API errors */}
//       {hasApiErrors && (
//         <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
//           <h3 className="font-bold">Warning: Some data failed to load</h3>
//           <ul className="list-disc ml-5 mt-2">
//             {Object.entries(apiErrors).map(([key, error]) => 
//               error ? <li key={key}>{key}: {error}</li> : null
//             )}
//           </ul>
//           <div className="mt-3 flex space-x-3">
//             {apiErrors.ch2 && (
//               <button onClick={fetchControlHead2} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
//                 Retry Control Head 2
//               </button>
//             )}
//             {apiErrors.coaType && (
//               <button onClick={fetchCoaTypes} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
//                 Retry COA Types
//               </button>
//             )}
//             {apiErrors.salesMan && (
//               <button onClick={fetchSalesmen} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
//                 Retry Salesmen
//               </button>
//             )}
//           </div>
//         </div>
//       )}
      
//       {/* Loading state */}
//       {isLoading ? (
//         <div className="flex justify-center items-center h-40">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
//             <p>Loading data...</p>
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded shadow-md">
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Account Name */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Account Name
//                 </label>
//                 <input
//                   type="text"
//                   name="acName"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.acName}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Control Head 2 Dropdown */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Control Head 2
//                 </label>
//                 <select
//                   name="ch2Id"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.ch2Id || ''}
//                   onChange={handleInputChange}
//                   disabled={submitting || controlHead2List.length === 0}
//                   required
//                 >
//                   <option value="">Select Control Head 2</option>
//                   {controlHead2List && controlHead2List.length > 0 ? 
//                     controlHead2List.map(ch2 => (
//                       <option key={ch2.id} value={ch2.id}>
//                         {ch2.zHead2}
//                       </option>
//                     )) : 
//                     <option value="" disabled>No data available</option>
//                   }
//                 </select>
//                 {apiErrors.ch2 && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {apiErrors.ch2}
//                   </p>
//                 )}
//               </div>
              
//               {/* COA Type Dropdown */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   COA Type
//                 </label>
//                 <select
//                   name="coaTypeId"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Setup Name
//                 </label>
//                 <input
//                   type="text"
//                   name="setupName"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.setupName}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Address */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Address
//                 </label>
//                 <input
//                   type="text"
//                   name="adress"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.adress}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* City */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   name="city"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Person Name */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Person Name
//                 </label>
//                 <input
//                   type="text"
//                   name="personName"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.personName}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Mobile Number - ADDED THIS FIELD */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="text"
//                   name="mobileNo"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.mobileNo}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Tax Status Radio Buttons */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Tax Status
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="taxStatus"
//                       className="form-radio"
//                       checked={formData.taxStatus === true}
//                       onChange={() => handleRadioChange('taxStatus', true)}
//                       disabled={submitting}
//                     />
//                     <span className="ml-2">Registered</span>
//                   </label>
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="taxStatus"
//                       className="form-radio"
//                       checked={formData.taxStatus === false}
//                       onChange={() => handleRadioChange('taxStatus', false)}
//                       disabled={submitting}
//                     />
//                     <span className="ml-2">Unregistered</span>
//                   </label>
//                 </div>
//               </div>
              
//               {/* NTN */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   NTN
//                 </label>
//                 <input
//                   type="text"
//                   name="ntn"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.ntn}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* CNIC */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   CNIC
//                 </label>
//                 <input
//                   type="text"
//                   name="cnic"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.cnic}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Sales Limit */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sales Limit
//                 </label>
//                 <input
//                   type="text"
//                   name="salesLimit"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.salesLimit}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Credit */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Credit
//                 </label>
//                 <input
//                   type="text"
//                   name="credit"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.credit}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Credit Days */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Credit Days
//                 </label>
//                 <input
//                   type="text"
//                   name="creditDoys"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.creditDoys}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Sales Man Dropdown */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sales Man
//                 </label>
//                 <select
//                   name="salesMan"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              
//               {/* JV Balance Radio Buttons */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   JV Balance
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="isJvBalance"
//                       className="form-radio"
//                       checked={formData.isJvBalance === true}
//                       onChange={() => handleRadioChange('isJvBalance', true)}
//                       disabled={submitting}
//                     />
//                     <span className="ml-2">Yes</span>
//                   </label>
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="isJvBalance"
//                       className="form-radio"
//                       checked={formData.isJvBalance === false}
//                       onChange={() => handleRadioChange('isJvBalance', false)}
//                       disabled={submitting}
//                     />
//                     <span className="ml-2">No</span>
//                   </label>
//                 </div>
//               </div>
//             </div>
            
//             {/* Submit Button */}
//             <div className="mt-6">
//               <button
//                 type="submit"
//                 className={`w-full py-2 px-4 rounded-md text-white font-medium ${
//                   submitting || hasApiErrors 
//                     ? 'bg-blue-400 cursor-not-allowed' 
//                     : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//                 disabled={submitting || hasApiErrors}
//               >
//                 {submitting ? 'Creating...' : 'Create COA'}
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
//   acName: string;
//   ch1Id: number; // Added Control Head 1
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
//     salesMan: true
//   });
  
//   // Form state
//   const [formData, setFormData] = useState<CoaFormData>({
//     acName: '',
//     ch1Id: 0, // Added Control Head 1
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
//   }, []);

//   // Filter Control Head 2 when Control Head 1 changes
//   useEffect(() => {
//     if (formData.ch1Id) {
//       const filtered = controlHead2List.filter(ch2 => ch2.zHead1Id === Number(formData.ch1Id));
//       setFilteredControlHead2List(filtered);
      
//       // Reset ch2Id if it's not in the filtered list
//       if (!filtered.find(ch2 => ch2.id === formData.ch2Id)) {
//         setFormData(prev => ({ ...prev, ch2Id: 0 }));
//       }
//     } else {
//       setFilteredControlHead2List([]);
//       setFormData(prev => ({ ...prev, ch2Id: 0 }));
//     }
//   }, [formData.ch1Id, controlHead2List]);

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

//   // Handle form submission
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
      
//       console.log('Submitting form data:', formData);
      
//       const response = await fetch(`http://${window.location.hostname}:5000/api/z-coa/create`, {
//         method: 'POST',
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
//         text: 'COA created successfully!'
//       });
      
//       // Reset form after successful submission
//       setFormData({
//         acName: '',
//         ch1Id: 0,
//         ch2Id: 0,
//         coaTypeId: 0,
//         setupName: '',
//         adress: '',
//         city: '',
//         personName: '',
//         mobileNo: '',
//         taxStatus: false,
//         ntn: '',
//         cnic: '',
//         salesLimit: '',
//         credit: '',
//         creditDoys: '',
//         salesMan: '',
//         isJvBalance: false
//       });
      
//       setFilteredControlHead2List([]);
      
//     } catch (error: any) {
//       console.error('Error submitting form:', error);
//       setMessage({
//         type: 'error',
//         text: error?.message || 'Failed to create COA'
//       });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Determine if there are any API errors
//   const hasApiErrors = Object.values(apiErrors).some(error => error !== '');

//   // Check if all data is loaded
//   const isLoading = loading.ch1 || loading.ch2 || loading.coaType || loading.salesMan;

//   return (
//     <div className="container mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-6">Create Chart of Account</h1>
      
//       {/* Display message */}
//       {message.text && (
//         <div className={`p-4 mb-4 rounded ${
//           message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
//         }`}>
//           {message.text}
//         </div>
//       )}
      
//       {/* Display API errors */}
//       {hasApiErrors && (
//         <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4">
//           <h3 className="font-bold">Warning: Some data failed to load</h3>
//           <ul className="list-disc ml-5 mt-2">
//             {Object.entries(apiErrors).map(([key, error]) => 
//               error ? <li key={key}>{key}: {error}</li> : null
//             )}
//           </ul>
//           <div className="mt-3 flex space-x-3">
//             {apiErrors.ch1 && (
//               <button onClick={fetchControlHead1} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
//                 Retry Control Head 1
//               </button>
//             )}
//             {apiErrors.ch2 && (
//               <button onClick={fetchControlHead2} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
//                 Retry Control Head 2
//               </button>
//             )}
//             {apiErrors.coaType && (
//               <button onClick={fetchCoaTypes} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
//                 Retry COA Types
//               </button>
//             )}
//             {apiErrors.salesMan && (
//               <button onClick={fetchSalesmen} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
//                 Retry Salesmen
//               </button>
//             )}
//           </div>
//         </div>
//       )}
      
//       {/* Loading state */}
//       {isLoading ? (
//         <div className="flex justify-center items-center h-40">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-3"></div>
//             <p>Loading data...</p>
//           </div>
//         </div>
//       ) : (
//         <div className="bg-white p-6 rounded shadow-md">
//           <form onSubmit={handleSubmit}>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               {/* Account Name */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Account Name
//                 </label>
//                 <input
//                   type="text"
//                   name="acName"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.acName}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Control Head 1 Dropdown - NEW */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Control Head 1
//                 </label>
//                 <select
//                   name="ch1Id"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              
//               {/* Control Head 2 Dropdown - UPDATED */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Control Head 2
//                 </label>
//                 <select
//                   name="ch2Id"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   COA Type
//                 </label>
//                 <select
//                   name="coaTypeId"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Setup Name
//                 </label>
//                 <input
//                   type="text"
//                   name="setupName"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.setupName}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Address */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Address
//                 </label>
//                 <input
//                   type="text"
//                   name="adress"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.adress}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* City */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   City
//                 </label>
//                 <input
//                   type="text"
//                   name="city"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.city}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Person Name */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Person Name
//                 </label>
//                 <input
//                   type="text"
//                   name="personName"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.personName}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Mobile Number */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Mobile Number
//                 </label>
//                 <input
//                   type="text"
//                   name="mobileNo"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.mobileNo}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Tax Status Radio Buttons */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Tax Status
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="taxStatus"
//                       className="form-radio"
//                       checked={formData.taxStatus === true}
//                       onChange={() => handleRadioChange('taxStatus', true)}
//                       disabled={submitting}
//                     />
//                     <span className="ml-2">Registered</span>
//                   </label>
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="taxStatus"
//                       className="form-radio"
//                       checked={formData.taxStatus === false}
//                       onChange={() => handleRadioChange('taxStatus', false)}
//                       disabled={submitting}
//                     />
//                     <span className="ml-2">Unregistered</span>
//                   </label>
//                 </div>
//               </div>
              
//               {/* NTN */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   NTN
//                 </label>
//                 <input
//                   type="text"
//                   name="ntn"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.ntn}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* CNIC */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   CNIC
//                 </label>
//                 <input
//                   type="text"
//                   name="cnic"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.cnic}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Sales Limit */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sales Limit
//                 </label>
//                 <input
//                   type="text"
//                   name="salesLimit"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.salesLimit}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Credit */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Credit
//                 </label>
//                 <input
//                   type="text"
//                   name="credit"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.credit}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Credit Days */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Credit Days
//                 </label>
//                 <input
//                   type="text"
//                   name="creditDoys"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
//                   value={formData.creditDoys}
//                   onChange={handleInputChange}
//                   disabled={submitting}
//                   required
//                 />
//               </div>
              
//               {/* Sales Man Dropdown */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Sales Man
//                 </label>
//                 <select
//                   name="salesMan"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
              
//               {/* JV Balance Radio Buttons */}
//               <div className="mb-4">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   JV Balance
//                 </label>
//                 <div className="flex space-x-4">
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="isJvBalance"
//                       className="form-radio"
//                       checked={formData.isJvBalance === true}
//                       onChange={() => handleRadioChange('isJvBalance', true)}
//                       disabled={submitting}
//                     />
//                     <span className="ml-2">Yes</span>
//                   </label>
//                   <label className="inline-flex items-center">
//                     <input
//                       type="radio"
//                       name="isJvBalance"
//                       className="form-radio"
//                       checked={formData.isJvBalance === false}
//                       onChange={() => handleRadioChange('isJvBalance', false)}
//                       disabled={submitting}
//                     />
//                     <span className="ml-2">No</span>
//                   </label>
//                 </div>
//               </div>
//             </div>
            
//             {/* Submit Button */}
//             <div className="mt-6">
//               <button
//                 type="submit"
//                 className={`w-full py-2 px-4 rounded-md text-white font-medium ${
//                   submitting || hasApiErrors 
//                     ? 'bg-blue-400 cursor-not-allowed' 
//                     : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//                 disabled={submitting || hasApiErrors}
//               >
//                 {submitting ? 'Creating...' : 'Create COA'}
//               </button>
//             </div>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// }


















































































































































import CoaForm from '@/components/coa/CoaForm'
import React from 'react'

const page = () => {
  return (
    <div>
      <CoaForm/>
      {/* hi */}
    </div>
  )
}

export default page