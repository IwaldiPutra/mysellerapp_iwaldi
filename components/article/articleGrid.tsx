"use client";

import { Article } from "@/app/types/article";
import { Card, CardContent } from "../ui/card";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ArticleGridProps {
  articles: Article[];
}

export default function ArticleGrid({ articles }: ArticleGridProps) {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 cursor-pointer">
      {articles.map((article) => {
        const categories = article.category ? [article.category] : [];
        return (
          <Card
            key={article.id}
            className="shadow-none border-none"
            onClick={() => router.push(`/article/${article.id}`)}
          >
            <CardContent className="p-0">
              <Image
                width={600}
                height={400}
                src={
                  article.imageUrl && article.imageUrl.trim() !== ""
                    ? article.imageUrl
                    : "/noimage.png"
                }
                alt={article.title || "No image available"}
                className="w-full object-cover rounded-md mb-3"
                style={{ aspectRatio: "6 / 4" }}
              />
              <p className="text-xs text-gray-500 mb-1">
                {format(new Date(article.createdAt), "dd MMM yyyy")}
              </p>

              <p
                className="font-bold overflow-hidden text-ellipsis mb-1 capitalize"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {article.title}
              </p>
              <div
                className="overflow-hidden text-ellipsis mb-3 text-sm"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}
              >
                <div className="w-full whitespace-pre-wrap">
                  {article.content.replace(/<[^>]+>/g, "")}
                </div>
              </div>
              <p className="text-sm text-blue-900 mb-2 bg-blue-100 p-1 px-4 rounded-full max-w-max capitalize">
                {categories
                  .slice(0, 2)
                  .map((cat) => cat.name)
                  .join(", ")}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
