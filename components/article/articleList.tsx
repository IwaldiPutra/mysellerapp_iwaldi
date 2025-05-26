import { useEffect } from "react";
import Loading from "../loading";
import ArticleCount from "./articleCount";
import ArticleGrid from "./articleGrid";
import ArticlePagination from "./articlePagination";
import { Article } from "@/app/types/article";

interface Props {
  articles: Article[];
  loading: boolean;
  total: number;
  page: number;
  limit: number;
  onPageChange: (page: number) => void;
}

export default function ArticleList({
  articles,
  loading,
  total,
  page,
  limit,
  onPageChange,
}: Props) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page]);

  if (loading) {
    return <Loading message="Loading articles..." />;
  }

  if (articles.length === 0) {
    return (
      <div className="container mx-auto p-4 space-y-6 min-h-[300px]">
        <p className="text-center mt-3">{"No articles found :("}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <ArticleCount total={total} showing={articles.length} />
      <ArticleGrid articles={articles} />
      <hr />
      <ArticlePagination
        total={total}
        page={page}
        limit={limit}
        onPageChange={onPageChange}
      />
    </div>
  );
}
