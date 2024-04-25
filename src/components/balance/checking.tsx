import * as React from "react";
import { CheckingTable } from "./checkingTable";
import { CheckingDeposit } from "./checkingDeposit";
import { Checking } from "./checkingTable";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function CheckingComponent({
  account,
  transactions,
}: {
  account: any;
  transactions: Checking[];
}) {
  // console.log("these are the transactions", transactions[0]);
  return (
    <Card className="w-1/2">
      <CardHeader>
        <CardTitle>{account?.name}</CardTitle>
        <CardDescription>
          These are details about your TD checking account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-gray-200 text-lg bg-black p-4 rounded-lg">
          <div>
            <div className="flex justify-between mb-4">
              <p className="font-medium">
                Account Number:{" "}
                <span className="font-normal text-gray-400">
                  ******{account?.mask}
                </span>
              </p>
              <p className="font-medium">
                Balance:{" "}
                <span className="font-normal text-gray-400">
                  ${account?.balances?.available}
                </span>
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">
                Account ID:{" "}
                <span className="font-normal text-gray-400">
                  {account?.accountId}
                </span>
              </p>
              <div className="flex">
                <CheckingDeposit />
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center p-5">
          <h1 className="text-white text-2xl font-bold mb-4">
            Recent Checking Transaction Table
          </h1>
          <CheckingTable data={transactions} />
        </div>

        <form>
          <div className="grid w-full items-center gap-4"></div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between"></CardFooter>
    </Card>
  );
}
