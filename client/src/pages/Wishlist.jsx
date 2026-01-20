import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "@/components/common/SEO";
import { motion, AnimatePresence } from "motion/react";
import { useCurrency } from "@/context/CurrencyContext";
import { arrayMove } from "@dnd-kit/sortable";
import {
  Plus,
  Edit,
  Trash2,
  Star,
  Grid3x3,
  Table as TableIcon,
  X,
  MoreHorizontal,
  ShoppingBag,
  ImagePlus,
  Flag,
  Shirt,
  Check,
  ArrowUpDown,
} from "lucide-react";
import SortableImageGrid from "@/components/form/SortableImageGrid";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuHighlight,
  DropdownMenuHighlightItem,
} from "@/components/animate-ui/primitives/radix/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import Navbar from "@/components/layout/Navbar";
import SearchBar from "@/components/shirt/SearchBar";
import {
  useWishlist,
  useCreateWishlistItem,
  useUpdateWishlistItem,
  useDeleteWishlistItem,
} from "@/hooks/useWishlist";
import { useCreateShirt } from "@/hooks/useShirts";
import EmptyState from "@/components/common/EmptyState";
import WishlistDataTable from "@/components/wishlist/WishlistDataTable";
import WishlistCardSkeleton from "@/components/wishlist/WishlistCardSkeleton";
import Pagination from "@/components/common/Pagination";

