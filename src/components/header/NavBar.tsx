"use client";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import Link from "next/link";

export default function NavBar() {
  const { isDark, toggleTheme } = useThemeToggle();

  const navLinks = [
    { link: "/", lable: "Dashboard" },
    { link: "/employees", lable: "Employees" },
    { link: "/tools", lable: "Tools" },
    { link: "/movements", lable: "Movements" },
  ];

  return (
    <header
      className="top-0 z-50 fixed w-full flex items-center justify-between px-6 py-3 shadow-md transition-colors"
      style={{
        backgroundColor: "var(--header-bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* Logo / App Name */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
          style={{ backgroundColor: "var(--accent)", color: "#fff" }}
        >
          OA
        </div>
        <span className="text-xl font-semibold">OdooApp</span>
      </div>

      {/* Navigation Links */}
      <nav className="hidden md:flex gap-6">
        {navLinks.map((link, index) => (
          <Link key={index} href={link.link} className="transition-colors ">
            {link.lable}
          </Link>
        ))}
      </nav>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className="p-1 cursor-pointer transition rounded-full"
        style={{
          backgroundColor: "var(--background)",
          color: "#fff",
          border: "1px solid var(--border)",
        }}
      >
        {isDark ? "🌙" : "🌞 "}
      </button>
    </header>
  );
}
