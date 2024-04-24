import * as React from "react";
import { CheckingTable } from "./checkingTable";
import { CheckingPopover } from "./checkingPopover";

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
        <div className="text-gray-200 text-lg bg-black p-4 rounded-lg">
          <div>
            <div className="flex justify-between mb-4">
              <p className="font-medium">
                Account Number:{" "}
                <span className="font-normal text-gray-400">******0936</span>
              </p>
              <p className="font-medium">
                Balance:{" "}
                <span className="font-normal text-gray-400">$12,345.67</span>
              </p>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-medium">
                Account ID:{" "}
                <span className="font-normal text-gray-400">
                  dkYXK7qB99SQRnwd9QE7IdgjVwvyg1FKYMo11
                </span>
              </p>
              <div className="flex">
                <CheckingPopover />
              </div>
            </div>
          </div>
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
