import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
export default function Navbar() {
  return (
    <div className="p-4 text-white flex justify-between items-center">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <Link href="/" passHref>
          <div className="text-white hover:text-blue-400 cursor-pointer transition duration-300 ease-in-out transform hover:scale-110">
            Home Page
          </div>
        </Link>
        <div className="UserButton">
          <UserButton afterSignOutUrl="/" />
        </div>
      </div>
    </div>
  );
}
