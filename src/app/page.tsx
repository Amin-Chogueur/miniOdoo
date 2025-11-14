"use client";

import DashBoardCard from "@/components/dashboard/DashBoardCard";
import EmployeesTable from "@/components/dashboard/EmployeesTable";
import RecentMovementsTable from "@/components/dashboard/RecentMovementsTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getAllEmployees } from "@/query/employeesQuery";
import { getAllMovements } from "@/query/movementQuery";
import { getAllTools } from "@/query/toolQuery";
import { EmployeeType } from "@/types/EmployeeType";
import { ToolMovementType } from "@/types/MovementType";
import { ToolType } from "@/types/ToolType";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { FaExchangeAlt, FaTools, FaUsers } from "react-icons/fa";

export default function Home() {
  const { data: movements, isLoading: isMovementLoading } = useQuery<
    ToolMovementType[]
  >({
    queryKey: ["movements"],
    queryFn: getAllMovements,
    staleTime: 600000,
  });

  const { data: tools, isLoading: isToolsLoading } = useQuery<ToolType[]>({
    queryKey: ["tools"],
    queryFn: getAllTools,
    staleTime: 600000,
  });

  const { data: employees, isLoading: isEmployeesLoading } = useQuery<
    EmployeeType[]
  >({
    queryKey: ["employees"],
    queryFn: getAllEmployees,
    staleTime: 600000,
  });

  const totalEmployees = employees?.length;
  const totalTools = tools?.length;
  const totalMovements = movements?.length;

  const latestEmployees = useMemo(() => employees?.slice(0, 3), [employees]);
  const latestMovements = useMemo(() => movements?.slice(0, 5), [movements]);
  if (isEmployeesLoading || isMovementLoading || isToolsLoading)
    return <LoadingSpinner />;

  return (
    <div
      className="min-h-screen  pt-6 transition-colors duration-300"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center">Dashboard</h1>

      {/* Cartes de statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {!isEmployeesLoading ? (
          <DashBoardCard
            title="Total Employees"
            data={totalEmployees || 0}
            Icon={FaUsers}
            link="/employees"
          />
        ) : null}
        {!isToolsLoading ? (
          <DashBoardCard
            title="  Tools"
            data={totalTools || 0}
            Icon={FaTools}
            link="/tools"
          />
        ) : null}
        {!isMovementLoading ? (
          <DashBoardCard
            title="Total Movements"
            data={totalMovements || 0}
            Icon={FaExchangeAlt}
            link="/movements"
          />
        ) : null}
      </div>

      {/* Section employés récents */}
      {latestEmployees ? (
        <EmployeesTable latestEmployees={latestEmployees} />
      ) : null}

      {/* Section mouvements récents */}

      {latestMovements ? (
        <RecentMovementsTable latestMovements={latestMovements} />
      ) : null}
    </div>
  );
}
