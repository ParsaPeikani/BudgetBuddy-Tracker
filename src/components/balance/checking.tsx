import * as React from "react";
import { CheckingTable } from "./checkingTable";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CheckingComponent() {
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>TD STUDENT CHEQUING ACCOUNT</CardTitle>
        <CardDescription>
          These are details about your TD checking account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-gray-500 text-lg">
          <p>Account Number: ******0936</p>
          <p>Balance: $12,345.67</p>
        </div>
        <div className="flex flex-col justify-center items-center p-5">
          <h1 className="text-white text-2xl font-bold">
            Recent Transaction Table
          </h1>
          <CheckingTable />
        </div>

        <form>
          <div className="grid w-full items-center gap-4"></div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
