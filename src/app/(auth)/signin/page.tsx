"use client";

import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";

export default function SignInPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const signinMutation = useMutation({
    mutationFn: async (userData: typeof form) => {
      const res = await axios.post("/api/signin", userData);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Signed in successfully!");
      window.location.reload();
      // redirect after login
      router.push("/");
    },
    onError: (error) => {
      toast.error(error.message || "Invalid credentials!");
      console.error("Signin error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signinMutation.mutate(form);
  };

  return (
    <div className="min-h-[calc(100vh-100px)]  opacity-80 flex absolute bg-black/50 backdrop-blur-sm z-50 inset-0 ">
      {/* Left section - background image */}
      <div className="hidden lg:flex relative w-1/2 items-center justify-center overflow-hidden">
        <Image
          src="/images/auth-bg.jpg"
          alt="background"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        <div className="relative z-10 text-center px-10">
          <h2 className="text-4xl font-bold mb-4 text-white">
            Welcome to Tool Management
          </h2>
          <p className="text-gray-300 text-lg max-w-md mx-auto">
            Manage your tools, employees, and movements efficiently in one
            place.
          </p>
        </div>
      </div>

      {/* Right section - sign in form */}
      <div
        className="flex flex-col justify-center w-full lg:w-1/2 px-6 sm:px-12 md:px-20"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--text-primary)",
        }}
      >
        <div
          className="w-full max-w-md mx-auto bg-[var(--surface)] rounded-2xl shadow-lg p-4"
          style={{ color: "var(--text-primary)" }}
        >
          <h1 className="text-3xl font-semibold mb-6 text-center">
            Welcome Back 👋
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-3 bg-[var(--background)] rounded-lg px-4 py-3">
              <FaEnvelope className="text-[var(--accent)]" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="bg-transparent outline-none w-full"
                required
              />
            </div>

            <div className="flex items-center gap-3 bg-[var(--background)] rounded-lg px-4 py-3">
              <FaLock className="text-[var(--accent)]" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                className="bg-transparent outline-none w-full"
                required
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <Link href="/forgot-password" style={{ color: "var(--accent)" }}>
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={signinMutation.isPending}
              className=" w-full py-3 rounded-lg font-semibold transition hover:opacity-90 cursor-pointer flex gap-1 justify-center items-center"
              style={{
                backgroundColor: "var(--accent)",
                color: "#fff",
              }}
            >
              {signinMutation.isPending && (
                <FiLoader className="animate-spin" />
              )}
              Sign In
            </button>
          </form>

          <p
            className="mt-6 text-center text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold"
              style={{ color: "var(--accent)" }}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
