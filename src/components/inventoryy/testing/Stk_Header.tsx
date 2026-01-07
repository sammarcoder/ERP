// // components/inventoryy/gdn/Stk_Header.tsx
// export default function Stk_Header({ data }: { data: any }) {
//     return (
//         <div>
//              <pre style={{ background: '#f4f4f4', padding: '1rem', overflow: 'auto' }}>
//                  {JSON.stringify(data, null, 2)}
//              </pre>
           
//             {/* <h2>Order Header</h2>
//             <p>Order: {data.Number}</p>
//             <p>Customer: {data.account?.acName}</p>
//             <p>Date: {data.Date}</p>
//             <p>Sub Customer: {data.sub_customer}</p>
//             <p>Sub City: {data.sub_city}</p> */}
//         </div>
//     )
// }





















































// export default function Stk_Header({ data }: { data: any }) {
//   const extractHeader = () => ({
//     ID: data.ID,
//     Date: data.Date,
//     Number: data.Number,
//     COA_ID: data.COA_ID,
//     approved: data.approved,
//     Transporter_ID: data.Transporter_ID,
//     freight_crt: data.freight_crt,
//     labour_crt: data.labour_crt,
//     bility_expense: data.bility_expense,
//     other_expense: data.other_expense,
//     sub_customer: data.sub_customer,
//     sub_city: data.sub_city,
//     is_Note_generated: data.is_Note_generated,
//     account: data.account
//   })

//   return (
//     <div>
//       <h2>Header Data</h2>
//       <pre>{JSON.stringify(extractHeader(), null, 2)}</pre>
//     </div>
//   )
// }








































// working good

// 'use client'

// interface HeaderProps {
//   data: any
//   formData: {
//     Date: string
//     Status: string
//     Purchase_Type?: string
//     Dispatch_Type?: string
//     batchno?: string
//     remarks: string
//   }
//   onFormChange: (data: any) => void
//   isGRN?: boolean  // ✅ ADDED: To differentiate GRN vs GDN
// }

// export default function Stk_Header({ data, formData, onFormChange, isGRN = false }: HeaderProps) {
//   return (
//     <div className="bg-white border rounded-lg p-4 mb-6">
//       <h2 className="text-lg font-semibold mb-4">
//         {isGRN ? 'Purchase Order Information' : 'Sales Order Information'}
//       </h2>
      
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {/* Read-only Order Info */}
//         <div>
//           <label className="text-sm text-gray-500">Order Number</label>
//           <p className="font-medium">{data.Number}</p>
//         </div>
//         <div>
//           <label className="text-sm text-gray-500">
//             {isGRN ? 'Supplier' : 'Customer'}
//           </label>
//           <p className="font-medium">{data.account?.acName || '-'}</p>
//         </div>
//         <div>
//           <label className="text-sm text-gray-500">City</label>
//           <p className="font-medium">{data.sub_city || data.account?.city || '-'}</p>
//         </div>
//         <div>
//           <label className="text-sm text-gray-500">Freight</label>
//           <p className="font-medium">{data.freight_crt || '0'}</p>
//         </div>

//         {/* Editable Fields */}
//         <div>
//           <label className="text-sm text-gray-500">
//             {isGRN ? 'GRN Date' : 'GDN Date'}
//           </label>
//           <input
//             type="date"
//             value={formData.Date}
//             onChange={(e) => onFormChange({ ...formData, Date: e.target.value })}
//             className="w-full border rounded px-2 py-1 mt-1"
//           />
//         </div>

//         <div>
//           <label className="text-sm text-gray-500">Status</label>
//           <select
//             value={formData.Status}
//             onChange={(e) => onFormChange({ ...formData, Status: e.target.value })}
//             className="w-full border rounded px-2 py-1 mt-1"
//           >
//             <option value="UnPost">UnPost</option>
//             <option value="Post">Posted</option>
//           </select>
//         </div>

