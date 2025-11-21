import { Position, Role } from "@/constants/constants";
import { FormatDate } from "@/helpers/formatDate";

import { deleteEmployee } from "@/query/employeesQuery";
import { EmployeeType } from "@/types/EmployeeType";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

type EmployeePropsType = {
  employee: EmployeeType;
  role: string;
  position: string;
  currentUserEmail: string;
};

export default function Employee({
  employee,
  role,
  currentUserEmail,
  position,
}: EmployeePropsType) {
  const [togglePin, setTogglePin] = useState(false);
  const queryClient = useQueryClient();
  // ✅ Mutation to update
  const deleteEmployeeMutation = useMutation({
    mutationFn: (id: string) => deleteEmployee(id),
    onSuccess: () => {
      toast.success("Employee deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    },
    onError: (error) => {
      toast.error(error?.message || "Failed to delete employee");
      console.error("Error deleting employee:", error);
    },
  });
  function handleDeleteEmployee() {
    const confirm = window.confirm(
      `Are you sure you want to delete this employee: ${employee.fullName.toUpperCase()}`
    );
    if (confirm) {
      deleteEmployeeMutation.mutate(employee._id!);
    }
  }
  const isPinVisible =
    currentUserEmail === employee.email &&
    !(Position.STORE_KEEPER === position);
  return (
    <div
      className={`${
        role === Role.SUPER_ADMIN ? "h-[230px]" : "h-fit"
      } p-2  relative z-0 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200`}
      style={{
        backgroundColor: "var(--surface)",
        border: `1px solid var(--border)`,
      }}
    >
      <h2 className="text-[18px] capitalize font-semibold mb-2 text-[var(--text-primary)]">
        {employee.fullName}{" "}
        <span
          style={{ color: "var(--text-secondary)" }}
          className="text-[15px]"
        >
          ({employee.position})
        </span>
      </h2>

      <p style={{ color: "var(--text-secondary)" }} className="mb-1">
        <strong>Email:</strong> {employee?.email}
      </p>

      <p style={{ color: "var(--text-secondary)" }} className="mb-1">
        <strong>Date of Birth:</strong> {FormatDate(employee?.dateOfBirth)}
      </p>

      <p style={{ color: "var(--text-secondary)" }} className="mb-1">
        <strong>Start Date:</strong> {FormatDate(employee?.dateOfStart)}
      </p>

      <p
        style={{
          color: "var(--text-secondary)",
        }}
        className="mb-3"
      >
        <strong>Role: </strong> {employee?.role}
      </p>
      {isPinVisible ? (
        <p
          style={{
            color: "var(--text-secondary)",
            backgroundColor: "var(--background)",
          }}
          className="mb-3 p-1 rounded flex justify-between items-center"
        >
          <span>
            <strong>Pin: </strong>{" "}
            <span>{togglePin ? employee?.pin : "******"}</span>
          </span>

          <button
            className="cursor-pointer"
            onClick={() => setTogglePin((prev) => !prev)}
          >
            {togglePin ? <FaEyeSlash /> : <FaEye />}
          </button>
        </p>
      ) : null}

      {role === Role.SUPER_ADMIN ? (
        <div className="flex justify-end gap-2 absolute bottom-2 right-2">
          <button
            onClick={handleDeleteEmployee}
            className="px-3 py-1 rounded text-white cursor-pointer"
            style={{
              backgroundColor: "var(--button-delete)",
              border: `1px solid var(--border)`,
            }}
          >
            Delete
          </button>

          <Link
            href={`/employees/edit/${employee?._id}`}
            className="px-3 py-1 rounded text-white cursor-pointer"
            style={{
              backgroundColor: "var(--button-create)",
              border: `1px solid var(--border)`,
            }}
          >
            Edit
          </Link>
        </div>
      ) : null}
    </div>
  );
}