const Wishlist = () => {
  const { t } = useTranslation();
  const { formatCurrency, getSymbol } = useCurrency();
  const { data, isLoading } = useWishlist();
  const createItem = useCreateWishlistItem();
  const updateItem = useUpdateWishlistItem();
  const deleteItem = useDeleteWishlistItem();
  const createShirt = useCreateShirt();
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'table'
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [addToCollectionDialogOpen, setAddToCollectionDialogOpen] =
    useState(false);
  const [itemToAdd, setItemToAdd] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  // Helper function to format date without timezone issues
  const formatLocalDate = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [addToCollectionFormData, setAddToCollectionFormData] = useState({
    brand: "",
    location: "",
    purchaseDate: formatLocalDate(new Date()),
    purchasePrice: "",
    currentValue: "",
    condition: "excellent",
    size: "M",
    notes: "",
  });
  const [formData, setFormData] = useState({
    teamName: "",
    season: "",
    type: "home",
    brand: "",
    competition: "",
    size: "M",
    priority: "medium",
    maxBudget: "",
    notes: "",
  });

  // Initialize filters from URL params
  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    priority: searchParams.get("priority") || undefined,
    type: searchParams.get("type") || undefined,
    sort: searchParams.get("sort") || "-createdAt",
    page: parseInt(searchParams.get("page")) || 1,
  });

  const allItems = useMemo(() => data?.data || [], [data?.data]);

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
    [setSearchParams]
  );

  // Update URL whenever filters change
  useEffect(() => {
    updateURLParams(filters);
  }, [filters, updateURLParams]);

  // Filter and sort items
  const filteredItems = useMemo(() => {
    let filtered = [...allItems];

    // Search filter
    if (filters.search) {
      filtered = filtered.filter((item) =>
        item.teamName.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Priority filter
    if (filters.priority) {
      filtered = filtered.filter((item) => item.priority === filters.priority);
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter((item) => item.type === filters.type);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sort) {
        case "teamName":
          return a.teamName.localeCompare(b.teamName);
        case "-teamName":
          return b.teamName.localeCompare(a.teamName);
        case "priority": {
          const priorityOrder = { low: 1, medium: 2, high: 3 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        }
        case "-priority": {
          const priorityOrderDesc = { low: 1, medium: 2, high: 3 };
          return priorityOrderDesc[b.priority] - priorityOrderDesc[a.priority];
        }
        case "maxBudget":
          return (a.maxBudget || 0) - (b.maxBudget || 0);
        case "-maxBudget":
          return (b.maxBudget || 0) - (a.maxBudget || 0);
        case "createdAt":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "-createdAt":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return filtered;
  }, [allItems, filters.search, filters.priority, filters.type, filters.sort]);

  // Pagination - dynamic items per page based on view mode
  const itemsPerPage = viewMode === "grid" ? 9 : 10;
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (filters.page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const wishlistItems = filteredItems.slice(startIndex, endIndex);

  // Reset to page 1 when view mode changes
  useEffect(() => {
    setFilters((prev) => ({ ...prev, page: 1 }));
  }, [viewMode]);

  // Filter handlers
  const handleSearch = useCallback((value) => {
    setFilters((prev) => ({ ...prev, search: value, page: 1 }));
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

  const handleClearFilters = useCallback(() => {
    setFilters({
      search: "",
      priority: undefined,
      type: undefined,
      sort: "-createdAt",
      page: 1,
    });
  }, []);

  const handleOpenDialog = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        teamName: item.teamName || "",
        season: item.season || "",
        type: item.type || "home",
        brand: item.brand || "",
        competition: item.competition || "",
        size: item.size || "M",
        priority: item.priority || "medium",
        maxBudget: item.maxBudget || "",
        notes: item.notes || "",
      });
    } else {
      setEditingItem(null);
      setFormData({
        teamName: "",
        season: "",
        type: "home",
        brand: "",
        competition: "",
        size: "M",
        priority: "medium",
        maxBudget: "",
        notes: "",
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.teamName.trim()) {
      toast.error("Team name is required");
      return;
    }
    if (!formData.season.trim()) {
      toast.error("Season is required");
      return;
    }
    if (!formData.type) {
      toast.error("Please select a shirt type");
      return;
    }
    if (!formData.brand.trim()) {
      toast.error("Brand is required");
      return;
    }
    if (!formData.competition.trim()) {
      toast.error("Competition is required");
      return;
    }
    if (!formData.size) {
      toast.error("Size is required");
      return;
    }

    try {
      if (editingItem) {
        await updateItem.mutateAsync({ id: editingItem._id, data: formData });
        toast.success("Wishlist item updated successfully");
      } else {
        await createItem.mutateAsync(formData);
        toast.success("Item added to wishlist");
      }
      setDialogOpen(false);
    } catch (error) {
      console.error("Error saving wishlist item:", error);
      toast.error(editingItem ? "Failed to update item" : "Failed to add item");
    }
  };

  const handleSeasonChange = (e) => {
    let value = e.target.value.replace(/\//g, ""); // Remove existing slashes

    // Only allow numbers
    value = value.replace(/[^0-9]/g, "");

    // Auto-add slash after 4 digits
    if (value.length >= 4) {
      value = value.slice(0, 4) + "/" + value.slice(4, 6);
    }

    setFormData({ ...formData, season: value });
  };

  const handleDeleteClick = (itemId) => {
    const item = allItems.find((i) => i._id === itemId);
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await deleteItem.mutateAsync(itemToDelete._id);
      toast.success("Item removed from wishlist");
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCollectionClick = (item) => {
    setItemToAdd(item);
    setSelectedImages([]);
    setImagePreviews([]);
    setAddToCollectionFormData({
      brand: item.brand || "",
      location: "",
      purchaseDate: formatLocalDate(new Date()),
      purchasePrice: item.maxBudget || "",
      currentValue: item.maxBudget || "",
      condition: "excellent",
      size: item.size || "M",
      notes: item.notes || "",
    });
    setAddToCollectionDialogOpen(true);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    // Limit to 5 images
    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setSelectedImages(files);

    // Create image previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleRemoveImage = (index) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const reorderImages = (oldIndex, newIndex) => {
    setSelectedImages((prev) => arrayMove(prev, oldIndex, newIndex));
    setImagePreviews((prev) => arrayMove(prev, oldIndex, newIndex));
  };

  const handleAddMoreImages = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = selectedImages.length + files.length;

    if (totalImages > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setSelectedImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleAddToCollectionSubmit = async (e) => {
    e.preventDefault();

    if (!itemToAdd) return;

    // Validation
    if (selectedImages.length === 0) {
      toast.error(t("validation.imageRequired"));
      return;
    }
    if (!addToCollectionFormData.brand.trim()) {
      toast.error(t("validation.brandRequired"));
      return;
    }
    if (!addToCollectionFormData.location.trim()) {
      toast.error(t("validation.locationRequired"));
      return;
    }

    try {
      // Create FormData for shirt
      const formData = new FormData();
      formData.append("teamName", itemToAdd.teamName);
      formData.append("season", itemToAdd.season || "");
      formData.append(
        "type",
        itemToAdd.type === "any" ? "home" : itemToAdd.type
      );
      formData.append("size", addToCollectionFormData.size);
      formData.append("condition", addToCollectionFormData.condition);
      formData.append("brand", addToCollectionFormData.brand);
      formData.append("competition", itemToAdd.competition || "");
      formData.append("purchaseLocation", addToCollectionFormData.location);
      formData.append(
        "purchasePrice",
        addToCollectionFormData.purchasePrice || 0
      );
      formData.append(
        "currentValue",
        addToCollectionFormData.currentValue || 0
      );
      if (addToCollectionFormData.purchaseDate) {
        formData.append("purchaseDate", addToCollectionFormData.purchaseDate);
      }
      if (addToCollectionFormData.notes) {
        formData.append("notes", addToCollectionFormData.notes);
      }

      // Add images
      selectedImages.forEach((image) => {
        formData.append("images", image);
      });

      // Add to collection
      await createShirt.mutateAsync(formData);

      // Remove from wishlist
      await deleteItem.mutateAsync(itemToAdd._id);

      toast.success(`${itemToAdd.teamName} added to collection!`);
      setAddToCollectionDialogOpen(false);
      setItemToAdd(null);
      setSelectedImages([]);
      setImagePreviews([]);
      setAddToCollectionFormData({
        brand: "",
        location: "",
        purchaseDate: "",
        purchasePrice: "",
        currentValue: "",
        condition: "excellent",
        size: "M",
        notes: "",
      });
    } catch (error) {
      console.error("Error adding to collection:", error);
      toast.error("Failed to add to collection");
    }
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "bg-slate-100 text-slate-800",
      medium: "bg-yellow-100 text-yellow-800",
      high: "bg-red-100 text-red-800",
    };
    return colors[priority] || colors.medium;
  };

  return (
    <>
      <SEO
        title="Wishlist"
        description="Track football shirts you want to add to your collection. Manage your wishlist and priorities."
      />
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />

        {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          {/* Title and Action */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                {t("wishlist.title")}
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {allItems.length} {t("wishlist.items")}
              </p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <ShimmerButton
                  onClick={() => handleOpenDialog()}
                  className="h-9 px-4 text-sm font-medium"
                >
                  <Plus className="w-4 h-4 mr-1.5 transition-transform duration-200 group-hover:rotate-90" />
                  {t("common.add")}
                </ShimmerButton>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader className="pb-2">
                  <DialogTitle className="text-base">
                    {editingItem ? t("wishlist.editItem") : t("wishlist.addNew")}
                  </DialogTitle>
                  <DialogDescription className="sr-only">
                    {editingItem ? t("wishlist.editItem") : t("wishlist.addNew")}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  {/* Team Name */}
                  <div>
                    <Label htmlFor="teamName" className="text-xs mb-1 block">
                      Team Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="teamName"
                      value={formData.teamName}
                      onChange={(e) =>
                        setFormData({ ...formData, teamName: e.target.value })
                      }
                      required
                      placeholder="e.g., Manchester United"
                      className="h-8 text-sm"
                    />
                  </div>

                  {/* Brand and Competition */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="brand" className="text-xs mb-1 block">
                        Brand <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) =>
                          setFormData({ ...formData, brand: e.target.value })
                        }
                        required
                        placeholder="e.g., Nike, Adidas"
                        className="h-8 text-sm"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="competition"
                        className="text-xs mb-1 block"
                      >
                        Competition <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="competition"
                        value={formData.competition}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            competition: e.target.value,
                          })
                        }
                        required
                        placeholder="e.g., Premier League"
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>

                  {/* Season, Type, Size */}
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <Label htmlFor="season" className="text-xs mb-1 block">
                        Season <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="season"
                        placeholder="2023/24"
                        value={formData.season}
                        onChange={handleSeasonChange}
                        maxLength={7}
                        className="h-8 text-sm"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="type" className="text-xs mb-1 block">
                        Type <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          setFormData({ ...formData, type: value })
                        }
                        required
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="home">Home</SelectItem>
                          <SelectItem value="away">Away</SelectItem>
                          <SelectItem value="third">Third</SelectItem>
                          <SelectItem value="fourth">Fourth</SelectItem>
                          <SelectItem value="fifth">Fifth</SelectItem>
                          <SelectItem value="goalkeeper">GK</SelectItem>
                          <SelectItem value="special">Special</SelectItem>
                          <SelectItem value="anniversary">Anniversary</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="size" className="text-xs mb-1 block">
                        Size <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.size}
                        onValueChange={(value) =>
                          setFormData({ ...formData, size: value })
                        }
                        required
                      >
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="XS">XS</SelectItem>
                          <SelectItem value="S">S</SelectItem>
                          <SelectItem value="M">M</SelectItem>
                          <SelectItem value="L">L</SelectItem>
                          <SelectItem value="XL">XL</SelectItem>
                          <SelectItem value="XXL">XXL</SelectItem>
                          <SelectItem value="XXXL">XXXL</SelectItem>
                          <SelectItem value="+4XL">+4XL</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <Label htmlFor="priority" className="text-xs mb-1 block">
                      Priority
                    </Label>
                    <Select
                      value={formData.priority}
                      onValueChange={(value) =>
                        setFormData({ ...formData, priority: value })
                      }
                    >
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Max Budget */}
                  <div>
                    <Label htmlFor="maxBudget" className="text-xs mb-1 block">
                      Max Budget ({getSymbol()})
                    </Label>
                    <Input
                      id="maxBudget"
                      type="number"
                      placeholder="0"
                      value={formData.maxBudget}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          maxBudget: e.target.value,
                        })
                      }
                      className="h-8 text-sm"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <Label htmlFor="notes" className="text-xs mb-1 block">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={(e) =>
                        setFormData({ ...formData, notes: e.target.value })
                      }
                      placeholder="Add any notes..."
                      className="resize-none text-sm"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                      className="flex-1 h-8 text-sm"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={createItem.isPending || updateItem.isPending}
                      className="flex-1 h-8 text-sm"
                    >
                      {createItem.isPending || updateItem.isPending
                        ? "Saving..."
                        : editingItem
                        ? "Update"
                        : "Add"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Search Bar */}
          <div className="mb-3">
            <SearchBar
              onSearch={handleSearch}
              defaultValue={filters.search}
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Filters */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Priority Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 text-sm gap-1.5",
                      filters.priority && "border-slate-400 bg-slate-100 dark:border-slate-600 dark:bg-slate-800"
                    )}
                  >
                    <Flag className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {filters.priority ? t(`wishlist.${filters.priority}`) : t("wishlist.allPriority")}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={4}
                  className="min-w-[140px] p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50"
                >
                  <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                    {[
                      { value: "all", label: t("wishlist.allPriority") },
                      { value: "low", label: t("wishlist.low") },
                      { value: "medium", label: t("wishlist.medium") },
                      { value: "high", label: t("wishlist.high") },
                    ].map((option) => {
                      const isSelected = option.value === "all"
                        ? !filters.priority
                        : filters.priority === option.value;
                      return (
                        <DropdownMenuHighlightItem key={option.value} value={option.value}>
                          <DropdownMenuItem
                            className="relative flex items-center justify-between w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                            onSelect={() => handleFilterChange("priority", option.value)}
                          >
                            <span>{option.label}</span>
                            <AnimatePresence mode="wait">
                              {isSelected && (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  <Check className="h-3.5 w-3.5 shrink-0 text-slate-600 dark:text-slate-400" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </DropdownMenuItem>
                        </DropdownMenuHighlightItem>
                      );
                    })}
                  </DropdownMenuHighlight>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Type Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className={cn(
                      "h-9 text-sm gap-1.5",
                      filters.type && "border-slate-400 bg-slate-100 dark:border-slate-600 dark:bg-slate-800"
                    )}
                  >
                    <Shirt className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {filters.type
                        ? (filters.type === "any" ? t("wishlist.any") : t(`shirt.${filters.type}`))
                        : t("filters.allTypes")}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  sideOffset={4}
                  className="min-w-[140px] p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50"
                >
                  <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                    {[
                      { value: "all", label: t("filters.allTypes") },
                      { value: "any", label: t("wishlist.any") },
                      { value: "home", label: t("shirt.home") },
                      { value: "away", label: t("shirt.away") },
                      { value: "third", label: t("shirt.third") },
                      { value: "goalkeeper", label: t("shirt.goalkeeper") },
                      { value: "special", label: t("shirt.special") },
                    ].map((option) => {
                      const isSelected = option.value === "all"
                        ? !filters.type
                        : filters.type === option.value;
                      return (
                        <DropdownMenuHighlightItem key={option.value} value={option.value}>
                          <DropdownMenuItem
                            className="relative flex items-center justify-between w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                            onSelect={() => handleFilterChange("type", option.value)}
                          >
                            <span>{option.label}</span>
                            <AnimatePresence mode="wait">
                              {isSelected && (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  <Check className="h-3.5 w-3.5 shrink-0 text-slate-600 dark:text-slate-400" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </DropdownMenuItem>
                        </DropdownMenuHighlightItem>
                      );
                    })}
                  </DropdownMenuHighlight>
                </DropdownMenuContent>
              </DropdownMenu>

              {(filters.search || filters.priority || filters.type) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="h-9 text-sm hidden sm:flex"
                >
                  <X className="w-3.5 h-3.5 mr-1" />
                  {t("filters.clearAll")}
                </Button>
              )}
            </div>

            {/* View Toggle & Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              {/* View Toggle */}
              <div className="flex border rounded-md border-slate-200 dark:border-slate-700 overflow-hidden w-full sm:w-auto">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`h-8 px-2.5 flex-1 sm:flex-initial flex items-center justify-center transition-colors ${
                    viewMode === "grid"
                      ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <Grid3x3 className="w-3.5 h-3.5" />
                </button>
                <div className="w-px bg-slate-200 dark:bg-slate-700" />
                <button
                  onClick={() => setViewMode("table")}
                  className={`h-8 px-2.5 flex-1 sm:flex-initial flex items-center justify-center transition-colors ${
                    viewMode === "table"
                      ? "bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                      : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                  }`}
                >
                  <TableIcon className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 text-sm gap-1.5 w-full sm:w-auto"
                  >
                    <ArrowUpDown className="w-4 h-4 shrink-0" />
                    <span className="truncate">
                      {filters.sort === "-createdAt" && t("filters.newest")}
                      {filters.sort === "createdAt" && t("filters.oldest")}
                      {filters.sort === "teamName" && "A-Z"}
                      {filters.sort === "-teamName" && "Z-A"}
                      {filters.sort === "-priority" && `${t("wishlist.priority")} ↓`}
                      {filters.sort === "priority" && `${t("wishlist.priority")} ↑`}
                      {filters.sort === "-maxBudget" && `${t("wishlist.budget")} ↓`}
                      {filters.sort === "maxBudget" && `${t("wishlist.budget")} ↑`}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  sideOffset={4}
                  className="min-w-[140px] p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg z-50"
                >
                  <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                    {[
                      { value: "-createdAt", label: t("filters.newest") },
                      { value: "createdAt", label: t("filters.oldest") },
                      { value: "teamName", label: "A-Z" },
                      { value: "-teamName", label: "Z-A" },
                      { value: "-priority", label: `${t("wishlist.priority")} ↓` },
                      { value: "priority", label: `${t("wishlist.priority")} ↑` },
                      { value: "-maxBudget", label: `${t("wishlist.budget")} ↓` },
                      { value: "maxBudget", label: `${t("wishlist.budget")} ↑` },
                    ].map((option) => {
                      const isSelected = filters.sort === option.value;
                      return (
                        <DropdownMenuHighlightItem key={option.value} value={option.value}>
                          <DropdownMenuItem
                            className="relative flex items-center justify-between w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                            onSelect={() => handleSortChange(option.value)}
                          >
                            <span>{option.label}</span>
                            <AnimatePresence mode="wait">
                              {isSelected && (
                                <motion.div
                                  key="check"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                >
                                  <Check className="h-3.5 w-3.5 shrink-0 text-slate-600 dark:text-slate-400" />
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </DropdownMenuItem>
                        </DropdownMenuHighlightItem>
                      );
                    })}
                  </DropdownMenuHighlight>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <WishlistCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <EmptyState
            icon={Star}
            title={allItems.length === 0 ? t("wishlist.noItems") : t("wishlist.noResults")}
            description={allItems.length === 0 ? t("wishlist.noItemsDesc") : t("wishlist.noResultsDesc")}
            action={allItems.length > 0 ? handleClearFilters : undefined}
            actionLabel={allItems.length > 0 ? t("filters.clearAll") : undefined}
          />
        ) : viewMode === "grid" ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {wishlistItems.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow p-4"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                    delay: index * 0.05,
                  }}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <h3 className="font-semibold text-base text-slate-900 dark:text-slate-100">
                          {item.teamName}
                        </h3>
                        {item.season && (
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {item.season}
                          </span>
                        )}
                        {item.type !== "any" && (
                          <span className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                            • {item.type}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                      <Badge
                        variant="secondary"
                        className={`text-xs h-5 px-2 ${getPriorityColor(
                          item.priority
                        )}`}
                      >
                        {item.priority}
                      </Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="h-7 w-7 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors">
                            <MoreHorizontal className="h-4 w-4 text-slate-600 dark:text-slate-400" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                          <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                            <DropdownMenuHighlightItem value="addToCollection">
                              <DropdownMenuItem
                                onClick={() => handleAddToCollectionClick(item)}
                                className="relative flex items-center gap-2 w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                              >
                                <ShoppingBag className="h-4 w-4" />
                                Add to Collection
                              </DropdownMenuItem>
                            </DropdownMenuHighlightItem>
                          </DropdownMenuHighlight>
                          <DropdownMenuSeparator />
                          <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                            <DropdownMenuHighlightItem value="edit">
                              <DropdownMenuItem
                                onClick={() => handleOpenDialog(item)}
                                className="relative flex items-center gap-2 w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                              >
                                <Edit className="h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                            </DropdownMenuHighlightItem>
                          </DropdownMenuHighlight>
                          <DropdownMenuSeparator />
                          <DropdownMenuHighlight className="inset-0 bg-red-100 dark:bg-red-900/30 rounded-md">
                            <DropdownMenuHighlightItem value="remove">
                              <DropdownMenuItem
                                onClick={() => handleDeleteClick(item._id)}
                                className="relative flex items-center gap-2 w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-red-600 dark:text-red-400 select-none"
                              >
                                <Trash2 className="h-4 w-4" />
                                Remove
                              </DropdownMenuItem>
                            </DropdownMenuHighlightItem>
                          </DropdownMenuHighlight>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {item.maxBudget > 0 && (
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="text-slate-500 dark:text-slate-400">
                          Max Budget:
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {formatCurrency(item.maxBudget)}
                        </span>
                      </div>
                    )}
                    {item.notes && (
                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {item.notes}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
            {filteredItems.length > itemsPerPage && (
              <div className="mt-8">
                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        ) : (
          <>
            <WishlistDataTable
              items={wishlistItems}
              isLoading={false}
              onEdit={handleOpenDialog}
              onDelete={handleDeleteClick}
              onAddToCollection={handleAddToCollectionClick}
              currentSort={filters.sort}
              onSortChange={handleSortChange}
            />
            {filteredItems.length > itemsPerPage && (
              <div className="mt-6">
                <Pagination
                  currentPage={filters.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Add to Collection Dialog */}
      <Dialog
        open={addToCollectionDialogOpen}
        onOpenChange={setAddToCollectionDialogOpen}
      >
        <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-2">
            <DialogTitle className="text-base">Add to Collection</DialogTitle>
            <DialogDescription className="sr-only">
              Add item to your collection
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddToCollectionSubmit} className="space-y-3">
            {/* Item Info */}
            {itemToAdd && (
              <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  {itemToAdd.teamName}
                </p>
                <div className="flex gap-2 text-xs text-slate-600 dark:text-slate-400 mt-1">
                  <span>{itemToAdd.season}</span>
                  <span>•</span>
                  <span className="capitalize">{itemToAdd.type}</span>
                </div>
              </div>
            )}

            {/* Image Upload Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs font-medium text-slate-900 dark:text-slate-100">
                  Shirt Images <span className="text-red-500">*</span>
                </Label>
                {selectedImages.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedImages.length}/5 images
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedImages([]);
                        setImagePreviews([]);
                      }}
                      className="h-5 px-2 text-xs text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                    >
                      Clear all
                    </Button>
                  </div>
                )}
              </div>

              {selectedImages.length === 0 ? (
                <div className="relative">
                  <input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="images"
                    className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed rounded-md cursor-pointer transition-colors border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 hover:border-slate-400 dark:hover:border-slate-500"
                  >
                    <div className="flex flex-col items-center justify-center text-center">
                      <div className="p-2 rounded-md bg-slate-200 dark:bg-slate-700 mb-2">
                        <ImagePlus className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                      </div>
                      <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-0.5">
                        Click to upload
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Max 5 images
                      </p>
                    </div>
                  </label>
                </div>
              ) : (
                <SortableImageGrid
                  images={selectedImages}
                  previews={imagePreviews}
                  onReorder={reorderImages}
                  onRemove={handleRemoveImage}
                  onAdd={handleAddMoreImages}
                  maxImages={5}
                  columns="grid-cols-5"
                />
              )}
            </div>

            {/* Brand, Size, and Condition - 3 columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              {/* Brand */}
              <div>
                <Label htmlFor="addBrand" className="text-xs mb-1 block">
                  Brand <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="addBrand"
                  value={addToCollectionFormData.brand}
                  onChange={(e) =>
                    setAddToCollectionFormData({
                      ...addToCollectionFormData,
                      brand: e.target.value,
                    })
                  }
                  placeholder="e.g., Nike, Adidas"
                  className="h-8 text-sm"
                />
              </div>

              {/* Size */}
              <div>
                <Label htmlFor="addSize" className="text-xs mb-1 block">
                  Size
                </Label>
                <Select
                  value={addToCollectionFormData.size}
                  onValueChange={(value) =>
                    setAddToCollectionFormData({
                      ...addToCollectionFormData,
                      size: value,
                    })
                  }
                >
                  <SelectTrigger size="sm" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XS">XS</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                    <SelectItem value="XXL">XXL</SelectItem>
                    <SelectItem value="XXXL">XXXL</SelectItem>
                    <SelectItem value="+4XL">+4XL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Condition */}
              <div>
                <Label htmlFor="addCondition" className="text-xs mb-1 block">
                  Condition
                </Label>
                <Select
                  value={addToCollectionFormData.condition}
                  onValueChange={(value) =>
                    setAddToCollectionFormData({
                      ...addToCollectionFormData,
                      condition: value,
                    })
                  }
                >
                  <SelectTrigger size="sm" className="text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brandNewTags">Brand New With Tags</SelectItem>
                    <SelectItem value="brandNew">Brand New</SelectItem>
                    <SelectItem value="mint">Mint</SelectItem>
                    <SelectItem value="excellent">Excellent</SelectItem>
                    <SelectItem value="good">Good</SelectItem>
                    <SelectItem value="fair">Fair</SelectItem>
                    <SelectItem value="poor">Poor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Location and Purchase Date - 2 columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-xs mb-1 block">
                  Location <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="location"
                  value={addToCollectionFormData.location}
                  onChange={(e) =>
                    setAddToCollectionFormData({
                      ...addToCollectionFormData,
                      location: e.target.value,
                    })
                  }
                  placeholder="e.g., Closet, Display Case"
                  className="h-8 text-sm"
                />
              </div>

              {/* Purchase Date */}
              <div>
                <Label htmlFor="purchaseDate" className="text-xs mb-1 block">
                  Purchase Date
                </Label>
                <DatePicker
                  date={addToCollectionFormData.purchaseDate ? new Date(addToCollectionFormData.purchaseDate) : undefined}
                  onDateChange={(date) =>
                    setAddToCollectionFormData({
                      ...addToCollectionFormData,
                      purchaseDate: date ? formatLocalDate(date) : "",
                    })
                  }
                />
              </div>
            </div>

            {/* Purchase Price and Current Price - 2 columns on desktop */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {/* Purchase Price */}
              <div>
                <Label htmlFor="purchasePrice" className="text-xs mb-1 block">
                  Purchase Price ({getSymbol()})
                </Label>
                <Input
                  id="purchasePrice"
                  type="number"
                  value={addToCollectionFormData.purchasePrice}
                  onChange={(e) =>
                    setAddToCollectionFormData({
                      ...addToCollectionFormData,
                      purchasePrice: e.target.value,
                    })
                  }
                  placeholder="0"
                  className="h-8 text-sm"
                />
              </div>

              {/* Current Value */}
              <div>
                <Label htmlFor="currentValue" className="text-xs mb-1 block">
                  Current Value ({getSymbol()})
                </Label>
                <Input
                  id="currentValue"
                  type="number"
                  value={addToCollectionFormData.currentValue}
                  onChange={(e) =>
                    setAddToCollectionFormData({
                      ...addToCollectionFormData,
                      currentValue: e.target.value,
                    })
                  }
                  placeholder="0"
                  className="h-8 text-sm"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <Label htmlFor="addNotes" className="text-xs mb-1 block">
                Notes
              </Label>
              <Textarea
                id="addNotes"
                rows={3}
                value={addToCollectionFormData.notes}
                onChange={(e) =>
                  setAddToCollectionFormData({
                    ...addToCollectionFormData,
                    notes: e.target.value,
                  })
                }
                placeholder="Add any notes..."
                className="resize-none text-sm"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                onClick={() => setAddToCollectionDialogOpen(false)}
                className="flex-1 h-8 text-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createShirt.isPending}
                className="flex-1 h-8 text-sm"
              >
                {createShirt.isPending ? "Adding..." : "Add to Collection"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("wishlist.removeConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("wishlist.removeConfirmDesc", { teamName: itemToDelete?.teamName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              {t("wishlist.remove")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </>
  );
};

export default Wishlist;
