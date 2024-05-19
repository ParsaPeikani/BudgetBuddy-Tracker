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
import TDTransaction from "@/Models/tdTransactions";
import Balance from "@/Models/balance";

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
async function getCIBCTransactionsFromPlaid() {
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
    return refactoredTransactions;
  } catch (error) {
    if (
      error.response &&
      error.response.data &&
      error.response.data.error_code === "ITEM_LOGIN_REQUIRED"
    ) {
      console.error(
        "User needs to re-authenticate. Prompting for Plaid Link..."
      );
      // Handle re-authentication logic here, typically by redirecting the user to the Plaid Link flow
      // Example:
      // window.location.href = '/path-to-plaid-link';
    } else {
      console.error("Error in getCIBCTransactionsFromPlaid function:", error);
    }
  }
}

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

// Function to get the latest TD Transactions from PLAID
async function getTDTransactionsFromPlaid() {
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

    const compareTxnsByDateAscending = (a, b) =>
      new Date(a.date).getTime() - new Date(b.date).getTime();

    const recently_added = added.sort(compareTxnsByDateAscending).slice(-20);
    const refactoredTransactions = refactorTDTransactions(recently_added);
    return refactoredTransactions;
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
    console.error("Error in saveBalancesToDatabase function:", error);
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

async function updateData() {
  try {
    // Connect to the database
    const db = await connectDB();
    console.log("Connected to the database");
    console.log("Starting Updating Transactions and Balances...");

    // Getting the latest 50 CIBC Transactions from PLAID
    const latestCIBCTransactions = await getCIBCTransactionsFromPlaid();
    await saveCIBCToDatabase(latestCIBCTransactions);
    console.log("CIBC Transactions saved to the database");

    // // // Getting the latest 30 TD Transactions from PLAID
    // const latestTDTransactions = await getTDTransactionsFromPlaid();
    // await saveTDToDatabase(latestTDTransactions);
    // console.log("TD Transactions saved to the database");

    // // Getting the latest Balances from PLAID
    // const accounts = await getBalancesFromPlaid();
    // await saveBalancesToDatabase(accounts);
    // console.log("Balances saved to the database");

    console.log("Transactions and Balances updated successfully");
    console.log("Closing the database connection...");

    // Close the database connection
    await db.connection.close();
  } catch (error) {
    console.error("Error in main function:", error);
  }
}
// Export the main function
export default updateData;
