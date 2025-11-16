import { getAllEmployees } from "./employeesQuery";
import { getAllMovements } from "./movementQuery";
import { getAllTools } from "./toolQuery";

export async function getDashboardData() {
  const [movements, tools, employees] = await Promise.all([
    getAllMovements(),
    getAllTools(),
    getAllEmployees(),
  ]);

  return {
    movements,
    tools,
    employees,
  };
}
