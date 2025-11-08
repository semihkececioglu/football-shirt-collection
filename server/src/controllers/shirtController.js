import Shirt from "../models/Shirt.js";
import cloudinary from "../config/cloudinary.js";

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "football-shirts",
        resource_type: "image",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

// Helper function to delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
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

    // Handle multiple image uploads
    if (req.files && req.files.length > 0) {
      const imageUrls = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );
      shirtData.images = imageUrls;
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
      type,
      season,
      condition,
      brand,
      isFavorite,
      sort = "-createdAt",
      page = 1,
      limit = 12,
    } = req.query;

    // Build filter
    const filter = { user: req.user.id };

    if (search) {
      filter.$or = [
        { teamName: { $regex: search, $options: "i" } },
        { playerName: { $regex: search, $options: "i" } },
        { competition: { $regex: search, $options: "i" } },
      ];
    }

    if (type) filter.type = type;
    if (season) filter.season = season;
    if (condition) filter.condition = condition;
    if (brand) filter.brand = { $regex: brand, $options: "i" };
    if (isFavorite === "true") filter.isFavorite = true;

    // Execute query with pagination
    const shirts = await Shirt.find(filter)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const count = await Shirt.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: shirts,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(count / limit),
        totalShirts: count,
        hasMore: page * limit < count,
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

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      // Delete old images from Cloudinary
      if (shirt.images && shirt.images.length > 0) {
        await Promise.all(
          shirt.images.map((imageUrl) => deleteFromCloudinary(imageUrl))
        );
      }

      // Upload new images
      const imageUrls = await Promise.all(
        req.files.map((file) => uploadToCloudinary(file.buffer))
      );
      req.body.images = imageUrls;
    }

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

    const [seasons, brands] = await Promise.all([
      Shirt.distinct("season", { user: userId }),
      Shirt.distinct("brand", { user: userId, brand: { $ne: "" } }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        seasons: seasons.sort().reverse(),
        brands: brands.sort(),
        types: ["home", "away", "third", "goalkeeper", "special"],
        conditions: ["mint", "excellent", "good", "fair", "poor"],
        sizes: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
