import axios from "axios";
import { toast } from "sonner";
import { usePlaidLink } from "react-plaid-link";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";

interface CreateLinkTokenResponse {
  link_token: string;
}

interface ExchangePublicTokenResponse {
  access_token: string;
}

const PlaidLinkComponent = ({
  isCIBCData,
  setShowPlaidLink,
  setShowGetLatestCIBCData,
  setShowGetLatestTDData,
}: {
  isCIBCData: boolean;
  setShowPlaidLink: Dispatch<SetStateAction<boolean>>;
  setShowGetLatestCIBCData?: Dispatch<SetStateAction<boolean>> | undefined;
  setShowGetLatestTDData?: Dispatch<SetStateAction<boolean>> | undefined;
}) => {
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

  const onSuccess = async (public_token: any, metadata: any) => {
    console.log("hello we are getting here");
    try {
      setShowPlaidLink(false);
      const response = await axios.post("/api/plaid/exchange_public_token", {
        public_token,
      });
      const accessToken = response.data.access_token;
      console.log("Access token:", accessToken);

      if (isCIBCData) {
        // Call the API route to update the .env.local file for CIBC access token
        await axios.post("/api/env/update_cibc_env", {
          access_token: accessToken,
        });
        console.log("Access token updated in .env.local");
        await axios.put("/api/updateData/updateCIBCData");
        console.log("CIBC Data updated successfully");
        toast("CIBC Data Has Been Updated :)", {
          position: "top-center",
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        });
      } else {
        // Call the API route to update the .env.local file for TD access token
        await axios.post("/api/env/update_td_env", {
          access_token: accessToken,
        });
        console.log("Access token updated in .env.local");
        await axios.put("/api/updateData/updateTDData");
        console.log("TD Data updated successfully");
        toast("TD Data Has Been Updated :)", {
          position: "top-center",
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        });
      }
    } catch (error) {
      console.error(
        "Error exchanging public token or updating .env.local:",
        error
      );
    }
  };

  const config = {
    token: linkToken!,
    onSuccess,
    onExit: (err: any, metadata: any) => {
      setShowPlaidLink(false);
      if (isCIBCData) {
        setShowGetLatestCIBCData && setShowGetLatestCIBCData(true);
      } else {
        setShowGetLatestTDData && setShowGetLatestTDData(true);
      }
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
function setShowGetLatestCIBCData(arg0: boolean) {
  throw new Error("Function not implemented.");
}
