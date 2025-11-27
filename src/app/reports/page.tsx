// 'use client'

// import { useState, useEffect } from 'react'
// import { 
//   Card, 
//   Title, 
//   Text, 
//   Metric, 
//   Flex, 
//   Badge,
//   Grid,
//   Col,
//   ProgressBar,
//   BarChart,
//   DonutChart,
//   AreaChart,
//   LineChart
// } from '@tremor/react'
// import ChartJsComponent from '@/components/charts/ChartJsComponent'
// import ApexChartsComponent from '@/components/charts/ApexChartsComponent'
// import EChartsComponent from '@/components/charts/EChartsComponent'
// import RechartsComponent from '@/components/charts/RechartsComponent'

// interface DashboardData {
//   summary: {
//     totalVouchers: number
//     totalAmount: number
//     activeAccounts: number
//     growthRate: number
//   }
//   chartData: any[]
//   voucherTypes: any[]
//   monthlyTrends: any[]
//   accountDistribution: any[]
// }

// export default function ReportsPage() {
//   const [data, setData] = useState<DashboardData | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [selectedChart, setSelectedChart] = useState('chartjs')

//   useEffect(() => {
//     fetchReportsData()
//   }, [])

//   const fetchReportsData = async () => {
//     try {
//       setLoading(true)
      
//       // Fetch data from our Metabase API
//       const response = await fetch('/api/journalmaster')
//       const result = await response.json()
      
//       if (result.success) {
//         // Transform Metabase data for charts
//         const transformedData = transformDataForCharts(result.data)
//         setData(transformedData)
//       }
//     } catch (error) {
//       console.error('Error fetching reports data:', error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const transformDataForCharts = (rawData: any[]): DashboardData => {
//     // Calculate summary metrics
//     const totalVouchers = new Set(rawData.map(r => r.VoucherNo)).size
//     const totalAmount = rawData.reduce((sum, r) => 
//       sum + (r['Journaldetail → AmountDb'] || 0) + (r['Journaldetail → AmountCr'] || 0), 0
//     )
//     const activeAccounts = new Set(rawData.map(r => r['Zcoas - CoaId → AcName'])).size

//     // Group by voucher types
//     const voucherTypes = rawData.reduce((acc, record) => {
//       const type = record['Zvouchertype - VoucherTypeId → VType'] || 'Unknown'
//       const amount = (record['Journaldetail → AmountDb'] || 0) + (record['Journaldetail → AmountCr'] || 0)
      
//       if (!acc[type]) {
//         acc[type] = { name: type, value: 0, count: 0 }
//       }
//       acc[type].value += amount
//       acc[type].count += 1
//       return acc
//     }, {})

//     // Group by account names for distribution
//     const accountDistribution = rawData.reduce((acc, record) => {
//       const account = record['Zcoas - CoaId → AcName'] || 'Unknown'
//       const amount = (record['Journaldetail → AmountDb'] || 0) + (record['Journaldetail → AmountCr'] || 0)
      
//       if (!acc[account]) {
//         acc[account] = { name: account, value: 0, count: 0 }
//       }
//       acc[account].value += amount
//       acc[account].count += 1
//       return acc
//     }, {})

//     // Monthly trends (group by month)
//     const monthlyTrends = rawData.reduce((acc, record) => {
//       const date = new Date(record.Date)
//       const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
//       const amount = (record['Journaldetail → AmountDb'] || 0) + (record['Journaldetail → AmountCr'] || 0)
      
//       if (!acc[monthKey]) {
//         acc[monthKey] = { 
//           month: monthKey, 
//           debit: 0, 
//           credit: 0, 
//           total: 0,
//           transactions: 0 
//         }
//       }
      
//       acc[monthKey].debit += record['Journaldetail → AmountDb'] || 0
//       acc[monthKey].credit += record['Journaldetail → AmountCr'] || 0
//       acc[monthKey].total += amount
//       acc[monthKey].transactions += 1
      
//       return acc
//     }, {})

