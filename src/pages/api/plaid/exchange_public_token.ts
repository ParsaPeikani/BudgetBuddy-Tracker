import { NextApiRequest, NextApiResponse } from "next";

import {
  Configuration,
  PlaidApi,
  Products,
  PlaidEnvironments,
  CountryCode,
} from "plaid";

// Assigning the environment variables to the variables
const PLAID_CLIENT_ID = "64e8dab8f457560013a34314";
const PLAID_SECRET = "954916e3e8be33a64ecf9046d26ecc";
const PLAID_ENV = "development";
const TD_ACCESS_TOKEN =
  "access-development-7b839e25-3b56-4ead-8c13-755c6a575868";
const CIBC_ACCESS_TOKEN =
  "access-development-3adb047b-7cb4-4b74-a807-af6d37fe20e4";

const USER_ID = "user_2cLSzspbg7ZAYLa4wys5AdXUkCI";

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

// /api/exchange_public_token.ts

async function handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  const { public_token } = req.body;

  try {
    const response = await client.itemPublicTokenExchange({
      public_token: public_token,
    });
    const access_token = response.data.access_token;
    const item_id = response.data.item_id;

    // Store the access_token and item_id securely in your database
    // ...

    res.json({ access_token });
  } catch (error) {
    console.error("Error exchanging public token:", error);
    res
      .status(500)
      .json({ error: "An error occurred while exchanging public token" });
  }
}

export default handler;
