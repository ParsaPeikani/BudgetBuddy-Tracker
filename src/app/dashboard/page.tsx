"use client";
import Navbar from "@/components/navbar/navbar";
import PieChartComponent from "@/components/charts/donut";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <PieChartComponent />
    </div>
  );
}
