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

export default function MonthlyBarChart({
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
  // console.log("these are the transactions: ", transactions);
  const MonthlyChartdata = [
    {
      month: "Jan",
      Food: 0,
      FoodColor: "hsl(225, 70%, 50%)",
      Shopping: 0,
      ShoppingColor: "hsl(61, 70%, 50%)",
      Travel: 0,
      TravelColor: "hsl(25, 70%, 50%)",
      Transfer: 0,
      TransferColor: "hsl(306, 70%, 50%)",
      Other: 0,
      OtherColor: "hsl(262, 70%, 50%)",
    },
    {
      month: "Feb",
      Food: 0,
      FoodColor: "hsl(47, 70%, 50%)",
      Shopping: 0,
      ShoppingColor: "hsl(182, 70%, 50%)",
      Travel: 0,
      TravelColor: "hsl(172, 70%, 50%)",
      Transfer: 0,
      TransferColor: "hsl(39, 70%, 50%)",
      Other: 0,
      OtherColor: "hsl(249, 70%, 50%)",
    },
    {
      month: "Mar",
      Food: 0,
      FoodColor: "hsl(255, 70%, 50%)",
      Shopping: 0,
      ShoppingColor: "hsl(199, 70%, 50%)",
      Travel: 0,
      TravelColor: "hsl(130, 70%, 50%)",
      Transfer: 0,
      TransferColor: "hsl(71, 70%, 50%)",
      Other: 0,
      OtherColor: "hsl(349, 70%, 50%)",
    },
    {
      month: "Apr",
      Food: 0,
      FoodColor: "hsl(89, 70%, 50%)",
      Shopping: 0,
      ShoppingColor: "hsl(214, 70%, 50%)",
      Travel: 0,
      TravelColor: "hsl(242, 70%, 50%)",
      Transfer: 0,
      TransferColor: "hsl(220, 70%, 50%)",
      Other: 0,
      OtherColor: "hsl(323, 70%, 50%)",
    },
    {
      month: "May",
      Food: 0,
      FoodColor: "hsl(22, 70%, 50%)",
      Shopping: 0,
      ShoppingColor: "hsl(92, 70%, 50%)",
      Travel: 0,
      TravelColor: "hsl(319, 70%, 50%)",
      Transfer: 0,
      TransferColor: "hsl(128, 70%, 50%)",
      Other: 0,
      OtherColor: "hsl(64, 70%, 50%)",
    },
    {
      month: "Jun",
      Food: 0,
      FoodColor: "hsl(124, 70%, 50%)",
      Shopping: 0,
      ShoppingColor: "hsl(315, 70%, 50%)",
      Travel: 0,
      TravelColor: "hsl(359, 70%, 50%)",
      Transfer: 0,
      TransferColor: "hsl(54, 70%, 50%)",
      Other: 0,
      OtherColor: "hsl(305, 70%, 50%)",
    },
    {
      month: "Jul",
      Food: 0,
      FoodColor: "hsl(316, 70%, 50%)",
      Shopping: 0,
      ShoppingColor: "hsl(88, 70%, 50%)",
      Travel: 0,
      TravelColor: "hsl(25, 70%, 50%)",
      Transfer: 0,
      TransferColor: "hsl(347, 70%, 50%)",
      Other: 0,
      OtherColor: "hsl(103, 70%, 50%)",
    },
    {
      month: "Aug",
      Food: 0,
      FoodColor: "hsl(225, 70%, 50%)",
      Shopping: 0,
      ShoppingColor: "hsl(61, 70%, 50%)",
      Travel: 0,
      TravelColor: "hsl(25, 70%, 50%)",
      Transfer: 0,
      TransferColor: "hsl(306, 70%, 50%)",
      Other: 0,
      OtherColor: "hsl(262, 70%, 50%)",
    },
    {
      month: "Sep",
      Food: 0,
      FoodColor: "hsl(47, 70%, 50%)",
      Shopping: 0,
      ShoppingColor: "hsl(182, 70%, 50%)",
      Travel: 0,
      TravelColor: "hsl(172, 70%, 50%)",
      Transfer: 0,
      TransferColor: "hsl(39, 70%, 50%)",
      Other: 0,
      OtherColor: "hsl(249, 70%, 50%)",
    },
    {
      month: "Oct",
      Food: 0,
      FoodColor: "hsl(255, 70%, 50%)",
      Shopping: 0,
      ShoppingColor: "hsl(199, 70%, 50%)",
      Travel: 0,
      TravelColor: "hsl(130, 70%, 50%)",
      Transfer: 0,
      TransferColor: "hsl(71, 70%, 50%)",
      Other: 0,
      OtherColor: "hsl(349, 70%, 50%)",
    },
    {
      month: "Nov",
      Food: 0,
      FoodColor: "hsl(89, 70%, 50%)",
      Shopping: 0,
      ShoppingColor: "hsl(214, 70%, 50%)",
      Travel: 0,
      TravelColor: "hsl(242, 70%, 50%)",
      Transfer: 0,
      TransferColor: "hsl(220, 70%, 50%)",
      Other: 0,
      OtherColor: "hsl(323, 70%, 50%)",
    },
    {
      month: "Dec",
      Food: 0,
      FoodColor: "hsl(22, 70%, 50%)",
      Shopping: 0,
      ShoppingColor: "hsl(92, 70%, 50%)",
      Travel: 0,
      TravelColor: "hsl(319, 70%, 50%)",
      Transfer: 0,
      TransferColor: "hsl(128, 70%, 50%)",
      Other: 0,
      OtherColor: "hsl(64, 70%, 50%)",
    },
  ];
  if (month?.length > 0 && year?.length > 0 && month !== "All") {
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].category === "Food and Drink") {
        MonthlyChartdata[monthIndex[month]].Food += transactions[i].amount;
      } else if (transactions[i].category === "Shopping") {
        MonthlyChartdata[monthIndex[month]].Shopping += transactions[i].amount;
      } else if (transactions[i].category === "Travel") {
        MonthlyChartdata[monthIndex[month]].Travel += transactions[i].amount;
      } else if (transactions[i].category === "Transfer") {
        MonthlyChartdata[monthIndex[month]].Transfer += transactions[i].amount;
      } else {
        MonthlyChartdata[monthIndex[month]].Other += transactions[i].amount;
      }
    }
  } else {
    if (transactions?.length > 0) {
      for (let i = 0; i < transactions.length; i++) {
        if (transactions[i].category === "Food and Drink") {
          MonthlyChartdata[getMonthNumber(transactions[i].date) - 1].Food +=
            transactions[i].amount;
        } else if (transactions[i].category === "Shopping") {
          MonthlyChartdata[getMonthNumber(transactions[i].date) - 1].Shopping +=
            transactions[i].amount;
        } else if (transactions[i].category === "Travel") {
          MonthlyChartdata[getMonthNumber(transactions[i].date) - 1].Travel +=
            transactions[i].amount;
        } else if (transactions[i].category === "Transfer") {
          MonthlyChartdata[getMonthNumber(transactions[i].date) - 1].Transfer +=
            transactions[i].amount;
        } else {
          MonthlyChartdata[getMonthNumber(transactions[i].date) - 1].Other +=
            transactions[i].amount;
        }
      }
    }
  }

  // Round up all the values of the categories to 2 decimal places
  for (let i = 0; i < MonthlyChartdata.length; i++) {
    MonthlyChartdata[i].Food = Number(MonthlyChartdata[i].Food.toFixed(2));
    MonthlyChartdata[i].Shopping = Number(
      MonthlyChartdata[i].Shopping.toFixed(2)
    );
    MonthlyChartdata[i].Travel = Number(MonthlyChartdata[i].Travel.toFixed(2));
    MonthlyChartdata[i].Transfer = Number(
      MonthlyChartdata[i].Transfer.toFixed(2)
    );
    MonthlyChartdata[i].Other = Number(MonthlyChartdata[i].Other.toFixed(2));
  }

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
        Monthly Category Expenses
      </h2>
      <ResponsiveBar
        data={MonthlyChartdata}
        keys={["Food", "Shopping", "Travel", "Transfer", "Other"]}
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
          legend: "Categories Expenses",
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
        role="application"
        ariaLabel="Nivo bar chart demo"
      />
    </div>
  );
}
