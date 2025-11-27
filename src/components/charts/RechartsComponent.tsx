'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Area,
  AreaChart,
  ResponsiveContainer
} from 'recharts'

interface Props {
  type: 'bar' | 'pie' | 'line'
  data: any[]
  title: string
}

const COLORS = ['#3B82F6', '#10B981', '#F97316', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16']

export default function RechartsComponent({ type, data, title }: Props) {
  const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (type === 'pie') {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [value.toLocaleString(), 'Value']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === 'bar') {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={100}
              fontSize={12}
            />
            <YAxis />
            <Tooltip formatter={(value) => [value.toLocaleString(), 'Amount']} />
            <Legend />
            <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    )
  }

  if (type === 'line') {
    return (
      <div className="w-full">
        <h3 className="text-lg font-semibold text-center mb-4">{title}</h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip formatter={(value) => [value.toLocaleString(), 'Amount']} />
            <Legend />
            <Area
              type="monotone"
              dataKey="debit"
              stackId="1"
              stroke="#EF4444"
              fill="#EF4444"
              fillOpacity={0.6}
              name="Debit"
            />
            <Area
              type="monotone"
              dataKey="credit"
              stackId="1"
              stroke="#10B981"
              fill="#10B981"
              fillOpacity={0.6}
              name="Credit"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    )
  }

  return null
}
