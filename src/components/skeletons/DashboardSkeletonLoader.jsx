import React from 'react'

function DashboardSkeletonLoader() {
    // Skeleton Components
const SkeletonCard = ({ compact = false }) => (
  <div className="bg-white/80 backdrop-blur-sm rounded-2xl border p-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div className="space-y-2">
        <div className={`h-4 bg-gray-200 rounded ${compact ? 'w-20' : 'w-24'}`}></div>
        <div className="h-6 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
    </div>
    <div className="flex items-center gap-2">
      <div className="h-3 bg-gray-200 rounded w-12"></div>
      <div className="h-3 bg-gray-200 rounded w-16"></div>
    </div>
  </div>
);

const SkeletonChart = ({ height = "h-64" }) => (
  <div className={`bg-white/80 backdrop-blur-sm rounded-2xl border p-4 animate-pulse ${height}`}>
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded w-32"></div>
          <div className="h-3 bg-gray-200 rounded w-24"></div>
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      </div>
      <div className="bg-gray-100 rounded-lg h-3/4"></div>
      <div className="flex justify-center">
        <div className="h-3 bg-gray-200 rounded w-48"></div>
      </div>
    </div>
  </div>
);

const SkeletonStatsGrid = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-4 lg:gap-4 mb-6">
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </div>
);

const SkeletonChartsRow = () => (
  <div className="flex flex-col xl:flex-row rounded-lg overflow-x-auto mb-6 gap-4 sm:gap-6">
    <div className="w-full xl:w-2/3">
      <SkeletonChart height="h-64 sm:h-80" />
    </div>
    <div className="w-full xl:w-1/3">
      <SkeletonChart height="h-64 sm:h-80" />
    </div>
  </div>
);

const SkeletonAnalyticsRow = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
    <SkeletonChart height="h-64 sm:h-80" />
    <SkeletonChart height="h-64 sm:h-80" />
  </div>
);

 return (
      <div className="min-h-screen w-full pb-3 px-3 sm:px-4 xl:px-43 py-6 sm:mt-0 mb-10">
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
            </div>
          </div>
        </div>

        <SkeletonStatsGrid />

        <SkeletonChartsRow />

        <SkeletonAnalyticsRow />
      </div>
    );
}

export default DashboardSkeletonLoader
