import { FilterState, FilterOptions } from '@/types/reports/journalmaster/JournalTypes'

interface FilterPanelProps {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  filterOptions: FilterOptions
  onClear: () => void
}

export default function FilterPanel({ filters, setFilters, filterOptions, onClear }: FilterPanelProps) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-medium mb-4">Filter Options</h3>
      <p className="text-sm text-blue-600 mb-4">⚡ Filters applied FIRST, then balance calculated on filtered data</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Opening Balance</label>
          <select
            value={filters.showOpeningOnly ? 'opening_only' : ''}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              showOpeningOnly: e.target.value === 'opening_only'
            }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Entries</option>
            <option value="opening_only">🔶 Opening Balance Only</option>
          </select>
        </div> */}

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Date To */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Entry Type Filter */}
        <div>
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
        </div>

        {/* Description Search */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description Search</label>
          <input
            type="text"
            placeholder="Search in description..."
            value={filters.description}
            onChange={(e) => setFilters(prev => ({ ...prev, description: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Receipt Number Search */}
        {/* <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number</label>
          <input
            type="text"
            placeholder="Search receipt..."
            value={filters.receiptNo}
            onChange={(e) => setFilters(prev => ({ ...prev, receiptNo: e.target.value }))}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
          />
        </div> */}
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
