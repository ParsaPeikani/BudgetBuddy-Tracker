"use client";

// General Imports
import axios from "axios";
import { useChat } from "ai/react";
import { useSession } from "@clerk/nextjs";
import { UserButton } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Other Custom Components
import ChatBubble from "@/components/ChatBubble";
import Navbar from "@/components/navbar/navbar";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom-table/data-table";
import { SelectDate } from "@/components/SelectDate/selectDate";
import { TDSelectDate } from "@/components/SelectDate/TdSelectDate";
import { Payment, GetColumns } from "@/components/custom-table/columns";

// TD Components
import { SavingComponent } from "@/components/balance/saving";
import { CheckingComponent } from "@/components/balance/checking";

// API Calls
import {
  usePostTrans,
  useCIBCTransactions,
  useTDTransactions,
  useOpenAI,
} from "@/components/serverFunctions/apiCalls";

// Loading Components
import {
  TableLoading,
  ChartLoading,
  BalanceLoading,
  GetDataLoading,
  MonthYearLoading,
  TotalSpentLoading,
  BalanceMonthYearLoading,
} from "@/components/loading/loading";

// Charts
import MyResponsivePie from "@/components/charts/donute";
import MonthlyBarChart from "@/components/charts/yearlyBarChart";
import HorizontalBarChart from "@/components/charts/horizontalBarChart";
import TdIncomeVsExpenseChart from "@/components/charts/expenseVsIncomeChart";
import { User } from "lucide-react";

// User Id
let parsa_id = process.env.NEXT_PUBLIC_MY_USER_ID;

