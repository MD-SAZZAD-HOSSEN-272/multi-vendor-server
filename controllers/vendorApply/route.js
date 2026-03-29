import express from "express";
import dbConnect from "../../utils/dbConnect.js";

const router = express.Router();

router.post("/vendors", async (req, res) => {
    try {
        const vendors = await dbConnect("vendors");
        const { userId, name, email, description, companyName, contactInfo } = req.body;

        console.log(req.body);

        if (!userId || !name || !email || !companyName || !contactInfo) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }
        const newVendor = {
            userId,
            name,
            email,
            description,
            companyName,
            contactInfo,
            status: "pending",
            createdAt: new Date(),
        };
        const result = await vendors.insertOne(newVendor);
        return res.status(201).json({
            success: true,
            message: "Vendor application submitted successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

export default router;