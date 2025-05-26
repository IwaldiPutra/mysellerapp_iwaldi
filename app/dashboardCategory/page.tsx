"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import NavbarAdmin from "@/components/navbarAdmin";
import { Category, columnsCat } from "@/components/admin/columnsCategory";
import { CategoryTable } from "@/components/admin/categoryTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";

export default function CategoryDashboard() {
  const [data, setData] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [totalData, setTotalData] = useState(0);
  const [newCategory, setNewCategory] = useState("");
  const [editCategoryName, setEditCategoryName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editArticleId, setEditArticleId] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      const res = await api.get(`/categories?page=${page}&limit=${limit}`);
      const allData = res.data.data;

      const filtered = allData.filter((item: Category) =>
        item.name.toLowerCase().includes(search.toLowerCase()),
      );

      setData(filtered);
      setTotalData(res.data.totalData);
      setTotalPages(Math.ceil(res.data.totalData / limit));
    } catch (error) {
      console.error("Failed to fetch categories", error);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    const token = localStorage.getItem("token");
    setIsSubmitting(true);
    try {
      await api.post(
        "/categories",
        { name: newCategory },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast({ title: "Success", description: "Category added successfully" });
      setNewCategory("");
      setDialogOpen(false);
      fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditCategory = async () => {
    if (!editCategoryName.trim() || !editArticleId) return;
    const token = localStorage.getItem("token");
    setIsSubmitting(true);
    try {
      await api.put(
        `/categories/${editArticleId}`,
        { name: editCategoryName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      toast({ title: "Success", description: "Category updated successfully" });
      setEditCategoryName("");
      setEditArticleId(null);
      setEditDialogOpen(false);
      fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update category",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmDelete = async (id: string, name?: string) => {
    if (!window.confirm(`Are you sure you want to delete category "${name}"?`))
      return;

    const token = localStorage.getItem("token");
    try {
      await api.delete(`/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast({ title: "Deleted", description: `Category "${name}" deleted` });
      fetchCategories();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const handleOpenEditDialog = (category: Category) => {
    setEditArticleId(category.id);
    setEditCategoryName(category.name);
    setEditDialogOpen(true);
  };

  useEffect(() => {
    fetchCategories();
  }, [page, search]);

  return (
    <div>
      <NavbarAdmin />
      <div className="p-5">
        <Card>
          <CardHeader className="p-4">
            <p className="text-black font-semibold text-sm">
              Total Categories : {totalData}
            </p>
          </CardHeader>
          <hr />
          <CardHeader className="p-4 space-y-2">
            <div className="flex gap-2 flex-wrap justify-between">
              <Input
                placeholder="Search name..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="sm:w-64 w-full"
              />

              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Category
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Category</DialogTitle>
                  </DialogHeader>
                  <div className="py-4">
                    <Input
                      placeholder="Category name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                    />
                  </div>
                  <DialogFooter>
                    <Button
                      onClick={handleAddCategory}
                      disabled={isSubmitting}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {isSubmitting ? "Adding..." : "Add"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <hr />
          <CardContent className="p-0">
            <CategoryTable
              columns={columnsCat}
              data={data}
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onDelete={confirmDelete}
              onEdit={handleOpenEditDialog} // Pasang handler edit di sini
            />
          </CardContent>
        </Card>
      </div>

      {/* Dialog Edit Category */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Category name"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              onClick={handleEditCategory}
              disabled={isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
