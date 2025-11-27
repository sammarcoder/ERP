// import { useState } from 'react'
// import { FilterParams } from '@/types/reports/journalmaster/agedreports/AgedAccountsTypes'

// interface AgedAccountsFiltersProps {
//   onFilter: (params: FilterParams) => void
//   loading: boolean
// }

// export default function AgedAccountsFilters({ onFilter, loading }: AgedAccountsFiltersProps) {
//   const [filters, setFilters] = useState<FilterParams>({
//     accountPrefix: '',
//     asOfDate: new Date().toISOString().split('T')[0], // Today
//     phaseDays: 15
//   })
  
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault()
//     if (filters.phaseDays <= 0) {
//       alert('Phase days must be a positive number')
//       return
//     }
//     onFilter(filters)
//   }
  
//   return (
//     <div className="bg-white rounded-lg shadow p-4">
//       <h3 className="text-lg font-medium mb-4">Aged Accounts Report Filters</h3>
      
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
//           {/* Account Prefix */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Account Name Prefix *
//             </label>
//             <input
//               type="text"
//               required
//               placeholder="e.g., ABC, Customer..."
//               value={filters.accountPrefix}
//               onChange={(e) => setFilters(prev => ({ ...prev, accountPrefix: e.target.value }))}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//             />
//             <p className="text-xs text-gray-500 mt-1">Case-insensitive, matches accounts starting with this text</p>
//           </div>
          
//           {/* As-of Date */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               As-of Date
//             </label>
//             <input
//               type="date"
//               required
//               value={filters.asOfDate}
//               onChange={(e) => setFilters(prev => ({ ...prev, asOfDate: e.target.value }))}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//             />
//             <p className="text-xs text-gray-500 mt-1">Only transactions up to this date</p>
//           </div>
          
//           {/* Phase Days */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-1">
//               Phase Length (Days) *
//             </label>
//             <input
//               type="number"
//               required
//               min="1"
//               placeholder="e.g., 15, 30"
//               value={filters.phaseDays || ''}
//               onChange={(e) => setFilters(prev => ({ ...prev, phaseDays: parseInt(e.target.value) || 0 }))}
//               className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
//             />
//             <p className="text-xs text-gray-500 mt-1">Each phase will be this many days</p>
//           </div>
//         </div>
        
//         <div className="flex justify-end">
//           <button
//             type="submit"
//             disabled={loading || !filters.accountPrefix || filters.phaseDays <= 0}
//             className={`px-6 py-2 rounded-md font-medium ${
//               loading || !filters.accountPrefix || filters.phaseDays <= 0
//                 ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
//                 : 'bg-blue-600 text-white hover:bg-blue-700'
//             }`}
//           >
//             {loading ? 'Processing...' : 'Generate Report'}
//           </button>
//         </div>
//       </form>
      
//       {/* Phase Explanation */}
//       {filters.phaseDays > 0 && (
//         <div className="mt-4 p-3 bg-blue-50 rounded-md">
//           <h4 className="font-medium text-blue-800 mb-2">Phase Breakdown ({filters.phaseDays} days each):</h4>
//           <ul className="text-sm text-blue-700 space-y-1">
//             <li><strong>Phase 3 (Newest):</strong> Last {filters.phaseDays} days</li>
//             <li><strong>Phase 2 (Middle):</strong> {filters.phaseDays + 1} to {filters.phaseDays * 2} days ago</li>
//             <li><strong>Phase 1 (Oldest):</strong> {filters.phaseDays * 2 + 1}+ days ago</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   )
// }









































import { useState } from 'react'
import { FilterParams } from '@/types/reports/journalmaster/agedreports/AgedAccountsTypes'

interface AgedAccountsFiltersProps {
  onFilter: (params: FilterParams) => void
  loading: boolean
  availableAccounts?: string[] // ✅ NEW: Available accounts for suggestions
}

export default function AgedAccountsFilters({ onFilter, loading, availableAccounts = [] }: AgedAccountsFiltersProps) {
  const [filters, setFilters] = useState<FilterParams>({
    accountPrefix: '',
    asOfDate: new Date().toISOString().split('T')[0],
    phaseDays: 15
  })
  
  const [showSuggestions, setShowSuggestions] = useState(false)

  // Filter account suggestions based on current input
  const filteredSuggestions = availableAccounts.filter(account =>
    account.toLowerCase().includes(filters.accountPrefix.toLowerCase()) && 
    filters.accountPrefix.length > 0
  ).slice(0, 10) // Limit to 10 suggestions

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (filters.phaseDays <= 0) {
      alert('Phase days must be a positive number')
      return
    }
    onFilter(filters)
  }

  const handleAccountPrefixChange = (value: string) => {
    setFilters(prev => ({ ...prev, accountPrefix: value }))
    setShowSuggestions(value.length > 0)
  }

  const selectSuggestion = (accountName: string) => {
    // Extract common prefix for filtering
    const parts = accountName.split(' ')
    const prefix = parts[0] // Use first word as prefix
    setFilters(prev => ({ ...prev, accountPrefix: prefix }))
    setShowSuggestions(false)
  }
  
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium mb-4">Aged Accounts Report Filters</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Account Prefix with Suggestions */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Account Name Prefix *
            </label>
            <input
              type="text"
              required
              placeholder="e.g., ABC, Customer..."
              value={filters.accountPrefix}
              onChange={(e) => handleAccountPrefixChange(e.target.value)}
              onFocus={() => setShowSuggestions(filters.accountPrefix.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            
            {/* Account Suggestions Dropdown */}
            {showSuggestions && filteredSuggestions.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-40 overflow-y-auto">
                {filteredSuggestions.map((account, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => selectSuggestion(account)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-sm border-b border-gray-100 last:border-b-0"
                  >
                    <span className="font-medium text-blue-600">{account.split(' ')[0]}</span>
                    <span className="text-gray-600"> - {account}</span>
                  </button>
                ))}
              </div>
            )}
            
            <p className="text-xs text-gray-500 mt-1">
              Case-insensitive, matches accounts starting with this text
              {availableAccounts.length > 0 && (
                <span className="text-blue-600"> • {availableAccounts.length} accounts available</span>
              )}
            </p>
          </div>
          
          {/* As-of Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              As-of Date
            </label>
            <input
              type="date"
              required
              value={filters.asOfDate}
              onChange={(e) => setFilters(prev => ({ ...prev, asOfDate: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Only transactions up to this date</p>
          </div>
          
          {/* Phase Days */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phase Length (Days) *
            </label>
            <input
              type="number"
              required
              min="1"
              placeholder="e.g., 15, 30"
              value={filters.phaseDays || ''}
              onChange={(e) => setFilters(prev => ({ ...prev, phaseDays: parseInt(e.target.value) || 0 }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Each phase will be this many days</p>
          </div>
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !filters.accountPrefix || filters.phaseDays <= 0}
            className={`px-6 py-2 rounded-md font-medium ${
              loading || !filters.accountPrefix || filters.phaseDays <= 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Processing...' : 'Generate Report'}
          </button>
        </div>
      </form>
      
      {/* Phase Explanation */}
      {filters.phaseDays > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">Phase Breakdown ({filters.phaseDays} days each):</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li><strong>Phase 3 (Newest):</strong> Last {filters.phaseDays} days</li>
            <li><strong>Phase 2 (Middle):</strong> {filters.phaseDays + 1} to {filters.phaseDays * 2} days ago</li>
            <li><strong>Phase 1 (Oldest):</strong> {filters.phaseDays * 2 + 1}+ days ago</li>
          </ul>
        </div>
      )}
    </div>
  )
}
