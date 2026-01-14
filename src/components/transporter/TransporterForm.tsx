// 'use client'
// import React, { useState, useEffect } from 'react';
// import { useAppDispatch, useAppSelector } from '@/hooks/redux';
// import { createTransporter, updateTransporter, type Transporter } from '@/store/slice/transporterSlice';

// interface TransporterFormProps {
//   transporter?: Transporter | null;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// export function TransporterForm({ transporter, onClose, onSuccess }: TransporterFormProps) {
//   const dispatch = useAppDispatch();
//   const { loading } = useAppSelector((state) => state.transporter);

//   const [formData, setFormData] = useState({
//     name: '',
//     contactPerson: '',
//     phone: '',
//     address: '',
//     isActive: true
//   });

//   const [errors, setErrors] = useState<Record<string, string>>({});

//   useEffect(() => {
//     if (transporter) {
//       setFormData({
//         name: transporter.name,
//         contactPerson: transporter.contactPerson || '',
//         phone: transporter.phone || '',
//         address: transporter.address || '',
//         isActive: transporter.isActive
//       });
//     }
//   }, [transporter]);

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {};

//     if (!formData.name.trim()) {
//       newErrors.name = 'Transporter name is required';
//     }

//     if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
//       newErrors.phone = 'Please enter a valid phone number';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (!validateForm()) return;

//     try {
//       if (transporter) {
//         await dispatch(updateTransporter({
//           id: transporter.id,
//           ...formData
//         })).unwrap();
//       } else {
//         await dispatch(createTransporter(formData)).unwrap();
//       }

//       onSuccess();
//     } catch (error) {
//       console.error('Form submission failed:', error);
//     }
//   };

//   const handleChange = (field: string, value: any) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
    
//     // Clear error when user starts typing
//     if (errors[field]) {
//       setErrors(prev => ({ ...prev, [field]: '' }));
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
//       <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        
//         {/* Header */}
//         <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-xl">
//           <div className="flex justify-between items-center">
//             <div>
//               <h2 className="text-xl font-bold">
//                 {transporter ? 'Edit Transporter' : 'Add New Transporter'}
//               </h2>
//               <p className="text-blue-100 mt-1">
//                 {transporter ? 'Update transporter information' : 'Create a new transport provider'}
//               </p>
//             </div>
//             <button
//               onClick={onClose}
//               className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-2 transition-colors"
//             >
//               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
//           {/* Name */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Transporter Name *
//             </label>
//             <input
//               type="text"
//               value={formData.name}
//               onChange={(e) => handleChange('name', e.target.value)}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                 errors.name ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="Enter transporter company name"
//               required
//             />
//             {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
//           </div>

//           {/* Contact Person */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Contact Person
//             </label>
//             <input
//               type="text"
//               value={formData.contactPerson}
//               onChange={(e) => handleChange('contactPerson', e.target.value)}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter contact person name"
//             />
//           </div>

//           {/* Phone */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Phone Number
//             </label>
//             <input
//               type="tel"
//               value={formData.phone}
//               onChange={(e) => handleChange('phone', e.target.value)}
//               className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
//                 errors.phone ? 'border-red-500' : 'border-gray-300'
//               }`}
//               placeholder="Enter phone number"
//             />
//             {errors.phone && <p className="text-red-600 text-sm mt-1">{errors.phone}</p>}
//           </div>

//           {/* Address */}
//           <div>
//             <label className="block text-sm font-semibold text-gray-700 mb-2">
//               Address
//             </label>
//             <textarea
//               value={formData.address}
//               onChange={(e) => handleChange('address', e.target.value)}
//               rows={3}
//               className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
//               placeholder="Enter complete address"
//             />
//           </div>

//           {/* Status */}
//           <div className="flex items-center">
//             <input
//               type="checkbox"
//               id="isActive"
//               checked={formData.isActive}
//               onChange={(e) => handleChange('isActive', e.target.checked)}
//               className="w-5 h-5 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
//             />
//             <label htmlFor="isActive" className="ml-3 text-sm font-medium text-gray-700">
//               Active Status
//               <span className="block text-xs text-gray-500">
//                 Unchecked transporters will be marked as inactive
//               </span>
//             </label>
//           </div>

