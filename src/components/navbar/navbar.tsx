import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
export default function Navbar() {
  return (
    <div className="p-4 text-white flex justify-between items-center">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Link href="/" passHref>
          <div className="text-white hover:underline">Home Page</div>{" "}
        </Link>
        <div className="UserButton">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
