"use server";
// Plaid Env Variables

import { Configuration, PlaidApi, Products, PlaidEnvironments } from "plaid";

// Assigning the environment variables to the variables
const APP_PORT = process.env.APP_PORT || 8000;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";
const ACCESS_TOKEN = process.env.PLAID_CIBC_ACCESS_TOKEN;

const PLAID_PRODUCTS = (
  process.env.PLAID_PRODUCTS || Products.Transactions
).split(",");

const PLAID_COUNTRY_CODES = (process.env.PLAID_COUNTRY_CODES || "US").split(
  ","
);

const configuration = new Configuration({
  basePath: PlaidEnvironments[PLAID_ENV],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": PLAID_CLIENT_ID,
      "PLAID-SECRET": PLAID_SECRET,
      "Plaid-Version": "2020-09-14",
    },
  },
});

const client = new PlaidApi(configuration);

// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import CIBCTransaction from "@/Models/cibcTransactions";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();
  try {
    const webhook_code = req.body.webhook_code;
    const webhook_type = req.body.webhook_type;
    const item_id = req.body.item_id;
    console.log("we are getting here", webhook_code, webhook_type, item_id);
    res.status(200).json({
      message: `Webhook URL is working`,
    });
  } catch (error) {
    res.status(500).json({ message: "Error Deleting Transactions" });
  }
}
