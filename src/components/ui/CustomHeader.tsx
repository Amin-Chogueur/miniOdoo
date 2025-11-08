"use client";
import Link from "next/link";
import React, { Dispatch, SetStateAction } from "react";

type CustomHeaderProps = {
  title: string;
  path: string;
  placeholder: string;
  search: string;
  setSearch: Dispatch<SetStateAction<string>>;
};

export default function CustomHeader({
  title,
  path,
  placeholder,
  search,
  setSearch,
}: CustomHeaderProps) {
  return (
    <header
      className="mb-6 rounded fixed left-3 right-3 top-14 pt-6"
      style={{ backgroundColor: "var(--background)" }}
    >
      <h1 className="text-xl md:text-3xl font-bold text-center mb-5">
        {title}
      </h1>
      <div
        className="flex justify-between items-center gap-5 p-3"
        style={{ backgroundColor: "var(--header-bg)" }}
      >
        <input
          onChange={(e) => setSearch(e.target.value)}
          type="text"
          value={search}
          placeholder={placeholder}
          className="p-2 rounded-lg border transition-colors outline-none"
          style={{
            backgroundColor: "var(--surface)",
            color: "var(--text-primary)",
            border: `1px solid var(--border)`,
          }}
        />
        <Link
          href={path}
          className="px-3 py-1 rounded text-white cursor-pointer"
          style={{
            backgroundColor: "var(--button-create)",
            border: `1px solid var(--border)`,
          }}
        >
          Create
        </Link>
      </div>
    </header>
  );
}
