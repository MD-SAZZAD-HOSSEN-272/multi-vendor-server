
// import jwt from "jsonwebtoken";
// import dbConnect from "../../utils/dbConnect.js";
// import bcrypt from "bcrypt";
// import express from "express";

// const router = express.Router();

// const MAX_ATTEMPTS = 4; // 1 মিনিটে max wrong tries
// const BLOCK_TIME = 10 * 60 * 1000; // 10 মিনিট block in ms
// const WINDOW_TIME = 60 * 1000; // 1 মিনিট window

// // 🔐 LOGIN
// router.post("/login", async (req, res) => {
//     try {
//         const users = await dbConnect("users");
//         const { email, password } = req.body;

//         if (!email || !password) {
//             return res.status(400).json({
//                 success: false,
//                 message: "Email and password are required",
//             });
//         }

//         const existingUser = await users.findOne({ email });

//         console.log(existingUser);

//         if (!existingUser) {
//             return res.status(404).json({
//                 success: false,
//                 message: "User not found",
//             });
//         }

//         // check if user is blocked
//         if (existingUser.blockUntil && existingUser.blockUntil > Date.now()) {
//             const remaining = Math.ceil((existingUser.blockUntil - Date.now()) / 60000);
//             console.log(`User is blocked. Remaining time: ${remaining} minutes.`);
//             return res.status(403).json({
                
//                 success: false,
//                 message: `Too many failed attempts. Try again in ${remaining} minute(s).`,
//             });
//         }

//         const isPasswordMatch = await bcrypt.compare(password, existingUser.password);

//         if (!isPasswordMatch) {
//             const now = Date.now();
//             let attempts = existingUser.loginAttempts || [];

//             // remove attempts older than 1 minute
//             attempts = attempts.filter((ts) => now - ts < WINDOW_TIME);
//             attempts.push(now);

//             let blockUntil = existingUser.blockUntil || null;
//             if (attempts.length >= MAX_ATTEMPTS) {
//                 blockUntil = now + BLOCK_TIME; // block for 10 minutes
//                 attempts = []; // reset attempts after block
//             }

//             await users.updateOne(
//                 { _id: existingUser._id },
//                 { $set: { loginAttempts: attempts, blockUntil } }
//             );

//             const msg = blockUntil
//                 ? "Too many failed attempts. You are blocked for 10 minutes."
//                 : "Invalid credentials";

//                 console.log(msg);

//             return res.status(401).json({
//                 success: false,
//                 message: msg,
//             });
//         }

//         // success login: reset attempts and block
//         await users.updateOne(
//             { _id: existingUser._id },
//             { $set: { loginAttempts: [], blockUntil: null } }
//         );

//         const token = jwt.sign(
//             {
//                 id: existingUser._id,
//                 email: existingUser.email,
//                 role: existingUser.role,
//             },
//             process.env.JWT_SECRET,
//             { expiresIn: "7d" }
//         );

//         return res.status(200).json({
//             success: true,
//             message: "Login successful",
//             data: {
//                 token,
//                 user: {
//                     id: existingUser._id,
//                     name: existingUser.name,
//                     email: existingUser.email,
//                     role: existingUser.role,
//                 },
//             },
//         });
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({
//             success: false,
//             message: "Server error",
//         });
//     }
// });

// export default router;




























import jwt from "jsonwebtoken";
import dbConnect from "../../utils/dbConnect.js";
import bcrypt from "bcrypt";
import express from "express";


const router = express.Router();

// 🔐 LOGIN
router.post("/login", async (req, res) => {
    try {
        const users = await dbConnect("users");
        const { email, password } = req.body;

        // validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        // find user
        const existingUser = await users.findOne({ email });

        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        // compare password
        const isPasswordMatch = await bcrypt.compare(
            password,
            existingUser.password
        );

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // generate token
        const token = jwt.sign(
            {
                id: existingUser._id,
                email: existingUser.email,
                role: existingUser.role,
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        console.log(token);

        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: existingUser._id,
                    name: existingUser.name,
                    email: existingUser.email,
                    role: existingUser.role,
                },
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