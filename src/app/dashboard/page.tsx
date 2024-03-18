"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar/navbar";
import { Payment, getColumns } from "@/components/custom-table/columns";
import { DataTable } from "@/components/custom-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Loading from "./loading";
import { toast } from "sonner";
import { networkInterfaces } from "os";
// import PieChartComponent from "@/components/charts/pie";
// import LineChartComponent from "@/components/charts/line";

export default function Dashboard() {
  // const { session } = useSession();
  // const user_id = session?.user.id;
  // Uncomment this function to store the transactions in the database for the development environment
  // const getTrans = async () => {
  //   try {
  //     const response = await axios.get(
  //       `/api/plaid/transactions?userId=${user_id}`
  //       );
  //       console.log(response.data.latest_transactions);
  //     } catch (error) {
  //       console.error("There was an error!", error);
  //     }
  //   };
  // interface Transaction {
  //   id: string; // Assuming id is a string, adjust types accordingly
  //   date: Date; // Adjust according to the actual data type, e.g., string or Date
  //   transaction: string;
  //   amount: number;
  //   category: string;
  //   verified: boolean;
  // }

  const [transactions, setTransactions] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true); // Start loading
    try {
      // Fetch transactions from your API
      const fetchTransactions = async () => {
        const response = await axios.get(`/api/mongoDB/transactions`);
        const data = response.data;
        return data;
      };

      fetchTransactions().then((fulltransactions) => {
        const Columns = fulltransactions.map((transaction: any) => ({
          id: transaction.transactionId,
          date: transaction.date,
          transaction: transaction.merchantName || "",
          amount: transaction.amount,
          category: transaction.category[0],
          verified: transaction.pending,
        }));
        setTransactions(Columns);
      });
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 500);
    }
  }, []);

  const deleteTransaction = (transactionId: string) => {
    // finding the index of the transaction with the transactionId
    let deletedTransactionIndex = transactions.findIndex(
      (transaction: any) => transaction.id === transactionId
    );
    const deletedTransaction = transactions[deletedTransactionIndex];
    console.log("thi is the index", deletedTransactionIndex);

    // Delete transaction with the transactionId from the transactions array
    console.log("thi is the transaction originral: ", transactions);
    const newTransactions = transactions.filter(
      (transaction: any) => transaction.id !== transactionId
    );
    console.log("this is the transaction id", transactionId);

    setTransactions([...newTransactions]);
    console.log("this is the new transaction array", newTransactions);
    deleteTransactionFromBackend(
      transactionId,
      deletedTransaction,
      deletedTransactionIndex,
      newTransactions
    );
  };

  // This function is used to delete a transaction from the backend
  const deleteTransactionFromBackend = async (
    id: string,
    deletedTransaction: any = null,
    deletedTransactionIndex: number = 0,
    newTransactions: any = null
  ) => {
    const response = await axios.delete(
      `/api/mongoDB/deleteTransaction?transactionId=${id}`
    );
    const data = response.data;
    console.log("this is the new transactons array", newTransactions);

    toast(
      `Your ${
        data.transaction.merchantName ? data.transaction.merchantName : ""
      } transaction has been deleted`,
      {
        description: new Date().toLocaleString("en-US", {
          weekday: "long", // "Sunday"
          year: "numeric", // "2023"
          month: "long", // "December"
          day: "2-digit", // "03"
          hour: "numeric", // "9"
          minute: "2-digit", // "00"
          hour12: true, // AM/PM
        }),
        action: {
          label: "Undo",
          onClick: () =>
            restoreTransactionToBackend(
              deletedTransaction,
              deletedTransactionIndex,
              newTransactions,
              data.transaction
            ),
        },
      }
    ),
      console.log("This is the response", data.transaction);
  };

  const deleteAllSelectedRows = async (table: any) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;
    console.log("this is the selected rows", selectedRows);

    const deletedTransactionsWithIndex = selectedRows.map((row: any) => {
      const index = transactions.findIndex(
        (t: any) => t.id === (row.original as { id: string }).id
      );
      return {
        index,
        transaction: row.original,
      };
    });
    console.log(
      "this is the deleted transactions with indexes",
      deletedTransactionsWithIndex
    );

    // Now you can use deletedTransactionsWithIndex to filter out transactions or for other operations
    const newTransactions = transactions.filter(
      (transaction: any) =>
        !deletedTransactionsWithIndex.some(
          (item: any) => item.transaction.id === transaction.id
        )
    );

    setTransactions(newTransactions);

    await deleteMultipleTransactionsFromBackend(
      deletedTransactionsWithIndex,
      newTransactions
    );

    table.resetRowSelection();
  };

  const deleteMultipleTransactionsFromBackend = async (
    deletedTransactionsWithIndex: any,
    updatedTransactions: any
  ) => {
    try {
      console.log("before", deletedTransactionsWithIndex);
      const response = await axios.delete(
        "/api/mongoDB/deleteMultipleTransactions",
        {
          data: deletedTransactionsWithIndex,
        }
      );
      const fullDeletedTransactionData =
        response.data.fullDeletedTransactionData;
      console.log("this is the response from the backend", response.data);
      toast(`Multiple transactions have been deleted!`, {
        description: new Date().toLocaleString("en-US", {
          weekday: "long", // "Sunday"
          year: "numeric", // "2023"
          month: "long", // "December"
          day: "2-digit", // "03"
          hour: "numeric", // "9"
          minute: "2-digit", // "00"
          hour12: true, // AM/PM
        }),
        action: {
          label: "Undo",
          onClick: () =>
            restoreMultipleTransactionsToBackend(
              deletedTransactionsWithIndex,
              updatedTransactions,
              fullDeletedTransactionData
            ),
        },
      });
    } catch (error) {
      console.error("There was an error deleting the transaction!", error);
    }
  };

  const restoreMultipleTransactionsToBackend = async (
    deletedTransactionIndex: any,
    updatedTransactions: any,
    fullDeletedTransactionData: any
  ) => {
    let newTransactions = [...updatedTransactions];
    try {
      for (let i = 0; i < deletedTransactionIndex.length; i++) {
        const deletedTransaction = deletedTransactionIndex[i].transaction;
        newTransactions = [...newTransactions, deletedTransaction];
      }
      newTransactions.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions([...newTransactions]);
      for (let i = 0; i < fullDeletedTransactionData.length; i++) {
        const transaction = fullDeletedTransactionData[i];
        await axios.post("/api/mongoDB/postTransaction", transaction);
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

  const restoreTransactionToBackend = async (
    deletedTransaction: any,
    deletedTransactionIndex: number,
    newTransactions: any,
    originalTransaction: any
  ) => {
    try {
      // Putting the deleted transaction back into the transactions array
      // newTransactions.splice(deletedTransactionIndex, 0, deletedTransaction);
      // setTransactions([...newTransactions]);
      // Add the deleted transaction back into the transactions array without specifying an index
      const currentTransactions = [...transactions];
      console.log("these are the restore transactions", transactions);

      if (!currentTransactions.some((t) => t.id === deletedTransaction.id)) {
        newTransactions = [...newTransactions, deletedTransaction];

        // Sort the transactions array by the date property, from the most recent to the oldest
        newTransactions.sort(
          (a: any, b: any) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setTransactions(newTransactions);
      } else {
        setTransactions(currentTransactions);
      }

      // Update the transactions state with the newly sorted array

      // Putting the deleted transaction back into the database
      const response = await axios
        .post("/api/mongoDB/postTransaction", originalTransaction)
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

  // Getting the column data from the getColumns function
  const columns = getColumns(deleteTransaction);

  return (
    <Tabs defaultValue="transactions" className="">
      <div className="justify-center">
        <Navbar />
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="overview">OverView</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="balance">Balance</TabsTrigger>
          </TabsList>
        </div>
        <div className="bg-black p-8 pl-32">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Welcome back Parsa!
          </h1>
          <h1></h1>
          <p className="text-gray-400 text-xl md:text-2xl">
            Here is a list of your latest transactions!
          </p>
        </div>

        <div className="pl-12">
          <div className="pl-20 pr-20">
            <TabsContent value="transactions">
              {/* <Loading /> */}
              {isLoading || !transactions ? (
                <Loading />
              ) : (
                <DataTable
                  columns={columns}
                  data={transactions}
                  deleteAllSelectedRows={deleteAllSelectedRows}
                />
              )}
            </TabsContent>
            <br />

            {/* <div className="flex justify-center">
              <button
                onClick={getTrans}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Get Transactions
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </Tabs>
  );
}
