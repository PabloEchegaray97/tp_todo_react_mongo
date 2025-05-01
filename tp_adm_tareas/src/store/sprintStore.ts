import { create } from 'zustand';
import { ISprint } from '../types/ISprint';
import { ITask } from '../types/ITask';
import { getAllSprints, getSprintById } from '../http/sprint';
import axios from 'axios';

interface SprintState {
  sprints: ISprint[];
  currentSprint: ISprint | null;
  isLoading: boolean;
  error: string | null;
  
  // Acciones
  setSprints: (sprints: ISprint[]) => void;
  setCurrentSprint: (sprint: ISprint | null) => void;
  fetchSprints: () => Promise<void>;
  fetchSprintById: (sprintId: string) => Promise<void>;
  addTask: (sprintId: string, task: Omit<ITask, 'id'>) => Promise<void>;
  updateTask: (sprintId: string, taskId: string, taskData: Partial<ITask>) => Promise<ITask>;
  deleteTask: (sprintId: string, taskId: string) => Promise<void>;
  moveTask: (sprintId: string, taskId: string, newStatus: 'pendiente' | 'en-progreso' | 'completado') => Promise<ITask>;
  moveTaskToBacklog: (sprintId: string, taskId: string) => Promise<void>;
  createSprint: (sprint: Omit<ISprint, 'id'>) => Promise<ISprint>;
  updateSprint: (sprint: ISprint) => Promise<void>;
  deleteSprint: (sprintId: string) => Promise<void>;
}

