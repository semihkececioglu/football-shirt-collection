import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { Star, Eye, Edit, Trash2, MoreHorizontal, Shirt } from "lucide-react";
import { useCurrency } from "@/context/CurrencyContext";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Badge } from "@/components/ui/badge";
import { useToggleFavorite, useDeleteShirt } from "@/hooks/useShirts";
import { toast } from "sonner";
import ShirtDataTableSkeleton from "./ShirtDataTableSkeleton";
import EmptyState from "../common/EmptyState";
import SortableTableHead from "./SortableTableHead";

// Color hex map for visual display
const COLOR_HEX_MAP = {
  red: "#ef4444",
  blue: "#3b82f6",
  yellow: "#eab308",
  green: "#22c55e",
  black: "#1e293b",
  white: "#f8fafc",
  orange: "#f97316",
  purple: "#a855f7",
  pink: "#ec4899",
  navy: "#1e3a5a",
  gray: "#6b7280",
  gold: "#d4a574",
};

const ShirtDataTable = ({ shirts, isLoading, currentSort, onSortChange }) => {
  const navigate = useNavigate();
  const toggleFavorite = useToggleFavorite();
  const deleteShirt = useDeleteShirt();
  const { formatCurrency } = useCurrency();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [shirtToDelete, setShirtToDelete] = useState(null);

  const handleFavorite = (e, shirt) => {
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

  const handleEdit = (id) => {
    navigate(`/collection/${id}/edit`);
  };

  const handleDeleteClick = (e, shirt) => {
    e.stopPropagation();
    setShirtToDelete(shirt);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!shirtToDelete) return;
    deleteShirt.mutate(shirtToDelete._id, {
      onSuccess: () => {
        toast.success(`${shirtToDelete.teamName} ${shirtToDelete.season} ${shirtToDelete.type} has been deleted`);
      },
    });
    setDeleteDialogOpen(false);
    setShirtToDelete(null);
  };

  const handleRowClick = (id) => {
    navigate(`/collection/${id}`);
  };

  if (isLoading) {
    return <ShirtDataTableSkeleton rows={10} />;
  }

  if (!shirts || shirts.length === 0) {
    return (
      <EmptyState
        icon={Shirt}
        title="No shirts found"
        description="Start building your collection by adding your first shirt!"
      />
    );
  }

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12"></TableHead>
            <SortableTableHead
              sortKey="teamName"
              currentSort={currentSort}
              onSortChange={onSortChange}
            >
              Team
            </SortableTableHead>
            <SortableTableHead
              sortKey="season"
              currentSort={currentSort}
              onSortChange={onSortChange}
            >
              Season
            </SortableTableHead>
            <TableHead>Type</TableHead>
            <TableHead>Brand</TableHead>
            <TableHead>Competition</TableHead>
            <TableHead>Size</TableHead>
            <TableHead>Color</TableHead>
            <TableHead>Condition</TableHead>
            <SortableTableHead
              sortKey="purchasePrice"
              currentSort={currentSort}
              onSortChange={onSortChange}
              className="text-right"
              align="right"
            >
              Price
            </SortableTableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shirts.map((shirt, index) => (
            <motion.tr
              key={shirt._id}
              onClick={() => handleRowClick(shirt._id)}
              className="cursor-pointer border-b transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50 data-[state=selected]:bg-slate-100 dark:data-[state=selected]:bg-slate-800"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
                delay: index * 0.03,
              }}
            >
              {/* Favorite */}
              <TableCell>
                <button
                  onClick={(e) => handleFavorite(e, shirt)}
                  className="hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full p-1 transition-colors"
                >
                  <Star
                    className={`w-4 h-4 ${
                      shirt.isFavorite
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-400 dark:text-slate-500"
                    }`}
                  />
                </button>
              </TableCell>

              {/* Team */}
              <TableCell className="font-medium dark:text-slate-100">
                {shirt.teamName}
              </TableCell>

              {/* Season */}
              <TableCell className="text-slate-600 dark:text-slate-400">
                {shirt.season}
              </TableCell>

              {/* Type */}
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {shirt.type}
                </Badge>
              </TableCell>

              {/* Brand */}
              <TableCell className="text-slate-600 dark:text-slate-400">
                {shirt.brand || "-"}
              </TableCell>

              {/* Competition */}
              <TableCell className="text-slate-600 dark:text-slate-400">
                {shirt.competition || "-"}
              </TableCell>

              {/* Size */}
              <TableCell className="text-slate-600 dark:text-slate-400">
                {shirt.size || "-"}
              </TableCell>

              {/* Color */}
              <TableCell>
                {shirt.color ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 rounded-full border border-slate-300 dark:border-slate-600 shrink-0"
                      style={{ backgroundColor: COLOR_HEX_MAP[shirt.color] || "#94a3b8" }}
                    />
                    <span className="text-xs text-slate-600 dark:text-slate-400 capitalize">
                      {shirt.color}
                    </span>
                  </div>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </TableCell>

              {/* Condition */}
              <TableCell>
                <Badge
                  variant="outline"
                  className="capitalize text-xs"
                >
                  {shirt.condition}
                </Badge>
              </TableCell>

              {/* Price */}
              <TableCell className="text-right">
                {shirt.purchasePrice > 0 ? (
                  <span className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(shirt.purchasePrice)}
                  </span>
                ) : (
                  <span className="text-slate-400">-</span>
                )}
              </TableCell>

              {/* Actions */}
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="h-8 w-8 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" side="bottom" sideOffset={4} className="w-44 p-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
                    <DropdownMenuHighlight className="inset-0 bg-slate-100 dark:bg-slate-800 rounded-md">
                      <DropdownMenuHighlightItem value="view">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(shirt._id);
                          }}
                          className="relative flex items-center gap-2 w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-slate-700 dark:text-slate-200 select-none"
                        >
                          <Eye className="h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                      </DropdownMenuHighlightItem>
                      <DropdownMenuHighlightItem value="edit">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(shirt._id);
                          }}
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteClick(e, shirt);
                          }}
                          className="relative flex items-center gap-2 w-full px-2.5 py-2 text-sm cursor-pointer rounded-md outline-none text-red-600 dark:text-red-400 select-none"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuHighlightItem>
                    </DropdownMenuHighlight>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </motion.tr>
          ))}
        </TableBody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete shirt?</AlertDialogTitle>
            <AlertDialogDescription>
              {shirtToDelete && (
                <>
                  Are you sure you want to delete <strong>{shirtToDelete.teamName}</strong> ({shirtToDelete.season})? This action cannot be undone.
                </>
              )}
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
    </div>
  );
};

export default ShirtDataTable;
