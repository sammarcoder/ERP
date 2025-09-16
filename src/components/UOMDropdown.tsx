// 'use client'

// import React, { useState, useEffect } from 'react'
// import Dropdown from './Dropdown'
// import { UOMData } from '../types'

// interface UOMDropdownProps {
//   values: {
//     skuUOM: number | null;
//     uom2: number | null;
//     uom3: number | null;
//     assessmentUOM: number | null;
//   };
//   onChange: (name: string, value: number | null) => void;
// }

// const UOMDropdown: React.FC<UOMDropdownProps> = ({ values, onChange }) => {
//   const [uomData, setUomData] = useState<UOMData[]>([])

//   useEffect(() => {
//     const fetchUOMData = async () => {
//       try {
//         const response = await fetch(`http://${window.location.hostname}:4000/api/z-uom/get`)
//         const data = await response.json()
//         setUomData(data || [])
//       } catch (error) {
//         console.error('Error fetching UOM data:', error)
//       }
//     }

//     fetchUOMData()
//   }, [])

//   const uomOptions = uomData.map(item => ({
//     id: item.id,
//     label: item.uom
//   }))

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Units of Measurement</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Dropdown
//           label="SKU UOM"
//           name="skuUOM"
//           value={values.skuUOM}
//           onChange={onChange}
//           options={uomOptions}
//           placeholder="Select SKU UOM"
//           required
//         />
        
//         <Dropdown
//           label="UOM 2"
//           name="uom2"
//           value={values.uom2}
//           onChange={onChange}
//           options={uomOptions}
//           placeholder="Select UOM 2"
//         />
        
//         <Dropdown
//           label="UOM 3"
//           name="uom3"
//           value={values.uom3}
//           onChange={onChange}
//           options={uomOptions}
//           placeholder="Select UOM 3"
//         />
        
//         <Dropdown
//           label="Assessment UOM"
//           name="assessmentUOM"
//           value={values.assessmentUOM}
//           onChange={onChange}
//           options={uomOptions}
//           placeholder="Select Assessment UOM"
//         />
//       </div>
//     </div>
//   )
// }

// export default UOMDropdown













































'use client'

import React, { useState, useEffect } from 'react'
import Dropdown from './Dropdown'
import { UOMData } from '../types'

interface UOMDropdownProps {
  values: {
    skuUOM: number | null;
    uom2: number | null;
    uom3: number | null;
    assessmentUOM: number | null;
  };
  onChange: (name: string, value: number | null) => void;
}

const UOMDropdown: React.FC<UOMDropdownProps> = ({ values, onChange }) => {
  const [uomData, setUomData] = useState<UOMData[]>([])

  useEffect(() => {
    const fetchUOMData = async () => {
      try {
        const response = await fetch(`http://${window.location.hostname}:4000/api/z-uom/get`)
        const data = await response.json()
        // Ensure data is an array
        setUomData(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Error fetching UOM data:', error)
        setUomData([])
      }
    }

    fetchUOMData()
  }, [])

  const uomOptions = uomData.map(item => ({
    id: item.id,
    label: item.uom
  }))

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Units of Measurement</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Dropdown
          label="SKU UOM"
          name="skuUOM"
          value={values.skuUOM}
          onChange={onChange}
          options={uomOptions}
          placeholder="Select SKU UOM"
          required
        />
        
        <Dropdown
          label="UOM 2"
          name="uom2"
          value={values.uom2}
          onChange={onChange}
          options={uomOptions}
          placeholder="Select UOM 2"
        />
        
        <Dropdown
          label="UOM 3"
          name="uom3"
          value={values.uom3}
          onChange={onChange}
          options={uomOptions}
          placeholder="Select UOM 3"
        />
        
        <Dropdown
          label="Assessment UOM"
          name="assessmentUOM"
          value={values.assessmentUOM}
          onChange={onChange}
          options={uomOptions}
          placeholder="Select Assessment UOM"
        />
      </div>
    </div>
  )
}

export default UOMDropdown
