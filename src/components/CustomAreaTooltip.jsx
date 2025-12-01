import React from 'react'

function CustomAreaTooltip({ active, payload, label }) {
  
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-xl p-4 shadow-2xl">
          <p className="text-sm font-semibold text-gray-800 mb-2">{label}</p>
          <div className="space-y-1">
            {payload.map((entry, index) => (
              <div key={index} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-sm text-gray-600 capitalize">
                  {entry.dataKey.toLowerCase()}:
                </span>
                <span className="text-sm font-semibold text-gray-800">
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

export default CustomAreaTooltip
