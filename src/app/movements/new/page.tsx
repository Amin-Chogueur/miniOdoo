"use client";

import React, { FormEvent, useState } from "react";
import ToolList from "@/components/movements/ToolList";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMovement } from "@/query/movementQuery";
import EmployeesList from "@/components/movements/EmployeesList";
import Link from "next/link";
import SignaturePad from "@/components/movements/SignaturePad";
import { useAuth } from "@/hooks/useAuth";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

const initialState = {
  toolName: "",
  toolCode: "",
  employeeName: "",
  takenQuantity: 1,
  employeeSignatureForTake: "",
  takenNote: "",
};

export default function NewMovements() {
  const { user, isLoading: IsLoadingUserRole } = useAuth();
  const route = useRouter();
  const [movement, setMovement] = useState(initialState);
  const [searchTool, setSearchTool] = useState("");
  const [searchEmployee, setSearchEmployee] = useState("");
  const queryClient = useQueryClient();

  const addMovementMutation = useMutation({
    mutationFn: addMovement,
    onSuccess: () => {
      // ✅ Refresh movements list
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
      queryClient.invalidateQueries({ queryKey: ["tools"] });

      // ✅ Reset fields
      setMovement(initialState);
      // ✅ Redirect
      route.push("/movements");
    },
    onError: (error) => {
      console.error("Failed to add movement:", error);
    },
  });

  // 🔹 Handle form submission
  async function handleSubmitMovement(e: FormEvent) {
    e.preventDefault();
    if (
      !movement.toolName.trim() ||
      !movement.employeeName.trim() ||
      !movement.employeeSignatureForTake
    )
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
    <div className="mt-3">
      <Link href={"/movements"} className="underline text-green-600 ">
        &larr; Back
      </Link>
      <div
        className=" flex items-center justify-center py-6 "
        style={{
          backgroundColor: "var(--background)",
          color: "var(--text-primary)",
        }}
      >
        <div
          className="w-full max-w-2xl rounded-2xl shadow-2xl p-2 space-y-4 transition-all duration-300"
          style={{
            backgroundColor: "var(--surface)",
            border: `1px solid var(--border)`,
          }}
        >
          <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
            Create New Movement
          </h1>

          {/* Search input */}
          <div className="flex gap-3">
            <div className="space-y-1">
              <label className="text-sm md:text-lg font-medium">
                Search for Tool
              </label>
              <input
                type="text"
                required
                placeholder="ex: Debarbeuse Pm..."
                value={searchTool}
                onChange={(e) => setSearchTool(e.target.value)}
                className="w-full px-4 py-2 rounded-lg outline-none text-base"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: `1px solid var(--border)`,
                  color: "var(--text-primary)",
                }}
              />
              {searchTool.length >= 3 ? (
                <div className="mt-1">
                  <ToolList
                    currentTool={searchTool}
                    setToolData={setMovement}
                    setSearchTool={setSearchTool}
                  />
                </div>
              ) : null}
            </div>

            {/* Person Input */}
            <div className="space-y-1">
              <label className="text-sm md:text-lg  font-medium">
                Search for employee
              </label>
              <input
                type="text"
                required
                placeholder="ex: Karim..."
                value={searchEmployee}
                onChange={(e) => setSearchEmployee(e.target.value)}
                className="w-full px-4 py-2 rounded-lg outline-none text-base"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: `1px solid var(--border)`,
                  color: "var(--text-primary)",
                }}
              />
              {/* <PersonneList currentPerson={person} /> */}
              {searchEmployee.length >= 3 ? (
                <div className="mt-1">
                  <EmployeesList
                    currentPerson={searchEmployee}
                    setEmployee={setMovement}
                    setSearchEmployee={setSearchEmployee}
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* ----------------- Form ---------------------- */}

          <form onSubmit={handleSubmitMovement} className="space-y-2">
            <div className="space-y-1 ">
              <div className="flex items-center gap-4">
                <div className="flex-1 min-w-[60%]">
                  <label className="block text-sm md:text-lg font-medium">
                    Tool
                  </label>
                  <input
                    type="text"
                    required
                    value={movement.toolName}
                    readOnly
                    className="w-full px-4 py-2 rounded-lg outline-none text-red-500"
                    style={{
                      backgroundColor: "var(--input-bg)",
                      border: "1px solid var(--border)",
                    }}
                  />
                </div>

                <div className="w-24 sm:w-32">
                  <label className="block text-sm md:text-lg font-medium">
                    Qte
                  </label>
                  <input
                    min={0}
                    value={movement.takenQuantity}
                    name="takenQuantity"
                    onChange={(e) =>
                      setMovement((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
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
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-sm md:text-lg  font-medium">
                Employee
              </label>
              <input
                type="text"
                required
                value={movement.employeeName}
                readOnly
                className="w-full px-4 py-2 rounded-lg outline-none text-red-500"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: `1px solid var(--border)`,
                }}
              />
            </div>
            {/* Note Input */}
            <div className="space-y-1">
              <label className="text-lg font-medium">Note (When taken)</label>
              <textarea
                placeholder="Montion your note..."
                value={movement.takenNote}
                name="takenNote"
                onChange={(e) =>
                  setMovement((prev) => ({
                    ...prev,
                    [e.target.name]: e.target.value,
                  }))
                }
                className="w-full px-4 py-2 rounded-lg outline-none text-base"
                style={{
                  backgroundColor: "var(--input-bg)",
                  border: `1px solid var(--border)`,
                  color: "var(--text-primary)",
                }}
              />
            </div>
            {/* Signature Input */}
            <div className="space-y-2">
              <label className="text-lg font-medium">Signature</label>
              <SignaturePad
                onEnd={(signatureData) =>
                  setMovement((prev) => ({
                    ...prev,
                    employeeSignatureForTake: signatureData, // store base64 image string
                  }))
                }
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-4 pt-6">
              <button
                disabled={addMovementMutation.isPending}
                type="submit"
                className="px-3 py-1 rounded-lg text-white font-medium shadow hover:opacity-90 transition cursor-pointer  disabled:cursor-not-allowed"
                style={{
                  backgroundColor: "var(--button-create)",

                  border: `1px solid var(--border)`,
                }}
              >
                {addMovementMutation.isPending ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
