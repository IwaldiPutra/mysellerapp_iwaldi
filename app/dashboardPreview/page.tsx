"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import { Article } from "@/app/types/article";
import Image from "next/image";
import ArticleGrid from "@/components/article/articleGrid";
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/protectedRoute";

interface ArticlePreviewData {
  title: string;
  content: string;
  date: string;
  imageUrl?: string;
  user: string;
}

interface PreviewAPI {
  data: Article[];
  total: number;
  page: number;
  limit: number;
}

interface UserData {
  username: string;
}

export default function PreviewPage() {
  const router = useRouter();
  const [article, setArticle] = useState<ArticlePreviewData | null>(null);
  const [otherArticles, setOtherArticles] = useState<Article[]>([]);
  const [profile, setProfile] = useState<UserData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("preview");
    if (!data) {
      router.back();
      return;
    }

    setArticle(JSON.parse(data));

    const fetchData = async () => {
      const token = localStorage.getItem("token");

      try {
        const [otherRes, profileRes] = await Promise.all([
          api.get<PreviewAPI>("/articles", {
            params: { page: 1, limit: 3, sort: "createdAt", order: "desc" },
          }),
          api.get(`/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }),
        ]);

        setOtherArticles(otherRes.data.data);
        setProfile(profileRes.data);
      } catch (error) {
        console.error("Failed to load data", error);
      }
    };

    fetchData();
  }, [router]);

  if (!article) return null;

  return (
    <ProtectedRoute allowedRoles={["Admin"]}>
      <div>
        <Navbar />
        <div className="container mx-auto p-4 space-y-6 mt-20">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <div className="flex flex-col items-center justify-center">
            <div className="flex flex-wrap items-center gap-1 text-sm text-gray-600">
              <span>{format(new Date(article.date), "dd MMM, yyyy")}</span>
              <span>-</span>
              <span>Created by: {profile?.username || "admin"}</span>
            </div>

            <h1 className="text-4xl mt-3 text-center capitalize max-w-[600px] break-words">
              {article.title}
            </h1>
            <br />
            <Image
              width={500}
              height={300}
              src={article.imageUrl || "/noimage.png"}
              alt={"Article image"}
              className="w-full object-cover rounded-md mb-3 h-[300px] md:h-[400px] xl:h-[500px]"
            />
          </div>

          <div
            className="prose max-w-none w-full"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
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
    </ProtectedRoute>
  );
}
