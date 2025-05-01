import axios from "axios";

const API_URL = "http://localhost:3000/api/tasks";

/**
 * Elimina una tarea mediante su ID, sin importar si está en el backlog o en un sprint
 * @param taskId ID de la tarea a eliminar
 */
export const deleteTaskById = async (taskId: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${taskId}`);
  } catch (error) {
    console.error(`Error al eliminar la tarea con ID ${taskId}:`, error);
    throw error;
  }
}; 