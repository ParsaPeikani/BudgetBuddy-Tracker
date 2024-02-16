import React from "react";
import { Chart } from "react-google-charts";

const PieChartComponent = () => {
  const data = [
    ["Task", "Hours per Day"],
    ["Work", 11],
    ["Eat", 2],
    ["Commute", 2],
    ["Watch TV", 2],
    ["Sleep", 7],
  ];

  const options = {
    titleTextStyle: {
      color: "white", // Sets the title text color to white
      fontSize: 20, // Optional: Adjust the font size if needed
      // You can add more style options here
    },
    backgroundColor: "transparent", // Adjusts the background to be transparent
    pieHole: 0.4, // Creates a donut chart. Set to 0 for a full pie chart.
    legend: {
      textStyle: {
        color: "white", // Sets the legend text color to white for contrast
        fontSize: 14, // Optional: Adjust the font size if needed
        // You can add more style options here
      },
    },
    slices: {
      0: { color: "#1E40AF" }, // Example slice color, use your color scheme
      1: { color: "#2563EB" },
      2: { color: "#3B82F6" },
      3: { color: "#60A5FA" },
      4: { color: "#93C5FD" },
      // Define more slice colors as needed
    },
    // Additional customization options can go here
    chartArea: {
      width: "80%", // Adjust chart area width as needed
      height: "80%", // Adjust chart area height as needed
      // You can add more style options here
    },
    // Ensures the text within the chart is readable and contrasts well
    pieSliceTextStyle: {
      color: "black", // Choose a color that contrasts well with slice colors
    },
  };

  return (
    <div
      class="text-left, items-end"
      style={{ color: "white", marginBottom: "20px" }}
    >
      <h1 class="pl-48 pb-10 font-bold text-2xl">My Daily Activities</h1>
      <Chart
        chartType="PieChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
};

export default PieChartComponent;
