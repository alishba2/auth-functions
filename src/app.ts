import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import connect from "./config/db";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connect().then(() => {
    console.log(`⚡️ ~ MongoDB connected  `);
});

// Routes
app.use("/api/auth", authRoutes);

export default app;
