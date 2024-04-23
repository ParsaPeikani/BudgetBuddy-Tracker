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
        _id: "5ff4fb31f8d98e73cefa2b67",
        transactionId: "TRX0187XaN37yIBxWzeW3XP4",
        accountId: "ACCT187PKgd1KUrJeMxeNp",
        userId: "user_188Tzspbg7ZAYLa4wys5AdX",
        amount: 21.0,
        date: "2022-07-01T07:00:00.000+00:00",
        category: ["Food and Drink"],
        pending: false,
        merchantName: "Boston Pizza",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4fb46f8d98e73cefa2b68",
        transactionId: "TRX0188XaN37yIBxWzeW3XP5",
        accountId: "ACCT188PKgd1KUrJeMxeNp",
        userId: "user_189cLSzspbg7ZAYLa4wys5AdX",
        amount: 275.0,
        date: "2022-07-03T07:00:00.000+00:00",
        category: ["Travel"],
        pending: true,
        merchantName: "Airbnb",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4fb5bf8d98e73cefa2b69",
        transactionId: "TRX0189XaN37yIBxWzeW3XP6",
        accountId: "ACCT189PKgd1KUrJeMxeNp",
        userId: "user_190Tzspbg7ZAYLa4wys5AdX",
        amount: 75.8,
        date: "2022-07-05T07:00:00.000+00:00",
        category: ["Payment"],
        pending: false,
        merchantName: "Geico",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4fb70f8d98e73cefa2b6a",
        transactionId: "TRX0190XaN37yIBxWzeW3XP7",
        accountId: "ACCT190PKgd1KUrJeMxeNp",
        userId: "user_191cLSzspbg7ZAYLa4wys5AdX",
        amount: 27.6,
        date: "2022-07-07T07:00:00.000+00:00",
        category: ["Others"],
        pending: true,
        merchantName: "Macy's",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4fb85f8d98e73cefa2b6b",
        transactionId: "TRX0191XaN37yIBxWzeW3XP8",
        accountId: "ACCT191PKgd1KUrJeMxeNp",
        userId: "user_192Tzspbg7ZAYLa4wys5AdX",
        amount: 145.0,
        date: "2022-07-10T07:00:00.000+00:00",
        category: ["Transfer"],
        pending: false,
        merchantName: "Bank Transfer",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4fb9af8d98e73cefa2b6c",
        transactionId: "TRX0192XaN37yIBxWzeW3XP9",
        accountId: "ACCT192PKgd1KUrJeMxeNp",
        userId: "user_193cLSzspbg7ZAYLa4wys5AdX",
        amount: 16.1,
        date: "2022-07-12T07:00:00.000+00:00",
        category: ["Food and Drink"],
        pending: true,
        merchantName: "Popeyes",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4fbaff8d98e73cefa2b6d",
        transactionId: "TRX0193XaN37yIBxWzeW3XP0",
        accountId: "ACCT193PKgd1KUrJeMxeNp",
        userId: "user_194Tzspbg7ZAYLa4wys5AdX",
        amount: 315.0,
        date: "2022-07-15T07:00:00.000+00:00",
        category: ["Travel"],
        pending: false,
        merchantName: "Viking Cruises",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4fbc4f8d98e73cefa2b6e",
        transactionId: "TRX0194XaN37yIBxWzeW3XP1",
        accountId: "ACCT194PKgd1KUrJeMxeNp",
        userId: "user_195cLSzspbg7ZAYLa4wys5AdX",
        amount: 58.2,
        date: "2022-07-18T07:00:00.000+00:00",
        category: ["Payment"],
        pending: true,
        merchantName: "Xbox Live",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4fbd9f8d98e73cefa2b6f",
        transactionId: "TRX0195XaN37yIBxWzeW3XP2",
        accountId: "ACCT195PKgd1KUrJeMxeNp",
        userId: "user_196cLSzspbg7ZAYLa4wys5AdX",
        amount: 31.4,
        date: "2022-07-21T07:00:00.000+00:00",
        category: ["Others"],
        pending: false,
        merchantName: "Levi's",
        paymentChannel: "online",
        currency: "CAD",
      },
      {
        _id: "5ff4fbee    f8d98e73cefa2b70",
        transactionId: "TRX0196XaN37yIBxWzeW3XP3",
        accountId: "ACCT196PKgd1KUrJeMxeNp",
        userId: "user_197cLSzspbg7ZAYLa4wys5AdX",
        amount: 360.0,
        date: "2022-07-24T07:00:00.000+00:00",
        category: ["Transfer"],
        pending: true,
        merchantName: "PayPal",
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
