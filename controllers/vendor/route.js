import express from "express";
import dbConnect from "../../utils/dbConnect.js";
import { ObjectId } from "mongodb";

const router = express.Router();


// post movie
router.post("/movies", async (req, res) => {
    try {
        const movies = await dbConnect("movies");
        req.body.genre = req.body.genre.toLowerCase();
        const {
            title,
            description,
            genre,
            price,
            rentalPrice,
            releaseDate,
            thumbnail,
            images,
        } = req.body;
        
        console.log(req.body);

        // basic validation
        if (!title || !price || !genre) {
            return res.status(400).json({
                success: false,
                message: "Title, genre and price are required",
            });
        }

        const newMovie = {
            vendorId: req.user.id, // 🔥 ownership boundary
            title,
            description: description || "",
            genre,
            price: Number(price),
            rentalPrice: Number(rentalPrice) || 0,
            releaseDate: releaseDate || null,
            thumbnail: thumbnail || "",
            status: "published",
            createdAt: new Date(),
            images: images || [],
        };

        const result = await movies.insertOne(newMovie);

        return res.status(201).json({
            success: true,
            message: "Movie created successfully",
            data: {
                id: result.insertedId,
                ...newMovie,
            },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create movie",
        });
    }
}
);


// get movie
router.get("/movies", async (req, res) => {
    try {
        const movies = await dbConnect("movies");

        const vendorMovies = await movies
            .find({ vendorId: req.user.id })
            .sort({ createdAt: -1 })
            .toArray();

        return res.status(200).json({
            success: true,
            message: "Vendor movies fetched successfully",
            data: vendorMovies,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch vendor movies",
        });
    }
}
);


// Update movie
router.patch("/movies/:id", async (req, res) => {
  try {
    const movies = await dbConnect("movies");
    const movieId = req.params.id;
    const vendorId = req.user.id;


    const movie = await movies.findOne({ _id: new ObjectId(movieId), vendorId });

    if (!movie) {
      return res.status(404).json({
        success: false,
        message: "Movie not found or you don't have permission",
      });
    }

    // fields to update
    const { title, description, genre, price, rentalPrice, releaseDate, thumbnail, status } = req.body;

    const updatedData = {};
    if (title) updatedData.title = title;
    if (description) updatedData.description = description;
    if (genre) updatedData.genre = genre;
    if (price !== undefined) updatedData.price = Number(price);
    if (rentalPrice !== undefined) updatedData.rentalPrice = Number(rentalPrice);
    if (releaseDate) updatedData.releaseDate = releaseDate;
    if (thumbnail) updatedData.thumbnail = thumbnail;
    if (status) updatedData.status = status;

    await movies.updateOne({ _id: new ObjectId(movieId), vendorId }, { $set: updatedData });

    return res.status(200).json({
      success: true,
      message: "Movie updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update movie",
    });
  }
});


// Delete movie
router.delete("/movies/:id", async (req, res) => {
  try {
    const movies = await dbConnect("movies");
    const movieId = req.params.id;
    const vendorId = req.user.id;

    const result = await movies.deleteOne({ _id: new ObjectId(movieId), vendorId });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Movie not found or you don't have permission",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Movie deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete movie",
    });
  }
});



export default router;