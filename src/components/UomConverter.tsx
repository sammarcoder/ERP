// // components/UomConverter.tsx
// 'use client'
// import React, { useEffect, useState } from 'react';

// const UomConverter = ({ id }) => {
//   const [pieces, setPieces] = useState('');
//   const [dozens, setDozens] = useState('');
//   const [jars, setJars] = useState('');
//   const [data, setData] = useState({ uoom_qty: 12, uom3_qty: 2880 });

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch(`http://${window.location.hostname}:4000/api/z-items/items/2`);
//         const post = await response.json();
//         setData(post.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     }
//     fetchData();
//   }, [id]);

//   const handlePiecesChange = (e) => {
//     const value = e.target.value;
//     setPieces(value);

//     if (value && !isNaN(value)) {
//       const numValue = parseFloat(value);
//       setDozens((numValue / data.uom2_qty).toFixed(6));
//       setJars((numValue / data.uom3_qty).toFixed(6));
//     } else {
//       setDozens('');
//       setJars('');
//     }
//   };

//   const handleDozensChange = (e) => {
//     const value = e.target.value;
//     setDozens(value);

//     if (value && !isNaN(value)) {
//       const numValue = parseFloat(value);
//       setPieces((numValue * data.uom2_qty).toFixed(2));
//       setJars((numValue * data.uom2_qty / data.uom3_qty).toFixed(6));
//     } else {
//       setPieces('');
//       setJars('');
//     }
//   };

//   const handleJarsChange = (e) => {
//     const value = e.target.value;
//     setJars(value);

//     if (value && !isNaN(value)) {
//       const numValue = parseFloat(value);
//       setPieces((numValue * data.uom3_qty).toFixed(2));
//       setDozens((numValue * data.uom3_qty / data.uom2_qty).toFixed(2));
//     } else {
//       setPieces('');
//       setDozens('');
//     }
//   };

//   return (
//     <div className="flex flex-row items-center gap-2 py-4 my-2">
//       <div className="flex flex-col">
//         <label className="text-sm text-gray-600 mb-1">{data.uom1?.uom?? 'N/A'}</label>
//         <input
//           type="text"
//           value={pieces}
//           onChange={handlePiecesChange}
//           placeholder="Enter pieces"
//           className="border rounded-md p-2 w-25 h-8 text-sm"
//         />
//       </div>

//       {/* <div className="flex items-center mx-1">
//         <span className="text-gray-500">Pcs</span>
//       </div> */}

//       <div className="flex flex-col">
//         <label className="text-sm text-gray-600 mb-1">{data.uomTwo?.uom?? 'N/A'}</label>
//         <input
//           type="text"
//           value={dozens}
//           onChange={handleDozensChange}
//           placeholder="Enter dozens"
//           className="border rounded-md p-2 w-25 h-8 text-sm"
//         />
//       </div>

//       {/* <div className="flex items-center mx-1">
//         <span className="text-gray-500">dozens</span>
//       </div> */}

//       <div className="flex flex-col">
//         <label className="text-sm text-gray-600 mb-1">{data.uomThree?.uom?? 'N/A'} </label>
//         <input
//           type="text"
//           value={jars}
//           onChange={handleJarsChange}
//           placeholder="Enter jars"
//           className="border rounded-md p-2 w-25 h-8 text-sm border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
//         />
//       </div>

//       {/* <div className="flex items-center mx-1">
//         <span className="text-gray-500">box</span>
//       </div> */}
//     </div>
//   );
// };

// export default UomConverter;














































































// // components/UomConverter.tsx
// 'use client'
// import React, { useEffect, useState } from 'react';

// const UomConverter = ({ itemId, onChange, initialValues = {}, isPurchase = false }) => {
//     const [pieces, setPieces] = useState(initialValues.pieces || '');
//     const [dozens, setDozens] = useState(initialValues.dozens || '');
//     const [jars, setJars] = useState(initialValues.jars || '');
//     const [data, setData] = useState({
//         uom1: null,
//         uom2_qty: 12,
//         uom3_qty: 2880,
//         uomTwo: null,
//         uomThree: null
//     });
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         // Reset values when item changes
//         if (!itemId) {
//             setPieces('');
//             setDozens('');
//             setJars('');
//             setData({
//                 uom1: null,
//                 uom2_qty: 12,
//                 uom3_qty: 2880,
//                 uomTwo: null,
//                 uomThree: null
//             });
//             return;
//         }

