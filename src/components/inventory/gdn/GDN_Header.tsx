// // components/gdn/GDN_Header.tsx

// 'use client'
// import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
// import { Input } from '@/components/ui/Input'
// import { Calendar, FileText, Truck, MessageSquare, Tag, User } from 'lucide-react'

// interface HeaderProps {
//   data: any
//   formData: {
//     Date: string
//     Status: string
//     Dispatch_Type: string
//     COA_ID: number | null
//     COA_Name: string
//     batchno: number | null
//     remarks: string
//   }
//   onFormChange: (data: any) => void
// }

// export default function GDN_Header({ data, formData, onFormChange }: HeaderProps) {

//   // Handle COA (Customer) selection
//   const handleCoaChange = (selectedId: string | number, selectedOption: any) => {
//     const coaIdInt = selectedId ? parseInt(String(selectedId), 10) : null
//     const coaName = selectedOption?.name || ''

//     onFormChange({
//       ...formData,
//       COA_ID: coaIdInt,
//       COA_Name: coaName,
//       batchno: coaIdInt
//     })
//   }

//   return (
//     <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
//       <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
//         <Truck className="w-5 h-5 text-emerald-600" />
//         GDN Details (Dispatch)
//       </h2>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
//         {/* Customer Selection */}
//         <div className="lg:col-span-2">
//           <CoaSearchableInput
//             orderType="sales"  // ✅ Shows customers
//             value={formData.COA_ID || ''}
//             onChange={handleCoaChange}
//             label="Customer"
//             placeholder="Select customer..."
//             helperText="Customer ID will be used as batch reference"
//             required
//             showFilter={true}
//           />
//         </div>

//         {/* Batch Number Display */}
//         <div className="lg:col-span-2">
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             <Tag className="w-4 h-4 inline mr-1" />
//             Batch Reference
//           </label>
//           <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-xl p-4">
//             <div className="flex items-center justify-between">
//               <div>
//                 <span className="text-4xl font-bold text-emerald-700">
//                   {formData.batchno || '-'}
//                 </span>
//               </div>
//               <div className="text-right">
//                 <span className="text-xs text-emerald-600">Customer</span>
//                 <p className="font-medium text-emerald-800 truncate max-w-[150px]">
//                   {formData.COA_Name || 'Select customer'}
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* GDN Date */}
//         <div>
//           <Input
//             type="date"
//             label="Dispatch Date"
//             value={formData.Date}
//             onChange={(e) => onFormChange({ ...formData, Date: e.target.value })}
//             icon={<Calendar className="w-4 h-4" />}
//             required
//           />
//         </div>

//         {/* Status */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Status
//           </label>
//           <select
//             value={formData.Status}
//             onChange={(e) => onFormChange({ ...formData, Status: e.target.value })}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
//           >
//             <option value="UnPost">UnPost</option>
//             <option value="Post">Posted</option>
//           </select>
//         </div>

//         {/* Dispatch Type */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700 mb-1">
//             Dispatch Type
//           </label>
//           <select
//             value={formData.Dispatch_Type}
//             onChange={(e) => onFormChange({ ...formData, Dispatch_Type: e.target.value })}
//             className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
//           >
//             <option value="Local selling">Local Selling</option>
//             <option value="Export">Export</option>
//             <option value="Inter-branch">Inter-Branch Transfer</option>
//           </select>
//         </div>

//         {/* Remarks */}
//         <div>
//           <Input
//             type="text"
//             label="Remarks"
//             value={formData.remarks}
//             onChange={(e) => onFormChange({ ...formData, remarks: e.target.value })}
//             placeholder="Optional delivery notes..."
//             icon={<MessageSquare className="w-4 h-4" />}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

































// // components/gdn/GDN_Header.tsx

// 'use client'
// import { CoaSearchableInput } from '@/components/common/coa/CoaSearchableInput'
// import { TransporterSearchableInput } from '@/components/common/transpoter/TransporterSearchableInput'
// import { Input } from '@/components/ui/Input'
// import { 
//   Calendar, FileText, Truck, MessageSquare, Tag, User, 
//   MapPin, Building2, CreditCard, DollarSign, BarChart3
// } from 'lucide-react'

