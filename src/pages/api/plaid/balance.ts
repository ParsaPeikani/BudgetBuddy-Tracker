"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, PlaidApi, Products, PlaidEnvironments } from "plaid";
import connectDB from "@/pages/lib/connectDB";
import Balance from "@/Models/balance";

type ResponseData = {
  message: string;
  balance: any;
};

// Assigning the environment variables to the variables
const APP_PORT = process.env.APP_PORT || 8000;
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";
const ACCESS_TOKEN = process.env.PLAID_TD_ACCESS_TOKEN;

const PLAID_PRODUCTS = (
  process.env.PLAID_PRODUCTS || Products.Transactions
).split(",");

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
  await connectDB();
  Promise.resolve().then(async function () {
    // Iterate through each page of new transaction updates for item
    try {
      const request = {
        access_token: ACCESS_TOKEN!,
      };
      const response = await client.accountsBalanceGet(request);
      const accounts = response.data.accounts;

      // Uncomment the following code for development purposes
      // Create a new balance object
      //   for (const account of accounts) {
      //     const balance = new Balance({
      //       account: {
      //         accountId: account.account_id,
      //         balances: {
      //           available: account.balances.available,
      //           current: account.balances.current,
      //           iso_currency_code: account.balances.iso_currency_code,ResponseData
      //         },
      //         mask: account.mask,
      //         name: account.name,
      //         subtype: account.subtype,
      //       },
      //     });
      //     await balance.save();
      //   }

      res.status(200).json({
        message: "Success Saving the balances in MongoDB",
        balance: response.data,
      });
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
