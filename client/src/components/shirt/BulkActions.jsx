import { useState } from "react";
import { Trash2, Star, Download, X } from "lucide-react";
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
import { useDeleteShirt, useToggleFavorite } from "@/hooks/useShirts";
import { toast } from "sonner";

const BulkActions = ({ selectedShirts, onClearSelection }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const deleteShirt = useDeleteShirt();
  const toggleFavorite = useToggleFavorite();

  const count = selectedShirts.length;

  const handleBulkDelete = async () => {
    try {
      await Promise.all(
        selectedShirts.map((id) => deleteShirt.mutateAsync(id))
      );
      toast.success(`${count} shirts deleted`);
      onClearSelection();
    } catch (error) {
      toast.error("Failed to delete some shirts");
    }
    setShowDeleteDialog(false);
  };

  const handleBulkFavorite = async () => {
    try {
      await Promise.all(
        selectedShirts.map((id) => toggleFavorite.mutateAsync(id))
      );
      toast.success(`${count} shirts updated`);
    } catch (error) {
      toast.error("Failed to update some shirts");
    }
  };

  const handleBulkExport = () => {
    // Export selected shirts
    toast("Export feature coming soon!");
  };

  if (count === 0) return null;

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-white dark:bg-slate-800 shadow-xl rounded-lg border dark:border-slate-700 p-4 flex items-center gap-4 z-50">
        <Badge variant="secondary">{count} selected</Badge>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleBulkFavorite}>
            <Star className="w-4 h-4 mr-2" />
            Favorite
          </Button>

          <Button variant="outline" size="sm" onClick={handleBulkExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>

        <Button variant="ghost" size="sm" onClick={onClearSelection}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {count} shirts?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected shirts and their images.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleBulkDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete {count} Shirts
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default BulkActions;
