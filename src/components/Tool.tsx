"use client";

import { deleteTool } from "@/query/toolQuery";
import { ToolType } from "@/types/ToolType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-toastify";

export default function ToolCard({ tool }: { tool: ToolType }) {
  const queryClient = useQueryClient();
  // ✅ Mutation to update
  const deleteToolMutation = useMutation({
    mutationFn: (id: string) => deleteTool(id),
    onSuccess: () => {
      toast.success("Tool deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete employee");
      console.error("Error deleting employee:", error);
    },
  });
  function handleDeleteTool() {
    const confirm = window.confirm(
      `Are you sure you want to delete this tool: ${tool.name}`
    );
    if (confirm) {
      deleteToolMutation.mutate(tool._id!);
    }
  }
  return (
    <div
      className="p-4 rounded-lg shadow-md  hover:shadow-xl"
      style={{
        backgroundColor: "var(--surface)",
        border: `1px solid var(--border)`,
      }}
    >
      <h2 className="text-xl font-semibold mb- capitalize">{tool.name}</h2>
      <p style={{ color: "var(--text-secondary)" }} className="mb-1">
        <strong>Reference:</strong> {tool.code}
      </p>
      <p style={{ color: "var(--text-secondary)" }} className="mb-1">
        <strong>Shelf:</strong> {tool.shelf}
      </p>
      <p style={{ color: "var(--text-secondary)" }} className="mb-1">
        <strong>Quantity:</strong> {tool.quantity}
      </p>
      <p style={{ color: "var(--text-secondary)" }} className="mb-1">
        <strong>Quantity Taken:</strong> {tool.quantityTaken}
      </p>
      <p style={{ color: "var(--text-secondary)" }} className="mb-1">
        <strong>Quantity Avalaible:</strong>{" "}
        {tool.quantity - (tool?.quantityTaken || 0)}
      </p>

      <div className="flex gap-2">
        <button
          onClick={handleDeleteTool}
          className="px-3 py-1 rounded text-white cursor-pointer"
          style={{
            backgroundColor: "var(--button-delete)",
            border: `1px solid var(--border)`,
          }}
        >
          Delete
        </button>
        <Link
          href={`/tools/edit/${tool?._id}`}
          className="px-3 py-1 rounded text-white cursor-pointer"
          style={{
            backgroundColor: "var(--button-create)",
            border: `1px solid var(--border)`,
          }}
        >
          Edit
        </Link>
      </div>
    </div>
  );
}