// interface HeaderProps {
//   data: any  // Source order data
//   formData: {
//     Date: string
//     Status: string
//     Dispatch_Type: string
//     COA_ID: number | null
//     COA_Name: string
//     remarks: string
//     sub_customer?: string
//     sub_city?: string
//     labour_crt?: string
//     freight_crt?: string
//     other_expense?: string
//     Transporter_ID?: number | null
//     Transporter_Name?: string
//   }
//   onFormChange: (data: any) => void
//   isFromOrder?: boolean
// }

// export default function GDN_Header({ data, formData, onFormChange, isFromOrder = true }: HeaderProps) {

//   // Handle COA (Customer) selection
//   const handleCoaChange = (selectedId: string | number, selectedOption: any) => {
//     const coaIdInt = selectedId ? parseInt(String(selectedId), 10) : null
//     const coaName = selectedOption?.name || ''

//     onFormChange({
//       ...formData,
//       COA_ID: coaIdInt,
//       COA_Name: coaName
//     })
//   }

//   // Handle Transporter selection
//   const handleTransporterChange = (transporterId: string | number, transporter: any) => {
//     onFormChange({
//       ...formData,
//       Transporter_ID: transporterId ? parseInt(String(transporterId), 10) : null,
//       Transporter_Name: transporter?.name || ''
//     })
//   }

//   // Calculate total additional costs
//   const totalAdditionalCosts = (
//     parseFloat(formData.labour_crt || '0') +
//     parseFloat(formData.freight_crt || '0') +
//     parseFloat(formData.other_expense || '0')
//   )

//   return (
//     <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200 rounded-xl p-6 mb-6 shadow-sm">
      
//       {/* Section Title */}
//       <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
//         <Truck className="w-5 h-5 text-emerald-600" />
//         GDN Details (Dispatch)
//       </h2>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* ROW 1: Main Identification */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        
//         {/* Sales Order (Read-only) */}
//         <div>
//           <Input
//             type="text"
//             label="Sales Order"
//             value={data?.Number || (isFromOrder ? 'Loading...' : 'Standalone')}
//             readOnly
//             icon={<FileText className="w-4 h-4" />}
//             className="bg-gray-50"
//           />
//         </div>

//         {/* Customer Selection */}
//         <div className="lg:col-span-2">
//           <CoaSearchableInput
//             orderType="sales"
//             value={formData.COA_ID || ''}
//             onChange={handleCoaChange}
//             label="Customer *"
//             placeholder="Select customer..."
//             required
//             showFilter={true}
//             disabled={isFromOrder}  // Disable if from order
//           />
//         </div>

//         {/* Dispatch Date */}
//         <div>
//           <Input
//             type="date"
//             label="Dispatch Date *"
//             value={formData.Date}
//             onChange={(e) => onFormChange({ ...formData, Date: e.target.value })}
//             icon={<Calendar className="w-4 h-4" />}
//             required
//           />
//         </div>

//         {/* Sub Customer */}
//         <div>
//           <Input
//             type="text"
//             label="Sub Customer"
//             value={formData.sub_customer || data?.sub_customer || ''}
//             onChange={(e) => onFormChange({ ...formData, sub_customer: e.target.value })}
//             icon={<Building2 className="w-4 h-4" />}
//             placeholder="Sub customer name..."
//           />
//         </div>

//         {/* Sub City */}
//         <div>
//           <Input
//             type="text"
//             label="Sub City"
//             value={formData.sub_city || data?.sub_city || ''}
//             onChange={(e) => onFormChange({ ...formData, sub_city: e.target.value })}
//             icon={<MapPin className="w-4 h-4" />}
//             placeholder="Sub city..."
//           />
//         </div>
//       </div>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* ROW 2: Status, Type, Transporter */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
//         {/* Status */}
//         <div>
//           <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
//             <BarChart3 className="w-4 h-4" />
//             Status
//           </label>
//           <select
//             value={formData.Status || 'UnPost'}
//             onChange={(e) => onFormChange({ ...formData, Status: e.target.value })}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
//           >
//             <option value="UnPost">UnPost</option>
//             <option value="Post">Posted</option>
//           </select>
//         </div>

