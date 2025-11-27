'use client'

import dynamic from 'next/dynamic'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

interface Props {
  type: 'bar' | 'donut' | 'line'
  data: any[]
  title: string
}

export default function ApexChartsComponent({ type, data, title }: Props) {
  const options = {
    chart: {
      type: type === 'donut' ? 'donut' : type,
    },
    title: {
      text: title,
      align: 'left' as const
    },
    labels: type === 'donut' ? data.map(item => item.name) : undefined,
    xaxis: type !== 'donut' ? {
      categories: data.map(item => item.name || item.month)
    } : undefined,
    colors: ['#3B82F6', '#10B981', '#F97316', '#EF4444', '#8B5CF6', '#EC4899'],
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  }

  const series = type === 'donut' 
    ? data.map(item => item.value)
    : [{
        name: title,
        data: data.map(item => item.value || item.total)
      }]

  return (
    <div className="w-full">
      <Chart
        options={options}
        series={series}
        type={type === 'donut' ? 'donut' : type}
        height={350}
      />
    </div>
  )
}
