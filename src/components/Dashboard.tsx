'use client';

import React from 'react';
import Link from 'next/link';
import Chart from './Chart';

const Dashboard: React.FC = () => {
  // Mock data for demonstration
  const recentDatasets = ['Sales Data 2023', 'Customer Survey', 'Product Inventory'];
  const recentQueries = [
    'What were the top selling products last month?',
    'Show me the customer satisfaction trend over the past year',
    'What is the current inventory level for each product category?',
  ];

  const sampleChartData = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 200 },
    { name: 'Apr', value: 278 },
    { name: 'May', value: 189 },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Recent Datasets</h2>
          <ul className="space-y-2">
            {recentDatasets.map((dataset, index) => (
              <li key={index}>
                <Link href={`/analyze?dataset=${encodeURIComponent(dataset)}`} className="text-primary-600 dark:text-primary-400 hover:underline">
                  {dataset}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/upload" className="mt-4 inline-block text-primary-600 dark:text-primary-400 hover:underline">
            Upload New Dataset
          </Link>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <h2 className="text-xl font-semibold mb-4">Recent Queries</h2>
          <ul className="space-y-2">
            {recentQueries.map((query, index) => (
              <li key={index} className="text-sm text-gray-600 dark:text-gray-300">
                {query}
              </li>
            ))}
          </ul>
          <Link href="/analyze" className="mt-4 inline-block text-primary-600 dark:text-primary-400 hover:underline">
            New Analysis
          </Link>
        </div>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-4">Sample Visualization</h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4" style={{ height: '400px' }}>
          <Chart
            type="line"
            data={sampleChartData}
            xKey="name"
            yKey="value"
            title="Sample Monthly Data"
          />
        </div>
      </div>
    </div>
  )
}

export default Dashboard