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
          transaction: transaction.merchantName,
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

    // Delete transaction with the transactionId from the transactions array
    const newTransactions = transactions.filter(
      (transaction: any) => transaction.id !== transactionId
    );

    setTransactions(newTransactions);
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
    deletedTransaction: any,
    deletedTransactionIndex: number,
    newTransactions: any
  ) => {
    const response = await axios.delete(
      `/api/mongoDB/deleteTransaction?transactionId=${id}`
    );
    const data = response.data;
    toast(
      `Your ${
        data.transaction.transaction ? data.transaction.transaction : ""
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

  const restoreTransactionToBackend = async (
    deletedTransaction: any,
    deletedTransactionIndex: number,
    newTransactions: any,
    originalTransaction: any
  ) => {
    try {
      // Putting the deleted transaction back into the transactions array
      newTransactions.splice(deletedTransactionIndex, 0, deletedTransaction);
      setTransactions([...newTransactions]);

      // Putting the deleted transaction back into the database
      const response = await axios.post(
        "/api/mongoDB/postTransaction",
        originalTransaction
      );
      const data = await response.data;
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
                <DataTable columns={columns} data={transactions} />
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
