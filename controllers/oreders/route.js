import express from "express";
import dbConnect from "../../utils/dbConnect.js";
import { ObjectId } from "mongodb";

const router = express.Router();

// post order
router.post("/orders", async (req, res) => {
    try {
        const orders = await dbConnect("orders");
        const movies = await dbConnect("movies");

        const { movieId, orderType } = req.body; // orderType = "rent" or "purchase"
        const userId = req.user.id;

        if (!movieId || !orderType) {
            return res.status(400).json({
                success: false,
                message: "movieId and orderType are required",
            });
        }


        const movie = await movies.findOne({ _id: new ObjectId(movieId) });

        if (!movie) {
            return res.status(404).json({
                success: false,
                message: "Movie not found",
            });
        }

        const amount = orderType === "rent" ? movie.rentalPrice : movie.price;

        const newOrder = {
            userId,
            vendorId: movie.vendorId,
            movieId: movie._id,
            orderType,
            amount,
            status: "completed", // or "pending" if you want
            createdAt: new Date(),
        };

        const result = await orders.insertOne(newOrder);

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: { id: result.insertedId, ...newOrder },
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to create order",
        });
    }
});

//get order
router.get("/orders", async (req, res) => {
    try {
        const orders = await dbConnect("orders");

        const userOrders = await orders
            .find({ userId: req.user.id })
            .sort({ createdAt: -1 })
            .toArray();

        return res.status(200).json({
            success: true,
            message: "User orders fetched successfully",
            data: userOrders,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user orders",
        });
    }
}
);


export default router;