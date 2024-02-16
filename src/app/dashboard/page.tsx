"use client";
import Navbar from "@/components/navbar/navbar";
import PieChartComponent from "@/components/charts/pie";
import LineChartComponent from "@/components/charts/line";

export default function Dashboard() {
  return (
    <div>
      <Navbar />
      <div className="flex flex-col h-screen">
        {/* Adjust this div to use flex-row and justify-between for spacing */}
        <div className="flex flex-row ">
          <div className="w-1/2 p-4">
            <PieChartComponent />
          </div>
          <div className="w-1/2 p-4">
            <LineChartComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
