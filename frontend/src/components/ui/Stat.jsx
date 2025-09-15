import React from 'react';
import Card from './Card';

export default function Stat({ label, value, accent = 'blue' }) {
  const border = {
    blue: 'border-blue-200',
    amber: 'border-amber-200',
    red: 'border-red-200',
    green: 'border-green-200'
  }[accent] || 'border-gray-200';
  return (
    <Card className={`p-4 border-l-4 ${border}`}>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </Card>
  );
}
