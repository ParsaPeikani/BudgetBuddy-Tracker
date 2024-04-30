import * as React from "react";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { data } from "@/components/constants/constants";
import { DateTimeFormatOptions } from "intl";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer";
import axios from "axios";
import { useEffect, useState } from "react";
import { Payment } from "../custom-table/columns";

export function TransactionDrawer({
  transaction,
  deleteTransaction,
  title,
}: {
  transaction: any;
  deleteTransaction: Function;
  title: string;
}) {
  // Define a state variable to store the fetched transaction
  const [originalTransaction, setOriginalTransaction] = useState<any>(null);
  const date = transaction.date ? new Date(transaction.date) : new Date();
  const authorizedDate = transaction.authorizedDate
    ? new Date(transaction.authorizedDate)
    : new Date();
  const location = originalTransaction?.location
    ? originalTransaction.location
    : "Unknown";

  const options: DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const accountId = originalTransaction?.accountId;
  const transactionId = originalTransaction?.transactionId;
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  const formattedAuthorizedDate = new Intl.DateTimeFormat(
    "en-US",
    options
  ).format(authorizedDate);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(
          `/api/mongoDB/findTransaction?transactionId=${transaction.id}`
        );
        const data = response.data;
        setOriginalTransaction(data); // Update state with the fetched transaction
      } catch (error) {
        console.error("Failed to fetch transaction:", error);
        setOriginalTransaction(null); // Handle error, e.g., by resetting the state
      }
    };

    if (transaction.id) {
      fetchTransaction();
    }
  }, [transaction.id]); // Dependency array ensures this effect runs when transaction.id changes

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="flex bg-black border-none text-white font-normal "
        >
          {title}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full max-w">
          <DrawerHeader>
            {/* <DrawerTitle className="text-center">Transaction</DrawerTitle> */}
            <DrawerDescription className="text-center">
              More details about your {originalTransaction?.merchantName}{" "}
              transaction{" "}
              {`(${
                originalTransaction?.pending ? "Not Verified" : "Verified"
              })`}
            </DrawerDescription>
            <div className="flex justify-between">
              <div className="flex flex-col">
                <div>
                  <h3 className="text-sm text-center text-muted-foreground">
                    Date
                  </h3>
                  <h3 className="text-lg font-semibold tracking-tighter">
                    {formattedDate}
                  </h3>
                </div>
                <div className="pt-10">
                  <h3 className="text-sm text-center text-muted-foreground">
                    Authorized Date
                  </h3>
                  <h3 className="text-lg font-semibold tracking-tighter">
                    {formattedAuthorizedDate}
                  </h3>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-center">
                  <h3 className="text-sm text-muted-foreground">Categories</h3>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {originalTransaction?.category.map(
                      (category: string, index: number) => (
                        <span
                          key={index}
                          className="bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 shadow-sm"
                        >
                          {category}
                        </span>
                      )
                    )}
                  </div>
                </div>
                <div className="flex flex-row items-center pt-10">
                  <h3 className="text-sm text-muted-foreground pr-4">
                    Location
                  </h3>
                  <h3 className="text-lg font-semibold tracking-tighter">
                    {location}
                  </h3>
                </div>
              </div>
            </div>
          </DrawerHeader>
          <div className="">
            <div className="flex items-center justify-center bg-black rounded-lg shadow-2xl -mt-32">
              <div className="flex-1 text-center">
                <div className="text-6xl font-bold text-gray-200 tracking-tighter shadow-lg">
                  ${originalTransaction?.amount}
                </div>
                <div className="text-sm font-light text-gray-500 mt-3">
                  Dollars ({originalTransaction?.currency})
                </div>
                <h3 className="text-md text-gray-400 mt-5 bg-gray-900 p-3 rounded-md inline-block shadow">
                  This transaction was made{" "}
                  {originalTransaction?.paymentChannel === "in store"
                    ? "in-store"
                    : "online"}
                </h3>
              </div>
            </div>
            <div className="flex flex-row justify-between">
              <div className="flex flex-col pl-5 items-center">
                <h3 className="text-sm text-muted-foreground">Account Id</h3>
                <h3 className="text-lg font-semibold tracking-tighter">
                  {accountId}
                </h3>
              </div>
              <div className="flex flex-col pr-5 items-center">
                <h3 className="text-sm text-muted-foreground">
                  Transaction Id
                </h3>
                <h3 className="text-lg font-semibold tracking-tighter">
                  {transactionId}
                </h3>
              </div>
            </div>

            {/* <div className="flex justify-between">
              <div>
                <h3 className="text-sm text-muted-foreground">
                  Transaction Id
                </h3>
                <h3 className="text-lg font-semibold tracking-tighter">
                  {originalTransaction?.transactionId}
                </h3>
              </div>
            </div> */}
            <div className="mt-3 h-[120px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <Bar
                    dataKey="goal"
                    style={
                      {
                        fill: "hsl(var(--foreground))",
                        opacity: 0.9,
                      } as React.CSSProperties
                    }
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <DrawerFooter>
            <div className="flex w-full mb-2">
              <DrawerClose asChild>
                <Button variant="outline" className="flex-1">
                  Close
                </Button>
              </DrawerClose>
              <Button
                className="flex-1 ml-1"
                variant="delete"
                onClick={() => [deleteTransaction(transaction.id)]}
              >
                Delete
              </Button>{" "}
            </div>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
