"use client";

// General Imports
import axios from "axios";
import { toast } from "sonner";
import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Other Custom Components
import Navbar from "@/components/navbar/navbar";
import { DataTable } from "@/components/custom-table/data-table";
import { SelectDate } from "@/components/SelectDate/selectDate";
import { Payment, GetColumns } from "@/components/custom-table/columns";

// TD Components
import { Checking } from "@/components/balance/checkingTable";
import { SavingComponent } from "@/components/balance/saving";
import { CheckingComponent } from "@/components/balance/checking";

// API Calls
import {
  fetchBalances,
  useCIBCTransactions,
  fetchAllTDTransactions,
  fetchTDSavingTransactions,
  fetchTDCheckingTransactions,
} from "@/components/serverFunctions/apiCalls";

// Loading Components
import {
  TableLoading,
  ChartLoading,
  BalanceLoading,
  MonthYearLoading,
} from "@/components/loading/loading";

// Charts
import MyResponsivePie from "@/components/charts/donute";
import MonthlyBarChart from "@/components/charts/yearlyBarChart";
import HorizontalBarChart from "@/components/charts/horizontalBarChart";
import TdIncomeVsExpenseChart from "@/components/charts/expenseVsIncomeChart";

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
    DeleteAllSelectedRows,
    UpdateCIBCTransaction,
  }: any = useCIBCTransactions();

  // TD Transaction Varaiables
  const [allTDTransactions, setAllTDTransactions] = useState<Checking[]>([]);
  const [tdCheckingTransactions, setTdCheckingTransactions] = useState<
    Checking[]
  >([]);
  const [tdSavingTransactions, setTdSavingTransactions] = useState<Checking[]>(
    []
  );
  const [balances, setBalances] = useState<any>([]);
  const [isTdLoading, setIsTdLoading] = useState(true);

  // State for the active tab
  const [activeTab, setActiveTab] = useState("overview");

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  useEffect(() => {
    setIsLoading(true);
    try {
      fetchCIBCTransactions(true);
      fetchAllTDTransactions(setAllTDTransactions);
      fetchTDCheckingTransactions(setTdCheckingTransactions);
      fetchTDSavingTransactions(setTdSavingTransactions);
      fetchBalances(setBalances);
    } catch (error) {
      console.error("Failed to fetch Transactions:", error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
        setIsTdLoading(false);
      });
    }
  }, []);

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

  // Getting the column data from the getColumns function
  const columns = GetColumns(UpdateCIBCTransaction);

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
                    deleteAllSelectedRows={DeleteAllSelectedRows}
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
