import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const OrdersChart = () => {
  const data = [
    { date: '2024-01', value: 3 },
    { date: '2024-02', value: 4 },
    { date: '2024-03', value: 2 },
    { date: '2024-04', value: 5 },
    { date: '2024-05', value: 3 },
    { date: '2024-06', value: 6 },
    { date: '2024-07', value: 4 },
    { date: '2024-08', value: 7 },
    { date: '2024-09', value: 5 },
    { date: '2024-10', value: 8 },
    { date: '2024-11', value: 6 },
    { date: '2024-12', value: 9 },
  ];

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}. Ay`;
            }}
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip 
            labelFormatter={(value) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}. Ay`;
            }}
          />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#52c41a" 
            name="Sipariş Sayısı"
            strokeWidth={2}
            dot={{ fill: 'white', stroke: '#52c41a', strokeWidth: 2, r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}; 