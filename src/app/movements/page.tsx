"use client";

import ToolMovementCard from "@/components/movements/Movement";
import { ToolMovementType } from "@/types/MovementType";
import React, { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { deleteMovements, getAllMovements } from "@/query/movementQuery";
import CustomHeader from "@/components/ui/CustomHeader";
import NoResults from "@/components/ui/NoResults";
import { useReactToPrint } from "react-to-print";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";
import { FiLoader } from "react-icons/fi";
import { Position } from "@/constants/constants";
import { toast } from "react-toastify";

export default function ToolMovements() {
  const queryClient = useQueryClient();
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

  const deleteMovementsMutation = useMutation({
    mutationFn: deleteMovements,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: ["movements"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-data"] });
    },
    onError: (error) => {
      console.error("Failed to delete  movements", error);
    },
  });

  function handleDeleteReturnedToolMovements() {
    const confirm = window.confirm(
      "Are you sure you want to delete all returned tool movements? "
    );
    if (confirm) {
      deleteMovementsMutation.mutate();
    }
  }

  const hasNotReturnedMovements = React.useMemo(() => {
    return toolMovementsList?.some((movement) => movement.returnedAt !== null);
  }, [toolMovementsList]);
  console.log(hasNotReturnedMovements);
  const filtredToolMovementsList = toolMovementsList?.filter((movement) => {
    const searchText = search.trim().toLowerCase();

    // 1) Unavailable tools only (storekeeperReceiverName is null)
    const isUnavailable = showUnavailableOnly
      ? movement.storekeeperReceiverName === null
      : true;

    // 2) Search filter (match tool OR employee)
    const matchesSearch =
      searchText === "" ||
      movement.toolName?.toLowerCase().includes(searchText) ||
      movement.employeeTakingTool?.toLowerCase().includes(searchText);

    return isUnavailable && matchesSearch;
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

        {user.position === Position.STORE_KEEPER &&
        toolMovementsList &&
        toolMovementsList.length > 0 ? (
          <div className="flex items-center gap-5">
            {hasNotReturnedMovements && (
              <button
                disabled={deleteMovementsMutation.isPending}
                onClick={handleDeleteReturnedToolMovements}
                className="md:flex items-center gap-1 hidden
          text-sm cursor-pointer bg-red-500 hover:bg-red-600 px-3 py-1
          rounded text-white transition-colors disabled:bg-gray-600
          disabled:cursor-not-allowed"
              >
                {deleteMovementsMutation.isPending && (
                  <FiLoader className="animate-spin" />
                )}
                <span className="hidden md:inline">
                  Delete Returned Movements
                </span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="hidden md:inline text-sm cursor-pointer bg-blue-600 
        hover:bg-blue-500 px-3 py-1 rounded text-white transition-colors"
            >
              <span className="hidden md:inline">Print</span>
            </button>
          </div>
        ) : null}
      </div>

      {/* Table */}
      {!isLoading && filtredToolMovementsList?.length === 0 ? (
        <NoResults message="No Movements was found" />
      ) : (
        <div ref={componentRef} className="print-page overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead style={{ border: `2px solid var(--border)` }}>
              <tr
                style={{ borderBottom: `2px solid var(--border)` }}
                className="head bg-white"
              >
                <th className="px-3 py-3 border border-r-black" colSpan={2}>
                  <Image
                    src={"/images/mansourah.png"}
                    width={100}
                    height={60}
                    alt="mansourah"
                    className="mx-auto"
                  />
                </th>
                <th
                  className="px-3 py-1  text-black text-3xl text-center"
                  colSpan={15}
                >
                  Tool Management
                </th>
              </tr>
              <tr style={{ borderBottom: `2px solid var(--border)` }}>
                <th className="px-3 py-1 text-left">Status</th>
                <th className="px-3 py-1 text-left">Tool</th>
                <th className="px-3 py-1 text-left">
                  Qte <br /> Taken
                </th>

                <th className="px-3 py-1 text-left">Employee Taker</th>
                <th className="px-3 py-1 text-left">Storekeeper (Given)</th>
                <th className="px-3 py-1 text-left">Taken At</th>
                <th className="px-3 py-1 text-left">Employee Returner</th>
                <th className="px-3 py-1 text-left">Returned At</th>
                <th className="px-3 py-1 text-left">
                  Qte <br /> Returned
                </th>

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
