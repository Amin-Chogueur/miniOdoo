import { ToolMovementType } from "@/types/MovementType";
import React from "react";

export default function RecentMovementsTable({
  latestMovements,
}: {
  latestMovements: ToolMovementType[];
}) {
  return (
    <div
      className="rounded-2xl shadow-md overflow-hidden transition"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <h2
        className="text-xl font-semibold p-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        Recent Movements
      </h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead
            style={{
              backgroundColor: "var(--header-bg)",
              color: "var(--text-secondary)",
            }}
          >
            <tr>
              <th className="text-left py-3 px-4">Tool</th>
              <th className="text-left py-3 px-4">Code</th>
              <th className="text-left py-3 px-4">Employee</th>
              <th className="text-left py-3 px-4">Taken Qty</th>
              <th className="text-left py-3 px-4">Returned Qty</th>
              <th className="text-left py-3 px-4">Taken At</th>
              <th className="text-left py-3 px-4">Returned At</th>
            </tr>
          </thead>
          <tbody>
            {latestMovements?.map((move) => (
              <tr
                key={move._id}
                className="border-b transition hover:opacity-80"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="py-3 px-4">{move.toolName}</td>
                <td className="py-3 px-4">{move.toolCode}</td>
                <td className="py-3 px-4">{move.employeeName}</td>
                <td className="py-3 px-4">{move.takenQuantity}</td>
                <td className="py-3 px-4">{move.returnedQuantity || "-"}</td>
                <td className="py-3 px-4">
                  {new Date(move.takenAt).toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  {move.returnedAt
                    ? new Date(move.returnedAt).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