//         {/* Dispatch Type */}
//         <div>
//           <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
//             <Truck className="w-4 h-4" />
//             Dispatch Type
//           </label>
//           <select
//             value={formData.Dispatch_Type || 'Local selling'}
//             onChange={(e) => onFormChange({ ...formData, Dispatch_Type: e.target.value })}
//             className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
//           >
//             <option value="Local selling">Local Selling</option>
//             <option value="Export">Export</option>
//             <option value="Inter-branch">Inter-Branch Transfer</option>
//             <option value="Sample">Sample</option>
//             <option value="Return">Return</option>
//           </select>
//         </div>

//         {/* Transporter */}
//         <div className="lg:col-span-2">
//           <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
//             <Truck className="w-4 h-4" />
//             Transporter
//           </label>
//           <TransporterSearchableInput
//             value={formData.Transporter_ID?.toString() || ''}
//             onChange={handleTransporterChange}
//             placeholder="Select transporter..."
//             className="w-full"
//           />
//         </div>
//       </div>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* ROW 3: Cost Breakdown */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
//       <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
//         <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
//           <DollarSign className="w-4 h-4 text-emerald-600" />
//           Additional Costs
//         </h3>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           {/* Labour Cost */}
//           <div>
//             <Input
//               type="number"
//               label="Labour Cost"
//               value={formData.labour_crt || ''}
//               onChange={(e) => onFormChange({ ...formData, labour_crt: e.target.value })}
//               placeholder="0.00"
//               step="0.01"
//               icon={<User className="w-4 h-4" />}
//             />
//           </div>

//           {/* Freight Cost */}
//           <div>
//             <Input
//               type="number"
//               label="Freight Cost"
//               value={formData.freight_crt || ''}
//               onChange={(e) => onFormChange({ ...formData, freight_crt: e.target.value })}
//               placeholder="0.00"
//               step="0.01"
//               icon={<Truck className="w-4 h-4" />}
//             />
//           </div>

//           {/* Other Expense */}
//           <div>
//             <Input
//               type="number"
//               label="Other Expense"
//               value={formData.other_expense || ''}
//               onChange={(e) => onFormChange({ ...formData, other_expense: e.target.value })}
//               placeholder="0.00"
//               step="0.01"
//               icon={<CreditCard className="w-4 h-4" />}
//             />
//           </div>

//           {/* Total Additional Costs */}
//           <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
//             <label className="text-xs text-emerald-600 font-medium">Total Additional</label>
//             <p className="text-xl font-bold text-emerald-700">
//               {totalAdditionalCosts.toLocaleString('en-US', { minimumFractionDigits: 2 })}
//             </p>
//           </div>
//         </div>
//       </div>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* ROW 4: Remarks */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <Input
//             type="text"
//             label="Remarks"
//             value={formData.remarks || ''}
//             onChange={(e) => onFormChange({ ...formData, remarks: e.target.value })}
//             placeholder="Enter dispatch notes / delivery instructions..."
//             icon={<MessageSquare className="w-4 h-4" />}
//           />
//         </div>

