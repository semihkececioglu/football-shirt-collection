import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "@/components/common/SEO";
import {
  Plus,
  Grid3x3,
  Table as TableIcon,
  Shirt,
  Calendar,
  Package,
  Award,
  X,
  Star,
  Trophy,
  Maximize2,
  ArrowUpDown,
  Check,
  Shield,
  SlidersHorizontal,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import ShirtGrid from "@/components/shirt/ShirtGrid";
import ShirtDataTable from "@/components/shirt/ShirtDataTable";
import SearchBar from "@/components/shirt/SearchBar";
import { MultiFilterPopover } from "@/components/shirt/MultiFilterPopover";
import { ColorFilterPopover } from "@/components/shirt/ColorFilterPopover";
import { MoreFiltersPopover } from "@/components/shirt/MoreFiltersPopover";
import Pagination from "@/components/common/Pagination";
import { useShirts, useFilterOptions } from "@/hooks/useShirts";
import OnboardingModal from "@/components/onboarding/OnboardingModal";
import AddButtonSpotlight from "@/components/onboarding/AddButtonSpotlight";
import { useOnboarding } from "@/context/OnboardingContext";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuHighlight,
  DropdownMenuHighlightItem,
} from "@/components/animate-ui/primitives/radix/dropdown-menu";
import { motion, AnimatePresence } from "motion/react";