export const useSprintStore = create<SprintState>((set, get) => ({
  sprints: [],
  currentSprint: null,
  isLoading: false,
  error: null,
  
  setSprints: (sprints) => set({ sprints }),
  
  setCurrentSprint: (sprint) => set({ currentSprint: sprint }),
  
  fetchSprints: async () => {
    set({ isLoading: true, error: null });
    try {
      const sprints = await getAllSprints();
      set({ sprints, isLoading: false });
    } catch (error) {
      console.error('Error al obtener los sprints:', error);
      set({ 
        error: 'No se pudieron cargar los sprints',
        isLoading: false
      });
      throw error;
    }
  },
  
  fetchSprintById: async (sprintId) => {
    set({ isLoading: true, error: null });
    try {
      const sprint = await getSprintById(sprintId);
      set({ currentSprint: sprint, isLoading: false });
    } catch (error) {
      console.error(`Error al obtener el sprint con ID ${sprintId}:`, error);
      set({ 
        error: 'No se pudo cargar el sprint',
        isLoading: false
      });
      throw error;
    }
  },
  
  addTask: async (sprintId, taskData) => {
    set({ isLoading: true, error: null });
    try {
      // Crear la tarea usando la API de tareas de MongoDB
      const taskResponse = await axios.post(`http://localhost:3000/api/tasks`, {
        titulo: taskData.titulo,
        descripcion: taskData.descripcion,
        fechaLimite: taskData.fechaLimite,
        estado: taskData.estado || 'pendiente'
      });
      
      // Obtener el ID de la tarea creada
      const taskId = taskResponse.data.data._id;
      
      // Añadir la tarea al sprint específico utilizando el endpoint de MongoDB
      await axios.put(`http://localhost:3000/api/sprints/${sprintId}/add-task/${taskId}`, {
        accept: 'application/json'
      });
      
      // Recargar el sprint para obtener los datos actualizados
      const sprint = await getSprintById(sprintId);
      
      // Actualizar el estado
      set((state) => ({
        currentSprint: sprint,
        sprints: state.sprints.map(s => 
          s.id === sprintId ? sprint : s
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error al añadir la tarea al sprint:', error);
      set({ 
        error: 'No se pudo añadir la tarea al sprint',
        isLoading: false
      });
      throw error;
    }
  },
  
  updateTask: async (sprintId, taskId, taskData) => {
    set({ isLoading: true, error: null });
    try {
      const { currentSprint } = get();
      if (!currentSprint) throw new Error('No hay sprint seleccionado');
      
      // Encontrar la tarea actual para obtener todos sus datos
      const currentTask = currentSprint.tareas.find(task => task.id === taskId);
      if (!currentTask) throw new Error('Tarea no encontrada');
      
      // Actualizar la tarea directamente usando la API de MongoDB
      const response = await axios.put(`http://localhost:3000/api/tasks/${taskId}`, {
        titulo: taskData.titulo !== undefined ? taskData.titulo : currentTask.titulo,
        descripcion: taskData.descripcion !== undefined ? taskData.descripcion : currentTask.descripcion,
        estado: taskData.estado !== undefined ? taskData.estado : currentTask.estado,
        fechaLimite: taskData.fechaLimite !== undefined ? taskData.fechaLimite : currentTask.fechaLimite
      });
      
      // Obtener la tarea actualizada de la respuesta
      const updatedTaskData = response.data.data;
      
      // Crear un objeto ITask con los datos actualizados
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
      
      // Actualizar la tarea en el estado del sprint
      const updatedTasks = currentSprint.tareas.map((task) => 
        task.id === taskId ? updatedTask : task
      );
      
      // Crear un sprint actualizado
      const updatedSprint = { ...currentSprint, tareas: updatedTasks };
      
      // Actualizar el estado
      set((state) => ({
        currentSprint: updatedSprint,
        sprints: state.sprints.map(s => 
          s.id === sprintId ? updatedSprint : s
        ),
        isLoading: false
      }));
      
      return updatedTask;
    } catch (error) {
      console.error('Error al actualizar la tarea:', error);
      set({ 
        error: 'No se pudo actualizar la tarea',
        isLoading: false
      });
      throw error;
    }
  },
  
  deleteTask: async (sprintId, taskId) => {
    set({ isLoading: true, error: null });
    try {
      const { currentSprint } = get();
      if (!currentSprint) throw new Error('No hay sprint seleccionado');
      
      // Encontrar la tarea en el sprint
      const taskToDelete = currentSprint.tareas.find(task => task.id === taskId);
      if (!taskToDelete) throw new Error('Tarea no encontrada');
      
      // Primero mover la tarea al backlog
      try {
        // Usar el endpoint específico de MongoDB para mover la tarea al backlog
        await axios.put(`http://localhost:3000/api/backlog/add-task/${taskId}`, {
          accept: 'application/json'
        });
        
        // Si se movió correctamente al backlog, ahora actualizamos el estado local
        const updatedTasks = currentSprint.tareas.filter(task => task.id !== taskId);
        const updatedSprint = { ...currentSprint, tareas: updatedTasks };
        
        // Actualizar el estado del sprint en la UI
        set((state) => ({
          currentSprint: updatedSprint,
          sprints: state.sprints.map(s => 
            s.id === sprintId ? updatedSprint : s
          ),
          isLoading: false
        }));
      } catch (error) {
        console.error('Error al mover la tarea al backlog:', error);
        throw new Error('No se pudo mover la tarea al backlog');
      }
    } catch (error) {
      console.error('Error al eliminar la tarea:', error);
      set({ 
        error: 'No se pudo eliminar la tarea',
        isLoading: false
      });
      throw error;
    }
  },
  
  moveTask: async (sprintId, taskId, newStatus) => {
    set({ isLoading: true, error: null });
    try {
      const { currentSprint } = get();
      if (!currentSprint) throw new Error('No hay sprint seleccionado');
      
      // Encontrar la tarea actual para obtener todos sus datos
      const currentTask = currentSprint.tareas.find(task => task.id === taskId);
      if (!currentTask) throw new Error('Tarea no encontrada');
      
      // Actualizar el estado de la tarea usando la API de MongoDB
      const response = await axios.put(`http://localhost:3000/api/tasks/${taskId}`, {
        titulo: currentTask.titulo,
        descripcion: currentTask.descripcion,
        estado: newStatus,
        fechaLimite: currentTask.fechaLimite
      });
      
      // Obtener la tarea actualizada de la respuesta
      const updatedTaskData = response.data.data;
      
      // Crear un objeto ITask con los datos actualizados
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
      
      // Actualizar la tarea en el estado del sprint
      const updatedTasks = currentSprint.tareas.map((task) => 
        task.id === taskId ? updatedTask : task
      );
      
      // Crear un sprint actualizado
      const updatedSprint = { ...currentSprint, tareas: updatedTasks };
      
      // Actualizar el estado
      set((state) => ({
        currentSprint: updatedSprint,
        sprints: state.sprints.map(s => 
          s.id === sprintId ? updatedSprint : s
        ),
        isLoading: false
      }));
      
      return updatedTask;
    } catch (error) {
      console.error('Error al mover la tarea:', error);
      set({ 
        error: 'No se pudo cambiar el estado de la tarea',
        isLoading: false
      });
      throw error;
    }
  },
  
  moveTaskToBacklog: async (sprintId, taskId) => {
    set({ isLoading: true, error: null });
    try {
      const { currentSprint } = get();
      if (!currentSprint) throw new Error('No hay sprint seleccionado');
      
      // Encontrar la tarea que queremos mover al backlog
      const taskToMove = currentSprint.tareas.find(task => task.id === taskId);
      if (!taskToMove) throw new Error('Tarea no encontrada');
      
      // Usar el endpoint específico de MongoDB para mover la tarea al backlog
      await axios.put(`http://localhost:3000/api/backlog/add-task/${taskId}`, {
        accept: 'application/json'
      });
      
      // Eliminar la tarea del sprint en el estado local
      const updatedTasks = currentSprint.tareas.filter(task => task.id !== taskId);
      const updatedSprint = { ...currentSprint, tareas: updatedTasks };
      
      // Actualizar el estado local
      set((state) => ({
        currentSprint: updatedSprint,
        sprints: state.sprints.map(s => 
          s.id === sprintId ? updatedSprint : s
        ),
        isLoading: false
      }));
    } catch (error) {
      console.error('Error al mover la tarea al backlog:', error);
      set({ 
        error: 'No se pudo mover la tarea al backlog',
        isLoading: false
      });
      throw error;
    }
  },

  createSprint: async (sprintData) => {
    set({ isLoading: true, error: null });
    try {
      // Crear el sprint directamente usando la API de MongoDB
      const response = await axios.post('http://localhost:3000/api/sprints', {
        nombre: sprintData.nombre,
        fechaInicio: sprintData.fechaInicio,
        fechaCierre: sprintData.fechaCierre,
        tareas: []
      });
      
      // Construir el objeto sprint con el ID generado por MongoDB
      const createdSprint: ISprint = {
        id: response.data.data._id,
        nombre: response.data.data.nombre,
        fechaInicio: new Date(response.data.data.fechaInicio).toISOString().split('T')[0],
        fechaCierre: new Date(response.data.data.fechaCierre).toISOString().split('T')[0],
        tareas: [],
        color: response.data.data.color
      };
      
      // Actualizar el estado
      set((state) => ({
        sprints: [...state.sprints, createdSprint],
        isLoading: false
      }));
      
      return createdSprint;
    } catch (error) {
      console.error('Error al crear el sprint:', error);
      set({ 
        error: 'No se pudo crear el sprint',
        isLoading: false
      });
      throw error;
    }
  },
  
  updateSprint: async (sprint) => {
    set({ isLoading: true, error: null });
    try {
      // Actualizar el sprint directamente usando la API de MongoDB
      await axios.put(`http://localhost:3000/api/sprints/${sprint.id}`, {
        nombre: sprint.nombre,
        fechaInicio: sprint.fechaInicio,
        fechaCierre: sprint.fechaCierre,
        color: sprint.color
      });
      
      // Actualizar el estado
      set((state) => ({
        sprints: state.sprints.map(s => s.id === sprint.id ? sprint : s),
        currentSprint: state.currentSprint?.id === sprint.id ? sprint : state.currentSprint,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error al guardar el sprint:', error);
      set({ 
        error: 'No se pudo actualizar el sprint',
        isLoading: false
      });
      throw error;
    }
  },

  deleteSprint: async (sprintId) => {
    set({ isLoading: true, error: null });
    try {
      // Eliminar el sprint directamente usando la API de MongoDB
      await axios.delete(`http://localhost:3000/api/sprints/${sprintId}`);
      
      // Actualizar el estado
      set((state) => ({
        sprints: state.sprints.filter(s => s.id !== sprintId),
        currentSprint: state.currentSprint?.id === sprintId ? null : state.currentSprint,
        isLoading: false
      }));
    } catch (error) {
      console.error('Error al eliminar el sprint:', error);
      set({ 
        error: 'No se pudo eliminar el sprint',
        isLoading: false
      });
      throw error;
    }
  }
})); 