//         {/* Customer Info Display (Read-only) */}
//         <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-3">
//           <div className="flex items-center justify-between">
//             <div>
//               <label className="text-xs text-emerald-600 font-medium">Selected Customer</label>
//               <p className="font-semibold text-emerald-800 text-lg">
//                 {formData.COA_Name || 'Not selected'}
//               </p>
//               {data?.account?.city && (
//                 <p className="text-xs text-emerald-600">{data.account.city}</p>
//               )}
//             </div>
//             <div className="text-right">
//               <label className="text-xs text-emerald-600 font-medium">Customer ID</label>
//               <p className="text-2xl font-bold text-emerald-700">
//                 {formData.COA_ID || '-'}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {/* SOURCE ORDER INFO (if from order) */}
//       {/* ═══════════════════════════════════════════════════════════════ */}
//       {data && isFromOrder && (
//         <div className="mt-6 bg-white rounded-xl p-4 border border-emerald-200">
//           <h4 className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-3">
//             <FileText className="w-4 h-4" />
//             Source Order Information
//           </h4>
//           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//             <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
//               <div className="text-xs text-emerald-600 mb-1">Order Number</div>
//               <div className="font-semibold text-emerald-800">{data.Number || 'N/A'}</div>
//             </div>
//             <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
//               <div className="text-xs text-emerald-600 mb-1">Order Date</div>
//               <div className="font-semibold text-emerald-800">
//                 {data.Date ? new Date(data.Date).toLocaleDateString('en-GB') : 'N/A'}
//               </div>
//             </div>
//             <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
//               <div className="text-xs text-emerald-600 mb-1">Items Count</div>
//               <div className="font-semibold text-emerald-800">{data.details?.length || 0}</div>
//             </div>
//             <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-100">
//               <div className="text-xs text-emerald-600 mb-1">Approved</div>
//               <div className={`font-semibold ${data.approved ? 'text-green-600' : 'text-red-600'}`}>
//                 {data.approved ? '✅ Yes' : '❌ No'}
//               </div>
//             </div>
//           </div>

//           {/* Additional Order Details */}
//           {(data.sub_customer || data.sub_city) && (
//             <div className="mt-3 pt-3 border-t border-emerald-100">
//               <div className="grid grid-cols-2 gap-4 text-sm">
//                 {data.sub_customer && (
//                   <div className="bg-white p-2 rounded border border-emerald-100">
//                     <div className="text-xs text-gray-500">Sub Customer (from Order)</div>
//                     <div className="font-medium text-gray-800">{data.sub_customer}</div>
//                   </div>
//                 )}
//                 {data.sub_city && (
//                   <div className="bg-white p-2 rounded border border-emerald-100">
//                     <div className="text-xs text-gray-500">Sub City (from Order)</div>
//                     <div className="font-medium text-gray-800">{data.sub_city}</div>
//                   </div>
//                 )}
//               </div>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }



















































// components/gdn/GDN_Header.tsx - CUSTOMER IS READ-ONLY FROM ORDER

'use client'
import { TransporterSearchableInput } from '@/components/common/transpoter/TransporterSearchableInput'
import { Input } from '@/components/ui/Input'
import { 
  Calendar, FileText, Truck, MessageSquare, User, 
  MapPin, Building2, CreditCard, DollarSign, BarChart3
} from 'lucide-react'

interface HeaderProps {
  data: any  // Source order data
  formData: {
    Date: string
    Status: string
    Dispatch_Type: string
    COA_ID: number | null
    COA_Name: string
    remarks: string
    sub_customer?: string
    sub_city?: string
    labour_crt?: string
    freight_crt?: string
    other_expense?: string
    Transporter_ID?: number | null
    Transporter_Name?: string
  }
  onFormChange: (data: any) => void
}

