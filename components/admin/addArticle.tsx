"use client";

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ArrowLeft, ImagePlus } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import Image from "next/image";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import TiptapEditor from "./textEditor";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { useRouter } from "next/navigation";

type Category = {
  id: string;
  name: string;
};

type Props = {
  onBack: () => void;
  onSuccess: () => void;
  categories: Category[];
};

const schema = z.object({
  title: z.string().min(10, "Please enter title at least 10 characters"),
  category: z.string().min(1, "Please select category"),
  content: z
    .string()
    .min(100, "Content field cannot be empty at least 100 characters"),
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "Please upload an image"),
});

type FormData = z.infer<typeof schema>;

export default function AddArticle({ onBack, categories, onSuccess }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      setValue("image", file, { shouldValidate: true });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  });

  const [categoriesd] = useState([
    { id: "1", name: "Technology" },
    { id: "2", name: "Health" },
    { id: "3", name: "Business" },
  ]);
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    const token = localStorage.getItem("token");

    try {
      const fileInput = document.querySelector(
        "input[type='file']",
      ) as HTMLInputElement;
      const file = fileInput?.files?.[0];
      if (!file) throw new Error("Image file is required");

      const uploadFormData = new FormData();
      uploadFormData.append("image", file);

      const uploadRes = await api.post("/upload", uploadFormData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      const imageUrl = uploadRes.data.imageUrl;

      await api.post(
        "/articles",
        {
          title: data.title,
          categoryId: data.category,
          content: data.content,
          imageUrl: imageUrl,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Success",
        description: "Article uploaded successfully!",
      });
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description:
          error?.response?.data?.message ||
          "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleEditorChange = (html: string) => {
    setValue("content", html, { shouldValidate: true });
  };

  const handlePreview = async () => {
    const isValid = await trigger();

    if (!isValid) return;

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
        <CardContent className="p-4">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-x-4 flex">
              <div>
                <p className="text-sm font-medium mb-1">Thumbnail</p>
                <div
                  {...getRootProps()}
                  className={`w-[200px] h-[200px] border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition
                    ${
                      errors.image
                        ? "border-red-500"
                        : "border-gray-300 hover:border-blue-400"
                    }`}
                >
                  <input {...getInputProps()} />
                  {isDragActive ? (
                    <p className="text-blue-500">Drop image here...</p>
                  ) : (
                    <div className="flex flex-col h-full items-center justify-center gap-2 text-gray-500">
                      <ImagePlus className="w-6 h-6" />
                      <p>Drag & drop or click to upload image</p>
                    </div>
                  )}
                </div>
                {errors.image && (
                  <p className="text-red-600 text-xs mt-1">
                    {errors.image.message}
                  </p>
                )}
              </div>
              {preview && (
                <div>
                  <p className="text-sm font-medium mb-1 opacity-50">Preview</p>
                  <Image
                    src={preview}
                    alt="Thumbnail Preview"
                    className="w-[200px] h-[200px] rounded border object-cover"
                    width={200}
                    height={200}
                  />
                </div>
              )}
            </div>

            <br />

            <div className="mb-4">
              <p className="text-sm">Title</p>
              <Input placeholder="Input Title" {...register("title")} />
              {errors.title && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="mb-7">
              <p className="text-sm mb-1">Category</p>
              <Controller
                name="category"
                control={control}
                defaultValue=""
                render={({ field }) => (
                  <Select
                    {...field}
                    onValueChange={(value) => field.onChange(value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories
                        .filter((cat) => cat.id)
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
                <p className="text-red-600 text-xs mt-1">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <Card className="editor">
                <TiptapEditor content="" onChange={handleEditorChange} />
              </Card>
              {errors.content && (
                <p className="text-red-600 text-xs mt-1">
                  {errors.content.message}
                </p>
              )}
            </div>

            <br />

            <div className="flex gap-3 justify-end">
              <Button variant={"outline"} type="button" onClick={onBack}>
                Cancel
              </Button>
              <Button
                className="bg-blue-200 text-black hover:bg-blue-300"
                variant={"default"}
                type="button"
                onClick={handlePreview}
              >
                Preview
              </Button>
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                variant={"default"}
                type="submit"
              >
                Upload
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