//         async function fetchData() {
//             setLoading(true);
//             try {
//                 // const response = await fetch(`http://${window.location.hostname}:4000/api/z-items/items/${itemId}`);
//                 const response = await fetch(`http://${window.location.hostname}:4000/api/z-items/items/${itemId}`);
//                 const result = await response.json();

//                 if (result.success && result.data) {
//                     setData({
//                         uom1: result.data.uom1 || null,
//                         uom2_qty: result.data.uom2_qty || 12,
//                         uom3_qty: result.data.uom3_qty || 2880,
//                         uomTwo: result.data.uomTwo || null,
//                         uomThree: result.data.uomThree || null
//                     });
//                 }
//             } catch (error) {
//                 console.error('Error fetching UOM data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         }

//         fetchData();
//     }, [itemId]);

//     // Update parent when values change
//     const notifyParent = (piecesVal, dozensVal, jarsVal) => {
//         if (onChange) {
//             onChange({
//                 pieces: parseFloat(piecesVal) || 0,
//                 dozens: parseFloat(dozensVal) || 0,
//                 jars: parseFloat(jarsVal) || 0,
//                 // Include UOM IDs if needed
//                 uom1Id: data.uom1?.id || null,
//                 uom2Id: data.uomTwo?.id || null,
//                 uom3Id: data.uomThree?.id || null
//             });
//         }
//     };

//     const handlePiecesChange = (e) => {
//         const value = e.target.value;
//         setPieces(value);

//         if (value && !isNaN(value)) {
//             const numValue = parseFloat(value);
//             const dozensVal = (numValue / data.uom2_qty).toFixed(6);
//             const jarsVal = (numValue / data.uom3_qty).toFixed(6);

//             setDozens(dozensVal);
//             setJars(jarsVal);
//             notifyParent(value, dozensVal, jarsVal);
//         } else {
//             setDozens('');
//             setJars('');
//             notifyParent(0, 0, 0);
//         }
//     };

//     const handleDozensChange = (e) => {
//         const value = e.target.value;
//         setDozens(value);

//         if (value && !isNaN(value)) {
//             const numValue = parseFloat(value);
//             const piecesVal = (numValue * data.uom2_qty).toFixed(2);
//             const jarsVal = (numValue * data.uom2_qty / data.uom3_qty).toFixed(6);

//             setPieces(piecesVal);
//             setJars(jarsVal);
//             notifyParent(piecesVal, value, jarsVal);
//         } else {
//             setPieces('');
//             setJars('');
//             notifyParent(0, 0, 0);
//         }
//     };

//     const handleJarsChange = (e) => {
//         const value = e.target.value;
//         setJars(value);

//         if (value && !isNaN(value)) {
//             const numValue = parseFloat(value);
//             const piecesVal = (numValue * data.uom3_qty).toFixed(2);
//             const dozensVal = (numValue * data.uom3_qty / data.uom2_qty).toFixed(2);

//             setPieces(piecesVal);
//             setDozens(dozensVal);
//             notifyParent(piecesVal, dozensVal, value);
//         } else {
//             setPieces('');
//             setDozens('');
//             notifyParent(0, 0, 0);
//         }
//     };

//     if (!itemId) {
//         return (
//             <div className="flex items-center justify-center p-4 text-gray-400 text-sm">
//                 Please select an item first
//             </div>
//         );
//     }

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center p-4">
//                 <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
//                 <span className="ml-2 text-sm text-gray-600">Loading UOM data...</span>
//             </div>
//         );
//     }

//     return (
//         <div className="flex flex-row items-center gap-3">



//             {/* UOM 3 (Jars/Boxes) */}
//             <div className="flex flex-col">
//                 <label className="text-xs text-gray-600 mb-1 font-medium">
//                     {data.uomThree?.uom || 'Boxes'}
//                 </label>
//                 <input
//                     type="number"
//                     step="0.01"
//                     value={jars}
//                     onChange={handleJarsChange}
//                     placeholder="0"
//                     className="border border-gray-300 rounded-md px-2 py-1 w-24 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
//                 />
//             </div>

