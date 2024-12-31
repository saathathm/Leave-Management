import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["employee", "admin", "management"],
    default: "employee"
  },
  leaveBalance: {
    annual: {
      type: Number,
      default: 12
    },
    sick: {
      type: Number,
      default: 10
    },
    maternity: {
      type: Number,
      default: 90
    },
  },
});

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

UserSchema.methods.updateLeaveBalance = async function (leaveType, duration) {
  const leaveDays = duration === "full" ? 1 : duration === "half" ? 0.5 : 0.1875;
  if (this.leaveBalance[leaveType] >= leaveDays) {
    this.leaveBalance[leaveType] -= leaveDays;
    await this.save();
    return true;
  }
  return false;
};

export default mongoose.model("User", UserSchema);