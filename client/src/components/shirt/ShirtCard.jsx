import { useState } from "react";
import { Star, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";
import confetti from "canvas-confetti";
import { Card } from "@/components/ui/card";
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useNavigate } from "react-router-dom";
import { useToggleFavorite, useDeleteShirt } from "@/hooks/useShirts";
import { toast } from "sonner";

// Helper to get thumbnail URL (handles both string and object formats)
const getImageThumbnail = (image) => {
  if (!image) return null;
  if (typeof image === "string") return image;
  return image.thumbnail || image.url;
};

const ShirtCard = ({ shirt }) => {
  const navigate = useNavigate();
  const toggleFavorite = useToggleFavorite();
  const deleteShirt = useDeleteShirt();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Get first image thumbnail for card display
  const thumbnailUrl = shirt.images?.[0] ? getImageThumbnail(shirt.images[0]) : null;

  const handleFavorite = (e) => {
    e.stopPropagation();
    const wasNotFavorite = !shirt.isFavorite;
    const rect = e.currentTarget.getBoundingClientRect();
    const origin = {
      x: (rect.left + rect.width / 2) / window.innerWidth,
      y: (rect.top + rect.height / 2) / window.innerHeight,
    };

    toggleFavorite.mutate(shirt._id, {
      onSuccess: () => {
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
          shirt.isFavorite
            ? `${shirt.teamName} ${shirt.season} ${shirt.type} removed from favorites`
            : `${shirt.teamName} ${shirt.season} ${shirt.type} added to favorites`
        );
      },
    });
  };

  const handleEdit = (e) => {
    e?.stopPropagation();
    navigate(`/collection/${shirt._id}/edit`);
  };

  const handleDeleteClick = (e) => {
    e?.stopPropagation();
    setShowDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    deleteShirt.mutate(shirt._id, {
      onSuccess: () => {
        toast.success(`${shirt.teamName} ${shirt.season} ${shirt.type} has been deleted`);
      },
    });
    setShowDeleteDialog(false);
  };

  const handleCardClick = () => {
    navigate(`/collection/${shirt._id}`);
  };

  return (
    <>
      <Card
        className="overflow-hidden hover:shadow-md transition-all cursor-pointer group border border-slate-200 dark:border-slate-700 flex flex-col p-0"
        onClick={handleCardClick}
      >
        {/* Image with 3:4 aspect ratio */}
        <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-800">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={shirt.teamName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-400">
              <span className="text-4xl">⚽</span>
            </div>
          )}
        </div>

        {/* Content - Compact */}
        <div className="px-2 pt-1.5 pb-2 flex-1 flex flex-col">
          <h3 className="font-semibold text-sm truncate dark:text-slate-100 leading-tight">
            {shirt.teamName}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 truncate leading-tight mt-0.5">
            {shirt.season} • <span className="capitalize">{shirt.type}</span>
          </p>

          {/* Bottom Actions - Compact */}
          <div className="flex items-center justify-between mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={handleFavorite}
              className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1 transition-colors"
            >
              <Star
                className={`w-3.5 h-3.5 ${
                  shirt.isFavorite
                    ? "fill-amber-400 text-amber-400"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              />
            </button>

            {/* 3-dot menu */}
            <DropdownMenu>
              <DropdownMenuTrigger
                asChild
                onClick={(e) => e.stopPropagation()}
              >
                <button className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1 transition-colors">
                  <MoreVertical className="w-3.5 h-3.5 text-slate-600 dark:text-slate-400" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" side="bottom" sideOffset={4} className="w-40 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                  <DropdownMenuHighlightItem value="view">
                    <DropdownMenuItem
                      onClick={handleCardClick}
                      className="relative flex items-center gap-2 w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                  </DropdownMenuHighlightItem>
                  <DropdownMenuHighlightItem value="edit">
                    <DropdownMenuItem
                      onClick={handleEdit}
                      className="relative flex items-center gap-2 w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                  </DropdownMenuHighlightItem>
                </DropdownMenuHighlight>
                <DropdownMenuSeparator />
                <DropdownMenuHighlight className="inset-0 bg-red-100 dark:bg-red-900/30 rounded-md">
                  <DropdownMenuHighlightItem value="delete">
                    <DropdownMenuItem
                      onClick={handleDeleteClick}
                      className="relative flex items-center gap-2 w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-red-600 dark:text-red-400 select-none"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuHighlightItem>
                </DropdownMenuHighlight>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete shirt?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{shirt.teamName}</strong> ({shirt.season})? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default ShirtCard;
