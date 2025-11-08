"use client";

import ToolMovementCard from "@/components/movements/Movement";
import { ToolMovementType } from "@/types/MovementType";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getAllMovements } from "@/query/movementQuery";
import CustomHeader from "@/components/ui/CustomHeader";
import NoResults from "@/components/ui/NoResults";

export default function ToolMovements() {
  const [search, setSearch] = useState("");
  const [showUnavailableOnly, setShowUnavailableOnly] = useState(false);
  // 🔹 Use React Query for fetching
  const {
    data: toolMovementsList,
    isLoading,
    error,
  } = useQuery<ToolMovementType[]>({
    queryKey: ["movements"],
    queryFn: getAllMovements,
    staleTime: 600000,
  });
  const filtredToolMovementsList = toolMovementsList?.filter((movement) => {
    const unvailableOnly = showUnavailableOnly
      ? movement.storekeeperReceiverName === null
      : true;
    const searchedMovement =
      search.trim() === ""
        ? true
        : movement.toolName
            ?.toLowerCase()
            .includes(search.trim().toLowerCase());

    return unvailableOnly && searchedMovement;
  });

  if (isLoading) return <LoadingSpinner />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div
      className="min-h-screen transition-colors"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      {/* Header */}
      <CustomHeader
        title="Tool Movement"
        path="/movements/new"
        placeholder="Search for movement ..."
        search={search}
        setSearch={setSearch}
      />
      <label className="flex items-center gap-2 text-sm font-medium  mt-[150px]">
        <input
          type="checkbox"
          checked={showUnavailableOnly}
          onChange={() => setShowUnavailableOnly((prev) => !prev)}
        />
        Unavailable only
      </label>

      {/* Table */}
      {!isLoading && filtredToolMovementsList?.length === 0 ? (
        <NoResults message="No Movements was found" />
      ) : (
        <div className="overflow-x-auto  ">
          <table className="min-w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: `2px solid var(--border)` }}>
                <th className="px-4 py-2 text-left">Actions</th>
                <th className="px-4 py-2 text-left">Tool</th>
                <th className="px-4 py-2 text-left">Storekeeper (Given)</th>
                <th className="px-4 py-2 text-left">Employee</th>
                <th className="px-4 py-2 text-left">Taken At</th>
                <th className="px-4 py-2 text-left">Signature (Take)</th>
                <th className="px-4 py-2 text-left">Returned At</th>
                <th className="px-4 py-2 text-left">Signature (Return)</th>
                <th className="px-4 py-2 text-left">Storekeeper (Receiver)</th>
              </tr>
            </thead>

            <tbody>
              {filtredToolMovementsList?.map((movement: ToolMovementType) => (
                <ToolMovementCard key={movement._id} movement={movement} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
