import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { Checking } from "../balance/checkingTable";
import { Payment } from "@/components/custom-table/columns";
import React, { createContext, useState, useContext, useCallback } from "react";

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
export async function fetchTDSavingTransactions(
  setTdSavingTransactions: Dispatch<SetStateAction<any[]>>
) {
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
  setTdSavingTransactions(TDTrans);
}

// Fetch TD Checking and Saving TD balances
export async function fetchBalances(
  setBalances: Dispatch<SetStateAction<any>>
) {
  try {
    const response = await axios.get("/api/mongoDB/fetchBalances");
    setBalances(response.data);
  } catch (error) {
    console.error("Failed to fetch balances:", error);
  }
}

///////////////////////////////////CIBC Transactions/////////////////////////////////////

interface CIBCTransaction {
  id: string;
  date: Date;
  transaction: string;
  amount: number;
  category: string;
  verified: boolean;
}

// Fetch CIBCTransactions from the database

const CIBCTransactionsContext = createContext({
  CIBCTransactions: [] as CIBCTransaction[],
  isLoading: false,
  month: "",
  year: "",
  fetchCIBCTransactions: () => {},
  setCIBCTransactions: (transactions: CIBCTransaction[]) => {},
  setIsLoading: (value: boolean) => {},
  setMonth: (month: string) => {},
  setYear: (year: string) => {},
});

export const CIBCTransactionsProvider = ({ children }: { children: any }) => {
  const [CIBCTransactions, setCIBCTransactions] = useState<CIBCTransaction[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  const fetchCIBCTransactions = async (latestYear = true) => {
    setIsLoading(true);
    try {
      const response = await axios.get("/api/mongoDB/fetchCIBCTransactions", {
        params: { latestYear },
      });
      const transformedData = response.data.map((transaction: any) => ({
        id: transaction.transactionId,
        date: new Date(transaction.date).toLocaleDateString("en-CA", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }),
        transaction: transaction.merchantName || "Unknown",
        amount: transaction.amount,
        category: transaction.category[0],
        verified: transaction.pending ? "Pending" : "Verified",
      }));
      setCIBCTransactions(transformedData);
      if (!latestYear) {
        setMonth("All");
        setYear("Transactions");
      } else {
        setMonth("");
        setYear(new Date().getFullYear().toString());
      }
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CIBCTransactionsContext.Provider
      value={{
        CIBCTransactions,
        isLoading,
        month,
        year,
        fetchCIBCTransactions,
        setCIBCTransactions,
        setIsLoading,
        setMonth,
        setYear,
      }}
    >
      {children}
    </CIBCTransactionsContext.Provider>
  );
};

export const useCIBCTransactions = () => useContext(CIBCTransactionsContext);

// export async function fetchCIBCTransactions(
//   latestYear: boolean = true,
//   setIsLoading: Dispatch<SetStateAction<boolean>>,
//   setMonth: Dispatch<SetStateAction<string | undefined>>,
//   setYear: Dispatch<SetStateAction<string | undefined>>,
//   setCIBCTransactions: Dispatch<SetStateAction<Payment[]>>
// ) {
//   if (setIsLoading) {
//     setIsLoading(true);
//   }

//   const response = await axios.get("/api/mongoDB/fetchCIBCTransactions", {
//     params: {
//       latestYear: latestYear,
//     },
//   });
//   const Columns = response.data.map((transaction: any) => ({
//     id: transaction.transactionId,
//     date: new Date(transaction.date).toLocaleDateString("en-CA", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     }),
//     transaction: transaction.merchantName
//       ? transaction.merchantName
//       : "UnKnown",
//     amount: transaction.amount,
//     category: transaction.category[0],
//     verified: transaction.pending ? "Pending" : "Verified",
//   }));

//   if (!latestYear && setMonth && setYear) {
//     setMonth("All");
//     setYear("Transactions");
//   } else if (setMonth && setYear) {
//     setMonth("");
//     setYear(new Date().getFullYear().toString());
//   }

//   if (setIsLoading) {
//     setIsLoading(false);
//   }

//   if (setCIBCTransactions) {
//     setCIBCTransactions(Columns);
//   }
// }
