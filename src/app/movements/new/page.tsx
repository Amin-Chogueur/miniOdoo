"use client";

import React, { FormEvent, useState } from "react";
import ToolList from "@/components/movements/ToolList";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMovement } from "@/query/movementQuery";
import EmployeesList from "@/components/movements/EmployeesList";

export default function NewMovements() {
  const route = useRouter();
  const [tool, setTool] = useState("");
  const [employee, setEmployee] = useState("");
  const [signature, setSignature] = useState("");
  const queryClient = useQueryClient();
  function handleDiscard() {
    setEmployee("");
    setTool("");
  }

  const addMovementMutation = useMutation({
    mutationFn: addMovement,
    onSuccess: () => {
      // ✅ Refresh movements list
      queryClient.invalidateQueries({ queryKey: ["movements"] });

      // ✅ Reset fields
      setTool("");
      setEmployee("");
      setSignature("");

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
    if (!tool.trim() || !employee.trim() || !signature) return;

    const movement = {
      toolName: tool,
      employeeName: employee,
      employeeSignatureForTake: signature,
      takenAt: new Date().toISOString(),
      storekeeperGivenName: "Amin",
    };

    addMovementMutation.mutate(movement);
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-6"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      <div
        className="w-full max-w-2xl rounded-2xl shadow-2xl p-8 space-y-4 transition-all duration-300"
        style={{
          backgroundColor: "var(--surface)",
          border: `1px solid var(--border)`,
        }}
      >
        <h1 className="text-3xl font-bold text-center mb-6 tracking-wide">
          Create New Movement
        </h1>

        {/* Tool Name Input */}
        <form onSubmit={handleSubmitMovement}>
          <div className="space-y-1">
            <label className="text-lg font-medium">Tool Name</label>
            <input
              type="text"
              required
              placeholder="Search for a tool..."
              value={tool}
              onChange={(e) => setTool(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none text-base"
              style={{
                backgroundColor: "var(--input-bg)",
                border: `1px solid var(--border)`,
                color: "var(--text-primary)",
              }}
            />
            {tool.length >= 3 ? (
              <div className="mt-1">
                <ToolList currentTool={tool} setTool={setTool} />
              </div>
            ) : null}
          </div>

          {/* Person Input */}
          <div className="space-y-1">
            <label className="text-lg font-medium">Person Name</label>
            <input
              type="text"
              required
              placeholder="Search for a person..."
              value={employee}
              onChange={(e) => setEmployee(e.target.value)}
              className="w-full px-4 py-2 rounded-lg outline-none text-base"
              style={{
                backgroundColor: "var(--input-bg)",
                border: `1px solid var(--border)`,
                color: "var(--text-primary)",
              }}
            />
            {/* <PersonneList currentPerson={person} /> */}
            {employee.length >= 3 ? (
              <div className="mt-1">
                <EmployeesList
                  currentPerson={employee}
                  setPerson={setEmployee}
                />
              </div>
            ) : null}
          </div>

          {/* Signature Input */}
          <div className="space-y-2">
            <label className="text-lg font-medium">Signature</label>
            <input
              type="text"
              required
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              placeholder="Enter your signature..."
              className="w-full px-4 py-2 rounded-lg outline-none text-base"
              style={{
                backgroundColor: "var(--input-bg)",
                border: `1px solid var(--border)`,
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-6">
            <button
              disabled={addMovementMutation.isPending}
              className="px-6 py-3 rounded-lg text-white font-medium shadow hover:opacity-90 transition cursor-pointer  disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--button-create)",

                border: `1px solid var(--border)`,
              }}
            >
              {addMovementMutation.isPending ? "Submitting..." : "Submit"}
            </button>

            <button
              onClick={handleDiscard}
              className="px-6 py-3 rounded-lg text-white font-medium shadow hover:opacity-90 transition cursor-pointer"
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
