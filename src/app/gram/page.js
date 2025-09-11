// 'use client'
// import React, { useState } from 'react';

// const Converter = () => {
//   const [gramValue, setGramValue] = useState('');
//   const [kgValue, setKgValue] = useState('');

//   const handleGramChange = (e) => {
//     const value = e.target.value;
//     setGramValue(value);
//     if (value) {
//       setKgValue((value / 1000).toString());
//     } else {
//       setKgValue('');
//     }
//   };

//   const handleKgChange = (e) => {
//     const value = e.target.value;
//     setKgValue(value);
//     if (value) {
//       setGramValue((value * 1000).toString());
//     } else {
//       setGramValue('');
//     }
//   };

//   return (
//     <div className="converter-container">
//       <h2>Weight Converter</h2>
//       <div className="input-group">
//         <input 
//           type="number" 
//           value={gramValue} 
//           onChange={handleGramChange} 
//           placeholder="Enter grams"
//         />
//         <label>grams</label>
//       </div>
//       <div className="input-group">
//         <input 
//           type="number" 
//           value={kgValue} 
//           onChange={handleKgChange} 
//           placeholder="Enter kilograms"
//         />
//         <label>kilograms</label>
//       </div>
//       {/* <p>
//         Note: The conversion is **1 kg = 1000 g**.
//       </p> */}
//     </div>
//   );
// };

// export default Converter;



















































// 'use client'
// import React, { useEffect, useState } from 'react';
// import { da } from 'zod/locales';

// const UOMConverter = (id) => {
//   const [pieces, setPieces] = useState('');
//   const [dozens, setDozens] = useState('');
//   const [jars, setJars] = useState('');

//   const [data,setData] = useState('')
//   // Conversion rates
//   // uom 1  1        1
//   //uom 2   12      12
//   //uom 3   2880    360

//   useEffect(() => {
//     async function fetchData(params) {
//       const response = await fetch(`http://${window.location.hostname}:5000/api/z-items/items/${id}`)
//       const post = await response.json()
//       // console.log(post)
//       // console.log('this is the data',post.data.skuUOM)
//       setData(post.data)
//     }
//     fetchData()
//   }, [])


// console.log('this bro use',data.uom2_qty)

//   const PIECES_PER_DOZEN = data.uom2_qty;
//   const PIECES_PER_JAR = data.uom3_qty;

//   const handlePiecesChange = (e) => {
//     const value = e.target.value;
//     setPieces(value);

//     if (value && !isNaN(value)) {
//       const numValue = parseFloat(value);
//       setDozens((numValue / PIECES_PER_DOZEN).toFixed(6));
//       setJars((numValue / PIECES_PER_JAR).toFixed(6));
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
//       setPieces((numValue * PIECES_PER_DOZEN).toFixed(2));
//       setJars((numValue / (PIECES_PER_JAR / PIECES_PER_DOZEN)).toFixed(6));
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
//       setPieces((numValue * PIECES_PER_JAR).toFixed(2));
//       setDozens((numValue * (PIECES_PER_JAR / PIECES_PER_DOZEN)).toFixed(2));
//     } else {
//       setPieces('');
//       setDozens('');
//     }
//   };

//   const formatValue = (value) => {
//     if (!value) return '';
//     const num = parseFloat(value);
//     return num.toString();
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//         UOM Converter
//       </h2>

//       {/* Conversion Info Card */}
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//         <p className="font-semibold text-blue-900 mb-2">Conversion Rates:</p>
//         <ul className="space-y-1 text-sm text-blue-700">
//           <li className="flex items-center">
//             <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//             1 Dozen = 12 Pieces
//           </li>
//           <li className="flex items-center">
//             <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//             1 Jar = 48 Pieces
//           </li>
//           <li className="flex items-center">
//             <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//             1 Jar = 4 Dozens
//           </li>
//         </ul>
//       </div>

