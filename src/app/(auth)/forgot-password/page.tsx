"use client";

import axios from "axios";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { FiLoader } from "react-icons/fi";

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      setLoading(true);
      const res = await axios.post("/api/reset-password", { email });
      if (res) {
        setMessage("A password reset link has been sent to your email.");
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong.");
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
          <h2 className="text-4xl font-bold mb-4 text-white">Welcome to MOA</h2>
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
            Forgot Password
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-secondary)" }}
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[var(--background)] rounded-lg outline-none border border-transparent focus:border-[var(--accent)] transition"
                style={{ color: "var(--text-primary)" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-semibold flex justify-center items-center gap-2 transition disabled:opacity-70"
              style={{
                backgroundColor: "var(--accent)",
                color: "#fff",
              }}
            >
              {loading && <FiLoader className="animate-spin" />}
              <span>Send Reset Link</span>
            </button>
          </form>
          <p
            className="mt-6 text-center text-sm"
            style={{ color: "var(--text-secondary)" }}
          >
            Remember your password?{" "}
            <Link
              href="/signin"
              className="font-semibold"
              style={{ color: "var(--accent)" }}
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
