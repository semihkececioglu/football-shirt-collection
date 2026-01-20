import Shirt from "../models/Shirt.js";

// @desc    Get overview statistics
// @route   GET /api/stats/overview
// @access  Private
export const getOverviewStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total shirts count
    const totalShirts = await Shirt.countDocuments({ user: userId });

    // Total investment
    const investmentResult = await Shirt.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          totalInvestment: { $sum: "$purchasePrice" },
          totalCurrentValue: { $sum: "$currentValue" },
          avgPurchasePrice: { $avg: "$purchasePrice" },
        },
      },
    ]);

    const stats = investmentResult[0] || {
      totalInvestment: 0,
      totalCurrentValue: 0,
      avgPurchasePrice: 0,
    };

    // Favorites count
    const favoritesCount = await Shirt.countDocuments({
      user: userId,
      isFavorite: true,
    });

    // Most valuable shirt
    const mostValuable = await Shirt.findOne({ user: userId })
      .sort("-currentValue")
      .select("teamName currentValue season images");

    // Unique counts
    const uniqueTeams = await Shirt.distinct("teamName", { user: userId });
    const uniqueCompetitions = await Shirt.distinct("competition", {
      user: userId,
      competition: { $ne: null, $ne: "" },
    });
    const uniqueBrands = await Shirt.distinct("brand", { user: userId });
    const uniqueColors = await Shirt.distinct("color", {
      user: userId,
      color: { $ne: null, $ne: "" },
    });

    res.status(200).json({
      success: true,
      data: {
        totalShirts,
        totalInvestment: stats.totalInvestment || 0,
        totalCurrentValue: stats.totalCurrentValue || 0,
        avgPurchasePrice: stats.avgPurchasePrice || 0,
        valueChange:
          (stats.totalCurrentValue || 0) - (stats.totalInvestment || 0),
        valueChangePercent:
          stats.totalInvestment > 0
            ? (
                ((stats.totalCurrentValue - stats.totalInvestment) /
                  stats.totalInvestment) *
                100
              ).toFixed(2)
            : 0,
        favoritesCount,
        mostValuable,
        totalUniqueTeams: uniqueTeams.length,
        totalUniqueCompetitions: uniqueCompetitions.length,
        totalUniqueBrands: uniqueBrands.length,
        totalUniqueColors: uniqueColors.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get shirts by type distribution
// @route   GET /api/stats/by-type
// @access  Private
export const getByTypeStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await Shirt.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$type",
          count: { $sum: 1 },
          totalValue: { $sum: "$currentValue" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get shirts by season timeline
// @route   GET /api/stats/by-season
// @access  Private
export const getBySeasonStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await Shirt.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$season",
          count: { $sum: 1 },
          totalValue: { $sum: "$currentValue" },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get shirts by brand
// @route   GET /api/stats/by-brand
// @access  Private
export const getByBrandStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await Shirt.aggregate([
      { $match: { user: userId, brand: { $ne: "" } } },
      {
        $group: {
          _id: "$brand",
          count: { $sum: 1 },
          totalValue: { $sum: "$currentValue" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get shirts by condition
// @route   GET /api/stats/by-condition
// @access  Private
export const getByConditionStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await Shirt.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$condition",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get recent shirts
// @route   GET /api/stats/recent
// @access  Private
export const getRecentShirts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const userId = req.user._id;

    const shirts = await Shirt.find({ user: userId })
      .sort("-createdAt")
      .limit(limit)
      .select("teamName season type images createdAt purchasePrice");

    res.status(200).json({
      success: true,
      data: shirts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get most valuable shirts
// @route   GET /api/stats/most-valuable
// @access  Private
export const getMostValuableShirts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const userId = req.user._id;

    const shirts = await Shirt.find({
      user: userId,
      currentValue: { $gt: 0 },
    })
      .sort("-currentValue")
      .limit(limit)
      .select("teamName season type images currentValue purchasePrice");

    res.status(200).json({
      success: true,
      data: shirts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get shirts by competition
// @route   GET /api/stats/by-competition
// @access  Private
export const getByCompetitionStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await Shirt.aggregate([
      { $match: { user: userId, competition: { $ne: null, $ne: "" } } },
      {
        $group: {
          _id: "$competition",
          count: { $sum: 1 },
          totalValue: { $sum: "$currentValue" },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get shirts by size
// @route   GET /api/stats/by-size
// @access  Private
export const getBySizeStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const stats = await Shirt.aggregate([
      { $match: { user: userId, size: { $ne: null, $ne: "" } } },
      {
        $group: {
          _id: "$size",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Get most collected teams
// @route   GET /api/stats/most-teams
// @access  Private
export const getMostTeamsStats = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user._id;

    const stats = await Shirt.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$teamName",
          count: { $sum: 1 },
          totalValue: { $sum: "$currentValue" },
          seasons: { $addToSet: "$season" },
        },
      },
      { $sort: { count: -1 } },
      { $limit: limit },
    ]);

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc    Export all shirts data
// @route   GET /api/stats/export
// @access  Private
export const exportAllShirts = async (req, res) => {
  try {
    const userId = req.user._id;

    const shirts = await Shirt.find({ user: userId })
      .select(
        "teamName season type brand size condition competition purchasePrice currentValue purchaseLocation playerName playerNumber signed matchWorn notes"
      )
      .lean();

    res.status(200).json({
      success: true,
      data: shirts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
