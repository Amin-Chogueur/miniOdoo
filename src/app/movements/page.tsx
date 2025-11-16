"use client";

import ToolMovementCard from "@/components/movements/Movement";
import { ToolMovementType } from "@/types/MovementType";
import React, { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getAllMovements } from "@/query/movementQuery";
import CustomHeader from "@/components/ui/CustomHeader";
import NoResults from "@/components/ui/NoResults";
import { useReactToPrint } from "react-to-print";
import { useAuth } from "@/hooks/useAuth";

export default function ToolMovements() {
  const { user, isLoading: IsLoadingUserRole } = useAuth();
  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef, // ✅ new API
    documentTitle: `Tool Movement ${new Date().toLocaleDateString()}`,
  });
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

  if (isLoading || IsLoadingUserRole) return <LoadingSpinner />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div
      className=" transition-colors"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      {/* Header */}
      <CustomHeader
        role={user.role}
        position={user.position}
        title="Tools Movement"
        path="/movements/new"
        placeholder="Search for movement ..."
        search={search}
        setSearch={setSearch}
      />
      <div className="pr-3 flex justify-between items-center mb-3 ">
        <label className="flex items-center gap-2 text-sm font-medium p-1">
          <input
            type="checkbox"
            checked={showUnavailableOnly}
            onChange={() => setShowUnavailableOnly((prev) => !prev)}
          />
          Taken only
        </label>
        {filtredToolMovementsList && filtredToolMovementsList?.length > 0 ? (
          <button
            onClick={handlePrint}
            className="hidden md:inline text-sm cursor-pointer bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-white transition-colors"
          >
            <span className="hidden md:inline"> Print</span>
          </button>
        ) : null}
      </div>

      {/* Table */}
      {!isLoading && filtredToolMovementsList?.length === 0 ? (
        <NoResults message="No Movements was found" />
      ) : (
        <div ref={componentRef} className="print-page overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr style={{ borderBottom: `2px solid var(--border)` }}>
                <th className="px-3 py-1 text-left">Actions</th>
                <th className="px-3 py-1 text-left">Tool</th>
                <th className="px-3 py-1 text-left">
                  Qte <br /> Taken
                </th>
                <th className="px-3 py-1 text-left">Storekeeper (Given)</th>
                <th className="px-3 py-1 text-left">Employee</th>
                <th className="px-3 py-1 text-left">Taken At</th>
                <th className="px-3 py-1 text-left">Signature (Take)</th>
                <th className="px-3 py-1 text-left">Returned At</th>
                <th className="px-3 py-1 text-left">
                  Qte <br /> Returned
                </th>
                <th className="px-3 py-1 text-left">Signature (Return)</th>
                <th className="px-3 py-1 text-left">Storekeeper (Receiver)</th>
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
