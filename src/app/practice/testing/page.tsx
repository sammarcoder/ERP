// 'use client'

// import React, { useState } from 'react'
// import { Input } from '@/components/ui/Input'
// import { Calendar, DollarSign, User, Mail, Lock, Package } from 'lucide-react'

// const InputTestingSuite = () => {
//     const [formData, setFormData] = useState({
//         // Type tests
//         text: '',
//         date: '',
//         amount: '123456.78',
//         number: '42',
//         email: 'john@example.com',
//         password: 'password123',

//         // Variant tests
//         // defaultVariant: 'Default variant',
//         // filledVariant: 'Filled variant',
//         // outlinedVariant: 'Outlined variant',

//         // // Size tests
//         // smallInput: 'Small size',
//         // mediumInput: 'Medium size',
//         // largeInput: 'Large size',

//         // // Status tests
//         // errorInput: 'This has error',
//         // successInput: 'This is success',

//         // // Required test
//         // requiredField: '',

//         // // Max width tests
//         // maxWidthSm: 'Max width sm',
//         // maxWidthMd: 'Max width md',
//         // maxWidthLg: 'Max width lg',
//         // maxWidthXl: 'Max width xl',
//         // maxWidth86: 'Max width 86'
//     })

//     const [errors, setErrors] = useState({
//         errorInput: 'This field has an error',
//         requiredField: 'This field is required'
//     })

//     const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData(prev => ({
//             ...prev,
//             [field]: e.target.value
//         }))

//         // Clear error when user types
//         if (errors[field as keyof typeof errors]) {
//             setErrors(prev => ({
//                 ...prev,
//                 [field]: ''
//             }))
//         }
//     }

//     const handleSubmit = (e: React.FormEvent) => {
//         e.preventDefault()
//         console.log('Form Data:', formData)
//     }

//     return (
//         <div className="max-w-6xl mx-auto p-8 space-y-12">
//             <h1 className="text-4xl font-bold text-gray-900 mb-8">Input Component Testing Suite</h1>

//             <form onSubmit={handleSubmit} className="space-y-12">

//                 {/* === INPUT TYPES TESTING === */}
//                 <section className="bg-white p-8 border rounded-xl shadow-sm">
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-6"> Input Types Testing</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//                         <Input
//                             type="text"
//                             label="Text Input"
//                             required
//                             value={formData.text}
//                             onChange={handleChange('text')}
//                             placeholder="Enter text"
//                             helperText="Regular text input"
//                             icon={<User />}
//                         />

//                         <Input
//                             type="date"
//                             label="Date Input"
//                             required
//                             value={formData.date}
//                             onChange={handleChange('date')}
//                             helperText="Shows custom format: DD/MMM/YY"
//                             icon={<Calendar />}
//                         />

//                         <Input
//                             type="amount"
//                             label="Amount Input"
//                             value={formData.amount}
//                             onChange={handleChange('amount')}
//                             placeholder="0.00"
//                             helperText="Auto-formats with commas"
//                             icon={<DollarSign />}
//                         />

//                         <Input
//                             type="number"
//                             label="Number Input"
//                             value={formData.number}
//                             onChange={handleChange('number')}
//                             placeholder="0"
//                             helperText="No stepper arrows"
//                         />

//                         <Input
//                             type="email"
//                             label="Email Input"
//                             value={formData.email}
//                             onChange={handleChange('email')}
//                             placeholder="email@example.com"
//                             helperText="Email validation"
//                             icon={<Mail />}
//                         />

//                         <Input
//                             type="password"
//                             label="Password Input"
//                             value={formData.password}
//                             onChange={handleChange('password')}
//                             placeholder="Enter password"
//                             helperText="Hidden text input"
//                             icon={<Lock />}
//                         />
//                     </div>

//                     {/* <div className="mt-4 p-4 bg-gray-50 rounded-lg">
//                         <h3 className="font-medium text-gray-700 mb-2">Current Values:</h3>
//                         <pre className="text-xs text-gray-600 overflow-x-auto">
//                             {JSON.stringify({
//                                 text: formData.text,
//                                 date: formData.date,
//                                 amount: formData.amount,
//                                 number: formData.number,
//                                 email: formData.email,
//                                 password: '***hidden***'
//                             }, null, 2)}
//                         </pre>
//                     </div> */}
//                 </section>

//                 {/* === VARIANTS TESTING === */}
//                 <section className="bg-white p-8 border rounded-xl shadow-sm">
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-6"> Variant Testing</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//                         <Input
//                             variant="default"
//                             label="Default Variant"
//                             value={formData.defaultVariant}
//                             onChange={handleChange('defaultVariant')}
//                             placeholder="Default styling"
//                             helperText="White background, border"
//                         />

