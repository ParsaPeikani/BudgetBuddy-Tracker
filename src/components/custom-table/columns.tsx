"use client";

import { ColumnDef } from "@tanstack/react-table";
import { TransactionDrawer } from "@/components/TransactionDrawer/transactionDrawer";
import { Edit } from "@/components/edit/edit";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useCIBCTransactions } from "@/components/serverFunctions/apiCalls";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// This type is used to define the shape of our column data.
export type Payment = {
  id: string;
  date: string;
  transaction: string;
  amount: number;
  category: string;
  verified: boolean;
};

export const GetColumns = (
  // deleteTransaction: (id: string) => void,
  updateTransaction: (transaction: Payment) => void
): ColumnDef<Payment>[] => {
  const { DeleteCIBCTransaction } = useCIBCTransactions();
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        // const date = new Date(row.getValue("date"));
        return <div className="pl-4">{row.getValue("date")}</div>;
      },
    },
    {
      accessorKey: "transaction",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Transaction
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      enableColumnFilter: true,
      cell: ({ row }) => {
        const transaction = row.original;
        return (
          <div className="pl-4">
            <TransactionDrawer
              transaction={transaction}
              deleteTransaction={DeleteCIBCTransaction}
              title={row.getValue("transaction")}
            />
          </div>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <div className="-ml-4">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Amount
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },

    {
      accessorKey: "category",
      header: ({ column }) => {
        return (
          <div className="-ml-4">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Category
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      cell: ({ row }) => {
        return <div className="">{row.getValue("category")}</div>;
      },
    },
    {
      accessorKey: "verified",
      header: ({ column }) => {
        return (
          <div className=" justify-around -ml-4">
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === "asc")
              }
            >
              Verified
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          </div>
        );
      },
      // Display the boolean value of the verified property as verfiied or unverified
      cell: ({ row }) => {
        return <div className="">{row.getValue("verified")}</div>;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original;

        return (
          <div className="flex justify-end">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-4 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="text-center">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                </div>
                <div className="flex">
                  <Edit
                    transaction={transaction}
                    updateTransaction={updateTransaction}
                  />
                  <TransactionDrawer
                    transaction={transaction}
                    deleteTransaction={DeleteCIBCTransaction}
                    title="Details"
                  />
                  <DropdownMenuItem
                    onClick={() => [DeleteCIBCTransaction(transaction.id)]}
                  >
                    Delete
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};
