"use server";

import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, PlaidApi, Products, PlaidEnvironments } from "plaid";

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

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
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
      while (hasMore) {
        const request = {
          access_token: ACCESS_TOKEN!,
          cursor: cursor!,
        };
        const response = await client.transactionsSync(request);
        const data = response.data;
        // Add this page of results
        added = added.concat(data.added);
        modified = modified.concat(data.modified);
        removed = removed.concat(data.removed);
        hasMore = data.has_more;

        // Update cursor to the next cursor
        cursor = data.next_cursor;
        // prettyPrintResponse(response);
      }

      // Comparison function for sorting transactions by date in ascending order
      const compareTxnsByDateAscending = (a: Transaction, b: Transaction) =>
        new Date(a.date).getTime() - new Date(b.date).getTime();

      // Return the 8 most recent transactions
      const recently_added = added.sort(compareTxnsByDateAscending).slice(-8);

      res
        .status(200)
        .json({ message: "Success", latest_transactions: recently_added });
    } catch (error: any) {
      // Send an error response back to the client
      console.error("There was an error!", error);
      // Determine the appropriate status code and error message based on the error type
      const statusCode = error.response?.status || 500;
      const errorMessage =
        error.response?.data?.error_message || "An unexpected error occurred";

      res
        .status(statusCode)
        .json({ message: errorMessage, latest_transactions: [] });
    }
  });
}
