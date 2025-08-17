import React from 'react';

export default function FillBadge({ value }) {
  if (value === undefined || value === null) {
    return <span style={pill('#6b7280')}>-</span>; // grey
  }

  let bg = '#16a34a'; // green
  if (value >= 80) bg = '#dc2626';       // red
  else if (value >= 60) bg = '#d97706';  // amber

  return <span style={pill(bg)}>{value}%</span>;
}

function pill(bg) {
  return {
    display: 'inline-block',
    padding: '2px 10px',
    borderRadius: 999,
    background: bg,
    color: '#fff',
    fontSize: 12,
    lineHeight: '18px',
    minWidth: 36,
    textAlign: 'center'
  };
}
