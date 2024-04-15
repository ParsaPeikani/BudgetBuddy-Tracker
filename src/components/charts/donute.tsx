import { ResponsivePie } from "@nivo/pie";
import { useState, useEffect } from "react";

export default function MyResponsivePie({ data }: { data: any[] }) {
  // Set initial height based on a fraction of the window height
  const [parentHeight, setParentHeight] = useState(window.innerHeight / 1.75);

  useEffect(() => {
    const handleResize = () => {
      // Update the height based on the window size
      setParentHeight(window.innerHeight / 1.75);
    };

    // Listen for window resize events
    window.addEventListener("resize", handleResize);

    // Clean up the event listener when the component unmounts
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const testingdata = [
    {
      id: "Food",
      label: "Food",
      value: 0,
      color: "hsl(114, 70%, 50%)",
    },
    {
      id: "Shopping",
      label: "Shopping",
      value: 0,
      color: "hsl(224, 70%, 50%)",
    },
    {
      id: "Travel",
      label: "Travel",
      value: 0,
      color: "hsl(169, 70%, 50%)",
    },
    {
      id: "Transfer",
      label: "Transfer",
      value: 0,
      color: "hsl(95, 70%, 50%)",
    },
    {
      id: "Others",
      label: "Others",
      value: 0,
      color: "hsl(279, 70%, 50%)",
    },
  ];
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
        Number of each Transaction Category
      </h2>
      <div className="flex mt-[-20px]" style={{ height: `${parentHeight}px` }}>
        <ResponsivePie
          data={testingdata}
          margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          activeOuterRadiusOffset={8}
          borderWidth={1}
          borderColor={{
            from: "color",
            modifiers: [["darker", 0.2]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#FFFFE0"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{ from: "color" }}
          arcLabelsSkipAngle={10}
          arcLabelsTextColor={{
            from: "color",
            modifiers: [["darker", 2]],
          }}
          theme={{
            labels: {
              text: {
                fontSize: 20, // Sets font size for labels
              },
            },
            legends: {
              text: {
                fontSize: 14, // Specify the desired font size here
              },
            },
          }}
          legends={[
            {
              anchor: "bottom",
              direction: "row",
              justify: false,
              translateX: 0,
              translateY: 40,
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
        />
      </div>
    </div>
  );
}
