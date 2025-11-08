import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import Navbar from "@/components/layout/Navbar";
import { useShirt, useUpdateShirt } from "@/hooks/useShirts";
import { toast } from "react-hot-toast";

const EditShirt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useShirt(id);
  const updateShirt = useUpdateShirt();

  const [formData, setFormData] = useState({});
  const [newImages, setNewImages] = useState([]);
  const [newPreviews, setNewPreviews] = useState([]);
  const [keepExistingImages, setKeepExistingImages] = useState(true);

  useEffect(() => {
    if (data?.data) {
      const shirt = data.data;
      setFormData({
        teamName: shirt.teamName || "",
        season: shirt.season || "",
        type: shirt.type || "home",
        brand: shirt.brand || "",
        size: shirt.size || "M",
        condition: shirt.condition || "good",
        playerName: shirt.playerName || "",
        playerNumber: shirt.playerNumber || "",
        competition: shirt.competition || "",
        signed: shirt.signed || false,
        matchWorn: shirt.matchWorn || false,
        purchaseDate: shirt.purchaseDate
          ? new Date(shirt.purchaseDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        purchasePrice: shirt.purchasePrice || "",
        currentValue: shirt.currentValue || "",
        purchaseLocation: shirt.purchaseLocation || "",
        notes: shirt.notes || "",
      });
    }
  }, [data]);

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setNewImages(files);
    setKeepExistingImages(false);

    // Create previews
    const previews = [];
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        previews.push(reader.result);
        if (previews.length === files.length) {
          setNewPreviews(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
    setNewPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append all form fields
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== "") {
        data.append(key, formData[key]);
      }
    });

    // Append new images if any
    if (newImages.length > 0) {
      newImages.forEach((image) => {
        data.append("images", image);
      });
    }

    try {
      await updateShirt.mutateAsync({ id, formData: data });
      navigate(`/shirts/${id}`);
    } catch (error) {
      console.error("Error updating shirt:", error);
    }
  };

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

  const existingImages = data?.data?.images || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mr-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-bold">Edit Shirt</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-lg shadow-sm p-6 space-y-6"
        >
          {/* Current Images */}
          {existingImages.length > 0 && keepExistingImages && (
            <div className="space-y-2">
              <Label>Current Images</Label>
              <div className="grid grid-cols-5 gap-4">
                {existingImages.map((img, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={img}
                      alt={`Current ${index + 1}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600">
                Upload new images to replace these
              </p>
            </div>
          )}

          {/* New Image Upload */}
          <div className="space-y-4">
            <Label>
              {keepExistingImages
                ? "Upload New Images (Optional)"
                : "New Images"}
            </Label>

            <div className="grid grid-cols-5 gap-4">
              {newPreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeNewImage(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {newImages.length < 5 && (
                <label className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-slate-400 transition">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Upload className="w-8 h-8 text-slate-400" />
                </label>
              )}
            </div>
          </div>

          {/* Rest of the form - same as AddShirt */}
          <div className="space-y-2">
            <Label htmlFor="teamName">Team Name *</Label>
            <Input
              id="teamName"
              value={formData.teamName}
              onChange={(e) => handleChange("teamName", e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="season">Season *</Label>
              <Input
                id="season"
                placeholder="2023/24"
                value={formData.season}
                onChange={(e) => handleChange("season", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home">Home</SelectItem>
                  <SelectItem value="away">Away</SelectItem>
                  <SelectItem value="third">Third</SelectItem>
                  <SelectItem value="goalkeeper">Goalkeeper</SelectItem>
                  <SelectItem value="special">Special</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => handleChange("brand", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Select
                value={formData.size}
                onValueChange={(value) => handleChange("size", value)}
              >
                <SelectTrigger>
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
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="condition">Condition</Label>
            <Select
              value={formData.condition}
              onValueChange={(value) => handleChange("condition", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mint">Mint</SelectItem>
                <SelectItem value="excellent">Excellent</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="fair">Fair</SelectItem>
                <SelectItem value="poor">Poor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="playerName">Player Name</Label>
              <Input
                id="playerName"
                value={formData.playerName}
                onChange={(e) => handleChange("playerName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="playerNumber">Player Number</Label>
              <Input
                id="playerNumber"
                type="number"
                value={formData.playerNumber}
                onChange={(e) => handleChange("playerNumber", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="competition">Competition</Label>
            <Input
              id="competition"
              placeholder="Premier League, Champions League, etc."
              value={formData.competition}
              onChange={(e) => handleChange("competition", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate}
                onChange={(e) => handleChange("purchaseDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
              <Input
                id="purchasePrice"
                type="number"
                value={formData.purchasePrice}
                onChange={(e) => handleChange("purchasePrice", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentValue">Current Value ($)</Label>
              <Input
                id="currentValue"
                type="number"
                value={formData.currentValue}
                onChange={(e) => handleChange("currentValue", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="purchaseLocation">Purchase Location</Label>
            <Input
              id="purchaseLocation"
              value={formData.purchaseLocation}
              onChange={(e) => handleChange("purchaseLocation", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              rows={3}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateShirt.isPending}
              className="flex-1"
            >
              {updateShirt.isPending ? "Updating..." : "Update Shirt"}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
};

export default EditShirt;
