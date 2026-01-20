import Wishlist from "../models/Wishlist.js";

// @desc    Get all wishlist items for user
// @route   GET /api/wishlist
// @access  Private
export const getWishlist = async (req, res) => {
  try {
    const { sort = "-createdAt" } = req.query;

    const items = await Wishlist.find({ user: req.user.id }).sort(sort).lean();

    res.status(200).json({
      success: true,
      data: items,
      count: items.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get single wishlist item
// @route   GET /api/wishlist/:id
// @access  Private
export const getWishlistItem = async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    // Check if user owns this item
    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Create wishlist item
// @route   POST /api/wishlist
// @access  Private
export const createWishlistItem = async (req, res) => {
  try {
    const itemData = {
      ...req.body,
      user: req.user.id,
    };

    const item = await Wishlist.create(itemData);

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Update wishlist item
// @route   PUT /api/wishlist/:id
// @access  Private
export const updateWishlistItem = async (req, res) => {
  try {
    let item = await Wishlist.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    // Check if user owns this item
    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    item = await Wishlist.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: item,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Delete wishlist item
// @route   DELETE /api/wishlist/:id
// @access  Private
export const deleteWishlistItem = async (req, res) => {
  try {
    const item = await Wishlist.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Wishlist item not found",
      });
    }

    // Check if user owns this item
    if (item.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await item.deleteOne();

    res.status(200).json({
      success: true,
      message: "Wishlist item deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