//     return {
//       summary: {
//         totalVouchers,
//         totalAmount,
//         activeAccounts,
//         growthRate: 12.5 // Mock growth rate
//       },
//       chartData: rawData,
//       voucherTypes: Object.values(voucherTypes),
//       monthlyTrends: Object.values(monthlyTrends),
//       accountDistribution: Object.values(accountDistribution).slice(0, 10) // Top 10 accounts
//     }
//   }

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
//         <span className="ml-2 text-gray-600">Loading dashboard data...</span>
//       </div>
//     )
//   }

//   if (!data) {
//     return (
//       <div className="text-center py-12">
//         <div className="text-gray-500 text-lg">No data available</div>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-6">
//       {/* Key Metrics */}
//       <Grid numItems={1} numItemsSm={2} numItemsLg={4} className="gap-6">
//         <Card>
//           <Text>Total Vouchers</Text>
//           <Metric>{data.summary.totalVouchers.toLocaleString()}</Metric>
//           <Flex className="mt-4">
//             <Badge color="green" size="xs">+{data.summary.growthRate}%</Badge>
//           </Flex>
//         </Card>
        
//         <Card>
//           <Text>Total Amount</Text>
//           <Metric>{data.summary.totalAmount.toLocaleString()} PKR</Metric>
//           <Flex className="mt-4">
//             <Text>Debit + Credit Combined</Text>
//           </Flex>
//         </Card>
        
//         <Card>
//           <Text>Active Accounts</Text>
//           <Metric>{data.summary.activeAccounts}</Metric>
//           <Flex className="mt-4">
//             <Text>Unique Chart of Accounts</Text>
//           </Flex>
//         </Card>
        
//         <Card>
//           <Text>Growth Rate</Text>
//           <Metric>{data.summary.growthRate}%</Metric>
//           <ProgressBar value={data.summary.growthRate} className="mt-4" />
//         </Card>
//       </Grid>

//       {/* Chart Library Selector */}
//       <Card>
//         <Flex justifyContent="between" alignItems="center">
//           <div>
//             <Title>Interactive Charts</Title>
//             <Text>Choose your preferred chart library</Text>
//           </div>
//           <div className="flex space-x-2">
//             {[
//               { id: 'chartjs', name: 'Chart.js' },
//               { id: 'apex', name: 'ApexCharts' },
//               { id: 'echarts', name: 'ECharts' },
//               { id: 'recharts', name: 'Recharts' },
//               { id: 'tremor', name: 'Tremor' }
//             ].map(library => (
//               <button
//                 key={library.id}
//                 onClick={() => setSelectedChart(library.id)}
//                 className={`px-3 py-2 text-sm rounded-md font-medium ${
//                   selectedChart === library.id
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
//                 }`}
//               >
//                 {library.name}
//               </button>
//             ))}
//           </div>
//         </Flex>
//       </Card>

//       {/* Dynamic Charts Based on Selected Library */}
//       <Grid numItems={1} numItemsLg={2} className="gap-6">
        
//         {/* Left Column - Voucher Types & Trends */}
//         <div className="space-y-6">
//           <Card>
//             <Title>Voucher Types Distribution</Title>
//             {selectedChart === 'chartjs' && (
//               <ChartJsComponent 
//                 type="doughnut"
//                 data={data.voucherTypes}
//                 title="Voucher Types"
//               />
//             )}
//             {selectedChart === 'apex' && (
//               <ApexChartsComponent 
//                 type="donut"
//                 data={data.voucherTypes}
//                 title="Voucher Types"
//               />
//             )}
//             {selectedChart === 'echarts' && (
//               <EChartsComponent 
//                 type="pie"
//                 data={data.voucherTypes}
//                 title="Voucher Types"
//               />
//             )}
//             {selectedChart === 'recharts' && (
//               <RechartsComponent 
//                 type="pie"
//                 data={data.voucherTypes}
//                 title="Voucher Types"
//               />
//             )}
//             {selectedChart === 'tremor' && (
//               <DonutChart
//                 className="mt-6"
//                 data={data.voucherTypes}
//                 category="value"
//                 index="name"
//                 colors={["slate", "violet", "indigo", "rose", "cyan", "amber"]}
//               />
//             )}
//           </Card>

