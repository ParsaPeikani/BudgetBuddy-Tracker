import { ResponsiveBar } from "@nivo/bar";

export default function BarChart() {
  const data = [
    { category: "Food", actual: 110, budget: 200 },
    { category: "Shopping", actual: 75, budget: 100 },
    { category: "Travel", actual: 200, budget: 300 },
    { category: "Transfer", actual: 150, budget: 150 },
    { category: "Other", actual: 50, budget: 80 },
  ];

  return (
    <ResponsiveBar
      data={data}
      keys={["actual", "budget"]} // Representing actual and budgeted expenses
      indexBy="category"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
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
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: "Value",
        legendPosition: "middle",
        legendOffset: -40,
      }}
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: "color", modifiers: [["darker", 1.6]] }}
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
              },
            },
          ],
        },
      ]}
      groupMode="grouped"
      role="application"
      ariaLabel="Nivo bar chart example"
      barAriaLabel={(e) => `${e.id} in ${e.indexValue}: ${e.value}`}
    />
  );
}