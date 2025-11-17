import { X } from "lucide-react";

function FilterPanel({
  filters,
  uniqueDepartments,
  uniqueQuizzes,
  activeFilterCount,
  onFilterChange,
  onClearFilters,
}) {
  return (
    <div className="mt-4 pt-4 border-t border-slate-100">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
        {/* Department Select - Full width on mobile, then adjusts */}
        <div className="md:col-span-1">
          <select
            value={filters.department}
            onChange={(e) => onFilterChange("department", e.target.value)}
            className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
          >
            <option value="">All Departments</option>
            {uniqueDepartments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        {/* Quiz Select - Full width on mobile, then adjusts */}
        <div className="md:col-span-1">
          <select
            value={filters.quiz}
            onChange={(e) => onFilterChange("quiz", e.target.value)}
            className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
          >
            <option value="">All Quizzes</option>
            {uniqueQuizzes.map((quiz) => (
              <option key={quiz} value={quiz}>
                {quiz}
              </option>
            ))}
          </select>
        </div>

        {/* Spacer - Only visible on XL screens */}
        <div className="hidden xl:block"></div>

        {/* Date Inputs - Stack on mobile, side by side on medium+, individual on XL */}
        <div className="md:col-span-2 xl:col-span-1">
          <input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => onFilterChange("dateFrom", e.target.value)}
            placeholder="From Date"
            className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
          />
        </div>

        <div className="md:col-span-2 xl:col-span-1">
          <input
            type="date"
            value={filters.dateTo}
            onChange={(e) => onFilterChange("dateTo", e.target.value)}
            placeholder="To Date"
            className="w-full border border-slate-200 p-2.5 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486]"
          />
        </div>

        {/* Clear Button - Full width when active */}
        {activeFilterCount > 0 && (
          <div className="col-span-full md:col-span-2 xl:col-span-1">
            <button
              onClick={onClearFilters}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 text-slate-700 rounded-lg font-medium hover:bg-slate-200 transition-all text-sm"
            >
              <X className="w-4 h-4" />
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default FilterPanel;