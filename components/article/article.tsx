"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Article, Category } from "@/app/types/article";
import FilterForm from "./filterFrom";
import ArticleList from "./articleList";

interface Props {
  initialArticles: Article[];
  initialCategories: Category[];
}

export default function Articles({
  initialArticles,
  initialCategories,
}: Props) {
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [categories] = useState<Category[]>(initialCategories);
  const [filter, setFilter] = useState({
    categoryId: "all",
    title: "",
    page: 1,
    limit: 10,
  });
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const handleFilterChange = (key: string, value: string) => {
    setFilter({ ...filter, [key]: value, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilter((prev) => ({ ...prev, page }));
  };

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true);

      await new Promise((res) => setTimeout(res, 1000));

      try {
        const params: any = {
          page: filter.page,
          limit: filter.limit,
          sortBy: "createdAt",
          sortOrder: "desc",
        };
        if (filter.title) params.title = filter.title;
        if (filter.categoryId !== "all") params.category = filter.categoryId;

        const res = await api.get<{ data: Article[]; total: number }>(
          "/articles",
          {
            params,
          },
        );
        setArticles(res.data.data);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Failed to fetch articles:", err);
        setArticles([]);
        setTotal(0);
      } finally {
        setLoading(false);
      }
    }

    fetchArticles();
  }, [filter]);

  return (
    <main>
      <FilterForm
        categoryId={filter.categoryId}
        title={filter.title}
        categories={categories}
        onFilterChange={handleFilterChange}
      />
      <ArticleList
        articles={articles}
        loading={loading}
        total={total}
        page={filter.page}
        limit={filter.limit}
        onPageChange={handlePageChange}
      />
    </main>
  );
}
