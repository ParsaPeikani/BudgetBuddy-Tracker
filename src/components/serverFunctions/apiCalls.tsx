import axios from "axios";
import { Dispatch, SetStateAction } from "react";
import { Checking } from "../balance/checkingTable";
import { Payment } from "@/components/custom-table/columns";
import React, { createContext, useState, useContext, useCallback } from "react";
import { toast } from "sonner";
import { Delete } from "lucide-react";

///////////////////////////////////TD Transactions/////////////////////////////////////

// Fetch All TD Transcations
export async function FetchAllTDTransactions(
  lastYear: boolean,
  setAllTDTransactions: Dispatch<SetStateAction<any[]>>
) {
  const response = await axios.get("/api/mongoDB/fetchAllTDTransactions", {
    params: { lastYear },
  });
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
  date: string;
  transaction: string;
  amount: number;
  category: string;
  verified: string;
}

// Fetch CIBCTransactions from the database

const CIBCTransactionsContext = createContext({
  CIBCTransactions: [] as CIBCTransaction[],
  isLoading: false,
  month: "",
  year: "",
  FetchCIBCTransactions: () => {},
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
    deletedTransaction: CIBCTransaction | undefined,
    newTransactions: CIBCTransaction[],
    originalTransaction: any
  ) => {},
  DeleteAllSelectedRows: (table: any) => {},
  DeleteMultipleCIBCTransactionsFromBackend: (
    deletedTransactions: CIBCTransaction[],
    updatedTransactions: CIBCTransaction[]
  ) => {},
  RestoreMultipleCIBCTransactions: (
    deletedTransactions: CIBCTransaction[],
    updatedTransactions: CIBCTransaction[],
    fullDeletedTransactionData: CIBCTransaction[]
  ) => {},
  UpdateCIBCTransaction: (data: any) => {},
  GetNewCIBCTransactions: (data: any) => {},
});

