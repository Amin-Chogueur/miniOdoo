export type ToolMovementType = {
  _id?: string;
  toolName: string;
  employeeName: string;
  employeeSignatureForTake: string | null; // data URL
  employeeSignatureForReturn?: string | null; // data URL
  storekeeperGivenName: string;
  storekeeperReceiverName?: string;
  takenAt: string;
  returnedAt?: string | null;
};
