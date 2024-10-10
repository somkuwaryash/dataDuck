'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from 'next-themes'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DynamicLineChart = dynamic(() => import('recharts').then((mod) => mod.LineChart), { ssr: false });
const DynamicBarChart = dynamic(() => import('recharts').then((mod) => mod.BarChart), { ssr: false });
const DynamicPieChart = dynamic(() => import('recharts').then((mod) => mod.PieChart), { ssr: false });

interface ChartProps {
  type: 'line' | 'bar' | 'pie';
  data: any[];
  xKey: string;
  yKey: string;
  title: string;
}

const Chart: React.FC<ChartProps> = ({ type, data, xKey, yKey, title }) => {
    const { theme } = useTheme()
  const isDark = theme === 'dark'

  const chartColor = isDark ? '#38bdf8' : '#0ea5e9'
  const axisColor = isDark ? '#94a3b8' : '#64748b'
  const renderChart = (): React.ReactElement => {
    switch (type) {
      case 'line':
        return (
          <DynamicLineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yKey} stroke="#8884d8" />
          </DynamicLineChart>
        );
      case 'bar':
        return (
          <DynamicBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={yKey} fill="#8884d8" />
          </DynamicBarChart>
        );
      case 'pie':
        return (
          <DynamicPieChart margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <Pie data={data} dataKey={yKey} nameKey={xKey} fill="#8884d8" label />
            <Tooltip />
            <Legend />
          </DynamicPieChart>
        );
      default:
        return <div>Unsupported chart type</div>;
    }
  };

  return (
    <div className="w-full h-full">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height="100%">
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;