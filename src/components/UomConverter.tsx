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





















































// components/UomConverter.tsx
'use client'
import React, { useEffect, useState } from 'react';

const UomConverter = ({ itemId, onChange, initialValues = {}, isPurchase = false }) => {
    const [pieces, setPieces] = useState(initialValues.pieces || '');
    const [dozens, setDozens] = useState(initialValues.dozens || '');
    const [jars, setJars] = useState(initialValues.jars || '');
    const [data, setData] = useState({
        uom1: null,
        uom2_qty: 12,
        uom3_qty: 2880,
        uomTwo: null,
        uomThree: null
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (itemId === null || itemId === undefined) {
            setPieces(''); setDozens(''); setJars('');
            setData({ uom1: null, uom2_qty: 12, uom3_qty: 2880, uomTwo: null, uomThree: null });
            return;
        }

        async function fetchData() {
            setLoading(true);
            try {
                const response = await fetch(`http://${window.location.hostname}:4000/api/z-items/items/${itemId}`);
                const result = await response.json();
                if (result.success && result.data) {
                    setData({
                        uom1: result.data.uom1 || null,
                        uom2_qty: result.data.uom2_qty || 12,
                        uom3_qty: result.data.uom3_qty || 2880,
                        uomTwo: result.data.uomTwo || null,
                        uomThree: result.data.uomThree || null
                    });
                }
                console.log('Fetched UOm data:', result)
            } catch (error) {
                console.error('Error fetching UOM data:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [itemId]);

    const notifyParent = (piecesVal, dozensVal, jarsVal) => {
        if (onChange) {
            onChange({
                pieces: parseFloat(piecesVal) || 0,
                dozens: parseFloat(dozensVal) || 0,
                jars: parseFloat(jarsVal) || 0,
                uom1Id: data.uom1?.id || null,
                uom2Id: data.uomTwo?.id || null,
                uom3Id: data.uomThree?.id || null
            });
        }
    };

    const handlePiecesChange = (e) => {
        const value = e.target.value;
        setPieces(value);
        if (value && !isNaN(value)) {
            const numValue = parseFloat(value);
            const dozensVal = (numValue / data.uom2_qty).toFixed(6);
            const jarsVal = (numValue / data.uom3_qty).toFixed(6);
            setDozens(dozensVal); setJars(jarsVal);
            notifyParent(value, dozensVal, jarsVal);
        } else {
            setDozens(''); setJars('');
            notifyParent(0, 0, 0);
        }
    };

    const handleDozensChange = (e) => {
        const value = e.target.value;
        setDozens(value);
        if (value && !isNaN(value)) {
            const numValue = parseFloat(value);
            const piecesVal = (numValue * data.uom2_qty).toFixed(2);
            const jarsVal = (numValue * data.uom2_qty / data.uom3_qty).toFixed(6);
            setPieces(piecesVal); setJars(jarsVal);
            notifyParent(piecesVal, value, jarsVal);
        } else {
            setPieces(''); setJars('');
            notifyParent(0, 0, 0);
        }
    };

    const handleJarsChange = (e) => {
        const value = e.target.value;
        setJars(value);
        if (value && !isNaN(value)) {
            const numValue = parseFloat(value);
            const piecesVal = (numValue * data.uom3_qty).toFixed(2);
            const dozensVal = (numValue * data.uom3_qty / data.uom2_qty).toFixed(2);
            setPieces(piecesVal); setDozens(dozensVal);
            notifyParent(piecesVal, dozensVal, value);
        } else {
            setPieces(''); setDozens('');
            notifyParent(0, 0, 0);
        }
    };

    if (itemId === null || itemId === undefined) {
        return <div className="text-gray-400 text-xs px-2">Select item first</div>;
    }

    // Show inputs immediately; if loading, display a small spinner inline

    return (
        <div className="flex items-center space-x-1">
            {loading && (
                <div className="flex items-center mr-2">
                    <div className="animate-spin h-4 w-4 border-b-2 border-blue-500 mr-1"></div>
                    <span className="text-[10px] text-gray-500">Loading UOM...</span>
                </div>
            )}
            <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-0.5">{data.uomThree?.uom || 'Boxes'}</label>
                <input
                    type="number"
                    step="0.01"
                    value={jars}
                    onChange={handleJarsChange}
                    placeholder="0"
                    className="border border-gray-300 rounded-md px-1 py-0.5 w-16 h-7 text-xs focus:ring-1 focus:ring-purple-500"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-0.5">{data.uomTwo?.uom || 'Dozens'}</label>
                
                <input
                    type="number"
                    step="0.01"
                    value={dozens}
                    onChange={handleDozensChange}
                    placeholder="0"
                    className="border border-gray-300 rounded-md px-1 py-0.5 w-16 h-7 text-xs focus:ring-1 focus:ring-blue-500"
                />
            </div>
            <div className="flex flex-col">
                <label className="text-xs text-gray-600 mb-0.5">{data.uom1?.uom || 'Pieces'}</label>
                <input
                    type="number"
                    step="0.01"
                    value={pieces}
                    onChange={handlePiecesChange}
                    placeholder="0"
                    className="border border-gray-300 rounded-md px-1 py-0.5 w-16 h-7 text-xs focus:ring-1 focus:ring-blue-500"
                />
            </div>
        </div>
    );
};

export default UomConverter;
