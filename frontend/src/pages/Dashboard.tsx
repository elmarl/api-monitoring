import React, { useEffect, useState } from "react";
import APIKeyList from "../components/APIKeys/APIKeyList";
import UsageChart from "../components/Dashboard/UsageChart";
import { getSocket } from "../services/socket";

interface UsageData {
  method: string;
  endpoint: string;
  statusCode: number;
  responseTime: number;
  timestamp: string;
}

const Dashboard: React.FC = () => {
  const [usageData, setUsageData] = useState<UsageData[]>([]);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      return;
    }
    socket.on("connect", () => {
      console.log("Connected to WebSocket server");
    });

    socket.on("usage", (data: UsageData) => {
      console.log("used!", data);

      setUsageData((prev) => [...prev, data]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });

    return () => {
      socket.off("connect");
      socket.off("usage");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) {
      return;
    }
    socket.on("usage", (data: any) => {
      console.log("Received usage data:", data);
      setUsageData((prevData) => [...prevData, data]);
    });

    return () => {
      socket.off("usage");
    };
  }, []);

  return (
    <div className="dashboard-container">
      <h2>API Usage Dashboard</h2>
      <UsageChart data={usageData} />
      <APIKeyList />
    </div>
  );
};

export default Dashboard;
