import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const ShirtFilters = ({
  filters,
  onFilterChange,
  onClearFilters,
  filterOptions,
}) => {
  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="h-8 text-xs"
          >
            Clear all
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Type Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Type</label>
          <Select
            value={filters.type || ""}
            onValueChange={(value) =>
              onFilterChange("type", value || undefined)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              <SelectItem value="home">Home</SelectItem>
              <SelectItem value="away">Away</SelectItem>
              <SelectItem value="third">Third</SelectItem>
              <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
              <SelectItem value="special">Special</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Season Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Season</label>
          <Select
            value={filters.season || ""}
            onValueChange={(value) =>
              onFilterChange("season", value || undefined)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All seasons" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All seasons</SelectItem>
              {filterOptions?.seasons?.map((season) => (
                <SelectItem key={season} value={season}>
                  {season}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Condition Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Condition</label>
          <Select
            value={filters.condition || ""}
            onValueChange={(value) =>
              onFilterChange("condition", value || undefined)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All conditions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All conditions</SelectItem>
              <SelectItem value="mint">Mint</SelectItem>
              <SelectItem value="excellent">Excellent</SelectItem>
              <SelectItem value="good">Good</SelectItem>
              <SelectItem value="fair">Fair</SelectItem>
              <SelectItem value="poor">Poor</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Brand Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Brand</label>
          <Select
            value={filters.brand || ""}
            onValueChange={(value) =>
              onFilterChange("brand", value || undefined)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="All brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All brands</SelectItem>
              {filterOptions?.brands?.map((brand) => (
                <SelectItem key={brand} value={brand}>
                  {brand}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.type && (
            <Badge variant="secondary" className="gap-1">
              Type: {filters.type}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFilterChange("type", undefined)}
              />
            </Badge>
          )}
          {filters.season && (
            <Badge variant="secondary" className="gap-1">
              Season: {filters.season}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFilterChange("season", undefined)}
              />
            </Badge>
          )}
          {filters.condition && (
            <Badge variant="secondary" className="gap-1">
              Condition: {filters.condition}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFilterChange("condition", undefined)}
              />
            </Badge>
          )}
          {filters.brand && (
            <Badge variant="secondary" className="gap-1">
              Brand: {filters.brand}
              <X
                className="w-3 h-3 cursor-pointer"
                onClick={() => onFilterChange("brand", undefined)}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ShirtFilters;
