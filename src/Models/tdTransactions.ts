// Create a transaction Schema

import mongoose, { Schema, model, models } from "mongoose";

const tdTransactionSchema = new Schema(
  {
    accountId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: true,
      unique: true,
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
    name: String,
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

const TDTransaction =
  models.Transaction || model("TDTransaction", tdTransactionSchema);

export default TDTransaction;
