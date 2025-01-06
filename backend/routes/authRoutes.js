import express from "express";
import { register, login, getUser } from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/user", authMiddleware, getUser);
router.get("/user/:id", authMiddleware, roleMiddleware(["admin"]), getUser);

export default router;
