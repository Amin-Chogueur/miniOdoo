"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { FiLoader } from "react-icons/fi";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const token = new URLSearchParams(window.location.search).get("token");

      if (!token) {
        toast.error("An error occurred. Please try again.");
        return;
      }

      const res = await axios.post("/api/reset-password-confirm", {
        password,
        token,
      });

      if (res) {
        toast.success("Password updated successfully. You can now sign in.");
        router.push("/signin");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-100px)] opacity-80 flex absolute bg-black/50 backdrop-blur-sm z-50 inset-0">
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
            {" "}
            Welcome to Tool Management App
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
            Reset Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--background)] rounded-lg outline-none border border-transparent focus:border-[var(--accent)] transition"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition disabled:opacity-70"
              style={{
                backgroundColor: "var(--accent)",
                color: "#fff",
              }}
            >
              {loading && <FiLoader className="animate-spin" />}
              <span>Reset Password</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
