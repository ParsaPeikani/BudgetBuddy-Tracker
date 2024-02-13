// src/Models/user.ts

import mongoose, { Schema, model, models } from "mongoose";

const userSchema = new Schema(
  {
    externalId: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const User = models.User || model("User", userSchema);

export default User;
