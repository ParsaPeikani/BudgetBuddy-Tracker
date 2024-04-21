// install (please try to align the version of installed @nivo packages)
// yarn add @nivo/bar
import { ResponsiveBar } from "@nivo/bar";

// make sure parent container have a defined height when using
// responsive component, otherwise height will be 0 and
// no chart will be rendered.
// website examples showcase many properties,
// you'll often use just a few of them.
export default function MonthlyBarChart() {
  const data = [
    {
      country: "Janurary",
      "hot dog": 119,
      "hot dogColor": "hsl(264, 70%, 50%)",
      burger: 111,
      burgerColor: "hsl(225, 70%, 50%)",
      sandwich: 37,
      sandwichColor: "hsl(61, 70%, 50%)",
      kebab: 139,
      kebabColor: "hsl(25, 70%, 50%)",
      fries: 73,
      friesColor: "hsl(306, 70%, 50%)",
      donut: 200,
      donutColor: "hsl(262, 70%, 50%)",
    },
    {
      country: "Feburary",
      "hot dog": 14,
      "hot dogColor": "hsl(111, 70%, 50%)",
      burger: 122,
      burgerColor: "hsl(47, 70%, 50%)",
      sandwich: 144,
      sandwichColor: "hsl(182, 70%, 50%)",
      kebab: 196,
      kebabColor: "hsl(172, 70%, 50%)",
      fries: 170,
      friesColor: "hsl(39, 70%, 50%)",
      donut: 9,
      donutColor: "hsl(249, 70%, 50%)",
    },
    {
      country: "March",
      "hot dog": 5,
      "hot dogColor": "hsl(226, 70%, 50%)",
      burger: 136,
      burgerColor: "hsl(255, 70%, 50%)",
      sandwich: 26,
      sandwichColor: "hsl(199, 70%, 50%)",
      kebab: 193,
      kebabColor: "hsl(130, 70%, 50%)",
      fries: 192,
      friesColor: "hsl(71, 70%, 50%)",
      donut: 11,
      donutColor: "hsl(349, 70%, 50%)",
    },
    {
      country: "April",
      "hot dog": 47,
      "hot dogColor": "hsl(70, 70%, 50%)",
      burger: 23,
      burgerColor: "hsl(89, 70%, 50%)",
      sandwich: 9,
      sandwichColor: "hsl(214, 70%, 50%)",
      kebab: 195,
      kebabColor: "hsl(242, 70%, 50%)",
      fries: 174,
      friesColor: "hsl(220, 70%, 50%)",
      donut: 115,
      donutColor: "hsl(323, 70%, 50%)",
    },
    {
      country: "May",
      "hot dog": 157,
      "hot dogColor": "hsl(266, 70%, 50%)",
      burger: 92,
      burgerColor: "hsl(22, 70%, 50%)",
      sandwich: 37,
      sandwichColor: "hsl(92, 70%, 50%)",
      kebab: 196,
      kebabColor: "hsl(319, 70%, 50%)",
      fries: 107,
      friesColor: "hsl(128, 70%, 50%)",
      donut: 83,
      donutColor: "hsl(64, 70%, 50%)",
    },
    {
      country: "June",
      "hot dog": 35,
      "hot dogColor": "hsl(352, 70%, 50%)",
      burger: 189,
      burgerColor: "hsl(124, 70%, 50%)",
      sandwich: 47,
      sandwichColor: "hsl(315, 70%, 50%)",
      kebab: 167,
      kebabColor: "hsl(359, 70%, 50%)",
      fries: 20,
      friesColor: "hsl(54, 70%, 50%)",
      donut: 18,
      donutColor: "hsl(305, 70%, 50%)",
    },
    {
      country: "July",
      "hot dog": 159,
      "hot dogColor": "hsl(280, 70%, 50%)",
      burger: 43,
      burgerColor: "hsl(316, 70%, 50%)",
      sandwich: 92,
      sandwichColor: "hsl(88, 70%, 50%)",
      kebab: 16,
      kebabColor: "hsl(25, 70%, 50%)",
      fries: 116,
      friesColor: "hsl(347, 70%, 50%)",
      donut: 26,
      donutColor: "hsl(103, 70%, 50%)",
    },
    {
      country: "August",
      "hot dog": 119,
      "hot dogColor": "hsl(264, 70%, 50%)",
      burger: 111,
      burgerColor: "hsl(225, 70%, 50%)",
      sandwich: 37,
      sandwichColor: "hsl(61, 70%, 50%)",
      kebab: 139,
      kebabColor: "hsl(25, 70%, 50%)",
      fries: 73,
      friesColor: "hsl(306, 70%, 50%)",
      donut: 200,
      donutColor: "hsl(262, 70%, 50%)",
    },
    {
      country: "September",
      "hot dog": 14,
      "hot dogColor": "hsl(111, 70%, 50%)",
      burger: 122,
      burgerColor: "hsl(47, 70%, 50%)",
      sandwich: 144,
      sandwichColor: "hsl(182, 70%, 50%)",
      kebab: 196,
      kebabColor: "hsl(172, 70%, 50%)",
      fries: 170,
      friesColor: "hsl(39, 70%, 50%)",
      donut: 9,
      donutColor: "hsl(249, 70%, 50%)",
    },
    {
      country: "October",
      "hot dog": 5,
      "hot dogColor": "hsl(226, 70%, 50%)",
      burger: 136,
      burgerColor: "hsl(255, 70%, 50%)",
      sandwich: 26,
      sandwichColor: "hsl(199, 70%, 50%)",
      kebab: 193,
      kebabColor: "hsl(130, 70%, 50%)",
      fries: 192,
      friesColor: "hsl(71, 70%, 50%)",
      donut: 11,
      donutColor: "hsl(349, 70%, 50%)",
    },
    {
      country: "November",
      "hot dog": 47,
      "hot dogColor": "hsl(70, 70%, 50%)",
      burger: 23,
      burgerColor: "hsl(89, 70%, 50%)",
      sandwich: 9,
      sandwichColor: "hsl(214, 70%, 50%)",
      kebab: 195,
      kebabColor: "hsl(242, 70%, 50%)",
      fries: 174,
      friesColor: "hsl(220, 70%, 50%)",
      donut: 115,
      donutColor: "hsl(323, 70%, 50%)",
    },
    {
      country: "December",
      "hot dog": 157,
      "hot dogColor": "hsl(266, 70%, 50%)",
      burger: 92,
      burgerColor: "hsl(22, 70%, 50%)",
      sandwich: 37,
      sandwichColor: "hsl(92, 70%, 50%)",
      kebab: 196,
      kebabColor: "hsl(319, 70%, 50%)",
      fries: 107,
      friesColor: "hsl(128, 70%, 50%)",
      donut: 83,
      donutColor: "hsl(64, 70%, 50%)",
    },
  ];
  return (
    <div style={{ height: "500px", width: "1500px" }}>
      <ResponsiveBar
        data={data}
        keys={["hot dog", "burger", "sandwich", "kebab", "fries", "donut"]}
        indexBy="country"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
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
        fill={[
          {
            match: {
              id: "fries",
            },
            id: "dots",
          },
          {
            match: {
              id: "sandwich",
            },
            id: "lines",
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
          legend: "country",
          legendPosition: "middle",
          legendOffset: 32,
          truncateTickAt: 0,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "food",
          legendPosition: "middle",
          legendOffset: -40,
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
                },
              },
            ],
          },
        ]}
        // layout="horizontal"
        // enableGridY={false}
        // enableGridX={true}
        role="application"
        ariaLabel="Nivo bar chart demo"
        barAriaLabel={(e) =>
          e.id + ": " + e.formattedValue + " in country: " + e.indexValue
        }
      />
    </div>
  );
}
