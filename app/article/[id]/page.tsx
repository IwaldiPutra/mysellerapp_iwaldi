import api from "@/lib/api";
import { Article } from "@/app/types/article";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import ArticleGrid from "@/components/article/articleGrid";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";

interface Props {
  params: Promise<{ id: string }>;
}

interface ArticleListResponse {
  data: Article[];
  total: number;
  page: number;
  limit: number;
}

export default async function ArticleDetailPage({ params }: Props) {
  const { id } = await params;

  let article: Article | null = null;
  let otherArticles: Article[] = [];

  try {
    const res = await api.get<Article>(`/articles/${id}`);
    article = res.data;

    const otherRes = await api.get<ArticleListResponse>(`/articles`, {
      params: {
        page: 1,
        limit: 5,
      },
    });

    otherArticles = otherRes.data.data.filter((a) => a.id !== article!.id);
  } catch (error) {
    console.error("Failed to load article", error);
  }

  if (!article) {
    return <p>Article not found.</p>;
  }

  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4 space-y-6 mt-20">
        <div className="flex flex-col items-center justify-center">
          <div className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
            <span>{format(new Date(article.createdAt), "MMMM dd, yyyy")}</span>
            <span>-</span>
            <span>Created by: {article.user.username}</span>
          </div>

          <h1 className="text-4xl mt-3 text-center capitalize max-w-[600px] break-words">
            {article.title}
          </h1>
          <br />
          <Image
            width={500}
            height={300}
            src={article.imageUrl ?? "/noimage.png"}
            alt={article.title || "No image available"}
            className="w-full object-cover rounded-md mb-3 h-[300px] md:h-[400px] xl:h-[500px]"
          />
        </div>
        <ReactMarkdown>{article.content}</ReactMarkdown>
        <br />
        <br />
        {otherArticles.length > 0 && (
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4">Other Articles</h2>
            <ArticleGrid articles={otherArticles} />
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
