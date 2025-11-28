import React from 'react'

function CustomRadialTooltip({ active, payload }) {

  
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-xl p-4 shadow-2xl">
          <p className="text-sm font-semibold text-gray-800 mb-2">{data.name}</p>
          <div className="space-y-1">
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-gray-600">Tests:</span>
              <span className="text-sm font-semibold text-gray-800">
                {data.value}
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-gray-600">Percentage:</span>
              <span className="text-sm font-semibold text-gray-800">
                {data.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="flex justify-between items-center gap-4">
              <span className="text-sm text-gray-600">Range:</span>
              <span className="text-sm font-semibold text-gray-800">
                {data.range}
              </span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

export default CustomRadialTooltip
