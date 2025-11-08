import React, { useState } from "react";
import { ToolType } from "@/types/ToolType";
import { useQuery } from "@tanstack/react-query";
import { getAllTools } from "@/query/toolQuery";

type ToolListProps = {
  currentTool: string;
  setTool: (name: string) => void;
};

export default function ToolList({ currentTool, setTool }: ToolListProps) {
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
  function handleClick(name: string) {
    setTool(name);
    setHideList(true);
  }
  if (hideList) return;
  if (isLoading) return <p className="p-2">Loading tools...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;
  return (
    <ul className="space-y-0.5 bg-black p-2">
      {filteredTools?.map((tool) => (
        <li
          className="border-b p-1 cursor-pointer"
          key={tool.code}
          onClick={() => handleClick(tool.name)}
        >
          {tool.name}
        </li>
      ))}
    </ul>
  );
}
