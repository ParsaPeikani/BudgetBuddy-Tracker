"use client";
import Navbar from "@/components/navbar/navbar";
import { Payment, columns } from "@/components/custom-table/columns";
import { DataTable } from "@/components/custom-table/data-table";
import PieChartComponent from "@/components/charts/pie";
import LineChartComponent from "@/components/charts/line";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

export default function Dashboard() {
  function getData(): Payment[] {
    // Fetch data from your API here.
    return [
      {
        id: "728ed52f",
        amount: 101,
        date: "2024-10-10",
        transaction: "a@example.com",
      },
      {
        id: "728ed52f",
        amount: 102,
        date: "2021-10-11",
        transaction: "b@example.com",
      },
      {
        id: "728ed52f",
        amount: 103,
        date: "2021-10-12",
        transaction: "c@example.com",
      },
      {
        id: "728ed52f",
        amount: 104,
        date: "2022-10-13",
        transaction: "d@example.com",
      },
      {
        id: "728ed52f",
        amount: 105,
        date: "2021-10-14",
        transaction: "e@example.com",
      },
      {
        id: "728ed52f",
        amount: 106,
        date: "2023-10-15",
        transaction: "f@example.com",
      },
      {
        id: "728ed52f",
        amount: 107,
        date: "2021-10-16",
        transaction: "g@example.com",
      },
      {
        id: "728ed52f",
        amount: 108,
        date: "2021-10-17",
        transaction: "h@example.com",
      },
      {
        id: "728ed52f",
        amount: 109,
        date: "2021-10-18",
        transaction: "i@example.com",
      },
      {
        id: "728ed52f",
        amount: 110,
        date: "2021-10-19",
        transaction: "j@example.com",
      },
      {
        id: "728ed52f",
        amount: 100,
        date: "2021-10-20",
        transaction: "k@example.com",
      },
      {
        id: "728ed52f",
        amount: 101,
        date: "2024-10-10",
        transaction: "a@example.com",
      },
      {
        id: "728ed52f",
        amount: 102,
        date: "2021-10-11",
        transaction: "b@example.com",
      },
      {
        id: "728ed52f",
        amount: 103,
        date: "2021-10-12",
        transaction: "c@example.com",
      },
      {
        id: "728ed52f",
        amount: 104,
        date: "2022-10-13",
        transaction: "d@example.com",
      },
      {
        id: "728ed52f",
        amount: 105,
        date: "2021-10-14",
        transaction: "e@example.com",
      },
      {
        id: "728ed52f",
        amount: 106,
        date: "2023-10-15",
        transaction: "f@example.com",
      },
      {
        id: "728ed52f",
        amount: 107,
        date: "2021-10-16",
        transaction: "g@example.com",
      },
      {
        id: "728ed52f",
        amount: 108,
        date: "2021-10-17",
        transaction: "h@example.com",
      },
      {
        id: "728ed52f",
        amount: 109,
        date: "2021-10-18",
        transaction: "i@example.com",
      },
      {
        id: "728ed52f",
        amount: 110,
        date: "2021-10-19",
        transaction: "j@example.com",
      },
      {
        id: "728ed52f",
        amount: 100,
        date: "2021-10-20",
        transaction: "k@example.com",
      },
      // ...
    ];
  }
  const data = getData();

  const getTrans = async () => {
    try {
      const response = await axios.get("/api/plaid/transactions");
      console.log(response.data.latest_transactions);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

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
        <div className="bg-black p-8 pl-32">
          <h1 className="text-white text-3xl md:text-4xl font-bold mb-4">
            Welcome back Parsa!
          </h1>
          <p className="text-gray-400 text-xl md:text-2xl">
            Here is a list of your latest transactions!
          </p>
        </div>

        <div className="pl-12">
          <div className="pl-20 pr-20">
            <TabsContent value="overview">
              <DataTable columns={columns} data={data} />
            </TabsContent>
            <br />
            <div className="flex justify-center">
              <button
                onClick={getTrans}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Get Transactions
              </button>
            </div>
          </div>
        </div>
      </div>
    </Tabs>
  );
}
