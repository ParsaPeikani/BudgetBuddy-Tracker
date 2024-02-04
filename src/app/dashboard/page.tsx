import { UserButton } from "@clerk/nextjs";
import Link from "next/link"; // Import Link from Next.js

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen">
      {" "}
      {/* Added a background color for contrast */}
      <div className="p-4 text-white flex justify-between items-center bg-gradient-to-b from-blue-900 to-transparent">
        {" "}
        {/* Added a background color to the header */}
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="flex items-center space-x-4">
          {" "}
          {/* Use flexbox for alignment and spacing */}
          {/* Link to the home page */}
          <Link href="/" passHref>
            <a className="text-white hover:underline">Go to Home Page</a>{" "}
            {/* Styling for the link */}
          </Link>
          <div className="UserButton">
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </div>
    </div>
  );
}
