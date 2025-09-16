// 'use client'

// import React, { useState, useEffect } from 'react'
// import Dropdown from './Dropdown'
// import { COAData } from '../types'

// interface AccountDropdownProps {
//   values: {
//     purchaseAccount: number | null;
//     salesAccount: number | null;
//     salesTaxAccount: number | null;
//     supplier: number | null;
//   };
//   onChange: (name: string, value: number | null) => void;
// }

// const AccountDropdown: React.FC<AccountDropdownProps> = ({ values, onChange }) => {
//   const [coaData, setCoaData] = useState<COAData[]>([])

//   useEffect(() => {
//     const fetchCOAData = async () => {
//       try {
//         const response = await fetch(`http://${window.location.hostname}:000/api/z-coa/get`)
//         const data = await response.json()
//         setCoaData(data || [])
//       } catch (error) {
//         console.error('Error fetching COA data:', error)
//       }
//     }

//     fetchCOAData()
//   }, [])

//   const coaOptions = coaData.map(item => ({
//     id: item.id,
//     label: `${item.acName} - ${item.setupName}`
//   }))

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Accounts & Supplier</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Dropdown
//           label="Purchase Account"
//           name="purchaseAccount"
//           value={values.purchaseAccount}
//           onChange={onChange}
//           options={coaOptions}
//           placeholder="Select Purchase Account"
//           required
//         />
        
//         <Dropdown
//           label="Sales Account"
//           name="salesAccount"
//           value={values.salesAccount}
//           onChange={onChange}
//           options={coaOptions}
//           placeholder="Select Sales Account"
//           required
//         />
        
//         <Dropdown
//           label="Sales Tax Account"
//           name="salesTaxAccount"
//           value={values.salesTaxAccount}
//           onChange={onChange}
//           options={coaOptions}
//           placeholder="Select Sales Tax Account"
//           required
//         />
        
//         <Dropdown
//           label="Supplier"
//           name="supplier"
//           value={values.supplier}
//           onChange={onChange}
//           options={coaOptions}
//           placeholder="Select Supplier"
//         />
//       </div>
//     </div>
//   )
// }

// export default AccountDropdown






















































'use client'

import React, { useState, useEffect } from 'react'
import Dropdown from './Dropdown'

interface COAData {
  id: number;
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
}

interface AccountDropdownProps {
  values: {
    purchaseAccount: number | null;
    salesAccount: number | null;
    salesTaxAccount: number | null;
    supplier: number | null;
  };
  onChange: (name: string, value: number | null) => void;
}

const AccountDropdown: React.FC<AccountDropdownProps> = ({ values, onChange }) => {
  const [coaData, setCoaData] = useState<COAData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCOAData = async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}:4000/api/z-coa/get`)
        const result = await response.json()
        
        console.log('COA API Response:', result)
        setCoaData(result.zCoaRecords)
        // Handle the response structure {sucess: true, zCoaRecords: [...]}
        // if (result.sucess && Array.isArray(result.zCoaRecords)) {
        //   setCoaData(result.zCoaRecords)
        // } else if (result.success && Array.isArray(result.data)) {
        //   setCoaData(result.data)
        // } else if (Array.isArray(result)) {
        //   setCoaData(result)
        // } else {
        //   console.error('Unexpected COA data structure:', result)
        //   setCoaData([])
        // }
      } catch (error) {
        console.error('Error fetching COA data:', error)
        setCoaData([])
      } finally {
        setLoading(false)
      }
    }

    fetchCOAData()
  }, [])

  // Only display acName in dropdown
  const coaOptions = coaData.map(item => ({
    id: item.id,
    label: item.acName
  }))

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Loading Accounts...</h3>
      </div>
    )
  }

  if (coaData.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Accounts & Supplier</h3>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
          <p className="text-yellow-800 text-sm">
            No accounts found. Please create accounts in the COA module first.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Accounts & Supplier</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Dropdown
          label="Purchase Account"
          name="purchaseAccount"
          value={values.purchaseAccount}
          onChange={onChange}
          options={coaOptions}
          placeholder="Select Purchase Account"
          required
        />
        
        <Dropdown
          label="Sales Account"
          name="salesAccount"
          value={values.salesAccount}
          onChange={onChange}
          options={coaOptions}
          placeholder="Select Sales Account"
          required
        />
        
        <Dropdown
          label="Sales Tax Account"
          name="salesTaxAccount"
          value={values.salesTaxAccount}
          onChange={onChange}
          options={coaOptions}
          placeholder="Select Sales Tax Account"
          required
        />
        
        <Dropdown
          label="Supplier"
          name="supplier"
          value={values.supplier}
          onChange={onChange}
          options={coaOptions}
          placeholder="Select Supplier"
        />
      </div>
    </div>
  )
}

export default AccountDropdown
