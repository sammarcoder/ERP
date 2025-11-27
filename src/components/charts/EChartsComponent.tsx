'use client'

import ReactECharts from 'echarts-for-react'

interface Props {
  type: 'bar' | 'pie' | 'line'
  data: any[]
  title: string
}

export default function EChartsComponent({ type, data, title }: Props) {
  const getOption = () => {
    const baseOption = {
      title: {
        text: title,
        left: 'center',
        textStyle: {
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: type === 'pie' 
          ? '{a} <br/>{b}: {c} ({d}%)'
          : '{b}: {c}'
      },
      legend: {
        bottom: 10,
        data: data.map(item => item.name || item.month)
      },
      color: ['#3B82F6', '#10B981', '#F97316', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']
    }

    if (type === 'pie') {
      return {
        ...baseOption,
        series: [{
          name: title,
          type: 'pie',
          radius: '60%',
          center: ['50%', '50%'],
          data: data.map(item => ({
            value: item.value,
            name: item.name
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }]
      }
    }

    if (type === 'bar') {
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: data.map(item => item.name || item.month),
          axisLabel: {
            rotate: 45
          }
        },
        yAxis: {
          type: 'value'
        },
        series: [{
          name: title,
          type: 'bar',
          data: data.map(item => item.value || item.total),
          itemStyle: {
            borderRadius: [4, 4, 0, 0]
          }
        }]
      }
    }

    if (type === 'line') {
      return {
        ...baseOption,
        xAxis: {
          type: 'category',
          data: data.map(item => item.month),
          boundaryGap: false
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: 'Debit',
            type: 'line',
            stack: 'Total',
            data: data.map(item => item.debit || 0),
            smooth: true,
            lineStyle: {
              color: '#EF4444'
            },
            areaStyle: {
              opacity: 0.3
            }
          },
          {
            name: 'Credit', 
            type: 'line',
            stack: 'Total',
            data: data.map(item => item.credit || 0),
            smooth: true,
            lineStyle: {
              color: '#10B981'
            },
            areaStyle: {
              opacity: 0.3
            }
          }
        ]
      }
    }

    return baseOption
  }

  return (
    <ReactECharts
      option={getOption()}
      style={{ height: '350px', width: '100%' }}
      opts={{ renderer: 'svg' }}
    />
  )
}
