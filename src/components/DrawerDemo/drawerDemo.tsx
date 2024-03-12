import * as React from "react";
import { GearIcon, TrashIcon } from "@radix-ui/react-icons";
import { Bar, BarChart, ResponsiveContainer } from "recharts";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import axios from "axios";
import { captureRejectionSymbol } from "events";

const data = [
  {
    goal: 400,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 239,
  },
  {
    goal: 300,
  },
  {
    goal: 200,
  },
  {
    goal: 278,
  },
  {
    goal: 189,
  },
  {
    goal: 349,
  },
];

import { DateTimeFormatOptions } from "intl";
export function DrawerDemo({ transaction, deleteTransaction }: any) {
  console.log("sjldfjsldfjlksdjfloi", transaction);
  const date = new Date(transaction.date);

  const options: DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = new Intl.DateTimeFormat("en-US", options).format(date);
  console.log("This is the formatted date", formattedDate);

  const deleteTransactionFromBackend = async (id: string) => {
    const response = await axios.delete(
      `/api/mongoDB/deleteTransaction?transactionId=${id}`
    );
    console.log("This is the response", response);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          className="flex bg-gray-300 border-none text-black font-normal "
        >
          Details
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="w-full max-w">
          <DrawerHeader>
            {/* <DrawerTitle className="text-center">Transaction</DrawerTitle> */}
            <DrawerDescription className="text-center">
              These are more details about your transaction
            </DrawerDescription>
            <div>
              <h3 className="text-sm text-muted-foreground">Date</h3>
              <h3 className="text-lg font-semibold tracking-tighter">
                {formattedDate}
              </h3>
            </div>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                // onClick={() => onClick(-10)}
              >
                <GearIcon className="h-4 w-4" />
              </Button>
              <div className="flex-1 text-center">
                <div className="text-7xl font-bold tracking-tighter">
                  {transaction.amount}
                </div>
                <div className="text-[0.70rem] uppercase text-muted-foreground">
                  Dollars
                </div>
              </div>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 shrink-0 rounded-full"
                onClick={() => [
                  deleteTransactionFromBackend(transaction.id),
                  deleteTransaction(transaction.id),
                ]}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
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
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
