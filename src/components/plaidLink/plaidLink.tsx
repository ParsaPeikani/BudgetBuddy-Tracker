import React, { useState, useEffect } from "react";
import axios from "axios";
import { usePlaidLink } from "react-plaid-link";
import { Button } from "../ui/button";

interface CreateLinkTokenResponse {
  link_token: string;
}

interface ExchangePublicTokenResponse {
  access_token: string;
}

const PlaidLinkComponent: React.FC = () => {
  const [linkToken, setLinkToken] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the link token from your server when the component mounts
    const fetchLinkToken = async () => {
      try {
        const response = await axios.post<CreateLinkTokenResponse>(
          "/api/plaid/create_link_token",
          {
            userId: "user-id-here", // Adjust this based on your authentication system
          }
        );
        setLinkToken(response.data.link_token);
      } catch (error) {
        console.error("Error fetching link token:", error);
      }
    };

    fetchLinkToken();
  }, []);

  const onSuccess = async (public_token: string, metadata: any) => {
    try {
      const response = await axios.post<ExchangePublicTokenResponse>(
        "/api/plaid/exchange_public_token",
        {
          public_token,
        }
      );
      console.log("Access token:", response.data.access_token);
    } catch (error) {
      console.error("Error exchanging public token:", error);
    }
  };

  const config = {
    token: linkToken!,
    onSuccess,
    onExit: (err: any, metadata: any) => {
      // Handle the exit event, which occurs when the user closes the Plaid Link flow
      console.log("User exited Plaid Link:", err, metadata);
    },
  };

  const { open, ready } = usePlaidLink(config);

  return (
    <div className="flex items-center justify-center text-white">
      <div className="p-6 max-w-sm mx-auto bg-gray-950 rounded-xl shadow-md space-y-4">
        <h1 className="text-2xl font-semibold text-center">
          You need to Re-Authenticate using Plaid Link First
        </h1>
        {linkToken ? (
          <button
            onClick={() => open()}
            disabled={!ready}
            className="w-full py-2 px-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg shadow hover:bg-white hover:text-black transition duration-300"
          >
            Re-authenticate with Plaid
          </button>
        ) : (
          <p className="text-center">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default PlaidLinkComponent;
