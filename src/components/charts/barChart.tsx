import { ResponsiveBar } from "@nivo/bar";

export default function BarChart({ transactions }: { transactions: any }) {
  const data = [
    { category: "Food", actual: 0, budget: 200 },
    { category: "Shopping", actual: 0, budget: 100 },
    { category: "Travel", actual: 0, budget: 300 },
    { category: "Transfer", actual: 0, budget: 150 },
    { category: "Other", actual: 0, budget: 80 },
  ];

  for (let i = 0; i < transactions.length; i++) {
    if (transactions[i].category === "Food and Drink") {
      data[0].actual += 1;
    } else if (transactions[i].category === "Payment") {
      data[1].actual += transactions[i].amount;
    } else if (transactions[i].category === "Travel") {
      data[2].actual += transactions[i].amount;
    } else if (transactions[i].category === "Transfer") {
      data[3].actual += transactions[i].amount;
    } else {
      data[4].actual += transactions[i].amount;
    }
  }

  data[0].actual = Number(data[0].actual.toFixed(2));
  data[1].actual = Number(data[1].actual.toFixed(2));
  data[2].actual = Number(data[2].actual.toFixed(2));
  data[3].actual = Number(data[3].actual.toFixed(2));
  data[4].actual = Number(data[4].actual.toFixed(2));

  return (
    <ResponsiveBar
      data={data}
      keys={["actual", "budget"]} // Representing actual and budgeted expenses
      indexBy="category"
      margin={{ top: 50, right: 130, bottom: 50, left: 100 }}
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
        legendOffset: -50,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
      theme={{
        axis: {
          ticks: {
            text: {
              fontSize: 14, // Setting font size for axis ticks
              fill: "#999", // Setting text color for axis ticks
            },
          },
          legend: {
            text: {
              fontSize: 15, // Setting font size for legends
              fill: "#333", // Setting text color for legends
            },
          },
        },
        legends: {
          text: {
            fontSize: 15, // Specify the desired font size here
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
              },
            },
          ],
        },
      ]}
      animate={true}
      motionConfig="gentle"
      groupMode="grouped"
      barAriaLabel={(e) => `${e.id} in ${e.indexValue}: ${e.value}`}
    />
  );
}
