"use client";

import { ToolMovementType } from "@/types/MovementType";
import { FormEvent, use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getMovement, updateMovement } from "@/query/movementQuery";
import Link from "next/link";

export default function MovementDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const route = useRouter();
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [returnedQuantity, setReturnedQuantity] = useState(0);
  const [returnSignature, setReturnSignature] = useState("");
  const [returnNote, setReturnNote] = useState("");

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
      queryClient.invalidateQueries({ queryKey: ["tools"] });
      route.push("/movements");
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
  });

  async function handleReturnTool(e: FormEvent) {
    e.preventDefault();
    if (!returnSignature) return;
    if (returnedQuantity === 0) {
      alert("Please specify the returned quantity");
      return;
    }

    const updatedMovement = {
      ...movement,
      employeeSignatureForReturn: returnSignature,
      returnNote: returnNote,
      returnedQuantity: returnedQuantity,
      storekeeperReceiverName: "Fouad",
      returnedAt: new Date().toISOString(),
    };

    updateMovementMutation.mutate({ updatedMovement, id });
  }

  if (isLoading) return <LoadingSpinner />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <div className="mt-6">
      <Link href={"/movements"} className="underline text-green-600 ">
        &larr; Back
      </Link>
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
            <div className="flex items-center justify-between  border-b pb-2">
              <div className="space-x-2 ">
                <strong>Tool Name:</strong>
                <span className="capitalize">{movement?.toolName}</span>
              </div>
              <div className="space-x-2 ">
                <strong>Qte Taken:</strong>
                <span>{movement?.takenQuantity}</span>
              </div>
            </div>
            <div className="flex items-center justify-between  border-b pb-2">
              <div className="space-x-2 ">
                <strong>Employee:</strong>
                <span>{movement?.employeeName}</span>
              </div>

              <div className="space-x-2 ">
                <strong>Storekeeper (Given):</strong>
                <span>{movement?.storekeeperGivenName}</span>
              </div>
            </div>

            <div className="space-x-3 border-b pb-2">
              <strong>Taken At:</strong>
              {movement?.takenAt && (
                <span>{new Date(movement.takenAt).toLocaleString()}</span>
              )}
            </div>

            {movement?.returnedAt ? (
              <div className="flex justify-between border-b pb-2">
                <div className="space-x-2">
                  <strong>Returned At:</strong>
                  <span>{new Date(movement?.returnedAt).toLocaleString()}</span>
                </div>
                <div className="space-x-2">
                  <strong>Qte Returned:</strong>
                  <span>{movement?.returnedQuantity}</span>
                </div>
              </div>
            ) : null}
            {movement?.storekeeperReceiverName ? (
              <div className="flex justify-between border-b pb-2">
                <strong>Storekeeper (Receiver):</strong>
                <span>{movement?.storekeeperReceiverName}</span>
              </div>
            ) : null}
            {movement?.takenNote ? (
              <div className="flex flex-col gap-2 border-b pb-2">
                <strong>Note (When taken):</strong>
                <p>{movement?.takenNote}</p>
              </div>
            ) : null}
            {movement?.returnNote ? (
              <div className="flex flex-col gap-2 border-b pb-2">
                <strong>Note (On Return):</strong>
                <p>{movement?.returnNote}</p>
              </div>
            ) : null}
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
            <form onSubmit={handleReturnTool} className="space-y-2">
              {!movement?.employeeSignatureForReturn ? (
                <div className="w-24 sm:w-32">
                  <label className="block text-sm md:text-lg font-medium">
                    Qte Returned
                  </label>
                  <input
                    min={0}
                    required
                    value={returnedQuantity}
                    onChange={(e) => setReturnedQuantity(+e.target.value)}
                    type="number"
                    className="w-full px-4 py-2 rounded-lg outline-none text-base"
                    style={{
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              ) : null}
              {!movement?.employeeSignatureForReturn ? (
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    Note (On return)
                  </h2>
                  <div
                    className="h-32 flex items-center justify-center rounded-xl border text-lg "
                    style={{
                      backgroundColor: "var(--header-bg)",
                      border: `1px solid var(--border)`,
                    }}
                  >
                    <textarea
                      value={returnNote}
                      onChange={(e) => setReturnNote(e.target.value)}
                      placeholder="your note here.. "
                      className="w-full max-h-full h-full  p-2"
                    />
                  </div>
                </div>
              ) : null}
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
                      required
                      value={returnSignature}
                      onChange={(e) => setReturnSignature(e.target.value)}
                      placeholder="your signature here.. "
                      className="w-full h-full placeholder:text-center p-2"
                    />
                  )}
                </div>
              </div>

              {!movement?.employeeSignatureForReturn ? (
                <button
                  disabled={updateMovementMutation.isPending}
                  type="submit"
                  className=" px-3 py-1 rounded-lg text-white font-medium shadow hover:opacity-90 transition cursor-pointer disabled:cursor-not-allowed"
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
    </div>
  );
}
