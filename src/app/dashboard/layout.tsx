import type { Metadata } from "next";

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
    <html lang="en">
      <body className="landing-page">{children}</body>
    </html>
  );
}
