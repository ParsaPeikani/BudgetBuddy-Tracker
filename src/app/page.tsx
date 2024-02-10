"use client";

import { SignedOut } from "@clerk/nextjs";
import axios from "axios";
import Link from "next/link";

export default function Home() {
  const handleClick = async (e: any) => {
    // e.preventDefault(); // Stop the link from triggering a page navigation
    try {
      const response = await axios.post("/api/hello", { name: "parsa" });
      console.log(response.data.message); // "Hello from Next.js!"
    } catch (error) {
      console.error("There was an error!", error);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-deep-blue text-white space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to BudgetPro</h1>
        <p className="max-w-md text-lg">
          Your personal finance assistant. Manage your budgets, track your
          expenses, and make smarter financial decisions with BudgetPro.
        </p>
      </div>

      <Link
        href="/dashboard"
        onClick={handleClick}
        className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 transition duration-300"
      >
        Go to Dashboard
      </Link>

      <SignedOut>
        <div className="text-center">
          <Link
            href="/sign-up"
            className="px-6 py-3 bg-green-500 text-white font-semibold rounded-lg shadow hover:bg-green-600 transition duration-300"
          >
            Sign in or Sign up
          </Link>
        </div>
      </SignedOut>
    </div>
  );
}
