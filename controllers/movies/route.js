import express from "express";
import dbConnect from "../../utils/dbConnect.js";

const router = express.Router();


// GET all movies (public)
router.get("/movies", async (req, res) => {
  try {
    const movies = await dbConnect("movies");

    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Filters
    const filter = {};
    if (req.query.genre) filter.genre = req.query.genre;
    if (req.query.vendorId) filter.vendorId = req.query.vendorId;
    if (req.query.status) filter.status = req.query.status;

    const total = await movies.countDocuments(filter);

    const movieList = await movies
      .find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .toArray();

    return res.status(200).json({
      success: true,
      message: "Movies fetched successfully",
      data: movieList,
      meta: {
        total,
        page,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch movies",
    });
  }
});

export default router;