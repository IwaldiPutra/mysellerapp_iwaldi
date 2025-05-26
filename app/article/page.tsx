import api from "@/lib/api";

import { Article } from "@/app/types/article";
import { Category } from "@/app/types/article";
import Articles from "@/components/article/article";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

export default async function ArticlesPage() {
  let initialArticles: Article[] = [];
  let initialCategories: Category[] = [];

  try {
    const articlesRes = await api.get<{ data: Article[] }>("/articles", {
      params: { page: 1, limit: 10 },
    });
    initialArticles = articlesRes.data.data;

    const categoriesRes = await api.get<{ data: Category[] }>("/categories");
    initialCategories = categoriesRes.data.data;
  } catch (err) {
    console.error("Failed to fetch data:", err);
  }

  return (
    <div>
      <Navbar />
      <br />
      <Articles
        initialArticles={initialArticles}
        initialCategories={initialCategories}
      />
      <Footer />
    </div>
  );
}
