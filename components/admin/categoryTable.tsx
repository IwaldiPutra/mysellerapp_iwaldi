"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete?: (id: string, name?: string) => void;
  onEdit?: (row: TData) => void;
}

export function CategoryTable<
  TData extends { id: string; name?: string },
  TValue,
>({
  columns,
  data,
  page,
  totalPages,
  onPageChange,
  onDelete,
  onEdit,
}: DataTableProps<TData, TValue>) {
  const actionColumn: ColumnDef<TData> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return onDelete && onEdit ? (
        <div className="flex gap-2 justify-center">
          <Button
            variant="link"
            size="sm"
            className="px-1 underline text-blue-800"
            onClick={() => onEdit(row.original)}
          >
            Edit
          </Button>
          <Button
            className="text-red-600 underline"
            variant="link"
            size="sm"
            onClick={() => onDelete(row.original.id, row.original.name)}
          >
            Delete
          </Button>
        </div>
      ) : null;
    },
    enableSorting: false,
    size: 100,
  };

  const allColumns = onDelete && onEdit ? [...columns, actionColumn] : columns;

  const table = useReactTable({
    data,
    columns: allColumns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className="overflow-x-auto w-full">
      <Table className="min-w-[700px]">
        <TableHeader className="bg-gray-100/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead className="text-center" key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {data.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell className="text-center" key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={allColumns.length}
                className="text-center h-64"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <br />
      <hr />
      <div className="flex items-center justify-center space-x-2 p-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(page - 1, 1))}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(page + 1, totalPages))}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
