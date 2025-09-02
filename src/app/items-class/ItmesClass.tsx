// import React, { useState } from 'react'

// const ItmesClass = () => {

//     interface ClassData {
//         classId: number | null;
//         className: string;
//     }
//     const [uomData, setUomData] = useState<ClassData>({
//         classId: null,
//         uom: ''

//     })
//     const classIds = [1, 2, 3, 4]
//     const checkValue = async (event: React.ChangeEvent<HTMLSelectElement>) => {
//         try {
//             const newValue: number = Number(event.target.value)
//             setUomData(prevData => ({
//                 ...prevData,
//                 classId: newValue
//             }))
//             console.log(uomData)
//         } catch (err: any) { console.log(err.message) }
//     }
//     const handlePostRequest = async () => {
//         const url = `http://${window.location.hostname}:5000/api/items-class/create`
//     }
//     return (
//         <div>
//             <select onChange={checkValue}>
//                 {classIds.map(item => (
//                     <option key={item} value={item}>{item}</option>
//                 ))}
//             </select>
//             <input name='uom' value={uomData.uom} />
//         </div>
//     )
// }

// export default ItmesClass
















































// import React, { useState } from 'react';

// interface ClassData {
//   classId: number | null;  // Changed to string for easier handling
//   uom: string;
// }

// const ItemsClass = () => {
//   const [formData, setFormData] = useState<ClassData>({
//     classId: null,
//     uom: ''
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');
  
//   const classIds = [1, 2, 3, 4];

//   // Single handler for all form inputs
//   const handleInputChange = (event: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
//     const { name, value } = event.target;
    
//     setFormData(prevData => ({
//       ...prevData,
//       [name]: value
//     }));
//   };

//   // Submit handler
//   const handleSubmit = async (event: React.FormEvent) => {
//     event.preventDefault();
    
//     // Validation
//     if (!formData.classId || !formData.uom.trim()) {
//       setMessage('Please fill all fields');
//       return;
//     }

//     try {
//       setLoading(true);
//       setMessage('');

//       const response = await fetch(
//         `http://${window.location.hostname}:5000/api/items-class/create`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({
//             classId: Number(formData.classId),  // Convert to number for API
//             uom: formData.uom
//           }),
//         }
//       );

//       if (!response.ok) throw new Error('Failed to save');

//       setMessage('Data saved successfully!');
      
//       // Reset form
//       setFormData({
//         classId: null,
//         uom: ''
//       });
      
//     } catch (err: any) {
//       setMessage('Error: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={{ padding: '20px', maxWidth: '400px' }}>
//       <h3>Items Class Form</h3>
      
//       {/* Class ID Dropdown */}
//       <div style={{ marginBottom: '15px' }}>
//         <label>
//           Class ID:
//           <select 
//             name="classId"  // Important: name attribute
//             value={formData.classId} 
//             onChange={handleInputChange}
//             style={{ 
//               width: '100%', 
//               padding: '8px',
//               marginTop: '5px'
//             }}
//           >
//             <option value="">Select Class ID</option>
//             {classIds.map(item => (
//               <option key={item} value={item}>
//                 Class {item}
//               </option>
//             ))}
//           </select>
//         </label>
//       </div>

//       {/* UOM Input */}
//       <div style={{ marginBottom: '15px' }}>
//         <label>
//           UOM:
//           <input 
//             type="text"
//             name="uom"  // Important: name attribute
//             value={formData.uom}
//             onChange={handleInputChange}
//             placeholder="Enter UOM (e.g., kg, pcs)"
//             style={{ 
//               width: '100%', 
//               padding: '8px',
//               marginTop: '5px'
//             }}
//           />
//         </label>
//       </div>

//       {/* Submit Button */}
//       <button 
//         type="submit"
//         disabled={loading}
//         style={{ 
//           width: '100%',
//           padding: '10px',
//           backgroundColor: loading ? '#ccc' : '#007bff',
//           color: 'white',
//           border: 'none',
//           borderRadius: '4px',
//           cursor: loading ? 'not-allowed' : 'pointer'
//         }}
//       >
//         {loading ? 'Saving...' : 'Save Data'}
//       </button>

//       {/* Message */}
//       {message && (
//         <div style={{ 
//           marginTop: '15px',
//           padding: '10px',
//           color: message.includes('success') ? 'green' : 'red'
//         }}>
//           {message}
//         </div>
//       )}
//     </form>
//   );
// };

// export default ItemsClass;

















































// 'use client'


// import React from 'react';
// import  { useState, ChangeEvent, FormEvent } from 'react'

