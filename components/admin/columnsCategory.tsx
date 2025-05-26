"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export type Category = {
  id: string;
  name: string;
  createdAt: string;
};

export const columnsCat: ColumnDef<Category>[] = [
  {
    accessorKey: "category",
    header: "Name",
    cell: ({ row }) => (
      <div className="w-[120px]  mx-auto">{row.original.name ?? "-"}</div>
    ),
  },

  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      const date = new Date(row.original.createdAt);
      return (
        <div className="whitespace-nowrap w-[120px]  mx-auto">
          {format(date, "dd MMM yyyy")}
        </div>
      );
    },
  },
];
