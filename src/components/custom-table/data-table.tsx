"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as React from "react";
import { Settings2, Trash, Trash2 } from "lucide-react";
import { RowDropBox } from "../row-size/row-size";

import {
  ColumnDef,
  flexRender,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  deleteAllSelectedRows: (
    table: any
  ) => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  deleteAllSelectedRows,
}: DataTableProps<TData, TValue>) {
  let [currentPage, setCurrentPage] = React.useState(1);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [filtering, setFiltering] = React.useState("");
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Sets the number of rows to display
  const handleRowChange = (row: string) => {
    table.setPageSize(parseInt(row));
  };

  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onGlobalFilterChange: setFiltering,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter: filtering,
      columnVisibility,
      rowSelection,
    },
  });

  // const deleteAllSelectedRows = () => {
  //   const selectedRows = table.getFilteredSelectedRowModel().rows;
  //   const idsAndIndexesToDelete = selectedRows.map(row => ({
  //     id: (row.original as { id: string }).id,
  //     index: transactions.findIndex(t => t.id === (row.original as { id: string }).id)
  //   }));
  //   for (let i = 0; i < selectedRows.length; i++) {
  //     console.log("Deleting", (selectedRows[i].original as { id: string }).id);
  //     deleteTransaction((selectedRows[i].original as { id: string }).id);
  //   }
  //   table.resetRowSelection();
  // };
  // console.log("result", table.getFilteredSelectedRowModel().rows);
  return (
    <div>
      <div className="flex py-4 justify-between">
        <div className="flex">
          <Input
            placeholder="Filter transactions..."
            value={filtering}
            onChange={(event) => setFiltering(event.target.value)}
            className="w-72"
          />
        </div>

        <div className="flex">
          {table.getFilteredSelectedRowModel().rows.length > 0 && (
            <Button
              variant="outline"
              className="flex"
              onClick={() => {
                console.log("Delete");
                deleteAllSelectedRows(table);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-2">
                <div className="flex items-center">
                  <Settings2 className="h-4 w-4 mr-2" />
                  Transactions
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
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
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
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
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="flex items-center space-x-2 pr-12">
          <h3 className="text-sm text-gray-600">Rows per page</h3>
          <RowDropBox onRowChange={handleRowChange} />
        </div>
        <h3 className="pr-10">
          Page {currentPage} of {table.getPageCount()}
        </h3>
        <Button
          variant="outline"
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
  );
}
