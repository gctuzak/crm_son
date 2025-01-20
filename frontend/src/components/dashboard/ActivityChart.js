import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const ActivityChart = () => {
  const data = [
    { month: 'Ocak', value: 3 },
    { month: 'Şubat', value: 4 },
    { month: 'Mart', value: 8 },
    { month: 'Nisan', value: 2 },
    { month: 'Mayıs', value: 5 },
    { month: 'Haziran', value: 6 },
  ];

  return (
    <div className="chart-container">
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Bar dataKey="value" fill="#1890ff" name="Aktivite Sayısı" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}; 