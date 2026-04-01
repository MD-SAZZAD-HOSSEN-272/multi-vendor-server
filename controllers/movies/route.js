import express from "express";
import dbConnect from "../../utils/dbConnect.js";

const router = express.Router();

// GET all movies (public)
router.get("/movies", async (req, res) => {
  try {
    const movies = await dbConnect("movies");
    // pagination
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // query params
    const { genre, vendorId, status, search, sortBy, order } = req.query;
console.log(genre);
    // filter
    const filter = {};

    if (genre) filter.genre = genre.toLowerCase();
    if (vendorId) filter.vendorId = vendorId;
    if (status) filter.status = status;

    // 🔍 search by title (case insensitive)
    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    // 🔽 sorting
    let sortOption = { createdAt: -1 }; // default latest

    if (sortBy === "price") {
      sortOption = { price: order === "asc" ? 1 : -1 };
    }

    if (sortBy === "date") {
      sortOption = { createdAt: order === "asc" ? 1 : -1 };
    }

    // total count
    const total = await movies.countDocuments(filter);

    // query execution
    const movieList = await movies
      .find(filter, {
        projection: {
          title: 1,
          genre: 1,
          price: 1,
          thumbnail: 1,
          vendorId: 1,
          createdAt: 1,
        },
      })
      .sort(sortOption)
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
        limit,
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

router.get("/movies/:id", async (req, res) => {
  try {
    const movies = await dbConnect("movies");
    const movieId = req.params.id;

    const movie = await movies.findOne({ _id: new ObjectId(movieId) });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Movie fetched successfully",
      data: movie,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch movie",
    });
  }
});

export default router;