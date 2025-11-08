"use client";

import Employee from "@/components/employees/Employee";
import CustomHeader from "@/components/ui/CustomHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import NoResults from "@/components/ui/NoResults";
import { getAllEmployees } from "@/query/employeesQuery";
import { EmployeeType } from "@/types/EmployeeType";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Employees() {
  const [search, setSearch] = useState("");

  const {
    data: employees,
    isLoading,
    error,
  } = useQuery<EmployeeType[]>({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
    staleTime: 600000,
  });

  const filterdEmployee = employees?.filter((employee) =>
    employee.fullName.toLowerCase().includes(search.trim().toLowerCase())
  );
  if (isLoading) return <LoadingSpinner />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div
      className="min-h-screen  transition-colors"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      {/* Header */}
      <CustomHeader
        title="Employees list"
        path="/employees/new"
        placeholder="Search for employee ..."
        search={search}
        setSearch={setSearch}
      />
      {!isLoading && !error && employees?.length === 0 ? (
        <NoResults message="No employee was found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6 mt-[170px]">
          {filterdEmployee?.map((employee) => (
            <Employee key={employee._id} employee={employee} />
          ))}
        </div>
      )}
    </div>
  );
}
