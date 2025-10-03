import React from 'react';

export default function FillBadge({ value }) {
  // Use Tailwind utility classes instead of inline styles so colors come from theme
  if (value === undefined || value === null) {
    return (
      <span className="inline-block px-3 py-1 rounded-full bg-gray-400 text-white text-sm min-w-[36px] text-center">
        -
      </span>
    );
  }

  let colorClass = 'bg-green-500';
  if (value >= 80) colorClass = 'bg-red-600';
  else if (value >= 60) colorClass = 'bg-amber-500';

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-white text-sm min-w-[36px] text-center ${colorClass}`}>
      {value}%
    </span>
  );
}
