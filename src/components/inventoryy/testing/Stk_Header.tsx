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

      <div className="grid grid-cols-1 h-18 md:grid-cols-2 lg:grid-cols-4 gap-5">
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
        {/* <div>
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
