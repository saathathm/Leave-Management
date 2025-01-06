import Leave from "../models/Leave.js";
import User from "../models/User.js";

export const requestLeave = async (req, res, next) => {
  try {
    const { type, duration, startDate, endDate, reason } = req.body;
    const canTakeLeave = await req.user.updateLeaveBalance(type, duration);
    if (!canTakeLeave) {
      return res.status(400).json({
        success: false,
        message: `Insufficient balance for ${type} leave`,
      });
    }

    const leave = await Leave.create({
      employeeId: req.user._id,
      type,
      duration,
      startDate,
      endDate,
      reason,
    });

    res.status(201).json({ success: true, message: "Leave requested", leave });
  } catch (error) {
    next(error);
  }
};

export const getLeaveHistory = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ employeeId: req.user._id });
    res.status(200).json({ success: true, leaves });
  } catch (error) {
    next(error);
  }
};

export const approveLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave)
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });

    leave.status = "approved";
    leave.approverId = req.user._id;
    await leave.save();

    res.status(200).json({ success: true, message: "Leave approved", leave });
  } catch (error) {
    next(error);
  }
};

export const rejectLeave = async (req, res, next) => {
  try {
    const leave = await Leave.findById(req.params.id);
    if (!leave)
      return res
        .status(404)
        .json({ success: false, message: "Leave not found" });

    leave.status = "rejected";
    leave.approverId = req.user._id;
    await leave.save();

    res.status(200).json({ success: true, message: "Leave rejected", leave });
  } catch (error) {
    next(error);
  }
};

export const getPendingLeaves = async (req, res, next) => {
  try {
    const pendingLeaves = await Leave.find({ status: "pending" })
      .populate("employeeId", "name email")
      .populate("approverId", "name email");

    res.status(200).json({
      success: true,
      leaves: pendingLeaves,
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaveBalance = async (req, res, next) => {
  try {
    const userId = req.params.id || req.user.id;

    const user = await User.findById(userId).select("leaveBalance");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, leaveBalance: user.leaveBalance });
  } catch (error) {
    next(error);
  }
};

export const cancelLeaveRequest = async (req, res, next) => {
  try {
    const leave = await Leave.findOne({
      _id: req.params.id,
      employeeId: req.user.id,
      status: "pending",
    });

    if (!leave) {
      return res.status(404).json({
        success: false,
        message: "Pending leave request not found or cannot be canceled",
      });
    }

    await leave.deleteOne();

    res.status(200).json({
      success: true,
      message: "Leave request canceled successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const getLeaveStats = async (req, res, next) => {
  try {
    const stats = await Leave.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

export const getApproverHistory = async (req, res, next) => {
  try {
    const leaves = await Leave.find({ approverId: req.user.id }).populate(
      "employeeId",
      "name email"
    );

    res.status(200).json({ success: true, leaves });
  } catch (error) {
    next(error);
  }
};

export const resetLeaveBalances = async (req, res, next) => {
  try {
    const { annual, sick, maternity } = req.body;

    await User.updateMany(
      {},
      {
        $set: {
          "leaveBalance.annual": annual,
          "leaveBalance.sick": sick,
          "leaveBalance.maternity": maternity,
        },
      }
    );

    res.status(200).json({
      success: true,
      message: "Leave balances reset successfully",
    });
  } catch (error) {
    next(error);
  }
};
