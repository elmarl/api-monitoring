import React from "react";
import APIKeyList from "../components/APIKeys/APIKeyList";

const APIKeysPage: React.FC = () => {
  return (
    <div className="api-keys-page">
      <APIKeyList />
    </div>
  );
};

export default APIKeysPage;
