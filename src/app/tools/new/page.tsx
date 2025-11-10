"use client";

import React, { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";
import { addTool } from "@/query/toolQuery";

const initialState = {
  name: "",
  code: "",
  shelf: "",
  quantity: 0,
};

export default function NewEmployee() {
  const route = useRouter();
  const [tool, setTool] = useState(initialState);
  const queryClient = useQueryClient();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setTool((prev) => ({ ...prev, [name]: value }));
  }

  const addToolMutation = useMutation({
    mutationFn: addTool,
    onSuccess: () => {
      // ✅ Refresh movements list
      queryClient.invalidateQueries({ queryKey: ["tools"] });

      // ✅ Reset fields
      setTool(initialState);

      // ✅ Redirect
      route.push("/tools");
    },
    onError: (error) => {
      toast.error(error.message);
      console.error("Failed to add tool:", error);
    },
  });

  // 🔹 Handle form submission
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!tool.shelf.trim() || !tool.name.trim() || !tool.code) return;

    addToolMutation.mutate(tool);
  }

  return (
    <div
      className="min-h-screen  py-6 px-2"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      <Link href={"/tools"} className="underline text-green-600 ">
        &larr; Back
      </Link>
      <div
        className="w-full mx-auto  max-w-2xl rounded-2xl shadow-2xl p-3 space-y-4 transition-all duration-300 mt-3"
        style={{
          backgroundColor: "var(--surface)",
          border: `1px solid var(--border)`,
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wide">
          Create New Tool
        </h1>
        <p className="text-center text-sm opacity-70 mb-6">
          Please fill in the information below to add a new tool.
        </p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-lg font-medium">Name</label>
            <input
              onChange={handleChange}
              value={tool.name}
              required
              name="name"
              type="text"
              placeholder="Enter  name"
              className="w-full px-4 py-3 rounded-xl outline-none text-base focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: "var(--background)",
                border: `1px solid var(--border)`,
                color: "var(--text-primary)",
              }}
            />
          </div>
          {/* code */}
          <div className="space-y-2">
            <label className="block text-lg font-medium">Code</label>
            <input
              onChange={handleChange}
              value={tool.code}
              required
              name="code"
              type="text"
              placeholder="Enter code"
              className="w-full px-4 py-3 rounded-xl outline-none text-base focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: "var(--background)",
                border: `1px solid var(--border)`,
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* shelf */}
          <div className="space-y-2">
            <label className="block text-lg font-medium">Shelf</label>
            <input
              onChange={handleChange}
              value={tool.shelf}
              name="shelf"
              type="text"
              placeholder="Enter shelf"
              className="w-full px-4 py-3 rounded-xl outline-none text-base focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: "var(--background)",
                border: `1px solid var(--border)`,
                color: "var(--text-primary)",
              }}
            />
          </div>
          <div className="space-y-2">
            <label className="block text-lg font-medium">Quantity</label>
            <input
              onChange={handleChange}
              value={tool.quantity}
              name="quantity"
              type="number"
              placeholder="Enter quantity"
              className="w-full px-4 py-3 rounded-xl outline-none text-base focus:ring-2 focus:ring-blue-500"
              style={{
                backgroundColor: "var(--background)",
                border: `1px solid var(--border)`,
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              disabled={addToolMutation.isPending}
              type="submit"
              className="px-3 py-3 rounded-xl text-white font-semibold shadow hover:opacity-90 transition cursor-pointer disabled:cursor-not-allowed"
              style={{
                backgroundColor: `var(--button-create)`,
                border: `1px solid var(--border)`,
              }}
            >
              {addToolMutation.isPending ? "Submitting..." : "Submit"}
            </button>

            <button
              type="button"
              className="px-3 py-3 rounded-xl text-white font-semibold shadow hover:opacity-90 transition cursor-pointer"
              style={{
                backgroundColor: "var(--button-delete)",
                border: `1px solid var(--border)`,
              }}
            >
              Discard
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
