"use client";
import { useState } from "react";
import { useThemeToggle } from "@/hooks/useThemeToggle";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import LogoutButton from "./LogoutButton";
import { useAuth } from "@/hooks/useAuth";

export default function NavBar() {
  const { user, isLoading: IsLoadingUserRole } = useAuth();
  const { isDark, toggleTheme } = useThemeToggle();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { link: "/", lable: "Dashboard" },
    { link: "/employees", lable: "Employees" },
    { link: "/tools", lable: "Tools" },
    { link: "/movements", lable: "Movements" },
  ];

  return (
    <header
      className="fixed top-0 z-50 w-full flex items-center justify-between px-6 py-3 shadow-md transition-colors"
      style={{
        backgroundColor: "var(--header-bg)",
        color: "var(--text-primary)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-lg"
          style={{ backgroundColor: "var(--accent)", color: "#fff" }}
        >
          MOA
        </div>
        {user ? (
          <p className="text-xs text-center">
            Hi Mr {user?.username} <br />
            <span className="text-gray-400">
              {" "}
              ({user?.role} / {user?.position})
            </span>
          </p>
        ) : null}
      </div>

      {/* Desktop Nav */}
      <nav className="hidden md:flex gap-6">
        {navLinks.map((link, index) => {
          const isActive = pathname === link.link;
          return (
            <Link
              key={index}
              href={link.link}
              className={`transition-colors ${
                isActive
                  ? "text-green-500 font-semibold"
                  : "hover:text-[var(--accent)]"
              }`}
            >
              {link.lable}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 rounded-md border border-[var(--border)]"
        style={{ backgroundColor: "var(--background)", color: "#fff" }}
      >
        {menuOpen ? (
          <X size={22} color="var(--text-primary)" />
        ) : (
          <Menu size={22} color="var(--text-primary)" />
        )}
      </button>

      {/* Theme Toggle (Desktop only) */}
      <div className="hidden md:flex items-center gap-3">
        <LogoutButton onCloseMenu={() => setMenuOpen(false)} />
        <button
          onClick={toggleTheme}
          className="p-1 cursor-pointer transition rounded-full"
          style={{
            backgroundColor: "var(--background)",
            color: "#fff",
            border: "1px solid var(--border)",
          }}
        >
          {isDark ? "🌙" : "🌞"}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div
          className="absolute top-full left-0 w-full flex flex-col items-center gap-4 py-4 md:hidden"
          style={{
            backgroundColor: "var(--header-bg)",
            color: "var(--text-primary)",
            borderTop: "1px solid var(--border)",
          }}
        >
          {navLinks.map((link, index) => {
            const isActive = pathname === link.link;
            return (
              <Link
                key={index}
                href={link.link}
                onClick={() => setMenuOpen(false)}
                className={`text-lg transition ${
                  isActive
                    ? "text-green-500 font-semibold"
                    : "hover:text-[var(--accent)]"
                }`}
              >
                {link.lable}
              </Link>
            );
          })}

          {/* Theme toggle inside mobile menu */}
          <div className="  flex flex-col items-center gap-3">
            <LogoutButton onCloseMenu={() => setMenuOpen(false)} />
            <button
              onClick={toggleTheme}
              className="p-1 cursor-pointer transition rounded-full"
              style={{
                backgroundColor: "var(--background)",
                color: "#fff",
                border: "1px solid var(--border)",
              }}
            >
              {isDark ? "🌙" : "🌞"}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
