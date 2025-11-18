import React, { useState } from "react";
import { ToolType } from "@/types/ToolType";
import { useQuery } from "@tanstack/react-query";
import { getAllTools } from "@/query/toolQuery";

type ToolListProps = {
  currentTool: string;
  setSearchTool: React.Dispatch<React.SetStateAction<string>>;
  setToolData: React.Dispatch<
    React.SetStateAction<{
      toolName: string;
      toolCode: string;
      employeeTakingTool: string;
      takenQuantity: number;
      takenNote: string;
    }>
  >;
};

function ToolList({ currentTool, setToolData, setSearchTool }: ToolListProps) {
  const [hideList, setHideList] = useState(false);
  const {
    data: tools,
    isLoading,
    error,
  } = useQuery<ToolType[]>({
    queryKey: ["tools"],
    queryFn: getAllTools,
    staleTime: 600000,
  });
  const filteredTools = tools?.filter((tool) =>
    tool.name.toLowerCase().includes(currentTool.toLowerCase())
  );
  function handleClick(tool: ToolType) {
    setToolData((prev) => ({ ...prev, toolName: tool.name }));
    setToolData((prev) => ({ ...prev, toolCode: tool.code }));
    setSearchTool("");
    setHideList(true);
  }
  if (hideList) return;
  if (isLoading) return <p className="p-2">Loading tools...</p>;
  if (filteredTools?.length === 0)
    return <p className="p-1 text-red-500">No tool match your search</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <ul className="space-y-0.5 bg-black p-1">
      {filteredTools?.map((tool) => (
        <li
          className="text-xs md:text-sm border-b py-1 cursor-pointer flex justify-between items-center"
          key={tool.code}
          onClick={() => handleClick(tool)}
        >
          <span>{tool.name}</span>
          <span>Qte:{tool.quantity - (tool.quantityTaken || 0)}</span>
        </li>
      ))}
    </ul>
  );
}
export default React.memo(ToolList);
