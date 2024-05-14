"use server";

// Plaid Env Variables
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid";

// Assigning the environment variables to the variables
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = process.env.PLAID_ENV || "sandbox";
const ACCESS_TOKEN = process.env.PLAID_CIBC_ACCESS_TOKEN;

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

import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "PUT") {
    try {
      const response = await client.itemGet({ access_token: ACCESS_TOKEN! });
      const item = response.data.item;
      res.status(200).json({
        message: `Webhook URL is working`,
        item,
      });
    } catch (error) {
      res.status(500).json({ message: "Error Deleting Transactions" });
    }
  }
}
