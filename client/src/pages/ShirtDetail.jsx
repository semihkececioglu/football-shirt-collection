import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Heart,
  Calendar,
  DollarSign,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/Navbar";
import { useShirt, useDeleteShirt, useToggleFavorite } from "@/hooks/useShirts";

const ShirtDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useShirt(id);
  const deleteShirt = useDeleteShirt();
  const toggleFavorite = useToggleFavorite();

  const [selectedImage, setSelectedImage] = useState(0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading shirt...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold">Shirt not found</h2>
          <Button onClick={() => navigate("/collection")} className="mt-4">
            Back to Collection
          </Button>
        </div>
      </div>
    );
  }

  const shirt = data.data;
  const images =
    shirt.images && shirt.images.length > 0
      ? shirt.images
      : ["https://via.placeholder.com/600x800?text=No+Image"];

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this shirt?")) {
      try {
        await deleteShirt.mutateAsync(id);
        navigate("/collection");
      } catch (error) {
        console.error("Error deleting shirt:", error);
      }
    }
  };

  const handleToggleFavorite = async () => {
    try {
      await toggleFavorite.mutateAsync(id);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
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
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Button variant="ghost" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
              >
                <Heart
                  className={`w-4 h-4 ${
                    shirt.isFavorite ? "fill-red-500 text-red-500" : ""
                  }`}
                />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/shirts/edit/${id}`)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button variant="outline" onClick={handleDelete}>
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-[3/4] bg-white rounded-lg overflow-hidden shadow-lg">
              <img
                src={images[selectedImage]}
                alt={shirt.teamName}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                      selectedImage === index
                        ? "border-slate-900"
                        : "border-slate-200 hover:border-slate-400"
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${shirt.teamName} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">
                {shirt.teamName}
              </h1>
              <div className="flex gap-2 mb-4">
                <Badge className={getTypeColor(shirt.type)}>{shirt.type}</Badge>
                <Badge className={getConditionColor(shirt.condition)}>
                  {shirt.condition}
                </Badge>
                {shirt.signed && <Badge variant="outline">Signed</Badge>}
                {shirt.matchWorn && <Badge variant="outline">Match Worn</Badge>}
              </div>
              <p className="text-lg text-slate-600">{shirt.season}</p>
            </div>

            {/* Player Info */}
            {(shirt.playerName || shirt.playerNumber) && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Player</h3>
                <p className="text-lg">
                  {shirt.playerName}
                  {shirt.playerNumber && ` #${shirt.playerNumber}`}
                </p>
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-4">
              {shirt.brand && (
                <div>
                  <p className="text-sm text-slate-600">Brand</p>
                  <p className="font-semibold">{shirt.brand}</p>
                </div>
              )}
              {shirt.size && (
                <div>
                  <p className="text-sm text-slate-600">Size</p>
                  <p className="font-semibold">{shirt.size}</p>
                </div>
              )}
              {shirt.competition && (
                <div className="col-span-2">
                  <p className="text-sm text-slate-600">Competition</p>
                  <p className="font-semibold">{shirt.competition}</p>
                </div>
              )}
            </div>

            {/* Financial Info */}
            {(shirt.purchasePrice > 0 || shirt.currentValue > 0) && (
              <div className="bg-green-50 rounded-lg p-4 space-y-3">
                <h3 className="font-semibold flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  Value Information
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {shirt.purchasePrice > 0 && (
                    <div>
                      <p className="text-sm text-slate-600">Purchase Price</p>
                      <p className="text-xl font-bold text-green-600">
                        ${shirt.purchasePrice}
                      </p>
                    </div>
                  )}
                  {shirt.currentValue > 0 && (
                    <div>
                      <p className="text-sm text-slate-600">Current Value</p>
                      <p className="text-xl font-bold text-green-600">
                        ${shirt.currentValue}
                      </p>
                    </div>
                  )}
                </div>
                {shirt.purchasePrice > 0 && shirt.currentValue > 0 && (
                  <div>
                    <p className="text-sm text-slate-600">Value Change</p>
                    <p
                      className={`text-lg font-semibold ${
                        shirt.currentValue >= shirt.purchasePrice
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {shirt.currentValue >= shirt.purchasePrice ? "+" : ""}$
                      {(shirt.currentValue - shirt.purchasePrice).toFixed(2)} (
                      {(
                        ((shirt.currentValue - shirt.purchasePrice) /
                          shirt.purchasePrice) *
                        100
                      ).toFixed(1)}
                      %)
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Purchase Info */}
            {(shirt.purchaseDate || shirt.purchaseLocation) && (
              <div className="space-y-3">
                <h3 className="font-semibold">Purchase Information</h3>
                {shirt.purchaseDate && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <Calendar className="w-4 h-4" />
                    <span>
                      {new Date(shirt.purchaseDate).toLocaleDateString()}
                    </span>
                  </div>
                )}
                {shirt.purchaseLocation && (
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPin className="w-4 h-4" />
                    <span>{shirt.purchaseLocation}</span>
                  </div>
                )}
              </div>
            )}

            {/* Notes */}
            {shirt.notes && (
              <div className="bg-slate-50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Notes</h3>
                <p className="text-slate-700 whitespace-pre-wrap">
                  {shirt.notes}
                </p>
              </div>
            )}

            {/* Tags */}
            {shirt.tags && shirt.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {shirt.tags.map((tag, index) => (
                    <Badge key={index} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Timestamps */}
            <div className="text-sm text-slate-500 pt-4 border-t border-slate-200">
              <p>Added: {new Date(shirt.createdAt).toLocaleDateString()}</p>
              {shirt.updatedAt && (
                <p>
                  Last updated: {new Date(shirt.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ShirtDetail;