//         {/* ✅ GRN: Purchase Type */}
//         {isGRN && (
//           <div>
//             <label className="text-sm text-gray-500">Purchase Type</label>
//             <select
//               value={formData.Purchase_Type || 'Local'}
//               onChange={(e) => onFormChange({ ...formData, Purchase_Type: e.target.value })}
//               className="w-full border rounded px-2 py-1 mt-1"
//             >
//               <option value="Local">Local</option>
//               <option value="Foreign">Foreign</option>
//               <option value="Mfg">Manufacturing</option>
//             </select>
//           </div>
//         )}

//         {/* ✅ GDN: Dispatch Type */}
//         {!isGRN && (
//           <div>
//             <label className="text-sm text-gray-500">Dispatch Type</label>
//             <select
//               value={formData.Dispatch_Type || 'Local selling'}
//               onChange={(e) => onFormChange({ ...formData, Dispatch_Type: e.target.value })}
//               className="w-full border rounded px-2 py-1 mt-1"
//             >
//               <option value="Local selling">Local Selling</option>
//             </select>
//           </div>
//         )}

//         {/* ✅ GRN: Batch Number (Required) */}
//         {isGRN && (
//           <div>
//             <label className="text-sm text-gray-500">
//               Batch Number <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={formData.batchno || ''}
//               onChange={(e) => onFormChange({ ...formData, batchno: e.target.value })}
//               placeholder="e.g., BATCH-2024-001"
//               className="w-full border rounded px-2 py-1 mt-1"
//               required
//             />
//           </div>
//         )}

//         <div className="col-span-2">
//           <label className="text-sm text-gray-500">Remarks</label>
//           <input
//             type="text"
//             value={formData.remarks}
//             onChange={(e) => onFormChange({ ...formData, remarks: e.target.value })}
//             className="w-full border rounded px-2 py-1 mt-1"
//             placeholder="Optional remarks..."
//           />
//         </div>
//       </div>
//     </div>
//   )
// }








































//working 2.0

// 'use client'
// import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'

// interface HeaderProps {
//   data: any
//   formData: {
//     Date: string
//     Status: string
//     Purchase_Type?: string
//     Dispatch_Type?: string
//     batchno?: number | null       // ✅ MUST be number or null
//     COA_ID?: number | null        // ✅ MUST be number or null
//     COA_Name?: string
//     remarks: string
//   }
//   onFormChange: (data: any) => void
//   isGRN?: boolean
// }

// export default function Stk_Header({ data, formData, onFormChange, isGRN = false }: HeaderProps) {
  
//   // ✅ Handle COA selection - FORCE integer
//   const handleCoaChange = (selectedId: string | number, selectedOption: any) => {
//     console.log('📋 COA Raw Input:', { selectedId, type: typeof selectedId })
    
//     // ✅ FORCE to integer - no strings allowed
//     let coaIdInt: number | null = null
    
//     if (selectedId) {
//       const parsed = parseInt(String(selectedId), 10)
//       coaIdInt = isNaN(parsed) ? null : parsed
//     }
    
//     const coaName = selectedOption?.name || ''
    
//     console.log('📋 COA Parsed:', { coaIdInt, coaName })
    
//     onFormChange({
//       ...formData,
//       COA_ID: coaIdInt,
//       COA_Name: coaName,
//       batchno: coaIdInt  // ✅ batchno = COA_ID (integer)
//     })
//   }

//   return (
//     <div className="bg-white border rounded-lg p-4 mb-6">
//       <h2 className="text-lg font-semibold mb-4">
//         {isGRN ? 'GRN Information' : 'GDN Information'}
//       </h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Order Info */}
//         <div>
//           <label className="text-sm text-gray-500">Order Number</label>
//           <p className="font-medium">{data.Number}</p>
//         </div>

//         <div>
//           <label className="text-sm text-gray-500">
//             Order {isGRN ? 'Supplier' : 'Customer'}
//           </label>
//           <p className="font-medium text-blue-600">{data.account?.acName || '-'}</p>
//         </div>

