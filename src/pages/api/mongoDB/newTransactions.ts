// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import Transaction from "@/Models/transaction";
import type { NextApiRequest, NextApiResponse } from "next";
import moment from "moment";

type MonthToNumberMap = {
  [key: string]: number | undefined;
};

const month_to_number: MonthToNumberMap = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "GET") {
    try {
      const month = req.query.month;
      const year = Number(req.query.year);
      let startDate: any;

      let monthName: string;
      if (typeof month === "string") {
        const newMonth: number = month_to_number[month] || 1;
        startDate = moment([year, newMonth - 1]);
        const endDate = moment(startDate).endOf("month");
        console.log("hello hello", startDate.toDate(), endDate.toDate());

        // Construct the query
        const query = {
          date: {
            $gte: startDate.toDate(),
            $lt: endDate.toDate(),
          },
        };
        // Execute the query
        const results = await Transaction.find(query);
        console.log("these are the results: ", results);
        //   const transactions = await Transaction.find({}).sort({ date: -1 }); // Fetch all transactions
          res.status(200).json(results);
      }
    } catch (error) {
      res.status(500).json({ message: "Error fetching transactions" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
