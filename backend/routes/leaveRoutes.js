import express from "express";
import {
  requestLeave,
  getLeaveHistory,
  approveLeave,
  rejectLeave,
} from "../controllers/leaveController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import roleMiddleware from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/request", authMiddleware, requestLeave);
router.get("/history", authMiddleware, getLeaveHistory);
router.put(
  "/:id/approve",
  authMiddleware,
  roleMiddleware(["admin", "management"]),
  approveLeave
);
router.put(
  "/:id/reject",
  authMiddleware,
  roleMiddleware(["admin", "management"]),
  rejectLeave
);

export default router;
