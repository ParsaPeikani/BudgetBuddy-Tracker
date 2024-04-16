"use client";

import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Rectangle,
} from "recharts";
import { useState, useEffect } from "react";

let foodData = 0;
let shoppingData = 0;
let travelData = 0;
let transferData = 0;
let othersData = 0;

const data = [
  {
    name: "Food",
    Budgeted: 2000,
    Actual: foodData,
    amt: 2400,
  },
  {
    name: "Shopping",
    Budgeted: 2000,
    Actual: shoppingData,
    amt: 2210,
  },
  {
    name: "Travel",
    Budgeted: 500,
    Actual: travelData,
    amt: 2290,
  },
  {
    name: "Transfer",
    Budgeted: 300,
    Actual: transferData,
    amt: 2000,
  },
  {
    name: "Others",
    Budgeted: 200,
    Actual: othersData,
    amt: 2181,
  },
];

import { BarChart, Bar } from "recharts";

const renderCustomAxisTick = ({ x, y, payload }) => {
  let path = "";
  let iconWidth = 20; // Default icon width
  let iconHeight = 20; // Default icon height
  let offsetX = -10; // Default X offset to center the icon
  let offsetY = -10; // Default Y offset to center the icon

  switch (payload.value) {
    case "Food":
      path =
        "M18,3 C18.5128358,3 18.9355072,3.38604019 18.9932723,3.88337887 L19,4 L19,20 C19,20.5522847 18.5522847,21 18,21 C17.4871642,21 17.0644928,20.6139598 17.0067277,20.1166211 L17,20 L17,15 L16,15 C15.4871642,15 15.0644928,14.6139598 15.0067277,14.1166211 L15,14 L15,8 C15,5.790861 16.5,3 18,3 Z M12,3 C12.5128358,3 12.9355072,3.38604019 12.9932723,3.88337887 L13,4 L13,9 C13,10.8635652 11.7256022,12.429479 10.0007613,12.8737865 L10,20 C10,20.5522847 9.55228475,21 9,21 C8.48716416,21 8.06449284,20.6139598 8.00672773,20.1166211 L8,20 L8.00024347,12.8740452 C6.3387946,12.44653 5.09505441,10.9783996 5.00520459,9.20583575 L5,9 L5,4 C5,3.44771525 5.44771525,3 6,3 C6.51283584,3 6.93550716,3.38604019 6.99327227,3.88337887 L7,4 L7,9 C7,9.74025244 7.40216612,10.3865739 7.99992752,10.7323937 L8,4 C8,3.44771525 8.44771525,3 9,3 C9.51283584,3 9.93550716,3.38604019 9.99327227,3.88337887 L10,4 L10.0010775,10.7318119 C10.5523456,10.4124618 10.9370409,9.83744849 10.9929628,9.16897232 L11,9 L11,4 C11,3.44771525 11.4477153,3 12,3 Z"; // Your SVG path here
      // Customize icon size and offset if needed
      iconWidth = 50;
      iconHeight = 50;
      offsetX = -27;
      offsetY = 0;
      break;
    case "Shopping":
      path =
        "M19,7H16V6A4,4,0,0,0,8,6V7H5A1,1,0,0,0,4,8V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V8A1,1,0,0,0,19,7ZM10,6a2,2,0,0,1,4,0V7H10Zm8,13a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V9H8v1a1,1,0,0,0,2,0V9h4v1a1,1,0,0,0,2,0V9h2Z"; // Your SVG path here
      // Customize icon size and offset if needed
      iconWidth = 50; // Example customization
      iconHeight = 50;
      offsetX = -25;
      offsetY = 0;
      break;
    case "Travel":
      path =
        "M12.382 5.304 10.096 7.59l.006.02L11.838 14a.908.908 0 0 1-.211.794l-.573.573a.339.339 0 0 1-.566-.08l-2.348-4.25-.745-.746-1.97 1.97a3.311 3.311 0 0 1-.75.504l.44 1.447a.875.875 0 0 1-.199.79l-.175.176a.477.477 0 0 1-.672 0l-1.04-1.039-.018-.02-.788-.786-.02-.02-1.038-1.039a.477.477 0 0 1 0-.672l.176-.176a.875.875 0 0 1 .79-.197l1.447.438a3.322 3.322 0 0 1 .504-.75l1.97-1.97-.746-.744-4.25-2.348a.339.339 0 0 1-.08-.566l.573-.573a.909.909 0 0 1 .794-.211l6.39 1.736.02.006 2.286-2.286c.37-.372 1.621-1.02 1.993-.65.37.372-.279 1.622-.65 1.993z"; // Your SVG path here
      // Customize icon size and offset if needed
      iconWidth = 70;
      iconHeight = 70;
      offsetX = -25;
      offsetY = -5;
      break;
    case "Transfer":
      path =
        "M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"; // Your SVG path here
      // Customize icon size and offset if needed
      iconWidth = 60;
      iconHeight = 60;
      offsetX = -25;
      offsetY = -8;
      break;
    case "Others":
      path =
        "M5.5 16c0-1.5-1.25-2.75-2.75-2.75-1.531 0-2.75 1.25-2.75 2.75s1.219 2.75 2.75 2.75c1.5 0 2.75-1.25 2.75-2.75zM13.938 16c0-1.5-1.25-2.75-2.75-2.75s-2.75 1.25-2.75 2.75 1.25 2.75 2.75 2.75 2.75-1.25 2.75-2.75zM22.406 16c0-1.5-1.219-2.75-2.75-2.75-1.5 0-2.75 1.25-2.75 2.75s1.25 2.75 2.75 2.75c1.531 0 2.75-1.25 2.75-2.75z"; // Your SVG path here
      // Customize icon size and offset if needed
      iconWidth = 50;
      iconHeight = 50;
      offsetX = -22;
      offsetY = -10;
      break;
    default:
      path = "";
      break;
  }

  return (
    <svg
      x={x + offsetX} // Center the icon based on its width
      y={y + offsetY} // Adjust the vertical position based on height
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 24 24" // Adjust viewBox based on the original size of your icons
      fill="#666"
    >
      <path d={path} />
    </svg>
  );
};

