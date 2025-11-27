'use client'

import { useRef, useEffect } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  type: 'bar' | 'doughnut' | 'line'
  data: any[]
  title: string
}

export default function ChartJsComponent({ type, data, title }: Props) {
  const chartData = {
    labels: data.map(item => item.name || item.month),
    datasets: [{
      label: title,
      data: data.map(item => item.value || item.total),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)', 
        'rgba(249, 115, 22, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(236, 72, 153, 0.8)',
      ],
      borderColor: [
        'rgba(59, 130, 246, 1)',
        'rgba(16, 185, 129, 1)',
        'rgba(249, 115, 22, 1)',
        'rgba(239, 68, 68, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(236, 72, 153, 1)',
      ],
      borderWidth: 1
    }]
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  }

  if (type === 'bar') {
    return <Bar data={chartData} options={options} />
  }
  
  if (type === 'doughnut') {
    return <Doughnut data={chartData} options={options} />
  }
  
  if (type === 'line') {
    const lineData = {
      ...chartData,
      datasets: [{
        ...chartData.datasets[0],
        fill: false,
        borderColor: 'rgb(59, 130, 246)',
        tension: 0.1
      }]
    }
    return <Line data={lineData} options={options} />
  }

  return null
}
