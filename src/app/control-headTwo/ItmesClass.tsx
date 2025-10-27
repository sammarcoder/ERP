'use client'

import React, { useState } from 'react'

interface FormData {
  classId: number | null;
  className: string;
}

const ItemsClass = () => {
  const [formData, setFormData] = useState<FormData>({
    classId: null,
    className: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Simplified handler - no generics needed
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'classId' ? (value ? Number(value) : null) : value
    }));
  };

  // Simplified submit - no explicit return type needed
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.classId || !formData.className) {
      setMessage('Please fill all fields');
      return;
    }
    
    try {
      setLoading(true);
      setMessage('');
      
      const response = await fetch(
        `http://${window.location.hostname}:4000/api/z-classes/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) throw new Error('Failed to save');
      
      const result = await response.json();
      console.log('Success:', result);
      
      setMessage('Data saved successfully!');
      setFormData({ classId: null, className: '' });
      
    } catch (err) {
      console.error('Error:', err);
      setMessage('Error: Failed to save data');
    } finally {
      setLoading(false);
    }
  };

  const classOptions = [1, 2, 3, 4];

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white shadow-xl rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Items Class Form
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class ID <span className="text-red-500">*</span>
              </label>
              <select 
                name="classId" 
                value={formData.classId ?? ''} 
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Class</option>
                {classOptions.map(id => (
                  <option key={id} value={id}>
                    Class {id}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                className <span className="text-red-500">*</span>
              </label>
              <input 
                type="text"
                name="className" 
                value={formData.className} 
                onChange={handleChange}
                placeholder="Enter className"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-3 px-4 rounded-md text-white font-medium transition-colors
                ${loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
                }`}
            >
              {loading ? 'Saving...' : 'Save Data'}
            </button>
          </form>
          
          {message && (
            <div className={`mt-4 p-3 rounded-md text-sm
              ${message.includes('success') 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
              }`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemsClass;
