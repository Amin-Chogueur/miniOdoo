import { EmployeeType } from "@/types/EmployeeType";
import axios from "axios";
import { toast } from "react-toastify";

export async function getAllEmployees(): Promise<EmployeeType[]> {
  try {
    const res = await axios.get("/api/employees");
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch employees"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unknown error occurred while fetching employees");
    }
  }
}

export async function getEmployee(id: string): Promise<EmployeeType> {
  try {
    const res = await axios.get(`/api/employees/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      throw new Error(
        error.response?.data?.message || "Failed to fetch employee"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unknown error occurred while fetching employee");
    }
  }
}

export async function addEmployee(employee: EmployeeType) {
  try {
    const res = await axios.post("/api/employees", employee);
    toast.success(res.data.message); // success toast directly
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.message || "Failed to add employee";
      // 🔥 Throw a new Error with that message
      throw new Error(message);
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
}

export async function updateEmployee({
  updatedEmployee,
  id,
}: {
  updatedEmployee: Partial<EmployeeType>;
  id: string;
}) {
  try {
    const res = await axios.patch(`/api/employees/${id}`, updatedEmployee);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message =
        error.response?.data?.message || "Failed to edit employee";
      // 🔥 Throw a new Error with that message
      throw new Error(message);
    } else {
      throw new Error("Unexpected error occurred");
    }
  }
}

export async function deleteEmployee(id: string): Promise<EmployeeType> {
  try {
    const res = await axios.delete(`/api/employees/${id}`);
    return res.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Axios error:", error.message);
      throw new Error(
        error.response?.data?.message || "Failed to delete employee"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unknown error occurred while deleting employee");
    }
  }
}
