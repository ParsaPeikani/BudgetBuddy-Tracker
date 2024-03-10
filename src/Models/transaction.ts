// Create a transaction Schema

import mongoose, { Schema, model, models } from "mongoose";

const transactionSchema = new Schema(
  {
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    accountId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    category: {
      type: [String],
      required: true,
    },
    pending: {
      type: Boolean,
      default: false,
    },
    merchantName: String,
    paymentChannel: String,
    currency: {
      type: String,
      required: true,
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

const Transaction =
  models.Transaction || model("Transaction", transactionSchema);

export default Transaction;
