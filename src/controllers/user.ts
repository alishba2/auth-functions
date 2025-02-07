import { Request, Response } from "express";
import { User } from "../models/user";
import { registerSchema, loginSchema } from "../utils/validators";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { sendSuccess, sendError } from "../utils/helpers";
import crypto from "crypto";


import { asyncHandler } from "../utils/helpers";
import { sendVerificationEmail } from "../utils/sendEmail";
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";



// ✅ Register User
export const register = asyncHandler(async (req, res) => {

    try {
        // Validate request body
        const parsedData = registerSchema.safeParse(req.body);
        if (!parsedData.success) {
            return sendError(res, 400, "Validation error", parsedData.error.errors);
        }

        const { username, email, password } = parsedData.data;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return sendError(res, 400, "User already exists", { email: "User already exists" });
        }

        // Create user
        const verificationToken = crypto.randomBytes(32).toString("hex");
        const newUser = new User({ username, email, password, verificationToken });
        await newUser.save();

        await sendVerificationEmail(email, verificationToken);

        return sendSuccess(res, 201, "User registered successfully");
    } catch (error) {
        return sendError(res, 500, "Server error", error);
    }
});


// Verify Email
export const verifyEmail = asyncHandler(async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({ verificationToken: token });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });
        user.isVerified = true;
        // user.verificationToken = undefined;
        await user.save();

        res.status(200).json({ message: "Email verified successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});



// ✅ Login User
export const login = asyncHandler(async (req, res) => {
    try {
        const parsedData = loginSchema.safeParse(req.body);
        if (!parsedData.success) {
            return sendError(res, 400, "Validation error", parsedData.error.errors);
        }

        const { email, password } = parsedData.data;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, 400, "Invalid credentials", { email: "Invalid email or password" });
        }
        if (!user.isVerified) return res.status(403).json({ message: "Please verify your email first." });

        // Validate password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return sendError(res, 400, "Invalid credentials", { email: "Invalid email or password" });
        }
        // Generate JWT
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });

        return sendSuccess(res, 200, "Login successful", {
            token,
            user: { id: user._id, username: user.username, email: user.email },
        });

    } catch (error) {
        return sendError(res, 500, "Server error", error);
    }
});




// reset password
export const resetPassword = asyncHandler(async (req, res) => {
    try {
        // Validate request body
        const parsedData = loginSchema.safeParse(req.body);
        if (!parsedData.success) {
            return sendError(res, 400, "Validation error", parsedData.error.errors);
        }

        const { email, password } = parsedData.data;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return sendError(res, 400, "User not found", { email: "User not found" });
        }
        // update the user's password
        user.password = password;
        await user.save();

        return sendSuccess(res, 200, "Password reset successfully", {
            user: { id: user._id, username: user.username, email: user.email },
        });

    } catch (error) {
        return sendError(res, 500, "Server error", error);
    }
});