// interface FormData {
//   classId: number | null;  // Changed to number
//   uom: string;
// }

// type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// const ItemsClass: React.FC = () => {
//   const [formData, setFormData] = useState<FormData>({
//     classId: null,  // null for no selection
//     uom: ''
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   // Type-safe generic handler
//   const handleChange = <T extends InputElement>(e: ChangeEvent<T>): void => {
//     const { name, value } = e.target;
    
//     setFormData(prevState => ({
//       ...prevState,
//       [name]: name === 'classId' ? (value ? Number(value) : null) : value
//     }));
//   };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
//     e.preventDefault();
    
//     // Validation
//     if (!formData.classId || !formData.uom) {
//       setMessage('Please fill all fields');
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setMessage('');
      
//       const response = await fetch(
//         `http://${window.location.hostname}:5000/api/items-class/create`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(formData), // classId is already a number
//         }
//       );

//       if (!response.ok) throw new Error('Failed to save');
      
//       const result = await response.json();
//       console.log('Success:', result);
      
//       setMessage('Data saved successfully!');
      
//       // Reset form
//       setFormData({
//         classId: null,
//         uom: ''
//       });
      
//     } catch (err: any) {
//       console.error('Error:', err);
//       setMessage('Error: ' + err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <select 
//         name="classId" 
//         value={formData.classId || ''} 
//         onChange={handleChange}
//       >
//         <option value="">Select Class</option>
//         {[1, 2, 3, 4].map(id => (
//           <option key={id} value={id}>{`Class ${id}`}</option>
//         ))}
//       </select>

//       <input 
//         type="text"
//         name="uom" 
//         value={formData.uom} 
//         onChange={handleChange}
//         placeholder="Enter UOM"
//       />

//       <button type="submit" disabled={loading}>
//         {loading ? 'Saving...' : 'Save'}
//       </button>
      
//       {message && <p>{message}</p>}
//     </form>
//   );
// };

// export default ItemsClass;































































// 'use client'

// import React, { useState, ChangeEvent, FormEvent } from 'react'

// // Explicit interface declaration
// interface FormData {
//   classId: number | null;
//   uom: string;
// }

// // Type alias for form elements
// type InputElement = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

// // Explicitly typed functional component
// const ItemsClass: React.FC = (): JSX.Element => {
//   // Explicitly typed state
//   const [formData, setFormData] = useState<FormData>({
//     classId: null,
//     uom: ''
//   });
  
//   const [loading, setLoading] = useState<boolean>(false);
//   const [message, setMessage] = useState<string>('');

//   // Explicitly typed handler with generics
//   const handleChange = <T extends InputElement>(
//     e: ChangeEvent<T>
//   ): void => {
//     const { name, value }: { name: string; value: string } = e.target;
    
//     setFormData((prevState: FormData): FormData => ({
//       ...prevState,
//       [name]: name === 'classId' ? (value ? Number(value) : null) : value
//     }));
//   };

//   // Explicitly typed async function
//   const handleSubmit = async (
//     e: FormEvent<HTMLFormElement>
//   ): Promise<void> => {
//     e.preventDefault();
    
//     // Type guard
//     if (!formData.classId || !formData.uom) {
//       setMessage('Please fill all fields');
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setMessage('');
      
//       const response: Response = await fetch(
//         `http://${window.location.hostname}:5000/api/z-uom/create`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (!response.ok) throw new Error('Failed to save');
      
//       const result: any = await response.json();
//       console.log('Success:', result);
      
//       setMessage('Data saved successfully!');
      
//       // Reset with proper typing
//       setFormData({
//         classId: null,
//         uom: ''
//       });
      
//     } catch (err: unknown) {
//       const error = err as Error;
//       console.error('Error:', error);
//       setMessage(`Error: ${error.message}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Explicitly typed array
//   const classOptions: number[] = [1, 2, 3, 4];

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-md mx-auto">
//         <div className="bg-white shadow-xl rounded-lg p-8">
//           <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
//             Items Class Form
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Class ID <span className="text-red-500">*</span>
//               </label>
//               <select 
//                 name="classId" 
//                 value={formData.classId ?? ''} 
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Class</option>
//                 {classOptions.map((id: number) => (
//                   <option key={id} value={id}>
//                     Class {id}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 UOM <span className="text-red-500">*</span>
//               </label>
//               <input 
//                 type="text"
//                 name="uom" 
//                 value={formData.uom} 
//                 onChange={handleChange}
//                 placeholder="Enter UOM"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <button 
//               type="submit" 
//               disabled={loading}
//               className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
//                 ${loading 
//                   ? 'bg-gray-400 cursor-not-allowed' 
//                   : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//             >
//               {loading ? 'Saving...' : 'Save Data'}
//             </button>
//           </form>
          
