import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface UsageData {
  method: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
}

interface UsageChartProps {
  data: UsageData[];
}

const UsageChart: React.FC<UsageChartProps> = ({ data }) => {
  // Aggregate data by time intervals (e.g., per minute)
  const aggregatedData = data.reduce((acc: any[], curr) => {
    const time = new Date(curr.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const existing = acc.find((item) => item.time === time);
    if (existing) {
      existing.requests += 1;
      existing.avgResponseTime =
        (existing.avgResponseTime * (existing.requests - 1) +
          curr.responseTime) /
        existing.requests;
    } else {
      acc.push({ time, requests: 1, avgResponseTime: curr.responseTime });
    }
    return acc;
  }, []);

  return (
    <div className="usage-chart">
      <h3>API Requests Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={aggregatedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis
            yAxisId="left"
            label={{ value: "Requests", angle: -90, position: "insideLeft" }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{
              value: "Avg Response Time (ms)",
              angle: -90,
              position: "insideRight",
            }}
          />
          <Tooltip />
          <Line
            yAxisId="left"
            type="monotone"
            dataKey="requests"
            stroke="#8884d8"
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="avgResponseTime"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UsageChart;
