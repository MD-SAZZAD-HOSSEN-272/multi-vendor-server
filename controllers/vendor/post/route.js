import express from "express";
import dbConnect from "../../../utils/dbConnect.js";

const router = express.Router();

router.post("/movies", async (req, res) => {
        try {
            const movies = await dbConnect("movies");

            const {
                title,
                description,
                genre,
                price,
                rentalPrice,
                releaseDate,
                thumbnail,
            } = req.body;

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

export default router;