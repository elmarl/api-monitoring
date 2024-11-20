import React, { useState } from "react";
import { generateAPIKey } from "../../api";
import { toast } from "react-toastify";

interface GenerateAPIKeyProps {
  onGenerate: () => void;
}

const GenerateAPIKey: React.FC<GenerateAPIKeyProps> = ({ onGenerate }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleGenerate = async () => {
    if (
      !window.confirm(
        "Generating a new API key will create a new key. Continue?"
      )
    ) {
      return;
    }

    setLoading(true);
    try {
      await generateAPIKey();
      onGenerate();
      setError("");
      toast.success("API Key generated successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to generate API key");
      toast.error(err.response?.data?.message || "Failed to generate API key");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="generate-api-key">
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate New API Key"}
      </button>
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default GenerateAPIKey;
