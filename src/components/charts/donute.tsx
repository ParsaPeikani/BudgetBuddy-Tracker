import { ResponsivePie } from "@nivo/pie";

export default function MyResponsivePie({ data }: { data: any[] }) {
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
      arcLinkLabelsTextColor="#333333"
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
      }}
    />
  );
}
