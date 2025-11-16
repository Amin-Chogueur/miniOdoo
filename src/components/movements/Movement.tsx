import { ToolMovementType } from "@/types/MovementType";
import { useRouter } from "next/navigation";
import React from "react";

export default function ToolMovementCard({
  movement,
}: {
  movement: ToolMovementType;
}) {
  const route = useRouter();
  return (
    <tr
      onClick={() => route.push(`/movements/${movement._id}`)}
      className=" hover:bg-opacity-10 transition-colors cursor-pointer"
      style={{
        backgroundColor: "var(--surface)",
        borderBottom: `1px solid var(--border)`,
      }}
    >
      <td
        className="px-3 py-1 text-white text-center  gap-2"
        style={{
          backgroundColor: movement.employeeSignatureForReturn
            ? "var(--button-create)"
            : "var(--button-delete)",
          border: `1px solid var(--border)`,
        }}
      >
        {movement.employeeSignatureForReturn ? "Returned" : "Taken"}
      </td>
      <td className="px-3 ">{movement.toolName}</td>
      <td className="px-3 ">{movement.takenQuantity}</td>
      <td className="px-3 ">{movement.storekeeperGivenName}</td>
      <td className="px-3 ">{movement.employeeName}</td>
      <td className="px-3 ">{new Date(movement.takenAt).toLocaleString()}</td>
      <td className="px-4 py-2 bg-white">
        <img
          src={movement.employeeSignatureForTake!}
          alt="Employee Signature"
          className="w-20 h-auto  rounded-md mx-auto"
        />
      </td>

      <td className="px-4 py-2">
        {movement.returnedAt
          ? new Date(movement.returnedAt).toLocaleString()
          : "Not returned"}
      </td>
      <td className="px-3 ">{movement.returnedQuantity || 0}</td>
      <td className="px-3  bg-white">
        {movement.employeeSignatureForReturn ? (
          <img
            src={movement.employeeSignatureForReturn!}
            alt="Employee Signature"
            className="w-20 h-auto  rounded-md mx-auto"
          />
        ) : (
          <span className="text-sm text-gray-500 text-center">
            Not returned yet
          </span>
        )}
      </td>
      <td className="px-3 py-1">
        {movement.storekeeperReceiverName ? (
          <p>{movement.storekeeperReceiverName}</p>
        ) : (
          <span className="text-sm text-gray-500">Not returned yet</span>
        )}
      </td>
    </tr>
  );
}
