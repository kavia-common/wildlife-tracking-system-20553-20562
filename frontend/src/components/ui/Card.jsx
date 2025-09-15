import React from 'react';

export default function Card({ className = '', children }) {
  return <div className={`ocean-card ${className}`}>{children}</div>;
}
