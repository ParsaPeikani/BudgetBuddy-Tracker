"use client";

import {
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Rectangle,
} from "recharts";

const data = [
  {
    name: "Food",
    uv: 8000,
    pv: 2400,
    amt: 2400,
  },
  {
    name: "Shopping",
    uv: 3000,
    pv: 1398,
    amt: 2210,
  },
  {
    name: "Travel",
    uv: 2000,
    pv: 9800,
    amt: 2290,
  },
  {
    name: "Transfer",
    uv: 2780,
    pv: 3908,
    amt: 2000,
  },
  {
    name: "Others",
    uv: 1890,
    pv: 4800,
    amt: 2181,
  },
];

import { BarChart, Bar } from "recharts";
const renderCustomAxisTick = ({ x, y, payload }) => {
  let path = "";

  switch (payload.value) {
    case "Food":
      path =
        "M18,3 C18.5128358,3 18.9355072,3.38604019 18.9932723,3.88337887 L19,4 L19,20 C19,20.5522847 18.5522847,21 18,21 C17.4871642,21 17.0644928,20.6139598 17.0067277,20.1166211 L17,20 L17,15 L16,15 C15.4871642,15 15.0644928,14.6139598 15.0067277,14.1166211 L15,14 L15,8 C15,5.790861 16.5,3 18,3 Z M12,3 C12.5128358,3 12.9355072,3.38604019 12.9932723,3.88337887 L13,4 L13,9 C13,10.8635652 11.7256022,12.429479 10.0007613,12.8737865 L10,20 C10,20.5522847 9.55228475,21 9,21 C8.48716416,21 8.06449284,20.6139598 8.00672773,20.1166211 L8,20 L8.00024347,12.8740452 C6.3387946,12.44653 5.09505441,10.9783996 5.00520459,9.20583575 L5,9 L5,4 C5,3.44771525 5.44771525,3 6,3 C6.51283584,3 6.93550716,3.38604019 6.99327227,3.88337887 L7,4 L7,9 C7,9.74025244 7.40216612,10.3865739 7.99992752,10.7323937 L8,4 C8,3.44771525 8.44771525,3 9,3 C9.51283584,3 9.93550716,3.38604019 9.99327227,3.88337887 L10,4 L10.0010775,10.7318119 C10.5523456,10.4124618 10.9370409,9.83744849 10.9929628,9.16897232 L11,9 L11,4 C11,3.44771525 11.4477153,3 12,3 Z"; // Replace with actual SVG path for a food icon
      break;
    case "Shopping":
      path =
        "M19,7H16V6A4,4,0,0,0,8,6V7H5A1,1,0,0,0,4,8V19a3,3,0,0,0,3,3H17a3,3,0,0,0,3-3V8A1,1,0,0,0,19,7ZM10,6a2,2,0,0,1,4,0V7H10Zm8,13a1,1,0,0,1-1,1H7a1,1,0,0,1-1-1V9H8v1a1,1,0,0,0,2,0V9h4v1a1,1,0,0,0,2,0V9h2Z"; // Replace with actual SVG path for a payment icon
      break;
    case "Travel":
      path =
        "M6.72 26.2c-0.040 0-0.080 0-0.12 0-0.28-0.040-0.48-0.2-0.64-0.44l-1.96-3.56-3.56-1.96c-0.24-0.12-0.4-0.36-0.44-0.64s0.040-0.52 0.24-0.72l1.8-1.8c0.2-0.2 0.48-0.28 0.76-0.24l2.040 0.36 2.68-2.68-6.48-3.2c-0.24-0.12-0.4-0.36-0.48-0.64s0.040-0.56 0.24-0.76l2-2c0.2-0.2 0.52-0.28 0.8-0.24l8.48 2.2 2.96-2.96c1.040-1.040 3.48-1.8 4.72-0.56 0.56 0.56 0.76 1.48 0.56 2.52-0.16 0.84-0.6 1.64-1.12 2.16l-2.96 2.96 2.2 8.48c0.080 0.28 0 0.6-0.24 0.8l-2 2c-0.2 0.2-0.48 0.28-0.76 0.24s-0.52-0.2-0.64-0.48l-3.2-6.48-2.68 2.68 0.36 2.040c0.040 0.28-0.040 0.56-0.24 0.76l-1.8 1.8c-0.080 0.28-0.28 0.36-0.52 0.36zM2.24 19.28l2.8 1.52c0.16 0.080 0.24 0.2 0.32 0.32l1.52 2.8 0.68-0.68-0.32-2.040c-0.040-0.28 0.040-0.56 0.24-0.76l3.84-3.84c0.2-0.2 0.48-0.28 0.76-0.24s0.52 0.2 0.64 0.48l3.2 6.48 0.8-0.8-2.2-8.48c-0.080-0.28 0-0.6 0.24-0.8l3.28-3.28c0.6-0.6 0.92-1.96 0.56-2.32s-1.72 0-2.32 0.56l-3.28 3.28c-0.2 0.2-0.52 0.28-0.8 0.24l-8.52-2.2-0.8 0.8 6.48 3.2c0.24 0.12 0.4 0.36 0.48 0.64s-0.040 0.56-0.24 0.76l-3.84 3.84c-0.2 0.2-0.48 0.28-0.76 0.24l-2.040-0.36-0.72 0.64z"; // Replace with actual SVG path for a travel icon
      break;
    case "Transfer":
      path =
        "M6.99 11L3 15l3.99 4v-3H14v-2H6.99v-3zM21 9l-3.99-4v3H10v2h7.01v3L21 9z"; // Replace with actual SVG path for a transfer icon
      break;
    case "Others":
      path =
        "M5.5 16c0-1.5-1.25-2.75-2.75-2.75-1.531 0-2.75 1.25-2.75 2.75s1.219 2.75 2.75 2.75c1.5 0 2.75-1.25 2.75-2.75zM13.938 16c0-1.5-1.25-2.75-2.75-2.75s-2.75 1.25-2.75 2.75 1.25 2.75 2.75 2.75 2.75-1.25 2.75-2.75zM22.406 16c0-1.5-1.219-2.75-2.75-2.75-1.5 0-2.75 1.25-2.75 2.75s1.25 2.75 2.75 2.75c1.531 0 2.75-1.25 2.75-2.75z"; // Replace with actual SVG path for an "others" icon
      break;
    default:
      path = "";
  }

  return (
    <svg
      x={x - 30}
      y={y - 5}
      width={2400}
      height={2400}
      viewBox="0 0 1024 1024"
      fill="#666"
    >
      <path d={path} />
    </svg>
  );
};

