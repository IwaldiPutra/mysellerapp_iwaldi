"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "@/lib/api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const registerSchema = z.object({
  username: z.string().min(4, { message: "Username minimal 4 karakter" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
  role: z.enum(["admin", "user"], {
    required_error: "Role harus dipilih",
  }),
});

type RegisterFormInputs = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormInputs>({
    resolver: zodResolver(registerSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const onSubmit = async (data: RegisterFormInputs) => {
    try {
      const res = await api.post("/auth/register", {
        username: data.username,
        password: data.password,
        role: data.role.charAt(0).toUpperCase() + data.role.slice(1), // kapitalisasi awal
      });
      toast({ title: "Registrasi berhasil!", variant: "default" });
      router.push("/login");
    } catch (error: any) {
      const message =
        error.response?.data?.error || "Terjadi kesalahan saat registrasi";
      toast({ title: `Gagal registrasi: ${message}`, variant: "destructive" });
    }
  };

  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-md shadow-md w-full max-w-md"
      >
        <Image
          src={"/logo-color.svg"}
          alt="logo-color"
          width={150}
          height={150}
          className="m-auto"
        />
        <br />

        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="username">Username</Label>
            {errors.username && (
              <p className="text-red-600 text-xs text-end">
                {errors.username.message}
              </p>
            )}
          </div>
          <Input
            id="username"
            type="username"
            placeholder="johndoe123"
            {...register("username")}
          />
        </div>

        <div className="mb-5">
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="password">Password</Label>
            {errors.password && (
              <p className="text-red-600 text-xs text-end">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              {...register("password")}
            />
            <div
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-1">
            <Label htmlFor="role">Role</Label>
            {errors.role && (
              <p className="text-red-600 text-xs text-end">
                {errors.role.message}
              </p>
            )}
          </div>
          <Select onValueChange={(value) => setValue("role", value as any)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="user">User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Loading..." : "Register"}
        </Button>

        <div className="flex items-center gap-1 justify-center mt-5">
          <span>Already have an account?</span>
          <span
            onClick={() => router.push("/login")}
            className="underline text-blue-800 font-semibold cursor-pointer"
          >
            Login
          </span>
        </div>
      </form>
    </div>
  );
}
