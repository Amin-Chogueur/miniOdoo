"use client";

import { ToolMovementType } from "@/types/MovementType";
import { FormEvent, use, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  fetchEmployeeByPin,
  getMovement,
  updateMovement,
} from "@/query/movementQuery";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

export default function MovementDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { user, isLoading: IsLoadingUserRole } = useAuth();
  const route = useRouter();
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [returnedQuantity, setReturnedQuantity] = useState(0);
  const [employeeReturningTool, setEmployeeReturningTool] = useState("");
  const [returnNote, setReturnNote] = useState("");

  const [pin, setPin] = useState("");
  const [errorEmployee, setErrorEmployee] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function getEmployeeNameFromDb() {
    if (!pin.trim()) {
      setErrorEmployee("Please provide the PIN first");
      return;
    }
    if (pin.trim().length < 6) {
      setErrorEmployee("Please provide a valide PIN, (6 degits)");
      return;
    }
    setLoading(true);
    setErrorEmployee(null);
    setEmployeeReturningTool("");

    try {
      const { fullName } = await fetchEmployeeByPin(pin);

      if (fullName) {
        setEmployeeReturningTool(fullName);
        setPin("");
      } else {
        setErrorEmployee("Employee not found");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unknown error occurred";
      setErrorEmployee(errorMessage);
    } finally {
      setLoading(false);
    }
  }

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
    onSuccess: (data) => {
      toast.success(data.message);
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

    if (returnedQuantity === 0 || !employeeReturningTool) {
      alert("Please specify the returned quantity and the Employee Name");
      return;
    }

    const updatedMovement = {
      ...movement,
      employeeReturningTool,
      returnNote: returnNote,
      returnedQuantity: returnedQuantity,
      storekeeperReceiverName: user.username,
      returnedAt: new Date().toISOString(),
    };
    console.log(updatedMovement);
    updateMovementMutation.mutate({ updatedMovement, id });
  }

  if (isLoading || IsLoadingUserRole) return <LoadingSpinner />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div
      className="min-h-screen mt-4"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Link
            href={"/movements"}
            className="inline-flex items-center text-green-600 font-medium hover:underline mb-4"
          >
            &larr; Back to Movements
          </Link>
          <h1 className="text-3xl font-bold">Tool Movement Details</h1>
        </div>

        {/* Main Container */}
        <div
          className="p-3 rounded-2xl shadow-lg"
          style={{
            backgroundColor: "var(--surface)",
            border: `1px solid var(--border)`,
          }}
        >
          {/* Movement Information */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">
              Movement Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Tool Name
                </label>
                <p className="text-lg capitalize font-semibold">
                  {movement?.toolName}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Quantity Taken
                </label>
                <p className="text-lg font-semibold">
                  {movement?.takenQuantity}
                </p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Employee (Taker)
                </label>
                <p className="text-lg">{movement?.employeeTakingTool}</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Storekeeper (Given)
                </label>
                <p className="text-lg">{movement?.storekeeperGivenName}</p>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Taken At
                </label>
                <p className="text-lg">
                  {movement?.takenAt &&
                    new Date(movement.takenAt).toLocaleString()}
                </p>
              </div>

              {movement?.takenNote && (
                <div className="md:col-span-2 space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Note (When Taken)
                  </label>
                  <p
                    className="text-lg p-3 rounded-lg"
                    style={{ backgroundColor: "var(--input-bg)" }}
                  >
                    {movement.takenNote}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Return Information (if returned) */}
          {movement?.returnedAt && (
            <div
              className="mb-8 p-4 rounded-lg"
              style={{ backgroundColor: "var(--input-bg)" }}
            >
              <h3 className="text-xl font-semibold mb-4">Return Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Returned At
                  </label>
                  <p className="text-lg">
                    {new Date(movement.returnedAt).toLocaleString()}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Quantity Returned
                  </label>
                  <p className="text-lg">{movement?.returnedQuantity}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Employee (Returner)
                  </label>
                  <p className="text-lg">{movement?.employeeReturningTool}</p>
                </div>

                <div className="space-y-1">
                  <label className="text-sm font-medium text-gray-500">
                    Storekeeper (Receiver)
                  </label>
                  <p className="text-lg">{movement?.storekeeperReceiverName}</p>
                </div>

                {movement?.returnNote && (
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-sm font-medium text-gray-500">
                      Note (On Return)
                    </label>
                    <p className="text-lg">{movement.returnNote}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Employee Lookup & Return Form */}
          {!movement?.employeeReturningTool && (
            <div className="space-y-6">
              {/* Employee Lookup */}
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Employee Lookup</h3>
                <div className="flex gap-2">
                  <input
                    maxLength={6}
                    type="password"
                    placeholder="Enter PIN..."
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    className="w-[170px]  px-4 py-2 rounded-lg outline-none text-base"
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

                {errorEmployee && (
                  <div
                    className="p-3 rounded-lg text-sm"
                    style={{ backgroundColor: "#fee", color: "#c33" }}
                  >
                    {errorEmployee}
                  </div>
                )}

                {employeeReturningTool && (
                  <div
                    className="p-2 rounded-lg text-lg font-semibold "
                    style={{ backgroundColor: "var(--input-bg)" }}
                  >
                    Employee:{" "}
                    <span className="text-red-500">
                      {employeeReturningTool}
                    </span>
                  </div>
                )}
              </div>

              {/* Return Form */}
              <form onSubmit={handleReturnTool} className="space-y-4">
                <h3 className="text-xl font-semibold">Return Tool</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Quantity Returned
                    </label>
                    <input
                      min={0}
                      max={movement?.takenQuantity}
                      required
                      value={returnedQuantity}
                      onChange={(e) => setReturnedQuantity(+e.target.value)}
                      type="number"
                      className="w-full px-4 py-3 rounded-lg outline-none text-base"
                      style={{
                        backgroundColor: "var(--input-bg)",
                        border: "1px solid var(--border)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    Return Note
                  </label>
                  <textarea
                    value={returnNote}
                    onChange={(e) => setReturnNote(e.target.value)}
                    placeholder="Add any notes about the return condition..."
                    rows={3}
                    className="w-full p-3 rounded-lg resize-none"
                    style={{
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
                <div className="flex justify-end items-center">
                  <button
                    disabled={
                      updateMovementMutation.isPending || !employeeReturningTool
                    }
                    type="submit"
                    className="w-full md:w-auto px-6 py-2 rounded-lg text-white font-semibold shadow-lg hover:opacity-90 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    style={{
                      backgroundColor: "var(--button-create)",
                      border: `1px solid var(--border)`,
                    }}
                  >
                    {updateMovementMutation.isPending
                      ? "Processing Return..."
                      : "Submit Return"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
