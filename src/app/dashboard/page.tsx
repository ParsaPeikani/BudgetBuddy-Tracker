"use client";
import axios from "axios";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar/navbar";
import { Payment, getColumns } from "@/components/custom-table/columns";
import { Checking } from "@/components/balance/checkingTable";
import { DataTable } from "@/components/custom-table/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { CIBCTransactionsProvider } from "@/components/serverFunctions/apiCalls";
import { useCIBCTransactions } from "@/components/serverFunctions/apiCalls";
import TdIncomeVsExpenseChart from "@/components/charts/expenseVsIncomeChart";
import {
  fetchTDCheckingTransactions,
  fetchAllTDTransactions,
  fetchTDSavingTransactions,
  fetchBalances,
} from "@/components/serverFunctions/apiCalls";
import {
  TableLoading,
  ChartLoading,
  BalanceLoading,
  MonthYearLoading,
} from "@/components/loading/loading";
import { toast } from "sonner";
import HorizontalBarChart from "@/components/charts/horizontalBarChart";
import { CheckingComponent } from "@/components/balance/checking";
import { SavingComponent } from "@/components/balance/saving";

import MyResponsivePie from "@/components/charts/donute";
import MonthlyBarChart from "@/components/charts/yearlyBarChart";
import { SelectDate } from "@/components/SelectDate/selectDate";