//           {/* Form Actions */}
//           <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={onClose}
//               className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               disabled={loading}
//               className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium flex items-center transition-colors"
//             >
//               {loading ? (
//                 <>
//                   <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
//                   {transporter ? 'Updating...' : 'Creating...'}
//                 </>
//               ) : (
//                 <>
//                   <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                   </svg>
//                   {transporter ? 'Update Transporter' : 'Create Transporter'}
//                 </>
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

























































'use client'
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { createTransporter, updateTransporter, type Transporter } from '@/store/slice/transporterSlice';

interface TransporterFormProps {
  transporter?: Transporter | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function TransporterForm({ transporter, onClose, onSuccess }: TransporterFormProps) {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.transporter);

  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    address: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (transporter) {
      setFormData({
        name: transporter.name,
        contactPerson: transporter.contactPerson || '',
        phone: transporter.phone || '',
        address: transporter.address || '',
        isActive: transporter.isActive
      });
    }
  }, [transporter]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Transporter name is required';
    }

    if (formData.phone && !/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (transporter) {
        await dispatch(updateTransporter({
          id: transporter.id,
          ...formData
        })).unwrap();
      } else {
        await dispatch(createTransporter(formData)).unwrap();
      }

      onSuccess();
    } catch (error) {
      console.error('Form submission failed:', error);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* ✅ Backdrop with opacity and blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      
      {/* ✅ Modal with glassmorphism effect */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md max-h-[95vh] flex flex-col border border-white/20 overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 sm:p-6 flex-shrink-0">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-lg sm:text-xl font-bold">
                {transporter ? 'Edit Transporter' : 'Add New Transporter'}
              </h2>
              <p className="text-blue-100 text-sm mt-1 hidden sm:block">
                {transporter ? 'Update transporter information' : 'Create a new transport provider'}
              </p>
            </div>
            <button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 rounded-lg p-2 transition-all duration-200 hover:rotate-90"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="overflow-y-auto flex-1 overscroll-contain">
          <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Transporter Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm sm:text-base bg-white/80 backdrop-blur-sm ${
                  errors.name ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                }`}
                placeholder="Enter transporter company name"
              />
              {errors.name && (
                <p className="text-red-600 text-xs sm:text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.name}
                </p>
              )}
            </div>

            {/* Contact Person */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Contact Person
              </label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={(e) => handleChange('contactPerson', e.target.value)}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm sm:text-base bg-white/80 backdrop-blur-sm"
                placeholder="Enter contact person name"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Phone Number
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm sm:text-base bg-white/80 backdrop-blur-sm ${
                  errors.phone ? 'border-red-500 bg-red-50/50' : 'border-gray-300'
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-red-600 text-xs sm:text-sm mt-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {errors.phone}
                </p>
              )}
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Address
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={2}
                className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 focus:outline-none transition-all duration-200 text-sm sm:text-base resize-none bg-white/80 backdrop-blur-sm"
                placeholder="Enter complete address"
              />
            </div>

            {/* Status Toggle */}
            <div className="flex items-center justify-between p-3 bg-gray-50/80 backdrop-blur-sm rounded-xl border border-gray-200">
              <div>
                <label htmlFor="isActive" className="text-sm font-semibold text-gray-700 cursor-pointer">
                  Active Status
                </label>
                <p className="text-xs text-gray-500">
                  Inactive transporters won't appear in selections
                </p>
              </div>
              {/* Toggle Switch */}
              <button
                type="button"
                onClick={() => handleChange('isActive', !formData.isActive)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                  formData.isActive ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200/50">
              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 text-sm sm:text-base border border-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white rounded-xl font-medium flex items-center justify-center transition-all duration-200 text-sm sm:text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 disabled:shadow-none"
              >
                {loading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    {transporter ? 'Updating...' : 'Creating...'}
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {transporter ? 'Update' : 'Create'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
