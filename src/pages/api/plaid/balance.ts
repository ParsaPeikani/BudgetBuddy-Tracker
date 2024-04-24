"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, PlaidApi, Products, PlaidEnvironments } from "plaid";
import Transaction from "@/Models/transaction";
import TDTransaction from "@/Models/tdTransactions";
import connectDB from "@/pages/lib/connectDB";

type ResponseData = {
  message: string;
  latest_transactions: Transaction[];
};

// Assigning the environment variables to the variables
const APP_PORT = process.env.APP_PORT || 8000;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";
const ACCESS_TOKEN = process.env.PLAID_ACCESS_TOKEN;

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

type Transaction = {
  date: string; // Assuming date is a string, adjust if it's a Date object or other type
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  console.log("hello we are getting here");
  await connectDB();
  Promise.resolve().then(async function () {
    // Set cursor to empty to receive all historical updates
    let cursor = null;

    // New transaction updates since "cursor"
    let added: any = [];
    let modified: any = [];
    // Removed transaction ids
    let removed: any = [];
    let hasMore = true;
    // Iterate through each page of new transaction updates for item
    try {
      const request = {
        access_token: ACCESS_TOKEN!,
      };
      const response = await client.accountsBalanceGet(request);
      const data = response.data;
      const accounts = response.data.accounts;

      res.status(200).json({ message: "Success", balance: response.data });
    } catch (error: any) {
      // Send an error response back to the client
      console.error("There was an error!", error);
      // Determine the appropriate status code and error message based on the error type
      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.error_message || "An unexpected error occurred";

      res.status(statusCode).json({ message: errorMessage, balance: [] });
    }
  });
}
