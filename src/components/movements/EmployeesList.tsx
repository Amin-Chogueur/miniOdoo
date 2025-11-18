import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { getAllEmployees } from "@/query/employeesQuery";
import { EmployeeType } from "@/types/EmployeeType";

type EmployeesListProps = {
  currentPerson: string;
  setSearchEmployee: React.Dispatch<React.SetStateAction<string>>;
  setEmployee: React.Dispatch<
    React.SetStateAction<{
      toolName: string;
      toolCode: string;
      employeeTakingTool: string;
      takenQuantity: number;
      takenNote: string;
    }>
  >;
};

function EmployeesList({
  currentPerson,
  setEmployee,
  setSearchEmployee,
}: EmployeesListProps) {
  const [hideList, setHideList] = useState(false);
  const {
    data: employees,
    isLoading,
    error,
  } = useQuery<EmployeeType[]>({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
    staleTime: 600000,
  });
  const filteredEmployees = employees?.filter((person) =>
    person.fullName.toLowerCase().includes(currentPerson.toLowerCase())
  );
  function handleClick(name: string) {
    setEmployee((prev) => ({ ...prev, employeeName: name }));
    setSearchEmployee("");
    setHideList(true);
  }
  if (hideList) return;
  if (isLoading) return <p className="p-2">Loading employees...</p>;
  if (filteredEmployees?.length === 0)
    return <p className="p-1 text-red-500">No employee match your search</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <ul className="space-y-0.5 bg-black p-1">
      {filteredEmployees?.map((employee) => (
        <li
          className="text-xs md:text-sm py-1 border-b  cursor-pointer"
          key={employee?._id}
          onClick={() => handleClick(employee.fullName)}
        >
          {employee.fullName}
        </li>
      ))}
    </ul>
  );
}
export default React.memo(EmployeesList);
