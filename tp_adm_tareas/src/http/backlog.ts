import axios from "axios";
import { ITask } from "../types/ITask";

const API_URL = "http://localhost:3000/api/backlog";

interface BacklogTaskResponse {
  _id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  fechaLimite?: string;
  color?: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  success: boolean;
  data: {
    _id: string;
    tareas: BacklogTaskResponse[];
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

export const getBacklogTasks = async (): Promise<ITask[]> => {
  try {
    const response = await axios.get<ApiResponse>(API_URL);
    // La estructura correcta de la respuesta es:
    // { success: true, data: { tareas: [...] } }
    return response.data.data.tareas.map((task: BacklogTaskResponse) => {
      // Asegurarse de que el estado sea uno de los valores permitidos en ITask
      const estadoValido = ['pendiente', 'en-progreso', 'completado'].includes(task.estado) 
        ? task.estado as 'pendiente' | 'en-progreso' | 'completado'
        : 'pendiente';
        
      return {
        id: task._id,
        titulo: task.titulo,
        descripcion: task.descripcion,
        estado: estadoValido,
        fechaLimite: task.fechaLimite ? new Date(task.fechaLimite).toISOString().split('T')[0] : undefined
      };
    });
  } catch (error) {
    console.log(
      "Error al obtener tareas del backlog desde backlog.ts 'getBacklogTasks'.",
      error
    );
    throw error;
  }
};

export const createBacklogTask = async (task: ITask): Promise<ITask> => {
  try {
    // Obtenemos todas las tareas actuales del backlog
    const currentTasks = await getBacklogTasks();
    
    // Aseguramos que la tarea tenga un ID único si no lo tiene
    if (!task.id) {
      task.id = `backlog-${Date.now()}`;
    }
    
    // Creamos un nuevo array con todas las tareas incluyendo la nueva
    const updatedTasks = [...currentTasks, task];
    
    // Enviamos el objeto backlog completo para mantener la estructura
    await axios.put(API_URL, {
      tareas: updatedTasks
    });
    
    return task;
  } catch (error) {
    console.log(
      "Error al crear tarea en el backlog.",
      error
    );
    throw error;
  }
}; 

export const updateBacklogTask = async (task: ITask): Promise<ITask> => {
  try {
    // Obtenemos todas las tareas actuales del backlog
    const currentTasks = await getBacklogTasks();
    
    // Encontramos el índice de la tarea a actualizar
    const taskIndex = currentTasks.findIndex((t: ITask) => t.id === task.id);
    
    if (taskIndex === -1) {
      throw new Error(`Tarea con ID ${task.id} no encontrada en el backlog`);
    }
    
    // Actualizamos la tarea en el array
    currentTasks[taskIndex] = task;
    
    // Enviamos el objeto backlog completo para mantener la estructura
    await axios.put(API_URL, {
      tareas: currentTasks
    });
    
    return task;
  } catch (error) {
    console.log(
      "Error al actualizar tarea en el backlog.",
      error
    );
    throw error;
  }
};

export const deleteBacklogTask = async (taskId: string): Promise<void> => {
  try {
    // Obtenemos todas las tareas actuales del backlog
    const currentTasks = await getBacklogTasks();
    
    // Filtramos para eliminar la tarea con el ID especificado
    const updatedTasks = currentTasks.filter((t: ITask) => t.id !== taskId);
    
    // Enviamos el objeto backlog completo para mantener la estructura
    await axios.put(API_URL, {
      tareas: updatedTasks
    });
  } catch (error) {
    console.log(
      "Error al eliminar tarea en el backlog.",
      error
    );
    throw error;
  }
};

