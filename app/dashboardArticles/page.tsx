"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import NavbarAdmin from "@/components/navbarAdmin";
import { Articles, columns } from "@/components/admin/columns";
import { ArticlesTable } from "@/components/admin/articleTable";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import AddArticle from "@/components/admin/addArticle";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import EditArticle from "@/components/admin/editArticle";

type Category = {
  id: string;
  name: string;
};

export default function Dashboard() {
  const [data, setData] = useState<Articles[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalData, settotalData] = useState(0);
  const [tab, setTab] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editArticleId, setEditArticleId] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const categoryParam = category === "all" ? "" : category;
      const res = await api.get(
        `/articles?page=${page}&limit=${limit}&title=${search}&category=${categoryParam}&sortBy=createdAt&sortOrder=desc`,
      );
      setData(res.data.data);
      const total = res.data.total;
      settotalData(total);
      setTotalPages(Math.ceil(total / limit));
    } catch (error) {
      console.error("Failed to fetch articles", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories?limit=1000");
      setCategories(res.data.data);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search, category]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleTab = () => {
    setTab(1);
  };

  const confirmDelete = (id: string) => {
    setDeleteId(id);
    setShowConfirm(true);
  };

  const handleCloseDialog = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const handleDeleteArticle = async (id: string) => {
    const token = localStorage.getItem("token");

    try {
      await api.delete(`/articles/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast({ title: "Success", description: "Article deleted" });
      fetchData();
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete article",
        variant: "destructive",
      });
    }
    handleCloseDialog();
  };

  return (
    <div>
      <NavbarAdmin />
      {tab === 0 ? (
        <div className="p-5">
          <Card>
            <CardHeader className="p-4">
              <p className="text-black font-semibold text-sm">
                Total Articles : {totalData}
              </p>
            </CardHeader>
            <hr />
            <CardHeader className="p-4 space-y-2">
              <div className="flex gap-2 flex-wrap justify-between">
                <div className="flex gap-2 flex-wrap">
                  <Select
                    value={category}
                    onValueChange={(value) => {
                      setCategory(value);
                      setPage(1);
                    }}
                  >
                    <SelectTrigger className="sm:w-40 w-full">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories
                        .filter((cat) => cat.id)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Search title..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="sm:w-64 w-full"
                  />
                </div>

                <Button
                  onClick={handleTab}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Article
                </Button>
              </div>
            </CardHeader>
            <hr />
            <CardContent className="p-0">
              <ArticlesTable
                columns={columns}
                data={data}
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                onDelete={confirmDelete}
                onEdit={(article) => {
                  setEditArticleId(article.id);
                  setTab(2);
                }}
              />
              <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="mb-3">Confirm Delete</DialogTitle>
                    <DialogDescription>
                      Deleting this article is permanent and cannot be undone.
                      All related content will be removed.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button variant="outline" onClick={handleCloseDialog}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-red-600 hover:bg-red-700"
                      onClick={() => deleteId && handleDeleteArticle(deleteId)}
                    >
                      Delete
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </div>
      ) : (
        ""
      )}

      {tab === 1 ? (
        <div>
          <AddArticle
            categories={categories}
            onBack={() => setTab(0)}
            onSuccess={() => {
              setTab(0);
              fetchData();
            }}
          />
        </div>
      ) : (
        ""
      )}

      {tab === 2 && editArticleId && (
        <EditArticle
          id={editArticleId}
          categories={categories}
          onBack={() => setTab(0)}
          onSuccess={() => {
            setTab(0);
            fetchData();
          }}
        />
      )}
    </div>
  );
}
