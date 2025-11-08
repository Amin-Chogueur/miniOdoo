"use client";

import { ToolMovementType } from "@/types/MovementType";
import { FormEvent, use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getMovement, updateMovement } from "@/query/movementQuery";

export default function MovementDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const route = useRouter();
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [returnSignature, setReturnSignature] = useState("");

  // 🔹 Use React Query for fetching
  const {
    data: movement,
    isLoading,
    error,
  } = useQuery<ToolMovementType>({
    queryKey: ["movement", id],
    queryFn: () => getMovement(id),
    staleTime: 60000,
  });

  const updateMovementMutation = useMutation({
    mutationFn: updateMovement,
    onSuccess: () => {
      // ✅ Refetch movements list to update UI
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      queryClient.invalidateQueries({ queryKey: ["movement", id] });
      route.push("/movements");
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
  });

  async function handleReturnTool(e: FormEvent) {
    e.preventDefault();
    if (!returnSignature) return;

    const updatedMovement = {
      employeeSignatureForReturn: returnSignature,
      storekeeperReceiverName: "Fouad",
      returnedAt: new Date().toISOString(),
    };

    updateMovementMutation.mutate({ updatedMovement, id });
  }

  if (isLoading) return <LoadingSpinner />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <div
      className="min-h-screen flex items-center justify-center mt-6"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      <div
        className="max-w-2xl w-full p-2 rounded-2xl shadow-2xl space-y-8 transition-all duration-300"
        style={{
          backgroundColor: "var(--surface)",
          border: `1px solid var(--border)`,
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Tool Movement Details
        </h1>

        <div className="space-y-5 text-lg">
          <div className="flex justify-between border-b pb-2">
            <strong>Tool Name:</strong>
            <span>{movement?.toolName}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <strong>Employee:</strong>
            <span>{movement?.employeeName}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <strong>Storekeeper (Given):</strong>
            <span>{movement?.storekeeperGivenName}</span>
          </div>

          <div className="flex justify-between border-b pb-2">
            <strong>Taken At:</strong>
            {movement?.takenAt && (
              <span>{new Date(movement.takenAt).toLocaleString()}</span>
            )}
          </div>

          <div className="flex justify-between border-b pb-2">
            <strong>Returned At:</strong>
            <span>
              {movement?.returnedAt
                ? new Date(movement?.returnedAt).toLocaleString()
                : "Not returned yet"}
            </span>
          </div>
          <div className="flex justify-between border-b pb-2">
            <strong>Storekeeper (Receiver):</strong>
            <span>
              {movement?.storekeeperReceiverName
                ? movement?.storekeeperReceiverName
                : "Not returned yet"}
            </span>
          </div>
        </div>

        <div className="mt-8 space-y-6 ">
          <div>
            <h2 className="text-xl font-semibold mb-3">
              Employee Signature (Take)
            </h2>
            <div
              className="h-32 flex items-center justify-center rounded-xl border text-lg"
              style={{
                backgroundColor: "var(--header-bg)",
                border: `1px solid var(--border)`,
              }}
            >
              {movement?.employeeSignatureForTake ? (
                <span>{movement.employeeSignatureForTake}</span>
              ) : (
                <span style={{ color: "var(--text-muted)" }}>
                  Not returned yet
                </span>
              )}
            </div>
          </div>
          <form onSubmit={handleReturnTool}>
            <div>
              <h2 className="text-xl font-semibold mb-3">
                Employee Signature (Return)
              </h2>
              <div
                className="h-32 flex items-center justify-center rounded-xl border text-lg"
                style={{
                  backgroundColor: "var(--header-bg)",
                  border: `1px solid var(--border)`,
                }}
              >
                {movement?.employeeSignatureForReturn ? (
                  <span>{movement.employeeSignatureForReturn}</span>
                ) : (
                  <input
                    type="text"
                    value={returnSignature}
                    onChange={(e) => setReturnSignature(e.target.value)}
                    placeholder="your signature here.. "
                    className="w-full h-full placeholder:text-center"
                  />
                )}
              </div>
            </div>

            {!movement?.employeeSignatureForReturn ? (
              <button
                disabled={updateMovementMutation.isPending}
                type="submit"
                className="mt-5 px-6 py-3 rounded-lg text-white font-medium shadow hover:opacity-90 transition cursor-pointer disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--button-create)",
                  border: `1px solid var(--border)`,
                }}
              >
                Save
              </button>
            ) : null}
          </form>
        </div>
      </div>
    </div>
  );
}
