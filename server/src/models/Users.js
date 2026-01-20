import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Reserved usernames that cannot be used
const RESERVED_USERNAMES = [
  "admin", "api", "profile", "settings", "login", "register", "logout",
  "dashboard", "collection", "wishlist", "statistics", "search", "user",
  "users", "account", "help", "support", "about", "contact", "terms",
  "privacy", "null", "undefined", "root", "system", "mod", "moderator"
];

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    username: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot be more than 20 characters"],
      match: [
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscores",
      ],
      validate: {
        validator: function(v) {
          return !RESERVED_USERNAMES.includes(v?.toLowerCase());
        },
        message: "This username is reserved and cannot be used"
      }
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
    },
    password: {
      type: String,
      required: function() {
        return this.authProvider === "local";
      },
      minlength: [6, "Password must be at least 6 characters"],
      select: false, // Don't return password in queries by default
    },
    avatar: {
      type: String,
      default: "",
    },
    // Authentication provider
    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    // Profile completion status (for Google auth users who need to set username)
    isProfileComplete: {
      type: Boolean,
      default: true,
    },
    // Future: Bio and social links can be easily added here
    // bio: { type: String, maxlength: 500, default: "" },
    // socialLinks: {
    //   twitter: { type: String, default: "" },
    //   instagram: { type: String, default: "" },
    //   facebook: { type: String, default: "" },
    // },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model("User", userSchema);
