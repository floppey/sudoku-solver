import { Cell } from "../types";

export const cellHasValue = (cell: Cell): cell is Cell & { value: string } =>
  typeof cell.value === "string" && cell.value.trim() !== "";
