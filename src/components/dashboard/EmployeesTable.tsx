import { EmployeeType } from "@/types/EmployeeType";
import React from "react";

export default function EmployeesTable({
  latestEmployees,
}: {
  latestEmployees: EmployeeType[];
}) {
  return (
    <div
      className="rounded-2xl shadow-md overflow-hidden mb-8 transition"
      style={{
        backgroundColor: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      <h2
        className="text-xl font-semibold p-4 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        Recent Employees
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
              <th className="text-left py-3 px-4">Full Name</th>
              <th className="text-left py-3 px-4">Email</th>
              <th className="text-left py-3 px-4">Position</th>
              <th className="text-left py-3 px-4">Role</th>
            </tr>
          </thead>
          <tbody>
            {latestEmployees?.map((emp) => (
              <tr
                key={emp._id}
                className="border-b transition hover:opacity-80"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="py-3 px-4">{emp.fullName}</td>
                <td className="py-3 px-4">{emp.email}</td>
                <td className="py-3 px-4">{emp.position}</td>
                <td className="py-3 px-4">{emp.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
