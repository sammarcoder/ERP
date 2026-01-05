// 'use client'
// import { eventNames } from 'process'
// import React, { useEffect, useState } from 'react'
// import { email } from 'zod'

// const page = () => {
//     const [data, setData] = useState()

//     useEffect(() => {

//     })
//     const change = (event) => {
//         // const {name, value} = event.target
//         // const Name = name
//         const Value = event.target.value
//         // const newValue = name
//         setData(Value)
//         console.log(newValue)
//         // alert(newVlaue1)
//     }
//     return (
//         <div>
//             {/* <select name='name' onChange={change}>
//                 <option value={1}>1</option>
//                 <option value={2}>2</option>
//             </select> */}
//             <form onChange={change} className=''>
//                 <select>
//                     <option value={1}>1</option>
//                     <option value={2}>2</option>
//                 </select>
//                 <input name='name' onChange={change} value={data} />
//                 <input name='input2' onChange={change} value={data} />
//                 <button value={12}>click</button>
//                 <p value={12}>{data}</p>

//             </form>

//         </div>
//     )
// }

// export default page;

















// Use FormData 

// 'use client'
// import React from 'react'
// import { object } from 'zod'

// const page = () => {

//     const handleSubmit = (event) => {
//         event.preventDefault()
//         const formData = new FormData(event.target)
//         console.log(formData.get('userName'))
//         console.log(formData.get('checki'))
//         const data = Object.fromEntries(formData.entries())
//         console.log(data)
//     }
//     return (
//         <div>
//             <form onSubmit={handleSubmit}>
//                 <input type='text' name='userName' />
//                 <input type='radio' name='checki' />
//                 <button>ccc</button>
//             </form>

//         </div>
//     )
// }

// export default page




// User Server 


// import React from 'react'

// const page = (formData) => {
//     'use server'
//     const handleSubmit = () =>{

//     }

//   return (
//         <div>

//         </div>
//     )
//     }

//     export default page















// export default function Form() {
//   // Create state object manually
//   const [formData, setFormData] = useState({
//     username: '',
//     email: '',
//     country: ''
//   });

//   // Update state on each input change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value  // Dynamic key update
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form data:', formData);
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input 
//         name="username"
//         value={formData.username}
//         onChange={handleChange}
//       />
//       <input 
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//       />
//       <button type="submit">Submit</button>
//     </form>
//   );
// }






























// 'use client';
// import { useState } from 'react';

// export default function ProfessionalForm() {
//   const [errors, setErrors] = useState({});

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     // Get all data at once using FormData
//     const formData = new FormData(e.target);
//     const data = Object.fromEntries(formData.entries());

//     // Validation
//     const newErrors = {};
//     if (!data.username) newErrors.username = 'Required';
//     if (!data.email) newErrors.email = 'Required';

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }

//     console.log('Valid data:', data);

//     // Send to API
//     fetch('/api/submit', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(data)
//     });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <input 
//           name="username"
//           placeholder="Username"
//           className="border p-2 rounded"
//         />
//         {errors.username && <span className="text-red-500">{errors.username}</span>}
//       </div>

//       <div>
//         <input 
//           name="email"
//           type="email"
//           placeholder="Email"
//           className="border p-2 rounded"
//         />
//         {errors.email && <span className="text-red-500">{errors.email}</span>}
//       </div>

//       <select name="country" className="border p-2 rounded">
//         <option value="">Select Country</option>
//         <option value="usa">USA</option>
//         <option value="uk">UK</option>
//       </select>

//       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
//         Submit
//       </button>
//     </form>
//   );
// }























// import React from 'react'
// import ClassFilter from '../../components/ClassFilter'
// const page = () => {
//   return (
//     <div>
//       <ClassFilter/>
//     </div>
//   )
// }

// export default page





// 'use client'
// import React, { useState } from 'react'
// // let count = 2
// const page = () => {
//   const [count, setCount] = useState(1);
//   const increment = () => {
//   setCount(count+1)
// }
//   return (
//     <>
//     <select >
//       <option value={1}>1</option>
//     </select>
//       <div>this is pratice page</div>
//       <p>{count}</p>
//       <button onClick={increment}>click</button>
//     </>
//   )
// }

// export default page





























































// 'use client'
// import React, { useState } from 'react'
// // let count = 2
// const page = () => {
//   const [count, setCount] = useState(1);
//   const increment = () => {
//   setCount(count+1)
// }
//   return (
//     <>
//     <select >
//       <option value={1}>1</option>
//     </select>
//       <div>this is pratice page</div>
//       <p>{count}</p>
//       <button onClick={increment}>click</button>
//     </>
//   )
// }

// export default page



































































































// // app/testing/page.tsx - Updated to prevent duplicate selections
// 'use client'
// import React, { useState } from 'react'
// import { MultiSelectItemTable, ExtractedItemData } from '@/components/common/items/MultiSelectItemTable'
// import { Button } from '@/components/ui/Button'

// export default function TestPage() {
//   const [show, setShow] = useState(false)
//   const [items, setItems] = useState<ExtractedItemData[]>([])
//   const [isPurchase, setIsPurchase] = useState(false)

//   // ✅ Get already added item IDs
//   const alreadyAddedItemIds = items.map(item => item.id)

