import { useEffect, useState, useMemo, useCallback } from "react";
import {
  Search,
  Filter,
  Download,
  X,
  Settings,
  ChevronDown,
} from "lucide-react";
import { getAllResults } from "../../../../../api/api";
import toast from "react-hot-toast";
import { useMediaQuery } from "@mui/material";
import ConfirmationModal from "@/components/ConfimationModal";
import ResultsTable from "./components/ResultsTable";
import MobileResultCard from "./components/MobileResultCard";
import FilterPanel from "./components/FilterPanel";
import EmptyState from "./components/EmptyState";
import LoadingState from "./components/LoadingState";
import { exportToCSV, getUniqueValues } from "./utils/resultsUtils";

const INITIAL_FILTERS = {
  department: "",
  status: "",
  quiz: "",
  dateFrom: "",
  dateTo: "",
};

function ResultsPage() {
  const isMobile = useMediaQuery("(max-width:600px)");
  const isTablet = useMediaQuery("(max-width:1024px)");

  // State management
  const [data, setData] = useState([]);
  const [allData, setAllData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [showMobileControls, setShowMobileControls] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Fetch all test results
  const fetchAllTests = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await getAllResults();
      setData(res);
      setAllData(res);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch results");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllTests();
  }, [fetchAllTests]);

  // Memoized computed values
  const uniqueDepartments = useMemo(
    () => getUniqueValues(allData, "department"),
    [allData]
  );

  const uniqueQuizzes = useMemo(
    () => getUniqueValues(allData, "quiz_name"),
    [allData]
  );

  const activeFilterCount = useMemo(
    () => Object.values(filters).filter((v) => v).length,
    [filters]
  );

  // Filter logic
  const applyFilters = useCallback(
    (newFilters, searchTerm = searchQuery) => {
      let filtered = [...allData];

      // Apply search
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        filtered = filtered.filter((item) =>
          Object.values(item).some(
            (value) =>
              value && value.toString().toLowerCase().includes(searchLower)
          )
        );
      }

      // Apply department filter
      if (newFilters.department) {
        filtered = filtered.filter(
          (item) => item.department === newFilters.department
        );
      }

      // Apply status filter
      if (newFilters.status) {
        filtered = filtered.filter((item) => item.status === newFilters.status);
      }

      // Apply quiz filter
      if (newFilters.quiz) {
        filtered = filtered.filter(
          (item) => item.quiz_name === newFilters.quiz
        );
      }

      // Apply date range filters
      if (newFilters.dateFrom) {
        const fromDate = new Date(newFilters.dateFrom);
        filtered = filtered.filter((item) => new Date(item.date) >= fromDate);
      }

      if (newFilters.dateTo) {
        const toDate = new Date(newFilters.dateTo);
        filtered = filtered.filter((item) => new Date(item.date) <= toDate);
      }

      setData(filtered);
      setCurrentPage(1);
    },
    [allData, searchQuery]
  );

  // Event handlers
  const handleSearch = useCallback(
    (query) => {
      setSearchQuery(query);
      applyFilters(filters, query);
    },
    [filters, applyFilters]
  );

  const handleFilterChange = useCallback(
    (key, value) => {
      const newFilters = { ...filters, [key]: value };
      setFilters(newFilters);
      applyFilters(newFilters);
    },
    [filters, applyFilters]
  );

  const clearFilters = useCallback(() => {
    setFilters(INITIAL_FILTERS);
    setSearchQuery("");
    setData(allData);
    setCurrentPage(1);
  }, [allData]);

  const handleExport = useCallback(() => {
    exportToCSV(data);
    setShowModal(false);
  }, [data]);

  const handlePageChange = useCallback((newPage) => {
    setCurrentPage(newPage);
  }, []);

  const handleRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  }, []);

  // Pagination calculations
  const paginationData = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentData = data.slice(indexOfFirstRow, indexOfLastRow);
    const totalPages = Math.ceil(data.length / rowsPerPage);

    return {
      currentData,
      indexOfFirstRow,
      indexOfLastRow,
      totalPages,
    };
  }, [data, currentPage, rowsPerPage]);

  return (
    <>
      {showModal && (
        <ConfirmationModal
          title="Proceed to Next Step?"
          message="Do you want to export this as csv?"
          confirmLabel="Yes, Proceed"
          cancelLabel="Cancel"
          onClose={() => setShowModal(false)}
          onConfirm={handleExport}
          confirmColor="green"
        />
      )}

      <div className="min-h-screen bg-white px-4 sm:px-6 lg:px-8 py-8 mt-15 sm:mt-0">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-3xl text-cyan-700 mb-2 tracking-tight">
              Test Results
            </h1>
          </div>

          {/* Controls */}
          <div className="mb-6">
            {/* Mobile Header - Collapsible (Mobile & Tablet Only) */}
            {(isMobile || isTablet) && (
              <div className="lg:hidden mb-3">
                <button
                  onClick={() => setShowMobileControls(!showMobileControls)}
                  className="flex items-center justify-between w-full p-3 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-[#217486]" />
                    <span className="font-medium text-slate-700">Controls</span>
                    {(activeFilterCount > 0 || searchQuery) && (
                      <span className="bg-[#217486] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {activeFilterCount + (searchQuery ? 1 : 0)}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform ${
                      showMobileControls ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            )}

            {/* Controls Container - Always visible on desktop, collapsible on mobile/tablet */}
            <div
              className={`
              ${
                (isMobile || isTablet) && !showMobileControls
                  ? "hidden"
                  : "block"
              } 
              lg:block
            `}
            >
              <div className="flex flex-col lg:flex-row gap-3">
                {/* Search - Full width on mobile, flexible on desktop */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#217486]/60" />
                  <input
                    type="text"
                    placeholder="Search by name, email, department..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="border border-slate-200 p-3 pl-10 pr-4 rounded-lg w-full bg-white focus:outline-none focus:ring-2 focus:ring-[#217486]/30 focus:border-[#217486] transition-all text-sm"
                  />
                </div>

                {/* Action Buttons - Stack on mobile, row on desktop */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {/* Filter Button */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center justify-center gap-2 px-5 py-3 rounded-lg font-medium transition-all text-sm whitespace-nowrap ${
                      showFilters || activeFilterCount > 0
                        ? "bg-[#217486] text-white shadow-md"
                        : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <Filter className="w-4 h-4" />
                    Filters
                    {activeFilterCount > 0 && (
                      <span className="bg-white text-[#217486] text-xs font-bold px-2 py-0.5 rounded-full">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Export Button */}
                  <button
                    onClick={() => setShowModal(true)}
                    disabled={data.length === 0}
                    className="flex items-center justify-center gap-2 px-5 py-3 bg-white border border-slate-200 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-all text-sm whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                </div>
              </div>

              {/* Active Filters Bar - Mobile & Tablet Only */}
              {(activeFilterCount > 0 || searchQuery) &&
                (isMobile || isTablet) && (
                  <div className="lg:hidden mt-3 flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Filter className="w-4 h-4" />
                      <span>
                        {activeFilterCount} filter
                        {activeFilterCount !== 1 ? "s" : ""}
                        {searchQuery && " + search"} active
                      </span>
                    </div>
                    <button
                      onClick={clearFilters}
                      className="text-sm text-[#217486] font-medium hover:text-[#1a5a6a] transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                )}

              {/* Filter Panel */}
              {showFilters && (
                <div className="mt-4">
                  <FilterPanel
                    filters={filters}
                    uniqueDepartments={uniqueDepartments}
                    uniqueQuizzes={uniqueQuizzes}
                    activeFilterCount={activeFilterCount}
                    onFilterChange={handleFilterChange}
                    onClearFilters={clearFilters}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          {isLoading ? (
            <LoadingState />
          ) : data.length === 0 ? (
            <EmptyState
              hasActiveFilters={searchQuery || activeFilterCount > 0}
              onClearFilters={clearFilters}
            />
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
              {isMobile || isTablet ? (
                <div className="p-4">
                  {paginationData.currentData.map((result) => (
                    <MobileResultCard
                      key={result.id}
                      result={result}
                      isTablet={isTablet && !isMobile}
                    />
                  ))}
                </div>
              ) : (
                <ResultsTable data={paginationData.currentData} />
              )}

              {/* Pagination Footer */}
              <div className="bg-slate-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100">
                <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row items-center justify-between">
                  {/* Results Info & Rows Per Page */}
                  <div className="flex flex-row items-center justify-between xs:justify-start gap-3 w-full sm:w-auto">
                    <div className="text-xs sm:text-sm text-slate-600 flex items-center gap-1 whitespace-nowrap">
                      <span className="sm:inline">Showing</span>
                      <span className="font-semibold text-slate-800">
                        {Math.min(paginationData.indexOfLastRow, data.length)}
                      </span>
                      of
                      <span className="font-semibold text-slate-800">
                        {data.length}
                      </span>
                      <span className="hidden sm:inline">results</span>
                      <span className="sm:hidden">items</span>
                    </div>
                    <select
                      value={rowsPerPage}
                      onChange={handleRowsPerPageChange}
                      className="border border-slate-200 rounded-lg px-2 sm:px-3 py-1.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#217486]/30 bg-white max-w-[100px]"
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex items-center gap-1 sm:gap-2 w-full sm:w-auto justify-center">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-2 sm:px-3 py-1.5 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white touch-manipulation"
                    >
                      <span className="hidden sm:inline">Previous</span>
                      <span className="sm:hidden">Prev</span>
                    </button>
                    <div className="flex gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide max-w-[180px] sm:max-w-none">
                      {[...Array(paginationData.totalPages)].map((_, i) => {
                        const pageNumber = i + 1;
                        if (
                          pageNumber === 1 ||
                          pageNumber === paginationData.totalPages ||
                          (pageNumber >= currentPage - 1 &&
                            pageNumber <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={pageNumber}
                              onClick={() => handlePageChange(pageNumber)}
                              className={`px-2 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all min-w-[32px] sm:min-w-[36px] touch-manipulation ${
                                currentPage === pageNumber
                                  ? "bg-cyan-700 text-white"
                                  : "text-slate-700 hover:bg-slate-100"
                              }`}
                            >
                              {pageNumber}
                            </button>
                          );
                        } else if (
                          pageNumber === currentPage - 2 ||
                          pageNumber === currentPage + 2
                        ) {
                          return (
                            <span
                              key={pageNumber}
                              className="px-1 sm:px-2 py-1.5 text-slate-400 text-xs sm:text-sm"
                            >
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === paginationData.totalPages}
                      className="px-2 sm:px-3 py-1.5 border border-slate-200 rounded-lg text-xs sm:text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all bg-white touch-manipulation"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ResultsPage;