//           <Card>
//             <Title>Monthly Trends</Title>
//             {selectedChart === 'tremor' && (
//               <LineChart
//                 className="mt-6"
//                 data={data.monthlyTrends}
//                 index="month"
//                 categories={["debit", "credit"]}
//                 colors={["red", "green"]}
//                 yAxisWidth={60}
//               />
//             )}
//             {selectedChart !== 'tremor' && (
//               <div className="mt-6">
//                 {selectedChart === 'chartjs' && (
//                   <ChartJsComponent 
//                     type="line"
//                     data={data.monthlyTrends}
//                     title="Monthly Trends"
//                   />
//                 )}
//                 {selectedChart === 'apex' && (
//                   <ApexChartsComponent 
//                     type="line"
//                     data={data.monthlyTrends}
//                     title="Monthly Trends"
//                   />
//                 )}
//                 {selectedChart === 'echarts' && (
//                   <EChartsComponent 
//                     type="line"
//                     data={data.monthlyTrends}
//                     title="Monthly Trends"
//                   />
//                 )}
//                 {selectedChart === 'recharts' && (
//                   <RechartsComponent 
//                     type="line"
//                     data={data.monthlyTrends}
//                     title="Monthly Trends"
//                   />
//                 )}
//               </div>
//             )}
//           </Card>
//         </div>

//         {/* Right Column - Account Distribution */}
//         <div className="space-y-6">
//           <Card>
//             <Title>Top Accounts by Volume</Title>
//             {selectedChart === 'tremor' && (
//               <BarChart
//                 className="mt-6"
//                 data={data.accountDistribution}
//                 index="name"
//                 categories={["value"]}
//                 colors={["blue"]}
//                 yAxisWidth={80}
//               />
//             )}
//             {selectedChart !== 'tremor' && (
//               <div className="mt-6">
//                 {selectedChart === 'chartjs' && (
//                   <ChartJsComponent 
//                     type="bar"
//                     data={data.accountDistribution}
//                     title="Account Distribution"
//                   />
//                 )}
//                 {selectedChart === 'apex' && (
//                   <ApexChartsComponent 
//                     type="bar"
//                     data={data.accountDistribution}
//                     title="Account Distribution"
//                   />
//                 )}
//                 {selectedChart === 'echarts' && (
//                   <EChartsComponent 
//                     type="bar"
//                     data={data.accountDistribution}
//                     title="Account Distribution"
//                   />
//                 )}
//                 {selectedChart === 'recharts' && (
//                   <RechartsComponent 
//                     type="bar"
//                     data={data.accountDistribution}
//                     title="Account Distribution"
//                   />
//                 )}
//               </div>
//             )}
//           </Card>

//           <Card>
//             <Title>Transaction Volume Over Time</Title>
//             {selectedChart === 'tremor' && (
//               <AreaChart
//                 className="mt-6"
//                 data={data.monthlyTrends}
//                 index="month"
//                 categories={["transactions"]}
//                 colors={["indigo"]}
//                 yAxisWidth={60}
//               />
//             )}
//             {selectedChart !== 'tremor' && (
//               <div className="mt-6">
//                 <Text>Transaction volume chart with {selectedChart}</Text>
//               </div>
//             )}
//           </Card>
//         </div>
//       </Grid>

//       {/* Export Options */}
//       <Card>
//         <Flex justifyContent="between" alignItems="center">
//           <div>
//             <Title>Export Options</Title>
//             <Text>Download reports in various formats</Text>
//           </div>
//           <div className="flex space-x-3">
//             <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700">
//               Export to Excel
//             </button>
//             <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700">
//               Export to PDF
//             </button>
//             <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
//               Schedule Email
//             </button>
//           </div>
//         </Flex>
//       </Card>
//     </div>
//   )
// }

































'use client'

import { useState, useEffect } from 'react'
import ChartJsComponent from '@/components/charts/ChartJsComponent'
import ApexChartsComponent from '@/components/charts/ApexChartsComponent'
import EChartsComponent from '@/components/charts/EChartsComponent'
import RechartsComponent from '@/components/charts/RechartsComponent'

// Custom Card Component (replaces Tremor Card)
const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`bg-white rounded-lg shadow p-6 ${className}`}>
    {children}
  </div>
)

// Custom Metric Component (replaces Tremor Metric)
const Metric = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <p className={`text-2xl font-semibold text-gray-900 ${className}`}>
    {children}
  </p>
)

