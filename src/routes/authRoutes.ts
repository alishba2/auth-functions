import express from "express";
import { register, login,verifyEmail,resetPassword } from "../controllers/user";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify/:token", verifyEmail); 
router.put("/reset-password", resetPassword);

export default router;
