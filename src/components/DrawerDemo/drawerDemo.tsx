import * as React from "react";
import { GearIcon, TrashIcon } from "@radix-ui/react-icons";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { data } from "@/components/constants/Drawerdata";
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

export function DrawerDemo({
  transaction,
  deleteTransaction,
}: {
  transaction: any;
  deleteTransaction: Function;
}) {
  // Define a state variable to store the fetched transaction
  const [originalTransaction, setOriginalTransaction] = useState<any>(null);
  //   console.log("This is the transaction", transaction);
  // const date = new Date(transaction.date);
  const date = transaction.date ? new Date(transaction.date) : new Date();

  const options: DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);

  useEffect(() => {
    const fetchTransaction = async () => {
      try {
        const response = await axios.get(
          `/api/mongoDB/findTransaction?transactionId=${transaction.id}`
        );
        const data = response.data;
        console.log("this is the data", data);
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

  //   console.log("This is the original transaction", originalTransaction);
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="flex bg-black border-none text-white font-normal "
        >
          Details
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
              <div>
                <h3 className="text-sm text-muted-foreground">Date</h3>
                <h3 className="text-lg font-semibold tracking-tighter">
                  {formattedDate}
                </h3>
              </div>
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
            </div>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {originalTransaction?.amount}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Dollars ({originalTransaction?.currency})
                </div>
              </div>
            </div>
            <div className="flex justify-between">
              <div>
                <h3 className="text-sm text-muted-foreground">
                  Transaction Id
                </h3>
                <h3 className="text-lg font-semibold tracking-tighter">
                  {originalTransaction?.transactionId}
                </h3>
              </div>
            </div>
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
              <Button className="flex-1 mr-1" variant="secondary">
                Edit
              </Button>{" "}
              <Button
                className="flex-1 ml-1"
                variant="delete"
                onClick={() => [deleteTransaction(transaction.id)]}
              >
                Delete
              </Button>{" "}
            </div>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