function getIntroOfPage(label) {
  if (label === "Page A") {
    return "Page A is about men's clothing";
  }
  if (label === "Page B") {
    return "Page B is about women's dress";
  }
  if (label === "Page C") {
    return "Page C is about women's bag";
  }
  if (label === "Page D") {
    return "Page D is about household goods";
  }
  if (label === "Page E") {
    return "Page E is about food";
  }
  if (label === "Page F") {
    return "Page F is about baby food";
  }
}

function CustomTooltip({ payload, label, active }) {
  if (active) {
    return (
      <div className="-yelow-500">
        <p className="label">{`${label} : ${payload[0].value}`}</p>
        <p className="intro">{getIntroOfPage(label)}</p>
        <p className="desc text-yellow-500">
          Anything you want can be displayed here.
        </p>
      </div>
    );
  }

  return null;
}
// Categories: Food, payment, travel, Transfer, Others
const renderBarChart = () => (
  <BarChart
    width={800}
    height={400}
    data={data}
    margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5,
    }}
  >
    <XAxis dataKey="name" tick={renderCustomAxisTick} />
    <YAxis />
    <CartesianGrid strokeDasharray="3 3" />
    <Legend />
    <Tooltip cursor={{ fill: "rgba(255, 255, 255, 0.1)" }} />
    <Bar dataKey="uv" fill="#00C5C8" />
    <Bar dataKey="pv" fill="#FF6B6B" />
  </BarChart>
);

export default renderBarChart;

// const renderCustomBarLabel = ({ payload, x, y, width, height, value }) => {
//   return (
//     <text
//       x={x + width / 2}
//       y={y}
//       fill="#666"
//       textAnchor="middle"
//       dy={-6}
//     >{`value: ${value}`}</text>
//   );
// };
