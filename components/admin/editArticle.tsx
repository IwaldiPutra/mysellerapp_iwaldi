import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/lib/api";
import Image from "next/image";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import TiptapEditor from "./textEditor";
import { useToast } from "@/hooks/use-toast";
import { Card, CardHeader } from "../ui/card";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

type Category = { id: string; name: string };

type Props = {
  id: string;
  categories: Category[];
  onBack: () => void;
  onSuccess: () => void;
};

const schema = z.object({
  title: z.string().min(10),
  category: z.string().min(1),
  content: z.string().min(100),
  image: z.instanceof(File).optional(),
});

type FormData = z.infer<typeof schema>;

export default function EditArticle({
  id,
  categories,
  onBack,
  onSuccess,
}: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialContent, setInitialContent] = useState("");
  const { toast } = useToast();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    async function fetchArticle() {
      setLoading(true);
      try {
        const res = await api.get(`/articles/${id}`);
        const article = res.data;

        setValue("title", article.title);
        setValue("category", article.categoryId);
        setValue("content", article.content);
        setPreview(article.imageUrl);
        setInitialContent(article.content);
      } catch (err) {
        toast({
          title: "Error",
          description: "Failed to load article data" + err,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [id, setValue, toast]);

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setValue("image", file, { shouldValidate: true });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem("token");
    try {
      let imageUrl = preview || "";

      if (data.image && data.image instanceof File) {
        const formData = new FormData();
        formData.append("image", data.image);
        const uploadRes = await api.post("/upload", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        imageUrl = uploadRes.data.imageUrl;
      }

      await api.put(
        `/articles/${id}`,
        {
          title: data.title,
          categoryId: data.category,
          content: data.content,
          imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({ title: "Success", description: "Article updated" });
      onSuccess();
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Something went wrong" + error,
        variant: "destructive",
      });
    }
  };

  const handlePreview = () => {
    if (typeof window === "undefined") return;

    const values = getValues();

    const previewData = {
      title: values.title || "",
      content: values.content || "",
      date: new Date().toISOString(),
      imageUrl: preview || "",
    };

    localStorage.setItem("preview", JSON.stringify(previewData));
    router.push("/dashboardPreview");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="p-5">
      <Card>
        <CardHeader className="p-4 py-2 border-b">
          <Button
            variant="link"
            onClick={onBack}
            className="p-0 text-sm me-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Create Articles
          </Button>
        </CardHeader>
        <form className="p-5" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="flex gap-4">
            <div>
              <p className="text-sm mb-1">Thumbnail</p>
              <div
                {...getRootProps()}
                className={`w-[200px] h-[200px] border-2 border-dashed rounded-md p-6 text-center cursor-pointer ${
                  errors.image
                    ? "border-red-500"
                    : "border-gray-300 hover:border-blue-400"
                }`}
              >
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p>Drop image here...</p>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2 text-gray-500 h-full">
                    <p>Drag & drop or click to upload image</p>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-red-600 text-xs">{errors.image.message}</p>
              )}
            </div>
            {preview && (
              <div>
                <p className="text-sm mb-1">Preview</p>
                <Image
                  src={preview}
                  alt="Thumbnail Preview"
                  width={200}
                  height={200}
                  className="rounded border object-cover h-[200px] w-[200px]"
                />
              </div>
            )}
          </div>

          <br />

          <div>
            <p className="text-sm mb-1">Title</p>
            <Input {...register("title")} />
            {errors.title && (
              <p className="text-red-600 text-xs">{errors.title.message}</p>
            )}
          </div>

          <br />

          <div>
            <p className="text-sm mb-1">Category</p>
            <Controller
              name="category"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories
                      .filter((cat) => cat.id && cat.id !== "")
                      .map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.category && (
              <p className="text-red-600 text-xs">{errors.category.message}</p>
            )}
          </div>

          <br />

          <Card className="editor">
            <TiptapEditor
              content={initialContent}
              onChange={(html) =>
                setValue("content", html, { shouldValidate: true })
              }
            />
          </Card>
          {errors.content && (
            <p className="text-red-600 text-xs">{errors.content.message}</p>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" type="button" onClick={onBack}>
              Cancel
            </Button>
            <Button
              className="bg-blue-200 text-black hover:bg-blue-300"
              variant="default"
              type="button"
              onClick={handlePreview}
            >
              Preview
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Update
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