//             {/* UOM 2 (Dozens/Cartons) */}
//             <div className="flex flex-col">
//                 <label className="text-xs text-gray-600 mb-1 font-medium">
//                     {data.uomTwo?.uom || 'Dozens'}
//                 </label>
//                 <input
//                     type="number"
//                     step="0.01"
//                     value={dozens}
//                     onChange={handleDozensChange}
//                     placeholder="0"
//                     className="border border-gray-300 rounded-md px-2 py-1 w-24 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//             </div>


//             {/* UOM 1 - Base Unit (Pieces) */}
//             <div className="flex flex-col">
//                 <label className="text-xs text-gray-600 mb-1 font-medium">
//                     {data.uom1?.uom || 'Pieces'}
//                 </label>
//                 <input
//                     type="number"
//                     step="0.01"
//                     value={pieces}
//                     onChange={handlePiecesChange}
//                     placeholder="0"
//                     className="border border-gray-300 rounded-md px-2 py-1 w-24 h-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//             </div>
//             {/* Conversion Info Tooltip (Optional) */}
//             {/* <div className="relative group">
//                 <svg
//                     className="w-4 h-4 text-gray-400 cursor-help"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                 >
//                     <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
//                     />
//                 </svg>
//                 <div className="absolute left-0 bottom-6 invisible group-hover:visible bg-gray-800 text-white text-xs rounded p-2 w-48 z-10">
//                     <div>1 {data.uomTwo?.uom || 'Dozen'} = {data.uom2_qty} {data.uom1?.uom || 'Pieces'}</div>
//                     <div>1 {data.uomThree?.uom || 'Box'} = {data.uom3_qty} {data.uom1?.uom || 'Pieces'}</div>
//                 </div>
//             </div> */}
//         </div>
//     );
// };

// export default UomConverter;





















































// // components/UomConverter.tsx
// 'use client'
// import React, { useEffect, useState } from 'react';

// type UomType = { id?: number; uom?: string } | null;
// type InitialValuesType = {
//   uom1_qty?: string;
//   uom2_qty?: string;
//   uom3_qty?: string;
//   sale_unit?: string;
// };
// interface UomConverterProps {
//   itemId: number | null | undefined;
//   onChange?: (data: any) => void;
//   initialValues?: InitialValuesType;
//   isPurchase?: boolean;
// }

// const UomConverter = ({ itemId, onChange, initialValues = {}, isPurchase = false }: UomConverterProps) => {
//     // Old code: No saleUnit selection
//     // New code: Add saleUnit state for which UOM is selected for sale
//     const [saleUnit, setSaleUnit] = useState<string>(initialValues.sale_unit || '');
//     const [uom1Val, setUom1Val] = useState<string>(initialValues.uom1_qty || '');
//     const [uom2Val, setUom2Val] = useState<string>(initialValues.uom2_qty || '');
//     const [uom3Val, setUom3Val] = useState<string>(initialValues.uom3_qty || '');
//     const [data, setData] = useState<{
//         uom1: UomType;
//         uom2_qty: number;
//         uom3_qty: number;
//         uomTwo: UomType;
//         uomThree: UomType;
//     }>({
//         uom1: null,
//         uom2_qty: 12,
//         uom3_qty: 2880,
//         uomTwo: null,
//         uomThree: null
//     });
//     const [loading, setLoading] = useState(false);

//     useEffect(() => {
//         if (itemId === null || itemId === undefined) {
//             setUom1Val(''); setUom2Val(''); setUom3Val('');
//             setData({ uom1: null, uom2_qty: 12, uom3_qty: 2880, uomTwo: null, uomThree: null });
//             return;
//         }

