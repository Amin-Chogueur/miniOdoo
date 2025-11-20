import { ToolMovementType } from "@/types/MovementType";
import axios from "axios";

export async function getAllMovements(): Promise<ToolMovementType[]> {
  try {
    const res = await axios.get("/api/toolMovement");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch movements"
      );
    } else {
      throw new Error("An unknown error occurred while fetching movements");
    }
  }
}

export async function getMovement(id: string): Promise<ToolMovementType> {
  try {
    const res = await axios.get(`/api/toolMovement/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to get movement"
      );
    } else {
      throw new Error("An unknown error occurred while getting movement");
    }
  }
}

export async function addMovement(movement: ToolMovementType) {
  try {
    const res = await axios.post("/api/toolMovement", movement);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      throw new Error(
        error.response?.data?.message || "Failed to add movement"
      );
    } else {
      throw new Error("An unknown error occurred while adding movement");
    }
  }
}

export async function fetchEmployeeByPin(pin: string) {
  try {
    const res = await axios(`/api/employees/by-pin/${pin}`);
    const employeeNameByPin = res.data;
    return employeeNameByPin;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to add movement"
      );
    } else {
      throw new Error("An unknown error occurred while adding movement");
    }
  }
}

export async function updateMovement({
  updatedMovement,
  id,
}: {
  updatedMovement: Partial<ToolMovementType>;
  id: string;
}) {
  try {
    const res = await axios.patch(`/api/toolMovement/${id}`, updatedMovement);
    console.log(res.data);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message || "Failed to update movement"
      );
    } else {
      throw new Error("An unknown error occurred while updating movement");
    }
  }
}

export async function deleteMovements() {
  try {
    const res = await axios.delete("/api/toolMovement");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      throw new Error(
        error.response?.data?.message || "Failed to delete movements"
      );
    } else {
      throw new Error("An unknown error occurred while deleting movements");
    }
  }
}
