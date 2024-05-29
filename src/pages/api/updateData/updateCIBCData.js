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
import CIBCBalance from "@/Models/cibcBalance";

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

// Function to get the latest Balances from PLAID
async function getBalancesFromPlaid() {
  try {
    const request = {
      access_token: CIBC_ACCESS_TOKEN,
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
    await CIBCBalance.collection.drop();
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
      await CIBCBalance.create(balance);
    }
  } catch (error) {
    console.error("Error in saveCIBCBalancesToDatabase function:", error);
  }
}

// Function to get the number of transactions
async function getNumberOfTransactions(
  accessToken,
  startDate,
  endDate,
  accountId
) {
  let totalTransactions = 0;
  let hasMore = true;
  let offset = 0;
  const count = 500; // Number of transactions to fetch per request

  try {
    while (hasMore) {
      const response = await client.transactionsGet({
        access_token: accessToken,
        start_date: startDate,
        end_date: endDate,
        options: {
          account_ids: [accountId],
          count: count,
          offset: offset,
        },
      });

      totalTransactions += response.data.transactions.length;

      // Check if there are more transactions to fetch
      if (response.data.total_transactions > totalTransactions) {
        offset += count;
      } else {
        hasMore = false;
      }
    }

    return totalTransactions;
  } catch (error) {
    console.error("Error fetching transactions:", error);
    throw error;
  }
}
// Function to get the latest CIBC Transactions from PLAID
export default async function handler(req, res) {
  // try {
  //   const transNum = await getNumberOfTransactions(
  //     CIBC_ACCESS_TOKEN,
  //     "2021-01-01",
  //     "2024-12-31",
  //     "6w71yKY46zUw66xyYxnAUZ0geKDjL5HAnyk7D"
  //   );
  //   console.log("This is the toatl number of transactions", transNum);
  let cursor =
    "CAESJXBiYXhSdjlQajhjbzBqOHBkT1JtZnc5dm9kcUJRWHUzdk8xSjgiDAiJtJiyBhCgq4nGAyoMCIm0mLIGEKCricYD";
  let added = [];
  let modified = [];
  let removed = [];
  let hasMore = true;
  let total = 0;

  try {
    while (hasMore) {
      console.log("this is the cursor \n\n\n\n", cursor);
      const request = {
        access_token: CIBC_ACCESS_TOKEN,
        cursor: cursor,
      };
      const response = await client.transactionsSync(request);
      console.log("this is the response \n\n\n\n\n\n\n", response.data);
      const data = response.data;
      total += data.added.length;
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);
      hasMore = data.has_more;
      cursor = data.next_cursor;
    }

    console.log(
      "This is the total number of transactions \n\n\n\n\n\n\n\n",
      total
    );

    const compareTxnsByDateAscending = (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime();

    // Sort the transactions by date and get the last 50 transactions
    const recently_added = added.sort(compareTxnsByDateAscending).slice(-10);

    // Refactor the transactions and save them to the database
    const refactoredTransactions = refactorCIBCTransactions(recently_added);

    // Save the CIBC transactions to the database
    await saveCIBCToDatabase(refactoredTransactions);
    console.log("CIBC Transactions Updated");

    // Get CIBC Balances
    const accounts = await getBalancesFromPlaid();

    // Save the CIBC Balances to the Database
    await saveBalancesToDatabase(accounts);
    console.log("CIBC Balances Updated");

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
