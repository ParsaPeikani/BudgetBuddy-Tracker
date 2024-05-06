// /pages/api/transactions.js
import connectDB from "@/pages/lib/connectDB";
import CIBCTransaction from "@/Models/cibcTransactions";
import TDTransaction from "@/Models/tdTransactions";
import Balance from "@/Models/balance";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await connectDB();

  if (req.method === "GET") {
    try {
      let CIBCtransactions;
      let TDTransactions;
      let TDCheckingNumberOfTransactions = 0;
      let TDSavingNumberOfTransactions = 0;
      let TDCheckingBalance = 0;
      let TDSavingBalance = 0;
      let TotalBalance = 0;

      const MonthlyCategoryDataCIBCTransactions: {
        [key: string]: {
          [category: string]: { amount: number; count: number };
        };
      } = {
        January: {},
        February: {},
        March: {},
        April: {},
        May: {},
        June: {},
        July: {},
        August: {},
        September: {},
        October: {},
        November: {},
        December: {},
      };

      const numberToMonthObject: { [key: number]: string } = {
        1: "January",
        2: "February",
        3: "March",
        4: "April",
        5: "May",
        6: "June",
        7: "July",
        8: "August",
        9: "September",
        10: "October",
        11: "November",
        12: "December",
      };

      // Get the current year
      const currentYear = new Date().getFullYear();

      // Find TD Checking, Saving and Total Balances
      const checkingAccount = await Balance.find({
        "account.subtype": "checking",
      });
      TDCheckingBalance = checkingAccount[0]?.account?.balances?.current ?? 0;

      const savingAccount = await Balance.find({
        "account.subtype": "savings",
      });
      TDSavingBalance = savingAccount[0]?.account.balances?.current ?? 0;

      TotalBalance = TDCheckingBalance + TDSavingBalance;

      // Find TD transactions where the year matches the current year
      TDTransactions = await TDTransaction.find({
        date: {
          $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
          $lte: new Date(`${currentYear}-12-31T23:59:59Z`),
        },
      }).sort({ date: -1 });

      // Find the number of transactions for each TD account
      for (let i = 0; i < TDTransactions.length; i++) {
        if (
          TDTransactions[i].accountId === process.env.TD_CHECKING_ACCOUNT_ID
        ) {
          TDCheckingNumberOfTransactions += 1;
        } else if (
          TDTransactions[i].accountId === process.env.TD_SAVING_ACCOUNT_ID
        ) {
          TDSavingNumberOfTransactions += 1;
        }
      }

      // Find CIBC transactions where the year matches the current year
      CIBCtransactions = await CIBCTransaction.find({
        date: {
          $gte: new Date(`${currentYear}-01-01T00:00:00Z`),
          $lte: new Date(`${currentYear}-12-31T23:59:59Z`),
        },
      }).sort({ date: -1 });
      let CIBCYearlyCategoryData: {
        [key: string]: { amount: number; count: number };
      } = {};

      for (let i = 0; i < CIBCtransactions.length; i++) {
        // Extracting the category from the transaction
        const category = CIBCtransactions[i].category[0];

        // Extracting the month from the date string
        const dateString = CIBCtransactions[i].date.toISOString();
        const monthString = dateString.substring(5, 7);
        const monthNumber = parseInt(monthString, 10);
        if (
          !MonthlyCategoryDataCIBCTransactions[
            numberToMonthObject[monthNumber]
          ][category]
        ) {
          MonthlyCategoryDataCIBCTransactions[numberToMonthObject[monthNumber]][
            category
          ] = { amount: 0, count: 0 };
        }
        MonthlyCategoryDataCIBCTransactions[numberToMonthObject[monthNumber]][
          category
        ].amount += CIBCtransactions[i].amount;
        MonthlyCategoryDataCIBCTransactions[numberToMonthObject[monthNumber]][
          category
        ].count += 1;

        // Initialize category if it doesn't exist
        if (!CIBCYearlyCategoryData[category]) {
          CIBCYearlyCategoryData[category] = { amount: 0, count: 0 };
        }

        // Increment amount and count
        CIBCYearlyCategoryData[category].amount += CIBCtransactions[i].amount;
        CIBCYearlyCategoryData[category].count += 1;
      }

      const prompt = `As Budget Pro, your role is to provide tailored financial advice and insights based on the user's data. Let's delve into their financial details for the current year:

      1. Number of Transactions:
         - The user has conducted ${CIBCtransactions.length} transactions with CIBC.
         - They've performed ${TDCheckingNumberOfTransactions} transactions in their TD Checking account.
         - Their TD Savings account reflects ${TDSavingNumberOfTransactions} transactions.
      
      2. Account Balances:
         - The user's TD Checking account balance is ${TDCheckingBalance}.
         - In their TD Savings account, they have ${TDSavingBalance} available.
         - The total balance across both accounts amounts to ${TotalBalance}.
      
      3. CIBC Each Month of 2024 Transactions Analysis:
        - Let's explore the user's CIBC transactions:
          - Each month's category-wise expenditure: ${MonthlyCategoryDataCIBCTransactions}, this data includes all the categories and their respective amounts and counts that the user has spent on during the specific months.
      
      4. Budget Pro Tips:
         - Recommend staying vigilant about spending patterns.
         - Encourage them to keep an eye on categories where they've exceeded their budgeted amount.
         - Suggest reallocating funds from overspent categories to areas where they can save more.
         - Advise regular review of monthly transactions to identify irregularities or unexpected expenses.
      
      Their financial journey is unique, and you're here to support them every step of the way.`;

      res.status(200).json({ prompt });
    } catch (error) {
      console.error("Error fetching transactions:", error);
      res.status(500).json({ message: "Error fetching transactions" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
