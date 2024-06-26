// RootLayout.jsx or RootLayout.tsx
"use client";

// import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import {
  CIBCTransactionsProvider,
  TDTransactionsProvider,
  OpenAIProvider,
} from "@/components/serverFunctions/apiCalls";

// export const metadata: Metadata = {
//   title: "BudgetPro | Dashboard",
//   description: "Track your expenses and manage your personal budget.",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <CIBCTransactionsProvider>
      <TDTransactionsProvider>
        <OpenAIProvider>
          <div>
            <section>{children}</section>
          </div>
        </OpenAIProvider>
      </TDTransactionsProvider>
    </CIBCTransactionsProvider>
  );
}

// import type { Metadata } from "next";
// import { Toaster } from "@/components/ui/sonner";

// export const metadata: Metadata = {
//   title: "BudgetPro | Dashbaord",
//   description: "Track your expenses and manage your personal budget.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <div>
//       <section>{children}</section>
//       <Toaster />
//     </div>
//   );
// }
