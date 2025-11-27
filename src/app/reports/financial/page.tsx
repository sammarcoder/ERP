'use client'

import { useState, useEffect } from 'react'
import ChartJsComponent from '@/components/charts/ChartJsComponent'
import ApexChartsComponent from '@/components/charts/ApexChartsComponent'
import EChartsComponent from '@/components/charts/EChartsComponent'
import RechartsComponent from '@/components/charts/RechartsComponent'
import { 
  ArrowUpIcon, 
  ArrowDownIcon, 
  ScaleIcon, 
  CurrencyDollarIcon,
  BanknotesIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon 
} from '@heroicons/react/24/outline'

// Custom Components (Tremor-free)
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-6 ${className}`}>
    {children}
  </div>
)

const Metric = ({ children, className = "", color = "gray" }: { 
  children: React.ReactNode, 
  className?: string,
  color?: string 
}) => {
  const colorClasses = {
    gray: "text-gray-900",
    green: "text-green-600",
    red: "text-red-600",
    blue: "text-blue-600"
  }
  
  return (
    <p className={`text-2xl font-bold ${colorClasses[color] || colorClasses.gray} ${className}`}>
      {children}
    </p>
  )
}

const Badge = ({ children, color = "blue", size = "sm" }: { 
  children: React.ReactNode, 
  color?: string,
  size?: string 
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    purple: "bg-purple-100 text-purple-800",
    orange: "bg-orange-100 text-orange-800",
    gray: "bg-gray-100 text-gray-800"
  }
  
  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-2.5 py-1.5 text-xs",
    md: "px-3 py-2 text-sm"
  }
  
  return (
    <span className={`inline-flex font-semibold rounded-full ${colorClasses[color] || colorClasses.blue} ${sizeClasses[size] || sizeClasses.sm}`}>
      {children}
    </span>
  )
}

interface FinancialData {
  summary: {
    totalDebits: number
    totalCredits: number
    netPosition: number
    totalVolume: number
    averageTransaction: number
    accountsCount: number
  }
  accountTypes: any[]
  monthlyComparison: any[]
  topAccounts: any[]
  debitCreditTrend: any[]
  financialRatios: {
    debitRatio: number
    creditRatio: number
    activityRatio: number
    growthRate: number
  }
}

export default function FinancialReportsPage() {
  const [data, setData] = useState<FinancialData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('current_month')
  const [selectedChart, setSelectedChart] = useState('chartjs')

  useEffect(() => {
    fetchFinancialData()
  }, [selectedPeriod])

  const fetchFinancialData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/journalmaster')
      const result = await response.json()
      
      if (result.success) {
        const financialData = transformToFinancialData(result.data)
        setData(financialData)
      }
    } catch (error) {
      console.error('Error fetching financial data:', error)
    } finally {
      setLoading(false)
    }
  }

  const transformToFinancialData = (rawData: any[]): FinancialData => {
    const totalDebits = rawData.reduce((sum, r) => sum + (parseFloat(r['Journaldetail → AmountDb']) || 0), 0)
    const totalCredits = rawData.reduce((sum, r) => sum + (parseFloat(r['Journaldetail → AmountCr']) || 0), 0)
    const netPosition = totalCredits - totalDebits
    const totalVolume = totalDebits + totalCredits
    const averageTransaction = totalVolume / rawData.length
    const accountsCount = new Set(rawData.map(r => r['Zcoas - CoaId → AcName'])).size

    // Group by account types based on Ch1Id (Account Categories)
    const accountTypes = rawData.reduce((acc, record) => {
      const ch1Id = record['Zcoas - CoaId → Ch1Id']
      const debit = parseFloat(record['Journaldetail → AmountDb']) || 0
      const credit = parseFloat(record['Journaldetail → AmountCr']) || 0
      
      const accountType = ch1Id === 1 ? 'Assets' : 
                         ch1Id === 2 ? 'Liabilities' :
                         ch1Id === 3 ? 'Equity' : 
                         ch1Id === 4 ? 'Revenue' :
                         ch1Id === 5 ? 'Expenses' : 'Other'
      
      if (!acc[accountType]) {
        acc[accountType] = { 
          name: accountType, 
          debit: 0, 
          credit: 0, 
          balance: 0,
          count: 0,
          percentage: 0
        }
      }
      
      acc[accountType].debit += debit
      acc[accountType].credit += credit
      acc[accountType].balance = acc[accountType].credit - acc[accountType].debit
      acc[accountType].count += 1
      
      return acc
    }, {})

    // Calculate percentages for account types
    Object.keys(accountTypes).forEach(type => {
      accountTypes[type].percentage = ((accountTypes[type].debit + accountTypes[type].credit) / totalVolume) * 100
    })

    // Top 10 accounts by transaction volume
    const topAccounts = rawData.reduce((acc, record) => {
      const accountName = record['Zcoas - CoaId → AcName'] || 'Unknown'
      const debit = parseFloat(record['Journaldetail → AmountDb']) || 0
      const credit = parseFloat(record['Journaldetail → AmountCr']) || 0
      const totalAmount = debit + credit
      
      if (!acc[accountName]) {
        acc[accountName] = { 
          name: accountName, 
          value: 0, 
          debit: 0, 
          credit: 0,
          transactions: 0 
        }
      }
      acc[accountName].value += totalAmount
      acc[accountName].debit += debit
      acc[accountName].credit += credit
      acc[accountName].transactions += 1
      
      return acc
    }, {})

    // Monthly trends (group by month from date)
    const monthlyComparison = rawData.reduce((acc, record) => {
      const date = new Date(record.Date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      
      if (!acc[monthKey]) {
        acc[monthKey] = { 
          month: monthName,
          monthKey,
          debit: 0, 
          credit: 0, 
          net: 0,
          transactions: 0,
          volume: 0
        }
      }
      
      const debit = parseFloat(record['Journaldetail → AmountDb']) || 0
      const credit = parseFloat(record['Journaldetail → AmountCr']) || 0
      
      acc[monthKey].debit += debit
      acc[monthKey].credit += credit
      acc[monthKey].net = acc[monthKey].credit - acc[monthKey].debit
      acc[monthKey].volume += debit + credit
      acc[monthKey].transactions += 1
      
      return acc
    }, {})

    // Debit/Credit trend analysis
    const debitCreditTrend = Object.values(monthlyComparison).map((month: any) => ({
      month: month.month,
      debitRatio: (month.debit / month.volume) * 100,
      creditRatio: (month.credit / month.volume) * 100,
      netRatio: ((month.credit - month.debit) / month.volume) * 100
    }))

    // Calculate financial ratios
    const financialRatios = {
      debitRatio: (totalDebits / totalVolume) * 100,
      creditRatio: (totalCredits / totalVolume) * 100,
      activityRatio: rawData.length / accountsCount, // Transactions per account
      growthRate: 15.2 // Mock growth rate - could be calculated from historical data
    }

    return {
      summary: {
        totalDebits,
        totalCredits,
        netPosition,
        totalVolume,
        averageTransaction,
        accountsCount
      },
      accountTypes: Object.values(accountTypes),
      monthlyComparison: Object.values(monthlyComparison)
        .sort((a, b) => a.monthKey.localeCompare(b.monthKey)),
      topAccounts: Object.values(topAccounts)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10),
      debitCreditTrend,
      financialRatios
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount).replace('PKR', 'PKR ')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading financial analysis...</span>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No financial data available</div>
        <p className="text-gray-400 text-sm mt-2">Please check your data connection</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Financial Analysis</h1>
            <p className="text-gray-600 mt-1">Comprehensive financial reporting and insights</p>
          </div>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white"
            >
              <option value="current_month">Current Month</option>
              <option value="last_month">Last Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <div className="flex space-x-2">
              <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
                Export Excel
              </button>
              <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Key Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <ArrowDownIcon className="h-7 w-7 text-red-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Debits</p>
              <Metric color="red">{formatCurrency(data.summary.totalDebits)}</Metric>
              <div className="flex items-center mt-2">
                <Badge color="red" size="xs">
                  {data.financialRatios.debitRatio.toFixed(1)}% of volume
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <ArrowUpIcon className="h-7 w-7 text-green-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Credits</p>
              <Metric color="green">{formatCurrency(data.summary.totalCredits)}</Metric>
              <div className="flex items-center mt-2">
                <Badge color="green" size="xs">
                  {data.financialRatios.creditRatio.toFixed(1)}% of volume
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <ScaleIcon className="h-7 w-7 text-blue-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Net Position</p>
              <Metric color={data.summary.netPosition >= 0 ? 'green' : 'red'}>
                {formatCurrency(Math.abs(data.summary.netPosition))}
              </Metric>
              <div className="flex items-center mt-2">
                <Badge color={data.summary.netPosition >= 0 ? 'green' : 'red'} size="xs">
                  {data.summary.netPosition >= 0 ? 'Positive' : 'Negative'}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <BanknotesIcon className="h-7 w-7 text-purple-600" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Volume</p>
              <Metric>{formatCurrency(data.summary.totalVolume)}</Metric>
              <div className="flex items-center mt-2">
                <Badge color="purple" size="xs">
                  Avg: {formatCurrency(data.summary.averageTransaction)}
                </Badge>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Chart Library Selector */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Financial Charts</h2>
            <p className="text-sm text-gray-500">Interactive visualization with multiple chart libraries</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'chartjs', name: 'Chart.js' },
              { id: 'apex', name: 'ApexCharts' },
              { id: 'echarts', name: 'ECharts' },
              { id: 'recharts', name: 'Recharts' }
            ].map(library => (
              <button
                key={library.id}
                onClick={() => setSelectedChart(library.id)}
                className={`px-4 py-2 text-sm rounded-lg font-medium transition-all ${
                  selectedChart === library.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {library.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Account Types Distribution */}
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Account Types Balance</h3>
            <p className="text-sm text-gray-500">Distribution across asset, liability, equity accounts</p>
          </div>
          {selectedChart === 'chartjs' && (
            <ChartJsComponent 
              type="doughnut"
              data={data.accountTypes}
              title="Account Types"
            />
          )}
          {selectedChart === 'apex' && (
            <ApexChartsComponent 
              type="donut"
              data={data.accountTypes}
              title="Account Types"
            />
          )}
          {selectedChart === 'echarts' && (
            <EChartsComponent 
              type="pie"
              data={data.accountTypes}
              title="Account Types"
            />
          )}
          {selectedChart === 'recharts' && (
            <RechartsComponent 
              type="pie"
              data={data.accountTypes}
              title="Account Types"
            />
          )}
        </Card>

        {/* Monthly Financial Trends */}
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Financial Trends</h3>
            <p className="text-sm text-gray-500">Debit vs Credit trends over time</p>
          </div>
          {selectedChart === 'chartjs' && (
            <ChartJsComponent 
              type="line"
              data={data.monthlyComparison}
              title="Monthly Trends"
            />
          )}
          {selectedChart === 'apex' && (
            <ApexChartsComponent 
              type="line"
              data={data.monthlyComparison}
              title="Monthly Trends"
            />
          )}
          {selectedChart === 'echarts' && (
            <EChartsComponent 
              type="line"
              data={data.monthlyComparison}
              title="Monthly Trends"
            />
          )}
          {selectedChart === 'recharts' && (
            <RechartsComponent 
              type="line"
              data={data.monthlyComparison}
              title="Monthly Trends"
            />
          )}
        </Card>

        {/* Top Performing Accounts */}
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Top Performing Accounts</h3>
            <p className="text-sm text-gray-500">Highest transaction volumes</p>
          </div>
          {selectedChart === 'chartjs' && (
            <ChartJsComponent 
              type="bar"
              data={data.topAccounts}
              title="Top Accounts"
            />
          )}
          {selectedChart === 'apex' && (
            <ApexChartsComponent 
              type="bar"
              data={data.topAccounts}
              title="Top Accounts"
            />
          )}
          {selectedChart === 'echarts' && (
            <EChartsComponent 
              type="bar"
              data={data.topAccounts}
              title="Top Accounts"
            />
          )}
          {selectedChart === 'recharts' && (
            <RechartsComponent 
              type="bar"
              data={data.topAccounts}
              title="Top Accounts"
            />
          )}
        </Card>

        {/* Financial Ratios & KPIs */}
        <Card>
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Key Performance Indicators</h3>
            <p className="text-sm text-gray-500">Financial health metrics and ratios</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg">
              <div className="flex items-center">
                <ChartBarIcon className="h-5 w-5 text-blue-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Activity Ratio</span>
              </div>
              <span className="text-lg font-bold text-blue-700">
                {data.financialRatios.activityRatio.toFixed(1)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg">
              <div className="flex items-center">
                <ArrowTrendingUpIcon className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Growth Rate</span>
              </div>
              <span className="text-lg font-bold text-green-700">
                +{data.financialRatios.growthRate}%
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
              <div className="flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 text-purple-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Avg Transaction</span>
              </div>
              <span className="text-lg font-bold text-purple-700">
                {formatCurrency(data.summary.averageTransaction)}
              </span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
              <div className="flex items-center">
                <BanknotesIcon className="h-5 w-5 text-orange-600 mr-3" />
                <span className="text-sm font-medium text-gray-700">Active Accounts</span>
              </div>
              <span className="text-lg font-bold text-orange-700">
                {data.summary.accountsCount}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Account Analysis Table */}
      <Card>
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Account Analysis</h3>
          <p className="text-sm text-gray-500">Complete breakdown of top-performing accounts</p>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Account Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Volume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Debits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Credits
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Transactions
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Share %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.topAccounts.slice(0, 8).map((account, index) => {
                const sharePercentage = ((account.value / data.summary.totalVolume) * 100).toFixed(2)
                
                return (
                  <tr key={account.name} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">#{index + 1}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 max-w-xs truncate" title={account.name}>
                        {account.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-gray-900">
                        {formatCurrency(account.value)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-red-600">
                        {formatCurrency(account.debit)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-600">
                        {formatCurrency(account.credit)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge color="gray" size="xs">
                        {account.transactions}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-1 mr-4">
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${Math.min(parseFloat(sharePercentage), 100)}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{sharePercentage}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
