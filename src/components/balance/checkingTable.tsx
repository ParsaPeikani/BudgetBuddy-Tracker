"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { TDRowDropBox } from "../row-size/row-size";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContentTD,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Checking = {
  id: string;
  date: string;
  name: string;
  amount: number;
  status: "Pending" | "Verified";
};

export const columns: ColumnDef<Checking>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          className="-ml-4"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-white">{row.getValue("date")}</div>
    ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          className="-ml-4"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase text-white">{row.getValue("name")}</div>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          className="-ml-4"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium text-white">{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          className="-ml-4"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize text-white">{row.getValue("status")}</div>
    ),
  },
];

export function CheckingTable({ data }: { data: Checking[] }) {
  let [currentPage, setCurrentPage] = React.useState(1);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  // Sets the number of rows to display
  const handleRowChange = (row: string) => {
    table.setPageSize(parseInt(row));
  };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setFiltering,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter: filtering,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-ful">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter TD transactions..."
          value={filtering}
          onChange={(event) => setFiltering(event.target.value)}
          className="max-w-sm text-white bg-gray-950"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="ml-auto text-white bg-gray-950"
            >
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContentTD align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContentTD>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table className="bg-gray-900">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-white"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2 pr-12">
          <h3 className="text-sm text-gray-600">Rows per page</h3>
          <div className="text-white ">
            <TDRowDropBox onRowChange={handleRowChange} />
          </div>
        </div>
        <h3 className="pr-10 text-white">
          Page {currentPage} of {table.getPageCount()}
        </h3>
        <div className="space-x-2 text-white">
          <Button
            variant="outline"
            className="bg-gray-950"
            size="sm"
            onClick={() => {
              setCurrentPage(1);
              table.setPageIndex(0);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            First
          </Button>
          <Button
            variant="outline"
            className="bg-gray-950"
            size="sm"
            onClick={() => {
              table.previousPage();
              setCurrentPage(currentPage - 1);
            }}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            className="bg-gray-950"
            size="sm"
            onClick={() => {
              table.nextPage();
              setCurrentPage(currentPage + 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
          <Button
            variant="outline"
            className="bg-gray-950"
            size="sm"
            onClick={() => {
              setCurrentPage(table.getPageCount());
              table.setPageIndex(table.getPageCount() - 1);
            }}
            disabled={!table.getCanNextPage()}
          >
            Last
          </Button>
        </div>
      </div>
    </div>
  );
}
