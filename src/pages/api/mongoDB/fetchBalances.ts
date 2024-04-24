// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import Balance from "@/Models/balance";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const balances = await Balance.find({});
      res.status(200).json(balances);
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