//         {/* ✅ COA Selection - This sets the batch */}
//         <div className="col-span-2">
//           <CoaSearchableInput
//             orderType={isGRN ? 'purchase' : 'sales'}
//             value={formData.COA_ID || data.COA_ID}
//             onChange={handleCoaChange}
//             label={isGRN ? 'Supplier *' : 'Customer *'}
//             placeholder={isGRN ? 'Select supplier...' : 'Select customer...'}
//             helperText="Supplier ID will be used as batch number"
//             required
//             size="md"
//             showFilter={true}
//           />
//         </div>

//         {/* ✅ Batch Display - READ ONLY (no manual input!) */}
//         <div className="col-span-2 bg-green-50 border border-green-200 rounded-lg p-3">
//           <label className="text-sm text-green-700 font-medium">
//             Batch Number (Auto-assigned from Supplier ID)
//           </label>
//           <div className="flex items-center gap-4 mt-2">
//             <div className="bg-white border border-green-300 rounded px-4 py-2">
//               <span className="text-2xl font-bold text-green-800">
//                 {formData.batchno ?? '-'}
//               </span>
//             </div>
//             <div className="text-sm text-green-700">
//               {formData.COA_Name || 'Select a supplier above'}
//             </div>
//           </div>
//           {/* ❌ NO MANUAL INPUT FIELD HERE */}
//         </div>

//         {/* Date */}
//         <div>
//           <label className="text-sm text-gray-500">{isGRN ? 'GRN' : 'GDN'} Date</label>
//           <input
//             type="date"
//             value={formData.Date}
//             onChange={(e) => onFormChange({ ...formData, Date: e.target.value })}
//             className="w-full border rounded px-2 py-1.5 mt-1"
//           />
//         </div>

//         {/* Status */}
//         <div>
//           <label className="text-sm text-gray-500">Status</label>
//           <select
//             value={formData.Status}
//             onChange={(e) => onFormChange({ ...formData, Status: e.target.value })}
//             className="w-full border rounded px-2 py-1.5 mt-1"
//           >
//             <option value="UnPost">UnPost</option>
//             <option value="Post">Posted</option>
//           </select>
//         </div>

//         {/* Purchase Type */}
//         {isGRN && (
//           <div>
//             <label className="text-sm text-gray-500">Purchase Type</label>
//             <select
//               value={formData.Purchase_Type || 'Local'}
//               onChange={(e) => onFormChange({ ...formData, Purchase_Type: e.target.value })}
//               className="w-full border rounded px-2 py-1.5 mt-1"
//             >
//               <option value="Local">Local</option>
//               <option value="Foreign">Foreign</option>
//               <option value="Mfg">Manufacturing</option>
//             </select>
//           </div>
//         )}

//         {/* Remarks */}
//         <div className="col-span-2">
//           <label className="text-sm text-gray-500">Remarks</label>
//           <input
//             type="text"
//             value={formData.remarks}
//             onChange={(e) => onFormChange({ ...formData, remarks: e.target.value })}
//             className="w-full border rounded px-2 py-1.5 mt-1"
//             placeholder="Optional remarks..."
//           />
//         </div>
//       </div>
//     </div>
//   )
// }










































































//working 3.0 menas perfect wokring 

// 'use client'
// import { useEffect } from 'react'
// import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'

// interface HeaderProps {
//   data: any
//   formData: {
//     Date: string
//     Status: string
//     Purchase_Type?: string
//     batchno?: number | null
//     COA_ID?: number | null
//     COA_Name?: string
//     remarks: string
//   }
//   onFormChange: (data: any) => void
//   isGRN?: boolean
// }

// export default function Stk_Header({ data, formData, onFormChange, isGRN = false }: HeaderProps) {
  
//   // ✅ Handle COA selection - COA_ID becomes batchno
//   const handleCoaChange = (selectedId: string | number, selectedOption: any) => {
//     console.log('═══════════════════════════════════════════════════')
//     console.log('📋 STK_HEADER: COA SELECTED')
//     console.log('  - Raw ID:', selectedId, typeof selectedId)
//     console.log('  - Option:', selectedOption)
//     console.log('═══════════════════════════════════════════════════')
    
