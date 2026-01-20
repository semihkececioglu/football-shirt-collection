import { useState, useEffect, forwardRef } from "react";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDebounce } from "@/hooks/useDebounce";

const Spinner = () => (
  <div className="w-4 h-4 animate-spin rounded-full border-2 border-slate-300 border-t-slate-600 dark:border-slate-600 dark:border-t-slate-300" />
);

const SearchBar = forwardRef(({ onSearch, defaultValue = "", isLoading = false }, ref) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState(defaultValue);
  const debouncedSearch = useDebounce(search, 300);
  const isDebouncing = search !== debouncedSearch;

  // Update parent when debounced value changes
  useEffect(() => {
    onSearch(debouncedSearch);
  }, [debouncedSearch, onSearch]);

  const handleClear = () => {
    setSearch("");
  };

  return (
    <div className="relative">
      {isDebouncing || isLoading ? (
        <div className="absolute left-3 top-1/2 -translate-y-1/2">
          <Spinner />
        </div>
      ) : (
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      )}
      <Input
        ref={ref}
        type="text"
        placeholder={t("collection.searchPlaceholder")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="pl-10 pr-10"
      />
      {search && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClear}
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
});

SearchBar.displayName = "SearchBar";

export default SearchBar;