//                         <Input
//                             variant="filled"
//                             label="Filled Variant"
//                             value={formData.filledVariant}
//                             onChange={handleChange('filledVariant')}
//                             placeholder="Filled styling"
//                             helperText="Gray background, no border"
//                         />

//                         <Input
//                             variant="outlined"
//                             label="Outlined Variant"
//                             value={formData.outlinedVariant}
//                             onChange={handleChange('outlinedVariant')}
//                             placeholder="Outlined styling"
//                             helperText="Transparent, thick border"
//                         />
//                     </div>
//                 </section>

//                 {/* === SIZE TESTING === */}
//                 <section className="bg-white p-8 border rounded-xl shadow-sm">
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-6"> Size Testing</h2>
//                     <div className="space-y-6">

//                         <Input
//                             size="sm"
//                             label="Small Size"
//                             value={formData.smallInput}
//                             onChange={handleChange('smallInput')}
//                             placeholder="Small input"
//                             helperText="px-3 py-1.5 text-sm"
//                             icon={<Package />}
//                         />

//                         <Input
//                             size="md"
//                             label="Medium Size (Default)"
//                             value={formData.mediumInput}
//                             onChange={handleChange('mediumInput')}
//                             placeholder="Medium input"
//                             helperText="px-4 py-2 text-sm"
//                             icon={<Package />}
//                         />

//                         <Input
//                             size="lg"
//                             label="Large Size"
//                             value={formData.largeInput}
//                             onChange={handleChange('largeInput')}
//                             placeholder="Large input"
//                             helperText="px-6 py-3 text-base"
//                             icon={<Package />}
//                         />
//                     </div>
//                 </section>

//                 {/* === STATUS TESTING === */}
//                 <section className="bg-white p-8 border rounded-xl shadow-sm">
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-6"> Status Testing</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

//                         <Input
//                             status="default"
//                             label="Default Status"
//                             value="Normal input"
//                             onChange={() => { }}
//                             helperText="Default blue focus ring"
//                         />

//                         <Input
//                             status="error"
//                             label="Error Status"
//                             value={formData.errorInput}
//                             onChange={handleChange('errorInput')}
//                             error={errors.errorInput}
//                             helperText="Red border and focus ring"
//                         />

//                         <Input
//                             status="success"
//                             label="Success Status"
//                             value={formData.successInput}
//                             onChange={handleChange('successInput')}
//                             helperText="Green border and focus ring"
//                         />
//                     </div>
//                 </section>

//                 {/* === MAX WIDTH TESTING === */}
//                 <section className="bg-white p-8 border rounded-xl shadow-sm">
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-6"> Max Width Testing</h2>
//                     <div className="space-y-6">

//                         <Input
//                             maxWidth="sm"
//                             label="Max Width SM (20rem)"
//                             value={formData.maxWidthSm}
//                             onChange={handleChange('maxWidthSm')}
//                             placeholder="Max width small"
//                             helperText="max-w-xs (20rem)"
//                         />

//                         <Input
//                             maxWidth="md"
//                             label="Max Width MD (24rem)"
//                             value={formData.maxWidthMd}
//                             onChange={handleChange('maxWidthMd')}
//                             placeholder="Max width medium"
//                             helperText="max-w-sm (24rem)"
//                         />

//                         <Input
//                             maxWidth="lg"
//                             label="Max Width LG (28rem)"
//                             value={formData.maxWidthLg}
//                             onChange={handleChange('maxWidthLg')}
//                             placeholder="Max width large"
//                             helperText="max-w-md (28rem)"
//                         />

//                         <Input
//                             maxWidth="xl"
//                             label="Max Width XL (32rem)"
//                             value={formData.maxWidthXl}
//                             onChange={handleChange('maxWidthXl')}
//                             placeholder="Max width extra large"
//                             helperText="max-w-lg (32rem)"
//                         />

//                         <Input
//                             maxWidth="86"
//                             label="Max Width 86 (21.5rem)"
//                             value={formData.maxWidth86}
//                             onChange={handleChange('maxWidth86')}
//                             placeholder="Custom max width 86"
//                             helperText="max-w-86 (21.5rem) - Custom"
//                         />
//                     </div>
//                 </section>

//                 {/* === REQUIRED & VALIDATION === */}
//                 <section className="bg-white p-8 border rounded-xl shadow-sm">
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-6"> Required & Validation Testing</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

//                         <Input
//                             label="Required Field"
//                             value={formData.requiredField}
//                             onChange={handleChange('requiredField')}
//                             required
//                             error={errors.requiredField}
//                             placeholder="This field is required"
//                             helperText="Try submitting empty"
//                         />

//                         <Input
//                             type="email"
//                             label="Email Validation"
//                             value={formData.email}
//                             onChange={handleChange('email')}
//                             required
//                             placeholder="email@example.com"
//                             helperText="Browser validates email format"
//                         />
//                     </div>
//                 </section>

