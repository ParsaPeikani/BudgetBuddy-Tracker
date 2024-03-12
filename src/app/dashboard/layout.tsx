import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: "BudgetPro | Dashbaord",
  description: "Track your expenses and manage your personal budget.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <section>{children}</section>
      <Toaster />
    </div>
  );
}
