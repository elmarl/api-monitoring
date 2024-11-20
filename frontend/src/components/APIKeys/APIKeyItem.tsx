import React from "react";

interface APIKey {
  id: string;
  key: string;
  createdAt: string;
}

interface APIKeyItemProps {
  apiKey: APIKey;
  onRevoke: (id: string) => void;
}

const APIKeyItem: React.FC<APIKeyItemProps> = ({ apiKey, onRevoke }) => {
  const handleRevoke = () => {
    if (window.confirm("Are you sure you want to revoke this API key?")) {
      onRevoke(apiKey.id);
    }
  };

  return (
    <li className="api-key-item">
      <div>
        <p>
          <strong>Key:</strong> {apiKey.key}
        </p>
        <p>
          <strong>Created At:</strong>{" "}
          {new Date(apiKey.createdAt).toLocaleString()}
        </p>
      </div>
      <button onClick={handleRevoke} className="revoke-button">
        Revoke
      </button>
    </li>
  );
};

export default APIKeyItem;