// Custom Badge Component
const Badge = ({ children, color = "blue" }: { children: React.ReactNode, color?: string }) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-800",
    green: "bg-green-100 text-green-800",
    red: "bg-red-100 text-red-800",
    purple: "bg-purple-100 text-purple-800",
    orange: "bg-orange-100 text-orange-800"
  }
  
  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClasses[color] || colorClasses.blue}`}>
      {children}
    </span>
  )
}

// Custom Progress Bar
const ProgressBar = ({ value, className = "" }: { value: number, className?: string }) => (
  <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
      style={{ width: `${Math.min(value, 100)}%` }}
    />
  </div>
)

interface DashboardData {
  summary: {
    totalVouchers: number
    totalAmount: number
    activeAccounts: number
    growthRate: number
  }
  voucherTypes: any[]
  monthlyTrends: any[]
  accountDistribution: any[]
}

export default function ReportsPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedChart, setSelectedChart] = useState('chartjs')

  useEffect(() => {
    fetchReportsData()
  }, [])

  const fetchReportsData = async () => {
    try {
      setLoading(true)
      
      const response = await fetch('/api/journalmaster')
      const result = await response.json()
      
      if (result.success) {
        const transformedData = transformDataForCharts(result.data)
        setData(transformedData)
      }
    } catch (error) {
      console.error('Error fetching reports data:', error)
    } finally {
      setLoading(false)
    }
  }

  const transformDataForCharts = (rawData: any[]): DashboardData => {
    const totalVouchers = new Set(rawData.map(r => r.VoucherNo)).size
    const totalAmount = rawData.reduce((sum, r) => 
      sum + (r['Journaldetail → AmountDb'] || 0) + (r['Journaldetail → AmountCr'] || 0), 0
    )
    const activeAccounts = new Set(rawData.map(r => r['Zcoas - CoaId → AcName'])).size

    // Group by voucher types
    const voucherTypes = rawData.reduce((acc, record) => {
      const type = record['Zvouchertype - VoucherTypeId → VType'] || 'Unknown'
      const amount = (record['Journaldetail → AmountDb'] || 0) + (record['Journaldetail → AmountCr'] || 0)
      
      if (!acc[type]) {
        acc[type] = { name: type, value: 0, count: 0 }
      }
      acc[type].value += amount
      acc[type].count += 1
      return acc
    }, {})

    // Group by account names
    const accountDistribution = rawData.reduce((acc, record) => {
      const account = record['Zcoas - CoaId → AcName'] || 'Unknown'
      const amount = (record['Journaldetail → AmountDb'] || 0) + (record['Journaldetail → AmountCr'] || 0)
      
      if (!acc[account]) {
        acc[account] = { name: account, value: 0, count: 0 }
      }
      acc[account].value += amount
      acc[account].count += 1
      return acc
    }, {})

    // Monthly trends
    const monthlyTrends = rawData.reduce((acc, record) => {
      const date = new Date(record.Date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
      
      if (!acc[monthKey]) {
        acc[monthKey] = { 
          month: monthKey, 
          debit: 0, 
          credit: 0, 
          total: 0,
          transactions: 0 
        }
      }
      
      acc[monthKey].debit += record['Journaldetail → AmountDb'] || 0
      acc[monthKey].credit += record['Journaldetail → AmountCr'] || 0
      acc[monthKey].total += (record['Journaldetail → AmountDb'] || 0) + (record['Journaldetail → AmountCr'] || 0)
      acc[monthKey].transactions += 1
      
      return acc
    }, {})

    return {
      summary: {
        totalVouchers,
        totalAmount,
        activeAccounts,
        growthRate: 12.5
      },
      voucherTypes: Object.values(voucherTypes),
      monthlyTrends: Object.values(monthlyTrends),
      accountDistribution: Object.values(accountDistribution)
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading dashboard data...</span>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No data available</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-600 mt-1">Interactive business intelligence dashboard</p>
          </div>
          <div className="flex space-x-3">
            <button className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-green-700 transition-colors">
              Export Excel
            </button>
            <button className="bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors">
              Export PDF
            </button>
          </div>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Vouchers</p>
              <Metric>{data.summary.totalVouchers.toLocaleString()}</Metric>
              <div className="flex items-center mt-2">
                <Badge color="green">+{data.summary.growthRate}%</Badge>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Total Amount</p>
              <Metric>{data.summary.totalAmount.toLocaleString()} PKR</Metric>
              <p className="text-xs text-gray-500 mt-1">Debit + Credit Combined</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Active Accounts</p>
              <Metric>{data.summary.activeAccounts}</Metric>
              <p className="text-xs text-gray-500 mt-1">Unique Chart of Accounts</p>
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500">Growth Rate</p>
              <Metric>{data.summary.growthRate}%</Metric>
              <ProgressBar value={data.summary.growthRate} className="mt-3" />
            </div>
          </div>
        </Card>
      </div>

      {/* Chart Library Selector */}
      <Card>
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Interactive Charts</h2>
            <p className="text-sm text-gray-500">Choose your preferred chart library</p>
          </div>
          <div className="flex space-x-2">
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
        
        {/* Voucher Types Distribution */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Voucher Types Distribution</h3>
            <p className="text-sm text-gray-500">Transaction types breakdown</p>
          </div>
          {selectedChart === 'chartjs' && (
            <ChartJsComponent 
              type="doughnut"
              data={data.voucherTypes}
              title="Voucher Types"
            />
          )}
          {selectedChart === 'apex' && (
            <ApexChartsComponent 
              type="donut"
              data={data.voucherTypes}
              title="Voucher Types"
            />
          )}
          {selectedChart === 'echarts' && (
            <EChartsComponent 
              type="pie"
              data={data.voucherTypes}
              title="Voucher Types"
            />
          )}
          {selectedChart === 'recharts' && (
            <RechartsComponent 
              type="pie"
              data={data.voucherTypes}
              title="Voucher Types"
            />
          )}
        </Card>

        {/* Monthly Trends */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Monthly Trends</h3>
            <p className="text-sm text-gray-500">Debit vs Credit over time</p>
          </div>
          {selectedChart === 'chartjs' && (
            <ChartJsComponent 
              type="line"
              data={data.monthlyTrends}
              title="Monthly Trends"
            />
          )}
          {selectedChart === 'apex' && (
            <ApexChartsComponent 
              type="line"
              data={data.monthlyTrends}
              title="Monthly Trends"
            />
          )}
          {selectedChart === 'echarts' && (
            <EChartsComponent 
              type="line"
              data={data.monthlyTrends}
              title="Monthly Trends"
            />
          )}
          {selectedChart === 'recharts' && (
            <RechartsComponent 
              type="line"
              data={data.monthlyTrends}
              title="Monthly Trends"
            />
          )}
        </Card>

        {/* Top Accounts */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Top Accounts by Volume</h3>
            <p className="text-sm text-gray-500">Highest transaction volumes</p>
          </div>
          {selectedChart === 'chartjs' && (
            <ChartJsComponent 
              type="bar"
              data={data.accountDistribution}
              title="Account Distribution"
            />
          )}
          {selectedChart === 'apex' && (
            <ApexChartsComponent 
              type="bar"
              data={data.accountDistribution}
              title="Account Distribution"
            />
          )}
          {selectedChart === 'echarts' && (
            <EChartsComponent 
              type="bar"
              data={data.accountDistribution}
              title="Account Distribution"
            />
          )}
          {selectedChart === 'recharts' && (
            <RechartsComponent 
              type="bar"
              data={data.accountDistribution}
              title="Account Distribution"
            />
          )}
        </Card>

        {/* Summary Statistics */}
        <Card>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Statistics</h3>
            <p className="text-sm text-gray-500">Key performance indicators</p>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Average Transaction Value</span>
              <span className="text-sm font-bold text-gray-900">
                {Math.round(data.summary.totalAmount / data.summary.totalVouchers).toLocaleString()} PKR
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Transactions per Account</span>
              <span className="text-sm font-bold text-gray-900">
                {Math.round(data.summary.totalVouchers / data.summary.activeAccounts)}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Most Active Type</span>
              <Badge color="blue">{data.voucherTypes[0]?.name || 'N/A'}</Badge>
            </div>
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-600">Top Account</span>
              <span className="text-sm font-bold text-gray-900 truncate max-w-32" title={data.accountDistribution[0]?.name}>
                {data.accountDistribution[0]?.name || 'N/A'}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