//                 {/* === COMBINATION TESTING === */}
//                 <section className="bg-white p-8 border rounded-xl shadow-sm">
//                     <h2 className="text-2xl font-semibold text-gray-800 mb-6"> Combination Testing</h2>
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

//                         <Input
//                             type="date"
//                             variant="filled"
//                             size="lg"
//                             maxWidth="md"
//                             status="success"
//                             label="Date + Filled + Large"
//                             value="2025-12-25"
//                             onChange={() => { }}
//                             helperText="Multiple props combined"
//                             icon={<Calendar />}
//                         />

//                         <Input
//                             type="amount"
//                             variant="outlined"
//                             size="sm"
//                             maxWidth="86"
//                             label="Amount + Outlined + Small"
//                             value="999999.99"
//                             onChange={() => { }}
//                             helperText="Custom formatting"
//                             icon={<DollarSign />}
//                             required
//                         />

//                         <Input
//                             type="password"
//                             variant="default"
//                             size="md"
//                             status="error"
//                             label="Password + Error"
//                             value="weak"
//                             onChange={() => { }}
//                             error="Password too weak"
//                             icon={<Lock />}
//                             required
//                         />
//                     </div>
//                 </section>

//                 {/* === FORM SUBMISSION === */}
//                 <section className="bg-blue-50 p-8 border border-blue-200 rounded-xl">
//                     <h2 className="text-2xl font-semibold text-blue-800 mb-6"> Form Submission Test</h2>
//                     <div className="flex gap-4">
//                         <button
//                             type="submit"
//                             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//                         >
//                             Submit Form
//                         </button>
//                         <button
//                             type="button"
//                             onClick={() => console.log('Current form data:', formData)}
//                             className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//                         >
//                             Log Form Data
//                         </button>
//                     </div>
//                     <p className="text-blue-700 mt-4 text-sm">
//                         Check browser console for form data output
//                     </p>
//                 </section>
//             </form>

//             {/* === TEST INSTRUCTIONS === */}
//             {/* <section className="bg-yellow-50 p-8 border border-yellow-200 rounded-xl">
//         <h2 className="text-xl font-semibold text-yellow-800 mb-4">📋 Testing Instructions</h2>
//         <div className="space-y-3 text-yellow-700">
//           <div><strong>Date Input:</strong> Click to open calendar, check if shows DD/MMM/YY format when not focused</div>
//           <div><strong>Amount Input:</strong> Type numbers, click away to see comma formatting</div>
//           <div><strong>Number Input:</strong> Verify no stepper arrows are visible</div>
//           <div><strong>Variants:</strong> Compare visual differences between default/filled/outlined</div>
//           <div><strong>Sizes:</strong> Check padding and text size differences</div>
//           <div><strong>Max Width:</strong> Verify containers don't exceed specified widths</div>
//           <div><strong>Status:</strong> Check border colors and icons for error/success</div>
//           <div><strong>Required:</strong> Try submitting with empty required fields</div>
//         </div>
//       </section> */}
//         </div>
//     )
// }

// export default InputTestingSuite












































'use client'

import { useState } from "react"
import { SearchableInput } from "@/components/common/SearchableInput"



