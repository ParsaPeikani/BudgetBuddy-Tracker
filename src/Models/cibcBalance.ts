// Create a transaction Schema

import mongoose, { Schema, model, models } from "mongoose";

const cibcBalanceSchema = new Schema(
  {
    account: {
      accountId: {
        type: String,
        required: true,
      },
      balances: {
        available: {
          type: Number,
          required: true,
        },
        current: {
          type: Number,
          required: true,
        },
        iso_currency_code: {
          type: String,
          required: true,
        },
      },
      mask: {
        type: String,
        required: true,
      },
      name: String,
      subtype: String,
      createdAt: {
        type: Date,
        default: Date.now,
      },
      updatedAt: {
        type: Date,
        default: Date.now,
      },
    },
  },
  { timestamps: true }
);

const CIBCBalance =
  models.CIBCBalance || model("CIBCBalance", cibcBalanceSchema);

export default CIBCBalance;
