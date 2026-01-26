import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import SEO from "@/components/common/SEO";
import { arrayMove } from "@dnd-kit/sortable";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Shirt,
  Tag,
  User,
  Trophy,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Save,
  Loader2,
} from "lucide-react";
import SortableImageGrid from "@/components/form/SortableImageGrid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateShirt } from "@/hooks/useShirts";
import useFormValidation from "@/hooks/useFormValidation";
import { useCurrency } from "@/context/CurrencyContext";
import { DatePicker } from "@/components/ui/date-picker";
import Navbar from "@/components/layout/Navbar";
import { toast } from "sonner";
import { trackAddShirt } from "@/lib/firebase";

const AddShirt = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const createShirt = useCreateShirt();
  const { getSymbol } = useCurrency();
  const {
    errors,
    validateField,
    validateForm,
    setFieldError,
    clearFieldError,
  } = useFormValidation();

  const [formData, setFormData] = useState({
    teamName: "",
    season: "",
    type: "home",
    brand: "",
    size: "M",
    condition: "good",
    playerName: "",
    playerNumber: "",
    competition: "",
    signed: false,
    matchWorn: false,
    playerIssue: false,
    color: "",
    purchaseDate: new Date(),
    purchasePrice: "",
    currentValue: "",
    purchaseLocation: "",
    notes: "",
  });

  // Preset colors for shirt color selection
  const SHIRT_COLORS = [
    { value: "red", label: "Red", hex: "#EF4444" },
    { value: "blue", label: "Blue", hex: "#3B82F6" },
    { value: "yellow", label: "Yellow", hex: "#EAB308" },
    { value: "green", label: "Green", hex: "#22C55E" },
    { value: "black", label: "Black", hex: "#171717" },
    { value: "white", label: "White", hex: "#FFFFFF" },
    { value: "orange", label: "Orange", hex: "#F97316" },
    { value: "purple", label: "Purple", hex: "#A855F7" },
    { value: "pink", label: "Pink", hex: "#EC4899" },
    { value: "navy", label: "Navy", hex: "#1E3A8A" },
    { value: "gray", label: "Gray", hex: "#6B7280" },
    { value: "gold", label: "Gold", hex: "#CA8A04" },
  ];

  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showExitWarning, setShowExitWarning] = useState(false);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setHasUnsavedChanges(true);

    // Clear error when user starts typing
    if (errors[name]) {
      clearFieldError(name);
    }
  };

  const handleSeasonChange = (e) => {
    let value = e.target.value.replace(/\//g, ""); // Remove slashes
    value = value.replace(/[^0-9]/g, ""); // Only numbers

    // Auto-format: YYYY/YY
    if (value.length >= 4) {
      value = value.slice(0, 4) + "/" + value.slice(4, 6);
    }

    handleChange("season", value);

    // Real-time validation
    const error = validateField("season", value);
    if (error) {
      setFieldError("season", error);
    }
  };

  const handlePlayerNumberChange = (e) => {
    const value = e.target.value;

    // Allow empty string
    if (value === "") {
      handleChange("playerNumber", "");
      clearFieldError("playerNumber");
      return;
    }

    const numValue = parseInt(value);

    // Only allow numbers between 0 and 99
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 99) {
      handleChange("playerNumber", numValue.toString());
      clearFieldError("playerNumber");
    } else if (numValue < 0 || numValue > 99) {
      setFieldError("playerNumber", "Player number must be between 0-99");
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + images.length > 5) {
      alert("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);
    setHasUnsavedChanges(true);

    // Create previews
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setHasUnsavedChanges(true);
  };

  const reorderImages = (oldIndex, newIndex) => {
    setImages((prev) => arrayMove(prev, oldIndex, newIndex));
    setPreviews((prev) => arrayMove(prev, oldIndex, newIndex));
    setHasUnsavedChanges(true);
  };

  const handleBack = () => {
    if (hasUnsavedChanges) {
      setShowExitWarning(true);
    } else {
      navigate(-1);
    }
  };

  // Browser navigation warning
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check required fields
    if (images.length === 0) {
      toast.error("Please add at least one image");
      return;
    }

    if (!formData.teamName.trim()) {
      toast.error("Team name is required");
      return;
    }

    if (!formData.season.trim()) {
      toast.error("Season is required");
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

    if (!formData.purchaseLocation.trim()) {
      toast.error("Purchase location is required");
      return;
    }

    if (!formData.type) {
      toast.error("Type is required");
      return;
    }

    if (!formData.size) {
      toast.error("Size is required");
      return;
    }

    if (!formData.condition) {
      toast.error("Condition is required");
      return;
    }

    if (!formData.color) {
      toast.error(t("validation.colorRequired"));
      return;
    }

    // Validate form
    const isValid = validateForm(formData);
    if (!isValid) {
      toast.error("Please fix the errors in the form");
      return;
    }

    const data = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (key === "purchaseDate") {
        // Convert Date object to ISO string for backend
        if (formData.purchaseDate) {
          data.append("purchaseDate", formData.purchaseDate.toISOString());
        }
      } else if (
        formData[key] !== "" &&
        formData[key] !== null &&
        formData[key] !== undefined
      ) {
        data.append(key, formData[key]);
      }
    });

    // Append images
    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      await createShirt.mutateAsync(data);
      trackAddShirt({
        team: formData.teamName,
        brand: formData.brand,
        type: formData.type,
        season: formData.season,
      });
      setHasUnsavedChanges(false);
      toast.success("Shirt added successfully!");
      navigate("/collection");
    } catch (error) {
      console.error("Error creating shirt:", error);
      toast.error(error.response?.data?.message || "Failed to add shirt");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <SEO title="Add Shirt" description="Add a new football shirt to your collection." noindex={true} />
      <Navbar />

      {/* Form */}
      <motion.main
        className="max-w-3xl mx-auto px-4 sm:px-6 py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8
        }}
      >
        <div className="flex items-center gap-3 mb-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 px-2"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              {t("shirt.addNew")}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {t("addShirt.fillDetails")}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Image Upload */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {t("shirt.images")}
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                ({t("addShirt.max5")})
              </span>
            </div>

            <SortableImageGrid
              images={images}
              previews={previews}
              onReorder={reorderImages}
              onRemove={removeImage}
              onAdd={handleImageChange}
              maxImages={5}
            />
          </div>

          {/* Basic Information */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Shirt className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Basic Info
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <Label
                  htmlFor="teamName"
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                >
                  Team Name <span className="text-red-600 dark:text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="teamName"
                  type="text"
                  value={formData.teamName}
                  onChange={(e) => handleChange("teamName", e.target.value)}
                  placeholder="e.g., Manchester United"
                  className={`h-9 ${errors.teamName ? "border-red-500" : ""}`}
                />
                {errors.teamName && (
                  <p className="text-red-500 text-xs mt-1">{errors.teamName}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label
                    htmlFor="season"
                    className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                  >
                    Season <span className="text-red-600 dark:text-red-500 font-bold">*</span>
                  </Label>
                  <Input
                    id="season"
                    placeholder="2023/24"
                    value={formData.season}
                    onChange={handleSeasonChange}
                    maxLength={7}
                    className={`h-9 ${errors.season ? "border-red-500" : ""}`}
                  />
                  {errors.season && (
                    <p className="text-red-500 text-xs mt-1">{errors.season}</p>
                  )}
                </div>

                <div>
                  <Label
                    htmlFor="type"
                    className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                  >
                    Type <span className="text-red-600 dark:text-red-500 font-bold">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => handleChange("type", value)}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home">Home</SelectItem>
                      <SelectItem value="away">Away</SelectItem>
                      <SelectItem value="third">Third</SelectItem>
                      <SelectItem value="fourth">Fourth</SelectItem>
                      <SelectItem value="fifth">Fifth</SelectItem>
                      <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                      <SelectItem value="special">Special</SelectItem>
                      <SelectItem value="anniversary">Anniversary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Shirt Details */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Details
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <div>
                <Label
                  htmlFor="brand"
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                >
                  Brand <span className="text-red-600 dark:text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="brand"
                  type="text"
                  value={formData.brand}
                  onChange={(e) => handleChange("brand", e.target.value)}
                  placeholder="Nike"
                  className="h-9"
                />
              </div>

              <div>
                <Label
                  htmlFor="size"
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                >
                  Size <span className="text-red-600 dark:text-red-500 font-bold">*</span>
                </Label>
                <Select
                  value={formData.size}
                  onValueChange={(value) => handleChange("size", value)}
                >
                  <SelectTrigger className="h-9">
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

              <div>
                <Label
                  htmlFor="condition"
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                >
                  Condition <span className="text-red-600 dark:text-red-500 font-bold">*</span>
                </Label>
                <Select
                  value={formData.condition}
                  onValueChange={(value) => handleChange("condition", value)}
                >
                  <SelectTrigger className="h-9">
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

              <div>
                <Label
                  htmlFor="color"
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                >
                  Color <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.color}
                  onValueChange={(value) => handleChange("color", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select color" />
                  </SelectTrigger>
                  <SelectContent position="popper" className="max-h-60">
                    {SHIRT_COLORS.map((color) => (
                      <SelectItem key={color.value} value={color.value}>
                        <div className="flex items-center gap-2">
                          <div
                            className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600"
                            style={{ backgroundColor: color.hex }}
                          />
                          <span>{color.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Player Info */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <User className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Player
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label
                  htmlFor="playerName"
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                >
                  Name
                </Label>
                <Input
                  id="playerName"
                  value={formData.playerName}
                  onChange={(e) => handleChange("playerName", e.target.value)}
                  placeholder="e.g., Ronaldo"
                  className="h-9"
                />
              </div>

              <div>
                <Label
                  htmlFor="playerNumber"
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                >
                  Number
                </Label>
                <Input
                  id="playerNumber"
                  type="number"
                  min="0"
                  max="99"
                  value={formData.playerNumber}
                  onChange={handlePlayerNumberChange}
                  placeholder="7"
                  className={`h-9 ${
                    errors.playerNumber ? "border-red-500" : ""
                  }`}
                />
                {errors.playerNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.playerNumber}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Competition & Features */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Competition
              </h3>
            </div>

            <div className="space-y-2">
              <div>
                <Label
                  htmlFor="competition"
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                >
                  Competition <span className="text-red-600 dark:text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="competition"
                  type="text"
                  value={formData.competition}
                  onChange={(e) => handleChange("competition", e.target.value)}
                  placeholder="e.g., Premier League"
                  className="h-9"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700 flex-1 min-w-[120px]">
                  <Checkbox
                    id="signed"
                    checked={formData.signed}
                    onCheckedChange={(checked) =>
                      handleChange("signed", checked)
                    }
                  />
                  <label
                    htmlFor="signed"
                    className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Signed
                  </label>
                </div>

                <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700 flex-1 min-w-[120px]">
                  <Checkbox
                    id="matchWorn"
                    checked={formData.matchWorn}
                    onCheckedChange={(checked) =>
                      handleChange("matchWorn", checked)
                    }
                  />
                  <label
                    htmlFor="matchWorn"
                    className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Match Worn
                  </label>
                </div>

                <div className="flex items-center space-x-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 rounded border border-slate-200 dark:border-slate-700 flex-1 min-w-[120px]">
                  <Checkbox
                    id="playerIssue"
                    checked={formData.playerIssue}
                    onCheckedChange={(checked) =>
                      handleChange("playerIssue", checked)
                    }
                  />
                  <label
                    htmlFor="playerIssue"
                    className="text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer"
                  >
                    Player Issue
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Financial */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Financial
              </h3>
            </div>

            <div className="space-y-2">
              <div>
                <Label className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block">
                  Purchase Date
                </Label>
                <DatePicker
                  date={formData.purchaseDate}
                  onDateChange={(date) => handleChange("purchaseDate", date)}
                  placeholder="Select date"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label
                    htmlFor="purchasePrice"
                    className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                  >
                    Purchase {getSymbol()}
                  </Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={formData.purchasePrice}
                    onChange={(e) =>
                      handleChange("purchasePrice", e.target.value)
                    }
                    placeholder="0"
                    className="h-9"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="currentValue"
                    className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                  >
                    Current {getSymbol()}
                  </Label>
                  <Input
                    id="currentValue"
                    type="number"
                    value={formData.currentValue}
                    onChange={(e) =>
                      handleChange("currentValue", e.target.value)
                    }
                    placeholder="0"
                    className="h-9"
                  />
                </div>
              </div>

              <div>
                <Label
                  htmlFor="purchaseLocation"
                  className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-1 block"
                >
                  Purchase Location <span className="text-red-600 dark:text-red-500 font-bold">*</span>
                </Label>
                <Input
                  id="purchaseLocation"
                  type="text"
                  value={formData.purchaseLocation}
                  onChange={(e) =>
                    handleChange("purchaseLocation", e.target.value)
                  }
                  placeholder="Store or website"
                  className="h-9"
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Notes
              </h3>
            </div>

            <Textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Add any additional information..."
              maxLength={500}
              className={`resize-none text-sm ${
                errors.notes ? "border-red-500" : ""
              }`}
            />
            {errors.notes && (
              <p className="text-red-500 text-xs mt-1">{errors.notes}</p>
            )}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5">
              {formData.notes.length}/500 characters
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              className="flex-1 h-9"
            >
              {t("common.cancel")}
            </Button>
            <Button
              type="submit"
              disabled={createShirt.isPending}
              className="flex-1 h-9"
            >
              {createShirt.isPending ? (
                <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5 mr-1.5" />
              )}
              {createShirt.isPending ? t("addShirt.adding") : t("collection.addShirt")}
            </Button>
          </div>
        </form>
      </motion.main>

      {/* Unsaved Changes Warning Modal */}
      <AlertDialog open={showExitWarning} onOpenChange={setShowExitWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("addShirt.unsavedChanges")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("addShirt.unsavedChangesDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("addShirt.stayOnPage")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setHasUnsavedChanges(false);
                navigate(-1);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("addShirt.leaveWithoutSaving")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AddShirt;
