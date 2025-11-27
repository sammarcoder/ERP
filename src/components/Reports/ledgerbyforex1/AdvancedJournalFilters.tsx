import { AdvancedFilterState, AdvancedFilterOptions } from '@/types/reports/journalmaster/ledgerbyforex1/LedgerByForexTypes'

interface AdvancedJournalFiltersProps {
  filters: AdvancedFilterState
  setFilters: React.Dispatch<React.SetStateAction<AdvancedFilterState>>
  filterOptions: AdvancedFilterOptions
  onClear: () => void
}

export default function AdvancedJournalFilters({ 
  filters, 
  setFilters, 
  filterOptions, 
  onClear 
}: AdvancedJournalFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium mb-4">Advanced Journal Master Filters</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* ✅ MANDATORY Account Name Filter */}
        <div>
          <label className="block text-sm font-medium text-red-600 mb-1">
            Account Name * (Required)
          </label>
          <select
            value={filters.acName}
            onChange={(e) => setFilters(prev => ({ ...prev, acName: e.target.value }))}
            className={`w-full border rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500 ${
              !filters.acName ? 'border-red-300 bg-red-50' : 'border-gray-300'
            }`}
            required
          >
            <option value="">⚠️ Select Account (Required)</option>
            {filterOptions.acNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          {!filters.acName && (
            <p className="text-xs text-red-500 mt-1">Account selection is mandatory for processing</p>
          )}
        </div>

        {/* Date From */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            disabled={!filters.acName}
            className={`w-full border rounded-md px-3 py-2 text-sm ${
              !filters.acName 
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            disabled={!filters.acName}
            className={`w-full border rounded-md px-3 py-2 text-sm ${
              !filters.acName 
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            type="text"
            placeholder="Search description..."
            value={filters.description}
            onChange={(e) => setFilters(prev => ({ ...prev, description: e.target.value }))}
            disabled={!filters.acName}
            className={`w-full border rounded-md px-3 py-2 text-sm ${
              !filters.acName 
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          />
        </div>

        {/* Entry Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entry Type</label>
          <select
            value={filters.entryType}
            onChange={(e) => setFilters(prev => ({ ...prev, entryType: e.target.value }))}
            disabled={!filters.acName}
            className={`w-full border rounded-md px-3 py-2 text-sm ${
              !filters.acName 
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed' 
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }`}
          >
            <option value="">All Entries</option>
            <option value="credit_only">Credit Entries Only</option>
            <option value="debit_only">Debit Entries Only</option>
          </select>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          {!filters.acName ? (
            <span className="text-red-600 font-medium">⚠️ Account selection required to enable other filters</span>
          ) : (
            <span className="text-green-600 font-medium">✅ Account selected: {filters.acName}</span>
          )}
        </div>
        <button
          onClick={onClear}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  )
}
