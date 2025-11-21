"use client";

import React, { FormEvent, useState } from "react";
import ToolList from "@/components/movements/ToolList";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMovement, fetchEmployeeByPin } from "@/query/movementQuery";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { toast } from "react-toastify";

const initialState = {
  toolName: "",
  toolCode: "",
  employeeTakingTool: "",
  takenQuantity: 1,
  takenNote: "",
};

export default function NewMovements() {
  const { user, isLoading: IsLoadingUserRole } = useAuth();
  const route = useRouter();
  const [movement, setMovement] = useState(initialState);
  const [searchTool, setSearchTool] = useState("");

  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  async function getEmployeeNameFromDb() {
    if (!pin.trim()) {
      setError("Please provide the PIN first");
      return;
    }
    if (pin.trim().length < 6) {
      setError("Please provide a valide PIN, (6 degits)");
      return;
    }

    setLoading(true);
    setError(null);
    setMovement((prev) => ({ ...prev, employeeTakingTool: "" }));

    try {
      const { fullName } = await fetchEmployeeByPin(pin);

      if (fullName) {
        setMovement((prev) => ({ ...prev, employeeTakingTool: fullName }));
        setPin("");
      } else {
        setError("Employee not found");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const addMovementMutation = useMutation({
    mutationFn: addMovement,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      setMovement(initialState);
      route.push("/movements");
    },
    onError: (error) => {
      console.error("Failed to add movement:", error);
    },
  });

  async function handleSubmitMovement(e: FormEvent) {
    e.preventDefault();
    if (!movement.toolName.trim() || !movement.employeeTakingTool.trim())
      return;

    const newMovement = {
      ...movement,
      takenAt: new Date().toISOString(),
      storekeeperGivenName: user?.username,
    };

    addMovementMutation.mutate(newMovement);
  }

  if (IsLoadingUserRole) return <LoadingSpinner />;

  return (
    <div
      className="min-h-screen mt-4"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={"/movements"}
            className="inline-flex items-center text-green-600 font-medium hover:underline mb-4"
          >
            &larr; Back to Movements
          </Link>
          <h1 className="text-3xl font-bold">Create New Movement</h1>
        </div>

        {/* Main Form */}
        <div
          className="p-3 rounded-2xl shadow-lg"
          style={{
            backgroundColor: "var(--surface)",
            border: `1px solid var(--border)`,
          }}
        >
          {/* Tool Search */}
          <div className="space-y-4 mb-6">
            <label className="block text-lg font-medium">Search for Tool</label>
            <input
              type="text"
              required
              placeholder="ex: Debarbeuse Pm..."
              value={searchTool}
              onChange={(e) => setSearchTool(e.target.value)}
              className="w-full px-4 py-3 rounded-lg outline-none text-base"
              style={{
                backgroundColor: "var(--input-bg)",
                border: `1px solid var(--border)`,
                color: "var(--text-primary)",
              }}
            />
            {searchTool.length >= 3 && (
              <div className="mt-2">
                <ToolList
                  currentTool={searchTool}
                  setToolData={setMovement}
                  setSearchTool={setSearchTool}
                />
              </div>
            )}
          </div>

          {/* Employee Lookup */}
          <div className="space-y-4 mb-6">
            <label className="block text-lg font-medium">
              Get Employee By PIN
            </label>
            <div className="flex gap-2">
              <input
                maxLength={6}
                type="password"
                placeholder="Enter PIN..."
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                className="w-[170px] px-4 py-2 rounded-lg outline-none text-base"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: `1px solid var(--border)`,
                  color: "var(--text-primary)",
                }}
              />
              <button
                onClick={getEmployeeNameFromDb}
                disabled={loading}
                className="px-4 py-2 rounded-lg text-white font-medium shadow hover:opacity-90 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundColor: "var(--button-create)",
                  border: `1px solid var(--border)`,
                }}
              >
                {loading ? "..." : "Get"}
              </button>
            </div>

            {error && (
              <div
                className="p-3 rounded-lg text-sm"
                style={{ backgroundColor: "#fee", color: "#c33" }}
              >
                {error}
              </div>
            )}
          </div>

          {/* Movement Form */}
          <form onSubmit={handleSubmitMovement} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tool Name */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Tool Name</label>
                <input
                  type="text"
                  required
                  value={movement.toolName}
                  readOnly
                  className="w-full px-4 py-3 rounded-lg outline-none text-red-500 font-semibold"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                  }}
                />
              </div>

              {/* Quantity */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  min={1}
                  value={movement.takenQuantity}
                  name="takenQuantity"
                  onChange={(e) =>
                    setMovement((prev) => ({
                      ...prev,
                      [e.target.name]: +e.target.value,
                    }))
                  }
                  type="number"
                  className="w-full px-4 py-2 rounded-lg outline-none text-base"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              {/* Employee */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Employee</label>
                <input
                  type="text"
                  required
                  value={movement.employeeTakingTool}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg outline-none text-red-500 font-semibold"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    border: `1px solid var(--border)`,
                  }}
                />
              </div>

              {/* Storekeeper */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Storekeeper</label>
                <input
                  type="text"
                  value={user?.username || ""}
                  readOnly
                  className="w-full px-4 py-2 rounded-lg outline-none text-base"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    border: `1px solid var(--border)`,
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="block text-lg font-medium">
                Note (When taken)
              </label>
              <textarea
                placeholder="Mention your note about this movement..."
                value={movement.takenNote}
                name="takenNote"
                onChange={(e) =>
                  setMovement((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-4 py-2 rounded-lg outline-none text-base resize-none"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: `1px solid var(--border)`,
                  color: "var(--text-primary)",
                }}
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-2">
              <button
                disabled={
                  addMovementMutation.isPending ||
                  !movement.toolName ||
                  !movement.employeeTakingTool
                }
                type="submit"
                className="px-6 py-2 rounded-lg text-white font-semibold shadow-lg hover:opacity-90 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundColor: "var(--button-create)",
                  border: `1px solid var(--border)`,
                }}
              >
                {addMovementMutation.isPending
                  ? "Creating Movement..."
                  : "Create Movement"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
