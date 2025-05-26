"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { format } from "date-fns";

export type Articles = {
  id: string;
  imageUrl: string;
  title: string;
  category: {
    name: string;
  };
  createdAt: string;
};

export const columns: ColumnDef<Articles>[] = [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      const url = row.original.imageUrl;
      return (
        <div className="w-[120px] mx-auto">
          <Image
            src={url}
            alt="thumbnail"
            className="w-12 h-12 object-cover rounded mx-auto"
            width={100}
            height={100}
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => (
      <div
        className="text-start capitalize w-[250px]  mx-auto"
        title={row.original.title}
      >
        {row.original.title}
      </div>
    ),
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="w-[120px]  mx-auto">
        {row.original.category?.name ?? "-"}
      </div>
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
