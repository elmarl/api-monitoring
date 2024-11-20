import React, { useEffect, useState } from "react";
import { fetchAPIKeys, revokeAPIKey } from "../../api";
import GenerateAPIKey from "./GenerateAPIKeys";
import APIKeyItem from "./APIKeyItem";

interface APIKey {
  id: string;
  key: string;
  createdAt: string;
}

const APIKeyList: React.FC = () => {
  const [apiKeys, setApiKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const loadAPIKeys = async () => {
    setLoading(true);
    try {
      const response = await fetchAPIKeys();
      setApiKeys(response.data);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to fetch API keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAPIKeys();
  }, []);

  const handleRevoke = async (id: string) => {
    try {
      await revokeAPIKey(id);
      setApiKeys(apiKeys.filter((key) => key.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to revoke API key");
    }
  };

  return (
    <div className="api-keys-container">
      <h3>Your API Keys</h3>
      <GenerateAPIKey onGenerate={loadAPIKeys} />

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error-msg">{error}</p>
      ) : apiKeys.length === 0 ? (
        <p>No API keys found. Generate one to start monitoring.</p>
      ) : (
        <ul>
          {apiKeys.map((key) => (
            <APIKeyItem key={key.id} apiKey={key} onRevoke={handleRevoke} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default APIKeyList;