//         async function fetchData() {
//             setLoading(true);
//             try {
//                 const response = await fetch(`http://${window.location.hostname}:4000/api/z-items/items/${itemId}`);
//                 const result = await response.json();
//                 if (result.success && result.data) {
//                     setData({
//                         uom1: result.data.uom1 || null,
//                         uom2_qty: result.data.uom2_qty || 12,
//                         uom3_qty: result.data.uom3_qty || 2880,
//                         uomTwo: result.data.uomTwo || null,
//                         uomThree: result.data.uomThree || null
//                     });
//                 }
//                 console.log('Fetched UOm data:', result)
//             } catch (error) {
//                 console.error('Error fetching UOM data:', error);
//             } finally {
//                 setLoading(false);
//             }
//         }
//         fetchData();
//     }, [itemId]);

//     const notifyParent = (uom1: string, uom2: string, uom3: string) => {
//         if (onChange) {
//             onChange({
//                 uom1_qty: parseFloat(uom1) || 0,
//                 uom2_qty: parseFloat(uom2) || 0,
//                 uom3_qty: parseFloat(uom3) || 0,
//                 sale_unit: saleUnit
//             });
//         }
//     };

//     const handleUom1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setUom1Val(value);
//         if (value && !isNaN(Number(value))) {
//             const numValue = parseFloat(value);
//             const uom2 = (numValue / data.uom2_qty).toFixed(6);
//             const uom3 = (numValue / data.uom3_qty).toFixed(6);
//             setUom2Val(uom2); setUom3Val(uom3);
//             notifyParent(value, uom2, uom3);
//         } else {
//             setUom2Val(''); setUom3Val('');
//             notifyParent('', '', '');
//         }
//     };

//     const handleUom2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setUom2Val(value);
//         if (value && !isNaN(Number(value))) {
//             const numValue = parseFloat(value);
//             const uom1 = (numValue * data.uom2_qty).toFixed(2);
//             const uom3 = (numValue * data.uom2_qty / data.uom3_qty).toFixed(6);
//             setUom1Val(uom1); setUom3Val(uom3);
//             notifyParent(uom1, value, uom3);
//         } else {
//             setUom1Val(''); setUom3Val('');
//             notifyParent('', '', '');
//         }
//     };

//     const handleUom3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
//         const value = e.target.value;
//         setUom3Val(value);
//         if (value && !isNaN(Number(value))) {
//             const numValue = parseFloat(value);
//             const uom1 = (numValue * data.uom3_qty).toFixed(2);
//             const uom2 = (numValue * data.uom3_qty / data.uom2_qty).toFixed(2);
//             setUom1Val(uom1); setUom2Val(uom2);
//             notifyParent(uom1, uom2, value);
//         } else {
//             setUom1Val(''); setUom2Val('');
//             notifyParent('', '', '');
//         }
//     };

//     if (!itemId) {
//         return <div className="text-gray-400 text-xs px-2">Select item first</div>;
//     }

//     // Show inputs immediately; if loading, display a small spinner inline

