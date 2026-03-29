import express from "express";
import dbConnect from "../../utils/dbConnect.js";
import { ObjectId } from "mongodb";

const router = express.Router();


router.get("/pandding-vendors", async (req, res) => {
    try {
        const vendors = await dbConnect("vendors");
        const panddingVendors = await vendors.find({ status: "pending" }).toArray();
        return res.status(200).json({
            success: true,
            message: "Pandding vendors fetched successfully",
            data: panddingVendors,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});


router.patch("/vendors/:id", async (req, res) => {
    try {
        const vendors = await dbConnect("vendors");
        const vendorId = req.params.id;
        const status = req.query.status;

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Please use 'approved' or 'rejected'.",
            });
        }

        const result = await vendors.updateOne(
            { _id: new ObjectId(vendorId) },
            { $set: { status: status } }
        );
        return res.status(200).json({
            success: true,
            message: "Vendor status updated successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

router.post("/vendors", async (req, res) => {
    try {
        const vendors = await dbConnect("vendors");
        const {
            userId,
            companyName,
            contactInfo,
            approvalStatus,
        } = req.body;
        if (!userId || !companyName || !contactInfo) {
            return res.status(400).json({
                success: false,
                message: "User ID, company name and contact info are required",
            });
        }
        const newVendor = {
            userId,
            companyName,
            contactInfo,
            approvalStatus: approvalStatus || "pending",
            createdAt: new Date(),
        };
        const result = await vendors.insertOne(newVendor);
        return res.status(201).json({
            success: true,
            message: "Vendor added successfully",
            data: result,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});


router.get("/vendors", async (req, res) => {
    try {
        const vendors = await dbConnect("vendors");
        const allVendors = await vendors.find({}).toArray();
        return res.status(200).json({
            success: true,
            message: "All vendors fetched successfully",
            data: allVendors,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});


router.delete("/vendors/:id", async (req, res) => {
    try {
        const vendors = await dbConnect("vendors");
        const vendorId = req.params.id;

        const result = await vendors.deleteOne({ _id: new ObjectId(vendorId) });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Vendor deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

export default router;