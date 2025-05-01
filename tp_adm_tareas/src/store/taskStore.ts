import { create } from 'zustand';
import { ITask } from '../types/ITask';
import axios from 'axios';

const API_URL = "http://localhost:3000/api";

// Tipo para las tareas que vienen de la API de MongoDB
interface ApiTask {
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

interface TaskState {
  tasks: ITask[];
  activeTask: ITask | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  setTasks: (tasks: ITask[]) => void;
  setActiveTask: (task: ITask | null) => void;
  createTask: (task: Omit<ITask, 'id'>) => Promise<void>;
  updateTask: (task: ITask) => Promise<ITask>;
  deleteTask: (id: string) => Promise<void>;
  fetchTasks: () => Promise<void>;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  activeTask: null,
  isLoading: false,
  error: null,
  
  setTasks: (tasks) => set({ tasks }),
  
  setActiveTask: (task) => set({ activeTask: task }),
  
  createTask: async (taskData) => {
    set({ isLoading: true, error: null });
    try {
      // Crear tarea directamente usando la API de MongoDB
      // El backend automáticamente la agregará al backlog
      const response = await axios.post(`${API_URL}/tasks`, {
        titulo: taskData.titulo,
        descripcion: taskData.descripcion,
        fechaLimite: taskData.fechaLimite,
        estado: taskData.estado || 'pendiente'
      });
      
      // Obtener el ID generado por MongoDB
      const newTask: ITask = {
        ...taskData,
        id: response.data.data._id,
      };
      
      // Actualizar el estado local con la nueva tarea
      set((state) => ({
        tasks: [...state.tasks, newTask],
        isLoading: false
      }));
    } catch (error) {
      console.error('Error al crear tarea:', error);
      set({ 
        error: 'No se pudo crear la tarea',
        isLoading: false
      });
      throw error;
    }
  },
  
  updateTask: async (task) => {
    set({ isLoading: true, error: null });
    try {
      // Actualizar tarea usando la API de MongoDB
      // Enviamos solo los campos relevantes para la actualización
      const response = await axios.put(`${API_URL}/tasks/${task.id}`, {
        titulo: task.titulo,
        descripcion: task.descripcion,
        estado: task.estado,
        fechaLimite: task.fechaLimite
      });
      
      // Usar la respuesta del servidor para actualizar la tarea local
      const updatedTaskData = response.data.data;
      
      const updatedTask: ITask = {
        id: updatedTaskData._id,
        titulo: updatedTaskData.titulo,
        descripcion: updatedTaskData.descripcion,
        estado: updatedTaskData.estado as 'pendiente' | 'en-progreso' | 'completado',
        fechaLimite: updatedTaskData.fechaLimite 
          ? new Date(updatedTaskData.fechaLimite).toISOString().split('T')[0] 
          : undefined,
        color: updatedTaskData.color
      };
      
      set((state) => ({
        tasks: state.tasks.map((t) => (t.id === task.id ? updatedTask : t)),
        isLoading: false
      }));
      
      return updatedTask;
    } catch (error) {
      console.error('Error al actualizar tarea:', error);
      set({ 
        error: 'No se pudo actualizar la tarea',
        isLoading: false
      });
      throw error;
    }
  },
  
  deleteTask: async (id) => {
    set({ isLoading: true, error: null });
    try {
      // Eliminar tarea usando la API de MongoDB
      await axios.delete(`${API_URL}/tasks/${id}`);
      
      set((state) => ({
        tasks: state.tasks.filter((task) => task.id !== id),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      set({ 
        error: 'No se pudo eliminar la tarea',
        isLoading: false
      });
      throw error;
    }
  },
  
  fetchTasks: async () => {
    set({ isLoading: true, error: null });
    try {
      // Obtener tareas del backlog usando la API de MongoDB
      const response = await axios.get(`${API_URL}/backlog`);
      
      // Extraer las tareas de la respuesta, manejando diferentes estructuras posibles
      let apiTasks: ApiTask[] = [];
      
      if (response.data.data && response.data.data.tareas) {
        // Estructura: { data: { tareas: [...] } }
        apiTasks = response.data.data.tareas;
      } else if (response.data.data && Array.isArray(response.data.data)) {
        // Estructura: { data: [...] }
        apiTasks = response.data.data;
      } else if (Array.isArray(response.data)) {
        // Estructura: [...]
        apiTasks = response.data;
      } else {
        console.error('Formato de respuesta no reconocido:', response.data);
        throw new Error('Formato de respuesta del servidor no reconocido');
      }
      
      // Mapear los datos de la API al formato que espera nuestra aplicación
      const tasks = apiTasks.map((task: ApiTask) => ({
        id: task._id,
        titulo: task.titulo,
        descripcion: task.descripcion,
        estado: task.estado as 'pendiente' | 'en-progreso' | 'completado',
        fechaLimite: task.fechaLimite 
          ? new Date(task.fechaLimite).toISOString().split('T')[0] 
          : undefined
      }));
      
      set({ tasks, isLoading: false });
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      set({ 
        error: 'No se pudieron cargar las tareas',
        isLoading: false
      });
      throw error;
    }
  }
})); 