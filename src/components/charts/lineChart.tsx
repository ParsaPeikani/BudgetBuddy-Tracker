import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

export default function MyLineChart({ data }: { data: any }) {
  return (
    <div>
      <h1
        style={{
          textAlign: "center",
          color: "#E0E0E0", // Light grey color; consider using pure white (#FFF) if the glow isn't distinct enough
          textShadow: "0 0 8px rgba(255, 255, 255, 0.4)", // White glow effect
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          fontSize: "34px",
          fontWeight: "normal",
          marginBottom: "20px",
        }}
      >
        Income vs Expenses
      </h1>
      <ResponsiveContainer width="100%" height={500}>
        <AreaChart
          data={data}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#2f2f2f" />
          <XAxis dataKey="month" stroke="#ccc" tick={{ fill: "#fff" }} />
          <YAxis stroke="#ccc" tick={{ fill: "#fff" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#333",
              border: "none",
              borderRadius: 5,
            }}
            cursor={{ fill: "rgba(136, 132, 216, 0.2)" }}
            itemStyle={{ color: "#fff" }}
          />
          <Legend />
          <Area
            type="monotone"
            dataKey="expenses"
            stroke="#ff7300"
            fill="rgba(255, 115, 0, 0.6)" // Light opacity fill for the area
            activeDot={{ r: 8 }}
          />
          <Area
            type="monotone"
            dataKey="income"
            stroke="#347eff"
            fill="rgba(52, 126, 255, 0.6)" // Light opacity fill for the area
            activeDot={{ r: 8 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