function getIntroOfPage(label: string) {
  if (label === "Food") {
    return "These are your expenses on foods.";
  }
  if (label === "Shopping") {
    return "These are your expenses on shopping.";
  }
  if (label === "Travel") {
    return "These are your expenses on travel.";
  }
  if (label === "Transfer") {
    return "These are your expenses on transfering money.";
  }
  if (label === "Others") {
    return "These are your expenses on other things.";
  }
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: {
  active: boolean;
  payload: any[];
  label: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`Expected ${label} : ${parseFloat(
          payload[0].value
        ).toFixed(2)}`}</p>
        <p className="label">{`Budgeted ${label} : ${parseFloat(
          payload[1].value
        ).toFixed(2)}`}</p>
        <p className="intro text-yellow-500">{getIntroOfPage(label)}</p>
      </div>
    );
  }

  return null;
};

const getFilteredData = (transactions: any) => {
  transactions.forEach((transaction: any) => {
    switch (transaction.category) {
      case "Food and Drink":
        foodData += transaction.amount;
        break;
      case "Payment":
        shoppingData += transaction.amount;
        break;
      case "Travel":
        travelData += transaction.amount;
        break;
      case "Transfer":
        transferData += transaction.amount;
        break;
      default:
        othersData += transaction.amount;
        break;
    }
  });

  data[0].Actual = foodData;
  data[1].Actual = shoppingData;
  data[2].Actual = travelData;
  data[3].Actual = -transferData;
  data[4].Actual = othersData;
};

// Categories: Food, payment, travel, Transfer, Others
export default function RenderBarChart({
  transactions,
}: {
  transactions: any;
}): ReturnType<React.FC> {
  getFilteredData(transactions);
  const [chartDimensions, setChartDimensions] = useState({
    width: window.innerWidth / 2, // Half of the window width
    height: window.innerHeight / 2, // A third of the window height
  });
  useEffect(() => {
    const handleResize = () => {
      // Update the dimensions based on the window size
      setChartDimensions({
        width: window.innerWidth / 2,
        height: window.innerHeight / 2,
      });
    };

    // Set the resize listener
    window.addEventListener("resize", handleResize);

    // Clean up the listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);
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
        Budgeted vs. Actual Expenses
      </h2>

      <BarChart
        width={chartDimensions.width}
        height={chartDimensions.height}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 25,
        }}
      >
        {/* <XAxis dataKey="name" tick={renderCustomAxisTick} /> */}
        {/* <YAxis /> */}
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <Legend layout="horizontal" align="center" verticalAlign="top" />

        <Tooltip
          cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
          content={<CustomTooltip />}
        />
        <Bar dataKey="Budgeted" fill="#00C5C8" />
        <Bar dataKey="Actual" fill="#FF6B6B" />
      </BarChart>
    </div>
  );
}

// export default renderBarChart;
