import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { Checking } from "../balance/checkingTable";

///////////////////////////////////TD Transactions/////////////////////////////////////

// Fetch All TD Transcations
export async function fetchAllTDTransactions(
  setAllTDTransactions: Dispatch<SetStateAction<any[]>>
) {
  const response = await axios.get("/api/mongoDB/fetchAllTDTransactions");
  const TDTrans = response.data.map((transaction: any) => ({
    id: transaction.transactionId,
    date: new Date(transaction.date).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    name: transaction.name ? transaction.name : "UnKnown",
    amount: transaction.amount,
    category: transaction.category[0],
    status: transaction.pending ? "Pending" : "Verified",
  }));
  setAllTDTransactions(TDTrans);
}

// Fetch TD Checking Transactions from Database
export async function fetchTDCheckingTransactions(
  setTdCheckingTransactions: Dispatch<SetStateAction<Checking[]>>
) {
  const response = await axios.get("/api/mongoDB/fetchTDCheckingTransactions");
  const TDTrans = response.data.map((transaction: any) => ({
    id: transaction.transactionId,
    date: new Date(transaction.date).toLocaleDateString("en-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }),
    name: transaction.name ? transaction.name : "UnKnown",
    amount: transaction.amount,
    category: transaction.category[0],
    status: transaction.pending ? "Pending" : "Verified",
  }));
  setTdCheckingTransactions(TDTrans);
}

  // Fetch TD Saving Transactions from Database
export async function fetchTDSavingTransactions(setTdSavingTransactions: Dispatch<SetStateAction<any[]>>) {
    // setIsLoading(true);
    const response = await axios.get("/api/mongoDB/fetchTDSavingTransactions");
    const TDTrans = response.data.map((transaction: any) => ({
      id: transaction.transactionId,
      date: new Date(transaction.date).toLocaleDateString("en-CA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      name: transaction.name ? transaction.name : "UnKnown",
      amount: transaction.amount,
      category: transaction.category[0],
      status: transaction.pending ? "Pending" : "Verified",
    }));
    // setIsLoading(false);
    setTdSavingTransactions(TDTrans);
  };
