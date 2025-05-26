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
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onDelete?: (id: string, title: string) => void;
  onEdit?: (article: TData) => void; // <-- props onEdit untuk tombol edit
}

export function ArticlesTable<
  TData extends {
    title: string;
    id: string;
    content?: string;
    createdAt?: string;
    imageUrl?: string;
  },
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
  const router = useRouter();

  const actionColumn: ColumnDef<TData> = {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const handlePreview = () => {
        const previewData = {
          title: row.original.title,
          content: row.original.content || "",
          date: row.original.createdAt || "",
          imageUrl: row.original.imageUrl || "",
        };
        localStorage.setItem("preview", JSON.stringify(previewData));
        router.push("/dashboardPreview");
      };

      return onDelete && onEdit ? (
        <div className="flex gap-2 justify-center">
          <Button
            variant="link"
            size="sm"
            className="px-1 underline text-blue-800"
            onClick={handlePreview}
          >
            Preview
          </Button>
          <Button
            variant="link"
            size="sm"
            className="px-1 underline text-blue-800"
            onClick={() => onEdit(row.original)} // Kirim seluruh objek artikel ke handler edit
          >
            Edit
          </Button>
          <Button
            className="text-red-600 underline"
            variant="link"
            size="sm"
            onClick={() => onDelete(row.original.id, row.original.title)}
          >
            Delete
          </Button>
        </div>
      ) : null;
    },
    enableSorting: false,
    size: 100,
  };

  const table = useReactTable({
    data,
    columns: onDelete && onEdit ? [...columns, actionColumn] : columns,
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
                colSpan={columns.length + 1}
                className="text-center h-64"
              >
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

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
