import { ResponsiveBar } from "@nivo/bar";
import { MonthlyChartLoading } from "../loading/loading";
import { useState, useEffect } from "react";

const monthIndex: Record<string, number> = {
  January: 0,
  February: 1,
  March: 2,
  April: 3,
  May: 4,
  June: 5,
  July: 6,
  August: 7,
  September: 8,
  October: 9,
  November: 10,
  December: 11,
};

function getMonthNumber(dateString: string) {
  const parts = dateString.split("-");
  const month = parseInt(parts[1], 10);
  return month;
}

export default function TdIncomeVsExpenseChart({
  transactions,
  month,
  year,
  isLoading,
}: {
  transactions: any;
  month: string;
  year: string;
  isLoading: boolean;
}) {
  const TdExpenseVsIncomeChartdata = [
    { month: "Jan", Expense: 20, Income: 20 },
    { month: "Feb", Expense: 20, Income: 20 },
    { month: "Mar", Expense: 20, Income: 20 },
    { month: "Apr", Expense: 20, Income: 20 },
    { month: "May", Expense: 20, Income: 20 },
    { month: "Jun", Expense: 20, Income: 20 },
    { month: "Jul", Expense: 20, Income: 20 },
    { month: "Aug", Expense: 20, Income: 20 },
    { month: "Sep", Expense: 20, Income: 20 },
    { month: "Oct", Expense: 20, Income: 20 },
    { month: "Nov", Expense: 20, Income: 20 },
    { month: "Dec", Expense: 20, Income: 20 },
  ];

  if (isLoading) {
    return <MonthlyChartLoading />;
  }
  return (
    <div
      style={{ height: "500px", width: "1500px" }}
      className="flext items-center justify-center mb-10"
    >
      <h2
        style={{
          textAlign: "center",
          color: "#E0E0E0",
          textShadow: "0 0 8px rgba(255, 255, 255, 0.4)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: "34px",
          fontWeight: "normal",
          marginBottom: "20px",
        }}
      >
        Income vs Expense
      </h2>
      <ResponsiveBar
        data={TdExpenseVsIncomeChartdata}
        keys={["Expense", "Income"]}
        indexBy="month"
        margin={{ top: 20, right: 130, bottom: 50, left: 70 }}
        padding={0.3}
        valueScale={{ type: "linear" }}
        indexScale={{ type: "band", round: true }}
        colors={{ scheme: "nivo" }}
        defs={[
          {
            id: "dots",
            type: "patternDots",
            background: "inherit",
            color: "#38bcb2",
            size: 4,
            padding: 1,
            stagger: true,
          },
          {
            id: "lines",
            type: "patternLines",
            background: "inherit",
            color: "#eed312",
            rotation: -45,
            lineWidth: 6,
            spacing: 10,
          },
        ]}
        borderColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Month",
          legendPosition: "middle",
          legendOffset: 42,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Expense && Income",
          legendPosition: "middle",
          legendOffset: -60,
          truncateTickAt: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{
          from: "color",
          modifiers: [["darker", 1.6]],
        }}
        legends={[
          {
            dataFrom: "keys",
            anchor: "bottom-right",
            direction: "column",
            justify: false,
            translateX: 120,
            translateY: 0,
            itemsSpacing: 2,
            itemWidth: 100,
            itemHeight: 20,
            itemDirection: "left-to-right",
            itemOpacity: 0.85,
            symbolSize: 20,
            effects: [
              {
                on: "hover",
                style: {
                  itemOpacity: 1,
                  itemTextColor: "#fff",
                },
              },
            ],
          },
        ]}
        theme={{
          axis: {
            ticks: {
              text: {
                fontSize: 14,
                fill: "#999",
              },
            },
            legend: {
              text: {
                fontSize: 15,
                fill: "#333",
              },
            },
          },
          legends: {
            text: {
              fontSize: 15,
            },
          },
        }}
        motionConfig="gentle"
        groupMode="grouped"
        role="application"
        ariaLabel="Nivo bar chart demo"
      />
    </div>
  );
}
