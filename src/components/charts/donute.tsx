import { ResponsivePie } from "@nivo/pie";
import { useState, useEffect } from "react";

export default function MyResponsivePie({ data }: { data: any[] }) {
  const [parentHeight, setParentHeight] = useState(window.innerHeight / 1.75);

  useEffect(() => {
    const handleResize = () => {
      setParentHeight(window.innerHeight / 1.75);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const testingdata = [
    { id: "Food", label: "Food", value: 0 },
    { id: "Shopping", label: "Shopping", value: 0 },
    { id: "Travel", label: "Travel", value: 0 },
    { id: "Transfer", label: "Transfer", value: 0 },
    { id: "Others", label: "Others", value: 0 },
  ];

  // Update values from data
  for (let i = 0; i < data.length; i++) {
    if (data[i].category === "Food and Drink") {
      testingdata[0].value += 1;
    } else if (data[i].category === "Payment") {
      testingdata[1].value += 1;
    } else if (data[i].category === "Travel") {
      testingdata[2].value += 1;
    } else if (data[i].category === "Transfer") {
      testingdata[3].value += 1;
    } else {
      testingdata[4].value += 1;
    }
  }

  // Calculate total
  const total = testingdata.reduce((acc, current) => acc + current.value, 0);

  // Convert values to percentages
  const percentData = testingdata.map((item) => ({
    ...item,
    label: `${item.label}`,
    value: `${((item.value / total) * 100).toFixed(2)}`,
  }));

  return (
    <div>
      <h2
        style={{
          textAlign: "center",
          color: "#E0E0E0",
          textShadow: "0 0 8px rgba(255, 255, 255, 0.4)",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: "24px",
          fontWeight: "normal",
          marginBottom: "20px",
        }}
      >
        Each Transaction Category In Percentile
      </h2>
      <div className="flex mt-[-20px]" style={{ height: `${parentHeight}px` }}>
        <ResponsivePie
          data={percentData}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{ from: "color", modifiers: [["darker", 0.2]] }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#FFFFE0"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{ from: "color", modifiers: [["darker", 2]] }}
          valueFormat={(value) => `${value}%`}
          theme={{
            labels: {
              text: {
                fontSize: 20,
              },
            },
            legends: {
              text: {
                fontSize: 14,
              },
            },
          }}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 55,
              itemsSpacing: 0,
              itemWidth: 100,
              itemHeight: 18,
              itemTextColor: "#999",
              itemDirection: "left-to-right",
              itemOpacity: 1,
              symbolSize: 20,
              symbolShape: "circle",
              effects: [
                {
                  on: "hover",
                  style: {
                    itemTextColor: "#fff",
                  },
                },
              ],
            },
          ]}
          animate={true}
          motionConfig="gentle"
          tooltip={({ datum: { id, value, color } }) => (
            <div
              style={{
                padding: 12,
                color,
                background: "#222222",
              }}
            >
              <span>{`Number of ${id} Transactions: `}</span>
              <br />
              <strong>{Math.round((value * total) / 100)}</strong>
            </div>
          )}
        />
      </div>
    </div>
  );
}