//     // Old code above. New code below: add checkboxes for sale unit selection
//     return (
//         <div className="flex items-center space-x-2">
//             {loading && (
//                 <div className="flex items-center mr-2">
//                     <div className="animate-spin h-4 w-4 border-b-2 border-blue-500 mr-1"></div>
//                     <span className="text-[10px] text-gray-500">Loading UOM...</span>
//                 </div>
//             )}
//             {/* UOM 3 (Jars/Boxes) */}
//             <div className="flex flex-col items-center">
//                 <label className="text-xs text-gray-600 mb-0.5">{data.uomThree?.uom || 'UOM3'}</label>
//                 <input
//                     type="number"
//                     step="0.01"
//                     value={uom3Val}
//                     onChange={handleUom3Change}
//                     placeholder="0"
//                     className="border border-gray-300 rounded-md px-1 py-0.5 w-16 h-7 text-xs focus:ring-1 focus:ring-purple-500"
//                 />
//                 <label className="flex items-center mt-1 text-[10px]">
//                     <input
//                         type="checkbox"
//                         checked={saleUnit === 'uomThree'}
//                         onChange={() => {
//                             const newSaleUnit = saleUnit === 'uomThree' ? '' : 'uomThree';
//                             setSaleUnit(newSaleUnit);
//                             notifyParent(uom1Val, uom2Val, uom3Val);
//                         }}
//                         className="mr-1"
//                     />
//                     Sale in {data.uomThree?.uom || 'UOM3'}
//                 </label>
//             </div>
//             {/* UOM 2 (Dozens/Cartons) */}
//             <div className="flex flex-col items-center">
//                 <label className="text-xs text-gray-600 mb-0.5">{data.uomTwo?.uom || 'UOM2'}</label>
//                 <input
//                     type="number"
//                     step="0.01"
//                     value={uom2Val}
//                     onChange={handleUom2Change}
//                     placeholder="0"
//                     className="border border-gray-300 rounded-md px-1 py-0.5 w-16 h-7 text-xs focus:ring-1 focus:ring-blue-500"
//                 />
//                 <label className="flex items-center mt-1 text-[10px]">
//                     <input
//                         type="checkbox"
//                         checked={saleUnit === 'uomTwo'}
//                         onChange={() => {
//                             const newSaleUnit = saleUnit === 'uomTwo' ? '' : 'uomTwo';
//                             setSaleUnit(newSaleUnit);
//                             notifyParent(uom1Val, uom2Val, uom3Val);
//                         }}
//                         className="mr-1"
//                     />
//                     Sale in {data.uomTwo?.uom || 'UOM2'}
//                 </label>
//             </div>
//             {/* UOM 1 (Pieces) */}
//             <div className="flex flex-col items-center">
//                 <label className="text-xs text-gray-600 mb-0.5">{data.uom1?.uom || 'UOM1'}</label>
//                 <input
//                     type="number"
//                     step="0.01"
//                     value={uom1Val}
//                     onChange={handleUom1Change}
//                     placeholder="0"
//                     className="border border-gray-300 rounded-md px-1 py-0.5 w-16 h-7 text-xs focus:ring-1 focus:ring-blue-500"
//                 />
//                 <label className="flex items-center mt-1 text-[10px]">
//                     <input
//                         type="checkbox"
//                         checked={saleUnit === 'uom1'}
//                         onChange={() => {
//                             const newSaleUnit = saleUnit === 'uom1' ? '' : 'uom1';
//                             setSaleUnit(newSaleUnit);
//                             notifyParent(uom1Val, uom2Val, uom3Val);
//                         }}
//                         className="mr-1"
//                     />
//                     Sale in {data.uom1?.uom || 'UOM1'}
//                 </label>
//             </div>
//         </div>
//     );
// };

// export default UomConverter;

























// components/UomConverter.tsx
'use client'
import React, { useEffect, useState } from 'react';

type UomType = { id?: number; uom?: string } | null;
type InitialValuesType = {
  uom1_qty?: string;
  uom2_qty?: string;
  uom3_qty?: string;
  sale_unit?: string;
};

interface UomConverterProps {
  itemId: number | null | undefined;
  onChange?: (data: any) => void;
  initialValues?: InitialValuesType;
  isPurchase?: boolean;
}

