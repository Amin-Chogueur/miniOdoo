"use client";
import ToolCard from "@/components/Tool";
import CustomHeader from "@/components/ui/CustomHeader";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import NoResults from "@/components/ui/NoResults";
import { getAllTools } from "@/query/toolQuery";
import { ToolType } from "@/types/ToolType";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Tools() {
  const [search, setSearch] = useState("");

  const {
    data: tools,
    isLoading,
    error,
  } = useQuery<ToolType[]>({
    queryKey: ["tools"],
    queryFn: getAllTools,
    staleTime: 600000,
  });
  const filterdTools = tools?.filter(
    (tool) =>
      tool.name.toLowerCase().includes(search.trim().toLowerCase()) ||
      tool.code.toString().includes(search.trim())
  );
  if (isLoading) return <LoadingSpinner />;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  return (
    <div
      className="min-h-screen  transition-colors  mt-[170px]"
      style={{
        backgroundColor: "var(--background)",
        color: "var(--text-primary)",
      }}
    >
      {/* Header */}
      <CustomHeader
        title="Tools List"
        path="/tools/new"
        placeholder="Search for tool ..."
        search={search}
        setSearch={setSearch}
      />

      {!isLoading && tools?.length === 0 ? (
        <NoResults message="No tools was found" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filterdTools?.map((tool) => (
            <ToolCard key={tool.code} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
