
import dbConnect from "../../utils/dbConnect.js";
import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

router.get("/me", async (req, res) => {
    const users = await dbConnect("users");
    try {
        const user = await users.findOne(
            { _id: new ObjectId(req.user.id) },
            { projection: { password: 0 } }
        );

        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

export default router