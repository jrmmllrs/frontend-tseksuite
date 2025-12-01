import React from 'react'

function CustomPieTooltip({ active, payload }) {
 
      if (active && payload && payload.length) {
        const data = payload[0].payload;
        return (
          <div className="bg-white/95 backdrop-blur-lg border border-gray-200/50 rounded-xl p-4 shadow-2xl min-w-[200px]">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              {data.name}
            </p>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Tests:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {data.value}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-green-600">Completed:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {data.completed}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-red-600">Abandoned:</span>
                <span className="text-sm font-semibold text-gray-800">
                  {data.abandoned}
                </span>
              </div>
              <div className="pt-2 border-t border-gray-200/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Success Rate:</span>
                  <span className="text-sm font-semibold text-green-600">
                    {Math.round((data.completed / data.value) * 100)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      }
      return null;
    };

export default CustomPieTooltip
