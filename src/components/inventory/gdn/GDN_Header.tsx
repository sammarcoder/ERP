


// components/gdn/GDN_Header.tsx - CUSTOMER IS READ-ONLY FROM ORDER

'use client'
import { TransporterSearchableInput } from '@/components/common/transpoter/TransporterSearchableInput'
import { Input } from '@/components/ui/Input'
import {
  Calendar, FileText, Truck, MessageSquare, User,
  MapPin, Building2, CreditCard, DollarSign, BarChart3, ReceiptText, Package
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
    labour_crt?: number | null
    freight_crt?: number | null
    other_expense?: number | null
    bility_expense?: number | null
    booked_crt?: number | null
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

  // ✅ Realtime calculation: (labour + freight + bility + other) * booked_crt = total
  const labourCost = parseFloat(String(formData.labour_crt || 0)) || 0
  const freightCost = parseFloat(String(formData.freight_crt || 0)) || 0
  const bilityCost = parseFloat(String(formData.bility_expense || 0)) || 0
  const otherCost = parseFloat(String(formData.other_expense || 0)) || 0
  const bookedCrt = parseFloat(String(formData.booked_crt || 0)) || 0



  const totalLaourCost = labourCost * bookedCrt
  const totalFreightCost = freightCost * bookedCrt

  // Sum of all per-carton costs
  const totalAdditionalCosts = totalLaourCost + totalFreightCost + bilityCost + otherCost
  // Total = cost per carton * booked cartons
  // const totalAdditionalCosts = costPerCarton 

  return (
    <div className="">

      
     
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 mb-4">
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

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ROW 3: Cost Breakdown */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-xl ">
     
        <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
          <div>
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
          <Input
            type="number"
            label="Booked Crts"
            value={formData.booked_crt ?? ''}
            onChange={(e) => onFormChange({ ...formData, booked_crt: e.target.value === '' ? null : parseFloat(e.target.value) })}
            placeholder="0"
            step="1"
            icon={<Package className="w-4 h-4" />}
          />
          <div>
            <Input
              type="number"
              label="Freight /Crt"
              value={formData.freight_crt ?? ''}
              onChange={(e) => onFormChange({ ...formData, freight_crt: e.target.value === '' ? null : parseFloat(e.target.value) })}
              placeholder="0.00"
              step="0.01"
              icon={<Truck className="w-4 h-4" />}
            />
            <p className="pl-2 text-emerald-500 mt-1 text-sm">
              {totalFreightCost.toLocaleString('en-US')}
            </p>
          </div>

          <div>
            <Input
              type="number"
              label="Labour /Crt"
              value={formData.labour_crt ?? ''}
              onChange={(e) => onFormChange({ ...formData, labour_crt: e.target.value === '' ? null : parseFloat(e.target.value) })}
              placeholder="0.00"
              step="0.01"
              icon={<User className="w-4 h-4" />}
            />

            <p className="pl-2 text-emerald-500 mt-1 text-sm">
              {totalLaourCost.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>

          <div>
            <Input
              type="number"
              label="Billing /Crt"
              value={formData.bility_expense ?? ''}
              onChange={(e) => onFormChange({ ...formData, bility_expense: e.target.value === '' ? null : parseFloat(e.target.value) })}
              placeholder="0.00"
              step="0.01"
              icon={<ReceiptText className="w-4 h-4" />}
            />
            <p className="pl-2 text-emerald-500 mt-1 text-sm">
              {formData.bility_expense ? (formData.bility_expense).toLocaleString('en-US') : '0.00'}
            </p>
          </div>
          <div>
            <Input
              type="number"
              label="Other /Crt"
              value={formData.other_expense ?? ''}
              onChange={(e) => onFormChange({ ...formData, other_expense: e.target.value === '' ? null : parseFloat(e.target.value) })}
              placeholder="0.00"
              step="0.01"
              icon={<CreditCard className="w-4 h-4" />}
            />
            <div className="flex justify-between items-center">
              <p className="pl-2 text-emerald-500 mt-1 text-sm">
                {formData.other_expense ? (formData.other_expense).toLocaleString('en-US') : '0.00'}
              </p>
              {/* <p className="text-xs text-emerald-600 font-medium">Total Expense</p> */}
              <p className='pl-2 text-emerald-500 mt-1 text-sm '>Total: {totalLaourCost + totalFreightCost + (formData.bility_expense || 0) + (formData.other_expense || 0)}</p>
            </div>

          </div>

        
         
        </div>
      </div>

      
    </div >
  )
}
