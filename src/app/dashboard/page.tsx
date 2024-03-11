"use client";
import Navbar from "@/components/navbar/navbar";
import { Payment, columns } from "@/components/custom-table/columns";
import { DataTable } from "@/components/custom-table/data-table";
import PieChartComponent from "@/components/charts/pie";
import LineChartComponent from "@/components/charts/line";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";
import { useSession } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { session } = useSession();
  const user_id = session?.user.id;

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

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    // Fetch transactions from your API
    const fetchTransactions = async () => {
      const response = await axios.get(`/api/mongoDB/transactions`);
      const data = response.data;
      // console.log("These are the data: ", data);
      return data;
      // setTransactions(data); // Update state with the fetched transactions
    };

    fetchTransactions().then((fulltransactions) => {
      const Columns = fulltransactions.map((transaction: any) => ({
        id: transaction._id,
        date: transaction.date,
        transaction: transaction.merchantName,
        amount: transaction.amount,
        category: transaction.category[0],
        verified: transaction.pending,
      }));
      setTransactions(Columns);
      console.log("These are the columns: ", Columns);
    });
  }, []); // Empty dependency array means this effect runs once on mount

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
              <DataTable columns={columns} data={transactions} />
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