//       {/* Input Fields */}
//       <div className="space-y-4">
//         {/* Pieces Input */}
//         <div className="relative">
//           <label
//             htmlFor="pieces"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {data.uom1?.uom ?? 'N/A'} (UOM 1)
//           </label>
//           <div className="flex items-center">
//             <input
//               id="pieces"
//               type="number"
//               value={pieces}
//               onChange={handlePiecesChange}
//               placeholder="Enter pieces"
//               step="any"
//               className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//             />
//             <span className="ml-3 text-gray-500 font-medium">{data.uom1?.uom ?? 'N/A'}</span>
//           </div>
//         </div>

//         {/* Dozens Input */}
//         <div className="relative">
//           <label
//             htmlFor="dozens"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {data.uomTwo?.uom ?? 'N/A'} (UOM 2)
//           </label>
//           <div className="flex items-center">
//             <input
//               id="dozens"
//               type="number"
//               value={dozens}
//               onChange={handleDozensChange}
//               placeholder="Enter dozens"
//               step="any"
//               className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
//             />
//             <span className="ml-3 text-gray-500 font-medium">{data.uomTwo?.uom ?? 'N/A'}</span>
//           </div>
//         </div>

//         {/* Jars Input */}
//         <div className="relative">
//           <label
//             htmlFor="jars"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {data.uomThree?.uom?? 'N/A'} (UOM 3)
//           </label>
//           <div className="flex items-center">
//             <input
//               id="jars"
//               type="number"
//               value={jars}
//               onChange={handleJarsChange}
//               placeholder="Enter jars"
//               step="any"
//               className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
//             />
//             <span className="ml-3 text-gray-500 font-medium">{data.uomThree?.uom?? 'N/A'}</span>
//           </div>
//         </div>
//       </div>

//       {/* Results Display */}
//       {(pieces || dozens || jars) && (
//         <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg">
//           <h3 className="text-lg font-semibold text-green-800 mb-2">
//             Conversion Results:
//           </h3>
//           <div className="text-green-700 space-y-1">
//             <p className="font-medium">
//               <span className="text-blue-600">{formatValue(pieces)}</span> pieces =
//               <span className="text-green-600 mx-1">{formatValue(dozens)}</span> dozens =
//               <span className="text-purple-600 mx-1">{formatValue(jars)}</span> jars
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UOMConverter;

// 'use client'
// import React, { useEffect, useState } from 'react';
// import { da } from 'zod/locales';

// const UOMConverter = (id) => {
//   const [pieces, setPieces] = useState('');
//   const [dozens, setDozens] = useState('');
//   const [jars, setJars] = useState('');

//   const [data,setData] = useState('')
//   // Conversion rates
//   // uom 1  1        1
//   //uom 2   12      12
//   //uom 3   2880    360

//   useEffect(() => {
//     async function fetchData(params) {
//       const response = await fetch(`http://${window.location.hostname}:5000/api/z-items/items/${id}`)
//       const post = await response.json()
//       // console.log(post)
//       // console.log('this is the data',post.data.skuUOM)
//       setData(post.data)
//     }
//     fetchData()
//   }, [])


// console.log('this bro use',data.uom2_qty)

//   const PIECES_PER_DOZEN = data.uom2_qty;
//   const PIECES_PER_JAR = data.uom3_qty;

//   const handlePiecesChange = (e) => {
//     const value = e.target.value;
//     setPieces(value);

//     if (value && !isNaN(value)) {
//       const numValue = parseFloat(value);
//       setDozens((numValue / PIECES_PER_DOZEN).toFixed(6));
//       setJars((numValue / PIECES_PER_JAR).toFixed(6));
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
//       setPieces((numValue * PIECES_PER_DOZEN).toFixed(2));
//       setJars((numValue / (PIECES_PER_JAR / PIECES_PER_DOZEN)).toFixed(6));
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
//       setPieces((numValue * PIECES_PER_JAR).toFixed(2));
//       setDozens((numValue * (PIECES_PER_JAR / PIECES_PER_DOZEN)).toFixed(2));
//     } else {
//       setPieces('');
//       setDozens('');
//     }
//   };

//   const formatValue = (value) => {
//     if (!value) return '';
//     const num = parseFloat(value);
//     return num.toString();
//   };

//   return (
//     <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
//       <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//         UOM Converter
//       </h2>

