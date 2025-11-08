import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/layout/Navbar";
import ShirtGrid from "@/components/shirt/ShirtGrid";
import SearchBar from "@/components/shirt/SearchBar";
import ShirtFilters from "@/components/shirt/ShirtFilters";
import { useShirts, useFilterOptions } from "@/hooks/useShirts";

const Collection = () => {
  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    type: undefined,
    season: undefined,
    condition: undefined,
    brand: undefined,
    sort: "-createdAt",
  });

  const { data, isLoading } = useShirts(filters);
  const { data: filterOptionsData } = useFilterOptions();

  const handleSearch = (search) => {
    setFilters((prev) => ({ ...prev, search }));
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      type: undefined,
      season: undefined,
      condition: undefined,
      brand: undefined,
      sort: "-createdAt",
    });
  };

  const handleSortChange = (value) => {
    setFilters((prev) => ({ ...prev, sort: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">
                My Collection
              </h1>
              <p className="text-sm text-slate-600 mt-1">
                {data?.pagination?.totalShirts || 0} shirts in your collection
              </p>
            </div>
            <Button onClick={() => navigate("/shirts/add")}>
              <Plus className="w-4 h-4 mr-2" />
              Add Shirt
            </Button>
          </div>

          {/* Search Bar */}
          <div className="mt-6">
            <SearchBar onSearch={handleSearch} defaultValue={filters.search} />
          </div>

          {/* Filters Toggle & Sort */}
          <div className="flex items-center justify-between mt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              {showFilters ? "Hide" : "Show"} Filters
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-600">Sort by:</span>
              <Select value={filters.sort} onValueChange={handleSortChange}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-createdAt">Newest First</SelectItem>
                  <SelectItem value="createdAt">Oldest First</SelectItem>
                  <SelectItem value="teamName">Team (A-Z)</SelectItem>
                  <SelectItem value="-teamName">Team (Z-A)</SelectItem>
                  <SelectItem value="-purchasePrice">
                    Price (High-Low)
                  </SelectItem>
                  <SelectItem value="purchasePrice">
                    Price (Low-High)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-slate-200">
              <ShirtFilters
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                filterOptions={filterOptionsData?.data}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ShirtGrid shirts={data?.data} isLoading={isLoading} />

        {/* Pagination Info */}
        {data?.pagination && data.pagination.totalPages > 1 && (
          <div className="mt-8 text-center text-sm text-slate-600">
            Page {data.pagination.currentPage} of {data.pagination.totalPages}
          </div>
        )}
      </main>
    </div>
  );
};

export default Collection;
