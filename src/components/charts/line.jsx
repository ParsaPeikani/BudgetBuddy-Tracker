import React from "react";
import { Chart } from "react-google-charts";

const LineChartComponent = () => {
  // Example data for the Line Chart
  const data = [
    ["Month", "Sales", "Expenses"],
    ["Jan", 1000, 400],
    ["Feb", 1170, 460],
    ["Mar", 660, 1120],
    ["Apr", 1030, 540],
    // Add more monthly data here
  ];

  // Options for customizing the Line Chart
  const options = {
    chart: {
      title: "Sales VS Expenses",
      subtitle: "Sales and Expenses: January-April",
    },
    titleTextStyle: {
      color: "#FFFFFF", // White title for better contrast on dark backgrounds
      fontSize: 20, // Adjust the font size as needed
      bold: true, // Making the title bold
    },
    backgroundColor: "transparent", // Making the background transparent
    colors: ["#1E40AF", "#60A5FA"], // Customizing line colors for better visibility
    legend: {
      textStyle: {
        color: "white", // White legend text for better contrast
        fontSize: 14, // Adjust the font size as needed
      },
    },
    hAxis: {
      textStyle: {
        color: "#FFFFFF", // Adjusting horizontal axis label colors for contrast
      },
    },
    vAxis: {
      textStyle: {
        color: "#FFFFFF", // Adjusting vertical axis label colors for contrast
      },
      gridlines: {
        color: "transparent", // Makes the horizontal gridlines transparent
      },
    },

    // Additional styling or options can be added here
  };

  return (
    <div className="text-left">
      <h1 className="pl-56 font-bold text-4xl pb-10 text-white">
        Sales vs Expenses
      </h1>
      <Chart
        chartType="LineChart"
        width="100%"
        height="400px"
        data={data}
        options={options}
      />
    </div>
  );
};

export default LineChartComponent;
