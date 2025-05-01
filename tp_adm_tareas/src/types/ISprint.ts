import { ITask } from "./ITask";

export interface ISprint {
  id: string;
  nombre: string;
  fechaInicio: string;
  fechaCierre: string;
  tareas: ITask[];
  color?: string;
}