const UomConverter = ({ itemId, onChange, initialValues = {}, isPurchase = false }: UomConverterProps) => {
  const [saleUnit, setSaleUnit] = useState<string>(initialValues.sale_unit || '');
  const [uom1Val, setUom1Val] = useState<string>(initialValues.uom1_qty || '');
  const [uom2Val, setUom2Val] = useState<string>(initialValues.uom2_qty || '');
  const [uom3Val, setUom3Val] = useState<string>(initialValues.uom3_qty || '');
  const [data, setData] = useState<{
    uom1: UomType;
    uom2_qty: number;
    uom3_qty: number;
    uomTwo: UomType;
    uomThree: UomType;
  }>({
    uom1: null,
    uom2_qty: 12,
    uom3_qty: 144,
    uomTwo: null,
    uomThree: null
  });
  const [loading, setLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Update local state when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues && !isInitialized) {
      setUom1Val(initialValues.uom1_qty || '');
      setUom2Val(initialValues.uom2_qty || '');
      setUom3Val(initialValues.uom3_qty || '');
      setSaleUnit(initialValues.sale_unit || '');
      setIsInitialized(true);
    }
  }, [initialValues, isInitialized]);

  useEffect(() => {
    // FIXED: Check for null, undefined, and 0 properly
    if (!itemId || itemId === null || itemId === undefined) {
      // Reset state when no item selected
      setUom1Val(''); 
      setUom2Val(''); 
      setUom3Val('');
      setSaleUnit('');
      setData({ uom1: null, uom2_qty: 12, uom3_qty: 144, uomTwo: null, uomThree: null });
      setIsInitialized(false);
      return;
    }

    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch(`http://${window.location.hostname}:4000/api/z-items/items/${itemId}`);
        const result = await response.json();
        if (result.success && result.data) {
          const itemData = result.data;
          setData({
            uom1: itemData.uom1 || { id: 1, uom: 'PCS' },
            uom2_qty: parseFloat(itemData.uom2_qty) || 12,
            uom3_qty: parseFloat(itemData.uom3_qty) || 144,
            uomTwo: itemData.uomTwo || { id: 2, uom: 'DOZ' },
            uomThree: itemData.uomThree || { id: 3, uom: 'BOX' }
          });

          // If we have initial values and haven't initialized yet, use them
          if (initialValues && !isInitialized) {
            setUom1Val(initialValues.uom1_qty || '');
            setUom2Val(initialValues.uom2_qty || '');
            setUom3Val(initialValues.uom3_qty || '');
            setSaleUnit(initialValues.sale_unit || '');
          }
          setIsInitialized(true);
        }
        console.log('Fetched UOM data:', result);
      } catch (error) {
        console.error('Error fetching UOM data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [itemId]);

  const notifyParent = (uom1: string, uom2: string, uom3: string, selectedSaleUnit: string) => {
    if (onChange) {
      onChange({
        uom1_qty: parseFloat(uom1) || 0,
        uom2_qty: parseFloat(uom2) || 0,
        uom3_qty: parseFloat(uom3) || 0,
        sale_unit: selectedSaleUnit
      });
    }
  };

  const handleUom1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUom1Val(value);
    if (value && !isNaN(Number(value)) && data.uom2_qty && data.uom3_qty) {
      const numValue = parseFloat(value);
      const uom2 = (numValue / data.uom2_qty).toFixed(6);
      const uom3 = (numValue / data.uom3_qty).toFixed(6);
      setUom2Val(uom2);
      setUom3Val(uom3);
      notifyParent(value, uom2, uom3, saleUnit);
    } else {
      setUom2Val('');
      setUom3Val('');
      notifyParent(value || '0', '0', '0', saleUnit);
    }
  };

  const handleUom2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUom2Val(value);
    if (value && !isNaN(Number(value)) && data.uom2_qty && data.uom3_qty) {
      const numValue = parseFloat(value);
      const uom1 = (numValue * data.uom2_qty).toFixed(2);
      const uom3 = (numValue * data.uom2_qty / data.uom3_qty).toFixed(6);
      setUom1Val(uom1);
      setUom3Val(uom3);
      notifyParent(uom1, value, uom3, saleUnit);
    } else {
      setUom1Val('');
      setUom3Val('');
      notifyParent('0', value || '0', '0', saleUnit);
    }
  };

  const handleUom3Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUom3Val(value);
    if (value && !isNaN(Number(value)) && data.uom2_qty && data.uom3_qty) {
      const numValue = parseFloat(value);
      const uom1 = (numValue * data.uom3_qty).toFixed(2);
      const uom2 = (numValue * data.uom3_qty / data.uom2_qty).toFixed(2);
      setUom1Val(uom1);
      setUom2Val(uom2);
      notifyParent(uom1, uom2, value, saleUnit);
    } else {
      setUom1Val('');
      setUom2Val('');
      notifyParent('0', '0', value || '0', saleUnit);
    }
  };

  const handleSaleUnitChange = (unit: string) => {
    setSaleUnit(unit);
    notifyParent(uom1Val, uom2Val, uom3Val, unit);
  };

  // FIXED: Change the condition to be more specific
  if (!itemId || itemId === null || itemId === undefined) {
    return <div className="text-gray-400 text-xs px-2">Select item first</div>;
  }

  return (
    <div className="flex items-start space-x-2">
      {loading && (
        <div className="flex items-center mr-2">
          <div className="animate-spin h-4 w-4 border-b-2 border-blue-500 mr-1"></div>
          <span className="text-[10px] text-gray-500">Loading UOM...</span>
        </div>
      )}

      {/* UOM 1 (Pieces) */}
      <div className="flex flex-col items-center">
        <label className="text-xs text-gray-600 mb-0.5 font-medium">
          {data.uom1?.uom || 'PCS'}
        </label>
        <input
          type="number"
          step="0.01"
          value={uom1Val}
          onChange={handleUom1Change}
          placeholder="0"
          className={`border rounded-md px-1 py-0.5 w-16 h-7 text-xs focus:ring-1 transition-all ${
            saleUnit === 'uom1' && !isPurchase 
              ? 'border-green-400 bg-green-50 focus:ring-green-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {!isPurchase && (
          <label className="flex items-center mt-1 text-[10px] text-gray-600">
            <input
              type="radio"
              name={`sale_unit_${itemId}`}
              value="uom1"
              checked={saleUnit === 'uom1'}
              onChange={() => handleSaleUnitChange('uom1')}
              className="mr-1 w-3 h-3"
            />
            Sale Unit
          </label>
        )}
      </div>

      {/* UOM 2 (Dozens) */}
      <div className="flex flex-col items-center">
        <label className="text-xs text-gray-600 mb-0.5 font-medium">
          {data.uomTwo?.uom || 'DOZ'}
        </label>
        <input
          type="number"
          step="0.01"
          value={uom2Val}
          onChange={handleUom2Change}
          placeholder="0"
          className={`border rounded-md px-1 py-0.5 w-16 h-7 text-xs focus:ring-1 transition-all ${
            saleUnit === 'uomTwo' && !isPurchase 
              ? 'border-green-400 bg-green-50 focus:ring-green-500' 
              : 'border-gray-300 focus:ring-blue-500'
          }`}
        />
        {!isPurchase && (
          <label className="flex items-center mt-1 text-[10px] text-gray-600">
            <input
              type="radio"
              name={`sale_unit_${itemId}`}
              value="uomTwo"
              checked={saleUnit === 'uomTwo'}
              onChange={() => handleSaleUnitChange('uomTwo')}
              className="mr-1 w-3 h-3"
            />
            Sale Unit
          </label>
        )}
      </div>

      {/* UOM 3 (Boxes) */}
      <div className="flex flex-col items-center">
        <label className="text-xs text-gray-600 mb-0.5 font-medium">
          {data.uomThree?.uom || 'BOX'}
        </label>
        <input
          type="number"
          step="0.01"
          value={uom3Val}
          onChange={handleUom3Change}
          placeholder="0"
          className={`border rounded-md px-1 py-0.5 w-16 h-7 text-xs focus:ring-1 transition-all ${
            saleUnit === 'uomThree' && !isPurchase 
              ? 'border-green-400 bg-green-50 focus:ring-green-500' 
              : 'border-gray-300 focus:ring-purple-500'
          }`}
        />
        {!isPurchase && (
          <label className="flex items-center mt-1 text-[10px] text-gray-600">
            <input
              type="radio"
              name={`sale_unit_${itemId}`}
              value="uomThree"
              checked={saleUnit === 'uomThree'}
              onChange={() => handleSaleUnitChange('uomThree')}
              className="mr-1 w-3 h-3"
            />
            Sale Unit
          </label>
        )}
      </div>

      {/* Conversion Info */}
      <div className="text-xs text-gray-500 ml-2">
        <div className="bg-gray-50 p-1 rounded text-[10px]">
          <div>1 {data.uomTwo?.uom} = {data.uom2_qty} {data.uom1?.uom}</div>
          <div>1 {data.uomThree?.uom} = {data.uom3_qty} {data.uom1?.uom}</div>
          {!isPurchase && saleUnit && (
            <div className="text-green-600 font-medium mt-1">
              Sale: {saleUnit === 'uom1' ? data.uom1?.uom : 
                    saleUnit === 'uomTwo' ? data.uomTwo?.uom : 
                    data.uomThree?.uom}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UomConverter;
