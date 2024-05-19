"use server";

import connectDB from "@/pages/lib/connectDB";

// Plaid Env Variables
import { Configuration, PlaidApi, Products, PlaidEnvironments } from "plaid";

// Assigning the environment variables to the variables
const PLAID_CLIENT_ID = "64e8dab8f457560013a34314";
const PLAID_SECRET = "954916e3e8be33a64ecf9046d26ecc";
const PLAID_ENV = "development";
const TD_ACCESS_TOKEN =
  "access-development-7b839e25-3b56-4ead-8c13-755c6a575868";
const CIBC_ACCESS_TOKEN =
  "access-development-3adb047b-7cb4-4b74-a807-af6d37fe20e4";

const USER_ID = "user_2cLSzspbg7ZAYLa4wys5AdXUkCI";

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
      console.log("hello \n\n\n\n");
      const response = await client.transactionsSync(request);
      console.log("hello again \n\n\n\n\n");
      const data = response.data;
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);
      hasMore = data.has_more;
      cursor = data.next_cursor;
    }

    const compareTxnsByDateAscending = (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime();
    const recently_added = added.sort(compareTxnsByDateAscending).slice(-20);
    const refactoredTransactions = refactorCIBCTransactions(recently_added);
    await saveTDToDatabase(refactoredTransactions);
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
    }
  }
}
