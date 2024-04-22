import { ResponsiveBar } from "@nivo/bar";

import { yearlyBudgetData } from "../constants/constants";
import { monthlyBudgetData } from "../constants/constants";

export default function HorizontalBarChart({
  transactions,
  month,
  year,
}: {
  transactions: any;
  month: string;
  year: string;
}) {
  // Initial data for the bar chart
  const data = [
    { category: "Food", Actual: 0, Budget: 0 },
    { category: "Shopping", Actual: 0, Budget: 0 },
    { category: "Travel", Actual: 0, Budget: 0 },
    { category: "Transfer", Actual: 0, Budget: 0 },
    { category: "Other", Actual: 0, Budget: 0 },
  ];

  if (month?.length === 0 && year?.length > 0) {
    // Calculating the Budgeted amounts for each category
    for (let i = 0; i < yearlyBudgetData.length; i++) {
      if (i === 0) {
        data[0].Budget = yearlyBudgetData[i];
      } else if (i === 1) {
        data[1].Budget = yearlyBudgetData[i];
      } else if (i === 2) {
        data[2].Budget = yearlyBudgetData[i];
      } else if (i === 3) {
        data[3].Budget = yearlyBudgetData[i];
      } else {
        data[4].Budget = yearlyBudgetData[i];
      }
    }
  } else if (month?.length > 0 && year?.length > 0) {
    if (month !== "All") {
      // Calculating the Budgeted amounts for each category
      for (let i = 0; i < monthlyBudgetData.length; i++) {
        if (i === 0) {
          data[0].Budget = monthlyBudgetData[i];
        } else if (i === 1) {
          data[1].Budget = monthlyBudgetData[i];
        } else if (i === 2) {
          data[2].Budget = monthlyBudgetData[i];
        } else if (i === 3) {
          data[3].Budget = monthlyBudgetData[i];
        } else {
          data[4].Budget = monthlyBudgetData[i];
        }
      }
    }
  }

  // Calculating the Actual amounts for each category
  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].category === "Food and Drink") {
      data[0].Actual += 1;
    } else if (transactions[i].category === "Payment") {
      data[1].Actual += transactions[i].amount;
    } else if (transactions[i].category === "Travel") {
      data[2].Actual += transactions[i].amount;
    } else if (transactions[i].category === "Transfer") {
      data[3].Actual += transactions[i].amount;
    } else {
      data[4].Actual += transactions[i].amount;
    }
  }

  // Rounding off the Actual values to 2 decimal places
  data[0].Actual = Number(data[0].Actual.toFixed(2));
  data[1].Actual = Number(data[1].Actual.toFixed(2));
  data[2].Actual = Number(data[2].Actual.toFixed(2));
  data[3].Actual = Number(data[3].Actual.toFixed(2)) * -1;
  data[4].Actual = Number(data[4].Actual.toFixed(2));

  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          color: "#E0E0E0", // Light grey color; consider using pure white (#FFF) if the glow isn't distinct enough
          textShadow: "0 0 8px rgba(255, 255, 255, 0.4)", // White glow effect
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: "24px",
          fontWeight: "normal",
          marginBottom: "20px",
        }}
      >
        Budgeted vs Actual Expenses
      </h2>
      <div style={{ height: "500px", width: "900px" }} className="-mt-10">
        <ResponsiveBar
          data={data}
          keys={["Actual", "Budget"]} // Representing actual and budgeted expenses
          indexBy="category"
          margin={{ top: 50, right: 130, bottom: 55, left: 100 }}
          padding={0.3}
          valueScale={{ type: "linear" }}
          indexScale={{ type: "band", round: true }}
          colors={{ scheme: "set2" }} // Using a predefined color scheme
          borderColor={{ from: "color", modifiers: [["darker", 1.6]] }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Category",
            legendPosition: "middle",
            legendOffset: 42,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: "Value",
            legendPosition: "middle",
            legendOffset: -70,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
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
          legends={[
            {
              dataFrom: "keys",
              anchor: "bottom-right",
              direction: "column",
              justify: false,
              translateX: 120,
              translateY: 0,
              itemTextColor: "#999",
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
          layout="horizontal"
          enableGridY={false}
          enableGridX={true}
          animate={true}
          motionConfig="gentle"
          groupMode="grouped"
          barAriaLabel={(e) => `${e.id} in ${e.indexValue}: ${e.value}`}
        />
      </div>
    </div>
  );
}
