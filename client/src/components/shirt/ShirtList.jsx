import { useNavigate } from "react-router-dom";
import { Star, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToggleFavorite, useDeleteShirt } from "@/hooks/useShirts";
import LoadingSpinner from "../common/LoadingSpinner";
import EmptyState from "../common/EmptyState";

const ShirtList = ({ shirts, isLoading }) => {
  const navigate = useNavigate();
  const toggleFavorite = useToggleFavorite();
  const deleteShirt = useDeleteShirt();

  const handleFavorite = (e, id) => {
    e.stopPropagation();
    toggleFavorite.mutate(id);
  };

  const handleEdit = (e, id) => {
    e.stopPropagation();
    navigate(`/collection/${id}/edit`);
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this shirt?")) {
      deleteShirt.mutate(id);
    }
  };

  const getConditionColor = (condition) => {
    const colors = {
      mint: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      excellent:
        "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      good: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      fair: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      poor: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };
    return colors[condition] || colors.good;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!shirts || shirts.length === 0) {
    return (
      <EmptyState
        icon="⚽"
        title="No shirts found"
        description="Try adjusting your filters or search terms"
      />
    );
  }

  return (
    <div className="space-y-4">
      {shirts.map((shirt) => (
        <Card
          key={shirt._id}
          className="hover:shadow-lg transition cursor-pointer"
          onClick={() => navigate(`/collection/${shirt._id}`)}
        >
          <CardContent className="p-4">
            <div className="flex gap-4">
              {/* Image */}
              <div className="w-24 h-32 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                {shirt.images && shirt.images[0] ? (
                  <img
                    src={shirt.images[0]}
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

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg truncate dark:text-slate-100">
                      {shirt.teamName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {shirt.season}
                      </span>
                      <Badge variant="outline">{shirt.type}</Badge>
                      <Badge className={getConditionColor(shirt.condition)}>
                        {shirt.condition}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => handleFavorite(e, shirt._id)}
                  >
                    <Star
                      className={`w-5 h-5 ${
                        shirt.isFavorite
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-600 dark:text-slate-400"
                      }`}
                    />
                  </Button>
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-2 gap-4 mt-3">
                  {shirt.brand && (
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Brand
                      </p>
                      <p className="text-sm font-medium dark:text-slate-200">
                        {shirt.brand}
                      </p>
                    </div>
                  )}
                  {shirt.size && (
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Size
                      </p>
                      <p className="text-sm font-medium dark:text-slate-200">
                        {shirt.size}
                      </p>
                    </div>
                  )}
                  {shirt.playerName && (
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Player
                      </p>
                      <p className="text-sm font-medium dark:text-slate-200">
                        {shirt.playerName}{" "}
                        {shirt.playerNumber && `#${shirt.playerNumber}`}
                      </p>
                    </div>
                  )}
                  {shirt.purchasePrice > 0 && (
                    <div>
                      <p className="text-xs text-slate-600 dark:text-slate-400">
                        Purchase Price
                      </p>
                      <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                        ${shirt.purchasePrice}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleEdit(e, shirt._id)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => handleDelete(e, shirt._id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ShirtList;
