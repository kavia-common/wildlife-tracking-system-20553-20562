import React from 'react';

export default function Badge({ color = 'gray', children }) {
  const colorMap = {
    gray: 'bg-gray-100 text-gray-700',
    green: 'bg-green-100 text-green-700',
    amber: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
    blue: 'bg-blue-100 text-blue-700'
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${colorMap[color] || colorMap.gray}`}>
      {children}
    </span>
  );
}