export default function Dashboard() {
  const { session } = useSession();
  const user_id = session?.user.id;
  const {
    fetchCIBCTransactions,
    isLoading,
    month,
    year,
    setCIBCTransactions,
    setIsLoading,
    CIBCTransactions,
    setMonth,
    setYear,
  }: any = useCIBCTransactions();
  // Uncomment this function to store the transactions in the database for the development environment
  // const getTrans = async () => {
  //   try {
  //     const response = await axios.get(
  //       `/api/plaid/transactions?userId=${user_id}`
  //     );
  //   } catch (error) {
  //     console.error("There was an error!", error);
  //   }
  // }

  // TD Transaction Varaiables
  const [allTDTransactions, setAllTDTransactions] = useState<Checking[]>([]);
  const [tdCheckingTransactions, setTdCheckingTransactions] = useState<
    Checking[]
  >([]);
  const [tdSavingTransactions, setTdSavingTransactions] = useState<Checking[]>(
    []
  );
  const [balances, setBalances] = useState<any>([]);

  // CIBC Transaction Variables
  // const [CIBCTransactions, setCIBCTransactions] = useState<Payment[]>([]);

  // State for the month and year
  // const [month, setMonth] = useState<string>();
  // const [year, setYear] = useState<string>();

  // State for the loading for both CIBC and TD CIBCTransactions
  // const [isLoading, setIsLoading] = useState(true);
  const [isTdLoading, setIsTdLoading] = useState(true);

  // State for the active tab
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  useEffect(() => {
    console.log("hello");
    setIsLoading(true); // Start loading
    // setIsTdLoading(true);
    try {
      fetchCIBCTransactions(true);
      // fetchCIBCTransactions(
      //   setIsLoading,
      //   setMonth,
      //   setYear,
      //   setCIBCTransactions
      // );
      fetchAllTDTransactions(setAllTDTransactions);
      fetchTDCheckingTransactions(setTdCheckingTransactions);
      fetchTDSavingTransactions(setTdSavingTransactions);
      fetchBalances(setBalances);
    } catch (error) {
      console.error("Failed to fetch CIBCTransactions:", error);
    } finally {
      console.log("hello 2");
      setTimeout(() => {
        setIsLoading(false);
        setIsTdLoading(false);
      });
    }
  }, []);

  const deleteTransaction = (transactionId: string) => {
    // finding the index of the transaction with the transactionId
    const deletedTransaction = CIBCTransactions.find(
      (transaction: any) => transaction.id === transactionId
    );

    // Delete transaction with the transactionId from the CIBCTransactions array
    const newTransactions = CIBCTransactions.filter(
      (transaction: any) => transaction.id !== transactionId
    );

    setCIBCTransactions([...newTransactions]);
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
      const currentTransactions = [...CIBCTransactions];

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

    // Now you can use deletedTransactions to filter out CIBCTransactions or for other operations
    const newTransactions = CIBCTransactions.filter(
      (transaction: any) =>
        !deletedTransactions.some((item: any) => item.id === transaction.id)
    );

    setCIBCTransactions(newTransactions);

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
      setCIBCTransactions([...newTransactions]);

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
    CIBCTransactions.map((transaction: any) => {
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

  const getNewTransactions = async (data: any) => {
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

  // Getting the column data from the getColumns function
  const columns = getColumns(deleteTransaction, updateTransaction);

  return (
    <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="">
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
            {activeTab !== "balance" && (
              <div className="flex justify-center pt-5">
                <SelectDate
                  getNewTransactions={getNewTransactions}
                  fetchTransactions={fetchCIBCTransactions}
                  showAllTransactions
                />
              </div>
            )}
            <TabsContent value="overview">
              <div className="flex justify-between bg-black p-8 lg:pl-20 md:pl-10">
                <div className="-mt-40">
                  <h1 className="text-white lg:text-5xl md:text-3xl font-bold mb-4 pt-24">
                    Welcome back Parsa!
                  </h1>
                  <p className="text-gray-400 lg:text-2xl md:text-md">
                    Here are your CIBC transaction Charts :)
                  </p>
                </div>
                {isLoading ? (
                  <MonthYearLoading />
                ) : (
                  <div className="flex justify-center -mt-40 w-2/6 pt-24">
                    {month !== "" && (
                      <h1 className="text-stroke lg:text-6xl md:text-4xl font-extrabold mb-4 pr-10 tracking-tight transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                        {month}
                      </h1>
                    )}
                    {year !== "" && (
                      <p className="text-stroke lg:text-6xl md:text-4xl font-extrabold mb-4 tracking-tight transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                        {year}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="item-center">
                <div className="shadow-xl rounded-lg overflow-hidden mx-10">
                  <div className="p-12 border-2 border-white glow rounded-lg bg-gray-950">
                    <MonthlyBarChart
                      transactions={CIBCTransactions}
                      month={month || ""}
                      year={year || ""}
                      isLoading={isLoading}
                    />
                  </div>
                </div>

                {isLoading ? (
                  <div className="w-full flex justify-center items-center">
                    <ChartLoading />
                  </div>
                ) : (
                  <div className="flex justify-center mt-20 mr-5 ml-5">
                    <div className="w-1/2 mx-5">
                      <div className="shadow-xl rounded-lg overflow-hidden">
                        <div className="pt-5 pb-5 border-2 border-white glow rounded-lg bg-gray-950">
                          <HorizontalBarChart
                            transactions={CIBCTransactions}
                            month={month || ""}
                            year={year || ""}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2 mx-5">
                      <div className="shadow-xl rounded-lg overflow-hidden">
                        <div className="p-10 border-2 border-white glow rounded-lg bg-gray-950">
                          {/* <MyResponsivePie data={CIBCTransactions} /> */}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="transactions">
              <div className="flex justify-between bg-black p-8 lg:pl-20 md:pl-10">
                <div className="-mt-40">
                  <h1 className="text-white lg:text-5xl md:text-3xl font-bold mb-4 pt-24">
                    Welcome back Parsa!
                  </h1>
                  <p className="text-gray-400 lg:text-2xl md:text-md">
                    Here is a list of your CIBC Credit Card transactions :)
                  </p>
                </div>
                <div className="flex justify-center -mt-40 w-2/6 pt-24">
                  {month !== "" && (
                    <h1 className="text-stroke lg:text-6xl md:text-4xl font-extrabold mb-4 pr-10 tracking-tight transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                      {month}
                    </h1>
                  )}
                  {year !== "" && (
                    <p className="text-stroke lg:text-6xl md:text-4xl font-extrabold mb-4 tracking-tight transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                      {year}
                    </p>
                  )}
                </div>
              </div>
              <div className="lg:pl-20 lg:pr-20 md:pl-10 md:pr-10">
                {isLoading || !CIBCTransactions ? (
                  <TableLoading />
                ) : (
                  <DataTable
                    columns={columns}
                    data={CIBCTransactions}
                    deleteAllSelectedRows={deleteAllSelectedRows}
                  />
                )}
              </div>
            </TabsContent>
            <TabsContent value="balance">
              {isTdLoading ? (
                <BalanceLoading />
              ) : (
                <>
                  <div className="flex flex-col items-center justify-center mb-8">
                    <div className="flex flex-col items-center justify-center text-white mt-10 border border-white bg-gray-950 rounded-lg w-[30%]">
                      <h1 className="text-6xl font-bold mt-8">
                        {balances[0]?.account?.balances?.available +
                          balances[1]?.account?.balances?.available || 0}
                      </h1>
                      <p className="text-gray-400 text-2xl mb-10">
                        This is your current TD balance 🤫
                      </p>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-center pt-5">
                      <SelectDate
                        getNewTransactions={getNewTransactions}
                        fetchTransactions={fetchCIBCTransactions}
                        showAllTransactions={false}
                      />
                    </div>
                    <div className="shadow-xl rounded-lg overflow-hidden mx-10">
                      <div className="p-12 border-2 border-white glow rounded-lg bg-gray-950">
                        <TdIncomeVsExpenseChart
                          transactions={allTDTransactions}
                          month={month || ""}
                          year={year || ""}
                          isLoading={isLoading}
                        />
                      </div>
                    </div>
                  </div>

                  {/* <div className="flex justify-center">
                    <CheckingComponent
                      account={balances[0]?.account}
                      transactions={tdCheckingTransactions}
                    />
                    <SavingComponent
                      account={balances[1]?.account}
                      transactions={tdSavingTransactions}
                    />
                  </div> */}
                </>
              )}
            </TabsContent>
            <br />

            {/* <div className="flex justify-center">
              <button
                onClick={postTrans}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Post Transactions
              </button>
            </div> */}
          </div>
        </div>
      </div>
    </Tabs>
  );
}
