import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import APIKeysPage from "./pages/APIKeyPages";
import PrivateRoute from "./components/Layout/PrivateRoute";
import { useAuth } from "./hooks/useAuth";
import { getSocket } from "./services/socket";
import Header from "./components/Layout/Header";
import Sidebar from "./components/Layout/Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  const { token } = useAuth();

  useEffect(() => {
    const socket = getSocket();
    if (token) {
      if (socket) {
        socket.connect();
      }
    } else {
      if (socket) {
        socket.disconnect();
      }
    }
  }, [token]);

  return (
    <Router>
      {token && <Header />}
      <div className="app-container flex">
        {token && <Sidebar />}
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/api-keys"
              element={
                <PrivateRoute>
                  <APIKeysPage />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </main>
      </div>
      <ToastContainer />
    </Router>
  );
};

export default App;