//       {/* Conversion Info Card */}
//       <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//         <p className="font-semibold text-blue-900 mb-2">Conversion Rates:</p>
//         <ul className="space-y-1 text-sm text-blue-700">
//           <li className="flex items-center">
//             <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//             1 Dozen = 12 Pieces
//           </li>
//           <li className="flex items-center">
//             <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//             1 Jar = 48 Pieces
//           </li>
//           <li className="flex items-center">
//             <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//             1 Jar = 4 Dozens
//           </li>
//         </ul>
//       </div>

//       {/* Input Fields */}
//       <div className="space-y-4">
//         {/* Pieces Input */}
//         <div className="relative">
//           <label
//             htmlFor="pieces"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {data.uom1?.uom ?? 'N/A'} (UOM 1)
//           </label>
//           <div className="flex items-center">
//             <input
//               id="pieces"
//               type="number"
//               value={pieces}
//               onChange={handlePiecesChange}
//               placeholder="Enter pieces"
//               step="any"
//               className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//             />
//             <span className="ml-3 text-gray-500 font-medium">{data.uom1?.uom ?? 'N/A'}</span>
//           </div>
//         </div>

//         {/* Dozens Input */}
//         <div className="relative">
//           <label
//             htmlFor="dozens"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {data.uomTwo?.uom ?? 'N/A'} (UOM 2)
//           </label>
//           <div className="flex items-center">
//             <input
//               id="dozens"
//               type="number"
//               value={dozens}
//               onChange={handleDozensChange}
//               placeholder="Enter dozens"
//               step="any"
//               className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
//             />
//             <span className="ml-3 text-gray-500 font-medium">{data.uomTwo?.uom ?? 'N/A'}</span>
//           </div>
//         </div>

//         {/* Jars Input */}
//         <div className="relative">
//           <label
//             htmlFor="jars"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {data.uomThree?.uom?? 'N/A'} (UOM 3)
//           </label>
//           <div className="flex items-center">
//             <input
//               id="jars"
//               type="number"
//               value={jars}
//               onChange={handleJarsChange}
//               placeholder="Enter jars"
//               step="any"
//               className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
//             />
//             <span className="ml-3 text-gray-500 font-medium">{data.uomThree?.uom?? 'N/A'}</span>
//           </div>
//         </div>
//       </div>

//       {/* Results Display */}
//       {(pieces || dozens || jars) && (
//         <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg">
//           <h3 className="text-lg font-semibold text-green-800 mb-2">
//             Conversion Results:
//           </h3>
//           <div className="text-green-700 space-y-1">
//             <p className="font-medium">
//               <span className="text-blue-600">{formatValue(pieces)}</span> pieces =
//               <span className="text-green-600 mx-1">{formatValue(dozens)}</span> dozens =
//               <span className="text-purple-600 mx-1">{formatValue(jars)}</span> jars
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default UOMConverter;































































// 'use client'
// import React, { useEffect, useState } from 'react';
// import { da } from 'zod/locales';

// const UOMConverter = (id) => {
//   const [pieces, setPieces] = useState('');
//   const [dozens, setDozens] = useState('');
//   const [jars, setJars] = useState('');

//   const [data,setData] = useState('')
//   // Conversion rates
//   // uom 1  1        1
//   //uom 2   12      12
//   //uom 3   2880    360

//   useEffect(() => {
//     async function fetchData(params) {
//       const response = await fetch(`http://${window.location.hostname}:5000/api/z-items/items/${id}`)
//       const post = await response.json()
//       // console.log(post)
//       // console.log('this is the data',post.data.skuUOM)
//       setData(post.data)
//     }
//     fetchData()
//   }, [])


// console.log('this bro use',data.uom2_qty)

//   const PIECES_PER_DOZEN = data.uom2_qty;
//   const PIECES_PER_JAR = data.uom3_qty;

//   const handlePiecesChange = (e) => {
//     const value = e.target.value;
//     setPieces(value);

