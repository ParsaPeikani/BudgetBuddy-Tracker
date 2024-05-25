"use server";

import connectDB from "@/pages/lib/connectDB";

// Plaid Env Variables
import { Configuration, PlaidApi, Products, PlaidEnvironments } from "plaid";

// Assigning the environment variables to the variables
const PLAID_CLIENT_ID = process.env.PLAID_CLIENT_ID;
const PLAID_SECRET = process.env.PLAID_SECRET;
const PLAID_ENV = "development";
const TD_ACCESS_TOKEN = process.env.PLAID_TD_ACCESS_TOKEN;

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
import TDTransaction from "@/Models/tdTransactions";
import Balance from "@/Models/balance";

// Function to refactor the TD Transactions
function refactorTDTransactions(transactions) {
  return transactions.map((transaction) => {
    return {
      transactionId: transaction.transaction_id,
      accountId: transaction.account_id,
      amount: transaction.amount,
      date: transaction.date,
      category: transaction.category,
      pending: transaction.pending,
      name: transaction.name,
    };
  });
}

// Function to save the TD transactions to the Database
async function saveTDToDatabase(transactions) {
  try {
    for (const transaction of transactions) {
      const existingTransaction = await TDTransaction.findOne({
        transactionId: transaction.transactionId,
      });

      if (existingTransaction) {
        await TDTransaction.replaceOne(
          { transactionId: transaction.transactionId },
          transaction
        );
      } else {
        await TDTransaction.create(transaction);
      }
    }
  } catch (error) {
    console.error("Error in saveTDToDatabase function:", error);
  }
}

// Function to get the latest Balances from PLAID
async function getBalancesFromPlaid() {
  try {
    const request = {
      access_token: TD_ACCESS_TOKEN,
    };
    const response = await client.accountsBalanceGet(request);
    const accounts = response.data.accounts;
    return accounts;
  } catch (error) {
    console.error(error);
  }
}

// Drop the existing balances collection and create the new one
async function saveBalancesToDatabase(accounts) {
  try {
    await Balance.collection.drop();
    for (const account of accounts) {
      const balance = {
        account: {
          accountId: account.account_id,
          balances: {
            available: account.balances.available,
            current: account.balances.current,
            iso_currency_code: account.balances.iso_currency_code,
          },
          mask: account.mask,
          name: account.name,
          subtype: account.subtype,
        },
      };
      await Balance.create(balance);
    }
  } catch (error) {
    console.error("Error in saveTDBalancesToDatabase function:", error);
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
        access_token: TD_ACCESS_TOKEN,
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

    // Sort the transactions by date
    const compareTxnsByDateAscending = (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime();

    // Get the 20 most recent TD transactions from Plaid
    const recently_added = added.sort(compareTxnsByDateAscending).slice(-20);

    // Refactor the TD transactions
    const refactoredTransactions = refactorTDTransactions(recently_added);

    // Save the TD transactions to the database
    await saveTDToDatabase(refactoredTransactions);
    console.log("TD Transactions Have Been Updated");

    // Getting the TD Balance Accounts
    const accounts = await getBalancesFromPlaid();

    // Saving the TD Balance Accounts to the Database
    await saveBalancesToDatabase(accounts);
    console.log("TD Balances Have Been Updated");

    res
      .status(200)
      .json({ message: "TD Transactions && Balances Have Updated" });
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
      console.error("Error in getTDTransactionsFromPlaid function:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
