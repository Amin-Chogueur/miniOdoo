"use client";

import { ToolMovementType } from "@/types/MovementType";
import { FormEvent, use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getMovement, updateMovement } from "@/query/movementQuery";
import Link from "next/link";
import SignaturePad from "@/components/movements/SignaturePad";

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
    <div className="mt-6 px-1 sm:px-2 lg:px-4">
      <Link
        href={"/movements"}
        className="text-green-600 font-medium hover:underline"
      >
        &larr; Back
      </Link>

      <div
        className="flex justify-center mt-6"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--text-primary)",
        }}
      >
        <div
          className="max-w-3xl w-full p-2 sm:p-4 rounded-3xl shadow-xl space-y-8 transition-all duration-300"
          style={{
            backgroundColor: "var(--surface)",
            border: `1px solid var(--border)`,
          }}
        >
          <h1 className="text-3xl font-bold text-center mb-8 tracking-wide">
            Tool Movement Details
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-lg">
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Tool Name:</span>
              <span className="capitalize">{movement?.toolName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Qte Taken:</span>
              <span>{movement?.takenQuantity}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Employee:</span>
              <span>{movement?.employeeName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Storekeeper (Given):</span>
              <span>{movement?.storekeeperGivenName}</span>
            </div>
            <div className="flex justify-between border-b pb-2">
              <span className="font-semibold">Taken At:</span>
              <span>
                {movement?.takenAt &&
                  new Date(movement.takenAt).toLocaleString()}
              </span>
            </div>
            {movement?.returnedAt && (
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Returned At:</span>
                <span>{new Date(movement.returnedAt).toLocaleString()}</span>
              </div>
            )}
            {movement?.returnedQuantity && (
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Qte Returned:</span>
                <span>{movement?.returnedQuantity}</span>
              </div>
            )}
            {movement?.storekeeperReceiverName && (
              <div className="flex justify-between border-b pb-2">
                <span className="font-semibold">Storekeeper (Receiver):</span>
                <span>{movement?.storekeeperReceiverName}</span>
              </div>
            )}
            {movement?.takenNote && (
              <div className="border-b pb-2">
                <span className="font-semibold">Note (When taken):</span>
                <p className="mt-1">{movement.takenNote}</p>
              </div>
            )}
            {movement?.returnNote && (
              <div className="border-b pb-2">
                <span className="font-semibold">Note (On Return):</span>
                <p className="mt-1">{movement.returnNote}</p>
              </div>
            )}
          </div>

          {/* Employee Signature (Taken) */}
          <div className="space-y-3">
            <h2 className="text-xl font-semibold">Employee Signature (Take)</h2>
            <div
              className="h-36 flex items-center justify-center rounded-xl border border-dashed"
              style={{
                backgroundColor: "var(--header-bg)",
                borderColor: "var(--border)",
              }}
            >
              {movement?.employeeSignatureForTake ? (
                <img
                  src={movement.employeeSignatureForTake!}
                  alt="Employee Signature"
                  className="w-60 h-auto object-contain"
                />
              ) : (
                <span className="text-gray-400 dark:text-gray-500">
                  Not returned yet
                </span>
              )}
            </div>
          </div>

          {/* Return Form */}
          {!movement?.employeeSignatureForReturn && (
            <form onSubmit={handleReturnTool} className="space-y-6">
              <div className="max-w-xs">
                <label className="block text-sm md:text-lg font-medium mb-1">
                  Qte Returned
                </label>
                <input
                  min={0}
                  required
                  value={returnedQuantity}
                  onChange={(e) => setReturnedQuantity(+e.target.value)}
                  type="number"
                  className="w-full px-4 py-2 rounded-lg outline-none text-base shadow-sm"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">Note (On return)</h2>
                <textarea
                  value={returnNote}
                  onChange={(e) => setReturnNote(e.target.value)}
                  placeholder="Your note here..."
                  className="w-full h-28 p-3 rounded-xl resize-none shadow-sm"
                  style={{
                    backgroundColor: "var(--input-bg)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-2">
                  Employee Signature (Return)
                </h2>
                <div
                  className="flex items-center justify-center p-4 rounded-xl border border-dashed"
                  style={{
                    backgroundColor: "var(--header-bg)",
                    borderColor: "var(--border)",
                  }}
                >
                  <SignaturePad
                    onEnd={(signatureData) => setReturnSignature(signatureData)}
                  />
                </div>
              </div>

              <button
                disabled={updateMovementMutation.isPending}
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-white font-medium shadow-lg hover:opacity-90 transition cursor-pointer disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--button-create)",
                  border: `1px solid var(--border)`,
                }}
              >
                Save
              </button>
            </form>
          )}

          {movement?.employeeSignatureForReturn && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">
                Employee Signature (Return)
              </h2>
              <div
                className="flex items-center justify-center h-32 p-4 rounded-xl border border-dashed"
                style={{
                  backgroundColor: "var(--header-bg)",
                  borderColor: "var(--border)",
                }}
              >
                <img
                  src={movement.employeeSignatureForReturn!}
                  alt="Employee Signature"
                  className="w-[300px] h-auto object-contain"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
