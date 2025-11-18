export type ToolMovementType = {
  _id?: string;
  toolName: string;
  toolCode: string;
  takenQuantity: number;
  returnedQuantity?: number;
  employeeTakingTool: string | null; // data URL
  employeeReturningTool?: string | null; // data URL
  storekeeperGivenName: string;
  storekeeperReceiverName?: string;
  takenNote?: string | null;
  returnNote?: string | null;
  takenAt: string;
  returnedAt?: string | null;
};
