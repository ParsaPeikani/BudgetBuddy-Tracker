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
          amount: number;
          total: number;
          category: {
            [key: string]: {
              amount: number;
              count: number;
            };
          };
        };
      } = {
        January: {
          amount: 0,
          total: 0,
          category: {},
        },
        February: {
          amount: 0,
          total: 0,
          category: {},
        },
        March: {
          amount: 0,
          total: 0,
          category: {},
        },
        April: {
          amount: 0,
          total: 0,
          category: {},
        },
        May: {
          amount: 0,
          total: 0,
          category: {},
        },
        June: {
          amount: 0,
          total: 0,
          category: {},
        },
        July: {
          amount: 0,
          total: 0,
          category: {},
        },
        August: {
          amount: 0,
          total: 0,
          category: {},
        },
        September: {
          amount: 0,
          total: 0,
          category: {},
        },
        October: {
          amount: 0,
          total: 0,
          category: {},
        },
        November: {
          amount: 0,
          total: 0,
          category: {},
        },
        December: {
          amount: 0,
          total: 0,
          category: {},
        },
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
          !MonthlyCategoryDataCIBCTransactions[numberToMonthObject[monthNumber]]
            .category[category]
        ) {
          MonthlyCategoryDataCIBCTransactions[
            numberToMonthObject[monthNumber]
          ].category[category] = { amount: 0, count: 0 };
        }
        MonthlyCategoryDataCIBCTransactions[
          numberToMonthObject[monthNumber]
        ].category[category].amount += CIBCtransactions[i].amount;
        MonthlyCategoryDataCIBCTransactions[
          numberToMonthObject[monthNumber]
        ].category[category].count += 1;

        // Increment the total amount and count for the month
        MonthlyCategoryDataCIBCTransactions[
          numberToMonthObject[monthNumber]
        ].amount += CIBCtransactions[i].amount;
        MonthlyCategoryDataCIBCTransactions[
          numberToMonthObject[monthNumber]
        ].total += 1;

        // Initialize category if it doesn't exist
        if (!CIBCYearlyCategoryData[category]) {
          CIBCYearlyCategoryData[category] = { amount: 0, count: 0 };
        }

        // Increment amount and count
        CIBCYearlyCategoryData[category].amount += CIBCtransactions[i].amount;
        CIBCYearlyCategoryData[category].count += 1;
      }
      console.log(
        "this is the MonthlyCategoryDataCIBCTransactions",
        MonthlyCategoryDataCIBCTransactions,
        MonthlyCategoryDataCIBCTransactions["January"]
      );

      const prompt = `As Budget Pro, your role is to provide tailored financial advice and insights based on the user's data. Let's delve into their financial details for the current year:
      1. Number of Transactions:
         - The user has conducted ${
           CIBCtransactions.length
         } transactions with CIBC.
         - They've performed ${TDCheckingNumberOfTransactions} transactions in their TD Checking account.
         - Their TD Savings account reflects ${TDSavingNumberOfTransactions} transactions.
      
      2. Account Balances:
         - The user's TD Checking account balance is ${TDCheckingBalance}.
         - In their TD Savings account, they have ${TDSavingBalance} available.
         - The total balance across both accounts amounts to ${TotalBalance}.
      
      3. CIBC Each Month of 2024 Transactions Analysis:
        - Let's explore the user's CIBC transactions:
          - Each month's category-wise expenditure: This data includes all the categories and their respective amounts and counts that the user has spent on during the specific months.
          - In the data, you will see each month is pointing to an object that contains the amount spent in that month, the total number of transactions, and a category object that contains the amount spent in each category and the number of transactions in that category. If the user asked how many transactions they had in a specific month, just provide the value of the total key in the object.
          - This user in the month of January 2024 had a total of ${
            MonthlyCategoryDataCIBCTransactions["January"].total
          } transactions and spent a total of ${
        MonthlyCategoryDataCIBCTransactions["January"].amount
      }.
          - Information regaring the user's transactions in each category for the month of January 2024 is here: ${JSON.stringify(
            MonthlyCategoryDataCIBCTransactions["January"].category
          )}
          - This user in the month of February 2024 had a total of ${
            MonthlyCategoryDataCIBCTransactions["February"].total
          } transactions and spent a total of ${
        MonthlyCategoryDataCIBCTransactions["February"].amount
      }.
          - Information regaring the user's transactions in each category for the month of February 2024 is here: ${JSON.stringify(
            MonthlyCategoryDataCIBCTransactions["February"].category
          )}
          - This user in the month of March 2024 had a total of ${
            MonthlyCategoryDataCIBCTransactions["March"].total
          } transactions and spent a total of ${
        MonthlyCategoryDataCIBCTransactions["March"].amount
      }.
          - Information regaring the user's transactions in each category for the month of March 2024 is here: ${JSON.stringify(
            MonthlyCategoryDataCIBCTransactions["March"].category
          )}
          - This user in the month of April 2024 had a total of ${
            MonthlyCategoryDataCIBCTransactions["April"].total
          } transactions and spent a total of ${
        MonthlyCategoryDataCIBCTransactions["April"].amount
      }.
          - Information regaring the user's transactions in each category for the month of April 2024 is here: ${JSON.stringify(
            MonthlyCategoryDataCIBCTransactions["April"].category
          )}
          - This user in the month of May 2024 had a total of ${
            MonthlyCategoryDataCIBCTransactions["May"].total
          } transactions and spent a total of ${
        MonthlyCategoryDataCIBCTransactions["May"].amount
      }.
          - Information regaring the user's transactions in each category for the month of May 2024 is here: ${JSON.stringify(
            MonthlyCategoryDataCIBCTransactions["May"].category
          )}
          - This user in the month of June 2024 had a total of ${
            MonthlyCategoryDataCIBCTransactions["June"].total
          } transactions and spent a total of ${
        MonthlyCategoryDataCIBCTransactions["June"].amount
      }.
          - Information regaring the user's transactions in each category for the month of June 2024 is here: ${JSON.stringify(
            MonthlyCategoryDataCIBCTransactions["June"].category
          )}
          - This user in the month of July 2024 had a total of ${
            MonthlyCategoryDataCIBCTransactions["July"].total
          } transactions and spent a total of ${
        MonthlyCategoryDataCIBCTransactions["July"].amount
      }.
          - Information regaring the user's transactions in each category for the month of July 2024 is here: ${JSON.stringify(
            MonthlyCategoryDataCIBCTransactions["July"].category
          )}
          - This user in the month of August 2024 had a total of ${
            MonthlyCategoryDataCIBCTransactions["August"].total
          } transactions and spent a total of ${
        MonthlyCategoryDataCIBCTransactions["August"].amount
      }.
          - Information regaring the user's transactions in each category for the month of August 2024 is here: ${JSON.stringify(
            MonthlyCategoryDataCIBCTransactions["August"].category
          )}
          - This user in the month of September 2024 had a total of ${
            MonthlyCategoryDataCIBCTransactions["September"].total
          } transactions and spent a total of ${
        MonthlyCategoryDataCIBCTransactions["September"].amount
      }.
          - Information regaring the user's transactions in each category for the month of September 2024 is here: ${JSON.stringify(
            MonthlyCategoryDataCIBCTransactions["September"].category
          )}
          - This user in the month of October 2024 had a total of ${
            MonthlyCategoryDataCIBCTransactions["October"].total
          } transactions and spent a total of ${
        MonthlyCategoryDataCIBCTransactions["October"].amount
      }.
          - Information regaring the user's transactions in each category for the month of October 2024 is here: ${JSON.stringify(
            MonthlyCategoryDataCIBCTransactions["October"].category
          )}
          - This user in the month of November 2024 had a total of ${
            MonthlyCategoryDataCIBCTransactions["November"].total
          } transactions and spent a total of ${
        MonthlyCategoryDataCIBCTransactions["November"].amount
      }.
          - Information regaring the user's transactions in each category for the month of November 2024 is here: ${JSON.stringify(
            MonthlyCategoryDataCIBCTransactions["November"].category
          )}
          - This user in the month of December 2024 had a total of ${
            MonthlyCategoryDataCIBCTransactions["December"].total
          } transactions and spent a total of ${
        MonthlyCategoryDataCIBCTransactions["December"].amount
      }.
          - Information regaring the user's transactions in each category for the month of December 2024 is here: ${JSON.stringify(
            MonthlyCategoryDataCIBCTransactions["December"].category
          )}
          - If the user asks about a month that is not in the data, you can inform them that there is no data available for that month. So if the month has total 0 transactions and total 0 amount spent, you can inform the user that there is no data available for that month.
          - The user had 0 transaction in the month of December 2024 no matter what.
      
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