// ✅ More realistic ERP data structure
const OrderForm = () => {
  const [formData, setFormData] = useState({
    customerId: '',
    itemId: '',
    transporterId: ''
  })

  // ✅ Sample ERP data
  const customers = [
    { 
      id: 'CUST001', 
      name: 'Malik Traders', 
      description: 'Karachi - Credit Limit: ₹500,000' 
    },
    { 
      id: 'CUST002', 
      name: 'Hassan Electronics', 
      description: 'Lahore - Credit Limit: ₹200,000' 
    },
    { 
      id: 'CUST003', 
      name: 'Modern Stores', 
      description: 'Islamabad - Credit Limit: ₹300,000' 
    },
    { 
      id: 'CUST004', 
      name: 'Malik Traders', 
      description: 'Karachi - Credit Limit: ₹500,000' 
    },
    { 
      id: 'CUST005', 
      name: 'Hassan Electronics', 
      description: 'Lahore - Credit Limit: ₹200,000' 
    },
    { 
      id: 'CUST006', 
      name: 'Modern Stores', 
      description: 'Islamabad - Credit Limit: ₹300,000' 
    },
    { 
      id: 'CUST007', 
      name: 'Malik Traders', 
      description: 'Karachi - Credit Limit: ₹500,000' 
    },
    { 
      id: 'CUST008', 
      name: 'Hassan Electronics', 
      description: 'Lahore - Credit Limit: ₹200,000' 
    },
    { 
      id: 'CUST003', 
      name: 'Modern Stores', 
      description: 'Islamabad - Credit Limit: ₹300,000' 
    },
    { 
      id: 'CUST009', 
      name: 'Malik Traders', 
      description: 'Karachi - Credit Limit: ₹500,000' 
    },
    { 
      id: 'CUST0010', 
      name: 'Hassan Electronics', 
      description: 'Lahore - Credit Limit: ₹200,000' 
    },
    { 
      id: 'CUST0011', 
      name: 'Modern Stores', 
      description: 'Islamabad - Credit Limit: ₹300,000' 
    },
    { 
      id: 'CUST0012', 
      name: 'Malik Traders', 
      description: 'Karachi - Credit Limit: ₹500,000' 
    },
    { 
      id: 'CUST0013', 
      name: 'Hassan Electronics', 
      description: 'Lahore - Credit Limit: ₹200,000' 
    },
    { 
      id: 'CUST0014', 
      name: 'Modern Stores', 
      description: 'Islamabad - Credit Limit: ₹300,000' 
    }
  ]

  const items = [
    { 
      id: 'ITEM001', 
      name: 'Samsung Galaxy S24', 
      description: 'Mobile - Stock: 25 units - ₹75,000' 
    },
    { 
      id: 'ITEM002', 
      name: 'iPhone 15', 
      description: 'Mobile - Stock: 12 units - ₹150,000' 
    },
    { 
      id: 'ITEM003', 
      name: 'HP Laptop Core i7', 
      description: 'Computer - Stock: 8 units - ₹95,000' 
    }
  ]

  const transporters = [
    { 
      id: 'TRANS001', 
      name: 'TCS Express', 
      description: 'Nationwide - Rate: ₹15/kg' 
    },
    { 
      id: 'TRANS002', 
      name: 'Leopards Courier', 
      description: 'Major Cities - Rate: ₹12/kg' 
    }
  ]

  return (
    <div className="max-w-4xl mx-auto p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Sales Order Creation</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ Customer Selection */}
        <SearchableInput
          label="Customer *"
          placeholder="Search customers..."
          options={customers}
          value={formData.customerId}
          onChange={(id, option) => {
            setFormData(prev => ({ ...prev, customerId: id as string }))
            console.log('Selected Customer:', option)
          }}
          variant="default"
          size="md"
          helperText="Select customer for this order"
        />

        {/* ✅ Item Selection */}
        <SearchableInput
          label="Product Item *"
          placeholder="Search products..."
          options={items}
          value={formData.itemId}
          onChange={(id, option) => {
            setFormData(prev => ({ ...prev, itemId: id as string }))
            console.log('Selected Item:', option)
          }}
          variant="default"
          size="md"
          helperText="Choose product for order line"
        />

        {/* ✅ Transporter Selection */}
        <SearchableInput
          label="Transporter"
          placeholder="Search transporters..."
          options={transporters}
          value={formData.transporterId}
          onChange={(id, option) => {
            setFormData(prev => ({ ...prev, transporterId: id as string }))
            console.log('Selected Transporter:', option)
          }}
          variant="filled"
          size="md"
          helperText="Optional - for delivery"
        />
      </div>

      {/* ✅ Form Data Display */}
      <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-3">Order Form Data:</h3>
        <pre className="text-sm text-blue-700">
{JSON.stringify(formData, null, 2)}
        </pre>
      </div>
    </div>
  )
}

export default OrderForm









// const OrderForm = () => {
//   const [selectedCustomer, setSelectedCustomer] = useState('')
//   const [searchTerm, setSearchTerm] = useState('')

//   // ✅ Sample data
//   const customers = [
//     { id: 1, name: 'ABC Corporation', description: 'Karachi, Pakistan' },
//     { id: 2, name: 'XYZ Ltd', description: 'Lahore, Pakistan' },
//     { id: 3, name: 'Global Tech Solutions', description: 'Islamabad, Pakistan' },
//     { id: 4, name: 'Modern Industries', description: 'Faisalabad, Pakistan' }
//   ]

//   return (
//     <div className="space-y-4">
//       {/* ✅ Customer selection */}
//       <SearchableInput
//         label="Select Customer"
//         placeholder="Search customers..."
//         options={customers}
//         value={selectedCustomer}
//         onChange={(id, option) => {
//           setSelectedCustomer(id)
//           console.log('Selected:', option)
//         }}
//         onSearch={setSearchTerm}
//         variant="outlined"
//         size="md"
//         maxWidth="lg"
//         clearable
//         helperText="Type to search or select from dropdown"
//       />

//       {/* ✅ Item selection */}
//       <SearchableInput
//         label="Select Item"
//         options={items}
//         value={selectedItem}
//         onChange={handleItemSelect}
//         variant="filled"
//         loading={itemsLoading}
//         noResultsText="No items found"
//       />
//     </div>
//   )
// }



// export default OrderForm;