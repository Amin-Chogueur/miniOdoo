import React, { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { getAllEmployees } from "@/query/employeesQuery";
import { EmployeeType } from "@/types/EmployeeType";

type EmployeesListProps = {
  currentPerson: string;
  setPerson: (name: string) => void;
};

export default function EmployeesList({
  currentPerson,
  setPerson,
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
    setPerson(name);
    setHideList(true);
  }
  if (hideList) return;
  if (isLoading) return <p className="p-2">Loading employees...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <ul className="space-y-0.5 bg-black p-2">
      {filteredEmployees?.map((employee) => (
        <li
          className="border-b p-1 cursor-pointer"
          key={employee?._id}
          onClick={() => handleClick(employee.fullName)}
        >
          {employee.fullName}
        </li>
      ))}
    </ul>
  );
}
