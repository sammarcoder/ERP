'use client';

import { useState, useEffect } from 'react';

export function useCoaReport() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = async () => {
    console.log('🔄 FRONTEND: Starting report fetch...');
    setLoading(true);
    
    try {
      const response = await fetch('/api/coa-report');
      
      console.log('📡 FRONTEND: API Response Status:', response.status);
      console.log('📡 FRONTEND: API Response OK:', response.ok);
      
      const result = await response.json();
      
      console.log('🎯 FRONTEND: Full API Response:', result);
      console.log('=====================================');
      console.log('Response Object:', result);
      console.log('Success:', result.success);
      console.log('Chart Data Available:', !!result.chartData);
      console.log('Table Data Available:', !!result.tableData);
      console.log('Total Records:', result.totalRecords);
      console.log('=====================================');
      
      if (result.success) {
        console.log('📊 FRONTEND: Chart Data Structure:');
        console.log('Labels:', result.chartData?.labels?.slice(0, 5), '...');
        console.log('Dataset Length:', result.chartData?.datasets?.[0]?.data?.length);
        
        console.log('📋 FRONTEND: Table Data Structure:');
        console.log('Headers:', result.tableData?.headers);
        console.log('Rows Count:', result.tableData?.rows?.length);
        console.log('First Row:', result.tableData?.rows?.[0]);
        
        setData(result);
        console.log('✅ FRONTEND: Data set successfully');
      } else {
        setError(result.error);
        console.error('❌ FRONTEND: API returned error:', result.error);
      }
    } catch (err) {
      console.error('❌ FRONTEND: Fetch error:');
      console.error('Error Type:', err.constructor.name);
      console.error('Error Message:', err.message);
      setError('Failed to load report');
    } finally {
      setLoading(false);
      console.log('✅ FRONTEND: Loading complete');
    }
  };

  useEffect(() => {
    console.log('🚀 FRONTEND: Component mounted, starting data fetch...');
    fetchReport();
  }, []);

  return {
    data,
    loading,
    error,
    refetch: fetchReport
  };
}