//           {message && (
//             <div className={`mt-4 p-3 rounded-md text-sm
//               ${message.includes('success') 
//                 ? 'bg-green-100 text-green-700' 
//                 : 'bg-red-100 text-red-700'
//               }`}
//             >
//               {message}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItemsClass;




















































// 'use client'

// import React, { useState } from 'react'

// interface FormData {
//   classId: number | null;
//   uom: string;
// }

// const ItemsClass = () => {
//   const [formData, setFormData] = useState<FormData>({
//     classId: null,
//     uom: ''
//   });
  
//   const [loading, setLoading] = useState(false);
//   const [message, setMessage] = useState('');

//   // Simplified handler - no generics needed
//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
//     const { name, value } = e.target;
    
//     setFormData(prev => ({
//       ...prev,
//       [name]: name === 'classId' ? (value ? Number(value) : null) : value
//     }));
//   };

//   // Simplified submit - no explicit return type needed
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.classId || !formData.uom) {
//       setMessage('Please fill all fields');
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setMessage('');
      
//       const response = await fetch(
//         `http://${window.location.hostname}:5000/api/z-uom/create`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify(formData),
//         }
//       );

//       if (!response.ok) throw new Error('Failed to save');
      
//       const result = await response.json();
//       console.log('Success:', result);
      
//       setMessage('Data saved successfully!');
//       setFormData({ classId: null, uom: '' });
      
//     } catch (err) {
//       console.error('Error:', err);
//       setMessage('Error: Failed to save data');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const classOptions = [1, 2, 3, 4];

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4">
//       <div className="max-w-md mx-auto">
//         <div className="bg-white shadow-xl rounded-lg p-8">
//           <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
//             Items Class Form
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Class ID <span className="text-red-500">*</span>
//               </label>
//               <select 
//                 name="classId" 
//                 value={formData.classId ?? ''} 
//                 onChange={handleChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="">Select Class</option>
//                 {classOptions.map(id => (
//                   <option key={id} value={id}>
//                     Class {id}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 UOM <span className="text-red-500">*</span>
//               </label>
//               <input 
//                 type="text"
//                 name="uom" 
//                 value={formData.uom} 
//                 onChange={handleChange}
//                 placeholder="Enter UOM"
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>

//             <button 
//               type="submit" 
//               disabled={loading}
//               className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
//                 ${loading 
//                   ? 'bg-gray-400 cursor-not-allowed' 
//                   : 'bg-blue-600 hover:bg-blue-700'
//                 }`}
//             >
//               {loading ? 'Saving...' : 'Save Data'}
//             </button>
//           </form>
          
//           {message && (
//             <div className={`mt-4 p-3 rounded-md text-sm
//               ${message.includes('success') 
//                 ? 'bg-green-100 text-green-700' 
//                 : 'bg-red-100 text-red-700'
//               }`}
//             >
//               {message}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItemsClass;






























































































'use client'

import React, { useState } from 'react'

interface FormData {
  classId: number | null;
  className: string;
}

const ItemsClass = () => {
  const [formData, setFormData] = useState<FormData>({
    classId: null,
    className: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Simplified handler - no generics needed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'classId' ? (value ? Number(value) : null) : value
    }));
  };

  // Simplified submit - no explicit return type needed
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.classId || !formData.className) {
      setMessage('Please fill all fields');
      return;
    }
    
    try {
      setLoading(true);
      setMessage('');
      
      const response = await fetch(
        `http://${window.location.hostname}:5000/api/z-classes/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error('Failed to save');
      
      const result = await response.json();
      console.log('Success:', result);
      
      setMessage('Data saved successfully!');
      setFormData({ classId: null, className: '' });
      
    } catch (err) {
      console.error('Error:', err);
      setMessage('Error: Failed to save data');
    } finally {
      setLoading(false);
    }
  };

  const classOptions = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Items Class Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class ID <span className="text-red-500">*</span>
              </label>
              <select 
                name="classId" 
                value={formData.classId ?? ''} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Class</option>
                {classOptions.map(id => (
                  <option key={id} value={id}>
                    Class {id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                className <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                name="className" 
                value={formData.className} 
                onChange={handleChange}
                placeholder="Enter className"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? 'Saving...' : 'Save Data'}
            </button>
          </form>
          
          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm
              ${message.includes('success') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemsClass;
