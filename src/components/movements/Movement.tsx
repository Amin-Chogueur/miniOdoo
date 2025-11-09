import { ToolMovementType } from "@/types/MovementType";
import Link from "next/link";
import React from "react";

export default function ToolMovementCard({
  movement,
}: {
  movement: ToolMovementType;
}) {
  return (
    <tr
      className=" hover:bg-opacity-10 transition-colors "
      style={{
        backgroundColor: "var(--surface)",
        borderBottom: `1px solid var(--border)`,
      }}
    >
      <td className="px-3 py-1  gap-2">
        <Link
          href={`/movements/${movement._id}`}
          className="px-3 py-1 rounded text-white cursor-pointer"
          style={{
            backgroundColor: movement.employeeSignatureForReturn
              ? "var(--button-create)"
              : "var(--button-delete)",
            border: `1px solid var(--border)`,
          }}
        >
          {movement.employeeSignatureForReturn ? "Returned" : "Taken"}
        </Link>
      </td>
      <td className="px-4 py-2">{movement.toolName}</td>
      <td className="px-4 py-2">{movement.storekeeperGivenName}</td>
      <td className="px-4 py-2">{movement.employeeName}</td>
      <td className="px-4 py-2">
        {new Date(movement.takenAt).toLocaleString()}
      </td>
      <td className="px-4 py-2">
        <p>{movement.employeeSignatureForTake}</p>
      </td>

      <td className="px-4 py-2">
        {movement.returnedAt
          ? new Date(movement.returnedAt).toLocaleString()
          : "Not returned"}
      </td>

      <td className="px-4 py-2">
        {movement.employeeSignatureForReturn ? (
          <p>{movement.employeeSignatureForReturn}</p>
        ) : (
          <span className="text-sm text-gray-500">Not returned yet</span>
        )}
      </td>
      <td className="px-4 py-2">
        {movement.storekeeperReceiverName ? (
          <p>{movement.storekeeperReceiverName}</p>
        ) : (
          <span className="text-sm text-gray-500">Not returned yet</span>
        )}
      </td>
    </tr>
  );
}
