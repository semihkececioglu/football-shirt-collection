import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Star,
  Calendar,
  DollarSign,
  Store,
  TrendingUp,
  Shield,
  Tag,
  Ruler,
  Trophy,
  User,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
import Navbar from "@/components/layout/Navbar";
import { useShirt, useDeleteShirt, useToggleFavorite } from "@/hooks/useShirts";
import ShirtDetailSkeleton from "@/components/shirt/ShirtDetailSkeleton";
import { toast } from "sonner";
import { useCurrency } from "@/context/CurrencyContext";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Helper to get full image URL (handles both string and object formats)
const getImageUrl = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.url || image.thumbnail;
};

// Helper to get thumbnail URL (handles both string and object formats)
const getImageThumbnail = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.thumbnail || image.url;
};

const ShirtDetail = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useShirt(id);
  const deleteShirt = useDeleteShirt();
  const toggleFavorite = useToggleFavorite();
  const { formatCurrency } = useCurrency();

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const shirt = data?.data;

  // Process images to handle both string and object formats
  const hasImages = shirt?.images && shirt.images.length > 0;
  const imageUrls = hasImages
    ? shirt.images.map((img) => getImageUrl(img))
    : ["https://via.placeholder.com/600x800?text=No+Image"];
  const thumbnailUrls = hasImages
    ? shirt.images.map((img) => getImageThumbnail(img))
    : ["https://via.placeholder.com/600x800?text=No+Image"];

  const lightboxSlides = imageUrls.map((url) => ({ src: url }));

  // Show not found only when not loading and no data
  if (!isLoading && !shirt) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {t("shirtDetail.notFound")}
          </h2>
          <Button onClick={() => navigate("/collection")} className="mt-4">
            {t("shirt.backToCollection")}
          </Button>
        </div>
      </div>
    );
  }

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const handleDeleteClick = () => {
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteShirt.mutateAsync(id);
      toast.success("The shirt has been removed from your collection");
      navigate("/collection");
    } catch (error) {
      console.error("Error deleting shirt:", error);
      toast.error("Failed to delete the shirt. Please try again.");
    }
  };

  const handleToggleFavorite = async (e) => {
    const wasNotFavorite = !data?.data?.isFavorite;
    const rect = e.currentTarget.getBoundingClientRect();
    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };

    try {
      await toggleFavorite.mutateAsync(id);

      // Trigger star confetti when adding to favorites
      if (wasNotFavorite) {
        const defaults = {
          spread: 360,
          ticks: 50,
          gravity: 0,
          decay: 0.94,
          startVelocity: 30,
          colors: ["#FFE400", "#FFBD00", "#E89400", "#FFCA6C", "#FDFFB8"],
          origin,
        };

        const shoot = () => {
          confetti({
            ...defaults,
            particleCount: 40,
            scalar: 1.2,
            shapes: ["star"],
          });
          confetti({
            ...defaults,
            particleCount: 10,
            scalar: 0.75,
            shapes: ["circle"],
          });
        };

        setTimeout(shoot, 0);
        setTimeout(shoot, 100);
        setTimeout(shoot, 200);
      }

      toast.success(
        data?.data?.isFavorite
          ? `${data.data.teamName} removed from favorites`
          : `${data.data.teamName} added to favorites`
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Navbar />

      {/* Header */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="h-8"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              {t("common.back")}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleToggleFavorite}
                disabled={isLoading}
                className="h-8"
              >
                <Star
                  className={`w-3.5 h-3.5 ${
                    shirt?.isFavorite ? "fill-amber-400 text-amber-400" : ""
                  }`}
                />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/collection/${id}/edit`)}
                disabled={isLoading}
                className="h-8"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                {t("common.edit")}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDeleteClick}
                disabled={isLoading}
                className="h-8 text-red-600 dark:text-red-400 hover:text-red-600 dark:hover:text-red-400"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                {t("common.delete")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {isLoading ? (
        <ShirtDetailSkeleton />
      ) : (
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Images with Swiper */}
          <motion.div
            className="lg:col-span-2 space-y-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <Swiper
              modules={[Navigation, Pagination]}
              navigation
              pagination={{ clickable: true }}
              className="aspect-[4/5] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 shadow-md swiper-custom"
            >
              {imageUrls.map((imgUrl, index) => (
                <SwiperSlide key={index}>
                  <img
                    src={imgUrl}
                    alt={`${shirt.teamName} ${index + 1}`}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => openLightbox(index)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Thumbnails */}
            {thumbnailUrls.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {thumbnailUrls.map((thumbUrl, index) => (
                  <button
                    key={index}
                    onClick={() => openLightbox(index)}
                    className="aspect-square rounded-md overflow-hidden border border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 transition"
                  >
                    <img
                      src={thumbUrl}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Details */}
          <div className="lg:col-span-3 space-y-5">
            {/* Hero Section - No Animation */}
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
              {shirt.teamName} {shirt.season}{" "}
              {shirt.type.charAt(0).toUpperCase() + shirt.type.slice(1)}
            </h1>

            {/* Animated Details */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 30,
                delay: 0.1,
              }}
            >
            {/* Badges Row */}
            {(shirt.signed || shirt.matchWorn) && (
              <div className="flex flex-wrap gap-2">
                {shirt.signed && (
                  <Badge
                    variant="secondary"
                    className="text-xs h-6 px-2.5 bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/30 dark:text-indigo-400 dark:border-indigo-800"
                  >
                    <Sparkles className="w-3.5 h-3.5 mr-1" />
                    Signed
                  </Badge>
                )}
                {shirt.matchWorn && (
                  <Badge
                    variant="secondary"
                    className="text-xs h-6 px-2.5 bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800"
                  >
                    <Trophy className="w-3.5 h-3.5 mr-1" />
                    Match Worn
                  </Badge>
                )}
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Condition */}
              <div className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm transition-all text-center">
                <div className="flex justify-center mb-3">
                  <div className="relative">
                    <div className="absolute inset-0 bg-slate-400/10 dark:bg-slate-500/10 rounded-full blur-lg"></div>
                    <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                  Condition
                </p>
                <p className="text-base font-medium text-slate-900 dark:text-slate-100 capitalize">
                  {shirt.condition}
                </p>
              </div>

              {/* Brand */}
              {shirt.brand && (
                <div className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm transition-all text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-slate-400/10 dark:bg-slate-500/10 rounded-full blur-lg"></div>
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                        <Tag className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Brand
                  </p>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                    {shirt.brand}
                  </p>
                </div>
              )}

              {/* Size */}
              {shirt.size && (
                <div className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm transition-all text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-slate-400/10 dark:bg-slate-500/10 rounded-full blur-lg"></div>
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                        <Ruler className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Size
                  </p>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                    {shirt.size}
                  </p>
                </div>
              )}

              {/* Competition */}
              {shirt.competition && (
                <div className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm transition-all text-center">
                  <div className="flex justify-center mb-3">
                    <div className="relative">
                      <div className="absolute inset-0 bg-slate-400/10 dark:bg-slate-500/10 rounded-full blur-lg"></div>
                      <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                        <Trophy className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                    Competition
                  </p>
                  <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                    {shirt.competition}
                  </p>
                </div>
              )}
            </div>

            {/* Player Info */}
            {(shirt.playerName || shirt.playerNumber) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Player Name */}
                {shirt.playerName && (
                  <div className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm text-center">
                    <div className="flex justify-center mb-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-slate-400/10 dark:bg-slate-500/10 rounded-full blur-lg"></div>
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                          <User className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      Player
                    </p>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                      {shirt.playerName}
                    </p>
                  </div>
                )}

                {/* Player Number */}
                {shirt.playerNumber && (
                  <div className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm text-center">
                    <div className="flex justify-center mb-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-slate-400/10 dark:bg-slate-500/10 rounded-full blur-lg"></div>
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                          <span className="text-xl font-bold text-white">
                            #
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      Number
                    </p>
                    <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                      {shirt.playerNumber}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Financial & Purchase Info Grid */}
            {(shirt.purchasePrice > 0 ||
              shirt.currentValue > 0 ||
              shirt.purchaseDate ||
              shirt.purchaseLocation) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Purchase Price */}
                {shirt.purchasePrice > 0 && (
                  <div className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm transition-all text-center">
                    <div className="flex justify-center mb-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-slate-400/10 dark:bg-slate-500/10 rounded-full blur-lg"></div>
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      Purchase Price
                    </p>
                    <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(shirt.purchasePrice)}
                    </p>
                  </div>
                )}

                {/* Current Value */}
                {shirt.currentValue > 0 && (
                  <div className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm transition-all text-center relative">
                    {shirt.purchasePrice > 0 && (
                      <Badge
                        variant="secondary"
                        className={`absolute top-1.5 right-1.5 text-[10px] h-4 px-1.5 font-semibold ${
                          shirt.currentValue >= shirt.purchasePrice
                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800"
                            : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800"
                        }`}
                      >
                        {shirt.currentValue >= shirt.purchasePrice ? "+" : ""}
                        {(
                          ((shirt.currentValue - shirt.purchasePrice) /
                            shirt.purchasePrice) *
                          100
                        ).toFixed(1)}
                        %
                      </Badge>
                    )}
                    <div className="flex justify-center mb-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-slate-400/10 dark:bg-slate-500/10 rounded-full blur-lg"></div>
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      Current Value
                    </p>
                    <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                      {formatCurrency(shirt.currentValue)}
                    </p>
                  </div>
                )}

                {/* Purchase Date */}
                {shirt.purchaseDate && (
                  <div className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm transition-all text-center">
                    <div className="flex justify-center mb-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-slate-400/10 dark:bg-slate-500/10 rounded-full blur-lg"></div>
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      Purchase Date
                    </p>
                    <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                      {new Date(shirt.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                {/* Purchase Location */}
                {shirt.purchaseLocation && (
                  <div className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm transition-all text-center">
                    <div className="flex justify-center mb-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-slate-400/10 dark:bg-slate-500/10 rounded-full blur-lg"></div>
                        <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 dark:from-slate-600 dark:to-slate-700 flex items-center justify-center">
                          <Store className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">
                      Store/Site
                    </p>
                    <p className="text-base font-medium text-slate-900 dark:text-slate-100">
                      {shirt.purchaseLocation}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {shirt.notes && (
              <div className="backdrop-blur-md bg-white/70 dark:bg-slate-800/70 border border-white/20 dark:border-slate-700/50 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-3">
                  Notes
                </h3>
                <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {shirt.notes}
                </p>
              </div>
            )}
            </motion.div>
          </div>
        </div>
      </main>
      )}

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        slides={lightboxSlides}
        index={lightboxIndex}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("shirt.deleteShirt")}?</AlertDialogTitle>
            <AlertDialogDescription>
              {t("shirt.deleteConfirm")} <strong>{shirt?.teamName}</strong>?
              {" "}{t("shirt.deleteWarning")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ShirtDetail;
