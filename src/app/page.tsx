import { SignedOut } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {
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
