import { NextApiRequest, NextApiResponse } from "next";

import {
  Configuration,
  PlaidApi,
  Products,
  PlaidEnvironments,
  CountryCode,
} from "plaid";

// Assigning the environment variables to the variables
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID!;
const PLAID_SECRET = process.env.PLAID_SECRET!;
const PLAID_ENV = process.env.PLAID_ENV!;
const CIBC_ACCESS_TOKEN = process.env.PLAID_CIBC_ACCESS_TOKEN!;

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

export const client = new PlaidApi(configuration);

async function createLinkToken(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    const response = await client.linkTokenCreate({
      user: {
        client_user_id: process.env.NEXT_PUBLIC_MY_USER_ID || "default_user_id",
      },
      client_name: "parsa",
      products: [Products.Transactions],
      country_codes: [CountryCode.Ca],
      language: "en",
      access_token: CIBC_ACCESS_TOKEN!,
    });
    res.json({ link_token: response.data.link_token });
  } catch (error) {
    console.error("Error creating link token:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating link token" });
  }
}

export default createLinkToken;
