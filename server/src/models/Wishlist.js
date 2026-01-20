import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    teamName: {
      type: String,
      required: [true, "Please add team name"],
      trim: true,
    },
    season: {
      type: String,
      trim: true,
    },
    type: {
      type: String,
      enum: ["home", "away", "third", "fourth", "fifth", "goalkeeper", "special", "anniversary", "any"],
      default: "any",
    },
    brand: {
      type: String,
      required: [true, "Please add brand"],
      trim: true,
    },
    competition: {
      type: String,
      required: [true, "Please add competition"],
      trim: true,
    },
    size: {
      type: String,
      required: [true, "Please add size"],
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", "+4XL"],
      trim: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    maxBudget: {
      type: Number,
      min: 0,
      default: 0,
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
wishlistSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Wishlist", wishlistSchema);
