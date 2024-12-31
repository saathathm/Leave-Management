import Leave from "../models/Leave.js";

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
