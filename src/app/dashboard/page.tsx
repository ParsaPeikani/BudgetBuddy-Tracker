"use client";
import Navbar from "@/components/navbar/navbar";
import PieChartComponent from "@/components/charts/pie";
import LineChartComponent from "@/components/charts/line";
import axios from "axios";

export default function Dashboard() {
  const getTrans = async () => {
    try {
      const response = await axios.get("/api/plaid/transactions");
      console.log(response.data.latest_transactions);
    } catch (error) {
      console.error("There was an error!", error);
    }
  };

  return (
    <div>
      <Navbar />
      {/* <div className="flex flex-col h-screen">
        <div className="flex flex-row ">
          <div className="w-1/2 p-4">
            <PieChartComponent />
          </div>
          <div className="w-1/2 p-4">
            <LineChartComponent />
          </div>
        </div>
      </div> */}
      <button
        onClick={getTrans}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Get Transactions
      </button>
    </div>
  );
}
