// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import Transaction from "@/Models/transaction";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "POST") {
    console.log("POST request received");
    // Assuming the transaction object is sent in the request body
    // const transactionData = req.body;
    const transactionData = [
      {
        _id: "5ff4f56bf8d98e73cefa2b21",
        transactionId: "TRX0117XaN37yIBxWzeW3XP4",
        accountId: "ACCT117PKgd1KUrJeMxeNp",
        userId: "user_118Tzspbg7ZAYLa4wys5AdX",
        amount: 45.2,
        date: "2021-12-01T07:00:00.000+00:00",
        category: ["Food and Drink"],
        pending: false,
        merchantName: "Red Lobster",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4f580f8d98e73cefa2b22",
        transactionId: "TRX0118XaN37yIBxWzeW3XP5",
        accountId: "ACCT118PKgd1KUrJeMxeNp",
        userId: "user_119cLSzspbg7ZAYLa4wys5AdX",
        amount: 135.7,
        date: "2021-12-03T07:00:00.000+00:00",
        category: ["Travel"],
        pending: true,
        merchantName: "Hilton",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4f595f8d98e73cefa2b23",
        transactionId: "TRX0119XaN37yIBxWzeW3XP6",
        accountId: "ACCT119PKgd1KUrJeMxeNp",
        userId: "user_120Tzspbg7ZAYLa4wys5AdX",
        amount: 63.9,
        date: "2021-12-05T07:00:00.000+00:00",
        category: ["Payment"],
        pending: false,
        merchantName: "Comcast",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4f5aaf8d98e73cefa2b24",
        transactionId: "TRX0120XaN37yIBxWzeW3XP7",
        accountId: "ACCT120PKgd1KUrJeMxeNp",
        userId: "user_121cLSzspbg7ZAYLa4wys5AdX",
        amount: 28.4,
        date: "2021-12-07T07:00:00.000+00:00",
        category: ["Others"],
        pending: true,
        merchantName: "Best Buy",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4f5bff8d98e73cefa2b25",
        transactionId: "TRX0121XaN37yIBxWzeW3XP8",
        accountId: "ACCT121PKgd1KUrJeMxeNp",
        userId: "user_122Tzspbg7ZAYLa4wys5AdX",
        amount: 90.3,
        date: "2021-12-10T07:00:00.000+00:00",
        category: ["Transfer"],
        pending: false,
        merchantName: "Bank of America",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4f5d4f8d98e73cefa2b26",
        transactionId: "TRX0122XaN37yIBxWzeW3XP9",
        accountId: "ACCT122PKgd1KUrJeMxeNp",
        userId: "user_123cLSzspbg7ZAYLa4wys5AdX",
        amount: 18.6,
        date: "2021-12-12T07:00:00.000+00:00",
        category: ["Food and Drink"],
        pending: true,
        merchantName: "Buffalo Wild Wings",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4f5e9f8d98e73cefa2b27",
        transactionId: "TRX0123XaN37yIBxWzeW3XP0",
        accountId: "ACCT123PKgd1KUrJeMxeNp",
        userId: "user_124Tzspbg7ZAYLa4wys5AdX",
        amount: 120.0,
        date: "2021-12-15T07:00:00.000+00:00",
        category: ["Travel"],
        pending: false,
        merchantName: "Southwest Airlines",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4f5fef8d98e73cefa2b28",
        transactionId: "TRX0124XaN37yIBxWzeW3XP1",
        accountId: "ACCT124PKgd1KUrJeMxeNp",
        userId: "user_125cLSzspbg7ZAYLa4wys5AdX",
        amount: 32.5,
        date: "2021-12-18T07:00:00.000+00:00",
        category: ["Payment"],
        pending: true,
        merchantName: "Apple Music",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4f613f8d98e73cefa2b29",
        transactionId: "TRX0125XaN37yIBxWzeW3XP2",
        accountId: "ACCT125PKgd1KUrJeMxeNp",
        userId: "user_126cLSzspbg7ZAYLa4wys5AdX",
        amount: 26.7,
        date: "2021-12-21T07:00:00.000+00:00",
        category: ["Others"],
        pending: false,
        merchantName: "Nike",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4f628f8d98e73cefa2b2a",
        transactionId: "TRX0126XaN37yIBxWzeW3XP3",
        accountId: "ACCT126PKgd1KUrJeMxeNp",
        userId: "user_127cLSzspbg7ZAYLa4wys5AdX",
        amount: 145.0,
        date: "2021-12-24T07:00:00.000+00:00",
        category: ["Transfer"],
        pending: true,
        merchantName: "Western Union",
        paymentChannel: "online",
        currency: "CAD",
      },
    ];
    try {
      for (let i = 0; i < transactionData.length; i++) {
        const newTransaction = new Transaction(transactionData[i]);
        await newTransaction.save();
      }
      // Use the Transaction model to create a new document in the MongoDB database
      // const newTransaction = new Transaction(transactionData[0]);
      // await newTransaction.save(); // Save the new transaction

      res.status(201).json(transactionData); // Respond with the newly created transaction
    } catch (error) {
      res.status(500).json({ message: "Error saving transaction", error });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
