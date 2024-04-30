// Create a transaction Schema

import mongoose, { Schema, model, models } from "mongoose";

const cibcTransactionSchema = new Schema(
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
    authorized_date: {
      type: Date,
      required: true,
    },
    location: {
      type: String,
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

const CIBCTransaction =
  models.CIBCTransaction || model("CIBCTransaction", cibcTransactionSchema);

export default CIBCTransaction;
