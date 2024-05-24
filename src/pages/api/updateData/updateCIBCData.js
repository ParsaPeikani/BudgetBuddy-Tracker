"use server";

import connectDB from "@/pages/lib/connectDB";

// Plaid Env Variables
import { Configuration, PlaidApi, Products, PlaidEnvironments } from "plaid";

// Assigning the environment variables to the variables
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = "development";
const CIBC_ACCESS_TOKEN = process.env.PLAID_CIBC_ACCESS_TOKEN;

const USER_ID = process.env.NEXT_PUBLIC_MY_USER_ID;

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

const client = new PlaidApi(configuration);

// Models
import CIBCTransaction from "@/Models/cibcTransactions";

// Function to refactor the CIBC Transactions
function refactorCIBCTransactions(transactions) {
  return transactions.map((transaction) => {
    return {
      transactionId: transaction.transaction_id,
      accountId: transaction.account_id,
      userId: USER_ID,
      amount: transaction.amount,
      authorized_date: transaction.authorized_date,
      location: transaction.location?.city || null,
      date: transaction.date,
      category: transaction.category,
      pending: transaction.pending,
      merchantName: transaction.merchant_name,
      paymentChannel: transaction.payment_channel,
      currency: transaction.iso_currency_code,
    };
  });
}

// Function to save the CIBC transactions to the Database
async function saveCIBCToDatabase(transactions) {
  try {
    for (const transaction of transactions) {
      const existingTransaction = await CIBCTransaction.findOne({
        transactionId: transaction.transactionId,
      });

      if (existingTransaction) {
        await CIBCTransaction.replaceOne(
          { transactionId: transaction.transactionId },
          transaction
        );
      } else {
        await CIBCTransaction.create(transaction);
      }
    }
  } catch (error) {
    console.error("Error in saveToDatabase function:", error);
  }
}

// Function to get the latest CIBC Transactions from PLAID
export default async function handler(req, res) {
  let cursor = null;
  let added = [];
  let modified = [];
  let removed = [];
  let hasMore = true;

  try {
    while (hasMore) {
      const request = {
        access_token: CIBC_ACCESS_TOKEN,
        cursor: cursor,
      };
      const response = await client.transactionsSync(request);
      const data = response.data;
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);
      hasMore = data.has_more;
      cursor = data.next_cursor;
    }

    const compareTxnsByDateAscending = (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime();
    const recently_added = added.sort(compareTxnsByDateAscending).slice(-500);
    console.log("these are the transactions", recently_added);
    const refactoredTransactions = refactorCIBCTransactions(recently_added);
    await saveCIBCToDatabase(refactoredTransactions);
    console.log("CIBC Transactions Updated");
    res.status(200).json({ message: "CIBC Transactions Updated" });
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error_code === "ITEM_LOGIN_REQUIRED"
    ) {
      console.error(
        "User needs to re-authenticate. Prompting for Plaid Link..."
      );
      res.status(401).json({ error: "ITEM_LOGIN_REQUIRED" });
    } else {
      console.error("Error in getCIBCTransactionsFromPlaid function:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
