import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const SearchBar = ({ onSearch, defaultValue = "" }) => {
  const [search, setSearch] = useState(defaultValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(search);
    }, 500); // Debounce 500ms

    return () => clearTimeout(timer);
  }, [search, onSearch]);

  const handleClear = () => {
    setSearch("");
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
      <Input
        type="text"
        placeholder="Search by team, player, or competition..."
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
};

export default SearchBar;
