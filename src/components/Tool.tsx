"use client";

import { Position, Role } from "@/constants/constants";
import { deleteTool } from "@/query/toolQuery";
import { ToolType } from "@/types/ToolType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { toast } from "react-toastify";

type ToolCardPropsType = {
  tool: ToolType;
  role: string;
  position: string;
};

export default function ToolCardToolCard({
  tool,
  role,
  position,
}: ToolCardPropsType) {
  const queryClient = useQueryClient();
  // ✅ Mutation to update
  const deleteToolMutation = useMutation({
    mutationFn: (id: string) => deleteTool(id),
    onSuccess: () => {
      toast.success("Tool deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
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
      className={` ${
        role === Role.SUPER_ADMIN ? "h-[280px]" : "h-auto"
      } p-2 relative z-0 rounded-lg shadow-md  hover:shadow-xl`}
      style={{
        backgroundColor: "var(--surface)",
        border: `1px solid var(--border)`,
      }}
    >
      <h2 className="text-[18px] font-semibold mb- capitalize">
        {tool.name}{" "}
        {tool?.quantityTaken == tool.quantity ? (
          <span className="text-red-500">(OUT)</span>
        ) : (
          0
        )}
      </h2>
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

      {(role === Role.SUPER_ADMIN && position === Position.MANAGER) ||
      (role === Role.ADMIN && position === Position.STORE_KEEPER) ? (
        <div className="flex justify-end gap-2 absolute bottom-2 right-2">
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
      ) : null}
    </div>
  );
}
