import { TrialBalanceFilterState, TrialBalanceFilterOptions } from '@/types/reports/journalmaster/trialbalance/TrialBalanceTypes'

interface TrialBalanceFiltersProps {
  filters: TrialBalanceFilterState
  setFilters: React.Dispatch<React.SetStateAction<TrialBalanceFilterState>>
  filterOptions: TrialBalanceFilterOptions
  onClear: () => void
}

export default function TrialBalanceFilters({
  filters,
  setFilters,
  filterOptions,
  onClear
}: TrialBalanceFiltersProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium mb-4">Trial Balance Filters</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Account Name Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
          <select
            value={filters.acName}
            onChange={(e) => setFilters(prev => ({ ...prev, acName: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Accounts ({filterOptions.acNames.length})</option>
            {filterOptions.acNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>

        {/* Date From */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div> */}

        {/* Date To */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div> */}



        {/* compulsory date */}

        {/* Date From - with account filter requirement */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date From
            {!filters.acName && <span className="text-red-500 text-xs">(Requires Account Filter)</span>}
          </label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            disabled={!filters.acName} // ✅ Disable if no account filter
            className={`w-full border rounded-md px-3 py-2 text-sm ${!filters.acName
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
          />
        </div> */}

        {/* Date To - with account filter requirement */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date To
            {!filters.acName && <span className="text-red-500 text-xs">(Requires Account Filter)</span>}
          </label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            disabled={!filters.acName} // ✅ Disable if no account filter
            className={`w-full border rounded-md px-3 py-2 text-sm ${!filters.acName
                ? 'border-gray-300 bg-gray-100 cursor-not-allowed'
                : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
              }`}
          />
        </div> */}




        {/* Date From - no account filter requirement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date To - no account filter requirement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>




        {/* Entry Type */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Entry Type</label>
          <select
            value={filters.entryType}
            onChange={(e) => setFilters(prev => ({ ...prev, entryType: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Entries</option>
            <option value="credit_only">Credit Entries Only</option>
            <option value="debit_only">Debit Entries Only</option>
          </select>
        </div> */}

        {/* Description Search */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description Search</label>
          <input
            type="text"
            placeholder="Search description..."
            value={filters.description}
            onChange={(e) => setFilters(prev => ({ ...prev, description: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div> */}

        {/* Show Zero Balance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Display Options</label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="showZeroBalance"
              checked={filters.showZeroBalance}
              onChange={(e) => setFilters(prev => ({ ...prev, showZeroBalance: e.target.checked }))}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="showZeroBalance" className="ml-2 block text-sm text-gray-900">
              Show Zero Balance Accounts
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
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
