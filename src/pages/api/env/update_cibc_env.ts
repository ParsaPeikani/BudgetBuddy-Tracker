// pages/api/update_env.js
import fs from "fs";
import path from "path";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { access_token } = req.body;
    if (!access_token) {
      return res.status(400).json({ error: "Access token is required" });
    }

    console.log("this is the access token \n\n\n\n\n\n", access_token);

    // Path to the .env.local file
    const envPath = path.resolve(process.cwd(), ".env.local");

    // Read the .env.local file
    let envContent = fs.readFileSync(envPath, "utf-8");

    // Update the PLAID_CIBC_ACCESS_TOKEN variable
    const newEnvContent = envContent.replace(
      /PLAID_CIBC_ACCESS_TOKEN=.*/g,
      `PLAID_CIBC_ACCESS_TOKEN=${access_token}`
    );

    // Write the updated content back to the .env.local file
    fs.writeFileSync(envPath, newEnvContent, "utf-8");

    return res
      .status(200)
      .json({ message: "CIBC Access token updated successfully" });
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
