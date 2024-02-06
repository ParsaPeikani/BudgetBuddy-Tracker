import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "BudgetPro | Authentication",
  description: "Authentication for BudgetPro.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>
      {children}
    </section>
  );
}
