import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';

export const PerformanceGauge = ({ title, value }) => {
  const data = [
    {
      name: 'Performans',
      value: value,
      fill: value < 70 ? '#f4664a' : value < 130 ? '#faad14' : '#30bf78',
    },
  ];

  return (
    <div className="performance-gauge">
      <div className="title">{title}</div>
      <ResponsiveContainer width="100%" height={120}>
        <RadialBarChart 
          innerRadius="60%" 
          outerRadius="100%" 
          data={data} 
          startAngle={180} 
          endAngle={0}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <RadialBar
            minAngle={15}
            background
            clockWise={true}
            dataKey="value"
            cornerRadius={10}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{ textAlign: 'center', fontSize: '18px', marginTop: '-20px' }}>
        {value}%
      </div>
    </div>
  );
}; 