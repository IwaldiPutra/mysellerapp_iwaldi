"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import api from "@/lib/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  username: z.string().min(4, { message: "Username minimal 4 karakter" }),
  password: z.string().min(8, { message: "Password minimal 8 karakter" }),
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
  });
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: LoginFormInputs) => {
    try {
      const res = await api.post("/auth/login", {
        username: data.username,
        password: data.password,
      });

      const { token, role } = res.data;
      toast({ title: "Login berhasil!", variant: "default" });
      localStorage.setItem("token", token);

      if (role === "Admin") {
        router.push("/dashboardArticles");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast({
        title: "Username atau password salah!" + error,
        variant: "destructive",
      });
    }
  };

  const [showPassword, setShowPassword] = useState(false);
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
            <Label htmlFor="email">Username</Label>
            {errors.username && (
              <p className="text-red-600 text-xs text-end">
                {errors.username.message}
              </p>
            )}
          </div>

          <Input
            id="username"
            type="username"
            placeholder="johndoa123"
            {...register("username")}
          />
        </div>

        <div className="mb-8">
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

        <Button
          variant="default"
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isSubmitting ? "Loading..." : "Login"}
        </Button>

        <div className="flex items-center gap-1 justify-center mt-5">
          <span>Don’t have an account? </span>
          <span
            onClick={() => router.push("/register")}
            className="underline text-blue-800 font-semibold cursor-pointer"
          >
            Register
          </span>
        </div>
      </form>
    </div>
  );
}