const Collection = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchInputRef = useRef(null);
  const { dismissAddButtonHighlight } = useOnboarding();

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    team: searchParams.get("team") || undefined,
    type: searchParams.get("type") || undefined,
    season: searchParams.get("season") || undefined,
    condition: searchParams.get("condition") || undefined,
    brand: searchParams.get("brand") || undefined,
    competition: searchParams.get("competition") || undefined,
    size: searchParams.get("size") || undefined,
    color: searchParams.get("color") || undefined,
    isFavorite: searchParams.get("isFavorite") || undefined,
    signed: searchParams.get("signed") || undefined,
    matchWorn: searchParams.get("matchWorn") || undefined,
    playerIssue: searchParams.get("playerIssue") || undefined,
    dateFrom: searchParams.get("dateFrom") || undefined,
    dateTo: searchParams.get("dateTo") || undefined,
    sort: searchParams.get("sort") || "-createdAt",
    page: parseInt(searchParams.get("page")) || 1,
    limit: parseInt(searchParams.get("limit")) || 10,
  });

  const { data, isLoading } = useShirts(filters);
  const { data: filterOptionsData } = useFilterOptions();

  // Get unique teams from filterOptions (from backend)
  const uniqueTeams = useMemo(() => {
    return filterOptionsData?.data?.teamNames || [];
  }, [filterOptionsData?.data?.teamNames]);

  // Helper to update URL params
  const updateURLParams = useCallback(
    (newFilters) => {
      const params = {};
      Object.entries(newFilters).forEach(([key, value]) => {
        // Only include page in URL if greater than 1
        if (key === "page") {
          if (value > 1) {
            params[key] = value;
          }
          return;
        }

        // Only include limit in URL if not default (10)
        if (key === "limit") {
          if (value !== 10) {
            params[key] = value;
          }
          return;
        }

        // Only include sort in URL if not default (-createdAt)
        if (key === "sort") {
          if (value !== "-createdAt") {
            params[key] = value;
          }
          return;
        }

        // Skip empty values and "all"
        if (value && value !== "all") {
          params[key] = value;
        }
      });

      setSearchParams(params, { replace: true });
    },
    [setSearchParams],
  );

  // Update URL whenever filters change
  useEffect(() => {
    updateURLParams(filters);
  }, [filters, updateURLParams]);

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      team: undefined,
      type: undefined,
      season: undefined,
      condition: undefined,
      brand: undefined,
      competition: undefined,
      size: undefined,
      color: undefined,
      isFavorite: undefined,
      signed: undefined,
      matchWorn: undefined,
      playerIssue: undefined,
      dateFrom: undefined,
      dateTo: undefined,
      sort: "-createdAt",
      page: 1,
      limit: 10,
    });
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (event) => {
      // Ctrl/Cmd + N - New shirt
      if ((event.ctrlKey || event.metaKey) && event.key === "n") {
        event.preventDefault();
        navigate("/collection/add");
      }
      // / or F - Focus search (when not in input)
      if (
        (event.key === "/" || event.key === "f") &&
        event.target.tagName !== "INPUT" &&
        event.target.tagName !== "TEXTAREA"
      ) {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
      // Escape - Clear filters
      if (event.key === "Escape") {
        handleClearFilters();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [navigate, handleClearFilters]);

  // Handle focusSearch URL param (from CommandPalette)
  useEffect(() => {
    const shouldFocusSearch = searchParams.get("focusSearch");
    if (shouldFocusSearch) {
      // Focus the search input
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
      // Remove the param from URL
      const newParams = new URLSearchParams(searchParams);
      newParams.delete("focusSearch");
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const handleSearch = useCallback((search) => {
    setFilters((prev) => ({ ...prev, search, page: 1 }));
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value === "all" ? undefined : value,
      page: 1,
    }));
  }, []);

  const handleSortChange = useCallback((value) => {
    setFilters((prev) => ({ ...prev, sort: value }));
  }, []);

  const handlePageChange = useCallback((page) => {
    setFilters((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleItemsPerPageChange = useCallback((value) => {
    const newLimit = parseInt(value);
    setFilters((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1, // Reset to first page
    }));
  }, []);

  const handleViewModeChange = useCallback((mode) => {
    setViewMode(mode);
  }, []);

  // Calculate active filters count
  const activeFiltersCount = Object.entries(filters).filter(([key, value]) => {
    if (key === "page" || key === "limit" || key === "sort") return false;
    if (value === undefined || value === "" || value === "all") return false;
    return true;
  }).length;

  return (
    <>
      <SEO
        title="My Collection"
        description="Browse and manage your football shirt collection. Filter, search, and organize your jerseys."
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <OnboardingModal />

        {/* Header */}
        <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Title and Action */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  {t("collection.title")}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {data?.pagination?.totalShirts || 0} {t("collection.shirts")}
                </p>
              </div>
              <AddButtonSpotlight>
                <ShimmerButton
                  onClick={() => {
                    dismissAddButtonHighlight();
                    navigate("/collection/add");
                  }}
                  className="h-9 px-4 text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-1.5 transition-transform duration-200 group-hover:rotate-90" />
                  <span>{t("common.add")}</span>
                </ShimmerButton>
              </AddButtonSpotlight>
            </div>

            {/* Search Bar */}
            <div className="mb-3">
              <SearchBar
                onSearch={handleSearch}
                defaultValue={filters.search}
                ref={searchInputRef}
                isLoading={isLoading}
              />
              {/* Search Result Info */}
              {filters.search && !isLoading && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 ml-1">
                  {data?.pagination?.totalShirts === 0
                    ? t("collection.noSearchResults", { query: filters.search })
                    : t("collection.searchResults", {
                        count: data?.pagination?.totalShirts || 0,
                        query: filters.search,
                      })}
                </p>
              )}
            </div>

            {/* Filter Bar */}
            <div className="space-y-3">
              {/* Mobile Filter Toggle Button */}
              <Button
                variant="outline"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden w-full h-10 justify-between"
              >
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  <span>{t("filters.title")}</span>
                  {activeFiltersCount > 0 && (
                    <Badge variant="secondary" className="h-5 px-1.5 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </div>
                <motion.div
                  animate={{ rotate: showMobileFilters ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </Button>

              {/* Filter Buttons - Always visible on desktop, toggle on mobile */}
              <div className="hidden md:block">
                <div className="flex flex-wrap items-center gap-2">
                  <MultiFilterPopover
                    label={t("shirt.team")}
                    icon={Shield}
                    values={filters.team ? filters.team.split(",") : []}
                    options={[
                      { label: t("filters.all"), value: "all" },
                      ...uniqueTeams.map((team) => ({
                        label: team,
                        value: team,
                      })),
                    ]}
                    onValuesChange={(values) =>
                      handleFilterChange(
                        "team",
                        values.length > 0 ? values.join(",") : undefined,
                      )
                    }
                  />

                  <MultiFilterPopover
                    label={t("shirt.type")}
                    icon={Shirt}
                    values={filters.type ? filters.type.split(",") : []}
                    options={[
                      { label: t("filters.allTypes"), value: "all" },
                      ...(filterOptionsData?.data?.types || []).map((type) => ({
                        label: t(`shirt.${type}`),
                        value: type,
                      })),
                    ]}
                    onValuesChange={(values) =>
                      handleFilterChange(
                        "type",
                        values.length > 0 ? values.join(",") : undefined,
                      )
                    }
                  />

                  <MultiFilterPopover
                    label={t("shirt.season")}
                    icon={Calendar}
                    values={filters.season ? filters.season.split(",") : []}
                    options={[
                      { label: t("filters.allSeasons"), value: "all" },
                      ...(filterOptionsData?.data?.seasons || []).map(
                        (season) => ({
                          label: season,
                          value: season,
                        }),
                      ),
                    ]}
                    onValuesChange={(values) =>
                      handleFilterChange(
                        "season",
                        values.length > 0 ? values.join(",") : undefined,
                      )
                    }
                  />

                  <MultiFilterPopover
                    label={t("shirt.brand")}
                    icon={Package}
                    values={filters.brand ? filters.brand.split(",") : []}
                    options={[
                      { label: t("filters.allBrands"), value: "all" },
                      ...(filterOptionsData?.data?.brands || []).map(
                        (brand) => ({
                          label: brand,
                          value: brand,
                        }),
                      ),
                    ]}
                    onValuesChange={(values) =>
                      handleFilterChange(
                        "brand",
                        values.length > 0 ? values.join(",") : undefined,
                      )
                    }
                  />

                  <MultiFilterPopover
                    label={t("shirt.condition")}
                    icon={Award}
                    values={
                      filters.condition ? filters.condition.split(",") : []
                    }
                    options={[
                      { label: t("filters.allConditions"), value: "all" },
                      ...(filterOptionsData?.data?.conditions || []).map(
                        (condition) => ({
                          label: t(`shirt.${condition}`),
                          value: condition,
                        }),
                      ),
                    ]}
                    onValuesChange={(values) =>
                      handleFilterChange(
                        "condition",
                        values.length > 0 ? values.join(",") : undefined,
                      )
                    }
                  />

                  <MultiFilterPopover
                    label={t("shirt.competition")}
                    icon={Trophy}
                    values={
                      filters.competition ? filters.competition.split(",") : []
                    }
                    options={[
                      { label: t("filters.allCompetitions"), value: "all" },
                      ...(filterOptionsData?.data?.competitions || []).map(
                        (comp) => ({
                          label: comp,
                          value: comp,
                        }),
                      ),
                    ]}
                    onValuesChange={(values) =>
                      handleFilterChange(
                        "competition",
                        values.length > 0 ? values.join(",") : undefined,
                      )
                    }
                  />

                  <MultiFilterPopover
                    label={t("shirt.size")}
                    icon={Maximize2}
                    values={filters.size ? filters.size.split(",") : []}
                    options={[
                      { label: t("filters.allSizes"), value: "all" },
                      ...(filterOptionsData?.data?.sizes || []).map((size) => ({
                        label: size,
                        value: size,
                      })),
                    ]}
                    onValuesChange={(values) =>
                      handleFilterChange(
                        "size",
                        values.length > 0 ? values.join(",") : undefined,
                      )
                    }
                  />

                  <ColorFilterPopover
                    label={t("addShirt.color")}
                    value={filters.color}
                    onValueChange={(value) =>
                      handleFilterChange("color", value)
                    }
                    availableColors={filterOptionsData?.data?.colors || []}
                    t={t}
                  />

                  <MoreFiltersPopover
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                  />

                  {/* Favorites Toggle */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      handleFilterChange(
                        "isFavorite",
                        filters.isFavorite ? undefined : "true",
                      )
                    }
                    className={cn(
                      "h-9 text-sm gap-1.5 overflow-hidden",
                      filters.isFavorite &&
                        "border-slate-400 bg-slate-100 dark:border-slate-600 dark:bg-slate-800",
                    )}
                  >
                    <span className="relative w-4 h-4 shrink-0">
                      <Star className="w-4 h-4 absolute inset-0" />
                      <AnimatePresence>
                        {filters.isFavorite && (
                          <motion.span
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{
                              type: "spring",
                              stiffness: 500,
                              damping: 25,
                            }}
                            className="absolute inset-0"
                          >
                            <Star className="w-4 h-4 fill-slate-600 text-slate-600 dark:fill-slate-400 dark:text-slate-400" />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    {t("filters.favorites")}
                  </Button>
                </div>
              </div>

              {/* Mobile Filter Buttons - Animated */}
              <AnimatePresence>
                {showMobileFilters && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden overflow-hidden"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      <MultiFilterPopover
                        label={t("shirt.team")}
                        icon={Shield}
                        values={filters.team ? filters.team.split(",") : []}
                        options={[
                          { label: t("filters.all"), value: "all" },
                          ...uniqueTeams.map((team) => ({
                            label: team,
                            value: team,
                          })),
                        ]}
                        onValuesChange={(values) =>
                          handleFilterChange(
                            "team",
                            values.length > 0 ? values.join(",") : undefined,
                          )
                        }
                      />

                      <MultiFilterPopover
                        label={t("shirt.type")}
                        icon={Shirt}
                        values={filters.type ? filters.type.split(",") : []}
                        options={[
                          { label: t("filters.allTypes"), value: "all" },
                          ...(filterOptionsData?.data?.types || []).map(
                            (type) => ({
                              label: t(`shirt.${type}`),
                              value: type,
                            }),
                          ),
                        ]}
                        onValuesChange={(values) =>
                          handleFilterChange(
                            "type",
                            values.length > 0 ? values.join(",") : undefined,
                          )
                        }
                      />

                      <MultiFilterPopover
                        label={t("shirt.season")}
                        icon={Calendar}
                        values={filters.season ? filters.season.split(",") : []}
                        options={[
                          { label: t("filters.allSeasons"), value: "all" },
                          ...(filterOptionsData?.data?.seasons || []).map(
                            (season) => ({
                              label: season,
                              value: season,
                            }),
                          ),
                        ]}
                        onValuesChange={(values) =>
                          handleFilterChange(
                            "season",
                            values.length > 0 ? values.join(",") : undefined,
                          )
                        }
                      />

                      <MultiFilterPopover
                        label={t("shirt.brand")}
                        icon={Package}
                        values={filters.brand ? filters.brand.split(",") : []}
                        options={[
                          { label: t("filters.allBrands"), value: "all" },
                          ...(filterOptionsData?.data?.brands || []).map(
                            (brand) => ({
                              label: brand,
                              value: brand,
                            }),
                          ),
                        ]}
                        onValuesChange={(values) =>
                          handleFilterChange(
                            "brand",
                            values.length > 0 ? values.join(",") : undefined,
                          )
                        }
                      />

                      <MultiFilterPopover
                        label={t("shirt.condition")}
                        icon={Award}
                        values={
                          filters.condition ? filters.condition.split(",") : []
                        }
                        options={[
                          { label: t("filters.allConditions"), value: "all" },
                          ...(filterOptionsData?.data?.conditions || []).map(
                            (condition) => ({
                              label: t(`shirt.${condition}`),
                              value: condition,
                            }),
                          ),
                        ]}
                        onValuesChange={(values) =>
                          handleFilterChange(
                            "condition",
                            values.length > 0 ? values.join(",") : undefined,
                          )
                        }
                      />

                      <MultiFilterPopover
                        label={t("shirt.competition")}
                        icon={Trophy}
                        values={
                          filters.competition
                            ? filters.competition.split(",")
                            : []
                        }
                        options={[
                          { label: t("filters.allCompetitions"), value: "all" },
                          ...(filterOptionsData?.data?.competitions || []).map(
                            (comp) => ({
                              label: comp,
                              value: comp,
                            }),
                          ),
                        ]}
                        onValuesChange={(values) =>
                          handleFilterChange(
                            "competition",
                            values.length > 0 ? values.join(",") : undefined,
                          )
                        }
                      />

                      <MultiFilterPopover
                        label={t("shirt.size")}
                        icon={Maximize2}
                        values={filters.size ? filters.size.split(",") : []}
                        options={[
                          { label: t("filters.allSizes"), value: "all" },
                          ...(filterOptionsData?.data?.sizes || []).map(
                            (size) => ({
                              label: size,
                              value: size,
                            }),
                          ),
                        ]}
                        onValuesChange={(values) =>
                          handleFilterChange(
                            "size",
                            values.length > 0 ? values.join(",") : undefined,
                          )
                        }
                      />

                      <ColorFilterPopover
                        label={t("addShirt.color")}
                        value={filters.color}
                        onValueChange={(value) =>
                          handleFilterChange("color", value)
                        }
                        availableColors={filterOptionsData?.data?.colors || []}
                        t={t}
                      />

                      <MoreFiltersPopover
                        filters={filters}
                        onFilterChange={handleFilterChange}
                        onClearFilters={handleClearFilters}
                      />

                      {/* Favorites Toggle */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          handleFilterChange(
                            "isFavorite",
                            filters.isFavorite ? undefined : "true",
                          )
                        }
                        className={cn(
                          "h-9 text-sm gap-1.5 overflow-hidden",
                          filters.isFavorite &&
                            "border-slate-400 bg-slate-100 dark:border-slate-600 dark:bg-slate-800",
                        )}
                      >
                        <span className="relative w-4 h-4 shrink-0">
                          <Star className="w-4 h-4 absolute inset-0" />
                          <AnimatePresence>
                            {filters.isFavorite && (
                              <motion.span
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 500,
                                  damping: 25,
                                }}
                                className="absolute inset-0"
                              >
                                <Star className="w-4 h-4 fill-slate-600 text-slate-600 dark:fill-slate-400 dark:text-slate-400" />
                              </motion.span>
                            )}
                          </AnimatePresence>
                        </span>
                        {t("filters.favorites")}
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Active Filter Chips */}
              {activeFiltersCount > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {t("filters.active")}:
                  </span>

                  {/* Team chip - multi value */}
                  {filters.team && (
                    <Badge variant="secondary" className="gap-1">
                      {t("shirt.team")}:{" "}
                      {filters.team.split(",").length > 1
                        ? `${filters.team.split(",").length} selected`
                        : filters.team}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("team", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {/* Type chip - multi value */}
                  {filters.type && (
                    <Badge variant="secondary" className="gap-1">
                      {t("shirt.type")}:{" "}
                      {filters.type.split(",").length > 1
                        ? `${filters.type.split(",").length} selected`
                        : filters.type}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("type", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {/* Season chip - multi value */}
                  {filters.season && (
                    <Badge variant="secondary" className="gap-1">
                      {t("shirt.season")}:{" "}
                      {filters.season.split(",").length > 1
                        ? `${filters.season.split(",").length} selected`
                        : filters.season}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("season", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {/* Brand chip - multi value */}
                  {filters.brand && (
                    <Badge variant="secondary" className="gap-1">
                      {t("shirt.brand")}:{" "}
                      {filters.brand.split(",").length > 1
                        ? `${filters.brand.split(",").length} selected`
                        : filters.brand}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("brand", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {/* Condition chip - multi value */}
                  {filters.condition && (
                    <Badge variant="secondary" className="gap-1">
                      {t("shirt.condition")}:{" "}
                      {filters.condition.split(",").length > 1
                        ? `${filters.condition.split(",").length} selected`
                        : filters.condition}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("condition", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {/* Competition chip - multi value */}
                  {filters.competition && (
                    <Badge variant="secondary" className="gap-1">
                      {t("shirt.competition")}:{" "}
                      {filters.competition.split(",").length > 1
                        ? `${filters.competition.split(",").length} selected`
                        : filters.competition}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("competition", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {/* Size chip - multi value */}
                  {filters.size && (
                    <Badge variant="secondary" className="gap-1">
                      {t("shirt.size")}:{" "}
                      {filters.size.split(",").length > 1
                        ? `${filters.size.split(",").length} selected`
                        : filters.size}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("size", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {/* Color chip */}
                  {filters.color && (
                    <Badge variant="secondary" className="gap-1">
                      {t("addShirt.color")}: {t(`colors.${filters.color}`)}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("color", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {/* Signed chip */}
                  {filters.signed && (
                    <Badge variant="secondary" className="gap-1">
                      {t("addShirt.signed")}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("signed", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {/* Match Worn chip */}
                  {filters.matchWorn && (
                    <Badge variant="secondary" className="gap-1">
                      {t("addShirt.matchWorn")}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("matchWorn", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {/* Player Issue chip */}
                  {filters.playerIssue && (
                    <Badge variant="secondary" className="gap-1">
                      {t("addShirt.playerIssue")}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("playerIssue", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {/* Date range chip */}
                  {(filters.dateFrom || filters.dateTo) && (
                    <Badge variant="secondary" className="gap-1">
                      {t("shirt.purchaseDate")}: {filters.dateFrom || "..."} -{" "}
                      {filters.dateTo || "..."}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("dateFrom", undefined);
                          handleFilterChange("dateTo", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  {/* Favorites chip */}
                  {filters.isFavorite && (
                    <Badge variant="secondary" className="gap-1">
                      {t("filters.favorites")}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFilterChange("isFavorite", undefined);
                        }}
                        className="hover:text-red-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-6 text-xs text-slate-500 hover:text-slate-900"
                  >
                    {t("filters.clearAll")}
                  </Button>
                </div>
              )}

              {/* View Controls */}
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2">
                {/* Left: View Toggle & Items per page */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-[3] md:flex-none border rounded-md border-slate-200 dark:border-slate-700 overflow-hidden">
                    <button
                      onClick={() => handleViewModeChange("grid")}
                      className={`flex-1 md:flex-none h-9 md:h-8 px-4 md:px-2.5 flex items-center justify-center transition-colors ${
                        viewMode === "grid"
                          ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                    >
                      <Grid3x3 className="w-4 h-4 md:w-3.5 md:h-3.5" />
                    </button>
                    <div className="w-px bg-slate-200 dark:bg-slate-700" />
                    <button
                      onClick={() => handleViewModeChange("table")}
                      className={`flex-1 md:flex-none h-9 md:h-8 px-4 md:px-2.5 flex items-center justify-center transition-colors ${
                        viewMode === "table"
                          ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                          : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                      }`}
                    >
                      <TableIcon className="w-4 h-4 md:w-3.5 md:h-3.5" />
                    </button>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-16 md:w-auto h-9 text-sm gap-1.5 shrink-0"
                      >
                        <span>{filters.limit}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="center"
                      sideOffset={4}
                      className="min-w-[60px] p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50"
                    >
                      <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                        {[10, 25, 50].map((limit) => (
                          <DropdownMenuHighlightItem
                            key={limit}
                            value={limit.toString()}
                          >
                            <DropdownMenuItem
                              className="relative flex items-center justify-center w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                              onSelect={() =>
                                handleItemsPerPageChange(limit.toString())
                              }
                            >
                              <span>{limit}</span>
                              {filters.limit === limit && (
                                <Check className="h-3.5 w-3.5 shrink-0 ml-2 text-slate-600 dark:text-slate-400" />
                              )}
                            </DropdownMenuItem>
                          </DropdownMenuHighlightItem>
                        ))}
                      </DropdownMenuHighlight>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Right: Sort */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full md:w-auto h-9 text-sm gap-1.5"
                    >
                      <ArrowUpDown className="h-4 w-4 shrink-0" />
                      <span className="truncate">
                        {filters.sort === "-createdAt" && t("sort.newestFirst")}
                        {filters.sort === "createdAt" && t("sort.oldestFirst")}
                        {filters.sort === "teamName" && t("sort.teamAZ")}
                        {filters.sort === "-teamName" && t("sort.teamZA")}
                        {filters.sort === "-purchasePrice" &&
                          t("sort.priceHighLow")}
                        {filters.sort === "purchasePrice" &&
                          t("sort.priceLowHigh")}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    sideOffset={4}
                    className="min-w-[160px] p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50"
                  >
                    <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                      {[
                        { value: "-createdAt", label: t("sort.newestFirst") },
                        { value: "createdAt", label: t("sort.oldestFirst") },
                        { value: "teamName", label: t("sort.teamAZ") },
                        { value: "-teamName", label: t("sort.teamZA") },
                        {
                          value: "-purchasePrice",
                          label: t("sort.priceHighLow"),
                        },
                        {
                          value: "purchasePrice",
                          label: t("sort.priceLowHigh"),
                        },
                      ].map((option) => (
                        <DropdownMenuHighlightItem
                          key={option.value}
                          value={option.value}
                        >
                          <DropdownMenuItem
                            className="relative flex items-center justify-between w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                            onSelect={() => handleSortChange(option.value)}
                          >
                            <span>{option.label}</span>
                            {filters.sort === option.value && (
                              <Check className="h-3.5 w-3.5 shrink-0 text-slate-600 dark:text-slate-400" />
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuHighlightItem>
                      ))}
                    </DropdownMenuHighlight>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {viewMode === "grid" ? (
            <ShirtGrid shirts={data?.data} isLoading={isLoading} />
          ) : (
            <ShirtDataTable
              shirts={data?.data}
              isLoading={isLoading}
              currentSort={filters.sort}
              onSortChange={handleSortChange}
            />
          )}

          {/* Pagination */}
          {data?.pagination && data.pagination.totalShirts > filters.limit && (
            <div className="mt-8">
              <Pagination
                currentPage={data.pagination.currentPage}
                totalPages={data.pagination.totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Collection;
