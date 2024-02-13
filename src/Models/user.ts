import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    externalId: {
      type: String,
      required: true,
      unique: true, // Assuming you want each externalId to be unique
    },
    email: {
      type: String,
      required: true,
      unique: true, // This enforces the email to be unique across users
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically sets to current date and time
    },
    updatedAt: {
      type: Date,
      default: Date.now, // Automatically sets to current date and time
    },
  },
  { timestamps: true }
); // This option enables automatic handling of `createdAt` and `updatedAt` fields

const User = mongoose.model("User", userSchema);

export default User;
