import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method === "GET") {
    res.status(200).json({ message: "This is a get request" });
  } else if (req.method === "POST") {
    const { name } = req.body;
    res.status(200).json({ message: `User ${name} has Signed in, lets go` });
  }
}