export default function Dashboard() {
  // Making sure if the user is authorized or not
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  // Clerk Session
  const { session } = useSession();
  const user_id = session?.user.id;

  // Post Transaction Function from custom Hook
  // const postTrans = usePostTrans();

  // CIBC Transaction Variables
  const {
    FetchCIBCTransactions,
    isLoading,
    month,
    year,
    setIsLoading,
    CIBCTransactions,
    DeleteAllSelectedRows,
    UpdateCIBCTransaction,
    BalanceCIBCTransactions,
    totalSpent,
  }: any = useCIBCTransactions();

  // TD Transaction Variables
  const {
    FetchAllTDTransactions,
    FetchTDCheckingTransactions,
    FetchTDSavingTransactions,
    FetchBalances,
    AllTDTransactions,
    TDmonth,
    TDyear,
    TdCheckingTransactions,
    TdSavingTransactions,
    Balances,
    isTdLoading,
    setIsTdLoading,
  }: any = useTDTransactions();

  const { BudgetProChat, BudgetProSummary, openAIResponse }: any = useOpenAI();

  // State for the active tab
  const [activeTab, setActiveTab] = useState("transactions");
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (user_id) {
      const checkAuth = async () => {
        try {
          const response = await axios.get("/api/auth/check-auth", {
            params: { user_id }, // Use params instead of data for GET requests
          });
          setIsAuthorized(response.data.authorized);
        } catch (error) {
          setIsAuthorized(false);
        }
      };

      checkAuth();
    }
  }, [user_id]);

  useEffect(() => {
    if (user_id && parsa_id && user_id === parsa_id) {
      try {
        FetchCIBCTransactions(true);
        FetchAllTDTransactions(true);
        FetchTDCheckingTransactions();
        FetchTDSavingTransactions();
        FetchBalances();
      } catch (error) {
        console.error("Failed to fetch Transactions:", error);
      } finally {
        setTimeout(() => {
          setIsTdLoading(false);
        });
      }
    }
  }, [
    FetchCIBCTransactions,
    setIsLoading,
    FetchAllTDTransactions,
    FetchTDCheckingTransactions,
    FetchTDSavingTransactions,
    FetchBalances,
    setIsTdLoading,
    user_id,
  ]);

  // Getting the column data from the getColumns function
  const columns = GetColumns(UpdateCIBCTransaction);

  if (isAuthorized === null) {
    return <GetDataLoading />;
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        <div className="text-center max-w-lg p-6">
          <h1 className="text-5xl font-bold mb-4">Access Denied</h1>
          <p className="text-2xl">
            You are Not Parsa Peikai. You are not allowed to be here 😠
          </p>

          <div className="flex items-center p-4 justify-center">
            <h1 className="pr-4 text-lg">Please Sign Out Here</h1>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Tabs defaultValue={activeTab} onValueChange={handleTabChange} className="">
      <div className="justify-center">
        <Navbar />
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="overview">OverView</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="balance">Balance</TabsTrigger>
            <TabsTrigger value="ai">Ask AI</TabsTrigger>
          </TabsList>
        </div>
        <div>
          <div>
            {activeTab !== "balance" && activeTab !== "ai" && (
              <div className="flex justify-center pt-5">
                <SelectDate showAllTransactions={true} />
              </div>
            )}
            <TabsContent value="overview">
              <div className="flex justify-between bg-black p-8 lg:pl-10 md:pl-10">
                <div className="-mt-40">
                  <h1 className="text-white lg:text-5xl md:text-3xl font-bold mb-4 pt-24">
                    CIBC transactions Charts :)
                  </h1>
                  {isLoading ? (
                    <TotalSpentLoading />
                  ) : (
                    <p className="text-gray-400 lg:text-2xl md:text-md">
                      🤑 Total Spent: {totalSpent} $ 🤑
                    </p>
                  )}
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
                          <MyResponsivePie data={CIBCTransactions} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="transactions">
              <div className="flex justify-between bg-black p-8 lg:pl-10 md:pl-10">
                <div className="-mt-36">
                  <h1 className="text-white lg:text-5xl md:text-3xl font-bold pt-24">
                    CIBC transactions :)
                  </h1>
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
              <div className="md:pl-10 md:pr-10 flex flex-col justify-center -mt-2">
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
                        {Balances[0]?.account?.balances?.available +
                          Balances[1]?.account?.balances?.available || 0}
                      </h1>
                      <p className="text-gray-400 text-2xl mb-10">
                        This is your current TD balance 🤫
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <CheckingComponent
                      account={Balances[0]?.account}
                      transactions={TdCheckingTransactions}
                    />
                    <SavingComponent
                      account={Balances[1]?.account}
                      transactions={TdSavingTransactions}
                    />
                  </div>
                  <div>
                    <div className="flex flex-col items-center justify-center pt-20">
                      <TDSelectDate showAllTransactions={false} />
                      {isLoading ? (
                        <BalanceMonthYearLoading />
                      ) : (
                        <div className="flex justify-center w-2/6 mt-4 mb-5">
                          {month !== "" && (
                            <h1 className="text-stroke lg:text-6xl md:text-4xl font-extrabold mb-4 pr-10 tracking-tight transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                              {TDmonth}
                            </h1>
                          )}
                          {year !== "" && (
                            <p className="text-stroke lg:text-6xl md:text-4xl font-extrabold mb-4 tracking-tight transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer">
                              {TDyear || "2024"}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                    <div className="shadow-xl rounded-lg overflow-hidden mx-10">
                      <div className="p-12 border-2 border-white glow rounded-lg bg-gray-950">
                        <TdIncomeVsExpenseChart
                          TDtransactions={AllTDTransactions}
                          CIBCTransactions={BalanceCIBCTransactions}
                          month={TDmonth || ""}
                          year={TDyear || ""}
                          isLoading={isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>
            <TabsContent value="ai">
              <div className="flex flex-col justify-center items-center">
                <div className="flex">
                  <div className="flex flex-col items-center">
                    <h1 className="gradient-text-shadow font-bold mt-6 lg:text-6xl md:text-3xl">
                      Ask BudgetPro AI 🤖 About Your 2024 Transactions
                    </h1>
                    <h1 className="gradient-text-shadow font-bold mt-6 lg:text-2xl md:text-3xl">
                      It Can Also Help You With Your Budgeting And Give
                      Financial Advice
                    </h1>
                  </div>
                </div>
                <div className="pt-10 flex ">
                  <BudgetProChat />
                </div>
              </div>
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
