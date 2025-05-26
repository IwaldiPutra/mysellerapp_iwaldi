"use client";

import { Input } from "../ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Category } from "@/app/types/article";

interface Props {
  categoryId: string;
  title: string;
  categories: Category[];
  onFilterChange: (key: string, value: string) => void;
}

export default function FilterForm({
  categoryId,
  title,
  categories,
  onFilterChange,
}: Props) {
  return (
    <div
      className="mx-auto flex bg-cover bg-center bg-no-repeat min-h-[500px]"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <div className="bg-blue-600/80 w-full flex flex-col justify-center items-center space-y-6 p-8">
        <div className="mb-4">
          <p className="text-white text-center mb-3">Blog genzet</p>
          <h1 className="text-white text-4xl font-bold max-w-[600px] break-words text-center">
            The Journal : Design Resources, Interviews, and Industry News
          </h1>
        </div>

        <div className="flex flex-col sm:flex-row max-w-xl w-full space-y-3 sm:space-y-0 sm:space-x-4 items-center bg-blue-500 p-2 rounded-lg m-auto">
          <Select
            value={categoryId}
            onValueChange={(value) => onFilterChange("categoryId", value)}
          >
            <SelectTrigger className="w-full md:max-w-[200px] rounded-lg bg-white">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories
                .filter((cat) => !!cat.id)
                .map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>

          <Input
            type="text"
            placeholder="Search articles"
            className="flex-grow bg-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => onFilterChange("title", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
