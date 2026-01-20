import Shirt from "../models/Shirt.js";
import cloudinary from "../config/cloudinary.js";

// Helper function to escape regex special characters
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// Helper function to upload image to Cloudinary with optimization
const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "football-shirts",
        resource_type: "image",
        format: "webp",
        quality: "auto:good",
        transformation: [
          {
            width: 1200,
            height: 1200,
            crop: "limit",
          },
        ],
        eager: [
          {
            width: 400,
            height: 400,
            crop: "limit",
            format: "webp",
            quality: "auto:good",
          },
        ],
        eager_async: false, // Wait for thumbnail to be generated
      },
      (error, result) => {
        if (error) reject(error);
        else
          resolve({
            url: result.secure_url,
            thumbnail: result.eager?.[0]?.secure_url || result.secure_url,
          });
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Helper function to get image URL (handles both string and object formats)
const getImageUrl = (image) => {
  if (typeof image === "string") return image;
  return image?.url || image?.thumbnail || "";
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (image) => {
  try {
    const imageUrl = getImageUrl(image);
    if (!imageUrl) return;

    // Extract public ID from URL
    const publicId = imageUrl.split("/").slice(-2).join("/").split(".")[0];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
  }
};

// @desc    Create new shirt
// @route   POST /api/shirts
// @access  Private
export const createShirt = async (req, res) => {
  try {
    const shirtData = {
      ...req.body,
      user: req.user.id,
    };

    // Handle multiple image uploads with optimization
    if (req.files && req.files.length > 0) {
      const imageObjects = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );
      // imageObjects = [{ url: "...", thumbnail: "..." }, ...]
      shirtData.images = imageObjects;
    }

    const shirt = await Shirt.create(shirtData);

    res.status(201).json({
      success: true,
      data: shirt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get all shirts for logged in user
// @route   GET /api/shirts
// @access  Private
export const getShirts = async (req, res) => {
  try {
    const {
      search,
      team,
      type,
      season,
      condition,
      brand,
      competition,
      size,
      color,
      dateFrom,
      dateTo,
      isFavorite,
      signed,
      matchWorn,
      playerIssue,
      sort = "-createdAt",
      page = 1,
      limit = 10,
    } = req.query;

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build filter
    const filter = { user: req.user.id };

    // Search filter - escape special regex characters for security
    if (search) {
      const escapedSearch = escapeRegex(search);
      filter.$or = [
        { teamName: { $regex: escapedSearch, $options: "i" } },
        { playerName: { $regex: escapedSearch, $options: "i" } },
        { competition: { $regex: escapedSearch, $options: "i" } },
        { brand: { $regex: escapedSearch, $options: "i" } },
        { season: { $regex: escapedSearch, $options: "i" } },
        { size: { $regex: escapedSearch, $options: "i" } },
        { tags: { $regex: escapedSearch, $options: "i" } },
      ];
    }

    // Filters - support both single value and comma-separated arrays
    if (team) {
      const teams = team.split(",");
      filter.teamName = teams.length > 1 ? { $in: teams } : team;
    }

    if (type) {
      const types = type.split(",");
      filter.type = types.length > 1 ? { $in: types } : type;
    }

    if (season) {
      const seasons = season.split(",");
      filter.season = seasons.length > 1 ? { $in: seasons } : season;
    }

    if (condition) {
      const conditions = condition.split(",");
      filter.condition = conditions.length > 1 ? { $in: conditions } : condition;
    }

    if (brand) {
      const brands = brand.split(",");
      filter.brand = brands.length > 1 ? { $in: brands } : brand;
    }

    if (competition) {
      const competitions = competition.split(",");
      filter.competition = competitions.length > 1 ? { $in: competitions } : competition;
    }

    if (size) {
      const sizes = size.split(",");
      filter.size = sizes.length > 1 ? { $in: sizes } : size;
    }

    if (color) {
      const colors = color.split(",");
      filter.color = colors.length > 1 ? { $in: colors } : color;
    }

    // Date range filter
    if (dateFrom || dateTo) {
      filter.purchaseDate = {};
      if (dateFrom) {
        filter.purchaseDate.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        // Add one day to include the entire end date
        const endDate = new Date(dateTo);
        endDate.setDate(endDate.getDate() + 1);
        filter.purchaseDate.$lt = endDate;
      }
    }

    // Boolean filters
    if (isFavorite === "true") {
      filter.isFavorite = true;
    }

    if (signed === "true") {
      filter.signed = true;
    }

    if (matchWorn === "true") {
      filter.matchWorn = true;
    }

    if (playerIssue === "true") {
      filter.playerIssue = true;
    }

    // Execute query with pagination
    const shirts = await Shirt.find(filter)
      .sort(sort)
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .lean();

    // Get total count for pagination
    const count = await Shirt.countDocuments(filter);

    console.log("✅ Query returned:", count, "total shirts,", shirts.length, "on this page");

    res.status(200).json({
      success: true,
      data: shirts,
      pagination: {
        currentPage: pageNum,
        totalPages: Math.ceil(count / limitNum),
        totalShirts: count,
        hasMore: pageNum * limitNum < count,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single shirt
// @route   GET /api/shirts/:id
// @access  Private
export const getShirtById = async (req, res) => {
  try {
    const shirt = await Shirt.findById(req.params.id);

    if (!shirt) {
      return res.status(404).json({
        success: false,
        message: "Shirt not found",
      });
    }

    // Check if user owns this shirt
    if (shirt.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to access this shirt",
      });
    }

    res.status(200).json({
      success: true,
      data: shirt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update shirt
// @route   PUT /api/shirts/:id
// @access  Private
export const updateShirt = async (req, res) => {
  try {
    let shirt = await Shirt.findById(req.params.id);

    if (!shirt) {
      return res.status(404).json({
        success: false,
        message: "Shirt not found",
      });
    }

    // Check if user owns this shirt
    if (shirt.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this shirt",
      });
    }

    // Handle image updates
    // keepImages: array of existing images to keep (can be strings or objects)
    const keepImages = req.body.keepImages ? JSON.parse(req.body.keepImages) : [];

    // Find images to delete (existing images NOT in keepImages array)
    // Compare using URL to handle both string and object formats
    const keepUrls = keepImages.map((img) => getImageUrl(img));
    const imagesToDelete = shirt.images.filter((image) => {
      const imageUrl = getImageUrl(image);
      return !keepUrls.includes(imageUrl);
    });

    // Delete removed images from Cloudinary
    if (imagesToDelete.length > 0) {
      await Promise.all(
        imagesToDelete.map((image) => deleteFromCloudinary(image))
      );
    }

    // Upload new images if any (returns optimized { url, thumbnail } objects)
    let newImageObjects = [];
    if (req.files && req.files.length > 0) {
      newImageObjects = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );
    }

    // Merge kept images with newly uploaded images
    const finalImages = [...keepImages, ...newImageObjects];
    req.body.images = finalImages;

    shirt = await Shirt.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: shirt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete shirt
// @route   DELETE /api/shirts/:id
// @access  Private
export const deleteShirt = async (req, res) => {
  try {
    const shirt = await Shirt.findById(req.params.id);

    if (!shirt) {
      return res.status(404).json({
        success: false,
        message: "Shirt not found",
      });
    }

    // Check if user owns this shirt
    if (shirt.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this shirt",
      });
    }

    // Delete images from Cloudinary
    if (shirt.images && shirt.images.length > 0) {
      await Promise.all(
        shirt.images.map((imageUrl) => deleteFromCloudinary(imageUrl))
      );
    }

    await shirt.deleteOne();

    res.status(200).json({
      success: true,
      message: "Shirt deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Toggle favorite status
// @route   PATCH /api/shirts/:id/favorite
// @access  Private
export const toggleFavorite = async (req, res) => {
  try {
    const shirt = await Shirt.findById(req.params.id);

    if (!shirt) {
      return res.status(404).json({
        success: false,
        message: "Shirt not found",
      });
    }

    // Check if user owns this shirt
    if (shirt.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    shirt.isFavorite = !shirt.isFavorite;
    await shirt.save();

    res.status(200).json({
      success: true,
      data: shirt,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get unique values for filters
// @route   GET /api/shirts/filters/options
// @access  Private
export const getFilterOptions = async (req, res) => {
  try {
    const userId = req.user.id;

    const [seasons, brands, teamNames, competitions, sizes, locations, tags, types, conditions, colors] = await Promise.all([
      Shirt.distinct("season", { user: userId }),
      Shirt.distinct("brand", { user: userId, brand: { $ne: "" } }),
      Shirt.distinct("teamName", { user: userId }),
      Shirt.distinct("competition", { user: userId, competition: { $ne: "" } }),
      Shirt.distinct("size", { user: userId, size: { $ne: "" } }),
      Shirt.distinct("purchaseLocation", { user: userId, purchaseLocation: { $ne: "" } }),
      Shirt.distinct("tags", { user: userId }),
      Shirt.distinct("type", { user: userId, type: { $ne: "" } }),
      Shirt.distinct("condition", { user: userId, condition: { $ne: "" } }),
      Shirt.distinct("color", { user: userId, color: { $ne: "" } }),
    ]);

    // Define the order for types and conditions
    const typeOrder = ["home", "away", "third", "fourth", "fifth", "goalkeeper", "special", "anniversary"];
    const conditionOrder = ["brandNewTags", "brandNew", "mint", "excellent", "good", "fair", "poor"];

    // Sort types and conditions by predefined order
    const sortedTypes = types.sort((a, b) => typeOrder.indexOf(a) - typeOrder.indexOf(b));
    const sortedConditions = conditions.sort((a, b) => conditionOrder.indexOf(a) - conditionOrder.indexOf(b));

    res.status(200).json({
      success: true,
      data: {
        seasons: seasons.sort().reverse(),
        brands: brands.sort(),
        teamNames: teamNames.sort(),
        competitions: competitions.sort(),
        sizes: sizes.sort(),
        locations: locations.sort(),
        tags: tags.sort(),
        types: sortedTypes,
        conditions: sortedConditions,
        colors: colors.sort(),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