export default function GDN_Header({ data, formData, onFormChange }: HeaderProps) {

  const handleTransporterChange = (transporterId: string | number, transporter: any) => {
    onFormChange({
      ...formData,
      Transporter_ID: transporterId ? parseInt(String(transporterId), 10) : null,
      Transporter_Name: transporter?.name || ''
    })
  }

  const totalAdditionalCosts = (
    parseFloat(formData.labour_crt || '0') +
    parseFloat(formData.freight_crt || '0') +
    parseFloat(formData.other_expense || '0')
  )

  return (
    <div className="bg-gradient-to-br from-emerald-50 via-white to-teal-50 border border-emerald-200 rounded-xl p-6 mb-6 shadow-sm">
      
      <h2 className="text-lg font-semibold text-gray-900 mb-5 flex items-center gap-2">
        <Truck className="w-5 h-5 text-emerald-600" />
        GDN Details (Dispatch)
      </h2>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ROW 1: Order & Customer Info (READ-ONLY) */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
        
        {/* Sales Order (Read-only) */}
        <div>
          <label className="text-xs text-gray-500 mb-1 block">Sales Order</label>
          <div className="bg-gray-100 border border-gray-200 rounded-lg px-3 py-2">
            <span className="font-semibold text-emerald-700">{data?.Number || '-'}</span>
          </div>
        </div>

        {/* Customer (Read-only from Order) - NO SELECTION */}
        <div className="lg:col-span-2">
          <label className="text-xs text-gray-500 mb-1 block">Customer (from Order)</label>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
            <div className="font-semibold text-emerald-800">{formData.COA_Name || data?.account?.acName || '-'}</div>
            <div className="text-xs text-emerald-600">ID: {formData.COA_ID || data?.COA_ID || '-'}</div>
          </div>
        </div>

        {/* Dispatch Date */}
        <div>
          <Input
            type="date"
            label="Dispatch Date *"
            value={formData.Date}
            onChange={(e) => onFormChange({ ...formData, Date: e.target.value })}
            icon={<Calendar className="w-4 h-4" />}
            required
          />
        </div>

        {/* Sub Customer */}
        <div>
          <Input
            type="text"
            label="Sub Customer"
            value={formData.sub_customer || ''}
            onChange={(e) => onFormChange({ ...formData, sub_customer: e.target.value })}
            icon={<Building2 className="w-4 h-4" />}
            placeholder="Sub customer..."
          />
        </div>

        {/* Sub City */}
        <div>
          <Input
            type="text"
            label="Sub City"
            value={formData.sub_city || ''}
            onChange={(e) => onFormChange({ ...formData, sub_city: e.target.value })}
            icon={<MapPin className="w-4 h-4" />}
            placeholder="Sub city..."
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ROW 2: Status, Type, Transporter */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        
        {/* Status */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <BarChart3 className="w-4 h-4" />
            Status
          </label>
          <select
            value={formData.Status || 'UnPost'}
            onChange={(e) => onFormChange({ ...formData, Status: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="UnPost">UnPost</option>
            <option value="Post">Posted</option>
          </select>
        </div>

        {/* Dispatch Type */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Truck className="w-4 h-4" />
            Dispatch Type
          </label>
          <select
            value={formData.Dispatch_Type || 'Local selling'}
            onChange={(e) => onFormChange({ ...formData, Dispatch_Type: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="Local selling">Local Selling</option>
            <option value="Export">Export</option>
            <option value="Inter-branch">Inter-Branch Transfer</option>
            <option value="Sample">Sample</option>
          </select>
        </div>

        {/* Transporter */}
        <div className="lg:col-span-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <Truck className="w-4 h-4" />
            Transporter
          </label>
          <TransporterSearchableInput
            value={formData.Transporter_ID?.toString() || ''}
            onChange={handleTransporterChange}
            placeholder="Select transporter..."
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ROW 3: Cost Breakdown */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl p-4 mb-6 border border-gray-100">
        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-emerald-600" />
          Additional Costs
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            type="number"
            label="Labour Cost"
            value={formData.labour_crt || ''}
            onChange={(e) => onFormChange({ ...formData, labour_crt: e.target.value })}
            placeholder="0.00"
            icon={<User className="w-4 h-4" />}
          />
          <Input
            type="number"
            label="Freight Cost"
            value={formData.freight_crt || ''}
            onChange={(e) => onFormChange({ ...formData, freight_crt: e.target.value })}
            placeholder="0.00"
            icon={<Truck className="w-4 h-4" />}
          />
          <Input
            type="number"
            label="Other Expense"
            value={formData.other_expense || ''}
            onChange={(e) => onFormChange({ ...formData, other_expense: e.target.value })}
            placeholder="0.00"
            icon={<CreditCard className="w-4 h-4" />}
          />
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <label className="text-xs text-emerald-600 font-medium">Total Additional</label>
            <p className="text-xl font-bold text-emerald-700">{totalAdditionalCosts.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ROW 4: Remarks */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div>
        <Input
          type="text"
          label="Remarks"
          value={formData.remarks || ''}
          onChange={(e) => onFormChange({ ...formData, remarks: e.target.value })}
          placeholder="Delivery instructions..."
          icon={<MessageSquare className="w-4 h-4" />}
        />
      </div>
    </div>
  )
}
