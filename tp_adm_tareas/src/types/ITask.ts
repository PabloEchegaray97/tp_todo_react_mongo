export interface ITask {
  id: string;
  titulo: string;
  descripcion: string;
  estado?: 'pendiente' | 'en-progreso' | 'completado';
  fechaLimite?: string;
  color?: string;
}