//   const handleSelectionComplete = (newItems: ExtractedItemData[]) => {
//     console.group('🎯 Adding New Items (Duplicate Prevention)')
//     console.log('New Items:', newItems)
//     console.log('Already Added IDs:', alreadyAddedItemIds)
//     console.log('Preventing Duplicates:', newItems.filter(item => !alreadyAddedItemIds.includes(item.id)))
//     console.groupEnd()

//     // ✅ Filter out any duplicates (extra safety)
//     const uniqueNewItems = newItems.filter(item => !alreadyAddedItemIds.includes(item.id))
//     setItems(prev => [...prev, ...uniqueNewItems])
//   }

//   const removeItem = (indexToRemove: number) => {
//     setItems(prev => prev.filter((_, index) => index !== indexToRemove))
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-6xl mx-auto">
//         {/* <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">Duplicate Prevention Test</h1>
//           <p className="text-gray-600 mt-2">Each item can only be added once to the order</p>
//         </div> */}

//         <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
//           <div className="flex gap-4 mb-4">
//             <Button 
//               variant="primary"
//               onClick={() => {
//                 setIsPurchase(false)
//                 setShow(true)
//               }}
//             >
//               Open Sales Modal
//             </Button>
            
//             <Button 
//               variant="success"
//               onClick={() => {
//                 setIsPurchase(true)
//                 setShow(true)
//               }}
//             >
//               Open Purchase Modal
//             </Button>
            
//             <Button 
//               variant="ghost"
//               onClick={() => setItems([])}
//               disabled={items.length === 0}
//             >
//               Clear All ({items.length})
//             </Button>
//           </div>

       
//         </div>

//         <div className="bg-white rounded-lg shadow-sm p-6">
//           <h2 className="text-xl font-semibold text-gray-900 mb-4">
//             Order Items ({items.length})
//           </h2>

//           {items.length === 0 ? (
//             <div className="text-center py-12 text-gray-500">
//               <p className="text-lg">No items in order yet</p>
//               <p className="text-sm mt-2">Add some items to test duplicate prevention</p>
//             </div>
//           ) : (
//             <div className="space-y-3">
//               {items.map((item, index) => (
//                 <div key={`${item.id}-${index}`} className="flex items-center justify-between p-4 border rounded-lg">
//                   <div>
//                     <h3 className="font-semibold">{item.itemName}</h3>
//                     <p className="text-gray-600">ID: {item.id} | Price: ${item.sellingPrice}</p>
//                     <p className="text-sm text-gray-500">
//                       UOM: {item.uomData.primary.name}
//                       {item.uomData.secondary && ` • ${item.uomData.secondary.qty} ${item.uomData.secondary.name}`}
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
//                       Added to Order
//                     </span>
//                     <Button 
//                       variant="ghost" 
//                       size="sm"
//                       onClick={() => removeItem(index)}
//                     >
//                       Remove
//                     </Button>
//                   </div>
//                 </div>
//               ))}
              
//               <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//                 <p className="text-yellow-800">
//                   <strong>Duplicate Prevention Active:</strong> Items with IDs {alreadyAddedItemIds.join(', ')} 
//                   cannot be selected again in the modal.
//                 </p>
//               </div>
//             </div>
//           )}
//         </div>

//         {show && (
//           <MultiSelectItemTable
//             onSelectionComplete={handleSelectionComplete}
//             onCancel={() => setShow(false)}
//             isPurchase={isPurchase}
//             alreadyAddedItemIds={alreadyAddedItemIds} // ✅ Pass already added IDs
//           />
//         )}
//       </div>
//     </div>
//   )
// }



























































// app/sales/create/page.tsx - Complete Order System
'use client'
import React, { useState } from 'react'
import { OrderHeader } from '@/components/orders/OrderHeader'
import { OrderDetails } from '@/components/orders/OrderDetails'
import { Button } from '@/components/ui/Button'

export default function CreateSalesOrderPage() {
  const [headerData, setHeaderData] = useState({
    date: new Date().toISOString().split('T')[0],
    COA_ID: '',
    Transporter_ID: '',
    Stock_Type_ID: 12,
    discountA: 0,
    discountB: 0,
    discountC: 0,
    freight_crt: 0,
    labour_crt: 0,
    bility_expense: 0,
    other_expense: 0
  })
  
  const [orderDetails, setOrderDetails] = useState([])

  const handleSubmitOrder = () => {
    console.group('🚀 Complete Order Submission')
    console.log('Header Data:', headerData)
    console.log('Order Details:', orderDetails)
    console.log('Total Items:', orderDetails.length)
    console.groupEnd()
    
    // TODO: Submit to API
  }

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Create Sales Order</h1>
        <p className="text-gray-600 mt-2">Complete order management with bulk item selection</p>
      </div>

      {/* ✅ Order Header */}
      <OrderHeader
        orderType="sales"
        value={headerData}
        onChange={setHeaderData}
      />

      {/* ✅ Order Details */}
      <OrderDetails
        headerData={headerData}
        isPurchase={false}
        onChange={setOrderDetails}
      />

      {/* ✅ Submit Order */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          size="lg"
          onClick={handleSubmitOrder}
          disabled={!headerData.COA_ID || orderDetails.length === 0}
        >
          Submit Sales Order ({orderDetails.length} items)
        </Button>
      </div>
    </div>
  )
}
