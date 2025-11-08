import { Heart, Edit, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useToggleFavorite, useDeleteShirt } from "@/hooks/useShirts";

const ShirtCard = ({ shirt }) => {
  const navigate = useNavigate();
  const toggleFavorite = useToggleFavorite();
  const deleteShirt = useDeleteShirt();

  const handleFavorite = (e) => {
    e.stopPropagation();
    toggleFavorite.mutate(shirt._id);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate(`/shirts/edit/${shirt._id}`);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this shirt?")) {
      deleteShirt.mutate(shirt._id);
    }
  };

  const handleCardClick = () => {
    navigate(`/shirts/${shirt._id}`);
  };

  const getConditionColor = (condition) => {
    const colors = {
      mint: "bg-green-100 text-green-800",
      excellent: "bg-blue-100 text-blue-800",
      good: "bg-yellow-100 text-yellow-800",
      fair: "bg-orange-100 text-orange-800",
      poor: "bg-red-100 text-red-800",
    };
    return colors[condition] || colors.good;
  };

  const getTypeColor = (type) => {
    const colors = {
      home: "bg-slate-100 text-slate-800",
      away: "bg-purple-100 text-purple-800",
      third: "bg-indigo-100 text-indigo-800",
      goalkeeper: "bg-pink-100 text-pink-800",
      special: "bg-amber-100 text-amber-800",
    };
    return colors[type] || colors.home;
  };

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
      onClick={handleCardClick}
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        {shirt.images && shirt.images.length > 0 ? (
          <img
            src={shirt.images[0]}
            alt={shirt.teamName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            <span className="text-6xl">⚽</span>
          </div>
        )}

        <button
          onClick={handleFavorite}
          className="absolute top-2 right-2 p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${
              shirt.isFavorite ? "fill-red-500 text-red-500" : "text-slate-600"
            }`}
          />
        </button>

        <div className="absolute bottom-2 left-2 flex gap-1">
          <Badge className={getTypeColor(shirt.type)}>{shirt.type}</Badge>
          <Badge className={getConditionColor(shirt.condition)}>
            {shirt.condition}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-bold text-lg mb-1 truncate">{shirt.teamName}</h3>
        <p className="text-sm text-slate-600 mb-2">{shirt.season}</p>

        {shirt.playerName && (
          <p className="text-sm text-slate-500 mb-2">
            {shirt.playerName} {shirt.playerNumber && `#${shirt.playerNumber}`}
          </p>
        )}

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm">
            {shirt.purchasePrice > 0 && (
              <span className="font-semibold text-green-600">
                ${shirt.purchasePrice}
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShirtCard;
