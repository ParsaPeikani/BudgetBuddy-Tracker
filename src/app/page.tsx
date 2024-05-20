"use client";

import axios from "axios";
import Link from "next/link";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignedOut, SignedIn } from "@clerk/nextjs";
import PlaidLinkComponent from "@/components/plaidLink/plaidLink";

export default function Home() {
  const getCIBCData = async () => {
    try {
      const response = await axios.put("/api/updateData/updateCIBCData");
      if (response.status === 200) {
        toast("CIBC Data Has Been Updated :)", {
          position: "top-center",
          style: {
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          },
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 401 && data.error === "ITEM_LOGIN_REQUIRED") {
          // Show re-authentication flow
          setShowGetLatestCIBCData(false);
          setIsCIBCData(true);
          setShowPlaidLink(true);
        } else {
          console.error("Error fetching transactions:", data.error);
        }
      } else {
        console.error("Error:", error);
      }
    }
  };

  const getTDData = async () => {
    try {
      const response = await axios.put("/api/updateData/updateTDData");
      if (response.status === 200) {
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
      if (axios.isAxiosError(error) && error.response) {
        const { status, data } = error.response;
        if (status === 401 && data.error === "ITEM_LOGIN_REQUIRED") {
          // Show re-authentication flow
          setShowGetLatestTDData(false);
          setShowPlaidLink(true);
        } else {
          console.error("Error fetching transactions:", data.error);
        }
      } else {
        console.error("Error:", error);
      }
    }
  };

  const [showPlaidLink, setShowPlaidLink] = useState(false);
  const [showGetLatestCIBCData, setShowGetLatestCIBCData] = useState(true);
  const [showGetLatestTDData, setShowGetLatestTDData] = useState(true);
  const [isCIBCData, setIsCIBCData] = useState(false);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-deep-blue text-white space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome To BudgetPro Parsa</h1>
        <p className="max-w-md text-lg">Your Personal Finance Assistant :)</p>
      </div>

      <Link
        href="/dashboard"
        className="px-6 py-3 bg-transparent text-white font-semibold rounded-lg shadow hover:bg-white hover:text-black transition duration-300 border-2 border-white"
      >
        Go To Dashboard
      </Link>

      <SignedIn>
        {showGetLatestCIBCData && (
          <Button
            variant="outline"
            className="border-2 text-md py-6 px-6"
            onClick={() => {
              getCIBCData();
            }}
          >
            Get Latest CIBC Data
          </Button>
        )}
        {showPlaidLink && <PlaidLinkComponent isCIBCData={isCIBCData} />}

        {showGetLatestTDData && (
          <Button
            variant="outline"
            className="border-2 text-md py-6 px-6"
            onClick={() => {
              getTDData();
            }}
          >
            Get Latest TD Data
          </Button>
        )}
        {showPlaidLink && <PlaidLinkComponent isCIBCData={isCIBCData} />}
      </SignedIn>

      <SignedOut>
        <div className="text-center">
          <Link
            href="/sign-up"
            className="px-6 py-4 bg-transparent text-white font-semibold rounded-lg shadow hover:bg-white hover:text-black transition duration-300 border-2 border-white"
          >
            Sign in or Sign up
          </Link>
        </div>
      </SignedOut>
    </div>
  );
}
