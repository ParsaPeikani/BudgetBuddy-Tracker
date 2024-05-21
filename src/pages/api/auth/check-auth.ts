// pages/api/check-auth.js
import { useSession } from "@clerk/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";

let parsa_id = process.env.NEXT_PUBLIC_MY_USER_ID;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const { user_id } = req.query;

    if (user_id !== parsa_id) {
      return res.status(401).json({ authorized: false });
    }

    return res.status(200).json({ authorized: true });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
