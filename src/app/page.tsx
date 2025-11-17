"use client";

import DashBoardCard from "@/components/dashboard/DashBoardCard";
import EmployeesTable from "@/components/dashboard/EmployeesTable";
import RecentMovementsTable from "@/components/dashboard/RecentMovementsTable";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getDashboardData } from "@/query/dashboardQuery";

import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { FaExchangeAlt, FaTools, FaUsers } from "react-icons/fa";

export default function Home() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard-data"],
    queryFn: getDashboardData,
    staleTime: 600_000, // 10 minutes
  });

  const totalEmployees = data?.employees?.length;
  const totalTools = data?.tools?.length;
  const totalMovements = data?.movements?.length;

  const latestEmployees = useMemo(
    () => data?.employees?.slice(0, 3),
    [data?.employees]
  );
  const latestMovements = useMemo(
    () => data?.movements?.slice(0, 5),
    [data?.movements]
  );
  if (isLoading) return <LoadingSpinner />;

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
        <DashBoardCard
          title="Total Employees"
          data={totalEmployees || 0}
          Icon={FaUsers}
          link="/employees"
        />

        <DashBoardCard
          title="  Tools"
          data={totalTools || 0}
          Icon={FaTools}
          link="/tools"
        />

        <DashBoardCard
          title="Total Movements"
          data={totalMovements || 0}
          Icon={FaExchangeAlt}
          link="/movements"
        />
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
