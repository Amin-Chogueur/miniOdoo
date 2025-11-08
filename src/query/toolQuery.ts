import { EmployeeType } from "@/types/EmployeeType";
import { ToolType } from "@/types/ToolType";
import axios from "axios";
import { toast } from "react-toastify";

export async function getAllTools(): Promise<ToolType[]> {
  try {
    const res = await axios.get("/api/tools");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch tools");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unknown error occurred while fetching tools");
    }
  }
}

export async function getTool(id: string): Promise<ToolType> {
  try {
    const res = await axios.get(`/api/tools/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      throw new Error(error.response?.data?.message || "Failed to fetch tool");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unknown error occurred while fetching tool");
    }
  }
}

export async function addTool(tool: ToolType) {
  try {
    const res = await axios.post("/api/tools", tool);
    toast.success(res.data.message); // success toast directly
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to add tool";
      // 🔥 Throw a new Error with that message
      throw new Error(message);
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
}

export async function updateTool({
  updatedTool,
  id,
}: {
  updatedTool: Partial<ToolType>;
  id: string;
}) {
  try {
    const res = await axios.patch(`/api/tools/${id}`, updatedTool);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to edit tool";
      // 🔥 Throw a new Error with that message
      throw new Error(message);
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
}

export async function deleteTool(id: string): Promise<ToolType> {
  try {
    const res = await axios.delete(`/api/tools/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      throw new Error(error.response?.data?.message || "Failed to delete tool");
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unknown error occurred while deleting tool");
    }
  }
}
