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


































'use client'
import React, { useState } from 'react';

const UOMConverter = () => {
  const [pieces, setPieces] = useState('');
  const [dozens, setDozens] = useState('');
  const [jars, setJars] = useState('');
  
  // Conversion rates
  const PIECES_PER_DOZEN = 12;
  const PIECES_PER_JAR = 48;
  
  const handlePiecesChange = (e) => {
    const value = e.target.value;
    setPieces(value);
    
    if (value && !isNaN(value)) {
      const numValue = parseFloat(value);
      setDozens((numValue / PIECES_PER_DOZEN).toFixed(6));
      setJars((numValue / PIECES_PER_JAR).toFixed(6));
    } else {
      setDozens('');
      setJars('');
    }
  };
  
  const handleDozensChange = (e) => {
    const value = e.target.value;
    setDozens(value);
    
    if (value && !isNaN(value)) {
      const numValue = parseFloat(value);
      setPieces((numValue * PIECES_PER_DOZEN).toFixed(2));
      setJars((numValue / (PIECES_PER_JAR / PIECES_PER_DOZEN)).toFixed(6));
    } else {
      setPieces('');
      setJars('');
    }
  };
  
  const handleJarsChange = (e) => {
    const value = e.target.value;
    setJars(value);
    
    if (value && !isNaN(value)) {
      const numValue = parseFloat(value);
      setPieces((numValue * PIECES_PER_JAR).toFixed(2));
      setDozens((numValue * (PIECES_PER_JAR / PIECES_PER_DOZEN)).toFixed(2));
    } else {
      setPieces('');
      setDozens('');
    }
  };

  const formatValue = (value) => {
    if (!value) return '';
    const num = parseFloat(value);
    return num.toString();
  };

  return (
    <div className="max-w-lg mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
        UOM Converter
      </h2>
      
      {/* Conversion Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="font-semibold text-blue-900 mb-2">Conversion Rates:</p>
        <ul className="space-y-1 text-sm text-blue-700">
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            1 Dozen = 12 Pieces
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            1 Jar = 48 Pieces
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
            1 Jar = 4 Dozens
          </li>
        </ul>
      </div>

      {/* Input Fields */}
      <div className="space-y-4">
        {/* Pieces Input */}
        <div className="relative">
          <label 
            htmlFor="pieces" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Pieces (UOM 1)
          </label>
          <div className="flex items-center">
            <input 
              id="pieces"
              type="number" 
              value={pieces} 
              onChange={handlePiecesChange} 
              placeholder="Enter pieces"
              step="any"
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
            <span className="ml-3 text-gray-500 font-medium">pcs</span>
          </div>
        </div>

        {/* Dozens Input */}
        <div className="relative">
          <label 
            htmlFor="dozens" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Dozens (UOM 2)
          </label>
          <div className="flex items-center">
            <input 
              id="dozens"
              type="number" 
              value={dozens} 
              onChange={handleDozensChange} 
              placeholder="Enter dozens"
              step="any"
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
            <span className="ml-3 text-gray-500 font-medium">dozens</span>
          </div>
        </div>

        {/* Jars Input */}
        <div className="relative">
          <label 
            htmlFor="jars" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Jars (UOM 3)
          </label>
          <div className="flex items-center">
            <input 
              id="jars"
              type="number" 
              value={jars} 
              onChange={handleJarsChange} 
              placeholder="Enter jars"
              step="any"
              className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
            />
            <span className="ml-3 text-gray-500 font-medium">jars</span>
          </div>
        </div>
      </div>

      {/* Results Display */}
      {(pieces || dozens || jars) && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Conversion Results:
          </h3>
          <div className="text-green-700 space-y-1">
            <p className="font-medium">
              <span className="text-blue-600">{formatValue(pieces)}</span> pieces = 
              <span className="text-green-600 mx-1">{formatValue(dozens)}</span> dozens = 
              <span className="text-purple-600 mx-1">{formatValue(jars)}</span> jars
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UOMConverter;
