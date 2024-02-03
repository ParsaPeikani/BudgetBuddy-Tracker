import { UserButton } from "@clerk/nextjs";
export default function Dashboard() {
  return (
    <div className="h-screen">
      <h1> This is the Dashboard page</h1>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
