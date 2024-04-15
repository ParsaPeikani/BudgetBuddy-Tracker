"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar/navbar";
import { Payment, getColumns } from "@/components/custom-table/columns";
import { DataTable } from "@/components/custom-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@clerk/nextjs";
import { Suspense, useEffect, useState } from "react";
import { TableLoading } from "@/components/loading/loading";
import { ChartLoading } from "@/components/loading/loading";
import { toast } from "sonner";
import renderLineChart from "@/components/charts/lineChart";
import dynamic from "next/dynamic";
import MyResponsivePie from "@/components/charts/donute";
import { SelectDate } from "@/components/SelectDate/selectDate";

const DynamicLineChart = dynamic(
  () => import("@/components/charts/lineChart"), // No need to destructure
  { ssr: false }
);

export default function Dashboard() {
  const { session } = useSession();
  const user_id = session?.user.id;
  // Uncomment this function to store the transactions in the database for the development environment
  const getTrans = async () => {
    try {
      const response = await axios.get(
        `/api/plaid/transactions?userId=${user_id}`
      );
      console.log(response.data.latest_transactions);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };
  interface Transaction {
    id: string; // Assuming id is a string, adjust types accordingly
    date: Date; // Adjust according to the actual data type, e.g., string or Date
    transaction: string;
    amount: number;
    category: string;
    verified: boolean;
  }

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
          date: new Date(transaction.date).toLocaleDateString(),
          transaction: transaction.merchantName
            ? transaction.merchantName
            : "UnKnown",
          amount: transaction.amount,
          category: transaction.category[0],
          verified: transaction.pending ? "Pending" : "Verified",
        }));
        setTransactions(Columns);
      });
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      });
    }
  }, []);

  const deleteTransaction = (transactionId: string) => {
    // finding the index of the transaction with the transactionId
    const deletedTransaction = transactions.find(
      (transaction: any) => transaction.id === transactionId
    );

    // Delete transaction with the transactionId from the transactions array
    const newTransactions = transactions.filter(
      (transaction: any) => transaction.id !== transactionId
    );

    setTransactions([...newTransactions]);
    deleteTransactionFromBackend(
      transactionId,
      deletedTransaction,
      newTransactions
    );
  };

  // This function is used to delete a transaction from the backend
  const deleteTransactionFromBackend = async (
    id: string,
    deletedTransaction: any = null,
    newTransactions: any = null
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
              newTransactions,
              data.transaction
            ),
        },
      }
    );
  };

  const restoreTransactionToBackend = async (
    deletedTransaction: any,
    newTransactions: any,
    originalTransaction: any
  ) => {
    try {
      const currentTransactions = [...transactions];

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

  const deleteAllSelectedRows = async (table: any) => {
    const selectedRows = table.getFilteredSelectedRowModel().rows;

    const deletedTransactions = selectedRows.map((row: any) => {
      return row.original;
    });

    // Now you can use deletedTransactions to filter out transactions or for other operations
    const newTransactions = transactions.filter(
      (transaction: any) =>
        !deletedTransactions.some((item: any) => item.id === transaction.id)
    );

    setTransactions(newTransactions);

    await deleteMultipleTransactionsFromBackend(
      deletedTransactions,
      newTransactions
    );

    table.resetRowSelection();
  };

  const deleteMultipleTransactionsFromBackend = async (
    deletedTransactions: any,
    updatedTransactions: any
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

  const restoreMultipleTransactionsToBackend = async (
    deletedTransactions: any,
    updatedTransactions: any,
    fullDeletedTransactionData: any
  ) => {
    try {
      let newTransactions = [...updatedTransactions, ...deletedTransactions];
      newTransactions.sort(
        (a: any, b: any) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      setTransactions([...newTransactions]);

      for (const deletedTransaction of fullDeletedTransactionData) {
        await axios.post("/api/mongoDB/postTransaction", deletedTransaction);
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

  const updateTransaction = async (data: any) => {
    transactions.map((transaction: any) => {
      if (transaction.id === data.id) {
        transaction.transaction = data.name;
        transaction.amount = data.amount;
        transaction.date = new Date(data.date).toLocaleDateString();
        transaction.category = data.category;
        transaction.verified = data.verified ? "Verified" : "Pending";
      }
    });
    setTransactions([...transactions]);
    try {
      await axios.post("/api/mongoDB/updateTransaction", data);
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

  // Getting the column data from the getColumns function
  const columns = getColumns(deleteTransaction, updateTransaction);

  return (
    <Tabs defaultValue="overview" className="">
      <div className="justify-center">
        <Navbar />
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="overview">OverView</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="balance">Balance</TabsTrigger>
          </TabsList>
        </div>

        <div>
          <div>
            <TabsContent value="balance">
              <div className="flex justify-between bg-black p-8 pl-20">
                <div>
                  <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
                    Welcome back Parsa!
                  </h1>
                  <p className="text-gray-400 text-xl md:text-2xl">
                    Here is your current balance 🤫
                  </p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="overview">
              <div className="flex justify-between bg-black p-8 pl-20">
                <div>
                  <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
                    Welcome back Parsa!
                  </h1>
                  <p className="text-gray-400 text-xl md:text-2xl">
                    Here are your charts :)
                  </p>
                </div>
                <SelectDate />
              </div>
              <div className="flex justify-between">
                {isLoading ? (
                  <div className="w-full flex justify-center items-center">
                    <ChartLoading />
                  </div>
                ) : (
                  <>
                    <div className="flex-1 flex justify-left w-1/2">
                      <DynamicLineChart transactions={transactions} />
                    </div>
                    <div className="flex-1 w-1/2">
                      <MyResponsivePie data={transactions} />
                    </div>
                  </>
                )}
              </div>
            </TabsContent>

            <TabsContent value="transactions">
              <div className="bg-black p-8 pl-20">
                <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
                  Welcome back Parsa!
                </h1>
                <p className="text-gray-400 text-xl md:text-2xl">
                  Here is a list of your latest transactions!
                </p>
              </div>
              {/* <div className="pl-20 pr-20">
                  <DataTable
                    columns={columns}
                    data={transactions}
                    deleteAllSelectedRows={deleteAllSelectedRows}
                  />
                </div> */}
              <div className="pl-20 pr-20">
                {isLoading || !transactions ? (
                  <TableLoading />
                ) : (
                  <DataTable
                    columns={columns}
                    data={transactions}
                    deleteAllSelectedRows={deleteAllSelectedRows}
                  />
                )}
              </div>
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
