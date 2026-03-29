import express from "express";
import bcrypt from "bcrypt";
import dbConnect from "../../utils/dbConnect.js";

const router = express.Router();

router.post("/register", async (req, res) => {
      console.log("Register route hit"); // 👈 add this
      console.log(req.body);
  try {
    const users = await dbConnect("users");

    const { name, email, password } = req.body;

    // validation
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // check existing user
    const existingUser = await users.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      name,
      email,
      password: hashedPassword,
      role: "user",
      createdAt: new Date(),
    };

    const result = await users.insertOne(newUser);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        id: result.insertedId,
        email,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

export default router;