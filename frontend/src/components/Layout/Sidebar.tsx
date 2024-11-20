import React from "react";
import { Link } from "react-router-dom";

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-gray-100 p-4">
      <nav className="flex flex-col space-y-2">
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          Dashboard
        </Link>
        <Link to="/api-keys" className="text-blue-500 hover:underline">
          API Keys
        </Link>
      </nav>
    </aside>
  );
};

export default Sidebar;