//     if (value && !isNaN(value)) {
//       const numValue = parseFloat(value);
//       setDozens((numValue / PIECES_PER_DOZEN).toFixed(6));
//       setJars((numValue / PIECES_PER_JAR).toFixed(6));
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
//       setPieces((numValue * PIECES_PER_DOZEN).toFixed(2));
//       setJars((numValue / (PIECES_PER_JAR / PIECES_PER_DOZEN)).toFixed(6));
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
//       setPieces((numValue * PIECES_PER_JAR).toFixed(2));
//       setDozens((numValue * (PIECES_PER_JAR / PIECES_PER_DOZEN)).toFixed(2));
//     } else {
//       setPieces('');
//       setDozens('');
//     }
//   };

//   const formatValue = (value) => {
//     if (!value) return '';
//     const num = parseFloat(value);
//     return num.toString();
//   };

//   return (
//     <div className="mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
//       {/* <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
//         UOM Converter
//       </h2> */}

//       {/* Conversion Info Card */}
//       {/* <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
//         <p className="font-semibold text-blue-900 mb-2">Conversion Rates:</p>
//         <ul className="space-y-1 text-sm text-blue-700">
//           <li className="flex items-center">
//             <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//             1 Dozen = 12 Pieces
//           </li>
//           <li className="flex items-center">
//             <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//             1 Jar = 48 Pieces
//           </li>
//           <li className="flex items-center">
//             <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
//             1 Jar = 4 Dozens
//           </li>
//         </ul>
//       </div> */}

//       {/* Input Fields */}
//       <div className="space-y-4 flex">
//         {/* Pieces Input */}
//         <div className="relative">
//           <label
//             htmlFor="pieces"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {data.uom1?.uom ?? 'N/A'} (UOM 1)
//           </label>
//           <div className="flex items-center">
//             <input
//               id="pieces"
//               type="number"
//               value={pieces}
//               onChange={handlePiecesChange}
//               placeholder="Enter pieces"
//               step="any"
//               className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
//             />
//             <span className="ml-3 text-gray-500 font-medium">{data.uom1?.uom ?? 'N/A'}</span>
//           </div>
//         </div>

//         {/* Dozens Input */}
//         <div className="relative">
//           <label
//             htmlFor="dozens"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {data.uomTwo?.uom ?? 'N/A'} (UOM 2)
//           </label>
//           <div className="flex items-center">
//             <input
//               id="dozens"
//               type="number"
//               value={dozens}
//               onChange={handleDozensChange}
//               placeholder="Enter dozens"
//               step="any"
//               className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
//             />
//             <span className="ml-3 text-gray-500 font-medium">{data.uomTwo?.uom ?? 'N/A'}</span>
//           </div>
//         </div>

//         {/* Jars Input */}
//         <div className="relative">
//           <label
//             htmlFor="jars"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             {data.uomThree?.uom?? 'N/A'} (UOM 3)
//           </label>
//           <div className="flex items-center">
//             <input
//               id="jars"
//               type="number"
//               value={jars}
//               onChange={handleJarsChange}
//               placeholder="Enter jars"
//               step="any"
//               className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
//             />
//             <span className="ml-3 text-gray-500 font-medium">{data.uomThree?.uom?? 'N/A'}</span>
//           </div>
//         </div>
//       </div>

//       {/* Results Display */}
//       {/* {(pieces || dozens || jars) && (
//         <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg">
//           <h3 className="text-lg font-semibold text-green-800 mb-2">
//             Conversion Results:
//           </h3>
//           <div className="text-green-700 space-y-1">
//             <p className="font-medium">
//               <span className="text-blue-600">{formatValue(pieces)}</span> pieces =
//               <span className="text-green-600 mx-1">{formatValue(dozens)}</span> dozens =
//               <span className="text-purple-600 mx-1">{formatValue(jars)}</span> jars
//             </p>
//           </div>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default UOMConverter;




























































// 'use client'
// import React, { useEffect, useState } from 'react';

// const UOMConverter = ({ id }) => {
//   const [pieces, setPieces] = useState('');
//   const [dozens, setDozens] = useState('');
//   const [jars, setJars] = useState('');
//   const [data, setData] = useState({ uom2_qty: 12, uom3_qty: 2880 });

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await fetch(`http://${window.location.hostname}:5000/api/z-items/items/2`);
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

// export default UOMConverter;




































import React from 'react'
import UomConverter from '../../components/UomConverter'
function page() {
  return (
    <div>
      <UomConverter/>
    </div>
  )
}

export default page