'use client';

import { useCoaReport } from '../../hooks/useCoaReport';

export default function DebugReportPage() {
  const { data, loading, error, refetch } = useCoaReport();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🐛 COA Report Debug</h1>
        
        <div className="space-y-6">
          {/* Status */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-2">Status</h2>
            <p>Loading: {loading ? '⏳ Yes' : '✅ No'}</p>
            <p>Error: {error || '✅ None'}</p>
            <p>Data Available: {data ? '✅ Yes' : '❌ No'}</p>
          </div>

          {/* Controls */}
          <div className="bg-white p-4 rounded-lg shadow">
            <button 
              onClick={refetch}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              🔄 Fetch Again
            </button>
          </div>

          {/* Raw Data Display */}
          {data && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Raw Data Structure</h2>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          )}

          {/* Table Preview */}
          {data?.tableData && (
            <div className="bg-white p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-2">Table Data Preview</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-gray-100">
                      {data.tableData.headers.map((header, index) => (
                        <th key={index} className="p-2 text-left">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.tableData.rows.slice(0, 10).map((row, index) => (
                      <tr key={index} className="border-t">
                        {row.map((cell, cellIndex) => (
                          <td key={cellIndex} className="p-2">{cell || '-'}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
