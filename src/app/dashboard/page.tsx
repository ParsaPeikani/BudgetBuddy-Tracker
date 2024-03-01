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
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
      },
      {
        id: "728ed52f",
        amount: 100,
        status: "pending",
        email: "m@example.com",
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
    <div className="justify-center">
      <Navbar />
      <div className="flex justify-center">
        <Tabs defaultValue="overview" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="overview">OverView</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="balance">Balance</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="pt-12">
        <div className="pl-8 pr-8">
          <DataTable columns={columns} data={data} />
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
  );
}