export const CIBCTransactionsProvider = ({ children }: { children: any }) => {
  const [CIBCTransactions, setCIBCTransactions] = useState<CIBCTransaction[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");

  // Fetching CIBC Transactions from the database
  const FetchCIBCTransactions = useCallback(
    async (latestYear = true) => {
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
    },
    [setCIBCTransactions, setIsLoading, setMonth, setYear]
  ); // include all setters and other dependencies

  // Delete a CIBC Transaction form Frontend
  const DeleteCIBCTransaction = (transactionId: string) => {
    // finding the index of the transaction with the transactionId
    const deletedTransaction = CIBCTransactions.find(
      (transaction: CIBCTransaction) => transaction.id === transactionId
    );

    // Delete transaction with the transactionId from the CIBCTransactions array
    const newTransactions = CIBCTransactions.filter(
      (transaction: CIBCTransaction) => transaction.id !== transactionId
    );

    setCIBCTransactions([...newTransactions]);
    DeleteCIBCTransactionFromBackend(
      transactionId,
      deletedTransaction,
      newTransactions
    );
  };

  // Delete a CIBC Transaction from the backend
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
              deletedTransaction as CIBCTransaction,
              newTransactions,
              data.transaction
            ),
        },
      }
    );
  };

  // Restore a CIBC Transaction both from the frontend and backend
  const RestoreCIBCTransaction = async (
    deletedTransaction: CIBCTransaction | undefined,
    newTransactions: CIBCTransaction[],
    originalTransaction: any
  ) => {
    try {
      const currentTransactions = [...CIBCTransactions];

      if (!currentTransactions.some((t) => t.id === deletedTransaction?.id)) {
        newTransactions = [
          ...newTransactions,
          deletedTransaction as CIBCTransaction,
        ];

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
                deletedTransaction?.transaction
                  ? deletedTransaction.transaction
                  : ""
              } transaction has been restored :)`,
              {
                position: "top-center",
                style: {
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                },
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

  // Delete Mutliple CIBC Transactions from the frontend
  const DeleteAllSelectedRows = async (table: any) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    const deletedTransactions = selectedRows.map((row: any) => {
      return row.original;
    });

    // Now you can use deletedTransactions to filter out CIBCTransactions or for other operations
    const newTransactions = CIBCTransactions.filter(
      (transaction: CIBCTransaction) =>
        !deletedTransactions.some(
          (item: CIBCTransaction) => item.id === transaction.id
        )
    );

    setCIBCTransactions(newTransactions);

    await DeleteMultipleCIBCTransactionsFromBackend(
      deletedTransactions,
      newTransactions
    );

    table.resetRowSelection();
  };

  // Delete Mutliple CIBC Transactions from the backend
  const DeleteMultipleCIBCTransactionsFromBackend = async (
    deletedTransactions: CIBCTransaction[],
    updatedTransactions: CIBCTransaction[]
  ) => {
    try {
      const response = await axios.delete(
        "/api/mongoDB/deleteMultipleTransactions",
        {
          data: deletedTransactions,
        }
      );
      const fullDeletedTransactionData =
        response.data.fullDeletedTransactionData;
      toast(`Multiple transactions have been deleted!`, {
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
            RestoreMultipleCIBCTransactions(
              deletedTransactions,
              updatedTransactions,
              fullDeletedTransactionData
            ),
        },
      });
    } catch (error) {
      console.error("There was an error deleting the transaction!", error);
    }
  };

  // Restore Mutliple CIBC Transactions from both the frontend and backend
  const RestoreMultipleCIBCTransactions = async (
    deletedTransactions: CIBCTransaction[],
    updatedTransactions: CIBCTransaction[],
    fullDeletedTransactionData: any
  ) => {
    try {
      let newTransactions = [...updatedTransactions, ...deletedTransactions];
      newTransactions.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setCIBCTransactions([...newTransactions]);

      for (const deletedTransaction of fullDeletedTransactionData) {
        await axios.post("/api/mongoDB/postTransactions", deletedTransaction);
      }
      toast(`Multiple transactions have been restored :)`, {
        position: "top-center",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }, // Centering the text
      });
    } catch (e) {
      console.error("There was an error storing the transaction from Undo!", e);
    }
  };

  // Update a CIBC Transaction on the frontend and backend
  const UpdateCIBCTransaction = async (data: any) => {
    CIBCTransactions.map((transaction: CIBCTransaction) => {
      if (transaction.id === data.id) {
        transaction.transaction = data.name;
        transaction.amount = data.amount;
        transaction.date = new Date(data.date).toLocaleDateString();
        transaction.category = data.category;
        transaction.verified = data.verified ? "Verified" : "Pending";
      }
    });
    setCIBCTransactions([...CIBCTransactions]);
    try {
      await axios.post("/api/mongoDB/updateCIBCTransaction", data);
      toast(`${data.name ? data.name : ""} Transaction has been updated :)`, {
        position: "top-center",
        style: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }, // Centering the text
      });
    } catch (error) {
      console.error("There was an error updating the transaction!", error);
    }
  };

  // Fetch new CIBC Transactions based on the year and month from the database
  const GetNewCIBCTransactions = async (data: any) => {
    setIsLoading(true);
    try {
      await axios
        .get(
          `/api/mongoDB/newTransactions?year=${data.year}&month=${data.month}`
        )
        .then((newdata) => {
          const newColumns = newdata.data.map((transaction: any) => ({
            id: transaction.transactionId,
            date: new Date(transaction.date).toLocaleDateString("en-CA", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
            }),
            transaction: transaction.merchantName
              ? transaction.merchantName
              : "UnKnown",
            amount: transaction.amount,
            category: transaction.category[0],
            verified: transaction.pending ? "Pending" : "Verified",
          }));
          setCIBCTransactions(newColumns);
          setMonth(data.month);
          setYear(data.year);
          setIsLoading(false);
        });
    } catch (error) {
      console.error("There was an error fetching the transactions!", error);
    }
  };

  return (
    <CIBCTransactionsContext.Provider
      value={{
        CIBCTransactions,
        isLoading,
        month,
        year,
        FetchCIBCTransactions,
        setCIBCTransactions,
        setIsLoading,
        setMonth,
        setYear,
        DeleteCIBCTransaction,
        DeleteCIBCTransactionFromBackend,
        DeleteAllSelectedRows,
        RestoreCIBCTransaction,
        DeleteMultipleCIBCTransactionsFromBackend,
        RestoreMultipleCIBCTransactions,
        UpdateCIBCTransaction,
        GetNewCIBCTransactions,
      }}
    >
      {children}
    </CIBCTransactionsContext.Provider>
  );
};

export const useCIBCTransactions = () => useContext(CIBCTransactionsContext);

///////////////////////////////////PLAID Transactions/////////////////////////////////////
// Uncomment this function to store the transactions in the database for the development environment

// const postTrans = async () => {
//   try {
//     const response = await axios.get("/api/plaid/balance");
//     console.log("Transactions have been posted successfully!", response.data);
//     // toast("Transactions have been posted successfully!", {
//     //   position: "top-center",
//     //   style: {
//     //     display: "flex",
//     //     justifyContent: "center",
//     //     alignItems: "center",
//     //   }, // Centering the text
//     // });
//   } catch (error) {
//     console.error("There was an error getting the transactions!", error);
//   }
// };

// const getTrans = async () => {
//   try {
//     const response = await axios.get(
//       `/api/plaid/transactions?userId=${user_id}`
//     );
//   } catch (error) {
//     console.error("There was an error!", error);
//   }
// }
