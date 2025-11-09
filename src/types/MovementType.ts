export type ToolMovementType = {
  _id?: string;
  toolName: string;
  toolCode: string;
  takenQuantity: number;
  returnedQuantity?: number;
  employeeName: string;
  employeeSignatureForTake: string | null; // data URL
  employeeSignatureForReturn?: string | null; // data URL
  storekeeperGivenName: string;
  storekeeperReceiverName?: string;
  takenNote?: string | null;
  returnNote?: string | null;
  takenAt: string;
  returnedAt?: string | null;
};
