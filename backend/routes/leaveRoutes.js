import express from "express";
import {
  requestLeave,
  getLeaveHistory,
  approveLeave,
  rejectLeave,
  getPendingLeaves,
  getLeaveBalance,
  cancelLeaveRequest,
  getLeaveStats,
  getApproverHistory,
  resetLeaveBalances,
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
router.get(
  "/pending",
  authMiddleware,
  roleMiddleware(["admin", "management"]),
  getPendingLeaves
);

router.get("/balance/:id?", authMiddleware, getLeaveBalance);

router.delete("/cancel/:id", authMiddleware, cancelLeaveRequest);

router.get("/stats", authMiddleware, roleMiddleware(["admin"]), getLeaveStats);

router.get(
  "/approver-history",
  authMiddleware,
  roleMiddleware(["admin", "management"]),
  getApproverHistory
);

router.put(
  "/reset-balances",
  authMiddleware,
  roleMiddleware(["admin"]),
  resetLeaveBalances
);

export default router;