//     const coaIdInt = selectedId ? parseInt(String(selectedId), 10) : null
//     const coaName = selectedOption?.name || ''
    
//     const newFormData = {
//       ...formData,
//       COA_ID: coaIdInt,
//       COA_Name: coaName,
//       batchno: coaIdInt  // batchno = COA_ID (integer)
//     }
    
//     console.log('📋 New Form Data:', newFormData)
//     onFormChange(newFormData)
//   }

//   return (
//     <div className="bg-white border rounded-lg p-4 mb-6">
//       <h2 className="text-lg font-semibold mb-4">
//         {isGRN ? '📥 GRN Header' : '📤 GDN Header'}
//       </h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Order Info (Read-only) */}
//         <div className="bg-gray-50 p-3 rounded">
//           <label className="text-xs text-gray-500">Order Number</label>
//           <p className="font-bold text-lg">{data?.Number || '-'}</p>
//         </div>

//         <div className="bg-gray-50 p-3 rounded">
//           <label className="text-xs text-gray-500">Original {isGRN ? 'Supplier' : 'Customer'}</label>
//           <p className="font-medium">{data?.account?.acName || '-'}</p>
//         </div>

//         {/* COA Selection */}
//         <div className="col-span-2">
//           <CoaSearchableInput
//             orderType={isGRN ? 'purchase' : 'sales'}
//             value={formData.COA_ID || ''}
//             onChange={handleCoaChange}
//             label={isGRN ? 'Supplier *' : 'Customer *'}
//             placeholder={isGRN ? 'Select supplier...' : 'Select customer...'}
//             helperText="Selected ID will be used as batch number"
//             required
//             showFilter={true}
//           />
//         </div>

//         {/* Batch Display */}
//         <div className="col-span-2 bg-green-50 border border-green-200 rounded-lg p-4">
//           <div className="flex items-center gap-4">
//             <div>
//               <label className="text-xs text-green-600">Batch No</label>
//               <p className="text-3xl font-bold text-green-800">
//                 {formData.batchno ?? '-'}
//               </p>
//             </div>
//             <div className="flex-1">
//               <label className="text-xs text-green-600">Batch Source</label>
//               <p className="font-medium text-green-700">
//                 {formData.COA_Name || 'Select supplier above'}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Date */}
//         <div>
//           <label className="text-sm text-gray-500">Date *</label>
//           <input
//             type="date"
//             value={formData.Date}
//             onChange={(e) => onFormChange({ ...formData, Date: e.target.value })}
//             className="w-full border rounded px-3 py-2 mt-1"
//           />
//         </div>

//         {/* Status */}
//         <div>
//           <label className="text-sm text-gray-500">Status</label>
//           <select
//             value={formData.Status}
//             onChange={(e) => onFormChange({ ...formData, Status: e.target.value })}
//             className="w-full border rounded px-3 py-2 mt-1"
//           >
//             <option value="UnPost">UnPost</option>
//             <option value="Post">Posted</option>
//           </select>
//         </div>

//         {/* Purchase Type */}
//         {isGRN && (
//           <div>
//             <label className="text-sm text-gray-500">Purchase Type</label>
//             <select
//               value={formData.Purchase_Type || 'Local'}
//               onChange={(e) => onFormChange({ ...formData, Purchase_Type: e.target.value })}
//               className="w-full border rounded px-3 py-2 mt-1"
//             >
//               <option value="Local">Local</option>
//               <option value="Foreign">Foreign</option>
//               <option value="Mfg">Manufacturing</option>
//             </select>
//           </div>
//         )}

//         {/* Remarks */}
//         <div className="col-span-2">
//           <label className="text-sm text-gray-500">Remarks</label>
//           <input
//             type="text"
//             value={formData.remarks}
//             onChange={(e) => onFormChange({ ...formData, remarks: e.target.value })}
//             className="w-full border rounded px-3 py-2 mt-1"
//             placeholder="Optional remarks..."
//           />
//         </div>
//       </div>
//     </div>
//   )
// }















































































