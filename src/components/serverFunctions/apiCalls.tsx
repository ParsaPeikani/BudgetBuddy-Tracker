import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { Checking } from "../balance/checkingTable";
import { Payment } from "@/components/custom-table/columns";
import React, { createContext, useState, useContext, useCallback } from "react";
import { toast } from "sonner";
import { Delete } from "lucide-react";

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
  DeleteCIBCTransaction: (transactionId: string) => {},
  DeleteCIBCTransactionFromBackend: (
    id: string,
    deletedTransaction: CIBCTransaction | undefined,
    newTransactions: CIBCTransaction[]
  ) => {},
  RestoreCIBCTransaction: (
    deletedTransaction: any,
    newTransactions: any,
    originalTransaction: any
  ) => {},
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

  const DeleteCIBCTransaction = (transactionId: string) => {
    // finding the index of the transaction with the transactionId
    const deletedTransaction = CIBCTransactions.find(
      (transaction: any) => transaction.id === transactionId
    );

    // Delete transaction with the transactionId from the CIBCTransactions array
    const newTransactions = CIBCTransactions.filter(
      (transaction: any) => transaction.id !== transactionId
    );

    setCIBCTransactions([...newTransactions]);
    DeleteCIBCTransactionFromBackend(
      transactionId,
      deletedTransaction,
      newTransactions
    );
  };

  const DeleteCIBCTransactionFromBackend = async (
    id: string,
    deletedTransaction: CIBCTransaction | undefined,
    newTransactions: CIBCTransaction[]
  ) => {
    const response = await axios.delete(
      `/api/mongoDB/deleteTransaction?transactionId=${id}`
    );
    const data = response.data;

    toast(
      `Your ${
        data.transaction.merchantName ? data.transaction.merchantName : ""
      } transaction has been deleted`,
      {
        description: new Date().toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "2-digit",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        }),
        action: {
          label: "Undo",
          onClick: () =>
            RestoreCIBCTransaction(
              deletedTransaction,
              newTransactions,
              data.transaction
            ),
        },
      }
    );
  };

  const RestoreCIBCTransaction = async (
    deletedTransaction: any,
    newTransactions: any,
    originalTransaction: any
  ) => {
    try {
      const currentTransactions = [...CIBCTransactions];
      console.log("hello I am gettin ghere");

      if (!currentTransactions.some((t) => t.id === deletedTransaction.id)) {
        newTransactions = [...newTransactions, deletedTransaction];

        // Sort the CIBCTransactions array by the date property, from the most recent to the oldest
        newTransactions.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setCIBCTransactions(newTransactions);
      } else {
        setCIBCTransactions(currentTransactions);
      }
      // Putting the deleted transaction back into the database
      const response = await axios
        .post("/api/mongoDB/postTransactions", originalTransaction)
        .then(() => {
          {
            toast(
              `Your ${
                deletedTransaction.transaction
                  ? deletedTransaction.transaction
                  : ""
              } transaction has been restored :)`,
              {
                position: "top-center",
                style: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }, // Centering the text
              }
            );
          }
        });
    } catch (error) {
      console.error(
        "There was an error storing the transaction from Undo!",
        error
      );
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
        DeleteCIBCTransaction,
        DeleteCIBCTransactionFromBackend,
        RestoreCIBCTransaction,
      }}
    >
      {children}
    </CIBCTransactionsContext.Provider>
  );
};

export const useCIBCTransactions = () => useContext(CIBCTransactionsContext);
