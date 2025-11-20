"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { ToolType } from "@/types/ToolType";
import { getTool, updateTool } from "@/query/toolQuery";

const initialState = {
  name: "",
  code: "",
  shelf: "",
  quantity: 0,
};

export default function EditTool({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = React.use(params);
  const route = useRouter();
  const queryClient = useQueryClient();
  const [tool, setTool] = useState<ToolType>(initialState);

  // ✅ Fetch existing employee
  const {
    data: existingTool,
    isLoading,
    error,
  } = useQuery<ToolType>({
    queryKey: ["tool", id],
    queryFn: () => getTool(id),
    staleTime: 60000,
  });

  // ✅ Fill the form once the data is loaded
  useEffect(() => {
    if (existingTool) {
      setTool(existingTool);
    }
  }, [existingTool]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setTool((prev) => ({ ...prev, [name]: value }));
  }

  // ✅ Mutation to update
  const updateToolMutation = useMutation({
    mutationFn: (updatedTool: ToolType) => updateTool({ id, updatedTool }),
    onSuccess: (data) => {
      toast.success(data.message || "tool updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      route.push("/tools");
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to update tool");
      console.error("Error updating tool:", error);
    },
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!tool.shelf.trim() || !tool.name.trim() || !tool.code) return;

    updateToolMutation.mutate(tool);
  }

  if (isLoading) return <LoadingSpinner />;
  if (error)
    return <p className="text-center text-red-500">Error loading employee.</p>;

  return (
    <div
      className="min-h-screen  py-6 px-2"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      <div
        className="w-full mx-auto  max-w-2xl rounded-2xl shadow-2xl p-3 space-y-4 transition-all duration-300 mt-3"
        style={{
          backgroundColor: "var(--surface)",
          border: `1px solid var(--border)`,
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-2 tracking-wide">
          Edit Tool
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="space-y-2">
            <label className="block text-lg font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              onChange={handleChange}
              value={tool.name ?? ""}
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
            <label className="block text-lg font-medium">
              Code <span className="text-red-500">*</span>
            </label>
            <input
              onChange={handleChange}
              value={tool.code ?? ""}
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
            <label className="block text-lg font-medium">
              Shelf <span className="text-red-500">*</span>
            </label>
            <input
              onChange={handleChange}
              value={tool.shelf ?? ""}
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
            <label className="block text-lg font-medium">
              Quantity <span className="text-red-500">*</span>
            </label>
            <input
              onChange={handleChange}
              value={tool.quantity ?? 0}
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
            <Link
              href={"/tools"}
              className="px-3 py-1 rounded text-white font-semibold shadow hover:opacity-90 transition cursor-pointer"
              style={{
                backgroundColor: "var(--button-delete)",
                border: `1px solid var(--border)`,
              }}
            >
              Discard
            </Link>
            <button
              disabled={updateToolMutation.isPending}
              type="submit"
              className="px-3 py-1 rounded text-white font-semibold shadow hover:opacity-90 transition cursor-pointer disabled:cursor-not-allowed"
              style={{
                backgroundColor: `var(--button-create)`,
                border: `1px solid var(--border)`,
              }}
            >
              {updateToolMutation.isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
