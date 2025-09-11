// 'use client'

// import React, { useState, useEffect } from 'react'
// import Dropdown from './Dropdown'

// interface ClassData {
//   id: number;
//   className: string;
//   classId: number;
// }

// interface ClassDropdownProps {
//   values: {
//     itemClass1: number | null;
//     itemClass2: number | null;
//     itemClass3: number | null;
//     itemClass4: number | null;
//   };
//   onChange: (name: string, value: number | null) => void;
// }

// const ClassDropdown: React.FC<ClassDropdownProps> = ({ values, onChange }) => {
//   const [classData, setClassData] = useState<{
//     class1: ClassData[];
//     class2: ClassData[];
//     class3: ClassData[];
//     class4: ClassData[];
//   }>({
//     class1: [],
//     class2: [],
//     class3: [],
//     class4: []
//   })

//   useEffect(() => {
//     const fetchClassData = async () => {
//       try {
//         const promises = [1, 2, 3, 4].map(id =>
//           fetch(`http://${window.location.hostname}:5000/api/z-classes/get-by-class-id/${id}`)
//             .then(res => res.json())
//         )
//         console.log(promises)
//         const results = await Promise.all(promises)
//         console.log('this is results', results)

//         // Extract the getByclassID array from each response
//         setClassData({
//           class1: results[0]?.getByclassID || [],
//           class2: results[1]?.getByclassID || [],
//           class3: results[2]?.getByclassID || [],
//           class4: results[3]?.getByclassID || []
//         })
//       } catch (error) {
//         console.error('Error fetching class data:', error)
//         setClassData({
//           class1: [],
//           class2: [],
//           class3: [],
//           class4: []
//         })
//       }
//     }

//     fetchClassData()
//   }, [])

//   return (
//     <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
//       <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Classes</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
//         <Dropdown
//           label="Item Class 1"
//           name="itemClass1"
//           value={values.itemClass1}
//           onChange={onChange}
//           options={classData.class1.map(item => ({
//             id: item.id,
//             label: item.className
//           }))}
//           placeholder="Select Class 1"
//         />

//         <Dropdown
//           label="Item Class 2"
//           name="itemClass2"
//           value={values.itemClass2}
//           onChange={onChange}
//           options={classData.class2.map(item => ({
//             id: item.id,
//             label: item.className
//           }))}
//           placeholder="Select Class 2"
//         />

//         <Dropdown
//           label="Item Class 3"
//           name="itemClass3"
//           value={values.itemClass3}
//           onChange={onChange}
//           options={classData.class3.map(item => ({
//             id: item.id,
//             label: item.className
//           }))}
//           placeholder="Select Class 3"
//         />

//         <Dropdown
//           label="Item Class 4"
//           name="itemClass4"
//           value={values.itemClass4}
//           onChange={onChange}
//           options={classData.class4.map(item => ({
//             id: item.id,
//             label: item.className
//           }))}
//           placeholder="Select Class 4"
//         />
//       </div>
//     </div>
//   )
// }

// export default ClassDropdown





















'use client'

import React, { useState, useEffect } from 'react'
import Dropdown from './Dropdown'

interface ClassData {
  id: number;
  className: string;
  classId: number;
}

interface ClassDropdownProps {
  values: {
    itemClass1: number | null;
    itemClass2: number | null;
    itemClass3: number | null;
    itemClass4: number | null;
  };
  onChange: (name: string, value: number | null) => void;
  onClassFilterChange?: (filters: ClassFilters) => void; // Optional callback for filtering
}

interface ClassFilters {
  itemClass1: number | null;
  itemClass2: number | null;
  itemClass3: number | null;
  itemClass4: number | null;
}

const ClassDropdown: React.FC<ClassDropdownProps> = ({ 
  values, 
  onChange, 
  onClassFilterChange 
}) => {
  const [classData, setClassData] = useState<{
    class1: ClassData[];
    class2: ClassData[];
    class3: ClassData[];
    class4: ClassData[];
  }>({
    class1: [],
    class2: [],
    class3: [],
    class4: []
  })

  useEffect(() => {
    const fetchClassData = async () => {
      try {
        const promises = [1, 2, 3, 4].map(id =>
          fetch(`http://${window.location.hostname}:5000/api/z-classes/get-by-class-id/${id}`)
            .then(res => res.json())
        )
        const results = await Promise.all(promises)

        setClassData({
          class1: results[0]?.getByclassID || [],
          class2: results[1]?.getByclassID || [],
          class3: results[2]?.getByclassID || [],
          class4: results[3]?.getByclassID || []
        })
      } catch (error) {
        console.error('Error fetching class data:', error)
        setClassData({
          class1: [],
          class2: [],
          class3: [],
          class4: []
        })
      }
    }

    fetchClassData()
  }, [])

  // Enhanced onChange handler that triggers filtering
  const handleClassChange = (name: string, value: number | null) => {
    // Update the form values
    onChange(name, value)
    
    // Create updated filters object
    const updatedFilters = {
      ...values,
      [name]: value
    }
    
    // Trigger the filtering in parent component if callback provided
    if (onClassFilterChange) {
      onClassFilterChange(updatedFilters)
    }
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Item Classes</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Dropdown
          label="Item Class 1"
          name="itemClass1"
          value={values.itemClass1}
          onChange={handleClassChange}
          options={classData.class1.map(item => ({
            id: item.id,
            label: item.className
          }))}
          placeholder="Select Class 1"
        />

        <Dropdown
          label="Item Class 2"
          name="itemClass2"
          value={values.itemClass2}
          onChange={handleClassChange}
          options={classData.class2.map(item => ({
            id: item.id,
            label: item.className
          }))}
          placeholder="Select Class 2"
        />

        <Dropdown
          label="Item Class 3"
          name="itemClass3"
          value={values.itemClass3}
          onChange={handleClassChange}
          options={classData.class3.map(item => ({
            id: item.id,
            label: item.className
          }))}
          placeholder="Select Class 3"
        />

        <Dropdown
          label="Item Class 4"
          name="itemClass4"
          value={values.itemClass4}
          onChange={handleClassChange}
          options={classData.class4.map(item => ({
            id: item.id,
            label: item.className
          }))}
          placeholder="Select Class 4"
        />
      </div>
    </div>
  )
}

export default ClassDropdown