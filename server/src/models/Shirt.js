import mongoose from "mongoose";

const shirtSchema = new mongoose.Schema(
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
      maxlength: [100, "Team name cannot exceed 100 characters"],
    },
    clubLogo: {
      type: String,
      default: "",
    },
    season: {
      type: String,
      required: [true, "Please add season"],
      match: [
        /^\d{4}\/\d{2}$/,
        "Season must be in format YYYY/YY (e.g., 2023/24)",
      ],
    },
    type: {
      type: String,
      required: [true, "Please add shirt type"],
      enum: ["home", "away", "third", "goalkeeper", "special"],
      default: "home",
    },
    brand: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL", "XXXL", ""],
      default: "M",
    },
    condition: {
      type: String,
      required: [true, "Please add condition"],
      enum: ["mint", "excellent", "good", "fair", "poor"],
      default: "good",
    },
    playerName: {
      type: String,
      trim: true,
      default: "",
    },
    playerNumber: {
      type: Number,
      min: 0,
      max: 99,
    },
    competition: {
      type: String,
      trim: true,
      default: "",
    },
    signed: {
      type: Boolean,
      default: false,
    },
    matchWorn: {
      type: Boolean,
      default: false,
    },
    images: {
      type: [String],
      default: [],
    },
    purchaseDate: {
      type: Date,
      default: Date.now,
    },
    purchasePrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    currentValue: {
      type: Number,
      min: 0,
      default: 0,
    },
    purchaseLocation: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      maxlength: [500, "Notes cannot exceed 500 characters"],
      default: "",
    },
    tags: {
      type: [String],
      default: [],
    },
    isFavorite: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
shirtSchema.index({ user: 1, teamName: 1 });
shirtSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Shirt", shirtSchema);