// components/grn/Stk_Header.tsx

'use client'
import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
import { Input } from '@/components/ui/Input'
import { Calendar, FileText, Truck, MessageSquare, Tag } from 'lucide-react'

interface HeaderProps {
  data: any
  formData: {
    Date: string
    Status: string
    Purchase_Type?: string
    Dispatch_Type?: string
    batchno?: number | null
    COA_ID?: number | null
    COA_Name?: string
    remarks: string
  }
  onFormChange: (data: any) => void
  isGRN?: boolean
}

export default function Stk_Header({ data, formData, onFormChange, isGRN = false }: HeaderProps) {
  
  // Handle COA selection - COA_ID becomes batchno
  const handleCoaChange = (selectedId: string | number, selectedOption: any) => {
    const coaIdInt = selectedId ? parseInt(String(selectedId), 10) : null
    const coaName = selectedOption?.name || ''
    
    onFormChange({
      ...formData,
      COA_ID: coaIdInt,
      COA_Name: coaName,
      batchno: coaIdInt
    })
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <FileText className="w-5 h-5 text-[#4c96dc]" />
        {isGRN ? 'GRN Details' : 'GDN Details'}
      </h2>

      <div className="grid grid-cols-1 h-18 md:grid-cols-2 lg:grid-cols-5 gap-5">
        {/* COA Selection */}
        <div className="lg:col-span-2">
          <CoaSearchableInput
            orderType={isGRN ? 'purchase' : 'sales'}
            value={formData.COA_ID || ''}
            onChange={handleCoaChange}
            label={isGRN ? 'Supplier' : 'Customer'}
            placeholder={isGRN ? 'Select supplier...' : 'Select customer...'}
            helperText="ID will be used as batch number"
            required
            showFilter={true}
          />
        </div>

        {/* Batch Number Display */}
        {/* <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <Tag className="w-4 h-4 inline mr-1" />
            Batch Number
          </label>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-4xl font-bold text-green-700">
                  {formData.batchno || '-'}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs text-green-600">Source</span>
                <p className="font-medium text-green-800 truncate max-w-[150px]">
                  {formData.COA_Name || 'Select supplier'}
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Date */}
        <div>
          <Input
            type="date"
            label="Date"
            value={formData.Date}
            onChange={(e) => onFormChange({ ...formData, Date: e.target.value })}
            icon={<Calendar className="w-4 h-4" />}
            required
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={formData.Status}
            onChange={(e) => onFormChange({ ...formData, Status: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#4c96dc] focus:border-[#4c96dc] transition-colors"
          >
            <option value="UnPost">UnPost</option>
            <option value="Post">Posted</option>
          </select>
        </div>

        {/* Purchase/Dispatch Type */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {isGRN ? 'Purchase Type' : 'Dispatch Type'}
          </label>
          <select
            value={isGRN ? (formData.Purchase_Type || 'Local') : (formData.Dispatch_Type || 'Local selling')}
            onChange={(e) => onFormChange({ 
              ...formData, 
              [isGRN ? 'Purchase_Type' : 'Dispatch_Type']: e.target.value 
            })}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-[#4c96dc] focus:border-[#4c96dc] transition-colors"
          >
            {isGRN ? (
              <>
                <option value="Local">Local</option>
                <option value="Foreign">Foreign</option>
                <option value="Mfg">Manufacturing</option>
              </>
            ) : (
              <option value="Local selling">Local Selling</option>
            )}
          </select>
        </div> */}

        {/* Remarks */}
        <div>
          <Input
            type="text"
            label="Remarks"
            value={formData.remarks}
            onChange={(e) => onFormChange({ ...formData, remarks: e.target.value })}
            placeholder="Optional remarks..."
            icon={<MessageSquare className="w-4 h-4" />}
          />
        </div>
      </div>
    </div>
  )
}
